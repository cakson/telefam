import OpenAI from 'openai';
import type { ApiFormattedText } from '../types';

const SYSTEM_CONTEXT = `You are a translation engine.

HARD REQUIREMENTS:
- Output ONLY the translated text (no preface, no quotes, no labels).
- Preserve numbers, emojis, URLs, and punctuation naturally.
- If the source already matches the target language, return it unchanged.
- Use the user-provided context if present (names, slang, tone).
- If there are ambiguous terms, pick the most common conversational meaning in the target language.
- Never add explanations or notes.
- Preserve formatting tags and entities exactly as they appear in the source.`;

type TranslateArgs = {
  apiKey: string;
  model: string;
  sourceText: string;
  targetLanguage: string;
  userContext?: string;
};

export async function translateWithChatGPT({
  apiKey,
  model,
  sourceText,
  targetLanguage,
  userContext,
}: TranslateArgs): Promise<string> {
  if (!apiKey) {
    throw new Error('ChatGPT API key is required');
  }

  const client = new OpenAI({ 
    apiKey,
    dangerouslyAllowBrowser: true, // Since this is client-side
  });

  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: SYSTEM_CONTEXT + (userContext ? `\n\nAdditional context:\n${userContext}` : ''),
      },
      {
        role: 'user',
        content: `Target language: ${targetLanguage}\nText:\n${sourceText}`,
      },
    ];

    const response = await client.chat.completions.create({
      model,
      messages,
      // Using default parameters for GPT-5 models
    });

    const translatedText = response.choices[0]?.message?.content || '';
    return translatedText.trim();
  } catch (error: any) {
    // Handle specific OpenAI errors
    if (error?.status === 401) {
      throw new Error('Invalid API key');
    } else if (error?.status === 429) {
      throw new Error('Rate limit exceeded');
    } else if (error?.status === 404) {
      throw new Error(`Model ${model} not found`);
    }
    
    console.error('ChatGPT translation error:', error);
    throw error;
  }
}

export async function translateMessagesWithChatGPT({
  apiKey,
  model,
  messages,
  targetLanguage,
  userContext,
}: {
  apiKey: string;
  model: string;
  messages: ApiFormattedText[];
  targetLanguage: string;
  userContext?: string;
}): Promise<ApiFormattedText[]> {
  const translations = await Promise.all(
    messages.map(async (message) => {
      try {
        const translatedText = await translateWithChatGPT({
          apiKey,
          model,
          sourceText: message.text,
          targetLanguage,
          userContext,
        });

        return {
          ...message,
          text: translatedText,
        };
      } catch (error) {
        // Return original message if translation fails
        console.error('Failed to translate message:', error);
        return message;
      }
    })
  );

  return translations;
}