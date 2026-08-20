import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  loadTelegramConfig, resolveTelegramConfig, splitTelegramText,
} from '../telegram.mjs';

test('splitTelegramText preserves text within the limit', () => {
  assert.deepEqual(splitTelegramText('hello', 10), ['hello']);
});

test('splitTelegramText prefers whitespace and preserves Unicode code points', () => {
  const input = 'one two three 🤖 four';
  const chunks = splitTelegramText(input, 10);
  assert.deepEqual(chunks, ['one two', 'three 🤖', 'four']);
  assert.ok(chunks.every(chunk => Array.from(chunk).length <= 10));
});

test('loadTelegramConfig creates a private template when missing', () => {
  const dir = mkdtempSync(join(tmpdir(), 'chatgpt-mcp-telegram-'));
  const configPath = join(dir, 'telegram.json');

  assert.throws(() => loadTelegramConfig(configPath), /Telegram config created/);
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  assert.equal(config.botToken, 'cole-o-token-do-bot-aqui');
  assert.equal(statSync(configPath).mode & 0o777, 0o600);
});

test('loadTelegramConfig accepts environment-only configuration', () => {
  const dir = mkdtempSync(join(tmpdir(), 'chatgpt-mcp-telegram-env-'));
  const configPath = join(dir, 'telegram.json');
  const previousToken = process.env.TELEGRAM_BOT_TOKEN;
  const previousChatId = process.env.TELEGRAM_CHAT_ID;

  process.env.TELEGRAM_BOT_TOKEN = '123456:abc_DEF-789';
  process.env.TELEGRAM_CHAT_ID = '-100987654321';
  try {
    assert.deepEqual(loadTelegramConfig(configPath), {
      botToken: '123456:abc_DEF-789',
      chatId: '-100987654321',
    });
    assert.equal(existsSync(configPath), false);
  } finally {
    if (previousToken === undefined) delete process.env.TELEGRAM_BOT_TOKEN;
    else process.env.TELEGRAM_BOT_TOKEN = previousToken;
    if (previousChatId === undefined) delete process.env.TELEGRAM_CHAT_ID;
    else process.env.TELEGRAM_CHAT_ID = previousChatId;
  }
});

test('resolveTelegramConfig accepts complete per-query credentials without a file', () => {
  const configPath = join(tmpdir(), `missing-telegram-${process.pid}-${Date.now()}.json`);
  assert.deepEqual(resolveTelegramConfig({
    botToken: '123456:query_TOKEN',
    chatId: '-100111222333',
  }, configPath), {
    botToken: '123456:query_TOKEN',
    chatId: '-100111222333',
  });
  assert.equal(existsSync(configPath), false);
});

test('resolveTelegramConfig can override only the destination chat', () => {
  const dir = mkdtempSync(join(tmpdir(), 'chatgpt-mcp-telegram-override-'));
  const configPath = join(dir, 'telegram.json');
  writeFileSync(configPath, JSON.stringify({
    botToken: '123456:configured_TOKEN',
    chatId: '-100000000001',
  }), { mode: 0o600 });

  const previousToken = process.env.TELEGRAM_BOT_TOKEN;
  const previousChatId = process.env.TELEGRAM_CHAT_ID;
  delete process.env.TELEGRAM_BOT_TOKEN;
  delete process.env.TELEGRAM_CHAT_ID;
  try {
    assert.deepEqual(resolveTelegramConfig({ chatId: '-100999999999' }, configPath), {
      botToken: '123456:configured_TOKEN',
      chatId: '-100999999999',
    });
  } finally {
    if (previousToken !== undefined) process.env.TELEGRAM_BOT_TOKEN = previousToken;
    if (previousChatId !== undefined) process.env.TELEGRAM_CHAT_ID = previousChatId;
  }
});
