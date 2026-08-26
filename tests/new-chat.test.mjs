import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NEW_CHAT_TIMEOUT_MS, openNewChat } from '../new-chat.mjs';

test('new chat navigates to the ChatGPT root and verifies the route and composer', async () => {
  const calls = [];
  const page = {
    async goto(url, options) {
      calls.push({ method: 'goto', url, options });
    },
    async waitForURL(predicate, options) {
      calls.push({
        method: 'waitForURL',
        rootMatches: predicate(new URL('https://chatgpt.com/')),
        conversationMatches: predicate(new URL('https://chatgpt.com/c/existing')),
        options,
      });
    },
    async waitForSelector(selector, options) {
      calls.push({ method: 'waitForSelector', selector, options });
    },
  };

  await openNewChat(page, 'https://chatgpt.com', '#prompt-textarea');

  assert.equal(NEW_CHAT_TIMEOUT_MS, 15_000);
  assert.deepEqual(calls, [
    {
      method: 'goto',
      url: 'https://chatgpt.com/',
      options: { waitUntil: 'domcontentloaded' },
    },
    {
      method: 'waitForURL',
      rootMatches: true,
      conversationMatches: false,
      options: { timeout: 15_000 },
    },
    {
      method: 'waitForSelector',
      selector: '#prompt-textarea',
      options: { timeout: 15_000 },
    },
  ]);
});
