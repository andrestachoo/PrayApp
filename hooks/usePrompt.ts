import { useState, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { selectPrompt, getPromptById } from '@/features/prompts/selector';
import type { Prompt } from '@/types';

/**
 * Hook for managing the active prompt shown on the prompt screen.
 */
export function usePrompt(initialId?: string) {
  const { settings, recordPromptOpened, recordPrayed } = useAppStore();

  const resolveInitial = (): Prompt | null => {
    const language = settings.language ?? 'en';
    if (initialId) {
      return getPromptById(initialId, language) ?? selectPrompt(settings);
    }
    return selectPrompt(settings);
  };

  const [prompt, setPrompt] = useState<Prompt | null>(resolveInitial);
  const [hasPrayed, setHasPrayed] = useState(false);

  // Record an open on mount — called once by the screen
  const onOpen = useCallback(() => {
    recordPromptOpened();
  }, [recordPromptOpened]);

  const onPrayed = useCallback(() => {
    if (!hasPrayed) {
      recordPrayed();
      setHasPrayed(true);
    }
  }, [hasPrayed, recordPrayed]);

  const nextPrompt = useCallback(() => {
    setHasPrayed(false);
    setPrompt(selectPrompt(settings));
  }, [settings]);

  return { prompt, hasPrayed, onOpen, onPrayed, nextPrompt };
}
