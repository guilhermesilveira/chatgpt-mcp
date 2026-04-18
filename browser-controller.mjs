// browser-controller.mjs
// Owns the patchright browser session. One persistent Chromium profile,
// one singleton Page on chatgpt.com. Exposes high-level ops:
//   query(prompt, key?) → { text, key }
//   readLast(key?)      → { text, key }
//   status(key?)        → "ready" | "busy" | "not_logged_in"

import { chromium } from 'patchright';
import { homedir } from 'node:os';
import { mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parsePillText } from './parse-pill.mjs';
export { parsePillText };

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(homedir(), '.chatgpt-mcp');
const PROFILE_DIR = join(DIR, 'profile');
const CDP_FILE = join(DIR, 'cdp');
const SELECTORS = JSON.parse(readFileSync(join(__dirname, 'selectors.json'), 'utf8'));

let _browser = null;
let _context = null;
let _page = null;
let _ownsBrowser = false;

// FIFO mutex: every mutating op goes through here so the controller is
// strictly single-threaded. Reads that don't change page state (status)
// can bypass.
let _chain = Promise.resolve();
function serialize(fn) {
  const next = _chain.then(fn, fn);
  _chain = next.catch(() => {});
  return next;
}

function log(...a) { console.error('[controller]', ...a); }

async function tryConnectCDP() {
  const url = process.env.CHATGPTPRO_CDP
    || (existsSync(CDP_FILE) ? readFileSync(CDP_FILE, 'utf8').trim() : null);
  if (!url) return null;
  try {
    const browser = await chromium.connectOverCDP(url);
    const context = browser.contexts()[0];
    if (!context) return null;
    log('attached via CDP', url);
    return { browser, context, owns: false };
  } catch (e) {
    log('CDP connect failed:', e.message);
    return null;
  }
}

async function launchOwn() {
  mkdirSync(PROFILE_DIR, { recursive: true });
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome',
    headless: false,
    viewport: null,
    args: ['--start-maximized'],
  });
  log('launched own persistent context');
  return { browser: null, context, owns: true };
}

async function pickChatGPTPage(context) {
  for (const p of context.pages()) {
    try { if (p.url().startsWith('https://chatgpt.com')) return p; } catch {}
  }
  const p = await context.newPage();
  await p.goto(SELECTORS.urls.home, { waitUntil: 'domcontentloaded' });
  return p;
}

export async function getPage() {
  if (_page && !_page.isClosed()) return _page;
  const attached = (await tryConnectCDP()) || (await launchOwn());
  _browser = attached.browser;
  _context = attached.context;
  _ownsBrowser = attached.owns;
  _page = await pickChatGPTPage(_context);
  return _page;
}

async function readPillInfo(page) {
  const pill = page.locator(SELECTORS.thinking.pill_trigger);
  if (!(await pill.count())) return parsePillText(null);
  const raw = (await pill.first().innerText()).trim();
  return parsePillText(raw);
}

export async function status() {
  try {
    const page = await getPage();
    const url = page.url();
    if (SELECTORS.urls.login_probe_paths.some(p => url.includes(p))) {
      return { state: 'not_logged_in', model: null, thinking: null };
    }
    const hasInput = await page.locator(SELECTORS.composer.prompt_input).count();
    if (!hasInput) return { state: 'not_logged_in', model: null, thinking: null };
    const generating = await page.locator(SELECTORS.signals.generating).count();
    const state = generating ? 'busy' : 'ready';
    const info = await readPillInfo(page);
    return { state, model: info.model, thinking: info.thinking, pill: info.pill };
  } catch (e) {
    log('status error', e.message);
    return { state: 'not_logged_in', model: null, thinking: null };
  }
}

async function ensureReady(page) {
  // Wait up to 15s for the composer to appear; 90s for generation to clear.
  await page.waitForSelector(SELECTORS.composer.prompt_input, { timeout: 15_000 });
  await page.waitForSelector(SELECTORS.signals.generating, { state: 'detached', timeout: 90_000 }).catch(() => {});
}

async function waitForResponse(page, prevAssistantCount) {
  // 1) wait for a new assistant turn to appear (up to 60s for network/queue)
  await page.waitForFunction(
    ({ sel, prev }) => document.querySelectorAll(sel).length > prev,
    { sel: SELECTORS.conversation.message_assistant, prev: prevAssistantCount },
    { timeout: 60_000 },
  );
  // 2) wait for stop-button to disappear. No timeout — some replies (deep research, long
  // thinking) take an hour. If you need to bail early, kill the process or call stop().
  await page.waitForSelector(SELECTORS.signals.generating, { state: 'detached', timeout: 0 });
  // 3) settle: ensure the final message body exists and a turn-finished marker is present
  await page.waitForSelector(SELECTORS.signals.turn_finished_marker, { timeout: 10_000 }).catch(() => {});
  await page.waitForTimeout(250);
}

async function readLastAssistantText(page) {
  return page.evaluate((sel) => {
    const nodes = document.querySelectorAll(sel);
    if (!nodes.length) return '';
    const el = nodes[nodes.length - 1];
    return (el.innerText || el.textContent || '').trim();
  }, SELECTORS.conversation.message_assistant);
}

async function _queryImpl(prompt, opts = {}) {
    const page = await getPage();
    const s = await status();
    if (s.state === 'not_logged_in') throw new Error('not_logged_in: run `chatgpt-mcp launch` and sign in');
    if (opts.fresh) await _newChatImpl();
    if (opts.model) await _setModelImpl(opts.model);
    if (opts.thinking) await _setThinkingImpl(opts.thinking);
    await ensureReady(page);

    const prevAssistantCount = await page.locator(SELECTORS.conversation.message_assistant).count();

    const input = page.locator(SELECTORS.composer.prompt_input);
    await input.click();
    // ProseMirror accepts typed input; use keyboard insert to be safe with emoji/long text
    await page.keyboard.insertText(prompt);

    // Send: click the send button (appears only when text is present)
    const send = page.locator(SELECTORS.composer.send_button);
    await send.waitFor({ state: 'visible', timeout: 5_000 });
    await send.click();

    await waitForResponse(page, prevAssistantCount);
    const text = await readLastAssistantText(page);
    return { text, key: 'default' };
}
export const query = (prompt, opts) => serialize(() => _queryImpl(prompt, opts));

async function _readLastImpl() {
  const page = await getPage();
  const text = await readLastAssistantText(page);
  return { text, key: 'default' };
}
export const readLast = () => serialize(_readLastImpl);

async function _newChatImpl() {
  const page = await getPage();
  const btn = page.locator(SELECTORS.nav.new_chat_button);
  if (await btn.count()) {
    await btn.first().click();
  } else {
    await page.goto(SELECTORS.urls.home, { waitUntil: 'domcontentloaded' });
  }
  await page.waitForSelector(SELECTORS.composer.prompt_input, { timeout: 15_000 });
  return { key: 'default' };
}
export const newChat = () => serialize(_newChatImpl);

async function _getModelImpl() {
  const page = await getPage();
  const info = await readPillInfo(page);
  return info.model;
}
export const getModel = () => serialize(_getModelImpl);

async function _setModelImpl(name) {
  if (!name) throw new Error('model name required');
  const page = await getPage();
  const dropdown = page.locator(SELECTORS.model.dropdown_button);
  await dropdown.waitFor({ state: 'visible', timeout: 10_000 });
  await dropdown.first().click();

  const menuitemSel = SELECTORS.model._menuitem_role;
  const key = name.toLowerCase().trim();
  const mappedSel = SELECTORS.model.name_map?.[key];

  const tryClick = async (locator, waitMs = 3000) => {
    try {
      await locator.waitFor({ state: 'visible', timeout: waitMs });
      await locator.click();
      return true;
    } catch { return false; }
  };

  // 1. name_map (by data-testid) — preferred: language-independent, stable.
  if (mappedSel) {
    if (await tryClick(page.locator(mappedSel).first(), 3000)) {
      await page.waitForTimeout(250);
      return { model: await _getModelImpl() };
    }
  }

  // 2. Top-level menu, match by visible text.
  if (await tryClick(page.locator(menuitemSel, { hasText: name }).first(), 2000)) {
    await page.waitForTimeout(250);
    return { model: await _getModelImpl() };
  }

  // 3. Submenu path: hover each known trigger, retry.
  for (const t of SELECTORS.model.submenu_trigger_text || []) {
    const trigger = page.locator(menuitemSel, { hasText: t }).first();
    if (!(await trigger.count())) continue;
    await trigger.hover();
    if (await tryClick(page.locator(menuitemSel, { hasText: name }).first(), 1500)) {
      await page.waitForTimeout(250);
      return { model: await _getModelImpl() };
    }
  }

  await page.keyboard.press('Escape').catch(() => {});
  throw new Error(`model "${name}" not found. Known: ${Object.keys(SELECTORS.model.name_map || {}).join(', ')}. Capture the open menu to selectors.json name_map.`);
}
export const setModel = (name) => serialize(() => _setModelImpl(name));

async function _getThinkingImpl() {
  const page = await getPage();
  const info = await readPillInfo(page);
  return info.thinking;
}
export const getThinking = () => serialize(_getThinkingImpl);

async function _setThinkingImpl(level) {
  if (!level) throw new Error('thinking level required');
  const page = await getPage();
  const pill = page.locator(SELECTORS.thinking.pill_trigger);
  if (!(await pill.count())) {
    throw new Error('thinking pill not available — current model does not support thinking levels');
  }
  await pill.first().click();

  const key = level.toLowerCase().trim();
  const menuitemSel = SELECTORS.thinking.menuitem_role;

  const tryClick = async (locator, waitMs = 2000) => {
    try {
      await locator.waitFor({ state: 'visible', timeout: waitMs });
      await locator.click();
      return true;
    } catch { return false; }
  };

  // 1. Icon-href based match (locale-independent).
  const href = SELECTORS.thinking.icon_href?.[key];
  if (href) {
    const byIcon = page.locator(`${menuitemSel}:has(use[href="${href}"])`).first();
    if (await tryClick(byIcon, 2000)) { await page.waitForTimeout(200); return { level: key }; }
  }

  // 2. Text-based match across known locales.
  const texts = SELECTORS.thinking.name_map_text?.[key] || [level];
  for (const t of texts) {
    if (await tryClick(page.locator(menuitemSel, { hasText: t }).first(), 1500)) {
      await page.waitForTimeout(200);
      return { level: key };
    }
  }

  await page.keyboard.press('Escape').catch(() => {});
  throw new Error(`thinking level "${level}" not found. Known: ${Object.keys(SELECTORS.thinking.name_map_text || {}).join(', ')}`);
}
export const setThinking = (level) => serialize(() => _setThinkingImpl(level));

async function _stopImpl() {
  const page = await getPage();
  const btn = page.locator(SELECTORS.composer.stop_button);
  if (await btn.count()) await btn.first().click();
  return { stopped: true };
}
export const stop = () => serialize(_stopImpl);

export async function checkSelectors() {
  const page = await getPage();
  const report = [];
  const walk = async (obj, path) => {
    for (const [k, v] of Object.entries(obj)) {
      if (k.startsWith('_')) continue;
      const p = path ? `${path}.${k}` : k;
      if (typeof v === 'string') {
        if (p.startsWith('urls.') || p === 'model._menuitem_role') continue;
        const n = await page.locator(v).count().catch(() => -1);
        report.push({ path: p, selector: v, count: n });
      } else if (v && typeof v === 'object' && !Array.isArray(v)) {
        await walk(v, p);
      }
    }
  };
  await walk(SELECTORS, '');
  return report;
}

export async function shutdown() {
  try {
    if (_ownsBrowser) await _context?.close();
    else await _browser?.close();  // CDP disconnect; does not kill the launcher's Chrome
  } catch {}
  _browser = null;
  _context = null;
  _page = null;
  _ownsBrowser = false;
}
