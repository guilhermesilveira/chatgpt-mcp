#!/usr/bin/env node

import {
  claimRequestLock,
  listRequestIds,
  normalizeAgent,
  readRequest,
  releaseRequestLock,
  removeDaemonPid,
  removeRequest,
  verifyResponseFiles,
  writeDaemonPid,
  writeResponseVerified,
  markRequestActive,
  notifyAgentIfAvailable,
} from './mailbox.mjs';
import {
  cleanupEphemeralTabs,
  createEphemeralChatPage,
  closeEphemeralPage,
  markEphemeralTabError,
  queryInPage,
  shutdown,
} from './browser-controller.mjs';
import { processClaimedRequest } from './daemon-core.mjs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const POLL_MS = Number(process.env.CHATGPT_MCP_DAEMON_POLL_MS || 250);
const ROUTE_RESPONSE_SCRIPT = join(homedir(), '.clawd', 'bin', 'route-response.sh');

let stopping = false;
const inFlightByRequest = new Map();
const inFlightByAgent = new Map();
let pidClaimed = false;

function requestStop() {
  stopping = true;
}

process.on('SIGINT', requestStop);
process.on('SIGTERM', requestStop);

async function maybeStartRequests() {
  const requestIds = await listRequestIds();
  let started = 0;

  for (const requestId of requestIds) {
    if (inFlightByRequest.has(requestId)) continue;

    const request = await readRequest(requestId);
    if (!request) continue;

    const state = request.state ?? 'pending';
    if (state === 'complete' || state === 'error') {
      await removeRequest(requestId).catch(() => {});
      continue;
    }

    const agent = normalizeAgent(request.agent);
    if (inFlightByAgent.has(agent)) continue;

    const lockPath = await claimRequestLock(requestId);
    if (!lockPath) continue;

    const task = processClaimedRequest({
      requestId,
      lockPath,
      agent,
      deps: {
        readRequest,
        markRequestActive,
        createEphemeralChatPage,
        queryInPage,
        verifyResponseFiles,
        writeResponseVerified,
        removeRequest,
        closeEphemeralPage,
        markEphemeralTabError,
        notifyAgentIfAvailable: (notifyAgent, notifyRequestId, notifyPreview, notifyOptions = {}) => {
          return notifyAgentIfAvailable(notifyAgent, notifyRequestId, notifyPreview, {
            ...notifyOptions,
            scriptPath: ROUTE_RESPONSE_SCRIPT,
            useResponseRouter: true,
          });
        },
        releaseRequestLock,
      },
    })
      .catch((error) => {
        console.error('[daemon] unexpected worker error', requestId, error?.message || error);
      })
      .finally(() => {
        inFlightByRequest.delete(requestId);
        inFlightByAgent.delete(agent);
      });

    inFlightByRequest.set(requestId, task);
    inFlightByAgent.set(agent, task);
    started += 1;
  }

  return started;
}

async function waitForDrain() {
  await Promise.allSettled([...inFlightByRequest.values()]);
}

try {
  pidClaimed = await writeDaemonPid(process.pid, { exclusive: true });
  if (!pidClaimed) {
    console.error('[daemon] already running; exiting duplicate worker');
    process.exit(0);
  }

  // Close stale "active" tabs from prior crashes. Keep error tabs.
  await cleanupEphemeralTabs({ includeErrors: false, includeUnmarked: false });

  console.error('[daemon] async mailbox worker running');

  while (!stopping) {
    const started = await maybeStartRequests();
    if (!started) {
      await new Promise(resolve => setTimeout(resolve, POLL_MS));
    }
  }

  await waitForDrain();
} finally {
  if (pidClaimed) {
    await removeDaemonPid().catch(() => {});
  }
  await shutdown();
}
