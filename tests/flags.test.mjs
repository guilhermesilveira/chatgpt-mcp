import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFlags, parseHttpFlags } from '../flags.mjs';

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

test('http host defaults to loopback', () => {
  assert.deepEqual(parseHttpFlags([]), { host: '127.0.0.1' });
});

test('http --host accepts IPv4 addresses', () => {
  assert.deepEqual(parseHttpFlags(['--host', '0.0.0.0']), { host: '0.0.0.0' });
});

test('http --host accepts equals syntax', () => {
  assert.deepEqual(parseHttpFlags(['--host=192.168.1.10']), { host: '192.168.1.10' });
});

test('http --host requires a value', () => {
  assert.throws(() => parseHttpFlags(['--host']), /requires an IP address/);
});

test('http --host rejects non-IP values', () => {
  assert.throws(() => parseHttpFlags(['--host', 'localhost']), /invalid host IPv4 address/);
});

test('http rejects unknown options', () => {
  assert.throws(() => parseHttpFlags(['--port', '9000']), /unknown http option/);
});
