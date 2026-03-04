import { OpenRouter } from '@openrouter/sdk';
import { OpenRouterError } from '@openrouter/sdk/models/errors';
import type { GermanLevel } from '../components/GermanLevelSelector';
import { getSystemPrompt } from '../prompts/germanText';
import type { GeneratedPassage } from '../types/generatedPassage';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const MOCK_RESPONSE: GeneratedPassage = {
  title: 'Mock Text',
  german: 'Dies ist ein kurzer Beispieltext. Er hilft beim Testen.',
  english: 'This is a short sample text. It helps with testing.',
};

const openrouter = new OpenRouter({
  apiKey: API_KEY,
});

export async function generateGermanText(level: GermanLevel): Promise<GeneratedPassage> {
  if (!API_KEY) {
    throw new Error(
      'API key not configured. Please set VITE_OPENROUTER_API_KEY in your .env file.',
    );
  }

  const systemPrompt = getSystemPrompt(level);

  const requestPayload = {
    httpReferer: window.location.origin,
    xTitle: 'Learn by Typing - German Practice',
    chatGenerationParams: {
      model: 'z-ai/glm-4.5-air:free',
      messages: [
        {
          role: 'system' as const,
          content: systemPrompt,
        },
        {
          role: 'user' as const,
          content: `Generate a German text for ${level} level.`,
        },
      ],
      responseFormat: {
        type: 'json_schema' as const,
        jsonSchema: {
          name: 'german_text',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                description: 'Short descriptive title (2-4 words)',
              },
              german: {
                type: 'string',
                description: 'The German text',
              },
              english: {
                type: 'string',
                description: 'English translation of the German text',
              },
            },
            required: ['title', 'german', 'english'],
          },
        },
      },
    },
  };

  try {
    const response = await openrouter.chat.send(requestPayload);

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from API');
    }

    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
    const parsed = JSON.parse(contentStr);

    if (!parsed.title || !parsed.german || !parsed.english) {
      throw new Error('Invalid response structure');
    }

    return parsed as GeneratedPassage;
  } catch (error) {
    if (error instanceof OpenRouterError && error.statusCode >= 400 && error.statusCode < 500) {
      return MOCK_RESPONSE;
    }
    console.warn('API call failed, using mock response:', error);
    return MOCK_RESPONSE;
  }
}

export type { GeneratedPassage };
