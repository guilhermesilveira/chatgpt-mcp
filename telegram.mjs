import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

export const TELEGRAM_CONFIG_PATH = join(homedir(), '.chatgpt-mcp', 'telegram.json');
const TELEGRAM_TEXT_LIMIT = 4096;
const TELEGRAM_SEND_TIMEOUT_MS = 30_000;

const CONFIG_TEMPLATE = {
  botToken: 'cole-o-token-do-bot-aqui',
  chatId: '-1001234567890',
};

export function initTelegramConfig(configPath = TELEGRAM_CONFIG_PATH) {
  if (existsSync(configPath)) return { created: false, path: configPath };
  mkdirSync(dirname(configPath), { recursive: true });
  writeFileSync(configPath, `${JSON.stringify(CONFIG_TEMPLATE, null, 2)}\n`, {
    mode: 0o600,
    flag: 'wx',
  });
  chmodSync(configPath, 0o600);
  return { created: true, path: configPath };
}

export function loadTelegramConfig(configPath = TELEGRAM_CONFIG_PATH) {
  const envBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const envChatId = process.env.TELEGRAM_CHAT_ID;
  if (envBotToken && envChatId) return validateConfig(envBotToken, envChatId, 'environment');

  if (!existsSync(configPath)) {
    initTelegramConfig(configPath);
    throw new Error(
      `Telegram config created at ${configPath}; fill in botToken and chatId, then run again`,
    );
  }

  let config;
  try {
    config = JSON.parse(readFileSync(configPath, 'utf8'));
  } catch (error) {
    throw new Error(`invalid Telegram config at ${configPath}: ${error.message}`);
  }
  chmodSync(configPath, 0o600);

  const botToken = envBotToken || config.botToken;
  const chatId = envChatId || config.chatId;

  return validateConfig(botToken, chatId, configPath);
}

function validateConfig(botToken, chatId, source, messageThreadId) {
  if (!botToken || botToken === CONFIG_TEMPLATE.botToken) {
    throw new Error(`botToken is not configured in ${source}`);
  }
  if (!chatId || chatId === CONFIG_TEMPLATE.chatId) {
    throw new Error(`chatId is not configured in ${source}`);
  }
  if (!/^\d+:[A-Za-z0-9_-]+$/.test(String(botToken))) {
    throw new Error(`invalid Telegram botToken in ${source}`);
  }
  if (!/^-?\d+$/.test(String(chatId))) throw new Error(`invalid Telegram chatId in ${source}`);
  if (messageThreadId !== undefined
      && (!Number.isSafeInteger(messageThreadId) || messageThreadId < 1)) {
    throw new Error(`invalid Telegram messageThreadId in ${source}`);
  }

  return {
    botToken: String(botToken),
    chatId: String(chatId),
    ...(messageThreadId === undefined ? {} : { messageThreadId }),
  };
}

export function resolveTelegramConfig(overrides, configPath = TELEGRAM_CONFIG_PATH) {
  if (overrides !== undefined && (typeof overrides !== 'object' || overrides === null)) {
    throw new Error('telegram must be an object with botToken, chatId, and/or messageThreadId');
  }

  const hasBotToken = Object.prototype.hasOwnProperty.call(overrides || {}, 'botToken');
  const hasChatId = Object.prototype.hasOwnProperty.call(overrides || {}, 'chatId');
  const overrideBotToken = overrides?.botToken;
  const overrideChatId = overrides?.chatId;
  const messageThreadId = overrides?.messageThreadId;
  if (hasBotToken && hasChatId) {
    return validateConfig(
      overrideBotToken,
      overrideChatId,
      'query telegram options',
      messageThreadId,
    );
  }

  const base = loadTelegramConfig(configPath);
  return validateConfig(
    hasBotToken ? overrideBotToken : base.botToken,
    hasChatId ? overrideChatId : base.chatId,
    'query telegram options',
    messageThreadId,
  );
}

// Split on Unicode code points and prefer a newline/space near the Telegram limit.
export function splitTelegramText(text, limit = TELEGRAM_TEXT_LIMIT) {
  if (!Number.isInteger(limit) || limit < 1) throw new Error('limit must be a positive integer');

  const chars = Array.from(String(text));
  const chunks = [];

  while (chars.length > limit) {
    let splitAt = limit;
    for (let i = limit; i >= Math.floor(limit * 0.75); i--) {
      if (chars[i - 1] === '\n' || chars[i - 1] === ' ') {
        splitAt = i;
        break;
      }
    }
    chunks.push(chars.splice(0, splitAt).join('').trimEnd());
    while (chars[0] === '\n' || chars[0] === ' ') chars.shift();
  }

  if (chars.length || chunks.length === 0) chunks.push(chars.join(''));
  return chunks;
}

async function sendChunk(text, { botToken, chatId, messageThreadId }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TELEGRAM_SEND_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          ...(messageThreadId === undefined ? {} : { message_thread_id: messageThreadId }),
          text,
        }),
        signal: controller.signal,
      },
    );
    const body = await response.json().catch(() => null);
    if (!response.ok || !body?.ok) {
      const detail = body?.description || `HTTP ${response.status}`;
      throw new Error(`Telegram sendMessage failed: ${detail}`);
    }
    return body.result;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Telegram sendMessage timed out after 30 seconds');
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export async function sendTelegramText(text, config = loadTelegramConfig()) {
  if (!String(text).trim()) throw new Error('cannot send an empty Telegram message');
  const chunks = splitTelegramText(text);
  const results = [];
  for (const chunk of chunks) results.push(await sendChunk(chunk, config));
  return results;
}
