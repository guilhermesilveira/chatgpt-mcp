import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePillText } from '../parse-pill.mjs';

test('null pill → Instant model', () => {
  assert.deepEqual(parsePillText(null), { model: 'Instant', thinking: null, pill: null });
});

test('empty string → Instant model', () => {
  assert.deepEqual(parsePillText(''), { model: 'Instant', thinking: null, pill: null });
});

test('whitespace-only string → Instant model', () => {
  assert.deepEqual(parsePillText('   \t  '), { model: 'Instant', thinking: null, pill: null });
});

test('single token "Thinking" → Thinking model, no level', () => {
  assert.deepEqual(parsePillText('Thinking'), { model: 'Thinking', thinking: null, pill: 'Thinking' });
});

test('single token "Pro" → Pro model, no level', () => {
  assert.deepEqual(parsePillText('Pro'), { model: 'Pro', thinking: null, pill: 'Pro' });
});

test('two tokens "Länger Pro" → Pro model + Länger level (German)', () => {
  assert.deepEqual(parsePillText('Länger Pro'), { model: 'Pro', thinking: 'Länger', pill: 'Länger Pro' });
});

test('two tokens "Longer Pro" → Pro model + Longer level (English)', () => {
  assert.deepEqual(parsePillText('Longer Pro'), { model: 'Pro', thinking: 'Longer', pill: 'Longer Pro' });
});

test('extra whitespace is collapsed', () => {
  assert.deepEqual(parsePillText('  Länger   Pro  '), { model: 'Pro', thinking: 'Länger', pill: 'Länger   Pro' });
});

test('three-token level preserves spacing', () => {
  // Hypothetical future label like "Very Much Longer Pro"
  assert.deepEqual(
    parsePillText('Very Much Longer Pro'),
    { model: 'Pro', thinking: 'Very Much Longer', pill: 'Very Much Longer Pro' },
  );
});

test('coerces non-strings', () => {
  assert.deepEqual(parsePillText(123), { model: '123', thinking: null, pill: '123' });
});
