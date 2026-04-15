/**
 * StreakCelebration — a full-screen modal that appears when the user hits a
 * streak milestone (3, 7, 14, 30, 60, 100 days). It shows a beautiful
 * congratulatory card and offers a "Share" action.
 *
 * Design intent: feels like a meaningful moment, not a gamification trap.
 * The language is warm and spiritual, not competitive.
 */

import React, { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HText } from './ui/HText';
import { Colors, Spacing, Radii, Gradients, Typography } from '@/constants/theme';
import { t } from '@/i18n';
import { useShareCard } from '@/hooks/useShareCard';
import { ShareCard } from './ShareCard';
import type { Prompt } from '@/types';

// expo-haptics — optional
let Haptics: typeof import('expo-haptics') | null = null;
try { Haptics = require('expo-haptics'); } catch {}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface StreakCelebrationProps {
  streak: number;
  visible: boolean;
  onDismiss: () => void;
  /** A prompt to use if the user shares the streak card */
  todayPrompt: Prompt | null;
}

export function StreakCelebration({
  streak,
  visible,
  onDismiss,
  todayPrompt,
}: StreakCelebrationProps) {
  const scaleAnim  = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const { cardRef, shareAsImage } = useShareCard();

  useEffect(() => {
    if (visible) {
      // Haptic on milestone
      try { Haptics?.notificationAsync(Haptics.NotificationFeedbackType?.Success as any); } catch {}

      Animated.parallel([
        Animated.spring(scaleAnim,  { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 200 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const milestoneLabel = getMilestoneLabel(streak);

  async function handleShare() {
    if (!todayPrompt) return;
    try { await Haptics?.selectionAsync(); } catch {}
    await shareAsImage(todayPrompt);
  }

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      {/* Hidden capture target — off-screen */}
      {todayPrompt && (
        <View style={styles.offScreen}>
          <ShareCard ref={cardRef} prompt={todayPrompt} mode="streak" streak={streak} />
        </View>
      )}

      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onDismiss} />

        <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient
            colors={[Colors.primaryDeep, '#0D1F16']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.3, y: 1 }}
          />

          {/* Streak number */}
          <View style={styles.streakRow}>
            <HText
              serif
              color={Colors.gold}
              style={styles.streakNumber}
            >
              {String(streak)}
            </HText>
            <View style={styles.streakMeta}>
              <HText variant="bodySm" weight="semibold" serif={false} color={Colors.textInverse}>
                {t('streak.days_label')}
              </HText>
              <HText variant="micro" serif={false} color="rgba(250,247,242,0.5)" style={{ marginTop: 2 }}>
                {milestoneLabel}
              </HText>
            </View>
          </View>

          {/* Thin gold rule */}
          <View style={styles.rule} />

          {/* Title */}
          <HText variant="title" serif color={Colors.textInverse} style={styles.title}>
            {t('streak.milestone_title')}
          </HText>

          {/* Body */}
          <HText
            variant="bodySm"
            serif={false}
            color="rgba(250,247,242,0.6)"
            style={styles.body}
          >
            {t('streak.milestone_body')}
          </HText>

          {/* Actions */}
          <View style={styles.actions}>
            {todayPrompt && (
              <TouchableOpacity
                onPress={handleShare}
                activeOpacity={0.8}
                style={styles.shareBtn}
              >
                <HText variant="bodySm" weight="semibold" serif={false} color={Colors.gold}>
                  {t('streak.milestone_share')}
                </HText>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={onDismiss}
              activeOpacity={0.7}
              style={styles.dismissBtn}
            >
              <HText variant="body" weight="semibold" serif={false} color={Colors.primary}
                style={styles.dismissLabel}>
                {t('streak.milestone_dismiss')}
              </HText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

function getMilestoneLabel(streak: number): string {
  const map: Record<number, string> = {
    3: 'streak.milestone_3',
    7: 'streak.milestone_7',
    14: 'streak.milestone_14',
    30: 'streak.milestone_30',
    60: 'streak.milestone_60',
    100: 'streak.milestone_100',
  };
  return map[streak] ? t(map[streak]) : `${streak} ${t('streak.days_label')}`;
}

const styles = StyleSheet.create({
  offScreen: {
    position: 'absolute',
    left: -2000,
    top: -2000,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10,15,12,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  card: {
    width: Math.min(SCREEN_WIDTH - Spacing.lg * 2, 340),
    borderRadius: Radii['2xl'],
    padding: Spacing.xl,
    overflow: 'hidden',
    gap: Spacing.md,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.md,
  },
  streakNumber: {
    fontSize: 72,
    lineHeight: 72,
    fontWeight: '700',
    color: Colors.gold,
    ...(Platform.OS === 'android' && { includeFontPadding: false }),
  },
  streakMeta: {
    gap: 2,
  },
  rule: {
    height: 1,
    width: 40,
    backgroundColor: Colors.gold,
    opacity: 0.4,
  },
  title: {
    lineHeight: 32,
  },
  body: {
    lineHeight: 22,
  },
  actions: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  shareBtn: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.35)',
    alignItems: 'center',
    backgroundColor: 'rgba(200,169,110,0.08)',
  },
  dismissBtn: {
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radii.lg,
    alignItems: 'center',
    backgroundColor: Colors.textInverse,
  },
  dismissLabel: {
    color: Colors.primary,
  },
});
