# ChatGPT MCP: GPT-5 Pro + Image Generation for Claude Code

`chatgpt-mcp` is an MCP (Model Context Protocol) server that lets any MCP client use your ChatGPT Pro account for:

- GPT-5 Pro deep reasoning
- ChatGPT image generation
- Async, non-blocking workflows (`submit -> do other work -> fetch later`)

If you searched for `ChatGPT MCP`, `GPT-5 Pro MCP`, `ChatGPT image generation MCP`, or `use ChatGPT from Claude Code`, this is the connector.

## Why This Exists

Most MCP tools are API-key based and synchronous.
This connector is different:

- Uses your own ChatGPT Pro subscription.
- Works from Claude Code or any MCP-compatible client.
- Built for long-running requests that should not block your agent loop.

## 3-Line Setup

```bash
npm install -g chatgpt-mcp
chatgpt-mcp launch --visible
chatgpt-mcp launch
```

First run `--visible` to log in once to ChatGPT.
After that, the daemon runs headless and reuses your persisted session.

Then register it in `~/.claude.json`:

```json
{
  "mcpServers": {
    "chatgpt": {
      "type": "stdio",
      "command": "chatgpt-mcp",
      "args": ["server"]
    }
  }
}
```

## Prerequisites

- ChatGPT Pro subscription
- Chrome installed
- Node.js 20+

## How It Works (Honest Version)

- This is browser automation against your own ChatGPT Pro session.
- The daemon runs Chrome via `patchright` with a persistent profile.
- Login once, then the session persists for future headless runs.

## Async Workflow (Non-Blocking)

Use this pattern for hard reasoning or image generation:

1. Submit work with `submit_pro` or `submit_image`.
2. Continue other coding/agent tasks.
3. Check `status` when convenient.
4. Call `fetch` to retrieve final output and files.

## MCP Tools (Exactly 5)

1. `submit_pro`
- Submit async GPT-5 Pro request with extended thinking.
- Returns immediately with `request_id` and `response_path`.
- Use for architecture decisions, deep debugging, hard analysis.

2. `submit_image`
- Submit async image generation request.
- Returns immediately with `request_id` and `image_dir`.
- Use for UI assets, carousel imagery, illustrations, mockups.

3. `query`
- Sync convenience for simple one-shot questions.
- Blocking.

4. `status`
- Check daemon session status or async request status.

5. `fetch`
- Fetch async request result (text, files, completion state).

## Real Usage Examples

### `submit_pro`: Deep Reasoning Without Blocking

Submit:

```json
{
  "tool": "submit_pro",
  "args": {
    "prompt": "Analyze why our websocket reconnect logic causes duplicate subscriptions. Propose a safe refactor with rollout plan and test strategy."
  }
}
```

Immediate response (example):

```json
{
  "request_id": "req_7f9c...",
  "response_path": "~/.chatgpt-mcp/agents/readme-chatgpt-mcp/pro/req_7f9c....md"
}
```

Do other work, then:

```json
{
  "tool": "fetch",
  "args": {
    "request_id": "req_7f9c..."
  }
}
```

### `submit_image`: Async Image Generation

Submit:

```json
{
  "tool": "submit_image",
  "args": {
    "prompt": "Create a clean onboarding illustration: developer at desk, teal/orange palette, transparent background, modern flat style."
  }
}
```

Immediate response (example):

```json
{
  "request_id": "img_b21a...",
  "image_dir": "~/.chatgpt-mcp/agents/readme-chatgpt-mcp/images/img_b21a..."
}
```

Later:

```json
{
  "tool": "status",
  "args": {
    "request_id": "img_b21a..."
  }
}
```

Then fetch outputs:

```json
{
  "tool": "fetch",
  "args": {
    "request_id": "img_b21a..."
  }
}
```

## Per-Agent Output Routing

Each agent gets isolated output directories:

- Text responses: `~/.chatgpt-mcp/agents/<agent-name>/pro/`
- Generated images: `~/.chatgpt-mcp/agents/<agent-name>/images/`

This makes concurrent multi-agent workflows safe and traceable.

## Best Fit

- Claude Code users who want GPT-5 Pro for difficult reasoning tasks.
- MCP users who want ChatGPT image generation in the same toolchain.
- Agentic workflows that need async, non-blocking submit/fetch patterns.

## License

MIT
