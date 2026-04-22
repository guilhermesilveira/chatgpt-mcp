import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  claimRequestLock,
  fetch,
  markRequestActive,
  readRequest,
  releaseRequestLock,
  removeRequest,
  verifyResponseFiles,
  writeResponseVerified,
  submit,
} from '../mailbox.mjs';
import { processClaimedRequest } from '../daemon-core.mjs';

async function withMailboxHome(fn) {
  const prev = process.env.CHATGPT_MCP_HOME;
  const home = await mkdtemp(join(tmpdir(), 'chatgpt-mcp-daemon-core-'));
  process.env.CHATGPT_MCP_HOME = home;
  try {
    return await fn(home);
  } finally {
    if (prev == null) delete process.env.CHATGPT_MCP_HOME;
    else process.env.CHATGPT_MCP_HOME = prev;
  }
}

test('processClaimedRequest completes and closes tab after persistence', async () => {
  await withMailboxHome(async () => {
    const { request_id } = await submit('hello', { agent: 'alpha' });
    const lockPath = await claimRequestLock(request_id);
    assert.ok(lockPath, 'lock should be acquired');

    const page = { id: 'page-1' };
    let closeCalls = 0;
    let markErrorCalls = 0;
    let notifyCalls = 0;

    const result = await processClaimedRequest({
      requestId: request_id,
      lockPath,
      agent: 'alpha',
      deps: {
        readRequest,
        markRequestActive,
        createEphemeralChatPage: async () => page,
        queryInPage: async () => ({ text: 'answer', files: [] }),
        verifyResponseFiles,
        writeResponseVerified,
        removeRequest,
        closeEphemeralPage: async (p) => {
          assert.equal(p, page);
          closeCalls += 1;
        },
        markEphemeralTabError: async () => { markErrorCalls += 1; },
        notifyAgentIfAvailable: async () => { notifyCalls += 1; },
        releaseRequestLock,
      },
    });

    assert.equal(result.state, 'complete');
    assert.equal(closeCalls, 1);
    assert.equal(markErrorCalls, 0);
    assert.equal(notifyCalls, 1);
    assert.equal(existsSync(lockPath), false, 'lock should be released');

    const fetched = await fetch(request_id);
    assert.equal(fetched.complete, true);
    assert.equal(fetched.text, 'answer');
    assert.equal(fetched.error, undefined);
  });
});

test('processClaimedRequest marks error and keeps tab open on failure', async () => {
  await withMailboxHome(async () => {
    const { request_id } = await submit('hello', { agent: 'beta' });
    const lockPath = await claimRequestLock(request_id);
    assert.ok(lockPath, 'lock should be acquired');

    const page = { id: 'page-2' };
    let closeCalls = 0;
    let markErrorCalls = 0;
    let notifyCalls = 0;

    const result = await processClaimedRequest({
      requestId: request_id,
      lockPath,
      agent: 'beta',
      deps: {
        readRequest,
        markRequestActive,
        createEphemeralChatPage: async () => page,
        queryInPage: async () => { throw new Error('extract_failed'); },
        verifyResponseFiles,
        writeResponseVerified,
        removeRequest,
        closeEphemeralPage: async () => { closeCalls += 1; },
        markEphemeralTabError: async (p, id) => {
          assert.equal(p, page);
          assert.equal(id, request_id);
          markErrorCalls += 1;
        },
        notifyAgentIfAvailable: async () => { notifyCalls += 1; },
        releaseRequestLock,
      },
    });

    assert.equal(result.state, 'error');
    assert.equal(closeCalls, 0, 'error tab should remain open');
    assert.equal(markErrorCalls, 1);
    assert.equal(notifyCalls, 1);
    assert.equal(existsSync(lockPath), false, 'lock should be released');

    const fetched = await fetch(request_id);
    assert.equal(fetched.complete, true);
    assert.equal(fetched.error, 'extract_failed');
  });
});
