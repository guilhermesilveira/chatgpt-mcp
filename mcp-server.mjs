#!/usr/bin/env node
// MCP server over stdio for chatgpt-mcp.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  query, readLast, status, newChat, setModel, getModel,
  setThinking, getThinking, stop,
} from './browser-controller.mjs';

const server = new McpServer({ name: 'chatgpt-mcp', version: '0.1.0' });

server.registerTool('query', {
  title: 'Send a prompt to ChatGPT',
  description: 'Sends a prompt to ChatGPT web UI and waits for the full response (can take up to an hour for long thinking). Returns the assistant text.',
  inputSchema: {
    prompt: z.string().min(1),
    fresh: z.boolean().optional().describe('Start a new chat before sending.'),
    model: z.string().optional().describe('Switch to this model first (matches by visible name).'),
    thinking: z.string().optional().describe('Thinking level: "standard" or "longer" (Pro/Thinking models only).'),
    key: z.string().optional(),
  },
}, async ({ prompt, fresh, model, thinking }) => {
  const { text } = await query(prompt, { fresh, model, thinking });
  return { content: [{ type: 'text', text }] };
});

server.registerTool('read_last_response', {
  title: 'Read last ChatGPT response',
  description: 'Reads the last assistant message from the active tab without sending anything.',
  inputSchema: { key: z.string().optional() },
}, async () => {
  const { text } = await readLast();
  return { content: [{ type: 'text', text }] };
});

server.registerTool('status', {
  title: 'ChatGPT session status',
  description: 'Returns JSON { state: ready|busy|not_logged_in, model, thinking }. Model and thinking level are read passively from the composer pill.',
  inputSchema: { key: z.string().optional() },
}, async () => {
  const s = await status();
  return { content: [{ type: 'text', text: JSON.stringify(s) }] };
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
console.error('[mcp] chatgpt-mcp ready on stdio');
