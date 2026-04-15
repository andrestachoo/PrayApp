import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { getTodayScheduledCount } from '@/features/notifications/scheduler';
import { selectPrompt } from '@/features/prompts/selector';
import { CategoryBadge } from '@/components/CategoryBadge';
import { ShareCard } from '@/components/ShareCard';
import { StreakCelebration } from '@/components/StreakCelebration';
import { useShareCard } from '@/hooks/useShareCard';
import { HButton } from '@/components/ui/HButton';
import { HText } from '@/components/ui/HText';
import { HCard } from '@/components/ui/HCard';
import { Colors, Spacing, Radii, Shadows, Typography, isMilestone } from '@/constants/theme';
import { t, tp } from '@/i18n';
import { getGreetingKey, today } from '@/lib/date';
import type { Category, Prompt } from '@/types';

const PHRASE_COUNT = 10; // must match home.phrase_0…phrase_9 in i18n

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { settings, stats, markMilestoneCelebrated } = useAppStore();
  const { cardRef: streakCardRef, shareAsImage } = useShareCard();
  const [todayCount, setTodayCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [sharingStreak, setSharingStreak] = useState(false);

  // Pick a stable daily invitation prompt (changes once per day)
  const invitationPrompt: Prompt | null = useMemo(
    () => selectPrompt(settings),
    // Re-pick when categories, tone, language, or length changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings.categories.join(','), settings.tone, settings.promptLength, settings.language],
  );

  const phrase = t(`home.phrase_${new Date().getDate() % PHRASE_COUNT}`);
  const greetingKey = `home.greeting_${getGreetingKey()}` as const;
  const prayedToday = stats.lastPrayedDate === today();

  async function loadTodayCount() {
    const count = await getTodayScheduledCount();
    setTodayCount(count);
  }

  // Reload notification count on every focus (catches changes after returning from prompt screen)
  useFocusEffect(
    useCallback(() => {
      loadTodayCount();
    }, [settings.notificationsEnabled, settings.remindersPerDay]),
  );

  useEffect(() => { loadTodayCount(); }, [settings]);

  // Show streak celebration when a milestone is newly reached
  useEffect(() => {
    const { currentStreak, lastCelebratedMilestone = 0 } = stats;
    if (
      currentStreak > 0 &&
      isMilestone(currentStreak) &&
      currentStreak > lastCelebratedMilestone
    ) {
      // Small delay so the home screen settles before the modal appears
      const timer = setTimeout(() => setCelebrationVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, [stats.currentStreak]);

  async function onRefresh() {
    setRefreshing(true);
    await loadTodayCount();
    setRefreshing(false);
  }

  function openPrompt(id?: string) {
    if (id) {
      router.push(`/prompt?id=${id}`);
    } else {
      router.push('/prompt');
    }
  }

  async function handleShareStreak() {
    if (!invitationPrompt || sharingStreak || stats.currentStreak === 0) return;
    setSharingStreak(true);
    await shareAsImage(invitationPrompt);
    setSharingStreak(false);
  }

  function handleDismissCelebration() {
    markMilestoneCelebrated(stats.currentStreak);
    setCelebrationVisible(false);
  }

  const visibleCategories = settings.categories.slice(0, 5);
  const remaining = settings.categories.length - visibleCategories.length;

  return (
    <>
      {/* Off-screen streak card for capture — invisible to user */}
      {invitationPrompt && (
        <View style={styles.offScreen}>
          <ShareCard
            ref={streakCardRef}
            prompt={invitationPrompt}
            mode="streak"
            streak={stats.currentStreak}
          />
        </View>
      )}

    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
        />
      }
    >

      {/* ── App logo ───────────────────────────────────────────────────── */}
      <Image
        source={require('@/assets/logo-dark.png')}
        style={styles.appLogo}
        resizeMode="contain"
      />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <HText variant="display" serif color={Colors.primary} style={styles.phrase}>
          {phrase}
        </HText>
        <HText variant="bodySm" serif={false} color={Colors.textSecondary} style={styles.greeting}>
          {t(greetingKey)}
        </HText>
      </View>

      {/* ── Notifications-off banner ────────────────────────────────────── */}
      {!settings.notificationsEnabled && (
        <TouchableOpacity
          onPress={() => router.push('/settings')}
          activeOpacity={0.7}
          style={styles.warningBanner}
        >
          <HText variant="caption" serif={false} color={Colors.accent}>
            {t('home.notifications_off_banner')}
          </HText>
        </TouchableOpacity>
      )}

      {/* ── Today's invitation card ─────────────────────────────────────── */}
      {invitationPrompt && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => openPrompt(invitationPrompt.id)}
          style={styles.invitationCard}
        >
          {/* Label row */}
          <View style={styles.invitationHeader}>
            <HText
              variant="micro"
              weight="semibold"
              serif={false}
              color={Colors.textInverse}
              style={styles.invitationEyebrow}
            >
              {t('home.today_invitation')}
            </HText>
            <CategoryBadge category={invitationPrompt.category} size="sm" inverted />
          </View>

          {/* Prompt title */}
          <HText
            variant="title"
            serif
            color={Colors.textInverse}
            style={styles.invitationTitle}
          >
            {invitationPrompt.title}
          </HText>

          {/* Teaser body */}
          <HText
            variant="bodySm"
            serif={false}
            color="rgba(250,247,242,0.7)"
            style={styles.invitationTeaser}
            numberOfLines={2}
          >
            {invitationPrompt.body}
          </HText>

          {/* Duration chip */}
          {invitationPrompt.suggestedDuration && (
            <HText
              variant="micro"
              serif={false}
              color="rgba(250,247,242,0.5)"
              style={styles.invitationDuration}
            >
              {invitationPrompt.suggestedDuration < 60
                ? t('prompt.duration_label_seconds', { seconds: invitationPrompt.suggestedDuration })
                : t('prompt.duration_label', { minutes: Math.round(invitationPrompt.suggestedDuration / 60) })}
            </HText>
          )}

          {/* Tap-to-open arrow */}
          <View style={styles.invitationArrow}>
            <HText variant="body" serif={false} color="rgba(250,247,242,0.45)">›</HText>
          </View>
        </TouchableOpacity>
      )}

      {/* ── Primary CTA ─────────────────────────────────────────────────── */}
      <HButton
        label={t('home.cta_pray')}
        onPress={() => openPrompt()}
        variant="primary"
        size="lg"
        fullWidth
      />

      {/* ── Practice stats ───────────────────────────────────────────────── */}
      <View style={styles.statsSection}>
        <View style={styles.statsSectionHeader}>
          <HText
            variant="micro"
            weight="semibold"
            serif={false}
            color={Colors.textTertiary}
            style={styles.sectionLabel}
          >
            {t('home.your_practice')}
          </HText>
          <View style={styles.statsBadgeRow}>
            {prayedToday && (
              <View style={styles.prayedTodayBadge}>
                <HText variant="micro" weight="semibold" serif={false} color={Colors.primary}>
                  {t('home.prayed_today')}
                </HText>
              </View>
            )}
            {stats.currentStreak > 0 && invitationPrompt && (
              <TouchableOpacity
                onPress={handleShareStreak}
                activeOpacity={0.6}
                disabled={sharingStreak}
                style={styles.shareStreakBtn}
              >
                {sharingStreak
                  ? <HText variant="micro" serif={false} color={Colors.primary}>…</HText>
                  : <Ionicons name="share-outline" size={17} color={Colors.primary} />
                }
              </TouchableOpacity>
            )}
          </View>
        </View>
        <HCard padding="lg" style={styles.statsCard}>
          <View style={styles.statsRow}>
            {/* Streak */}
            <View style={styles.statItem}>
              <HText variant="heading" weight="bold" serif color={Colors.primary}>
                {String(stats.currentStreak)}
              </HText>
              <HText variant="micro" serif={false} color={Colors.textTertiary} center>
                {tp('home.stats_streak', stats.currentStreak, { count: stats.currentStreak })}
              </HText>
            </View>

            <View style={styles.statDivider} />

            {/* Reminders today */}
            <View style={styles.statItem}>
              <HText variant="heading" weight="bold" serif color={Colors.primary}>
                {String(settings.notificationsEnabled ? todayCount : 0)}
              </HText>
              <HText variant="micro" serif={false} color={Colors.textTertiary} center>
                {settings.notificationsEnabled
                  ? tp('home.reminders_active', todayCount, { count: todayCount })
                  : t('home.reminders_off')}
              </HText>
            </View>

            <View style={styles.statDivider} />

            {/* Total prayers */}
            <View style={styles.statItem}>
              <HText variant="heading" weight="bold" serif color={Colors.primary}>
                {String(stats.totalPrayed)}
              </HText>
              <HText variant="micro" serif={false} color={Colors.textTertiary} center>
                {tp('home.stats_total_prayers', stats.totalPrayed, { count: stats.totalPrayed })}
              </HText>
            </View>
          </View>
        </HCard>
      </View>

      {/* ── Active themes ────────────────────────────────────────────────── */}
      <View style={styles.themesSection}>
        <HText
          variant="micro"
          weight="semibold"
          serif={false}
          color={Colors.textTertiary}
          style={styles.sectionLabel}
        >
          {t('home.categories_label').toUpperCase()}
        </HText>
        <View style={styles.categoriesRow}>
          {visibleCategories.map((cat) => (
            <CategoryBadge key={cat} category={cat as Category} size="sm" />
          ))}
          {remaining > 0 && (
            <HText variant="caption" serif={false} color={Colors.textTertiary}>
              +{remaining}
            </HText>
          )}
        </View>
      </View>

      <View style={{ height: insets.bottom + Spacing.xl }} />
    </ScrollView>

    {/* ── Streak milestone celebration ─────────────────────── */}
    <StreakCelebration
      streak={stats.currentStreak}
      visible={celebrationVisible}
      onDismiss={handleDismissCelebration}
      todayPrompt={invitationPrompt}
    />
    </>
  );
}

const styles = StyleSheet.create({
  offScreen: { position: 'absolute', left: -9999, top: -9999 },
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  appLogo: {
    width: 200,
    height: 60,
    alignSelf: 'center',
    marginBottom: Spacing.xs,
  },
  header: {
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  phrase: {
    lineHeight: 46,
  },
  greeting: {
    marginTop: Spacing.xs,
  },
  warningBanner: {
    backgroundColor: Colors.accentLight,
    borderRadius: Radii.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },

  // ─── Invitation card ─────────────────────────────────────────────────
  invitationCard: {
    backgroundColor: Colors.primaryDeep,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.lg,
  },
  invitationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  invitationEyebrow: {
    letterSpacing: 1.5,
    opacity: 0.6,
  },
  invitationTitle: {
    lineHeight: 32,
  },
  invitationTeaser: {
    lineHeight: 22,
  },
  invitationDuration: {
    marginTop: Spacing.xs,
  },
  invitationArrow: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
  },

  // ─── Stats ───────────────────────────────────────────────────────────
  statsSection: {
    gap: Spacing.sm,
  },
  statsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  shareStreakBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayedTodayBadge: {
    backgroundColor: Colors.primaryMuted,
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
  },
  statsCard: {
    width: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 44,
    backgroundColor: Colors.borderLight,
  },
  sectionLabel: {
    letterSpacing: 1.5,
  },

  // ─── Themes ──────────────────────────────────────────────────────────
  themesSection: {
    gap: Spacing.sm,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    alignItems: 'center',
  },
});
