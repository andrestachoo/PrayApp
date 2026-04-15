import { useCallback, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import {
  scheduleNotifications,
  cancelAllScheduled,
} from '@/features/notifications/scheduler';
import {
  requestNotificationPermissions,
  getNotificationPermissionStatus,
  configureNotificationHandler,
} from '@/features/notifications/permissions';

/**
 * Mount ONCE in the root layout.
 * Handles:
 *  - Notification handler config
 *  - Auto-rescheduling when settings change
 *  - Tap-to-navigate when user opens a notification
 */
export function useNotificationRoot() {
  const { settings, setScheduledNotifications } = useAppStore();
  const responseListener = useRef<Notifications.EventSubscription>();
  const router = useRouter();

  useEffect(() => {
    configureNotificationHandler();
  }, []);

  // Re-schedule when any setting that affects notifications changes.
  // Language is included so changing it immediately regenerates banners
  // in the new language — fixing the notification language bug.
  useEffect(() => {
    if (!settings.hasCompletedOnboarding) return;
    if (!settings.notificationsEnabled) {
      cancelAllScheduled();
      setScheduledNotifications([]);
      return;
    }
    scheduleNotifications(settings).then(setScheduledNotifications);
  }, [
    settings.notificationsEnabled,
    settings.remindersPerDay,
    settings.intensity,
    settings.distributionStyle,
    settings.promptLength,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    settings.categories.join(','),
    settings.tone,
    settings.activeDays,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    settings.customDays.join(','),
    settings.timeWindow.startHour,
    settings.timeWindow.startMinute,
    settings.timeWindow.endHour,
    settings.timeWindow.endMinute,
    settings.hasCompletedOnboarding,
    settings.language,   // ← language change triggers reschedule with new banner text
  ]);

  // Navigate to prompt when user taps a notification
  useEffect(() => {
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as {
          promptId?: string;
          source?: string;
        };
        if (data?.source !== 'habita') return;
        if (data?.promptId) {
          router.push(`/prompt?id=${data.promptId}`);
        } else {
          router.push('/prompt');
        }
      },
    );
    return () => responseListener.current?.remove();
  }, [router]);
}

/**
 * Lightweight hook for use in settings and onboarding.
 * Does NOT register listeners — just exposes permission + schedule actions.
 */
export function useNotificationActions() {
  const { settings, updateSettings, setScheduledNotifications } = useAppStore();

  const requestPermissions = useCallback(async () => {
    const status = await requestNotificationPermissions();
    if (status === 'granted') {
      updateSettings({ notificationsEnabled: true });
    }
    return status;
  }, [updateSettings]);

  const checkPermissions = useCallback(() => {
    return getNotificationPermissionStatus();
  }, []);

  const regenerateSchedule = useCallback(async () => {
    if (!settings.notificationsEnabled) return;
    const scheduled = await scheduleNotifications(settings);
    setScheduledNotifications(scheduled);
  }, [settings, setScheduledNotifications]);

  return { requestPermissions, checkPermissions, regenerateSchedule };
}
