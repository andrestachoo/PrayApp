/**
 * ShareCard — 9:16 Instagram Story-ready prayer card.
 *
 * Designed to be:
 *  - Captured by react-native-view-shot as a PNG
 *  - Visually beautiful without needing photos or complex graphics
 *  - Typography-led, calm, and spiritual
 *
 * The card is always rendered off-screen (position: absolute, opacity: 0)
 * except when previewed. The ref is passed to the capture hook.
 */

import React, { forwardRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HText } from './ui/HText';
import { Colors, Spacing, Radii, getPromptTheme, getPromptGradient, Typography } from '@/constants/theme';
import { t } from '@/i18n';
import type { Prompt } from '@/types';

// 9:16 aspect ratio at 375 × 667 logical pixels.
// At 3× density this renders as 1125 × 2001 — sharp on any device.
export const CARD_WIDTH  = 375;
export const CARD_HEIGHT = 667;

// Max characters for the prayer body on the card — truncate beyond this.
const MAX_BODY_CHARS = 220;

interface ShareCardProps {
  prompt: Prompt;
  /** 'prayer' for a regular prayer card, 'streak' for a streak card */
  mode?: 'prayer' | 'streak';
  streak?: number;
}

/**
 * ShareCard — use forwardRef so the parent can pass this ref to captureRef().
 */
export const ShareCard = forwardRef<View, ShareCardProps>(
  ({ prompt, mode = 'prayer', streak = 0 }, ref) => {
    const theme    = getPromptTheme(prompt.id);
    const gradient = getPromptGradient(theme.id);

    const body = prompt.body.length > MAX_BODY_CHARS
      ? prompt.body.slice(0, MAX_BODY_CHARS - 1).trimEnd() + '…'
      : prompt.body;

    if (mode === 'streak') {
      return (
        <View ref={ref} style={styles.card} collapsable={false}>
          <LinearGradient
            colors={[Colors.primaryDeep, '#0E2219']}
            style={StyleSheet.absoluteFill}
          />
          <StreakCardContent streak={streak} prompt={prompt} />
        </View>
      );
    }

    return (
      <View ref={ref} style={styles.card} collapsable={false}>
        {/* Background gradient */}
        <LinearGradient
          colors={gradient as [string, string]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        {/* ── Card content ──────────────────────────────────────── */}
        <View style={styles.inner}>

          {/* Top row: brand + category */}
          <View style={styles.topRow}>
            <HText
              variant="micro"
              weight="semibold"
              serif={false}
              color={Colors.gold}
              style={styles.brand}
            >
              HABITA
            </HText>
            <View style={styles.categoryPill}>
              <HText variant="micro" weight="semibold" serif={false} color="rgba(250,247,242,0.7)">
                {t(`categories.${prompt.category}`).toUpperCase()}
              </HText>
            </View>
          </View>

          {/* Spacer */}
          <View style={styles.topSpacer} />

          {/* Decorative glyph */}
          <HText
            variant="bodySm"
            serif={false}
            color={Colors.gold}
            style={styles.glyph}
          >
            ✦
          </HText>

          {/* Prayer body — the main content */}
          <HText
            variant="title"
            serif
            color={Colors.textInverse}
            style={styles.body}
          >
            {`"${body}"`}
          </HText>

          {/* Thin rule */}
          <View style={styles.rule} />

          {/* Prompt title */}
          <HText
            variant="caption"
            weight="semibold"
            serif={false}
            color="rgba(250,247,242,0.55)"
            style={styles.promptTitle}
          >
            {prompt.title.toUpperCase()}
          </HText>

          {/* Bottom spacer */}
          <View style={styles.bottomSpacer} />

          {/* Signature */}
          <HText
            variant="micro"
            serif={false}
            color="rgba(250,247,242,0.35)"
            style={styles.signature}
          >
            {t('prompt.share_signature')}
          </HText>
        </View>
      </View>
    );
  },
);

ShareCard.displayName = 'ShareCard';

// ─── Streak card inner content ────────────────────────────────────────────────

function StreakCardContent({ streak, prompt }: { streak: number; prompt: Prompt }) {
  const milestoneKey = getMilestoneKey(streak);
  return (
    <View style={styles.inner}>
      <View style={styles.topRow}>
        <HText variant="micro" weight="semibold" serif={false} color={Colors.gold} style={styles.brand}>
          HABITA
        </HText>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.sm }}>
        <HText
          variant="micro"
          weight="semibold"
          serif={false}
          color={Colors.gold}
          style={{ letterSpacing: 2, opacity: 0.8 }}
        >
          {t('streak.share_card_label').toUpperCase()}
        </HText>
        <HText
          serif
          color={Colors.textInverse}
          style={styles.streakNumber}
        >
          {String(streak)}
        </HText>
        <HText variant="bodySm" serif={false} color="rgba(250,247,242,0.65)" center>
          {milestoneKey ? t(milestoneKey) : `${streak} ${t('streak.days_label')}`}
        </HText>

        <View style={[styles.rule, { marginTop: Spacing.lg }]} />

        <HText
          variant="bodySm"
          serif
          italic
          color="rgba(250,247,242,0.5)"
          center
          style={{ paddingHorizontal: Spacing.xl, lineHeight: 24 }}
        >
          {`"${prompt.body.slice(0, 100).trimEnd()}…"`}
        </HText>
      </View>

      <HText variant="micro" serif={false} color="rgba(250,247,242,0.25)" style={styles.signature}>
        {t('prompt.share_signature')}
      </HText>
    </View>
  );
}

function getMilestoneKey(streak: number): string | null {
  const milestones: Record<number, string> = {
    3: 'streak.milestone_3',
    7: 'streak.milestone_7',
    14: 'streak.milestone_14',
    30: 'streak.milestone_30',
    60: 'streak.milestone_60',
    100: 'streak.milestone_100',
  };
  return milestones[streak] ?? null;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    overflow: 'hidden',
  },
  inner: {
    flex: 1,
    paddingHorizontal: Spacing.xl + 4,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },

  // ── Top bar
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    letterSpacing: 3,
  },
  categoryPill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },

  // ── Spacers
  topSpacer: {
    flex: 0.35,
  },
  bottomSpacer: {
    flex: 1,
  },

  // ── Content
  glyph: {
    marginBottom: Spacing.md,
    opacity: 0.7,
  },
  body: {
    lineHeight: 36,
    marginBottom: Spacing.xl,
  },
  rule: {
    width: 32,
    height: 1,
    backgroundColor: 'rgba(250,247,242,0.25)',
    marginBottom: Spacing.md,
  },
  promptTitle: {
    letterSpacing: 1.5,
  },

  // ── Footer
  signature: {
    letterSpacing: 0.5,
  },

  // ── Streak
  streakNumber: {
    fontSize: 96,
    lineHeight: 96,
    fontWeight: '700',
    color: Colors.textInverse,
    ...(Platform.OS === 'android' && { includeFontPadding: false }),
  },
});
