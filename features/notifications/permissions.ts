import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined' | 'unavailable';

/**
 * Configure how notifications appear when the app is foregrounded.
 * Wrapped in try/catch because Expo Go SDK 53+ logs errors related to
 * push (remote) notification registration — which we don't use.
 * Local notification scheduling is unaffected.
 */
export function configureNotificationHandler(): void {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  } catch {
    // Expected warning in Expo Go — local notifications still work
  }
}

/** Request notification permissions from the OS. */
export async function requestNotificationPermissions(): Promise<PermissionStatus> {
  if (!Device.isDevice) return 'unavailable';

  try {
    if (Platform.OS === 'android' && (Platform.Version as number) >= 33) {
      const { status } = await Notifications.requestPermissionsAsync();
      return status as PermissionStatus;
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return 'granted';

    const { status } = await Notifications.requestPermissionsAsync();
    return status as PermissionStatus;
  } catch {
    // Expo Go SDK 53+: push notification APIs throw; local notifications may still work
    return 'denied';
  }
}

/** Check current permission status without showing a prompt. */
export async function getNotificationPermissionStatus(): Promise<PermissionStatus> {
  if (!Device.isDevice) return 'unavailable';
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status as PermissionStatus;
  } catch {
    return 'undetermined';
  }
}
