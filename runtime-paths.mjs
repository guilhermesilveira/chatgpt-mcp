import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

function defaultHome() {
  return join(homedir(), '.chatgpt-mcp');
}

export function getHome() {
  const configured = String(process.env.CHATGPT_MCP_HOME || '').trim();
  return configured ? resolve(configured) : defaultHome();
}

export function getProfileDir() {
  return join(getHome(), 'profile');
}

export function getCDPFilePath() {
  return join(getHome(), 'cdp');
}

export function getImagesDir() {
  return join(getHome(), 'images');
}

export function getRequestsDir() {
  return join(getHome(), 'requests');
}

export function getResponsesDir() {
  return join(getHome(), 'responses');
}

export function getDaemonPidPath() {
  return join(getHome(), 'daemon.pid');
}

export function getTokenPath() {
  return join(getHome(), 'token');
}
