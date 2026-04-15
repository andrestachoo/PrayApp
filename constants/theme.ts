import { Platform } from 'react-native';

// ─── Colors ──────────────────────────────────────────────────────────────────

export const Colors = {
  // Backgrounds — warm cream hierarchy
  background: '#FAF7F2',
  surface: '#F2EAE0',
  surfaceElevated: '#FFFFFF',

  // Brand green — deep forest
  primary: '#2C4A3E',
  primaryLight: '#3D6458',
  primaryMuted: '#D4E4DF',
  primaryDeep: '#1E3329',

  // Gold accent — warm, not gaudy
  gold: '#C8A96E',
  goldLight: '#F5EDD4',
  goldDeep: '#9D7D45',

  // Deep navy — alternate dark bg for prompt
  navy: '#1B2E4A',
  navyLight: '#243D5C',

  // Warm brown — third prompt bg option
  umber: '#3A2E1E',
  umberLight: '#4A3C28',

  // Text scale
  text: '#1A1A18',
  textSecondary: '#5C5850',
  textTertiary: '#9A9488',
  textInverse: '#FAF7F2',   // for dark bg prompt cards

  // Borders
  border: '#E5DDD0',
  borderLight: '#EDE9E2',

  // Semantic
  error: '#A03030',
  success: '#2C5F45',
  overlay: 'rgba(26,26,24,0.55)',

  // Notification / warning banner
  accent: '#8B6914',
  accentLight: '#F5EDD4',
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────

export const Typography = {
  /**
   * sansSerif is undefined on iOS intentionally — React Native defaults to
   * San Francisco with correct metrics. 'System' is NOT a valid font name
   * and causes vertical misalignment on iOS.
   */
  fontFamily: {
    serif: Platform.OS === 'android' ? 'serif' : 'Georgia',
    sansSerif: Platform.OS === 'android' ? 'sans-serif' : undefined,
  } as { serif: string; sansSerif: string | undefined },

  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 30,
    '3xl': 38,
    '4xl': 48,
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
    loose: 1.9,
  },

  /**
   * Button label sizes: lineHeight === fontSize for pixel-perfect vertical
   * centering on both platforms without includeFontPadding tricks.
   */
  button: {
    sm:  { fontSize: 13, lineHeight: 16, letterSpacing: 0.1 },
    md:  { fontSize: 15, lineHeight: 20, letterSpacing: 0.1 },
    lg:  { fontSize: 16, lineHeight: 20, letterSpacing: 0.2 },
  },
} as const;

// ─── Spacing ─────────────────────────────────────────────────────────────────

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  '2xl': 48,
  '3xl': 64,
} as const;

// ─── Radii ───────────────────────────────────────────────────────────────────

export const Radii = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  '2xl': 32,
  full: 9999,
} as const;

// ─── Shadows ─────────────────────────────────────────────────────────────────

export const Shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#1A1A18',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.07,
      shadowRadius: 4,
    },
    android: { elevation: 2 },
    default: {},
  })!,
  md: Platform.select({
    ios: {
      shadowColor: '#1A1A18',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.09,
      shadowRadius: 12,
    },
    android: { elevation: 4 },
    default: {},
  })!,
  lg: Platform.select({
    ios: {
      shadowColor: '#1A1A18',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
    },
    android: { elevation: 8 },
    default: {},
  })!,
} as const;

// ─── Prompt screen background themes ─────────────────────────────────────────

/** Each theme is used on the full-screen prompt card, cycling by prompt ID. */
export const PromptThemes = [
  {
    id: 'forest',
    bg: Colors.primaryDeep,
    text: Colors.textInverse,
    textSoft: 'rgba(250,247,242,0.65)',
    rule: Colors.primaryMuted,
    badge: 'rgba(255,255,255,0.12)',
  },
  {
    id: 'navy',
    bg: Colors.navy,
    text: Colors.textInverse,
    textSoft: 'rgba(250,247,242,0.65)',
    rule: Colors.navyLight,
    badge: 'rgba(255,255,255,0.12)',
  },
  {
    id: 'umber',
    bg: Colors.umber,
    text: Colors.textInverse,
    textSoft: 'rgba(250,247,242,0.65)',
    rule: Colors.umberLight,
    badge: 'rgba(255,255,255,0.12)',
  },
  {
    id: 'cream',
    bg: Colors.background,
    text: Colors.text,
    textSoft: Colors.textSecondary,
    rule: Colors.border,
    badge: Colors.surface,
  },
] as const;

export type PromptTheme = typeof PromptThemes[number];

export function getPromptTheme(promptId: string): PromptTheme {
  // Deterministic pick from the dark themes (0–2) so the same prompt always
  // gets the same color, and light cream (3) is reserved for explicit use.
  const hash = promptId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return PromptThemes[hash % 3];
}

// ─── Gradient definitions ─────────────────────────────────────────────────────
// Used by expo-linear-gradient. Each is [top, bottom] for a vertical gradient.

export const Gradients = {
  forest:  [Colors.primaryDeep, Colors.primary]       as const,
  navy:    [Colors.navy,        Colors.navyLight]      as const,
  umber:   [Colors.umber,       Colors.umberLight]     as const,
  gold:    [Colors.goldDeep,    Colors.gold]           as const,
  cream:   [Colors.background,  Colors.surface]        as const,
  dark:    ['#111110',          '#1A1A18']             as const,
} as const;

/** Map a prompt theme ID to its expo-linear-gradient colors. */
export function getPromptGradient(themeId: string): readonly [string, string] {
  const map: Record<string, readonly [string, string]> = {
    forest: Gradients.forest,
    navy:   Gradients.navy,
    umber:  Gradients.umber,
    cream:  Gradients.cream,
  };
  return map[themeId] ?? Gradients.forest;
}

// ─── Streak milestone thresholds ─────────────────────────────────────────────

export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100] as const;

export function getNextMilestone(streak: number): number | null {
  return STREAK_MILESTONES.find((m) => m > streak) ?? null;
}

export function isMilestone(streak: number): boolean {
  return (STREAK_MILESTONES as readonly number[]).includes(streak);
}
