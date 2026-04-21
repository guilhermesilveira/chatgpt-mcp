#!/usr/bin/env node
// MCP server over stdio for exocortex-chatgpt-connector.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
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

const server = new McpServer({ name: 'exocortex-chatgpt-connector', version: '0.1.1' });

server.registerTool('query', {
  title: 'Send a prompt to ChatGPT',
  description: 'BLOCKING 10s-30min. Agents: use submit + sleep + read-file pattern instead to avoid wasting context. This sync tool is for CLI and interactive single-user use. Sends a prompt and waits for completion. Uses submit+poll+fetch under the hood.',
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
  const result = await queuedQuery(prompt, { fresh, model, thinking, agent, mode, output_dir });
  if ((mode || 'text') === 'image') {
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
  return { content: [{ type: 'text', text: result.text }] };
});

server.registerTool('generate_image', {
  title: 'Generate image(s) with ChatGPT',
  description: 'BLOCKING 10s-30min. Agents: use submit + sleep + read-file pattern instead to avoid wasting context. This sync tool is for CLI and interactive single-user use. Sends an image-generation prompt, waits for completion (up to 3 minutes), downloads images from the latest assistant response, and returns local file paths.',
  inputSchema: {
    prompt: z.string().min(1),
    output_dir: z.string().optional().describe('Optional output directory. Defaults to ~/.chatgpt-mcp/images/<timestamp>-<slug>/'),
    fresh: z.boolean().optional().describe('Start a new chat before sending.'),
    model: z.string().optional().describe('Switch to this model first (matches by visible name).'),
    thinking: z.string().optional().describe('Thinking level: "standard" or "longer" (Pro/Thinking models only).'),
    key: z.string().optional(),
  },
}, async ({ prompt, output_dir, fresh, model, thinking }) => {
  const result = await generateImage(prompt, { output_dir, fresh, model, thinking });
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

server.registerTool('submit', {
  title: 'Submit async ChatGPT request',
  description: 'Queues a prompt and returns immediately with { request_id, response_path, image_dir? }. The response file appears at response_path when ready (typically 10s-30min depending on model/mode). Canonical agent pattern: submit -> receive paths -> sleep (macx-tmux) -> notification from send-to-agent.sh includes the path -> read the file directly. Do NOT use the blocking query/generate_image tools from agents; they waste context blocking for minutes.',
  inputSchema: {
    prompt: z.string().min(1),
    agent: z.string().optional().describe('Agent label to notify when response is ready.'),
    model: z.string().optional().describe('Switch to this model before prompt submission.'),
    thinking: z.string().optional().describe('Thinking level: "standard" or "longer".'),
    fresh: z.boolean().optional().describe('Start a new chat in the worker tab before sending.'),
    mode: z.enum(['text', 'image']).optional().describe('Response mode. Use "image" for file downloads.'),
    output_dir: z.string().optional().describe('Optional output directory for image downloads when mode=image.'),
    key: z.string().optional(),
  },
}, async ({ prompt, agent, model, thinking, fresh, mode, output_dir }) => {
  await ensureDaemonRunning();
  const result = await submit(prompt, { agent, model, thinking, fresh, mode, output_dir });
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
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
    const s = await requestStatus(request_id);
    return { content: [{ type: 'text', text: JSON.stringify(s) }] };
  }

  const s = await sessionStatus();
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
  const payload = await fetchRequest(request_id);
  return { content: [{ type: 'text', text: JSON.stringify(payload) }] };
});

server.registerTool('read_last_response', {
  title: 'Read last ChatGPT response',
  description: 'Reads the last assistant message from the active tab without sending anything.',
  inputSchema: { key: z.string().optional() },
}, async () => {
  const { text } = await readLast();
  return { content: [{ type: 'text', text }] };
});

server.registerTool('new_chat', {
  title: 'Open a new ChatGPT conversation',
  description: 'Starts a fresh chat.',
  inputSchema: { key: z.string().optional() },
}, async () => {
  await newChat();
  return { content: [{ type: 'text', text: 'ok' }] };
});

server.registerTool('set_model', {
  title: 'Switch ChatGPT model',
  description: 'Opens the model switcher and selects the item whose visible name contains the given string.',
  inputSchema: { name: z.string().min(1), key: z.string().optional() },
}, async ({ name }) => {
  const { model } = await setModel(name);
  return { content: [{ type: 'text', text: model ?? name }] };
});

server.registerTool('get_model', {
  title: 'Current ChatGPT model',
  description: 'Returns the label of the currently selected model.',
  inputSchema: { key: z.string().optional() },
}, async () => {
  const m = await getModel();
  return { content: [{ type: 'text', text: m ?? '' }] };
});

server.registerTool('set_thinking', {
  title: 'Set thinking/reasoning level',
  description: 'Sets the thinking level on Pro/Thinking models. Accepts "standard" or "longer".',
  inputSchema: { level: z.string().min(1), key: z.string().optional() },
}, async ({ level }) => {
  const { level: l } = await setThinking(level);
  return { content: [{ type: 'text', text: l }] };
});

server.registerTool('get_thinking', {
  title: 'Current thinking level',
  description: 'Returns the current thinking level label, or empty if not applicable.',
  inputSchema: { key: z.string().optional() },
}, async () => {
  const l = await getThinking();
  return { content: [{ type: 'text', text: l ?? '' }] };
});

server.registerTool('stop', {
  title: 'Stop current generation',
  description: 'Clicks the stop-generating button if a response is streaming.',
  inputSchema: { key: z.string().optional() },
}, async () => {
  await stop();
  return { content: [{ type: 'text', text: 'ok' }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('[mcp] exocortex-chatgpt-connector ready on stdio');
