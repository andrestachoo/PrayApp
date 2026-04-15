import type { AppSettings, Stats, NotificationIntensity } from '@/types';

/**
 * Maps each intensity preset to a concrete reminders-per-day count.
 * These are the canonical values — remindersPerDay in settings is always
 * derived from intensity and kept in sync by updateSettings.
 */
export const INTENSITY_TO_COUNT: Record<NotificationIntensity, number> = {
  light:    2,
  balanced: 4,
  frequent: 8,
};

export const DEFAULT_SETTINGS: AppSettings = {
  tone: 'warm',
  categories: ['gratitude', 'trust', 'scripture', 'silence', 'struggle', 'petition'],
  activeDays: 'all',
  customDays: [0, 1, 2, 3, 4, 5, 6],
  timeWindow: {
    startHour: 8,
    startMinute: 0,
    endHour: 21,
    endMinute: 0,
  },
  remindersPerDay: 4,           // kept in sync with intensity
  intensity: 'balanced',
  distributionStyle: 'even',
  promptLength: 'any',
  notificationsEnabled: true,
  hasCompletedOnboarding: false,
  language: 'en',
};

export const DEFAULT_STATS: Stats = {
  totalPromptsOpened: 0,
  totalPrayed: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastPrayedDate: null,
  history: [],
  lastCelebratedMilestone: 0,
};

export const MIN_REMINDERS = 1;
export const MAX_REMINDERS = 10;
export const MIN_SPACING_MINUTES = 30;
export const MAX_SCHEDULED_DAYS = 7;
