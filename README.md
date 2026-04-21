# exocortex-chatgpt-connector

Async multi-agent orchestration layer over ChatGPT Pro. Stream text and image generation to disk from any MCP client.

## Attribution

This project started as a fork of [guilhermesilveira/chatgpt-mcp](https://github.com/guilhermesilveira/chatgpt-mcp) v0.1.1. The patchright CDP attach and selector self-heal mechanisms are derived from that work. Extended into an async multi-agent orchestration layer with file-backed request queue, daemon workflow, ephemeral per-request tab lifecycle, per-agent notification hooks, and image generation with authenticated downloads.

Under the hood this still drives the ChatGPT web UI via [patchright](https://github.com/Kaliiiiiiiiii-Vinyzu/patchright) (a stealth Playwright fork). It keeps a persistent Chrome profile so you log in once, then MCP clients, scripts, and CLI tooling can share the same ChatGPT session over CDP.

Exposes three surfaces on top of the same browser controller:

- **MCP server** (stdio) — for Claude Code and any MCP client.
- **HTTP API** (localhost, bearer token) — for shell scripts and remote helpers.
- **CLI** — `exocortex-chatgpt <subcommand>`.

## Features

- **Async queue-first orchestration** — submit work and get a `request_id` immediately; daemon workers process prompts independently and persist complete/error state to disk.
- **Ephemeral per-request tab lifecycle** — each async request runs in its own marked tab, then closes only after durable response persistence.
- **Agent-aware notifications** — optional per-agent callbacks fire when responses are ready, enabling multi-agent handoff workflows.
- **Text + image pipeline** — unified async flow for text and image generation, including authenticated image download to local files.
- **Shared persistent session over CDP** — one login in a dedicated Chrome profile, reused by launcher, CLI, MCP server, and HTTP API.
- **Long-running response tolerance** — no short internal timeout; Pro/Thinking responses can run for extended durations.
- **Model + thinking controls** — robust model/thinking switching with localized and icon-based fallback selectors.
- **Selector self-heal checks** — `exocortex-chatgpt check` validates critical selectors against live ChatGPT markup.

## Quick Start

Requires Node.js 18+ and a local Google Chrome install.

```bash
npm install -g @fredluz/exocortex-chatgpt-connector   # installs `exocortex-chatgpt` globally

# Terminal 1 — launch Chrome, log in once
exocortex-chatgpt launch

# Terminal 2 — run async worker
exocortex-chatgpt daemon

# Terminal 3 — use it
exocortex-chatgpt status
exocortex-chatgpt query "what is 2+2? one word"
```

Legacy alias: `chatgpt-mcp` remains available for compatibility, but `exocortex-chatgpt` is the primary CLI name.

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
                          │ (legacy single tab + async    │
                          │   ephemeral tab helpers)       │
                          └──┬────────────┬────────────┬──┘
                             │            │            │
                     mcp-server.mjs   http-api.mjs   cli.mjs
                        (stdio)      (bearer token)
                             │            │            │
                             └──────┬─────┴─────┬─────┘
                                    │ mailbox.mjs │
                                    │ requests/    │
                                    │ responses/   │
                                    └──────┬──────┘
                                           │
                                      daemon.mjs
```

The first process to call the controller tries to attach over CDP; if the launcher isn't running, it falls back to launching its own persistent context. Either way the profile lives at `~/.chatgpt-mcp/profile/`.

## CLI

```bash
exocortex-chatgpt launch              # launch Chrome off-screen by default (prevents focus stealing)
exocortex-chatgpt launch --visible    # debug mode: keep Chrome on-screen
exocortex-chatgpt daemon              # async mailbox worker (open per-request tab, persist, notify)
exocortex-chatgpt server              # run the MCP stdio server (for Claude Code)
exocortex-chatgpt http                # run the localhost HTTP API
exocortex-chatgpt status              # state=ready model=Pro thinking=Länger
exocortex-chatgpt status <request_id> # queued request status JSON
exocortex-chatgpt submit "prompt..." --agent foo   # queue prompt, print request_id immediately
exocortex-chatgpt fetch <request_id>  # fetch queued response JSON
exocortex-chatgpt query "prompt..."   # send a prompt, print the reply
exocortex-chatgpt image "prompt..."   # generate image(s), download, print local file paths
exocortex-chatgpt last                # print the last assistant message
exocortex-chatgpt new                 # open a new chat
exocortex-chatgpt model               # print current model
exocortex-chatgpt model pro           # switch model
exocortex-chatgpt thinking            # print current thinking level
exocortex-chatgpt thinking longer     # switch thinking level
exocortex-chatgpt stop                # abort an in-flight generation
exocortex-chatgpt tabs cleanup        # close leftover async worker tabs (including error tabs)
exocortex-chatgpt check               # selector self-heal report
```

`query` flags:

```bash
exocortex-chatgpt query --fresh --model pro --thinking longer "complex question..."
```

- `--fresh` — start a new chat first.
- `--model <name>` — switch model first. Known names: `instant`, `thinking`, `pro` (see `selectors.json → model.name_map`).
- `--thinking <level>` — set thinking level first. Known: `standard`, `longer`.
- `--agent <name>` — tag queued work for notifications and per-agent parallel scheduling.
- `--mode <text|image>` — only for async `submit`/`query`; `image` waits for files and returns file paths.
- `--image` — shorthand for `--mode image` in async commands.
- `--output-dir <path>` — destination directory for downloaded images (`image` command, or async with `--mode image`). Default: `~/.chatgpt-mcp/images/<timestamp>-<slug>/`.

`image` output:

- Prints one absolute file path per line.
- Downloads all images found in the latest assistant message.
- Uses a 3-minute generation timeout.

## Async mailbox queue

Queue layout (crash-safe, file-based):

- `~/.chatgpt-mcp/requests/<id>.json` — pending/active requests
- `~/.chatgpt-mcp/responses/<id>.json` — complete/error responses

`request_id` format:

- `<timestamp>-<random4>-<agent>`

Flow:

1. `submit` writes request JSON atomically and returns `request_id` immediately.
2. `daemon` claims requests and runs each request in its own ephemeral ChatGPT tab.
3. On success, daemon writes `responses/<id>.json` atomically, fsyncs, reads back to verify, then closes the tab.
4. On failure, daemon writes `responses/<id>.json` with `state=error` and leaves the tab open for inspection.
5. If `~/.clawd/bin/send-to-agent.sh` exists, daemon pings `<agent>` when the response is ready.

Daemon tab lifecycle:

- Startup: closes stale `chatgpt-mcp-active:*` tabs from prior crashes.
- Shutdown: closes active worker tabs; error tabs are intentionally preserved.
- Manual cleanup: `exocortex-chatgpt tabs cleanup` closes all daemon-marked tabs (including error tabs).

Example:

```bash
RID=$(exocortex-chatgpt submit --agent worker-a --model pro --thinking longer "summarize this PR")
exocortex-chatgpt status "$RID"     # {"state":"pending",...}
# ...do unrelated work...
exocortex-chatgpt fetch "$RID"      # {"text":"...","files":[],"complete":true}
```

Async image example:

```bash
RID=$(exocortex-chatgpt submit --mode image --output-dir /tmp/chatgpt-images "Create a red warning triangle PNG with transparent background")
exocortex-chatgpt status "$RID"
exocortex-chatgpt fetch "$RID"      # {"text":"...","files":["/tmp/chatgpt-images/01.png"],"complete":true}
```

## MCP tools

Registered by `mcp-server.mjs`:

Async-first guidance for agents: see [ASYNC_PATTERN.md](./ASYNC_PATTERN.md).

| Tool | Description |
|------|-------------|
| `query` | Convenience wrapper over submit+poll+fetch. Supports `fresh`, `model`, `thinking`, `agent`, `mode`, `output_dir`. In `mode=image`, returns JSON with files. |
| `generate_image` | Synchronous image flow on the shared tab. Waits up to 3 minutes, downloads one or more images, returns JSON `{ files, text? }`. Supports `output_dir`, `fresh`, `model`, `thinking`. |
| `submit` | Queue a prompt and return `{ request_id, response_path, image_dir? }` immediately. Supports `agent`, `fresh`, `model`, `thinking`, `mode`, `output_dir`. |
| `status` | With `request_id`: queued request status `{ state, agent, elapsed_ms, error? }`. Without `request_id`: session status `{ state, model, thinking }`. |
| `fetch` | Fetch queued request result `{ text, files[], complete, error? }`. |
| `read_last_response` | Read the last assistant message without sending anything. |
| `new_chat` | Open a new chat. |
| `set_model` / `get_model` | Switch / read current model. |
| `set_thinking` / `get_thinking` | Switch / read current thinking level. |
| `stop` | Abort an in-flight generation. |

### Wiring it into Claude Code

```bash
claude mcp add chatgpt --scope user -- exocortex-chatgpt server
```

(Adjust the command if you did not `npm link`; use the absolute path to `cli.mjs server` instead.)

If you want to expose this server under an image-specific name in Claude Code:

```bash
claude mcp add chatgpt-image --scope user -- exocortex-chatgpt server
```

## HTTP API

```bash
exocortex-chatgpt http                # listens on 127.0.0.1:8765
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
exocortex-chatgpt check
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

## Tests

Pure-logic unit tests with Node's built-in test runner — no browser, no extra deps:

```bash
npm test
```

Covers the pill-text parser (`parse-pill.mjs`), CLI flag parser (`flags.mjs`), and `selectors.json` shape invariants.

## Optional PM2 service

If you want `exocortex-chatgpt launch` to run as a service and survive reboots:

```bash
npm install -g pm2
pm2 start exocortex-chatgpt --name exocortex-chatgpt -- launch
pm2 save
pm2 startup
```

PM2 is optional; you can also run `exocortex-chatgpt launch` by hand or from a login script. Same recipe works for the HTTP API:

```bash
pm2 start exocortex-chatgpt --name exocortex-chatgpt-http -- http
```

Note that `launch` opens a visible Chrome window. On a headless server, that's not going to work — this project is built for local use with a real user session.

## Running the MCP server directly

For Claude Code users who haven't `npm link`ed:

```json
{
  "mcpServers": {
    "chatgpt": {
      "command": "node",
      "args": ["/absolute/path/to/exocortex-chatgpt-connector/cli.mjs", "server"]
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
| `~/.chatgpt-mcp/images/` | Default image-download root for `image` CLI and `generate_image` MCP tool |

Environment variables:

| Var | Default | Notes |
|-----|---------|-------|
| `CDP_PORT` | `9222` | Port the launcher exposes for CDP |
| `CHATGPTPRO_CDP` | _(read from `~/.chatgpt-mcp/cdp`)_ | Override CDP endpoint for the controller |
| `PORT` | `8765` | HTTP API port |

## Deployment

There's no "deploy" target — this is a local service that drives a logged-in ChatGPT tab on your machine. If you need it on another machine, clone the repo there and run `exocortex-chatgpt launch` + sign in there. The profile is not portable between machines.

## License

MIT
