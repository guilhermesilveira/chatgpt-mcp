#!/usr/bin/env node
// Optional localhost HTTP wrapper. Bearer token auth.
//   GET  /status                → { status: "ready"|"busy"|"not_logged_in" }
//   POST /query   { prompt }    → { text }
//   GET  /last                  → { text }
// Token: <CHATGPT_MCP_HOME>/token (or ~/.chatgpt-mcp/token by default).

import http from 'node:http';
import { randomBytes } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync, chmodSync } from 'node:fs';
import {
  readLast, status, newChat, setModel, getModel,
  setThinking, getThinking, stop,
} from './browser-controller.mjs';
import { query as queuedQuery } from './mailbox.mjs';
import { getHome, getTokenPath } from './runtime-paths.mjs';

const DIR = getHome();
const TOKEN_PATH = getTokenPath();
mkdirSync(DIR, { recursive: true });

function loadOrCreateToken() {
  if (existsSync(TOKEN_PATH)) return readFileSync(TOKEN_PATH, 'utf8').trim();
  const tok = randomBytes(24).toString('hex');
  writeFileSync(TOKEN_PATH, tok + '\n', { mode: 0o600 });
  chmodSync(TOKEN_PATH, 0o600);
  return tok;
}
const TOKEN = loadOrCreateToken();
const PORT = Number(process.env.PORT || 8765);
const HOST = '127.0.0.1';

function send(res, code, obj) {
  res.writeHead(code, { 'content-type': 'application/json' });
  res.end(JSON.stringify(obj));
}

async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const s = Buffer.concat(chunks).toString('utf8');
  return s ? JSON.parse(s) : {};
}

const server = http.createServer(async (req, res) => {
  const auth = req.headers.authorization || '';
  if (auth !== `Bearer ${TOKEN}`) return send(res, 401, { error: 'unauthorized' });
  try {
    if (req.method === 'GET' && req.url === '/status') {
      return send(res, 200, await status());
    }
    if (req.method === 'GET' && req.url === '/last') {
      const { text } = await readLast();
      return send(res, 200, { text });
    }
    if (req.method === 'POST' && req.url === '/query') {
      const { prompt, fresh, model, thinking } = await readBody(req);
      if (!prompt) return send(res, 400, { error: 'prompt required' });
      const { text } = await queuedQuery(prompt, { fresh, model, thinking });
      return send(res, 200, { text });
    }
    if (req.method === 'GET' && req.url === '/thinking') {
      return send(res, 200, { level: await getThinking() });
    }
    if (req.method === 'POST' && req.url === '/thinking') {
      const { level } = await readBody(req);
      if (!level) return send(res, 400, { error: 'level required' });
      const { level: l } = await setThinking(level);
      return send(res, 200, { level: l });
    }
    if (req.method === 'POST' && req.url === '/new') {
      await newChat();
      return send(res, 200, { ok: true });
    }
    if (req.method === 'POST' && req.url === '/stop') {
      await stop();
      return send(res, 200, { ok: true });
    }
    if (req.method === 'GET' && req.url === '/model') {
      return send(res, 200, { model: await getModel() });
    }
    if (req.method === 'POST' && req.url === '/model') {
      const { name } = await readBody(req);
      if (!name) return send(res, 400, { error: 'name required' });
      const { model } = await setModel(name);
      return send(res, 200, { model });
    }
    return send(res, 404, { error: 'not found' });
  } catch (e) {
    return send(res, 500, { error: String(e.message || e) });
  }
});

// ChatGPT generations can take up to an hour. Disable Node's per-request timeout
// (default 5 min) so /query doesn't get cut off mid-response.
server.requestTimeout = 0;
server.headersTimeout = 0;
server.keepAliveTimeout = 0;

server.listen(PORT, HOST, () => {
  console.error(`[http] listening on http://${HOST}:${PORT}`);
  console.error(`[http] token file: ${TOKEN_PATH}`);
});
