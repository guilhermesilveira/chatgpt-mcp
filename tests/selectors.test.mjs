import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const selectors = JSON.parse(readFileSync(join(ROOT, 'selectors.json'), 'utf8'));

test('selectors.json is valid JSON and an object', () => {
  assert.equal(typeof selectors, 'object');
  assert.ok(selectors, 'should not be null');
});

test('composer selectors exist', () => {
  for (const k of ['prompt_input', 'send_button', 'stop_button', 'submit_button_any']) {
    assert.equal(typeof selectors.composer[k], 'string', `composer.${k} should be a string`);
    assert.ok(selectors.composer[k].length > 0, `composer.${k} should not be empty`);
  }
});

test('signals selectors exist', () => {
  for (const k of ['generating', 'turn_finished_marker', 'login_required_marker']) {
    assert.equal(typeof selectors.signals[k], 'string');
  }
});

test('conversation selectors exist', () => {
  for (const k of ['message_assistant', 'message_user', 'turn_any']) {
    assert.equal(typeof selectors.conversation[k], 'string');
  }
});

test('model.name_map maps known names to CSS selectors', () => {
  const map = selectors.model.name_map;
  assert.equal(typeof map, 'object');
  for (const required of ['instant', 'thinking', 'pro']) {
    assert.ok(map[required], `model.name_map.${required} should be set`);
    assert.match(map[required], /data-testid/, `${required} selector should target a data-testid`);
  }
});

test('thinking.icon_href has stable SVG sprite refs', () => {
  const map = selectors.thinking.icon_href;
  assert.equal(typeof map, 'object');
  assert.ok(map.standard && map.standard.startsWith('#'), 'standard icon href should start with #');
  assert.ok(map.longer && map.longer.startsWith('#'), 'longer icon href should start with #');
});

test('thinking.name_map_text covers multiple locales', () => {
  const map = selectors.thinking.name_map_text;
  assert.ok(Array.isArray(map.standard) && map.standard.length >= 1);
  assert.ok(Array.isArray(map.longer) && map.longer.length >= 2, 'longer should have >=2 locales (de + en)');
  // Specifically check that German "Länger" is present for the German UI
  assert.ok(map.longer.includes('Länger'), 'longer should include the German label');
});

test('urls.home points to chatgpt.com over https', () => {
  assert.match(selectors.urls.home, /^https:\/\/chatgpt\.com/);
});

test('no trailing/leading whitespace in any selector string', () => {
  const bad = [];
  const walk = (obj, path) => {
    for (const [k, v] of Object.entries(obj)) {
      if (k.startsWith('_')) continue;
      const p = path ? `${path}.${k}` : k;
      if (typeof v === 'string') {
        if (v !== v.trim()) bad.push(p);
      } else if (v && typeof v === 'object' && !Array.isArray(v)) {
        walk(v, p);
      }
    }
  };
  walk(selectors, '');
  assert.deepEqual(bad, [], `selectors with whitespace issues: ${bad.join(', ')}`);
});
