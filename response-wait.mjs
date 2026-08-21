export const RESPONSE_START_TIMEOUT_MS = 5 * 60_000;

export async function waitForNewAssistantTurn(page, assistantSelector, prevAssistantCount) {
  try {
    await page.waitForFunction(
      ({ sel, prev }) => document.querySelectorAll(sel).length > prev,
      { sel: assistantSelector, prev: prevAssistantCount },
      { timeout: RESPONSE_START_TIMEOUT_MS },
    );
  } catch (error) {
    if (error?.name === 'TimeoutError' || /Timeout \d+ms exceeded/.test(error?.message || '')) {
      throw new Error('no assistant response appeared within 5 minutes', { cause: error });
    }
    throw error;
  }
}
