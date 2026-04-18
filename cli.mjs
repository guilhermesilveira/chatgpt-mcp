#!/usr/bin/env node
// Single dispatcher for everything in this package.
//
//   chatgpt-mcp launch                 run the browser launcher (login + CDP host)
//   chatgpt-mcp server                 run the MCP stdio server
//   chatgpt-mcp http                   run the localhost HTTP API
//   chatgpt-mcp status                 print ready | busy | not_logged_in
//   chatgpt-mcp query "prompt..."      send prompt, print response
//     flags: --fresh             start a new chat first
//            --model <name>      switch model first (matches visible name)
//   chatgpt-mcp last                   print last assistant message
//   chatgpt-mcp new                    open a new chat
//   chatgpt-mcp model [name]           get or set current model
//   chatgpt-mcp stop                   stop an in-progress generation
//   chatgpt-mcp check                  self-heal report: walk selectors.json against live DOM

import { parseFlags } from './flags.mjs';

const [cmd, ...rest] = process.argv.slice(2);

function usage(code = 2) {
  console.error(
    'usage: chatgpt-mcp <launch|server|http|status|query|last|new|model|thinking|stop|check> [args]',
  );
  process.exit(code);
}

async function runController(fn) {
  const c = await import('./browser-controller.mjs');
  try { return await fn(c); } finally { await c.shutdown(); }
}

try {
  switch (cmd) {
    case 'launch':
      await import('./launcher.mjs');
      break;

    case 'server':
      await import('./mcp-server.mjs');
      break;

    case 'http':
      await import('./http-api.mjs');
      break;

    case 'status': {
      const s = await runController(c => c.status());
      const parts = [`state=${s.state}`];
      if (s.model) parts.push(`model=${s.model}`);
      if (s.thinking) parts.push(`thinking=${s.thinking}`);
      process.stdout.write(parts.join(' ') + '\n');
      break;
    }

    case 'last': {
      const { text } = await runController(c => c.readLast());
      process.stdout.write(text + '\n');
      break;
    }

    case 'new': {
      await runController(c => c.newChat());
      process.stdout.write('ok\n');
      break;
    }

    case 'stop': {
      await runController(c => c.stop());
      process.stdout.write('ok\n');
      break;
    }

    case 'model': {
      const name = rest.join(' ').trim();
      if (!name) {
        const cur = await runController(c => c.getModel());
        process.stdout.write((cur ?? '<unknown>') + '\n');
      } else {
        const { model } = await runController(c => c.setModel(name));
        process.stdout.write('now: ' + (model ?? name) + '\n');
      }
      break;
    }

    case 'query': {
      const flags = parseFlags(rest);
      const prompt = flags._.join(' ').trim();
      if (!prompt) usage();
      const { text } = await runController(c =>
        c.query(prompt, { fresh: flags.fresh, model: flags.model, thinking: flags.thinking }),
      );
      process.stdout.write(text + '\n');
      break;
    }

    case 'thinking': {
      const name = rest.join(' ').trim();
      if (!name) {
        const cur = await runController(c => c.getThinking());
        process.stdout.write((cur ?? '<n/a>') + '\n');
      } else {
        const { level } = await runController(c => c.setThinking(name));
        process.stdout.write('now: ' + level + '\n');
      }
      break;
    }

    case 'check': {
      const report = await runController(c => c.checkSelectors());
      let bad = 0;
      for (const r of report) {
        const ok = r.count > 0;
        if (!ok) bad++;
        process.stdout.write(
          `${ok ? 'OK ' : 'MISS'}  ${r.path.padEnd(40)} count=${r.count}  ${r.selector}\n`,
        );
      }
      process.stdout.write(`\n${report.length - bad}/${report.length} selectors present\n`);
      process.exit(bad ? 1 : 0);
    }

    default:
      usage();
  }
} catch (e) {
  console.error('error:', e.message || e);
  process.exit(1);
}
