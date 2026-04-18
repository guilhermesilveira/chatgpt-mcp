#!/usr/bin/env node
// Long-running launcher. Opens ChatGPT with a persistent profile and
// exposes a CDP endpoint on 127.0.0.1 so other processes (MCP server,
// CLI, scripts) can attach to the same session concurrently.

import { chromium } from 'patchright';
import { homedir } from 'node:os';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = join(homedir(), '.chatgpt-mcp');
const PROFILE_DIR = join(DIR, 'profile');
const CDP_FILE = join(DIR, 'cdp');
mkdirSync(PROFILE_DIR, { recursive: true });

const CDP_PORT = Number(process.env.CDP_PORT || 9222);

const context = await chromium.launchPersistentContext(PROFILE_DIR, {
  channel: 'chrome',
  headless: false,
  viewport: null,
  args: [
    '--start-maximized',
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-debugging-address=127.0.0.1',
  ],
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
