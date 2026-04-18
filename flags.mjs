// Tiny argv flag parser for the CLI. Extracted so tests can import it
// without executing the CLI dispatcher.

export function parseFlags(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--fresh') out.fresh = true;
    else if (a === '--model') out.model = argv[++i];
    else if (a === '--thinking') out.thinking = argv[++i];
    else out._.push(a);
  }
  return out;
}
