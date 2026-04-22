# exocortex-chatgpt-connector

The lightweight alternative for hooking up ChatGPT image generation and GPT Pro to Claude Code or any agentic workspace. Optimized for Exocortex, the open-source sub-agent management system.

`exocortex-chatgpt-connector` exposes ChatGPT as local MCP + CLI + HTTP surfaces, with async-first workflows for long-running AI tasks.

## What It Does

- Sends ChatGPT Pro text requests and ChatGPT image-generation requests through local tools.
- Supports both blocking commands (`query`, `image`) and async orchestration (`submit_pro`, `submit_image`).
- Persists async state to disk so agents can submit work, continue other tasks, and fetch later.

## Why This Backend

- Uses **Camoufox** (Firefox-based) as the browser engine.
- Typical memory profile is materially lower than Chromium-based automation (roughly ~200MB vs ~400MB baseline in prior runs).
- Includes built-in stealth / anti-detection hardening from Camoufox.

## Core Capabilities

- **Async mailbox** for non-blocking AI workflows (`requests/` + `responses/` files).
- **Per-agent tab isolation** so concurrent agents do not collide in a shared tab.
- **Resilient response routing** with notification hooks that support escalation-chain workflows when a target agent is unavailable.
- **`submit_pro`** for deep reasoning (GPT Pro + longer thinking).
- **`submit_image`** for image generation with durable local file output.
- **Durable image handling** with verified writes before completion.

## Install

Requires Node.js 18+.

```bash
npm install
```

Camoufox browser binaries are fetched automatically by `postinstall`.
If you need to run it manually:

```bash
npm run camoufox:fetch
```

## First Login (One Time Per Profile)

```bash
# open interactive login window
node cli.mjs launch --visible
```

Log into ChatGPT in that window once. The connector reuses your persisted Firefox/Camoufox profile under `~/.chatgpt-mcp/profile` (or `CHATGPT_MCP_HOME/profile`).

## Quick Start

Run these in separate terminals:

```bash
node cli.mjs launch
node cli.mjs daemon
node cli.mjs server
```

Then use tools via MCP or CLI:

```bash
node cli.mjs status
node cli.mjs query "one-sentence summary of TCP slow start"
node cli.mjs submit "deep architecture analysis" --agent planner
node cli.mjs fetch <request_id>
node cli.mjs image "minimal red warning icon on transparent background"
```

## MCP Tools

Primary async tools:

- `submit_pro`: non-blocking deep reasoning submission.
- `submit_image`: non-blocking image-generation submission.
- `status`: queue/session status.
- `fetch`: read completed async results.

Sync convenience tools remain available (`query`, `generate_image`) for interactive/manual usage.

## Async Pattern (Recommended for Agents)

1. Submit with `submit_pro` or `submit_image`.
2. Continue other work while the daemon processes requests.
3. Wait for notification or poll status.
4. Read response JSON from `responses/<request_id>.json`.

## HTTP API

```bash
node cli.mjs http
```

Uses a bearer token stored at `~/.chatgpt-mcp/token`.

## Attribution

This project is MIT licensed and forked from:

- [guilhermesilveira/chatgpt-mcp](https://github.com/guilhermesilveira/chatgpt-mcp)

The connector has been substantially extended into an Exocortex-optimized async orchestration toolchain with image-generation support and per-agent isolation.

## License

MIT
