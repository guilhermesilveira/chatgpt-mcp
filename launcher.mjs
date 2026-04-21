#!/usr/bin/env node
// Long-running launcher. Opens ChatGPT with a persistent profile and
// keeps the browser process alive for reuse by long-running surfaces.

import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { getProfileDir } from './runtime-paths.mjs';

const require = createRequire(import.meta.url);
const { NewBrowser, launchOptions } = require('camoufox');
const { firefox } = require('playwright-core');
const PROFILE_DIR = getProfileDir();
mkdirSync(PROFILE_DIR, { recursive: true });

const VISIBLE = process.argv.includes('--visible') || process.env.CHATGPT_VISIBLE === '1';
const HEADLESS = !VISIBLE;

const launchConfig = {
  headless: HEADLESS,
  data_dir: PROFILE_DIR,
};
const fromOptions = await launchOptions(launchConfig);
const context = await NewBrowser(firefox, HEADLESS, fromOptions, false, false, launchConfig);

if (!context || typeof context.newPage !== 'function' || typeof context.pages !== 'function') {
  throw new Error('camoufox persistent launch did not return a BrowserContext');
}

const page = context.pages()[0] ?? (await context.newPage());
await page.goto('https://chatgpt.com', { waitUntil: 'domcontentloaded' });

await page.addInitScript(() => {
  window.__dumpDOM = async () => {
    const html = document.documentElement.outerHTML;
    try { await navigator.clipboard.writeText(html); } catch {}
    console.log('[dumpDOM] length=', html.length, 'copied to clipboard');
    return html.length;
  };
});

console.error('[launcher] ChatGPT opened.');
console.error('[launcher] Profile:', PROFILE_DIR);
console.error(`[launcher] Mode:    ${HEADLESS ? 'headless' : 'visible'} (use --visible for interactive login)`);
console.error('[launcher] Leave this running while the connector is active. Press Ctrl+C to quit.');

process.on('SIGINT', async () => { try { await context.close(); } catch {} process.exit(0); });
await new Promise(() => {});
