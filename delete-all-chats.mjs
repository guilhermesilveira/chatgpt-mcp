export const DELETE_ALL_TIMEOUT_MS = 15_000;

export const DELETE_ALL_LABELS = Object.freeze({
  dataControls: ['Data Controls', 'Controles de dados'],
  action: ['Delete all', 'Delete all chats', 'Excluir tudo', 'Excluir todos os chats'],
  confirmation: ['Delete all chats', 'Delete all', 'Excluir todos os chats', 'Excluir tudo'],
});

function exactPattern(labels) {
  const escaped = labels.map(label => label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`^(?:${escaped.join('|')})$`, 'i');
}

async function waitVisible(locator, errorMessage) {
  try {
    await locator.waitFor({ state: 'visible', timeout: DELETE_ALL_TIMEOUT_MS });
  } catch (error) {
    throw new Error(errorMessage, { cause: error });
  }
}

async function findVisible(locators, errorMessage) {
  const deadline = Date.now() + DELETE_ALL_TIMEOUT_MS;

  do {
    for (const locator of locators) {
      const count = await locator.count();
      for (let index = 0; index < count; index += 1) {
        const candidate = locator.nth(index);
        if (await candidate.isVisible()) return candidate;
      }
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  } while (Date.now() < deadline);

  throw new Error(errorMessage);
}

export async function runAllChatsActionFromSettings(page, homeUrl, {
  labels,
  errors,
  result,
}) {
  const settingsUrl = new URL('/#settings/DataControls', homeUrl);
  await page.goto(settingsUrl.href, { waitUntil: 'domcontentloaded' });

  const dataControls = page
    .getByText(exactPattern(labels.dataControls), { exact: true })
    .first();
  await waitVisible(dataControls, errors.dataControls);

  const actionPattern = exactPattern(labels.action);
  const actionButton = await findVisible([
    page.getByRole('button', { name: actionPattern }),
    page.getByText(actionPattern, { exact: true }),
  ], errors.action);
  await actionButton.click();

  const confirmationDialog = page.getByRole('dialog').last();
  await waitVisible(confirmationDialog, errors.dialog);

  const confirmButton = confirmationDialog
    .getByRole('button', { name: exactPattern(labels.confirmation) })
    .last();
  await waitVisible(confirmButton, errors.confirmation);
  await confirmButton.click();

  try {
    await confirmationDialog.waitFor({ state: 'detached', timeout: DELETE_ALL_TIMEOUT_MS });
  } catch (error) {
    throw new Error(errors.completion, { cause: error });
  }

  return result;
}

export async function deleteAllChatsFromSettings(page, homeUrl) {
  return runAllChatsActionFromSettings(page, homeUrl, {
    labels: DELETE_ALL_LABELS,
    errors: {
      dataControls: 'could not open ChatGPT Data Controls',
      action: 'could not find Delete all chats in Data Controls',
      dialog: 'Delete all chats confirmation did not appear',
      confirmation: 'could not find the Delete all chats confirmation button',
      completion: 'Delete all chats confirmation did not complete',
    },
    result: { deleted: true },
  });
}
