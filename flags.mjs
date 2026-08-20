// Tiny argv flag parser for the CLI. Extracted so tests can import it
// without executing the CLI dispatcher.

import { isIP } from 'node:net';

export function parseFlags(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--fresh') out.fresh = true;
    else if (a === '--telegram') out.telegram = true;
    else if (a === '--model') out.model = argv[++i];
    else if (a === '--thinking') out.thinking = argv[++i];
    else out._.push(a);
  }
  return out;
}

export function parseHttpFlags(argv) {
  let host = '127.0.0.1';
  let telegram = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--telegram') {
      telegram = true;
    } else if (arg === '--host') {
      if (i + 1 >= argv.length) throw new Error('--host requires an IP address');
      host = argv[++i];
    } else if (arg.startsWith('--host=')) {
      host = arg.slice('--host='.length);
    } else {
      throw new Error(`unknown http option: ${arg}`);
    }
  }

  if (isIP(host) !== 4) throw new Error(`invalid host IPv4 address: ${host}`);
  return { host, telegram };
}

export function parseServerFlags(argv) {
  let telegram = false;
  for (const arg of argv) {
    if (arg === '--telegram') telegram = true;
    else throw new Error(`unknown server option: ${arg}`);
  }
  return { telegram };
}
