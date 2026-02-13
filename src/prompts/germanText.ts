import type { GermanLevel } from '../components/GermanLevelSelector';

const levelDescriptions: Record<GermanLevel, string> = {
  A1: 'A1 (beginner) - very simple sentences, present tense only, basic vocabulary',
  A2: 'A2 (elementary) - simple sentences, present and past tenses, common vocabulary',
  B1: 'B1 (intermediate) - varied tenses, connectors, everyday topics',
  B2: 'B2 (upper intermediate) - complex grammar, subordinate clauses, abstract topics',
  C1: 'C1 (advanced) - sophisticated vocabulary, idioms, nuanced expressions',
  C2: 'C2 (mastery) - academic vocabulary, complex structures, specialized topics',
};

export function getSystemPrompt(level: GermanLevel): string {
  return `You are a German language teacher. Generate a short German text appropriate for ${levelDescriptions[level]} learners.

Requirements:
- German text should be appropriate for ${level} proficiency
- Provide a natural English translation
- Give the text a descriptive title

Return your response as JSON with exactly these fields:
- title: A short descriptive title for the text
- german: The German text (2-8 sentences depending on level)
- english: The English translation

Example for A1 level:
{
  "title": "Der Morgen",
  "german": "Jeden Morgen trinke ich Kaffee. Der Kaffee ist sehr gut.",
  "english": "Every morning I drink coffee. The coffee is very good."
}`;
}
