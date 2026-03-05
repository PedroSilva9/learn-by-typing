import { OpenRouter } from '@openrouter/sdk';
import { OpenRouterError } from '@openrouter/sdk/models/errors';
import type { GermanLevel } from '../components/GermanLevelSelector';
import { getRandomMockPassage } from '../data/mockPassages';
import { getSystemPrompt } from '../prompts/germanText';
import type { GeneratedPassage } from '../types/generatedPassage';

export async function generateGermanText(
  level: GermanLevel,
  apiKey: string,
): Promise<GeneratedPassage> {
  const openrouter = new OpenRouter({ apiKey });

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

    let contentStr = typeof content === 'string' ? content : JSON.stringify(content);
    // Strip markdown code fences if the model wrapped the JSON
    contentStr = contentStr
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();
    const parsed = JSON.parse(contentStr);

    // Normalise field names: model sometimes uses 'text' instead of 'german'/'english'
    if (!parsed.german && parsed.text) {
      parsed.german = parsed.text;
    }

    if (!parsed.title || !parsed.german) {
      throw new Error('Invalid response structure');
    }

    return {
      title: parsed.title,
      german: parsed.german,
      english: parsed.english ?? '',
    } satisfies GeneratedPassage;
  } catch (error) {
    if (error instanceof OpenRouterError && error.statusCode >= 400 && error.statusCode < 500) {
      throw error;
    }
    console.warn('API call failed, using mock response:', error);
    return getRandomMockPassage();
  }
}

export type { GeneratedPassage };
