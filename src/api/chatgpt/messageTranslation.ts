import type { ApiFormattedText, ApiMessage } from '../types';

import { translateMessagesWithChatGPT } from './translation';

export async function translateMessagesWithChatGPTById({
  messages,
  apiKey,
  model,
  targetLanguage,
  userContext,
}: {
  messages: ApiMessage[];
  apiKey: string;
  model: string;
  targetLanguage: string;
  userContext?: string;
}): Promise<ApiFormattedText[]> {
  // Extract text content from messages
  const messageTexts: ApiFormattedText[] = messages.map((message) => {
    if (message.content.text) {
      return {
        text: message.content.text.text,
        entities: message.content.text.entities,
      };
    }
    // For non-text messages, return empty text
    return { text: '', entities: [] };
  });

  // Translate the texts
  const translatedTexts = await translateMessagesWithChatGPT({
    apiKey,
    model,
    messages: messageTexts,
    targetLanguage,
    userContext,
  });

  return translatedTexts;
}
