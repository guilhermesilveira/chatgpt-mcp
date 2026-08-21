export const NEW_CHAT_TIMEOUT_MS = 15_000;

export async function openNewChat(page, homeUrl, composerSelector) {
  const target = new URL('/', homeUrl);

  // A full navigation is more reliable than the sidebar button: ChatGPT's SPA
  // may render a matching button without completing the route transition.
  await page.goto(target.href, { waitUntil: 'domcontentloaded' });
  await page.waitForURL(
    url => url.origin === target.origin && url.pathname === '/',
    { timeout: NEW_CHAT_TIMEOUT_MS },
  );
  await page.waitForSelector(composerSelector, { timeout: NEW_CHAT_TIMEOUT_MS });
}
