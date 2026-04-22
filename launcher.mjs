#!/usr/bin/env node
// Long-running launcher. Opens ChatGPT with a persistent profile and
// exposes a CDP endpoint on 127.0.0.1 so other processes can attach.

import { chromium } from 'patchright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { getCDPFilePath, getProfileDir } from './runtime-paths.mjs';

const PROFILE_DIR = getProfileDir();
const CDP_FILE = getCDPFilePath();
mkdirSync(PROFILE_DIR, { recursive: true });

const CDP_PORT = Number(process.env.CDP_PORT || 9222);
const VISIBLE = process.argv.includes('--visible') || process.env.CHATGPT_VISIBLE === '1';
const chromeArgs = [
  `--remote-debugging-port=${CDP_PORT}`,
  '--remote-debugging-address=127.0.0.1',
];
if (VISIBLE) {
  chromeArgs.unshift('--start-maximized');
} else {
  chromeArgs.push('--window-position=-2000,-2000', '--window-size=1200,900');
}

const context = await chromium.launchPersistentContext(PROFILE_DIR, {
  channel: 'chrome',
  headless: false,
  viewport: null,
  args: chromeArgs,
});
writeFileSync(CDP_FILE, `http://127.0.0.1:${CDP_PORT}\n`);

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
console.error(`[launcher] CDP:     http://127.0.0.1:${CDP_PORT}  (recorded at ${CDP_FILE})`);
console.error('[launcher] Leave this running. Press Ctrl+C to quit.');

process.on('SIGINT', async () => { try { await context.close(); } catch {} process.exit(0); });
await new Promise(() => {});
