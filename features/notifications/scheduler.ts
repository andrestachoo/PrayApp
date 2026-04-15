/**
 * Notification Scheduler
 *
 * Generates a fresh schedule for the next N days based on user preferences
 * and schedules them as local notifications via expo-notifications.
 *
 * iOS limit: 64 pending notifications at once.
 * Android: No hard limit, but we keep it reasonable.
 *
 * Language fix: notification banner text (title/body) is always generated
 * in the user's selected language using tLang(), so changing language
 * and triggering a reschedule produces correctly localized banners.
 */

import * as Notifications from 'expo-notifications';
import type { AppSettings, ScheduledNotification, NotificationPayload, DistributionStyle } from '@/types';
import type { Prompt } from '@/types';
import { generateSpacedMinutes, toDateString, randomInt } from '@/lib/date';
import { MIN_SPACING_MINUTES, MAX_SCHEDULED_DAYS } from '@/constants/defaults';
import { selectPrompt } from '@/features/prompts/selector';
import { tLang } from '@/i18n';

const NOTIFICATION_CATEGORY = 'habita-prayer';

/** Days-of-week that are active for a given activeDays setting. */
function getActiveDaysSet(settings: AppSettings): Set<number> {
  switch (settings.activeDays) {
    case 'all':      return new Set([0, 1, 2, 3, 4, 5, 6]);
    case 'weekdays': return new Set([1, 2, 3, 4, 5]);
    case 'weekends': return new Set([0, 6]);
    case 'custom':   return new Set(settings.customDays);
  }
}

/** Cancel all currently scheduled Habita notifications. */
export async function cancelAllScheduled(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const habitaIds = scheduled
    .filter((n) => n.content.data?.source === 'habita')
    .map((n) => n.identifier);
  await Promise.all(habitaIds.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
}

/**
 * Build a localized notification title and body for a given prompt + language.
 * The title is drawn from the i18n notification pool for the prompt's category.
 * The body rotates through three generic invitation phrases.
 */
function buildNotificationContent(
  prompt: Prompt,
  language: string,
): { title: string; body: string } {
  // Pick one of 3 localized title variants for this category
  const variant = randomInt(0, 3);
  const title = tLang(`notifications.title_${prompt.category}_${variant}`, language);

  // Rotate between 3 body styles based on prompt id for determinism
  const bodyHash = prompt.id.charCodeAt(prompt.id.length - 1) % 3;
  const bodyKeys = ['body_invitation', 'body_short', 'body_return'];
  const body = tLang(`notifications.${bodyKeys[bodyHash]}`, language);

  return { title, body };
}

/**
 * Generate minute-offsets respecting the chosen distribution style.
 *
 *  even            → equal time slots, random within each slot
 *  random          → random placement, only minimum spacing enforced
 *  morning_evening → 60% of reminders in first half, 40% in second half
 */
function getDistributedMinutes(
  startMinutes: number,
  endMinutes: number,
  count: number,
  style: DistributionStyle,
): number[] | null {
  switch (style) {
    case 'even':
      return generateSpacedMinutes(startMinutes, endMinutes, count, MIN_SPACING_MINUTES);

    case 'random': {
      // Attempt random placement with only a minimum gap constraint.
      const times: number[] = [];
      let attempts = 0;
      const window = endMinutes - startMinutes;
      while (times.length < count && attempts < count * 30) {
        attempts++;
        const candidate = startMinutes + randomInt(0, window);
        const tooClose = times.some((t) => Math.abs(t - candidate) < MIN_SPACING_MINUTES);
        if (!tooClose) times.push(candidate);
      }
      // Fall back to even distribution if random can't fit
      return times.length === count
        ? times.sort((a, b) => a - b)
        : generateSpacedMinutes(startMinutes, endMinutes, count, MIN_SPACING_MINUTES);
    }

    case 'morning_evening': {
      const mid = startMinutes + Math.floor((endMinutes - startMinutes) / 2);
      const morningCount = Math.ceil(count * 0.6);
      const eveningCount = count - morningCount;
      const morningTimes = generateSpacedMinutes(startMinutes, mid, morningCount, MIN_SPACING_MINUTES);
      const eveningTimes = generateSpacedMinutes(mid, endMinutes, eveningCount, MIN_SPACING_MINUTES);
      if (!morningTimes || !eveningTimes) {
        return generateSpacedMinutes(startMinutes, endMinutes, count, MIN_SPACING_MINUTES);
      }
      return [...morningTimes, ...eveningTimes].sort((a, b) => a - b);
    }
  }
}

/**
 * Schedule notifications for the next MAX_SCHEDULED_DAYS days.
 * Returns an array of ScheduledNotification metadata.
 */
export async function scheduleNotifications(
  settings: AppSettings,
): Promise<ScheduledNotification[]> {
  if (!settings.notificationsEnabled) return [];

  await cancelAllScheduled();

  const activeDays = getActiveDaysSet(settings);
  const startMinutes = settings.timeWindow.startHour * 60 + settings.timeWindow.startMinute;
  const endMinutes   = settings.timeWindow.endHour   * 60 + settings.timeWindow.endMinute;
  const distribution = settings.distributionStyle ?? 'even';
  const language     = settings.language ?? 'en';

  const scheduled: ScheduledNotification[] = [];
  const now = new Date();

  for (let dayOffset = 0; dayOffset < MAX_SCHEDULED_DAYS; dayOffset++) {
    const targetDate = new Date();
    targetDate.setDate(now.getDate() + dayOffset);
    targetDate.setHours(0, 0, 0, 0);

    if (!activeDays.has(targetDate.getDay())) continue;

    // For today, don't schedule anything in the past (with 15-min buffer)
    let effectiveStart = startMinutes;
    if (dayOffset === 0) {
      const nowMinutes = now.getHours() * 60 + now.getMinutes() + 15;
      effectiveStart = Math.max(startMinutes, nowMinutes);
    }

    if (effectiveStart >= endMinutes) continue;

    const times = getDistributedMinutes(
      effectiveStart,
      endMinutes,
      settings.remindersPerDay,
      distribution,
    );

    if (!times) continue;

    for (const minuteOfDay of times) {
      const fireDate = new Date(targetDate);
      fireDate.setHours(Math.floor(minuteOfDay / 60), minuteOfDay % 60, 0, 0);

      if (fireDate.getTime() <= now.getTime()) continue;

      const prompt = selectPrompt(settings);
      if (!prompt) continue;

      const { title, body } = buildNotificationContent(prompt, language);
      const payload: NotificationPayload = { promptId: prompt.id, category: prompt.category };

      try {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data: { ...payload, source: 'habita' },
            categoryIdentifier: NOTIFICATION_CATEGORY,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: fireDate,
          },
        });
        scheduled.push({ id, date: fireDate.toISOString(), promptId: prompt.id });
      } catch {
        // Expo Go restricts remote-notification channels — local scheduling
        // may still partially work; silently skip failures.
      }
    }
  }

  return scheduled;
}

/**
 * Get the count of Habita notifications scheduled for today.
 */
export async function getTodayScheduledCount(): Promise<number> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const todayStr = toDateString(new Date());

  return scheduled.filter((n) => {
    if (n.content.data?.source !== 'habita') return false;
    if (!n.trigger) return false;
    const trigger = n.trigger as { type?: string; value?: number; date?: number };
    if (trigger.type !== 'date') return false;
    const ms = trigger.value ?? trigger.date;
    if (!ms) return false;
    return toDateString(new Date(ms)) === todayStr;
  }).length;
}

/** Register notification categories (for future action buttons). */
export async function registerNotificationCategories(): Promise<void> {
  await Notifications.setNotificationCategoryAsync(NOTIFICATION_CATEGORY, []);
}
