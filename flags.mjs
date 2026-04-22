// Tiny argv flag parser for the CLI. Extracted so tests can import it
// without executing the CLI dispatcher.

export function parseFlags(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--fresh') out.fresh = true;
    else if (a === '--image') out.image = true;
    else if (a === '--visible') out.visible = true;
    else if (a === '--model') out.model = argv[++i];
    else if (a === '--mode') out.mode = argv[++i];
    else if (a === '--thinking') out.thinking = argv[++i];
    else if (a === '--output-dir' || a === '--output_dir') out.output_dir = argv[++i];
    else if (a === '--agent') out.agent = argv[++i];
    else out._.push(a);
  }
  return out;
}
