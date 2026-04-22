# Lighter Browser Blueprint

Goal
Replace the current patchright/Chromium browser backend with the lightest viable full-browser backend for exocortex-chatgpt-connector while preserving logged-in ChatGPT automation, async mailbox behavior, per-request ephemeral tabs, disk-confirmed image persistence, and the product’s public positioning as the lightweight Exocortex-optimized ChatGPT connector.

Architecture stance
Camoufox is the approved default target.
Research did not produce a clearly lighter browser that still satisfies all three requirements at once: full JS-rendered ChatGPT compatibility, anti-detection/stealth, and practical Playwright-compatible automation. The only meaningfully “lighter” fallback is reusing a system-installed Chrome/Chromium binary, but that does not reduce runtime RAM and weakens the stealth posture. Because this product’s core risk is ChatGPT detection and session breakage, the blueprint should proceed assuming Camoufox unless a short live spike proves it cannot support the required session-sharing architecture.

This is not a drop-in dependency swap. The live codebase is built around Chromium CDP attach semantics, one-shot CLI teardown, and patchright-specific browser acquisition. Firefox/Camoufox can preserve persistent profile state, but it is unlikely to preserve the current “launch once, attach later from other processes over CDP” contract. The implementation must therefore either:
1. prove a viable attach/reuse path for Camoufox in this runtime, or
2. explicitly collapse browser ownership into one long-lived process/service and route all browser work through it.

That fallback is only safe if CLI/controller teardown semantics are changed first. Today cli.mjs wraps most one-shot commands in runController(), which always calls browser-controller.shutdown() in finally. Combined with browser-controller self-launching an owned context when CDP attach is unavailable, a naive owner-service migration would turn status/query/image/model/thinking/last/new/stop into “launch browser, do one action, immediately close browser.” Batch 1 must therefore treat runController()/shutdown() ownership semantics as a blocking architecture decision, not an implementation detail.

Approved product framing to preserve in docs
README and package metadata should position this repo as:
“The lightweight alternative for hooking up ChatGPT image generation and GPT Pro to Claude Code or any agentic workspace. Optimized for Exocortex, the open-source sub-agent management system.”
This repo is a standalone MIT-licensed open-source product, not an upstream PR.

Real codebase validation findings
1. Patchright is imported only in two runtime files:
   - /Users/fredluz/Code/chatgpt-mcp/browser-controller.mjs
   - /Users/fredluz/Code/chatgpt-mcp/launcher.mjs
   package.json and package-lock.json also pin patchright.

2. Chromium CDP is not incidental; it is central to the current architecture.
   - browser-controller.mjs imports chromium from patchright and calls chromium.connectOverCDP(url) at line 82.
   - browser-controller.mjs falls back to chromium.launchPersistentContext(PROFILE_DIR, ...) at line 102.
   - launcher.mjs also launches chromium.launchPersistentContext(PROFILE_DIR, ...) and exposes --remote-debugging-port on 127.0.0.1.
   - README explicitly documents “Shared persistent session over CDP”.
   Result: any Firefox/Camoufox migration that does not replace this attach model will break launcher/controller interoperability.

3. There are no direct CDP session method calls beyond connectOverCDP.
   - No newCDPSession usage was found.
   - The main Chromium-specific surface is browser attach/launch, not tab manipulation or DOM automation.

4. The controller’s operational logic is largely Playwright-generic after context acquisition.
   - context.pages(), context.newPage(), page.goto(), page.locator(), page.waitForSelector(), page.waitForFunction(), page.keyboard.insertText(), page.evaluate(), and page.context().request are used heavily.
   - These may work in Firefox/Camoufox, but must be revalidated against real ChatGPT rendering and request behavior.

5. The current image and mailbox safety invariants already exist in live code and must be preserved exactly.
   - GPT-5 Pro image refusal is encoded in mailbox.mjs submit(): image mode rejects Pro models and defaults to gpt-5.
   - submit_image in mcp-tools.mjs hard-routes to model=gpt-5, mode=image, fresh=true.
   - daemon-core.mjs verifies response files, writes the response JSON, removes the request JSON, and only then closes the ephemeral page.
   - mailbox.mjs verifyResponseFiles() checks size and PNG magic bytes for .png outputs.
   These findings align with the critical architectural findings and must remain unchanged after migration.

6. Per-request ephemeral tabs are a real, live concurrency fix, not a speculative design.
   - browser-controller.mjs creates one fresh ChatGPT tab per async request, tags it through window.name markers, and allows cleanup of active/error tabs separately.
   - daemon.mjs serializes by agent and cleans up stale active tabs on startup.
   Any migration that reintroduces a shared worker tab is unacceptable.

7. The approved spec understates where browser launch config actually lives.
   - daemon.mjs does not launch the browser; it consumes browser-controller helpers.
   - The concrete launch/attach logic lives in browser-controller.mjs and launcher.mjs.
   The blueprint must target those files first, not daemon.mjs as the primary browser launcher.

8. Profile and runtime-path handling is already inconsistent in the live repo.
   - browser-controller.mjs uses CHATGPT_MCP_HOME || ~/.chatgpt-mcp
   - mailbox.mjs also uses CHATGPT_MCP_HOME || ~/.chatgpt-mcp for requests, responses, images, and daemon pid
   - launcher.mjs hardcodes ~/.chatgpt-mcp and ignores CHATGPT_MCP_HOME
   - http-api.mjs hardcodes ~/.chatgpt-mcp for token storage
   This is a real boundary bug risk for any browser-profile migration and must be normalized across every persisted runtime artifact, not just the browser profile or endpoint file.

9. Off-screen behavior today is Chromium-flag based, not generic.
   - launcher.mjs uses --window-position=-2000,-2000 and --window-size=1200,900 when not visible.
   - browser-controller.mjs uses --start-maximized when it self-launches.
   Firefox/Camoufox equivalents must be validated empirically; this cannot be assumed from Chromium flags.

10. Existing automated tests are unit/invariant tests, not browser e2e tests.
   - npm test currently passes with 49/49 tests green.
   - Tests cover daemon-core/mailbox logic, flag parsing, selector JSON shape, and MCP routing.
   - There is no checked-in e2e harness for live browser migration.
   Because approval guidance says test mode is e2e-only, implementation acceptance must rely on runtime verification rather than expanding unit scope.

11. README, CLI help, and package metadata are Chromium-specific today.
   - README references patchright, Chrome, and CDP repeatedly.
   - package keywords include patchright.
   - Quick Start tells the user to launch Chrome and reuse CDP.
   The documentation surface is materially out of date once the backend changes.

Research summary for backend choice
Camoufox remains the best candidate. Research did not identify a browser lighter than Camoufox that also keeps full JS rendering and anti-detection with a practical Playwright-compatible Node story. The only serious alternative is using an already installed system Chrome/Chromium binary, which may lower install footprint but does not lower runtime RAM and materially weakens the stealth posture. Therefore the only acceptable reason to abandon Camoufox would be a failed runtime spike around persistent session reuse, selector/render compatibility, authenticated image download, or package/API incompatibility.

Validated package-level risk that must be handled up front
A pinned local extraction of camoufox@0.1.19 shows this is not just a dependency rename:
- the package exposes a separate browser-install flow and throws “Please run `camoufox fetch` to install.” when the browser binary is missing
- its exported Node API is wrapper-shaped around Camoufox(...)/NewBrowser(...) and data_dir-based persistent mode, not a chromium BrowserType with connectOverCDP
- it pins playwright-core@^1.54.1, while the current repo rides patchright@^1.59.4
This means Batch 1 must explicitly prove the exact adapter surface, binary provisioning path, and Playwright-version compatibility before any controller migration starts.

Boundary crossings to validate explicitly
1. CLI/launcher process -> browser profile directory -> later browser owner/consumer
   - Producer: launcher.mjs or browser-controller.mjs
   - Artifact: persistent profile directory currently at <CHATGPT_MCP_HOME|~/.chatgpt-mcp>/profile
   - Transport/storage: local filesystem
   - Consumer: whichever process owns the later browser session
   - Resolution rule: all browser-owning processes must resolve the same absolute base dir; launcher’s current hardcoded ~/.chatgpt-mcp behavior does not satisfy this when CHATGPT_MCP_HOME is set
   - Compatibility rule: the chosen backend must support persistent user data in that directory format
   - Survivability rule: failed launches must not corrupt or orphan the only logged-in profile

2. Browser owner process -> attach/reuse contract -> controller/CLI/MCP/HTTP surfaces
   - Producer: launcher/browser owner
   - Artifact: current contract is a CDP URL written to <base>/cdp
   - Transport/storage: cdp file plus localhost listener
   - Consumer: browser-controller.mjs on later calls
   - Resolution rule: the consumer must attach to a live browser or talk to a replacement service using a stable endpoint
   - Compatibility rule: Firefox/Camoufox must either supply an equivalent attach contract or the codebase must replace CDP with a service-owned controller boundary
   - Survivability rule: if attach fails, the system must not accidentally launch a second competing profile owner against the same session

3. Browser owner process -> install/bootstrap contract -> executable browser binary
   - Producer: package install flow, first-run bootstrap, or manual operator setup
   - Artifact: downloaded Camoufox browser binary plus any cached install metadata
   - Transport/storage: npm dependency tree plus local browser-install cache/directory
   - Consumer: launcher.mjs/browser-controller.mjs at first launch
   - Resolution rule: the runtime must know exactly where the browser binary comes from on a fresh machine
   - Compatibility rule: the chosen install path must match the exact package API used by the controller
   - Survivability rule: missing-binary failure must produce a clear operator/developer error, not a misleading browser-launch failure

4. ChatGPT DOM -> selectors.json -> controller actions
   - Producer: ChatGPT web app rendered under Firefox/Camoufox
   - Artifact: concrete DOM structure for model picker, thinking pill, prompt input, stop button, new chat button, and assistant message/image nodes
   - Transport/storage: live DOM + selectors.json
   - Consumer: browser-controller.mjs
   - Resolution rule: every critical selector must exist in Firefox-rendered ChatGPT
   - Compatibility rule: localized selectors, image nodes, and model-menu structure must still resolve under Firefox
   - Survivability rule: selector misses must fail loudly in check/e2e flow before production rollout

5. Assistant image artifacts -> browser download path -> filesystem verification -> tab closure
   - Producer: ChatGPT image response rendered in page or backed by authenticated URL/blob
   - Artifact: blob payload or authenticated GET response, then local files under image_dir
   - Transport/storage: page.evaluate fetch for blob URLs, page.context().request for network URLs, local filesystem files, responses/<id>.json metadata
   - Consumer: mailbox verification and daemon-core closure logic
   - Resolution rule: image_dir must resolve to a writable absolute path; files[] in response JSON must match actual disk outputs
   - Compatibility rule: Firefox/Camoufox must support the request/download APIs used by browser-controller.mjs or an equivalent authenticated fetch path
   - Survivability rule: source tab stays open until files exist, have non-zero size, and any PNG has valid magic bytes

6. Async request lifecycle -> response JSON -> agent notification script
   - Producer: daemon-core.mjs
   - Artifact: responses/<id>.json and optional image_dir/file_count notification payload
   - Transport/storage: local filesystem and ~/.clawd/bin/send-to-agent.sh invocation
   - Consumer: polling clients and agent notification hook
   - Resolution rule: request_id, response_path, and image_dir must remain stable after browser backend swap
   - Compatibility rule: notification payload must still describe completed image jobs correctly even if browser ownership moves to a service
   - Survivability rule: failure to notify must not delete browser artifacts or response JSON

Assumptions and unresolved decisions
Blocking assumptions
1. Camoufox or its surrounding Playwright integration can support a durable, single-login profile usable by this repo on macOS in headed mode.
2. A practical replacement exists for the current CDP attach contract, either through a verified Camoufox attach mechanism or by moving to a single browser-owner process with controller RPC semantics.
3. CHATGPT_MCP_HOME normalization must cover every persisted runtime artifact: profile, requests, responses, images, daemon pid, HTTP token, and any future owner-service endpoint file.
4. page.context().request or an equivalent authenticated download path works under the chosen Firefox backend for ChatGPT’s generated image URLs.
5. The chosen provisioning flow for Camoufox browser binaries is documented and reproducible on a fresh machine.

Unresolved design decisions that must be settled early
1. Keep launcher as a visible/off-screen standalone process with an attach endpoint, or retire launcher in favor of a single owner inside browser-controller/daemon/server lifecycle.
2. Preserve the cdp file as a compatibility shim with new semantics, or replace it with a differently named service endpoint file to avoid lying about CDP.
3. Whether the first implementation should preserve both CLI launch mode and auto-launch fallback, or temporarily require one canonical browser owner path to reduce profile-locking risk.
4. Whether one-shot CLI/HTTP/MCP consumers are allowed to self-launch the browser at all once a service-owned architecture is chosen, or must fail closed and require an already-running owner.
5. Whether selector drift in Firefox should be solved only in selectors.json, or whether controller code needs backend-specific selector branches.
6. Which exact Camoufox adapter surface is adopted in Node: the package wrapper directly, or plain Playwright Firefox with a thinner stealth layer if package/API or version skew blocks the wrapper path.

Pre-design failure modes
1. Live-session attach disappears
   - What breaks: launcher, CLI, MCP server, and daemon no longer share one running browser.
   - How it breaks: Firefox/Camoufox lacks a true connectOverCDP replacement, so later processes launch a second browser or fail to connect.
   - Test that catches it: start launcher, then run status/query/image from a separate process and confirm only one browser instance/profile owner exists.

2. Dual ownership corrupts or locks the profile
   - What breaks: login persistence and process startup.
   - How it breaks: two processes point at the same profile dir simultaneously after CDP removal.
   - Test that catches it: deliberately start launcher plus controller self-launch path and verify the second process refuses or redirects instead of opening a competing owner.

3. CHATGPT_MCP_HOME drift persists
   - What breaks: profile lookup, token lookup, cdp/service-endpoint discovery, and test isolation.
   - How it breaks: launcher keeps using ~/.chatgpt-mcp while controller uses CHATGPT_MCP_HOME.
   - Test that catches it: run launch/status/image with CHATGPT_MCP_HOME set to a temp directory and verify all artifacts land under that exact directory.

4. Off-screen Firefox launch still steals focus or fails to open a usable window
   - What breaks: daemon usability on Fred’s workstation.
   - How it breaks: Chromium-specific window-position flags are ignored or unsupported by Firefox/Camoufox.
   - Test that catches it: manual launch in visible and default modes on macOS; confirm usable off-screen behavior and no focus theft during status/query/image flows.

5. ChatGPT DOM differs under Firefox
   - What breaks: status detection, prompt submission, new chat, stop button, model selection, thinking selection.
   - How it breaks: selectors.json matches Chromium-rendered DOM but not Firefox-rendered ChatGPT.
   - Test that catches it: run exocortex-chatgpt check plus live submit_pro/submit_image smoke flows in Firefox and record selector misses.

6. Model routing silently regresses for images
   - What breaks: image generation succeeds less often or fails entirely.
   - How it breaks: implementation routes submit_image to Pro-capable UI state or misreads model labels in Firefox.
   - Test that catches it: live submit_image smoke test plus mailbox-level assertion that image-mode requests still persist model=gpt-5, never Pro.

7. Thinking/model menu structure differs enough to mis-select models
   - What breaks: submit_pro ends up on the wrong model or wrong thinking level.
   - How it breaks: Firefox menu markup or hover behavior differs, especially submenu traversal.
   - Test that catches it: live query/status round-trip verifying current model and thinking after set_model/set_thinking in Firefox.

8. Authenticated image download path fails in Firefox
   - What breaks: image files never persist, or downloads come back unauthorized/empty.
   - How it breaks: page.context().request behavior or blob fetch behavior differs under Camoufox.
   - Test that catches it: submit_image e2e that waits for disk files and validates non-zero size and PNG magic bytes.

9. Disk-confirmed-first invariant regresses
   - What breaks: ephemeral tabs close before files are durably readable.
   - How it breaks: migration refactors the image path or daemon ordering and closes the tab as soon as ChatGPT renders the image.
   - Test that catches it: inject a failing or delayed file verification path and confirm the tab remains open/error-marked until durable write succeeds.

10. Error-tab survivability regresses
   - What breaks: debugging real failures after browser migration.
   - How it breaks: new cleanup or shutdown logic closes error tabs automatically.
   - Test that catches it: force an image download failure and verify the daemon leaves the tab open with the error marker.

11. Browser RAM target is claimed but not measured under the real steady-state workload
   - What breaks: acceptance confidence.
   - How it breaks: implementation swaps dependencies but never measures actual resident memory during logged-in ChatGPT usage.
   - Test that catches it: macOS process inspection during launcher idle, submit_pro, and submit_image runs with documented RSS results.

12. README lies about architecture after the swap
   - What breaks: operator setup and downstream adoption.
   - How it breaks: docs still say Chrome/CDP/patchright while the shipped backend is Firefox/Camoufox or service-owned.
   - Test that catches it: doc review against actual launch/runtime commands and a fresh-machine smoke test following README only.

13. Owner-service fallback is broken by one-shot teardown
   - What breaks: separate-process reuse, login persistence, and any service-owned architecture.
   - How it breaks: cli.mjs runController() always calls shutdown(), so one-shot consumers launch the owner and immediately kill it when self-launch remains possible.
   - Test that catches it: with CDP attach removed or disabled, run launch/status/query from separate processes and confirm the owner remains alive after one-shot commands.

14. Fresh-machine launch fails because the browser binary is not provisioned
   - What breaks: local setup, CI smoke, and README verification.
   - How it breaks: Camoufox package install succeeds but the actual browser binary is absent until an explicit fetch/bootstrap step runs.
   - Test that catches it: start from a clean install directory and run the documented first-launch flow without prior manual setup.

15. Adapter/API mismatch blocks migration before e2e starts
   - What breaks: controller acquisition and launch.
   - How it breaks: implementation assumes a chromium-like BrowserType API even though the chosen Camoufox package uses a different wrapper surface, persistent data_dir contract, and older playwright-core pin.
   - Test that catches it: Batch 1 spike that imports the exact package API, launches a persistent profile on macOS, and records the resolved browser/context ownership model.

Runtime verification protocol
Acceptance mode
Primary acceptance is e2e-only, per approval guidance. npm test remains a baseline regression smoke check, but it is not the signoff gate for this feature.

Baseline guardrails before implementation
1. In /Users/fredluz/Code/chatgpt-mcp run:
   - npm test
   Expected today: 49/49 passing.
2. Capture baseline process architecture and browser ownership behavior with the current patchright implementation for comparison.

Required runtime verification after each batch where relevant
1. Baseline static smoke
   - npm test
   Healthy indicator: existing 49 tests still pass unless a deliberate test update is part of the batch.
   - Max fix attempts per batch: 3.

2. Browser ownership/reuse smoke
   - Start the browser owner path in the new architecture.
   - In a second process, run exocortex-chatgpt status.
   Healthy indicator: second process uses the same authenticated session and does not launch a competing browser owner.

3. Login persistence smoke
   - Sign in once with the new profile directory.
   - Restart the owner path and rerun status.
   Healthy indicator: state=ready without re-login.

4. Text generation smoke
   - Use submit_pro or query with a short prompt.
   Healthy indicator: response arrives from GPT-5 Pro / longer thinking path without selector or model drift.

5. Image generation smoke
   - Use submit_image with a simple PNG-friendly prompt.
   Healthy indicator: files appear on disk in image_dir; PNG files pass magic-byte verification; request transitions to complete; tab closes only after response persistence.

6. Async mailbox survivability smoke
   - Submit, poll, fetch, and inspect requests/ + responses/ artifacts.
   Healthy indicator: request JSON is removed only after verified response JSON exists; error cases preserve tab and response JSON.

7. Selector verification smoke
   - Run exocortex-chatgpt check against the Firefox/Camoufox-rendered page.
   Healthy indicator: all required selectors present or explicitly updated to match Firefox.

8. Memory measurement smoke
   - Measure resident memory of the browser owner process during idle logged-in state and during one text/image cycle.
   Healthy indicator: documented RSS is materially below the current Chromium baseline and under the approved target if achievable.

Batch plan

Batch 1: Prove the browser-owner, adapter, and provisioning contracts before touching downstream behavior
Why this batch order matters
If the repo cannot preserve a single authenticated browser owner with Camoufox, or cannot even launch the real package API on a provisioned binary, all later selector and image work is wasted. The first batch must settle the highest-risk architecture boundaries: owner lifetime, package adapter shape, binary bootstrap, and runtime-home resolution.

Tasks
1. WHAT: Prove the exact Node adapter surface for the chosen backend, including import shape, persistent-profile launch contract, and the absence or presence of any attach/reuse mechanism comparable to connectOverCDP.
   WHY: Camoufox’s package API is not shaped like the current patchright chromium BrowserType, so the migration needs a concrete proof before controller work begins.

2. WHAT: Decide and implement the browser-owner lifetime contract for one-shot CLI/HTTP/MCP consumers, including whether self-launch remains allowed and how runController()/shutdown() must change to avoid killing the only owner.
   WHY: A service-owned fallback is unsafe if one-shot commands still self-launch and immediately close owned contexts.

3. WHAT: Normalize every persisted runtime artifact under one shared runtime-path contract: profile, requests, responses, images, daemon pid, HTTP token, and any endpoint-discovery file used by the owner architecture.
   WHY: The live repo already has split path resolution, and partial normalization would leave the product with two competing runtime homes.

4. WHAT: Choose and validate the browser-binary provisioning path for fresh machines and clean installs.
   WHY: The extracted package requires a separate browser-install flow, so first launch and README verification will fail unless provisioning is owned explicitly.

5. WHAT: Validate headed/off-screen launch behavior for the new backend on macOS and record the supported visible/default semantics.
   WHY: Current window-position flags are Chromium-specific; the product must remain usable on Fred’s machine without surprise focus theft.

Batch verification
- A Batch 1 spike launches the exact chosen package/API with a persistent profile on macOS.
- Separate-process launch + status reuse works with one authenticated session, or the blueprint explicitly locks in a service-owned replacement and forbids unsafe self-launch.
- CHATGPT_MCP_HOME test shows profile, requests, responses, images, daemon pid, token, and endpoint artifacts under one directory.
- Fresh-machine/bootstrap test proves the browser binary is provisioned by the documented flow.
- Visible/default launch behavior is documented from a real macOS run.

Batch 2: Migrate the controller without regressing core ChatGPT interaction
Why this batch order matters
Once browser ownership is stable, the next risk is whether ChatGPT interaction still works at all in Firefox/Camoufox. This batch focuses on the main controller APIs that every surface depends on.

Tasks
1. WHAT: Swap browser-controller.mjs from patchright/Chromium acquisition to the approved backend while preserving the existing controller interface exported to CLI, MCP, HTTP, and daemon consumers.
   WHY: Downstream surfaces are intentionally browser-agnostic; preserving the controller contract limits merge chaos and keeps the migration bounded.

2. WHAT: Revalidate prompt, stop, new-chat, status, model, and thinking flows against Firefox-rendered ChatGPT and update selectors/contracts only where the live DOM requires it.
   WHY: Most runtime behavior is Playwright-generic, but selector/render drift in Firefox is a primary failure mode.

3. WHAT: Preserve per-request ephemeral tab creation, active/error marking, and cleanup semantics under the new backend.
   WHY: Cross-agent tab collisions were the real production bug; the migration must not reopen that class of failure.

4. WHAT: Prove that the controller can still distinguish logged-in, ready, and busy states in the new browser.
   WHY: The mailbox worker and operator tooling depend on accurate state detection before any prompt is sent.

Batch verification
- exocortex-chatgpt status works from a fresh process.
- query/new/model/thinking/stop/check all run against the new backend.
- Selector report is green or updated with documented Firefox-specific changes.

Batch 3: Preserve image generation and durable artifact semantics end-to-end
Why this batch order matters
Image generation is the most fragile cross-boundary flow in the repo: ChatGPT UI state, model routing, authenticated download, disk persistence, and daemon tab closure all interact here. It must be handled as a dedicated batch.

Tasks
1. WHAT: Revalidate the image-generation path so submit_image and generate_image still route to gpt-5, never Pro, under the new browser backend.
   WHY: GPT-5 Pro refusal is a known architectural constraint and must remain enforced exactly.

2. WHAT: Preserve or replace the authenticated download mechanism for assistant image artifacts, including both blob-backed and network-backed URLs.
   WHY: page.context().request and page.evaluate blob fetches are backend-sensitive and are the critical path to usable local files.

3. WHAT: Keep the disk-confirmed-first, tab-closed-second lifecycle intact for image requests, including PNG magic-byte validation and error-tab preservation.
   WHY: This is the production-safe behavior that prevents losing images when asynchronous persistence lags behind browser rendering.

4. WHAT: Verify that response JSON, image_dir, files[], and notification payloads remain stable for callers after the backend swap.
   WHY: MCP/CLI/daemon consumers should not need a contract rewrite just because the browser implementation changed.

Batch verification
- submit_image creates files on disk and fetch returns complete with correct files[].
- PNG outputs pass verifyResponseFiles().
- Forced failure keeps the worker tab open and marks the request as error.

Batch 4: Productize, document, and prove the lighter-browser claim
Why this batch order matters
Only after the runtime works should the repo rewrite its public story and acceptance evidence. This batch converts the technical migration into a shippable open-source product update.

Tasks
1. WHAT: Update package metadata, install/runtime dependencies, and lockfile state to represent the shipped backend truthfully.
   WHY: Consumers and future maintainers need the dependency graph to match the runtime architecture.

2. WHAT: Rewrite README and operator docs to describe this product as the lightweight Exocortex-optimized ChatGPT connector, with accurate launch/runtime instructions for the new backend.
   WHY: The current docs still describe patchright, Chrome, and CDP, which will mislead every new user after the migration.

3. WHAT: Record a runtime verification note covering the accepted browser-owner model, login persistence behavior, image durability invariant, and measured memory results.
   WHY: This feature’s approval hinges on real runtime behavior, not a dependency rename.

4. WHAT: Confirm the shipped workflow still works from the documented public entry points: CLI, MCP server, and async daemon path.
   WHY: The connector is a standalone product, and its published value proposition depends on all three surfaces remaining usable.

Batch verification
- Fresh operator run-through using README only succeeds.
- Memory measurements are captured and compared against current Chromium baseline.
- Public docs no longer imply upstream PR status or patchright/Chrome/CDP if those are no longer true.

Execution order and dependencies
1. Batch 1 must complete first because it decides whether Camoufox is viable in this architecture.
2. Batch 2 depends on the chosen owner/attach contract from Batch 1.
3. Batch 3 depends on Batch 2 because image flow uses controller/session primitives and selectors.
4. Batch 4 depends on the previous batches because docs and measurements must describe the real shipped behavior, not intent.

Release blockers
1. No verified replacement for connectOverCDP/live browser reuse, and no explicit owner-service rule for one-shot CLI teardown.
2. No proven adapter path for the chosen Camoufox package/API and Playwright version compatibility.
3. No explicit provisioning path for the Camoufox browser binary on fresh machines.
4. Any regression in per-request ephemeral tab isolation.
5. Any regression in image routing to gpt-5 or in disk-confirmed-first tab closure ordering.
6. Any unresolved mismatch between launcher/controller/http-api/mailbox runtime-path resolution.
7. No measured evidence that memory use is materially lower than the current Chromium path.
8. README still describing the product as a patchright/CDP Chrome tool after migration.

Definition of done
1. The repo no longer depends on patchright for the shipped browser backend.
2. The chosen backend is explicitly validated as the lightest viable option, with Camoufox adopted unless the runtime spike disproves its viability.
3. One authenticated login persists across restarts using a single, normalized runtime-resolved profile path.
4. Browser ownership/reuse semantics are explicit and work across the documented CLI/MCP/daemon flows.
5. submit_pro still reaches GPT-5 Pro/longer and submit_image still routes to gpt-5 image mode only.
6. Per-request ephemeral tabs remain the concurrency boundary; no shared worker tab regression is introduced.
7. Image requests still follow disk-confirmed-first, tab-closed-second semantics with PNG magic-byte validation.
8. Errors still preserve diagnostic tabs and durable response JSON.
9. Runtime verification covers status, query, submit_pro, submit_image, fetch, selector checks, login persistence, and memory measurement.
10. README/package metadata describe exocortex-chatgpt-connector as the lightweight Exocortex-optimized ChatGPT connector and reflect the actual shipped browser architecture.
