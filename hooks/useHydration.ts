import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { setLanguage, detectDeviceLanguage } from '@/i18n';

/**
 * Hydrates the store from AsyncStorage on first mount.
 * On the very first run (no saved settings), applies the device language automatically.
 * On subsequent runs, restores the previously saved language preference.
 */
export function useHydration() {
  const { hydrate, isHydrated, settings } = useAppStore();

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (settings.hasCompletedOnboarding) {
      // User already set a language — respect their saved preference
      setLanguage(settings.language);
    } else {
      // First run: detect device language and apply it
      const detected = detectDeviceLanguage();
      setLanguage(detected);
      // Save it so the store reflects reality (won't trigger re-hydration)
      if (detected !== settings.language) {
        useAppStore.getState().updateSettings({ language: detected });
      }
    }
  }, [isHydrated]);

  return isHydrated;
}
