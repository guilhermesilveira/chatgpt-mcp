import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, open, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, extname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = join(__dirname, 'cli.mjs');
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47]);

function baseDir() { return process.env.CHATGPT_MCP_HOME || join(homedir(), '.chatgpt-mcp'); }
function requestsDir() { return join(baseDir(), 'requests'); }
function responsesDir() { return join(baseDir(), 'responses'); }
function imagesDir() { return join(baseDir(), 'images'); }
function daemonPidPath() { return join(baseDir(), 'daemon.pid'); }
function defaultNotifyScriptPath() { return join(homedir(), '.clawd', 'bin', 'send-to-agent.sh'); }

function nowIso() {
  return new Date().toISOString();
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function toEpochMs(value) {
  if (!value) return null;
  const t = Date.parse(value);
  return Number.isNaN(t) ? null : t;
}

function elapsedMs(createdAt, finishedAt = null) {
  const start = toEpochMs(createdAt);
  if (!start) return 0;
  const end = toEpochMs(finishedAt) ?? Date.now();
  return Math.max(0, end - start);
}

export function normalizeAgent(agent) {
  const raw = String(agent ?? 'default').trim();
  const safe = raw.replace(/[^A-Za-z0-9_-]/g, '_');
  return safe || 'default';
}

function normalizeMode(mode) {
  const raw = String(mode ?? 'text').trim().toLowerCase();
  return raw === 'image' ? 'image' : 'text';
}

export function makeRequestId(agent = 'default') {
  const ts = Date.now();
  const random4 = randomBytes(2).toString('hex');
  const safeAgent = normalizeAgent(agent);
  return `${ts}-${random4}-${safeAgent}`;
}

export function requestPath(requestId) {
  return join(requestsDir(), `${requestId}.json`);
}

export function responsePath(requestId) {
  return join(responsesDir(), `${requestId}.json`);
}

export async function ensureMailboxDirs() {
  await mkdir(requestsDir(), { recursive: true });
  await mkdir(responsesDir(), { recursive: true });
}

async function fsyncPath(path) {
  const fh = await open(path, 'r');
  try {
    await fh.sync();
  } finally {
    await fh.close();
  }
}

export async function atomicWriteJson(targetPath, data) {
  await mkdir(dirname(targetPath), { recursive: true });

  const tmpPath = `${targetPath}.${process.pid}.${randomBytes(4).toString('hex')}.tmp`;
  let fileHandle = null;

  try {
    fileHandle = await open(tmpPath, 'wx');
    await fileHandle.writeFile(`${JSON.stringify(data, null, 2)}\n`, 'utf8');
    await fileHandle.sync();
    await fileHandle.close();
    fileHandle = null;

    await rename(tmpPath, targetPath);
    await fsyncPath(dirname(targetPath));
  } catch (error) {
    if (fileHandle) {
      try { await fileHandle.close(); } catch {}
    }
    await rm(tmpPath, { force: true }).catch(() => {});
    throw error;
  }
}

async function readJsonIfExists(path) {
  try {
    const raw = await readFile(path, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function normalizeFiles(files) {
  return Array.isArray(files) ? files : [];
}

function slugifyPrompt(prompt) {
  const slug = String(prompt ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return slug || 'image';
}

function formatTimestamp(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function normalizeOutputDir(outputDir) {
  if (!outputDir) return null;
  return isAbsolute(outputDir) ? outputDir : resolve(process.cwd(), outputDir);
}

function deriveImageDir(requestId, createdAt, prompt, outputDir = null) {
  const normalized = normalizeOutputDir(outputDir);
  if (normalized) return normalized;

  const parsedCreatedAt = new Date(createdAt);
  const requestEpoch = Number(String(requestId).split('-')[0]);
  const fallbackDate = Number.isFinite(requestEpoch) ? new Date(requestEpoch) : new Date();
  const ts = Number.isNaN(parsedCreatedAt.getTime()) ? fallbackDate : parsedCreatedAt;
  return join(imagesDir(), `${formatTimestamp(ts)}-${slugifyPrompt(prompt)}`);
}

export async function submit(prompt, opts = {}) {
  if (typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error('prompt required');
  }

  await ensureMailboxDirs();

  const requestId = makeRequestId(opts.agent);
  const createdAt = nowIso();
  const mode = normalizeMode(opts.mode);
  const response_path = responsePath(requestId);
  const image_dir = mode === 'image'
    ? deriveImageDir(requestId, createdAt, prompt, opts.output_dir ?? null)
    : undefined;
  const request = {
    request_id: requestId,
    state: 'pending',
    prompt,
    agent: normalizeAgent(opts.agent),
    model: opts.model ?? null,
    thinking: opts.thinking ?? null,
    fresh: Boolean(opts.fresh),
    mode,
    output_dir: mode === 'image'
      ? image_dir
      : normalizeOutputDir(opts.output_dir ?? null),
    image_dir: mode === 'image' ? image_dir : null,
    created_at: createdAt,
    updated_at: createdAt,
  };

  await atomicWriteJson(requestPath(requestId), request);
  return mode === 'image'
    ? { request_id: requestId, response_path, image_dir }
    : { request_id: requestId, response_path };
}

export async function readRequest(requestId) {
  return readJsonIfExists(requestPath(requestId));
}

export async function readResponse(requestId) {
  return readJsonIfExists(responsePath(requestId));
}

export async function listRequestIds() {
  await ensureMailboxDirs();
  const names = await readdir(requestsDir());
  return names
    .filter(name => name.endsWith('.json'))
    .map(name => name.slice(0, -'.json'.length))
    .sort();
}

export async function claimRequestLock(requestId) {
  const lockPath = `${requestPath(requestId)}.lock`;
  try {
    await writeFile(lockPath, `${process.pid}\n`, { encoding: 'utf8', flag: 'wx' });
    return lockPath;
  } catch (error) {
    if (error.code === 'EEXIST') return null;
    throw error;
  }
}

export async function releaseRequestLock(lockPath) {
  if (!lockPath) return;
  await rm(lockPath, { force: true });
}

export async function markRequestActive(requestId, request) {
  const active = {
    ...request,
    request_id: requestId,
    agent: normalizeAgent(request.agent),
    state: 'active',
    started_at: request.started_at ?? nowIso(),
    updated_at: nowIso(),
  };
  await atomicWriteJson(requestPath(requestId), active);
  return active;
}

export async function removeRequest(requestId) {
  await rm(requestPath(requestId), { force: true });
}

export async function writeResponseVerified(requestId, response) {
  const path = responsePath(requestId);
  await atomicWriteJson(path, response);
  await fsyncPath(path);

  const readBack = await readJsonIfExists(path);
  if (!readBack) {
    throw new Error(`response_verify_failed: missing ${requestId}`);
  }

  if (readBack.request_id !== response.request_id || readBack.state !== response.state) {
    throw new Error(`response_verify_failed: mismatch ${requestId}`);
  }

  return readBack;
}

export async function verifyResponseFiles(files) {
  for (const filePath of normalizeFiles(files)) {
    const info = await stat(filePath);
    if (!info.isFile() || info.size <= 0) {
      throw new Error(`invalid_file:${filePath}`);
    }

    if (extname(filePath).toLowerCase() === '.png') {
      const handle = await open(filePath, 'r');
      try {
        const buf = Buffer.alloc(4);
        await handle.read(buf, 0, 4, 0);
        if (!buf.equals(PNG_MAGIC)) {
          throw new Error(`invalid_png_header:${filePath}`);
        }
      } finally {
        await handle.close();
      }
    }
  }
}

export async function status(requestId) {
  if (!requestId) throw new Error('request_id required');

  const response = await readResponse(requestId);
  if (response) {
    return {
      state: response.state,
      agent: response.agent ?? 'default',
      elapsed_ms: response.elapsed_ms ?? elapsedMs(response.created_at, response.finished_at),
      error: response.error ?? undefined,
    };
  }

  const request = await readRequest(requestId);
  if (request) {
    return {
      state: request.state ?? 'pending',
      agent: request.agent ?? 'default',
      elapsed_ms: elapsedMs(request.created_at),
      error: request.error ?? undefined,
    };
  }

  return {
    state: 'error',
    agent: 'default',
    elapsed_ms: 0,
    error: `request_id_not_found:${requestId}`,
  };
}

export async function fetch(requestId) {
  if (!requestId) throw new Error('request_id required');

  const response = await readResponse(requestId);
  if (response) {
    if (response.state === 'error') {
      return {
        text: response.text ?? '',
        files: normalizeFiles(response.files),
        complete: true,
        error: response.error ?? 'unknown_error',
      };
    }

    return {
      text: response.text ?? '',
      files: normalizeFiles(response.files),
      complete: true,
      error: undefined,
    };
  }

  const request = await readRequest(requestId);
  if (request) {
    return {
      text: '',
      files: [],
      complete: false,
      error: undefined,
    };
  }

  return {
    text: '',
    files: [],
    complete: false,
    error: `request_id_not_found:${requestId}`,
  };
}

function previewText(input) {
  const text = String(input ?? '').replace(/\s+/g, ' ').trim();
  return text.slice(0, 100);
}

async function defaultNotifyRunner(scriptPath, args) {
  await new Promise(resolve => {
    const child = spawn(scriptPath, args, { stdio: 'ignore' });
    child.once('error', () => resolve());
    child.once('exit', () => resolve());
  });
}

export async function notifyAgentIfAvailable(agent, requestId, preview, options = {}) {
  const scriptPath = options.scriptPath ?? defaultNotifyScriptPath();
  if (!existsSync(scriptPath)) return false;

  const response_path = options.responsePath ?? responsePath(requestId);
  const image_dir = options.imageDir ?? null;
  const file_count = Number.isFinite(options.fileCount) ? options.fileCount : 0;
  const message = image_dir
    ? `exocortex-chatgpt images ready: ${requestId} in ${image_dir} — ${file_count} file(s)`
    : `exocortex-chatgpt response ready: ${requestId} at ${response_path} — preview: ${previewText(preview)}`;
  const runner = options.runner ?? defaultNotifyRunner;

  try {
    await runner(scriptPath, [normalizeAgent(agent), message]);
  } catch {
    // Explicitly silent when hook fails.
  }

  return true;
}

function isPidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

export async function readDaemonPid() {
  try {
    const raw = await readFile(daemonPidPath(), 'utf8');
    const pid = Number(raw.trim());
    return Number.isInteger(pid) && pid > 0 ? pid : null;
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

export async function writeDaemonPid(pid = process.pid) {
  await mkdir(baseDir(), { recursive: true });
  await writeFile(daemonPidPath(), `${pid}\n`, { encoding: 'utf8' });
}

export async function removeDaemonPid(expectedPid = process.pid) {
  const currentPid = await readDaemonPid();
  if (currentPid && currentPid !== expectedPid) return;
  await rm(daemonPidPath(), { force: true });
}

export async function ensureDaemonRunning() {
  if (process.env.CHATGPT_MCP_DISABLE_AUTODAEMON === '1') {
    return { started: false, pid: null, disabled: true };
  }

  const existingPid = await readDaemonPid();
  if (existingPid && isPidAlive(existingPid)) {
    return { started: false, pid: existingPid, disabled: false };
  }

  const child = spawn(process.execPath, [CLI_PATH, 'daemon'], {
    detached: true,
    stdio: 'ignore',
    env: process.env,
    cwd: __dirname,
  });
  child.unref();

  for (let i = 0; i < 40; i++) {
    const pid = await readDaemonPid();
    if (pid && isPidAlive(pid)) {
      return { started: true, pid, disabled: false };
    }
    await delay(50);
  }

  return { started: true, pid: child.pid ?? null, disabled: false };
}

export async function query(prompt, opts = {}) {
  await ensureDaemonRunning();
  const { request_id } = await submit(prompt, opts);

  while (true) {
    const s = await status(request_id);
    if (s.state === 'complete' || s.state === 'error') {
      const result = await fetch(request_id);
      if (result.error) {
        throw new Error(result.error);
      }
      return { text: result.text, files: result.files, request_id };
    }

    await delay(Number(opts.pollMs ?? 1000));
  }
}
