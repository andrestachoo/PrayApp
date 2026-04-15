import { create } from 'zustand';
import type { AppStore, AppSettings, Stats, ScheduledNotification } from '@/types';
import { DEFAULT_SETTINGS, DEFAULT_STATS, INTENSITY_TO_COUNT } from '@/constants/defaults';
import { storageGet, storageSet, KEYS } from '@/lib/storage';
import { today, yesterday, areConsecutiveDays } from '@/lib/date';

export const useAppStore = create<AppStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  stats: DEFAULT_STATS,
  scheduledNotifications: [],
  isHydrated: false,

  // ─── Settings ─────────────────────────────────────────────────────────────

  updateSettings: (patch) => {
    const merged = { ...get().settings, ...patch };
    // Keep remindersPerDay in sync when intensity changes
    if (patch.intensity !== undefined) {
      merged.remindersPerDay = INTENSITY_TO_COUNT[patch.intensity];
    }
    set({ settings: merged });
    storageSet(KEYS.SETTINGS, merged);
  },

  resetOnboarding: () => {
    const next: AppSettings = {
      ...DEFAULT_SETTINGS,
      language: get().settings.language, // preserve language choice
    };
    set({ settings: next, stats: DEFAULT_STATS });
    storageSet(KEYS.SETTINGS, next);
    storageSet(KEYS.STATS, DEFAULT_STATS);
  },

  // ─── Stats ────────────────────────────────────────────────────────────────

  recordPromptOpened: () => {
    const { stats } = get();
    const todayStr = today();
    const history = [...stats.history];
    const todayEntry = history.find((d) => d.date === todayStr);

    if (todayEntry) {
      todayEntry.promptsOpened += 1;
    } else {
      history.push({ date: todayStr, promptsOpened: 1, prayedCount: 0 });
    }

    const next: Stats = {
      ...stats,
      totalPromptsOpened: stats.totalPromptsOpened + 1,
      history,
    };
    set({ stats: next });
    storageSet(KEYS.STATS, next);
  },

  recordPrayed: () => {
    const { stats } = get();
    const todayStr = today();
    const history = [...stats.history];
    const todayEntry = history.find((d) => d.date === todayStr);

    if (todayEntry) {
      todayEntry.prayedCount += 1;
    } else {
      history.push({ date: todayStr, promptsOpened: 0, prayedCount: 1 });
    }

    // Streak calculation
    const lastDate = stats.lastPrayedDate;
    let streak = stats.currentStreak;
    let longest = stats.longestStreak;

    if (lastDate === todayStr) {
      // Already prayed today — no change to streak
    } else if (lastDate === yesterday() || areConsecutiveDays(lastDate ?? '', todayStr)) {
      streak += 1;
      longest = Math.max(longest, streak);
    } else {
      // Streak broken — restart
      streak = 1;
      longest = Math.max(longest, 1);
    }

    const next: Stats = {
      ...stats,
      totalPrayed: stats.totalPrayed + 1,
      currentStreak: streak,
      longestStreak: longest,
      lastPrayedDate: todayStr,
      history,
    };
    set({ stats: next });
    storageSet(KEYS.STATS, next);
  },

  markMilestoneCelebrated: (milestone) => {
    const next: Stats = { ...get().stats, lastCelebratedMilestone: milestone };
    set({ stats: next });
    storageSet(KEYS.STATS, next);
  },

  // ─── Notifications ────────────────────────────────────────────────────────

  setScheduledNotifications: (notifications) => {
    set({ scheduledNotifications: notifications });
    storageSet(KEYS.SCHEDULED_NOTIFICATIONS, notifications);
  },

  // ─── Hydration ────────────────────────────────────────────────────────────

  hydrate: async () => {
    const [savedSettings, savedStats, savedNotifs] = await Promise.all([
      storageGet<AppSettings>(KEYS.SETTINGS),
      storageGet<Stats>(KEYS.STATS),
      storageGet<ScheduledNotification[]>(KEYS.SCHEDULED_NOTIFICATIONS),
    ]);

    set({
      settings: savedSettings
        ? { ...DEFAULT_SETTINGS, ...savedSettings }
        : DEFAULT_SETTINGS,
      stats: savedStats
        ? { ...DEFAULT_STATS, ...savedStats }
        : DEFAULT_STATS,
      scheduledNotifications: savedNotifs ?? [],
      isHydrated: true,
    });
  },
}));

// Convenience selectors
export const selectSettings = (s: AppStore) => s.settings;
export const selectStats = (s: AppStore) => s.stats;
export const selectIsHydrated = (s: AppStore) => s.isHydrated;
