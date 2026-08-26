import { runAllChatsActionFromSettings } from './delete-all-chats.mjs';

export const ARCHIVE_ALL_LABELS = Object.freeze({
  dataControls: ['Data Controls', 'Controles de dados'],
  action: ['Archive all', 'Archive all chats', 'Arquivar tudo', 'Arquivar todos os chats'],
  confirmation: ['Archive all chats', 'Archive all', 'Arquivar todos os chats', 'Arquivar tudo'],
});

export async function archiveAllChatsFromSettings(page, homeUrl) {
  return runAllChatsActionFromSettings(page, homeUrl, {
    labels: ARCHIVE_ALL_LABELS,
    errors: {
      dataControls: 'could not open ChatGPT Data Controls',
      action: 'could not find Archive all chats in Data Controls',
      dialog: 'Archive all chats confirmation did not appear',
      confirmation: 'could not find the Archive all chats confirmation button',
      completion: 'Archive all chats confirmation did not complete',
    },
    result: { archived: true },
  });
}
