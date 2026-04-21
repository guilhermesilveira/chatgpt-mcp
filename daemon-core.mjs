function nowIso() {
  return new Date().toISOString();
}

function elapsedMs(createdAt, finishedAt = null) {
  const start = Date.parse(createdAt || '');
  if (Number.isNaN(start)) return 0;
  const end = Date.parse(finishedAt || '') || Date.now();
  return Math.max(0, end - start);
}

function briefPrompt(prompt) {
  const text = String(prompt ?? '').replace(/\s+/g, ' ').trim();
  return text.slice(0, 220);
}

export async function processClaimedRequest(input) {
  const {
    requestId,
    lockPath,
    agent,
    deps,
  } = input;

  const {
    readRequest,
    markRequestActive,
    createEphemeralChatPage,
    queryInPage,
    verifyResponseFiles,
    writeResponseVerified,
    removeRequest,
    closeEphemeralPage,
    markEphemeralTabError,
    notifyAgentIfAvailable,
    releaseRequestLock,
  } = deps;

  let page = null;

  try {
    const request = await readRequest(requestId);
    if (!request) return { state: 'missing' };

    const active = await markRequestActive(requestId, request);

    page = await createEphemeralChatPage(requestId);
    const result = await queryInPage(page, active.prompt, {
      fresh: Boolean(active.fresh),
      model: active.model ?? undefined,
      thinking: active.thinking ?? undefined,
      mode: active.mode ?? 'text',
      output_dir: active.output_dir ?? undefined,
    });

    const finishedAt = nowIso();
    const response = {
      request_id: requestId,
      state: 'complete',
      agent,
      text: result?.text ?? '',
      files: Array.isArray(result?.files) ? result.files : [],
      mode: active.mode ?? 'text',
      image_dir: active.mode === 'image' ? (active.image_dir ?? active.output_dir ?? null) : null,
      created_at: active.created_at,
      started_at: active.started_at,
      finished_at: finishedAt,
      elapsed_ms: elapsedMs(active.created_at, finishedAt),
    };

    await verifyResponseFiles(response.files);
    await writeResponseVerified(requestId, response);
    await removeRequest(requestId);
    await closeEphemeralPage(page);
    page = null;

    await notifyAgentIfAvailable(agent, requestId, response.text, {
      imageDir: response.image_dir,
      fileCount: response.files.length,
      requestBrief: briefPrompt(active.prompt),
    });
    return { state: 'complete' };
  } catch (error) {
    const message = String(error?.message || error);

    if (page) {
      await markEphemeralTabError(page, requestId).catch(() => {});
    }

    const request = await readRequest(requestId);
    const createdAt = request?.created_at ?? nowIso();
    const startedAt = request?.started_at ?? createdAt;
    const finishedAt = nowIso();

    const response = {
      request_id: requestId,
      state: 'error',
      agent,
      text: '',
      files: [],
      mode: request?.mode ?? 'text',
      image_dir: request?.mode === 'image' ? (request?.image_dir ?? request?.output_dir ?? null) : null,
      error: message,
      created_at: createdAt,
      started_at: startedAt,
      finished_at: finishedAt,
      elapsed_ms: elapsedMs(createdAt, finishedAt),
    };

    try {
      await writeResponseVerified(requestId, response);
      await removeRequest(requestId);
      await notifyAgentIfAvailable(agent, requestId, message, {
        requestBrief: briefPrompt(request?.prompt),
      });
    } catch (persistError) {
      console.error('[daemon] failed to persist error response', requestId, persistError?.message || persistError);
    }

    // Keep error tabs open for manual inspection.
    return { state: 'error', error: message };
  } finally {
    await releaseRequestLock(lockPath).catch(() => {});
  }
}
