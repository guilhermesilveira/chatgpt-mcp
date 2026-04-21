// browser-controller.mjs
// Owns the Camoufox browser session.
// Legacy sync usage: one singleton page + serialized mutating operations.
// Async mailbox usage: ephemeral request tabs created in the shared context.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parsePillText } from './parse-pill.mjs';
import { getImagesDir, getProfileDir } from './runtime-paths.mjs';
export { parsePillText };

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { NewBrowser, launchOptions } = require('camoufox');
const { firefox } = require('playwright-core');

const IMAGE_ROOT_DIR = getImagesDir();
const IMAGE_GENERATION_TIMEOUT_MS = 180_000;
const SELECTORS = JSON.parse(readFileSync(join(__dirname, 'selectors.json'), 'utf8'));

const TAB_MARK_ACTIVE = 'chatgpt-mcp-active:';
const TAB_MARK_ERROR = 'chatgpt-mcp-error:';

let _browser = null;
let _context = null;
let _page = null;
let _ownsBrowser = false;
const _ownedEphemeralTabs = new Map();

function isContextClosedError(error) {
  return /target page, context or browser has been closed/i.test(String(error?.message || error || ''));
}

function resetSessionHandles() {
  _browser = null;
  _context = null;
  _page = null;
  _ownsBrowser = false;
  _ownedEphemeralTabs.clear();
}

function isContextUsable() {
  if (!_context) return false;
  if (_browser && typeof _browser.isConnected === 'function' && !_browser.isConnected()) return false;
  try {
    _context.pages();
    return true;
  } catch {
    return false;
  }
}

// FIFO mutex for legacy singleton-page mutations.
let _chain = Promise.resolve();
function serialize(fn) {
  const next = _chain.then(fn, fn);
  _chain = next.catch(() => {});
  return next;
}

// Narrow mutex only around context.newPage().
let _newPageChain = Promise.resolve();
function serializePageCreate(fn) {
  const next = _newPageChain.then(fn, fn);
  _newPageChain = next.catch(() => {});
  return next;
}

function log(...a) { console.error('[controller]', ...a); }

function isChatGPTUrl(url) {
  return typeof url === 'string' && url.startsWith('https://chatgpt.com');
}

function isAttachOnlyMode() {
  return process.env.CHATGPT_MCP_ATTACH_ONLY === '1';
}

async function launchOwn() {
  const profileDir = getProfileDir();
  mkdirSync(profileDir, { recursive: true });
  const headless = process.env.CHATGPT_HEADLESS === '1';
  const launchConfig = {
    headless,
    data_dir: profileDir,
  };

  const fromOptions = await launchOptions(launchConfig);
  const context = await NewBrowser(firefox, headless, fromOptions, false, false, launchConfig);
  if (!context || typeof context.newPage !== 'function' || typeof context.pages !== 'function') {
    throw new Error('camoufox persistent launch did not return a BrowserContext');
  }

  log(`launched own Camoufox persistent context (${headless ? 'headless' : 'headed'})`);
  return { browser: context.browser?.() || null, context, owns: true };
}

async function getContext() {
  if (isContextUsable()) return _context;
  resetSessionHandles();

  if (isAttachOnlyMode()) {
    throw new Error('no_shared_browser_owner: launch the browser owner first (`exocortex-chatgpt launch`)');
  }

  const launched = await launchOwn();
  _browser = launched.browser;
  _context = launched.context;
  _ownsBrowser = launched.owns;
  return _context;
}

async function pickChatGPTPage(context) {
  for (const p of context.pages()) {
    try {
      if (isChatGPTUrl(p.url())) return p;
    } catch {}
  }

  const p = await context.newPage();
  await p.goto(SELECTORS.urls.home, { waitUntil: 'domcontentloaded' });
  return p;
}

export async function getPage() {
  if (_page && !_page.isClosed() && isContextUsable()) return _page;
  const context = await getContext();
  _page = await pickChatGPTPage(context);
  return _page;
}

async function setTabMarker(page, marker) {
  await page.evaluate((value) => { window.name = value; }, marker).catch(() => {});
}

async function getTabMarker(page) {
  try {
    return await page.evaluate(() => String(window.name || ''));
  } catch {
    return '';
  }
}

export async function createEphemeralChatPage(requestId) {
  let lastError = null;
  let page = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const context = await getContext();
      page = await serializePageCreate(async () => {
        const p = await context.newPage();
        await p.goto(SELECTORS.urls.home, { waitUntil: 'domcontentloaded' });
        return p;
      });
      break;
    } catch (error) {
      lastError = error;
      if (!isContextClosedError(error) || attempt === 1) throw error;
      resetSessionHandles();
    }
  }
  if (!page && lastError) throw lastError;

  _ownedEphemeralTabs.set(page, {
    requestId: String(requestId || ''),
    marker: `${TAB_MARK_ACTIVE}${requestId || ''}`,
  });
  await setTabMarker(page, `${TAB_MARK_ACTIVE}${requestId || ''}`);
  return page;
}

export async function markEphemeralTabError(page, requestId) {
  if (!page || page.isClosed()) return;

  const rid = String(requestId || _ownedEphemeralTabs.get(page)?.requestId || '');
  _ownedEphemeralTabs.set(page, { requestId: rid, marker: `${TAB_MARK_ERROR}${rid}` });
  await setTabMarker(page, `${TAB_MARK_ERROR}${rid}`);
}

export async function closeEphemeralPage(page) {
  if (!page) return;
  _ownedEphemeralTabs.delete(page);
  try {
    if (!page.isClosed()) await page.close();
  } catch {}
}

export async function closeOwnedEphemeralPages(opts = {}) {
  const includeErrors = opts.includeErrors ?? false;
  const pages = [..._ownedEphemeralTabs.entries()]
    .filter(([, meta]) => includeErrors || !String(meta?.marker || '').startsWith(TAB_MARK_ERROR))
    .map(([page]) => page);

  for (const page of pages) {
    await closeEphemeralPage(page);
  }
}

export async function cleanupEphemeralTabs(opts = {}) {
  const includeErrors = opts.includeErrors ?? false;
  const includeUnmarked = opts.includeUnmarked ?? false;

  const context = await getContext();
  let closed = 0;

  for (const page of context.pages()) {
    try {
      if (page === _page) continue;
      if (page.isClosed()) continue;
      if (!isChatGPTUrl(page.url())) continue;

      const marker = await getTabMarker(page);
      const isActive = marker.startsWith(TAB_MARK_ACTIVE);
      const isError = marker.startsWith(TAB_MARK_ERROR);
      const isMarked = isActive || isError;

      const shouldClose = isActive
        || (isError && includeErrors)
        || (!isMarked && includeUnmarked);

      if (!shouldClose) continue;

      _ownedEphemeralTabs.delete(page);
      await page.close();
      closed += 1;
    } catch {}
  }

  return { closed };
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
  } catch (error) {
    log('status error', error.message);
    return { state: 'not_logged_in', model: null, thinking: null };
  }
}

async function ensureReady(page) {
  await page.waitForSelector(SELECTORS.composer.prompt_input, { timeout: 15_000 });
  await page.waitForSelector(SELECTORS.signals.generating, { state: 'detached', timeout: 90_000 }).catch(() => {});
}

async function waitForResponse(page, prevAssistantCount, opts = {}) {
  const assistantTimeoutMs = opts.assistantTimeoutMs ?? 60_000;
  const generatingTimeoutMs = opts.generatingTimeoutMs ?? 0;

  await page.waitForFunction(
    ({ sel, prev }) => document.querySelectorAll(sel).length > prev,
    { sel: SELECTORS.conversation.message_assistant, prev: prevAssistantCount },
    { timeout: assistantTimeoutMs },
  );

  await page.waitForSelector(SELECTORS.signals.generating, { state: 'detached', timeout: generatingTimeoutMs });
  await page.waitForSelector(SELECTORS.signals.turn_finished_marker, { timeout: 10_000 }).catch(() => {});
  await page.waitForTimeout(250);
}

async function readLastAssistantPayload(page) {
  return page.evaluate((sel) => {
    const nodes = document.querySelectorAll(sel);
    if (!nodes.length) return { text: '', images: [] };
    const el = nodes[nodes.length - 1];
    const text = (el.innerText || el.textContent || '').trim();
    const images = Array.from(el.querySelectorAll('img, source[srcset]'))
      .map((node) => {
        if (node.tagName.toLowerCase() === 'source') {
          const srcset = node.getAttribute('srcset') || '';
          const first = srcset.split(',')[0] || '';
          return first.trim().split(/\s+/)[0] || '';
        }
        const img = /** @type {HTMLImageElement} */ (node);
        return img.currentSrc || img.src || '';
      })
      .filter((src) => src && !src.startsWith('data:'));
    return { text, images };
  }, SELECTORS.conversation.message_assistant);
}

async function readLastAssistantText(page) {
  const { text } = await readLastAssistantPayload(page);
  return text;
}

function slugifyPrompt(prompt) {
  const slug = prompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48);
  return slug || 'image';
}

function formatTimestamp(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function resolveOutputDir(prompt, outputDir) {
  if (outputDir) {
    const dir = isAbsolute(outputDir) ? outputDir : resolve(process.cwd(), outputDir);
    mkdirSync(dir, { recursive: true });
    return dir;
  }
  const dir = join(IMAGE_ROOT_DIR, `${formatTimestamp(new Date())}-${slugifyPrompt(prompt)}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

function inferImageExtension(url, contentType) {
  const normalizedType = String(contentType || '').toLowerCase();
  if (normalizedType.includes('image/png')) return '.png';
  if (normalizedType.includes('image/jpeg') || normalizedType.includes('image/jpg')) return '.jpg';
  if (normalizedType.includes('image/webp')) return '.webp';
  if (normalizedType.includes('image/gif')) return '.gif';
  if (normalizedType.includes('image/avif')) return '.avif';

  const safeUrl = (() => {
    try { return new URL(url).pathname; } catch { return ''; }
  })();
  const base = basename(safeUrl || '').toLowerCase();
  const ext = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif'].find((candidate) => base.endsWith(candidate));
  if (ext === '.jpeg') return '.jpg';
  return ext || '.png';
}

function isLikelyGeneratedImageUrl(rawUrl) {
  if (!rawUrl) return false;
  if (rawUrl.startsWith('blob:')) return true;

  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return false;
  }

  const host = parsed.hostname.toLowerCase();
  if (host.includes('oaiusercontent.com') || host.includes('oaistatic.com')) return true;
  if (host === 'chatgpt.com' && parsed.pathname.includes('/backend-api/estuary/content')) {
    const id = parsed.searchParams.get('id') || '';
    return id.startsWith('file-') || id.startsWith('file_');
  }
  return false;
}

function normalizeToCandidates(rawUrls, baseUrl, source) {
  const candidates = [];
  const seen = new Set();

  for (const rawUrl of rawUrls) {
    if (!rawUrl) continue;
    const url = rawUrl.startsWith('blob:')
      ? rawUrl
      : (() => {
          try { return new URL(rawUrl, baseUrl).toString(); } catch { return ''; }
        })();
    if (!url || !isLikelyGeneratedImageUrl(url)) continue;
    if (seen.has(url)) continue;
    seen.add(url);
    candidates.push({ key: url, url, source });
  }

  return candidates;
}

async function collectAssistantImageCandidates(page) {
  const { images } = await readLastAssistantPayload(page);
  return normalizeToCandidates(images, page.url(), 'assistant');
}

async function collectPageImageCandidates(page) {
  const rawUrls = await page.evaluate(() => {
    const urls = [];
    for (const node of document.querySelectorAll('img, source[srcset]')) {
      if (node.tagName.toLowerCase() === 'source') {
        const srcset = node.getAttribute('srcset') || '';
        const first = srcset.split(',')[0] || '';
        const src = first.trim().split(/\s+/)[0] || '';
        if (src) urls.push(src);
        continue;
      }
      const img = /** @type {HTMLImageElement} */ (node);
      const src = img.currentSrc || img.src || '';
      if (src) urls.push(src);
    }
    return urls;
  });
  return normalizeToCandidates(rawUrls, page.url(), 'page');
}

async function collectSeenImageKeys(page) {
  const assistant = await collectAssistantImageCandidates(page);
  const allPage = await collectPageImageCandidates(page);
  return new Set([...assistant, ...allPage].map((candidate) => candidate.key));
}

async function waitForNewImageCandidates(page, seenKeys, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const assistant = await collectAssistantImageCandidates(page);
    const freshAssistant = assistant.filter((candidate) => !seenKeys.has(candidate.key));
    if (freshAssistant.length) return freshAssistant;

    const allPage = await collectPageImageCandidates(page);
    const freshPage = allPage.filter((candidate) => !seenKeys.has(candidate.key));
    if (freshPage.length) return freshPage;

    await page.waitForTimeout(1000);
  }
  return [];
}

async function readBlobImageFromPage(page, blobUrl) {
  const payload = await page.evaluate(async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return { ok: false, error: `blob fetch failed: ${response.status}` };
      }
      const blob = await response.blob();
      const bytes = new Uint8Array(await blob.arrayBuffer());
      let binary = '';
      const chunkSize = 0x8000;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
      }
      return {
        ok: true,
        base64: btoa(binary),
        contentType: blob.type || response.headers.get('content-type') || '',
      };
    } catch (error) {
      return { ok: false, error: String(error) };
    }
  }, blobUrl);

  if (!payload?.ok || !payload.base64) {
    throw new Error(payload?.error || `failed to read blob url: ${blobUrl}`);
  }
  return {
    buffer: Buffer.from(payload.base64, 'base64'),
    contentType: payload.contentType || '',
  };
}

async function downloadImages(page, candidates, outputDir) {
  const request = page.context().request;
  const uniqueCandidates = [];
  const seen = new Set();
  for (const candidate of candidates) {
    if (!seen.has(candidate.key)) {
      seen.add(candidate.key);
      uniqueCandidates.push(candidate);
    }
  }
  const files = [];

  for (const [index, candidate] of uniqueCandidates.entries()) {
    let buffer;
    let contentType = '';

    if (candidate.url.startsWith('blob:')) {
      const blob = await readBlobImageFromPage(page, candidate.url);
      buffer = blob.buffer;
      contentType = blob.contentType;
    } else {
      const response = await request.get(candidate.url, { timeout: 30_000 });
      if (!response.ok()) {
        throw new Error(`failed to download image ${index + 1}: ${response.status()} ${response.statusText()} (${candidate.url})`);
      }
      buffer = await response.body();
      contentType = response.headers()['content-type'] || '';
    }

    const ext = inferImageExtension(candidate.url, contentType);
    const file = join(outputDir, `${String(index + 1).padStart(2, '0')}${ext}`);
    writeFileSync(file, buffer);
    files.push(file);
  }

  return files;
}

async function sendPrompt(page, prompt) {
  if (typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error('prompt required');
  }

  await ensureReady(page);
  const prevAssistantCount = await page.locator(SELECTORS.conversation.message_assistant).count();

  const input = page.locator(SELECTORS.composer.prompt_input);
  await input.click();
  await page.keyboard.insertText(prompt);

  const send = page.locator(SELECTORS.composer.send_button);
  await send.waitFor({ state: 'visible', timeout: 5_000 });
  await send.click();

  return prevAssistantCount;
}

async function sendPromptAndWait(page, prompt, opts = {}) {
  const prevAssistantCount = await sendPrompt(page, prompt);
  await waitForResponse(page, prevAssistantCount, opts);
}

function notLoggedInError() {
  return new Error('not_logged_in: run `exocortex-chatgpt launch` and sign in');
}

async function assertPromptCapablePage(page) {
  const url = page.url();
  if (SELECTORS.urls.login_probe_paths.some(p => url.includes(p))) {
    throw notLoggedInError();
  }

  const hasInput = await page.locator(SELECTORS.composer.prompt_input).count();
  if (!hasInput) {
    throw notLoggedInError();
  }
}

async function newChatOnPage(page) {
  const btn = page.locator(SELECTORS.nav.new_chat_button);
  if (await btn.count()) {
    try {
      await btn.first().click({ timeout: 10_000 });
    } catch {
      await btn.first().evaluate((el) => el.click());
    }
  } else {
    await page.goto(SELECTORS.urls.home, { waitUntil: 'domcontentloaded' });
  }

  await page.waitForSelector(SELECTORS.composer.prompt_input, { timeout: 15_000 });
}

async function setModelOnPage(page, name) {
  if (!name) throw new Error('model name required');

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
    } catch {
      return false;
    }
  };

  if (mappedSel) {
    if (await tryClick(page.locator(mappedSel).first(), 3000)) {
      await page.waitForTimeout(250);
      const info = await readPillInfo(page);
      return { model: info.model };
    }
  }

  if (await tryClick(page.locator(menuitemSel, { hasText: name }).first(), 2000)) {
    await page.waitForTimeout(250);
    const info = await readPillInfo(page);
    return { model: info.model };
  }

  for (const triggerText of SELECTORS.model.submenu_trigger_text || []) {
    const trigger = page.locator(menuitemSel, { hasText: triggerText }).first();
    if (!(await trigger.count())) continue;

    await trigger.hover();
    if (await tryClick(page.locator(menuitemSel, { hasText: name }).first(), 1500)) {
      await page.waitForTimeout(250);
      const info = await readPillInfo(page);
      return { model: info.model };
    }
  }

  await page.keyboard.press('Escape').catch(() => {});
  throw new Error(`model "${name}" not found. Known: ${Object.keys(SELECTORS.model.name_map || {}).join(', ')}`);
}

async function setThinkingOnPage(page, level) {
  if (!level) throw new Error('thinking level required');

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
    } catch {
      return false;
    }
  };

  const href = SELECTORS.thinking.icon_href?.[key];
  if (href) {
    const byIcon = page.locator(`${menuitemSel}:has(use[href="${href}"])`).first();
    if (await tryClick(byIcon, 2000)) {
      await page.waitForTimeout(200);
      return { level: key };
    }
  }

  const texts = SELECTORS.thinking.name_map_text?.[key] || [level];
  for (const text of texts) {
    if (await tryClick(page.locator(menuitemSel, { hasText: text }).first(), 1500)) {
      await page.waitForTimeout(200);
      return { level: key };
    }
  }

  await page.keyboard.press('Escape').catch(() => {});
  throw new Error(`thinking level "${level}" not found. Known: ${Object.keys(SELECTORS.thinking.name_map_text || {}).join(', ')}`);
}

async function queryOnPage(page, prompt, opts = {}) {
  await assertPromptCapablePage(page);

  if (opts.fresh) await newChatOnPage(page);
  if (opts.model) await setModelOnPage(page, opts.model);
  if (opts.thinking) await setThinkingOnPage(page, opts.thinking);

  await sendPromptAndWait(page, prompt, { generatingTimeoutMs: 0 });
  const text = await readLastAssistantText(page);
  return { text, files: [], key: 'default' };
}

async function generateImageOnPage(page, prompt, opts = {}) {
  await assertPromptCapablePage(page);

  if (opts.fresh) await newChatOnPage(page);
  if (opts.model) await setModelOnPage(page, opts.model);
  if (opts.thinking) await setThinkingOnPage(page, opts.thinking);

  const seenKeys = await collectSeenImageKeys(page);
  const prevAssistantCount = await sendPrompt(page, prompt);
  const newCandidates = await waitForNewImageCandidates(page, seenKeys, opts.timeoutMs ?? IMAGE_GENERATION_TIMEOUT_MS);

  // Best effort: gather text if an assistant turn exists, but don't fail image flow if it doesn't.
  await waitForResponse(page, prevAssistantCount, {
    assistantTimeoutMs: 10_000,
    generatingTimeoutMs: 10_000,
  }).catch(() => {});
  const payload = await readLastAssistantPayload(page);

  if (!newCandidates.length) {
    return { files: [], text: payload.text, key: 'default' };
  }

  const outputDir = resolveOutputDir(prompt, opts.output_dir || opts.outputDir);
  const files = await downloadImages(page, newCandidates, outputDir);
  return { files, text: payload.text, key: 'default' };
}

export async function queryInPage(page, prompt, opts = {}) {
  if ((opts.mode || 'text') === 'image') {
    return generateImageOnPage(page, prompt, opts);
  }
  return queryOnPage(page, prompt, opts);
}

async function _queryImpl(prompt, opts = {}) {
  const page = await getPage();
  return queryOnPage(page, prompt, opts);
}
export const query = (prompt, opts) => serialize(() => _queryImpl(prompt, opts));

async function _generateImageImpl(prompt, opts = {}) {
  const page = await getPage();
  return generateImageOnPage(page, prompt, opts);
}
export const generateImage = (prompt, opts) => serialize(() => _generateImageImpl(prompt, opts));

async function _readLastImpl() {
  const page = await getPage();
  const text = await readLastAssistantText(page);
  return { text, key: 'default' };
}
export const readLast = () => serialize(_readLastImpl);

async function _newChatImpl() {
  const page = await getPage();
  await newChatOnPage(page);
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
  const page = await getPage();
  return setModelOnPage(page, name);
}
export const setModel = (name) => serialize(() => _setModelImpl(name));

async function _getThinkingImpl() {
  const page = await getPage();
  const info = await readPillInfo(page);
  return info.thinking;
}
export const getThinking = () => serialize(_getThinkingImpl);

async function _setThinkingImpl(level) {
  const page = await getPage();
  return setThinkingOnPage(page, level);
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
    await closeOwnedEphemeralPages({ includeErrors: false });
    if (_ownsBrowser) await _context?.close();
    else await _browser?.close();
  } catch {}
  resetSessionHandles();
}
