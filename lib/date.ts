/**
 * Date utilities — pure functions, no external dependencies.
 */

/** Returns YYYY-MM-DD string for a given Date (local timezone). */
export function toDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Returns a Date at midnight (local) for a given YYYY-MM-DD string. */
export function fromDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/** Returns today's YYYY-MM-DD string. */
export function today(): string {
  return toDateString(new Date());
}

/** Returns yesterday's YYYY-MM-DD string. */
export function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toDateString(d);
}

/** Returns whether two YYYY-MM-DD strings are consecutive days. */
export function areConsecutiveDays(earlier: string, later: string): boolean {
  const a = fromDateString(earlier);
  const b = fromDateString(later);
  const diffMs = b.getTime() - a.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

/** Returns the day-of-week (0=Sunday … 6=Saturday) for a YYYY-MM-DD string. */
export function getDayOfWeek(dateStr: string): number {
  return fromDateString(dateStr).getDay();
}

/** Returns the hour (0–23) as a greeting bucket. */
export function getGreetingKey(): 'morning' | 'afternoon' | 'evening' {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

/** Format minutes as "H:MM AM/PM". */
export function formatTime(hour: number, minute: number): string {
  const period = hour < 12 ? 'AM' : 'PM';
  const h = hour % 12 === 0 ? 12 : hour % 12;
  const m = String(minute).padStart(2, '0');
  return `${h}:${m} ${period}`;
}

/** Returns a random integer in [min, max). */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Given a window [startMinutes, endMinutes] and a count,
 * return `count` random minute-offsets that are:
 *  - within the window
 *  - at least `minSpacingMinutes` apart
 *  - sorted ascending
 *
 * Returns null if the window is too narrow to fit all reminders.
 */
export function generateSpacedMinutes(
  startMinutes: number,
  endMinutes: number,
  count: number,
  minSpacingMinutes: number,
): number[] | null {
  const windowSize = endMinutes - startMinutes;
  const requiredMinSpace = count * minSpacingMinutes;

  if (windowSize < requiredMinSpace) return null;

  // Divide the window into `count` equal slots and pick a random time in each.
  const slotSize = Math.floor(windowSize / count);
  const times: number[] = [];

  for (let i = 0; i < count; i++) {
    const slotStart = startMinutes + i * slotSize;
    const slotEnd = slotStart + slotSize;
    // Leave at least minSpacingMinutes from the previous if needed
    const lowerBound =
      times.length > 0
        ? Math.max(slotStart, times[times.length - 1] + minSpacingMinutes)
        : slotStart;
    if (lowerBound >= slotEnd) {
      // Fallback: place it right at the lower bound
      times.push(lowerBound);
    } else {
      times.push(randomInt(lowerBound, slotEnd));
    }
  }

  return times;
}
