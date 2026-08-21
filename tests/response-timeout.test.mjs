import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  RESPONSE_START_TIMEOUT_MS,
  waitForNewAssistantTurn,
} from '../response-wait.mjs';

test('waits five minutes for a new assistant response to appear', async () => {
  let received;
  const page = {
    async waitForFunction(fn, arg, options) {
      received = { fn, arg, options };
    },
  };

  await waitForNewAssistantTurn(page, '[data-message-author-role="assistant"]', 3);

  assert.equal(RESPONSE_START_TIMEOUT_MS, 300_000);
  assert.deepEqual(received.arg, {
    sel: '[data-message-author-role="assistant"]',
    prev: 3,
  });
  assert.deepEqual(received.options, { timeout: 300_000 });
});

test('reports a clear error when no assistant response appears in five minutes', async () => {
  const page = {
    async waitForFunction() {
      const error = new Error('page.waitForFunction: Timeout 300000ms exceeded.');
      error.name = 'TimeoutError';
      throw error;
    },
  };

  await assert.rejects(
    waitForNewAssistantTurn(page, '[data-message-author-role="assistant"]', 0),
    /no assistant response appeared within 5 minutes/,
  );
});
