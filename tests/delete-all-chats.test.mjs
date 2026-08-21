import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DELETE_ALL_LABELS, deleteAllChatsFromSettings } from '../delete-all-chats.mjs';

test('delete-all UI copy supports only English and Portuguese', () => {
  assert.deepEqual(DELETE_ALL_LABELS, {
    dataControls: ['Data Controls', 'Controles de dados'],
    action: ['Delete all', 'Delete all chats', 'Excluir tudo', 'Excluir todos os chats'],
    confirmation: ['Delete all chats', 'Delete all', 'Excluir todos os chats', 'Excluir tudo'],
  });
});

test('delete-all opens Data Controls and completes the confirmation dialog', async () => {
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
        matchesEnglish: options.name.test('Delete all chats'),
        matchesPortuguese: options.name.test('Excluir todos os chats'),
      });
      return visible('confirm');
    },
  });
  const page = {
    async goto(url, options) { calls.push({ method: 'goto', url, options }); },
    getByText(pattern, options) {
      calls.push({
        method: 'getByText',
        matchesEnglish: pattern.test('Data Controls'),
        matchesPortuguese: pattern.test('Controles de dados'),
        options,
      });
      return visible('dataControls');
    },
    getByRole(role, options) {
      calls.push({
        method: 'getByRole',
        role,
        matchesEnglish: options?.name?.test('Delete all'),
        matchesPortuguese: options?.name?.test('Excluir tudo'),
      });
      return role === 'dialog' ? visible('dialog') : visible('delete');
    },
  };

  assert.deepEqual(
    await deleteAllChatsFromSettings(page, 'https://chatgpt.com'),
    { deleted: true },
  );
  assert.deepEqual(calls[0], {
    method: 'goto',
    url: 'https://chatgpt.com/#settings/DataControls',
    options: { waitUntil: 'domcontentloaded' },
  });
  assert.ok(calls.some(call => call.method === 'delete.click'));
  assert.ok(calls.some(call => call.method === 'confirm.click'));
  assert.ok(
    calls.some(call => call.method === 'dialog.waitFor' && call.options.state === 'detached'),
  );
});

test('delete-all skips hidden role matches and clicks the visible text fallback', async () => {
  const calls = [];
  const locator = (method, visibility = [true]) => ({
    first() { return this; },
    last() { return this; },
    async count() { return visibility.length; },
    nth(index) { return locator(`${method}.${index}`, [visibility[index]]); },
    async isVisible() { return visibility[0]; },
    async waitFor(options) { calls.push({ method: `${method}.waitFor`, options }); },
    async click() { calls.push({ method: `${method}.click` }); },
    getByRole() { return locator('confirm'); },
  });
  const page = {
    async goto() {},
    getByText(pattern) {
      if (pattern.test('Data Controls')) return locator('dataControls');
      return locator('deleteText');
    },
    getByRole(role) {
      if (role === 'dialog') return locator('dialog');
      return locator('deleteRole', [false, false]);
    },
  };

  assert.deepEqual(
    await deleteAllChatsFromSettings(page, 'https://chatgpt.com'),
    { deleted: true },
  );
  assert.ok(calls.some(call => call.method === 'deleteText.0.click'));
  assert.ok(!calls.some(call => call.method.startsWith('deleteRole') && call.method.endsWith('.click')));
});
