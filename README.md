# chatgpt-mcp

Local MCP server that drives the ChatGPT web UI via [patchright](https://github.com/Kaliiiiiiiiii-Vinyzu/patchright) (a stealth Playwright fork). Keeps a persistent Chrome profile so you log in once, then Claude Code, your scripts, and a CLI can share the same ChatGPT session concurrently over CDP.

Exposes three surfaces on top of the same browser controller:

- **MCP server** (stdio) — for Claude Code and any MCP client.
- **HTTP API** (localhost, bearer token) — for shell scripts and remote helpers.
- **CLI** — `chatgpt-mcp <subcommand>`.

## Features

- **Persistent login** — one-time sign-in in a dedicated Chrome profile; session survives restarts
- **Shared session over CDP** — launcher keeps Chrome open; MCP server, HTTP API, and CLI attach to the same browser via `http://127.0.0.1:9222`
- **Single-threaded controller** — every mutating op goes through a FIFO mutex so concurrent calls never collide
- **Long responses** — no internal timeout on generation; a single reply can take up to an hour (deep research, Pro Thinking) without anything bailing
- **Model switching** — `Instant` / `Thinking` / `Pro` via stable `data-testid` map
- **Thinking-level switching** — `Standard` / `Longer` on Pro/Thinking models, matched by SVG sprite icon (locale-independent) with localized-text fallback
- **Structured status** — reads current model + thinking level passively from the composer pill (no menus opened)
- **Selector self-heal** — `chatgpt-mcp check` walks `selectors.json` against the live page and reports misses when ChatGPT rotates markup

## Quick Start

Requires Node.js 18+ and a local Google Chrome install.

```bash
git clone git@github.com:guilhermesilveira/chatgpt-mcp.git
cd chatgpt-mcp
npm install
npm link                       # exposes `chatgpt-mcp` on PATH

# Terminal 1 — launch Chrome, log in once
chatgpt-mcp launch

# Terminal 2 — use it
chatgpt-mcp status
chatgpt-mcp query "what is 2+2? one word"
```

## How it works

```
         ┌─────────────────┐    CDP (127.0.0.1:9222)
         │  launcher.mjs   │◀──────────────┐
         │  (persistent    │               │
         │   Chrome tab)   │               │
         └─────────────────┘               │
                                           │
                          ┌────────────────┴──────────────┐
                          │    browser-controller.mjs     │
                          │    (patchright, FIFO mutex)   │
                          └──┬────────────┬────────────┬──┘
                             │            │            │
                     mcp-server.mjs   http-api.mjs   cli.mjs
                        (stdio)      (bearer token)
```

The first process to call the controller tries to attach over CDP; if the launcher isn't running, it falls back to launching its own persistent context. Either way the profile lives at `~/.chatgpt-mcp/profile/`.

## CLI

```bash
chatgpt-mcp launch              # start Chrome with persistent profile + CDP
chatgpt-mcp server              # run the MCP stdio server (for Claude Code)
chatgpt-mcp http                # run the localhost HTTP API
chatgpt-mcp status              # state=ready model=Pro thinking=Länger
chatgpt-mcp query "prompt..."   # send a prompt, print the reply
chatgpt-mcp last                # print the last assistant message
chatgpt-mcp new                 # open a new chat
chatgpt-mcp model               # print current model
chatgpt-mcp model pro           # switch model
chatgpt-mcp thinking            # print current thinking level
chatgpt-mcp thinking longer     # switch thinking level
chatgpt-mcp stop                # abort an in-flight generation
chatgpt-mcp check               # selector self-heal report
```

`query` flags:

```bash
chatgpt-mcp query --fresh --model pro --thinking longer "complex question..."
```

- `--fresh` — start a new chat first.
- `--model <name>` — switch model first. Known names: `instant`, `thinking`, `pro` (see `selectors.json → model.name_map`).
- `--thinking <level>` — set thinking level first. Known: `standard`, `longer`.

## MCP tools

Registered by `mcp-server.mjs`:

| Tool | Description |
|------|-------------|
| `query` | Send prompt, wait for full reply, return text. Supports `fresh`, `model`, `thinking`. |
| `read_last_response` | Read the last assistant message without sending anything. |
| `status` | JSON `{ state, model, thinking }`. |
| `new_chat` | Open a new chat. |
| `set_model` / `get_model` | Switch / read current model. |
| `set_thinking` / `get_thinking` | Switch / read current thinking level. |
| `stop` | Abort an in-flight generation. |

### Wiring it into Claude Code

```bash
claude mcp add chatgpt --scope user -- chatgpt-mcp server
```

(Adjust the command if you did not `npm link`; use the absolute path to `cli.mjs server` instead.)

## HTTP API

```bash
chatgpt-mcp http                # listens on 127.0.0.1:8765
```

Token is auto-generated at first run and stored at `~/.chatgpt-mcp/token` (mode 0600). Pass it as `Authorization: Bearer <token>`.

```bash
TOKEN=$(cat ~/.chatgpt-mcp/token)

curl -s -H "Authorization: Bearer $TOKEN" http://127.0.0.1:8765/status
curl -s -H "Authorization: Bearer $TOKEN" \
  -X POST -H "content-type: application/json" \
  -d '{"prompt":"hello","fresh":true,"model":"pro","thinking":"longer"}' \
  http://127.0.0.1:8765/query

curl -s -H "Authorization: Bearer $TOKEN" http://127.0.0.1:8765/last
curl -s -H "Authorization: Bearer $TOKEN" -X POST http://127.0.0.1:8765/new
curl -s -H "Authorization: Bearer $TOKEN" http://127.0.0.1:8765/model
curl -s -H "Authorization: Bearer $TOKEN" -X POST -d '{"name":"pro"}' http://127.0.0.1:8765/model
curl -s -H "Authorization: Bearer $TOKEN" http://127.0.0.1:8765/thinking
curl -s -H "Authorization: Bearer $TOKEN" -X POST -d '{"level":"longer"}' http://127.0.0.1:8765/thinking
curl -s -H "Authorization: Bearer $TOKEN" -X POST http://127.0.0.1:8765/stop
```

Request timeout on the server is disabled (`requestTimeout=0`) so a 1-hour Pro reply won't be cut off.

## Selector self-heal

ChatGPT's DOM changes often. If a tool starts failing:

```bash
chatgpt-mcp check
```

Walks every selector in `selectors.json` against the live page and prints `OK`/`MISS` per entry. Exits non-zero if anything is missing. Re-capture the relevant state and update `selectors.json` directly — no code changes needed.

To re-capture a state:

1. In Chrome DevTools Console: `copy(document.documentElement.outerHTML)`
2. `pbpaste > dom-samples/<state>.html`
3. Inspect the HTML and update `selectors.json`.

For menus (Radix menus close on blur), enable **"Emulate a focused page"** in DevTools (Cmd+Shift+P → `focused`) or use the setTimeout trick:

```js
setTimeout(() => copy(document.documentElement.outerHTML), 5000)
```

then open the menu within 5 seconds.

## Optional PM2 service

If you want `chatgpt-mcp launch` to run as a service and survive reboots:

```bash
npm install -g pm2
pm2 start chatgpt-mcp --name chatgpt-mcp -- launch
pm2 save
pm2 startup
```

PM2 is optional; you can also run `chatgpt-mcp launch` by hand or from a login script. Same recipe works for the HTTP API:

```bash
pm2 start chatgpt-mcp --name chatgpt-mcp-http -- http
```

Note that `launch` opens a visible Chrome window. On a headless server, that's not going to work — this project is built for local use with a real user session.

## Running the MCP server directly

For Claude Code users who haven't `npm link`ed:

```json
{
  "mcpServers": {
    "chatgpt": {
      "command": "node",
      "args": ["/absolute/path/to/chatgpt-mcp/cli.mjs", "server"]
    }
  }
}
```

## Configuration

All state lives in `~/.chatgpt-mcp/`:

| Path | What |
|------|------|
| `~/.chatgpt-mcp/profile/` | Chrome user data dir (login cookies, settings) |
| `~/.chatgpt-mcp/cdp` | Current CDP URL (written by the launcher) |
| `~/.chatgpt-mcp/token` | Bearer token for the HTTP API (mode 0600) |

Environment variables:

| Var | Default | Notes |
|-----|---------|-------|
| `CDP_PORT` | `9222` | Port the launcher exposes for CDP |
| `CHATGPTPRO_CDP` | _(read from `~/.chatgpt-mcp/cdp`)_ | Override CDP endpoint for the controller |
| `PORT` | `8765` | HTTP API port |

## Deployment

There's no "deploy" target — this is a local service that drives a logged-in ChatGPT tab on your machine. If you need it on another machine, clone the repo there and run `chatgpt-mcp launch` + sign in there. The profile is not portable between machines.

## License

MIT
