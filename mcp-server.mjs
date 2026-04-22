#!/usr/bin/env node
// MCP server over stdio for chatgpt-mcp.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerMcpTools } from './mcp-tools.mjs';

const server = new McpServer({ name: 'chatgpt-mcp', version: '0.1.1' });
registerMcpTools(server);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('[mcp] chatgpt-mcp ready on stdio');
