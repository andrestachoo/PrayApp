/**
 * useShareCard — captures a ShareCard View as a PNG and shares/saves it.
 *
 * react-native-view-shot is a native module — it works in production/dev builds
 * but NOT in Expo Go. The hook detects this and gracefully falls back to
 * sharing the prayer text via the system Share sheet.
 */

import { useRef, useCallback } from 'react';
import { Share, View, Alert } from 'react-native';
import { t } from '@/i18n';
import type { Prompt } from '@/types';

// Dynamic import of react-native-view-shot — silently absent in Expo Go
type CaptureRef = (ref: React.RefObject<View>, opts: { format: string; quality: number }) => Promise<string>;
let captureRef: CaptureRef | null = null;
try {
  captureRef = require('react-native-view-shot').captureRef as CaptureRef;
} catch {
  captureRef = null;
}

// Dynamic import of expo-sharing
type SharingModule = { isAvailableAsync: () => Promise<boolean>; shareAsync: (uri: string, opts?: object) => Promise<void> };
let Sharing: SharingModule | null = null;
try {
  Sharing = require('expo-sharing') as SharingModule;
} catch {
  Sharing = null;
}

export function useShareCard() {
  const cardRef = useRef<View>(null);

  /** Capture the card as PNG and share it via the OS share sheet. */
  const shareAsImage = useCallback(async (prompt: Prompt): Promise<boolean> => {
    // If native module unavailable, fall back to text
    if (!captureRef || !Sharing) {
      await shareAsText(prompt);
      return false;
    }

    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        await shareAsText(prompt);
        return false;
      }

      const uri = await captureRef(cardRef, { format: 'png', quality: 1 });
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: t('prompt.share'),
        UTI: 'public.png',
      });
      return true;
    } catch (err) {
      // Capture failed (Expo Go, permissions, etc.) — fall back to text
      await shareAsText(prompt);
      return false;
    }
  }, []);

  return { cardRef, shareAsImage };
}

/** Plain-text fallback for Expo Go or when image capture fails. */
async function shareAsText(prompt: Prompt): Promise<void> {
  const text = [
    `"${prompt.body}"`,
    '',
    `— ${prompt.title}`,
    '',
    t('prompt.share_signature'),
  ].join('\n');

  await Share.share({ message: text });
}
