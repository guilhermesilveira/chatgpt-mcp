# Spec: Lighter Browser Backend for exocortex-chatgpt-connector

Created: Wednesday, April 22, 2026
Status: approved (conversational approval from Fred)
Test Mode: e2e-only

## Problem

The connector currently uses patchright (Chromium fork) as its browser backend. Chromium consumes ~400MB RAM per instance. On Fred's constrained Mac (12GB free after cleanup), every megabyte matters — especially when the connector runs alongside 20+ agents and multiple Claude/Codex sessions.

## Goal

Replace patchright with a lighter browser that reduces RAM by 30-50%+ while maintaining:
- Full ChatGPT web UI interaction (text submit, image generation, async mailbox)
- Anti-detection / stealth capabilities (ChatGPT must not flag as bot)
- All existing functionality: ephemeral per-request tabs, tab lifecycle management, image extraction to disk, daemon mode

## Candidates

### Primary: Camoufox
- Firefox-based, ~200MB vs ~400MB (50% reduction)
- Built-in stealth (fingerprint spoofing, anti-detection)
- Playwright-compatible API (`playwright.firefox.launch()`)
- Active maintenance, MIT licensed
- Known working for ChatGPT automation in the community

### Stretch: Even lighter options
- If research finds a browser that gets below 200MB while maintaining JS rendering + stealth, prefer it
- Headless-only won't work — ChatGPT requires full rendering
- Must have Playwright or Puppeteer-compatible API for practical migration

## Scope

### In scope
- `browser-controller.mjs` — primary rewrite target. All Chromium-specific APIs → Firefox/Camoufox equivalents
- `daemon.mjs` — browser launch configuration, profile paths, off-screen flags
- Selector updates if Firefox renders ChatGPT differently than Chromium
- `package.json` — swap patchright dependency for camoufox (or equivalent)
- All existing tests must pass after migration
- README update documenting the browser change

### Out of scope
- `mailbox.mjs` — browser-agnostic (uses browser-controller interface)
- `mcp-server.mjs` / `mcp-tools.mjs` — browser-agnostic
- New features — this is a backend swap, not a feature add
- Upstream PR — this is our own product now

## Key Constraints

1. **Profile persistence**: The existing Chrome profile at `~/.chatgpt-mcp/profile/` stores Fred's ChatGPT login. The new browser needs its own persistent profile directory. Fred will need to log in once after the switch.
2. **Off-screen launch**: daemon currently launches Chromium off-screen (position: -9999, -9999). Firefox equivalent needed.
3. **Image extraction**: `page.evaluate()` for extracting image data from ChatGPT's canvas/img elements must work in Firefox.
4. **Tab lifecycle**: Ephemeral tabs (create → interact → extract → close) must work with Firefox tab API.
5. **CDP dependency check**: If browser-controller uses Chrome DevTools Protocol directly (not just Playwright), those paths need Firefox equivalents or removal.

## Success Criteria

1. `npm test` — all existing tests pass
2. RAM usage measurably lower than patchright (target: <250MB resident)
3. Live smoke tests pass:
   - Text submit via `submit_pro` → response received
   - Image submit via `submit_image` → PNG files on disk
   - Async flow: submit → sleep → notification → fetch
4. ChatGPT doesn't flag or block the browser
5. Fred logs in once, profile persists across restarts

## Non-Goals

- Performance benchmarking beyond RAM
- Supporting multiple browser backends simultaneously
- Backwards compatibility with patchright
