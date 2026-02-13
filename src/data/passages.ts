export interface Passage {
  id: string;
  title: string;
  de: string;
  en: string;
  gloss?: string[];
  isGenerated?: boolean;
}

export function createPassageFromGenerated(
  generated: { title: string; german: string; english: string },
  level: string,
): Passage {
  return {
    id: `generated-${Date.now()}`,
    title: `${generated.title} (${level})`,
    de: generated.german,
    en: generated.english,
    isGenerated: true,
  };
}
