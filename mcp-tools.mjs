import { z } from 'zod';
import {
  readLast,
  status as sessionStatus,
  newChat,
  setModel,
  getModel,
  setThinking,
  getThinking,
  stop,
  generateImage,
} from './browser-controller.mjs';
import {
  ensureDaemonRunning,
  fetch as fetchRequest,
  query as queuedQuery,
  status as requestStatus,
  submit,
} from './mailbox.mjs';

export function registerMcpTools(server, deps = {}) {
  const d = {
    readLast,
    sessionStatus,
    newChat,
    setModel,
    getModel,
    setThinking,
    getThinking,
    stop,
    generateImage,
    ensureDaemonRunning,
    fetchRequest,
    queuedQuery,
    requestStatus,
    submit,
    ...deps,
  };

  server.registerTool('query', {
    title: 'Send a prompt to ChatGPT',
    description: 'BLOCKING up to 30min. Agents prefer submit_pro (non-blocking, Pro-routed). This sync tool is for CLI and interactive single-user use. Sends a prompt and waits for completion. Uses submit+poll+fetch under the hood.',
    inputSchema: {
      prompt: z.string().min(1),
      fresh: z.boolean().optional().describe('Start a new chat before sending.'),
      model: z.string().optional().describe('Switch to this model first (matches by visible name).'),
      thinking: z.string().optional().describe('Thinking level: "standard" or "longer" (Pro/Thinking models only).'),
      agent: z.string().optional().describe('Agent label used for async request ownership.'),
      mode: z.enum(['text', 'image']).optional().describe('Response mode. Use "image" to wait for downloaded image files.'),
      output_dir: z.string().optional().describe('Optional output directory for image downloads when mode=image.'),
      key: z.string().optional(),
    },
  }, async ({ prompt, fresh, model, thinking, agent, mode, output_dir }) => {
    const result = await d.queuedQuery(prompt, { fresh, model, thinking, agent, mode, output_dir });
    if ((mode || 'text') === 'image') {
      return { content: [{ type: 'text', text: JSON.stringify(result) }] };
    }
    return { content: [{ type: 'text', text: result.text }] };
  });

  server.registerTool('generate_image', {
    title: 'Generate image(s) with ChatGPT',
    description: 'BLOCKING up to 3min. Agents prefer submit_image (non-blocking, correctly-routed). This sync tool is for CLI and interactive single-user use. Sends an image-generation prompt, waits for completion (up to 3 minutes), downloads images from the latest assistant response, and returns local file paths.',
    inputSchema: {
      prompt: z.string().min(1),
      output_dir: z.string().optional().describe('Optional output directory. Defaults to ~/.chatgpt-mcp/images/<timestamp>-<slug>/'),
      fresh: z.boolean().optional().describe('Start a new chat before sending.'),
      model: z.string().optional().describe('Switch to this model first (matches by visible name).'),
      thinking: z.string().optional().describe('Thinking level: "standard" or "longer" (Pro/Thinking models only).'),
      key: z.string().optional(),
    },
  }, async ({ prompt, output_dir, fresh, model, thinking }) => {
    const result = await d.generateImage(prompt, { output_dir, fresh, model, thinking });
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  });

  server.registerTool('submit_pro', {
    title: 'Submit async GPT-5 Pro request',
    description: 'Submit heavy-reasoning prompt to GPT-5 Pro (Extended Pro). Returns immediately with { request_id, response_path }. File at response_path will contain the text response when ready (typically 30s–30min). Use this for: architecture decisions, debugging hard problems, deep analysis, spec writing. Agents: combine with sleep to avoid wasting context while waiting.',
    inputSchema: {
      prompt: z.string().min(1),
      agent: z.string().optional().describe('Agent label to notify when response is ready.'),
      fresh: z.boolean().optional().describe('Start a new chat in the worker tab before sending.'),
      key: z.string().optional(),
    },
  }, async ({ prompt, agent, fresh }) => {
    await d.ensureDaemonRunning();
    const result = await d.submit(prompt, { agent, model: 'pro', thinking: 'longer', mode: 'text', fresh });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ request_id: result.request_id, response_path: result.response_path }),
      }],
    };
  });

  server.registerTool('submit_image', {
    title: 'Submit async GPT-5 image request',
    description: 'Submit image-generation prompt to GPT-5\'s image tool (NOT Pro — Pro refuses images). Returns immediately with { request_id, image_dir }. PNG files appear in image_dir when ready (typically 30s–3min). Use for: UI assets, carousel imagery, illustrations, mockups, sprite sheets.',
    inputSchema: {
      prompt: z.string().min(1),
      agent: z.string().optional().describe('Agent label to notify when images are ready.'),
      output_dir: z.string().optional().describe('Optional output directory for image downloads.'),
      key: z.string().optional(),
    },
  }, async ({ prompt, agent, output_dir }) => {
    await d.ensureDaemonRunning();
    const result = await d.submit(prompt, { agent, model: 'gpt-5', mode: 'image', output_dir, fresh: true });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ request_id: result.request_id, image_dir: result.image_dir }),
      }],
    };
  });

  server.registerTool('status', {
    title: 'ChatGPT status',
    description: 'Without request_id: session status {state, model, thinking}. With request_id: async status {state, agent, elapsed_ms, error?}.',
    inputSchema: {
      request_id: z.string().optional(),
      key: z.string().optional(),
    },
  }, async ({ request_id }) => {
    if (request_id) {
      const s = await d.requestStatus(request_id);
      return { content: [{ type: 'text', text: JSON.stringify(s) }] };
    }

    const s = await d.sessionStatus();
    return { content: [{ type: 'text', text: JSON.stringify(s) }] };
  });

  server.registerTool('fetch', {
    title: 'Fetch async request result',
    description: 'Returns {text, files[], complete, error?} for a queued request.',
    inputSchema: {
      request_id: z.string().min(1),
      key: z.string().optional(),
    },
  }, async ({ request_id }) => {
    const payload = await d.fetchRequest(request_id);
    return { content: [{ type: 'text', text: JSON.stringify(payload) }] };
  });

  server.registerTool('read_last_response', {
    title: 'Read last ChatGPT response',
    description: 'Reads the last assistant message from the active tab without sending anything.',
    inputSchema: { key: z.string().optional() },
  }, async () => {
    const { text } = await d.readLast();
    return { content: [{ type: 'text', text }] };
  });

  server.registerTool('new_chat', {
    title: 'Open a new ChatGPT conversation',
    description: 'Starts a fresh chat.',
    inputSchema: { key: z.string().optional() },
  }, async () => {
    await d.newChat();
    return { content: [{ type: 'text', text: 'ok' }] };
  });

  server.registerTool('set_model', {
    title: 'Switch ChatGPT model',
    description: 'Opens the model switcher and selects the item whose visible name contains the given string.',
    inputSchema: { name: z.string().min(1), key: z.string().optional() },
  }, async ({ name }) => {
    const { model } = await d.setModel(name);
    return { content: [{ type: 'text', text: model ?? name }] };
  });

  server.registerTool('get_model', {
    title: 'Current ChatGPT model',
    description: 'Returns the label of the currently selected model.',
    inputSchema: { key: z.string().optional() },
  }, async () => {
    const m = await d.getModel();
    return { content: [{ type: 'text', text: m ?? '' }] };
  });

  server.registerTool('set_thinking', {
    title: 'Set thinking/reasoning level',
    description: 'Sets the thinking level on Pro/Thinking models. Accepts "standard" or "longer".',
    inputSchema: { level: z.string().min(1), key: z.string().optional() },
  }, async ({ level }) => {
    const { level: l } = await d.setThinking(level);
    return { content: [{ type: 'text', text: l }] };
  });

  server.registerTool('get_thinking', {
    title: 'Current thinking level',
    description: 'Returns the current thinking level label, or empty if not applicable.',
    inputSchema: { key: z.string().optional() },
  }, async () => {
    const l = await d.getThinking();
    return { content: [{ type: 'text', text: l ?? '' }] };
  });

  server.registerTool('stop', {
    title: 'Stop current generation',
    description: 'Clicks the stop-generating button if a response is streaming.',
    inputSchema: { key: z.string().optional() },
  }, async () => {
    await d.stop();
    return { content: [{ type: 'text', text: 'ok' }] };
  });
}
