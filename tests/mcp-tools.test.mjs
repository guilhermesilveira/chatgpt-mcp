import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerMcpTools } from '../mcp-tools.mjs';

function makeServer() {
  const tools = new Map();
  return {
    tools,
    registerTool(name, _cfg, handler) {
      tools.set(name, handler);
    },
  };
}

test('submit_pro routes to model=pro thinking=longer mode=text', async () => {
  const calls = [];
  const server = makeServer();

  registerMcpTools(server, {
    ensureDaemonRunning: async () => {},
    submit: async (prompt, opts) => {
      calls.push({ prompt, opts });
      return { request_id: 'rid-pro', response_path: '/tmp/rid-pro.json', image_dir: '/tmp/ignore' };
    },
  });

  const handler = server.tools.get('submit_pro');
  assert.ok(handler, 'submit_pro should be registered');

  const out = await handler({ prompt: 'deep work', agent: 'alpha', fresh: false });
  assert.deepEqual(calls, [{
    prompt: 'deep work',
    opts: { agent: 'alpha', model: 'pro', thinking: 'longer', mode: 'text', fresh: false },
  }]);

  assert.deepEqual(JSON.parse(out.content[0].text), {
    request_id: 'rid-pro',
    response_path: '/tmp/rid-pro.json',
  });
});

test('submit_image routes to model=gpt-5 mode=image fresh=true', async () => {
  const calls = [];
  const server = makeServer();

  registerMcpTools(server, {
    ensureDaemonRunning: async () => {},
    submit: async (prompt, opts) => {
      calls.push({ prompt, opts });
      return { request_id: 'rid-img', response_path: '/tmp/rid-img.json', image_dir: '/tmp/images/rid-img' };
    },
  });

  const handler = server.tools.get('submit_image');
  assert.ok(handler, 'submit_image should be registered');

  const out = await handler({ prompt: 'draw icon', agent: 'beta', output_dir: '/tmp/images' });
  assert.deepEqual(calls, [{
    prompt: 'draw icon',
    opts: { agent: 'beta', model: 'gpt-5', mode: 'image', output_dir: '/tmp/images', fresh: true },
  }]);

  assert.deepEqual(JSON.parse(out.content[0].text), {
    request_id: 'rid-img',
    image_dir: '/tmp/images/rid-img',
  });
});

test('legacy submit tool is not registered in MCP surface', async () => {
  const server = makeServer();
  registerMcpTools(server, {});
  assert.equal(server.tools.has('submit'), false);
});
