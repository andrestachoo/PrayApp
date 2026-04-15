// ─── Prompt System ───────────────────────────────────────────────────────────

export type Category =
  | 'gratitude'
  | 'petition'
  | 'silence'
  | 'offering'
  | 'examen'
  | 'trust'
  | 'intercession'
  | 'presence'
  | 'scripture'
  | 'struggle';

export type Tone = 'contemplative' | 'direct' | 'warm';

export type Tradition = 'catholic' | 'general';

export interface Prompt {
  id: string;
  category: Category;
  tones: Tone[];
  tradition: Tradition;
  title: string;
  body: string;
  reflection?: string;
  suggestedDuration?: number; // seconds
  short?: boolean;            // true if < 60s — used by promptLength filter
}

// ─── Schedule ────────────────────────────────────────────────────────────────

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday

export type ActiveDays = 'all' | 'weekdays' | 'weekends' | 'custom';

export interface TimeWindow {
  startHour: number;   // 0–23
  startMinute: number; // 0–59
  endHour: number;
  endMinute: number;
}

// ─── Customization ────────────────────────────────────────────────────────────

/**
 * light     → 2 reminders/day  (gentle, non-intrusive)
 * balanced  → 4 reminders/day  (default, recommended)
 * frequent  → 8 reminders/day  (maximally present)
 */
export type NotificationIntensity = 'light' | 'balanced' | 'frequent';

/**
 * even           → equal time slots across the window
 * random         → looser, randomized placement (feels more natural)
 * morning_evening → clustered at start and end of window
 */
export type DistributionStyle = 'even' | 'random' | 'morning_evening';

/**
 * any         → no filtering by length
 * short       → prefer prompts ≤ 60 sec (quick, frictionless)
 * reflective  → prefer prompts with a reflection question
 */
export type PromptLength = 'any' | 'short' | 'reflective';

// ─── App Settings ─────────────────────────────────────────────────────────────

export interface AppSettings {
  // Prayer content
  tone: Tone;
  categories: Category[];

  // Schedule
  activeDays: ActiveDays;
  customDays: DayOfWeek[];
  timeWindow: TimeWindow;

  // Notification quantity + style
  remindersPerDay: number;           // derived from intensity; kept for backward compat
  intensity: NotificationIntensity;
  distributionStyle: DistributionStyle;

  // Content filtering
  promptLength: PromptLength;

  // System
  notificationsEnabled: boolean;
  hasCompletedOnboarding: boolean;
  language: string;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface DailyStats {
  date: string;          // YYYY-MM-DD
  promptsOpened: number;
  prayedCount: number;
}

export interface Stats {
  totalPromptsOpened: number;
  totalPrayed: number;
  currentStreak: number;
  longestStreak: number;
  lastPrayedDate: string | null; // YYYY-MM-DD
  history: DailyStats[];
  /** Highest streak milestone that has already been celebrated, so we only
   *  show each celebration once even after app restarts. */
  lastCelebratedMilestone: number;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface ScheduledNotification {
  id: string;
  date: string;          // ISO string
  promptId?: string;
}

export interface NotificationPayload {
  promptId: string;
  category: Category;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export interface AppStore {
  settings: AppSettings;
  stats: Stats;
  scheduledNotifications: ScheduledNotification[];
  isHydrated: boolean;

  // Settings actions
  updateSettings: (patch: Partial<AppSettings>) => void;
  resetOnboarding: () => void;

  // Stats actions
  recordPromptOpened: () => void;
  recordPrayed: () => void;
  markMilestoneCelebrated: (milestone: number) => void;

  // Notification actions
  setScheduledNotifications: (notifications: ScheduledNotification[]) => void;

  // Hydration
  hydrate: () => Promise<void>;
}
