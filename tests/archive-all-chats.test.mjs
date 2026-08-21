import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ARCHIVE_ALL_LABELS, archiveAllChatsFromSettings } from '../archive-all-chats.mjs';

test('archive-all opens Data Controls and completes the confirmation dialog', async () => {
  const calls = [];
  const visible = method => ({
    first() { return this; },
    last() { return this; },
    async count() { return 1; },
    nth() { return this; },
    async isVisible() { return true; },
    async waitFor(options) { calls.push({ method: `${method}.waitFor`, options }); },
    async click() { calls.push({ method: `${method}.click` }); },
    getByRole(role, options) {
      calls.push({
        method: `${method}.getByRole`,
        role,
        matchesEnglish: options.name.test('Archive all chats'),
        matchesPortuguese: options.name.test('Arquivar todos os chats'),
      });
      return visible('confirm');
    },
  });
  const page = {
    async goto(url, options) { calls.push({ method: 'goto', url, options }); },
    getByText(pattern, options) {
      const matchesArchive = pattern.test('Archive all');
      calls.push({ method: 'getByText', matchesArchive, options });
      return visible(matchesArchive ? 'archiveText' : 'dataControls');
    },
    getByRole(role, options) {
      calls.push({
        method: 'getByRole',
        role,
        matchesEnglish: options?.name?.test('Archive all'),
        matchesPortuguese: options?.name?.test('Arquivar tudo'),
      });
      return role === 'dialog' ? visible('dialog') : visible('archive');
    },
  };

  assert.deepEqual(ARCHIVE_ALL_LABELS.action.slice(0, 2), ['Archive all', 'Archive all chats']);
  assert.deepEqual(
    await archiveAllChatsFromSettings(page, 'https://chatgpt.com'),
    { archived: true },
  );
  assert.ok(calls.some(call => call.method === 'archive.click'));
  assert.ok(calls.some(call => call.method === 'confirm.click'));
  assert.ok(
    calls.some(call => call.method === 'dialog.waitFor' && call.options.state === 'detached'),
  );
});
