# Async Pattern for Agents

This repo supports both synchronous and asynchronous request flows.
For agents, the async flow is the default and recommended path.

## Why async

- Sync tools (`query`, `generate_image`) can block for 10 seconds to 30 minutes.
- Blocking for long waits burns agent context and tool budget.
- Async tools return file paths immediately, so agents can wait cheaply and resume with direct file reads.

## Canonical flow

1. Call `submit` with `prompt` and optional `mode`.
2. Read immediate result:
   - `request_id`
   - `response_path`
   - `image_dir` (only when `mode=image`)
3. Sleep with wake-on-signal (for example, macx-tmux `sleep`).
4. Wait for daemon notification from `send-to-agent.sh`.
5. Parse the path from the notification text.
6. Read `response_path` directly from disk.
7. Use `files` from the response payload (and `image_dir` for image batches).

## Submit return shape

Text mode:

```json
{
  "request_id": "<id>",
  "response_path": "~/.chatgpt-mcp/responses/<id>.json"
}
```

Image mode:

```json
{
  "request_id": "<id>",
  "response_path": "~/.chatgpt-mcp/responses/<id>.json",
  "image_dir": "~/.chatgpt-mcp/images/<timestamp>-<slug>"
}
```

`response_path` is always present.

## Notification formats

Text completion:

```text
exocortex-chatgpt response ready: <request_id> at <response_path> — preview: <text>
```

Image completion:

```text
exocortex-chatgpt images ready: <request_id> in <image_dir> — <N> file(s)
```

These messages are designed so agents can parse paths and read files directly.

## Response file format

`response_path` points to a JSON file written by the daemon.
Typical fields include:

- `request_id`
- `state` (`complete` or `error`)
- `text`
- `files` (array of image/file paths)
- `error` (only when `state=error`)
- timing metadata (`created_at`, `started_at`, `finished_at`, `elapsed_ms`)

Agents should treat this file as the source of truth.

## Pseudocode example

```text
result = submit(prompt, mode="image")
request_id = result.request_id
response_path = result.response_path
image_dir = result.image_dir

sleep(wake_on_signal=true)
# daemon sends: "... ready: <id> at <response_path> ..." or "... in <image_dir> ..."

payload = read_json(response_path)
if payload.state == "error":
  raise payload.error

files = payload.files
text = payload.text
```

## When to use sync tools

Use sync tools only for:

- interactive one-off CLI usage
- manual debugging where blocking is acceptable

Avoid sync tools in autonomous agent loops.

## Optional compatibility path

`fetch(request_id)` is still available as a convenience wrapper.
It is not required if the agent already has `response_path`.
