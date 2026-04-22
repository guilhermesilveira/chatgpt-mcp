# Migration Notes: Camoufox Backend

## Browser Owner Model

- The runtime now uses a **single-owner browser model**.
- `launch` owns the long-lived Camoufox context.
- CLI one-shot controller operations run in **attach-only mode** and shut down their local handles after each command instead of owning browser lifetime.

## Profile Migration

- Browser backend switched from Chromium-family automation to Firefox/Camoufox profile storage.
- Users must log in again once using the new persistent profile.
- Profile path remains `~/.chatgpt-mcp/profile` (or `CHATGPT_MCP_HOME/profile`).

## Known Differences vs Chromium Backend

- No Chromium CDP-style cross-process attach contract.
- Browser reuse is enforced through the single-owner launcher pattern.
- Launch behavior and rendering characteristics follow Firefox/Camoufox semantics.
- Memory footprint is typically lower under comparable workloads.

## Image Download Fallback

- Image download keeps authenticated network fetching for normal URLs.
- Blob/canvas-backed image responses use an in-page canvas/blob extraction fallback to preserve output reliability.
