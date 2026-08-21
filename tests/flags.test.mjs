import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseCleanupChatsFlags,
  parseFlags,
  parseHttpFlags,
  parseServerFlags,
} from '../flags.mjs';

test('empty argv', () => {
  assert.deepEqual(parseFlags([]), { _: [] });
});

test('positional args only', () => {
  assert.deepEqual(parseFlags(['hello', 'world']), { _: ['hello', 'world'] });
});

test('--fresh is a boolean flag', () => {
  assert.deepEqual(parseFlags(['--fresh']), { _: [], fresh: true });
});

test('--telegram is a boolean query flag', () => {
  assert.deepEqual(parseFlags(['--telegram', 'hello']), { _: ['hello'], telegram: true });
});

test('--tid accepts equals and separate-value syntax', () => {
  assert.deepEqual(parseFlags(['--telegram', '--tid=42', 'hello']), {
    _: ['hello'], telegram: true, tid: 42,
  });
  assert.deepEqual(parseFlags(['--telegram', '--tid', '73', 'hello']), {
    _: ['hello'], telegram: true, tid: 73,
  });
});

test('--tid rejects missing, non-numeric, zero, and unsafe values', () => {
  assert.throws(() => parseFlags(['--tid']), /requires a positive integer/);
  assert.throws(() => parseFlags(['--tid=topic']), /requires a positive integer/);
  assert.throws(() => parseFlags(['--tid=0']), /requires a positive integer/);
  assert.throws(() => parseFlags(['--tid=9007199254740992']), /requires a positive integer/);
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
  assert.deepEqual(parseHttpFlags([]), { host: '127.0.0.1', telegram: false });
});

test('http --host accepts IPv4 addresses', () => {
  assert.deepEqual(parseHttpFlags(['--host', '0.0.0.0']), {
    host: '0.0.0.0', telegram: false,
  });
});

test('http --host accepts equals syntax', () => {
  assert.deepEqual(parseHttpFlags(['--host=192.168.1.10']), {
    host: '192.168.1.10', telegram: false,
  });
});

test('http accepts --telegram with --host', () => {
  assert.deepEqual(parseHttpFlags(['--host', '0.0.0.0', '--telegram']), {
    host: '0.0.0.0', telegram: true,
  });
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

test('server only accepts the --telegram option', () => {
  assert.deepEqual(parseServerFlags([]), { telegram: false });
  assert.deepEqual(parseServerFlags(['--telegram']), { telegram: true });
  assert.throws(() => parseServerFlags(['--host', '0.0.0.0']), /unknown server option/);
});

test('cleanup-chats accepts the --confirm flag', () => {
  assert.deepEqual(parseCleanupChatsFlags(['--confirm']), { confirmed: true });
});

test('cleanup-chats rejects missing or additional arguments', () => {
  assert.throws(() => parseCleanupChatsFlags([]), /irreversible/);
  assert.throws(() => parseCleanupChatsFlags(['yes']), /irreversible/);
  assert.throws(() => parseCleanupChatsFlags(['--confirm=yes']), /irreversible/);
  assert.throws(() => parseCleanupChatsFlags(['--confirm', 'extra']), /irreversible/);
});
