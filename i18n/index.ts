import en from './en.json';
import es from './es.json';

type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] };
type TranslationMap = typeof en;

const translations: Record<string, DeepPartial<TranslationMap>> = { en, es };

let currentLanguage = 'en';

export function setLanguage(lang: string): void {
  currentLanguage = translations[lang] ? lang : 'en';
}

export function getLanguage(): string {
  return currentLanguage;
}

export function getSupportedLanguages(): string[] {
  return Object.keys(translations);
}

/**
 * Detect the device's preferred language using the built-in Intl API.
 * Falls back to 'en' if not supported or not in our translation set.
 */
export function detectDeviceLanguage(): string {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const lang = locale.split(/[-_]/)[0].toLowerCase();
    return translations[lang] ? lang : 'en';
  } catch {
    return 'en';
  }
}

/**
 * Translate using a specific language, without mutating the global language.
 * Used by the notification scheduler so banner text is always in the user's
 * selected language regardless of when the scheduler runs.
 */
export function tLang(key: string, lang: string, vars?: Record<string, string | number>): string {
  const saved = currentLanguage;
  if (translations[lang]) currentLanguage = lang;
  const result = t(key, vars);
  currentLanguage = saved;
  return result;
}

/** Translate a dot-notation key, e.g. t('home.cta_pray'). Supports {{var}} interpolation. */
export function t(key: string, vars?: Record<string, string | number>): string {
  const parts = key.split('.');
  let current: unknown = translations[currentLanguage] ?? translations['en'];

  for (const part of parts) {
    if (current && typeof current === 'object' && part in (current as object)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      // Fallback to English
      let fallback: unknown = translations['en'];
      for (const p of parts) {
        if (fallback && typeof fallback === 'object' && p in (fallback as object)) {
          fallback = (fallback as Record<string, unknown>)[p];
        } else {
          return key;
        }
      }
      current = fallback;
      break;
    }
  }

  if (typeof current !== 'string') return key;
  if (!vars) return current;

  return Object.entries(vars).reduce(
    (str, [k, v]) => str.replace(new RegExp(`{{${k}}}`, 'g'), String(v)),
    current,
  );
}

/** Plural-aware translation. Tries key_plural for count !== 1. */
export function tp(key: string, count: number, vars?: Record<string, string | number>): string {
  const pluralKey = `${key}_plural`;
  const resolvedKey = hasKey(pluralKey) ? pluralKey : key;
  return t(resolvedKey, { count, ...vars });
}

function hasKey(key: string): boolean {
  const parts = key.split('.');
  let current: unknown = translations[currentLanguage] ?? translations['en'];
  for (const part of parts) {
    if (current && typeof current === 'object' && part in (current as object)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return false;
    }
  }
  return typeof current === 'string';
}
