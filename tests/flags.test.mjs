import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFlags } from '../flags.mjs';

test('empty argv', () => {
  assert.deepEqual(parseFlags([]), { _: [] });
});

test('positional args only', () => {
  assert.deepEqual(parseFlags(['hello', 'world']), { _: ['hello', 'world'] });
});

test('--fresh is a boolean flag', () => {
  assert.deepEqual(parseFlags(['--fresh']), { _: [], fresh: true });
});

test('--model consumes the next token', () => {
  assert.deepEqual(parseFlags(['--model', 'pro']), { _: [], model: 'pro' });
});

test('--thinking consumes the next token', () => {
  assert.deepEqual(parseFlags(['--thinking', 'longer']), { _: [], thinking: 'longer' });
});

test('flags mixed with positional args in any order', () => {
  assert.deepEqual(
    parseFlags(['--fresh', '--model', 'pro', 'what', 'is', '2+2']),
    { _: ['what', 'is', '2+2'], fresh: true, model: 'pro' },
  );
});

test('flags at the end', () => {
  assert.deepEqual(
    parseFlags(['prompt', 'text', '--thinking', 'longer']),
    { _: ['prompt', 'text'], thinking: 'longer' },
  );
});

test('full combo from query subcommand', () => {
  assert.deepEqual(
    parseFlags(['--fresh', '--model', 'pro', '--thinking', 'longer', 'solve', 'this']),
    { _: ['solve', 'this'], fresh: true, model: 'pro', thinking: 'longer' },
  );
});

test('unknown flag passes through as positional', () => {
  // Lenient parser: anything unrecognized is treated as prompt text.
  assert.deepEqual(
    parseFlags(['--unknown', 'value']),
    { _: ['--unknown', 'value'] },
  );
});

test('value after --model may start with a dash (taken literally)', () => {
  // We take whatever is next — CLI callers use quoted strings anyway.
  assert.deepEqual(parseFlags(['--model', '-weird']), { _: [], model: '-weird' });
});
