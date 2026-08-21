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

export async function deleteAllChatsFromSettings(page, homeUrl) {
  const settingsUrl = new URL('/#settings/DataControls', homeUrl);
  await page.goto(settingsUrl.href, { waitUntil: 'domcontentloaded' });

  const dataControls = page
    .getByText(exactPattern(DELETE_ALL_LABELS.dataControls), { exact: true })
    .first();
  await waitVisible(dataControls, 'could not open ChatGPT Data Controls');

  const deleteButton = page
    .getByRole('button', { name: exactPattern(DELETE_ALL_LABELS.action) })
    .first();
  await waitVisible(deleteButton, 'could not find Delete all chats in Data Controls');
  await deleteButton.click();

  const confirmationDialog = page.getByRole('dialog').last();
  await waitVisible(confirmationDialog, 'Delete all chats confirmation did not appear');

  const confirmButton = confirmationDialog
    .getByRole('button', { name: exactPattern(DELETE_ALL_LABELS.confirmation) })
    .last();
  await waitVisible(confirmButton, 'could not find the Delete all chats confirmation button');
  await confirmButton.click();

  try {
    await confirmationDialog.waitFor({ state: 'detached', timeout: DELETE_ALL_TIMEOUT_MS });
  } catch (error) {
    throw new Error('Delete all chats confirmation did not complete', { cause: error });
  }

  return { deleted: true };
}
