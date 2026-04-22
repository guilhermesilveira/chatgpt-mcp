#!/usr/bin/env node
// Single dispatcher for everything in this package.

import { parseFlags } from './flags.mjs';
import {
  ensureDaemonRunning,
  fetch as fetchRequest,
  query as queryRequest,
  status as requestStatus,
  submit as submitRequest,
} from './mailbox.mjs';

const [cmd, ...rest] = process.argv.slice(2);

function usage(code = 2) {
  console.error(
    'usage: chatgpt-mcp <launch|daemon|server|http|status|submit|fetch|query|image|last|new|model|thinking|stop|check|tabs> [args]',
  );
  process.exit(code);
}

function normalizeMode(flags) {
  const raw = String(flags.mode || (flags.image ? 'image' : 'text')).trim().toLowerCase();
  if (!raw) return 'text';
  if (raw === 'text' || raw === 'image') return raw;
  throw new Error('mode must be one of: text, image');
}

async function runController(fn) {
  const previousAttachOnly = process.env.CHATGPT_MCP_ATTACH_ONLY;
  process.env.CHATGPT_MCP_ATTACH_ONLY = '1';
  const c = await import('./browser-controller.mjs');
  try {
    return await fn(c);
  } finally {
    if (previousAttachOnly == null) delete process.env.CHATGPT_MCP_ATTACH_ONLY;
    else process.env.CHATGPT_MCP_ATTACH_ONLY = previousAttachOnly;
    await c.shutdown();
  }
}

try {
  switch (cmd) {
    case 'launch':
      if (parseFlags(rest).visible) process.env.CHATGPT_VISIBLE = '1';
      await import('./launcher.mjs');
      break;

    case 'daemon':
      await import('./daemon.mjs');
      break;

    case 'server':
      await import('./mcp-server.mjs');
      break;

    case 'http':
      await import('./http-api.mjs');
      break;

    case 'status': {
      const requestId = rest[0];
      if (requestId) {
        const s = await requestStatus(requestId);
        process.stdout.write(`${JSON.stringify(s)}\n`);
        break;
      }

      const s = await runController(c => c.status());
      const parts = [`state=${s.state}`];
      if (s.model) parts.push(`model=${s.model}`);
      if (s.thinking) parts.push(`thinking=${s.thinking}`);
      process.stdout.write(parts.join(' ') + '\n');
      break;
    }

    case 'submit': {
      const flags = parseFlags(rest);
      const prompt = flags._.join(' ').trim();
      if (!prompt) usage();

      await ensureDaemonRunning();
      const { request_id } = await submitRequest(prompt, {
        agent: flags.agent,
        model: flags.model,
        thinking: flags.thinking,
        mode: normalizeMode(flags),
        output_dir: flags.output_dir,
      });

      process.stdout.write(request_id + '\n');
      break;
    }

    case 'fetch': {
      const requestId = rest[0];
      if (!requestId) usage();
      const result = await fetchRequest(requestId);
      process.stdout.write(`${JSON.stringify(result)}\n`);
      break;
    }

    case 'query': {
      const flags = parseFlags(rest);
      const prompt = flags._.join(' ').trim();
      if (!prompt) usage();

      const { text } = await queryRequest(prompt, {
        agent: flags.agent,
        model: flags.model,
        thinking: flags.thinking,
        fresh: flags.fresh,
        mode: normalizeMode(flags),
        output_dir: flags.output_dir,
      });
      process.stdout.write(text + '\n');
      break;
    }

    case 'image': {
      const flags = parseFlags(rest);
      const prompt = flags._.join(' ').trim();
      if (!prompt) usage();
      const outputDir = flags.output_dir;
      const { files, text } = await runController(c =>
        c.generateImage(prompt, { output_dir: outputDir, fresh: flags.fresh, model: flags.model, thinking: flags.thinking }),
      );
      if (!files.length) {
        if (text) process.stderr.write((text + '\n'));
        process.stderr.write('no images found in the latest assistant response\n');
      } else {
        process.stdout.write(files.join('\n') + '\n');
      }
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

    case 'tabs': {
      const sub = rest[0];
      if (sub !== 'cleanup') usage();

      const result = await runController(c => c.cleanupEphemeralTabs({ includeErrors: true, includeUnmarked: false }));
      process.stdout.write(`closed=${result.closed}\n`);
      break;
    }

    default:
      usage();
  }
} catch (e) {
  console.error('error:', e.message || e);
  process.exit(1);
}
