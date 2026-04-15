import type { AppSettings, Prompt, Category, Tone, PromptLength } from '@/types';
import { getPrompts, PROMPTS } from '@/data/index';

/**
 * Apply promptLength filter to a prompt pool.
 *
 *  any         → no filter
 *  short       → prompts flagged `short: true` OR suggestedDuration ≤ 60s
 *  reflective  → prompts that have a reflection question
 */
function applyLengthFilter(pool: Prompt[], promptLength: PromptLength): Prompt[] {
  if (promptLength === 'any') return pool;
  if (promptLength === 'short') {
    const filtered = pool.filter(
      (p) => p.short === true || (p.suggestedDuration !== undefined && p.suggestedDuration <= 60),
    );
    return filtered.length > 0 ? filtered : pool; // fallback to unfiltered
  }
  if (promptLength === 'reflective') {
    const filtered = pool.filter((p) => !!p.reflection);
    return filtered.length > 0 ? filtered : pool;
  }
  return pool;
}

/**
 * Select a random prompt matching the user's settings.
 * Filters cascade: (category + tone + length) → (category + tone) → (category) → all
 * Returns localized content based on settings.language.
 */
export function selectPrompt(settings: AppSettings): Prompt | null {
  const { categories, tone, promptLength = 'any', language = 'en' } = settings;
  const ALL = getPrompts(language);

  if (categories.length === 0) {
    return getRandomPrompt(applyLengthFilter(ALL, promptLength));
  }

  // 1. Perfect match: category + tone
  let pool = ALL.filter(
    (p) => categories.includes(p.category) && p.tones.includes(tone),
  );

  // 2. Fallback: any matching category
  if (pool.length === 0) {
    pool = ALL.filter((p) => categories.includes(p.category));
  }

  // 3. Last resort: entire library
  if (pool.length === 0) pool = ALL;

  return getRandomPrompt(applyLengthFilter(pool, promptLength));
}

/**
 * Select a prompt by its ID (used when tapping a notification).
 * Pass language to get localized content.
 */
export function getPromptById(id: string, language = 'en'): Prompt | null {
  return getPrompts(language).find((p) => p.id === id) ?? null;
}

/**
 * Select a prompt for a specific category + tone (used in the prompt screen
 * "try another" flow, excluding the current prompt by ID).
 */
export function selectPromptByCategory(
  category: Category,
  tone: Tone,
  excludeId?: string,
  language = 'en',
): Prompt | null {
  const ALL = getPrompts(language);
  let pool = ALL.filter(
    (p) => p.category === category && p.tones.includes(tone) && p.id !== excludeId,
  );

  if (pool.length === 0) {
    pool = ALL.filter((p) => p.category === category && p.id !== excludeId);
  }

  if (pool.length === 0) {
    pool = ALL.filter((p) => p.id !== excludeId);
  }

  return getRandomPrompt(pool);
}

/** Get all categories present in the dataset. */
export function getAvailableCategories(): Category[] {
  return [...new Set(PROMPTS.map((p) => p.category))];
}

function getRandomPrompt(pool: Prompt[]): Prompt | null {
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
