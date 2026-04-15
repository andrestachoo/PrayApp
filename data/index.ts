/**
 * Language-aware prompt data access.
 * Returns the correct localized version of all prompts based on the given language.
 * Falls back to English for any prompt without a translation.
 */
import { PROMPTS } from './prompts';
import { ES } from './prompts.es';
import type { Prompt } from '@/types';

const translationMap: Record<string, Record<string, { title: string; body: string; reflection?: string }>> = {
  es: ES,
};

export function getPrompts(language: string): Prompt[] {
  const translations = translationMap[language];
  if (!translations) return PROMPTS;

  return PROMPTS.map((p) => {
    const t = translations[p.id];
    if (!t) return p;
    return {
      ...p,
      title: t.title,
      body: t.body,
      reflection: t.reflection !== undefined ? t.reflection : p.reflection,
    };
  });
}

export { PROMPTS };
