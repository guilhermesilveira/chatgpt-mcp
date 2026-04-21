#!/usr/bin/env node
// MCP server over stdio for exocortex-chatgpt-connector.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerMcpTools } from './mcp-tools.mjs';

const server = new McpServer({ name: 'exocortex-chatgpt-connector', version: '0.1.1' });
registerMcpTools(server);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('[mcp] exocortex-chatgpt-connector ready on stdio');
