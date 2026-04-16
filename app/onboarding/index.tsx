import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { useNotificationActions } from '@/hooks/useNotifications';
import { CategoryPicker } from '@/components/CategoryPicker';
import { DayPicker } from '@/components/DayPicker';
import { TimeWindowPicker } from '@/components/TimeWindowPicker';
import { RemindersSlider } from '@/components/RemindersSlider';
import { HButton } from '@/components/ui/HButton';
import { HText } from '@/components/ui/HText';
import { HCard } from '@/components/ui/HCard';
import { Colors, Spacing, Radii, Shadows } from '@/constants/theme';
import { t, setLanguage, getSupportedLanguages, detectDeviceLanguage } from '@/i18n';
import type { Tone, Category, ActiveDays, DayOfWeek, TimeWindow } from '@/types';
import { DEFAULT_SETTINGS } from '@/constants/defaults';

type Step = 'welcome' | 'how' | 'tone' | 'categories' | 'schedule' | 'permissions' | 'done';
const STEP_ORDER: Step[] = ['welcome', 'how', 'tone', 'categories', 'schedule', 'permissions', 'done'];
const PROGRESS_STEPS = STEP_ORDER.filter((s) => s !== 'welcome' && s !== 'done');

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { updateSettings } = useAppStore();
  const { requestPermissions } = useNotificationActions();

  // Language toggle drives re-renders for live translation
  const [language, setLang] = useState(() => detectDeviceLanguage());
  const [stepIndex, setStepIndex] = useState(0);
  const [permissionLoading, setPermissionLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // User preference drafts — committed on the final step
  const [tone, setTone] = useState<Tone>(DEFAULT_SETTINGS.tone);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_SETTINGS.categories);
  const [activeDays, setActiveDays] = useState<ActiveDays>(DEFAULT_SETTINGS.activeDays);
  const [customDays, setCustomDays] = useState<DayOfWeek[]>(DEFAULT_SETTINGS.customDays);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>(DEFAULT_SETTINGS.timeWindow);
  const [remindersPerDay, setRemindersPerDay] = useState(DEFAULT_SETTINGS.remindersPerDay);

  const currentStep = STEP_ORDER[stepIndex];
  const progressIndex = PROGRESS_STEPS.indexOf(currentStep as any);

  function handleLanguageToggle(lang: string) {
    setLanguage(lang);  // updates i18n module
    setLang(lang);      // triggers re-render
  }

  function goNext() {
    if (stepIndex < STEP_ORDER.length - 1) setStepIndex((i) => i + 1);
  }

  function goBack() {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  async function handleRequestPermissions() {
    setPermissionLoading(true);
    const status = await requestPermissions();
    setPermissionGranted(status === 'granted');
    setPermissionLoading(false);
    goNext();
  }

  function finishOnboarding() {
    updateSettings({
      tone,
      categories,
      activeDays,
      customDays,
      timeWindow,
      remindersPerDay,
      notificationsEnabled: permissionGranted,
      hasCompletedOnboarding: true,
      language,
    });
    router.replace('/(tabs)');
  }

  const showProgress = currentStep !== 'welcome' && currentStep !== 'done';
  const showBack = stepIndex > 0 && currentStep !== 'done';

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom || Spacing.lg }]}>

      {/* ── Top chrome ─────────────────────────────────────── */}
      <View style={[styles.topBar, { paddingTop: insets.top + Spacing.sm }]}>
        {showBack ? (
          <TouchableOpacity onPress={goBack} activeOpacity={0.6} style={styles.backBtn}>
            <HText variant="body" serif={false} color={Colors.textTertiary}>
              ‹ {t('common.back')}
            </HText>
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtnPlaceholder} />
        )}

        {/* Language toggle — visible on welcome + how screens */}
        {(currentStep === 'welcome' || currentStep === 'how') && (
          <View style={styles.langRow}>
            {getSupportedLanguages().map((lang) => (
              <TouchableOpacity
                key={lang}
                onPress={() => handleLanguageToggle(lang)}
                activeOpacity={0.7}
                style={[styles.langBtn, language === lang && styles.langBtnActive]}
              >
                <HText
                  variant="caption"
                  weight={language === lang ? 'bold' : 'regular'}
                  serif={false}
                  color={language === lang ? Colors.primary : Colors.textTertiary}
                >
                  {t(`onboarding.language_${lang}`)}
                </HText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* ── Progress dots ───────────────────────────────────── */}
      {showProgress && (
        <View style={styles.progressRow}>
          {PROGRESS_STEPS.map((s, i) => (
            <View
              key={s}
              style={[
                styles.dot,
                i <= progressIndex ? styles.dotActive : styles.dotInactive,
                i === progressIndex && styles.dotCurrent,
              ]}
            />
          ))}
        </View>
      )}

      {/* ── Step content ────────────────────────────────────── */}
      <ScrollView
        key={`${currentStep}-${language}`}
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          currentStep === 'welcome' && styles.scrollWelcome,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ─── 1. WELCOME ─────────────────────────────────── */}
        {currentStep === 'welcome' && (
          <View style={styles.step}>
            <View style={styles.welcomeSymbol}>
              <View style={styles.welcomeCross} />
            </View>

            <Image
              source={require('@/assets/logo-dark.png')}
              style={styles.welcomeLogo}
              resizeMode="contain"
            />

            <HText variant="display" serif color={Colors.primary} style={styles.welcomeTitle}>
              {t('onboarding.welcome_title')}
            </HText>

            <HText variant="body" serif={false} color={Colors.textSecondary} style={styles.welcomeSubtitle}>
              {t('onboarding.welcome_subtitle')}
            </HText>

            <View style={styles.actions}>
              <HButton label={t('onboarding.welcome_cta')} onPress={goNext} variant="primary" size="lg" fullWidth />
            </View>
          </View>
        )}

        {/* ─── 2. HOW IT WORKS ────────────────────────────── */}
        {currentStep === 'how' && (
          <View style={styles.step}>
            <HText variant="heading" serif color={Colors.primary} style={styles.stepTitle}>
              {t('onboarding.how_title')}
            </HText>

            <View style={styles.featureCards}>
              {([1, 2, 3] as const).map((n) => (
                <View key={n} style={styles.featureCard}>
                  <HText variant="title" serif={false} style={styles.featureSymbol}>
                    {t(`onboarding.how_card_${n}_symbol`)}
                  </HText>
                  <View style={styles.featureText}>
                    <HText variant="bodySm" weight="semibold" serif={false} color={Colors.text}>
                      {t(`onboarding.how_card_${n}_title`)}
                    </HText>
                    <HText variant="caption" serif={false} color={Colors.textSecondary} style={styles.featureBody}>
                      {t(`onboarding.how_card_${n}_body`)}
                    </HText>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.actions}>
              <HButton label={t('onboarding.how_cta')} onPress={goNext} variant="primary" size="lg" fullWidth />
            </View>
          </View>
        )}

        {/* ─── 3. TONE ────────────────────────────────────── */}
        {currentStep === 'tone' && (
          <View style={styles.step}>
            <StepHeading title={t('onboarding.tone_title')} subtitle={t('onboarding.tone_subtitle')} />

            <View style={styles.toneCards}>
              {(['contemplative', 'direct', 'warm'] as Tone[]).map((opt) => {
                const active = tone === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setTone(opt)}
                    activeOpacity={0.75}
                    style={[styles.toneCard, active ? styles.toneCardActive : styles.toneCardInactive]}
                  >
                    <View style={styles.toneCardTop}>
                      <View>
                        <HText
                          variant="body"
                          weight={active ? 'semibold' : 'regular'}
                          serif={false}
                          color={active ? Colors.primary : Colors.text}
                        >
                          {t(`onboarding.tone_${opt}`)}
                        </HText>
                        <HText variant="caption" serif={false} color={Colors.textTertiary}>
                          {t(`onboarding.tone_${opt}_desc`)}
                        </HText>
                      </View>
                      {active && <View style={styles.toneActiveDot} />}
                    </View>
                    {active && (
                      <View style={styles.toneExample}>
                        <HText variant="caption" serif italic color={Colors.primaryLight}>
                          {t(`onboarding.tone_${opt}_example`)}
                        </HText>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.actions}>
              <HButton label={t('common.next')} onPress={goNext} variant="primary" size="lg" fullWidth />
            </View>
          </View>
        )}

        {/* ─── 4. CATEGORIES ──────────────────────────────── */}
        {currentStep === 'categories' && (
          <View style={styles.step}>
            <StepHeading title={t('onboarding.categories_title')} subtitle={t('onboarding.categories_subtitle')} />
            <CategoryPicker selected={categories} onChange={setCategories} />
            <View style={styles.actions}>
              <HButton label={t('common.next')} onPress={goNext} variant="primary" size="lg" fullWidth />
            </View>
          </View>
        )}

        {/* ─── 5. SCHEDULE ────────────────────────────────── */}
        {currentStep === 'schedule' && (
          <View style={styles.step}>
            <StepHeading title={t('onboarding.schedule_title')} subtitle={t('onboarding.schedule_subtitle')} />

            <SectionLabel label={t('onboarding.schedule_days_label')} />
            <DayPicker
              activeDays={activeDays}
              customDays={customDays}
              onActiveDaysChange={setActiveDays}
              onCustomDaysChange={setCustomDays}
            />

            <SectionLabel label={t('onboarding.schedule_time_label')} />
            <TimeWindowPicker value={timeWindow} onChange={setTimeWindow} />

            <SectionLabel label={t('onboarding.schedule_count_label')} />
            <RemindersSlider value={remindersPerDay} onChange={setRemindersPerDay} />

            <View style={styles.actions}>
              <HButton label={t('common.next')} onPress={goNext} variant="primary" size="lg" fullWidth />
            </View>
          </View>
        )}

        {/* ─── 6. PERMISSIONS ─────────────────────────────── */}
        {currentStep === 'permissions' && (
          <View style={[styles.step, styles.stepCentered]}>
            <View style={styles.permIcon}>
              <HText variant="display" serif={false}>🔔</HText>
            </View>

            <HText variant="micro" weight="bold" serif={false} color={Colors.textTertiary} center style={styles.eyebrow}>
              {t('onboarding.permissions_eyebrow')}
            </HText>

            <HText variant="heading" serif color={Colors.primary} center style={styles.permTitle}>
              {t('onboarding.permissions_title')}
            </HText>

            <HText variant="body" serif={false} color={Colors.textSecondary} center style={styles.permBody}>
              {t('onboarding.permissions_body')}
            </HText>

            <View style={styles.permPromise}>
              <HText variant="caption" serif={false} color={Colors.textTertiary} center style={styles.permPromiseText}>
                {t('onboarding.permissions_promise')}
              </HText>
            </View>

            <View style={styles.actions}>
              <HButton
                label={t('onboarding.permissions_cta')}
                onPress={handleRequestPermissions}
                variant="primary"
                size="lg"
                fullWidth
                loading={permissionLoading}
              />
              <HButton
                label={t('onboarding.permissions_skip')}
                onPress={goNext}
                variant="ghost"
                size="md"
                fullWidth
              />
            </View>
          </View>
        )}

        {/* ─── 7. DONE ────────────────────────────────────── */}
        {currentStep === 'done' && (
          <View style={[styles.step, styles.stepCentered]}>
            <View style={styles.doneSymbol}>
              <HText variant="display" serif={false} color={Colors.primaryMuted} center>✦</HText>
            </View>

            <HText variant="micro" weight="bold" serif={false} color={Colors.textTertiary} center style={styles.eyebrow}>
              {t('onboarding.done_eyebrow')}
            </HText>

            <HText variant="heading" serif color={Colors.primary} center style={styles.doneTitle}>
              {t('onboarding.done_title')}
            </HText>

            <HText variant="body" serif={false} color={Colors.textSecondary} center style={styles.doneSubtitle}>
              {t('onboarding.done_subtitle')}
            </HText>

            <View style={styles.actions}>
              <HButton
                label={t('onboarding.done_cta')}
                onPress={finishOnboarding}
                variant="primary"
                size="lg"
                fullWidth
              />
            </View>
          </View>
        )}

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function StepHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={subStyles.heading}>
      <HText variant="heading" serif color={Colors.primary}>{title}</HText>
      {subtitle && (
        <HText variant="bodySm" serif={false} color={Colors.textSecondary} style={subStyles.subtitle}>
          {subtitle}
        </HText>
      )}
    </View>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <HText variant="caption" weight="semibold" serif={false} color={Colors.textTertiary} style={subStyles.sectionLabel}>
      {label.toUpperCase()}
    </HText>
  );
}

const subStyles = StyleSheet.create({
  heading: { gap: Spacing.sm, marginBottom: Spacing.sm },
  subtitle: { lineHeight: 22 },
  sectionLabel: { letterSpacing: 0.8, marginTop: Spacing.lg, marginBottom: Spacing.sm },
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    minHeight: 48,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  backBtnPlaceholder: {
    width: 60,
  },
  langRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    backgroundColor: Colors.surface,
    borderRadius: Radii.full,
    padding: 3,
  },
  langBtn: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radii.full,
  },
  langBtnActive: {
    backgroundColor: Colors.surfaceElevated,
    ...Shadows.sm,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingBottom: Spacing.sm,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 6,
  },
  dotCurrent: {
    width: 18,
  },
  dotInactive: {
    backgroundColor: Colors.borderLight,
    width: 6,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  scrollWelcome: {
    paddingTop: Spacing['2xl'],
  },
  step: {
    gap: Spacing.lg,
  },
  stepCentered: {
    alignItems: 'center',
  },
  stepTitle: {
    lineHeight: 38,
  },
  // Welcome
  welcomeSymbol: {
    marginBottom: Spacing.md,
  },
  welcomeCross: {
    width: 2,
    height: 52,
    backgroundColor: Colors.primaryMuted,
    borderRadius: 1,
    marginLeft: 2,
  },
  welcomeLogo: {
    width: 280,
    height: 84,
    alignSelf: 'center',
    marginBottom: Spacing.sm,
  },
  eyebrow: {
    letterSpacing: 2,
    marginBottom: Spacing.xs,
  },
  welcomeTitle: {
    lineHeight: 48,
  },
  welcomeSubtitle: {
    lineHeight: 26,
  },
  actions: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  // How it works
  featureCards: {
    gap: Spacing.md,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  featureSymbol: {
    width: 36,
    textAlign: 'center',
    lineHeight: 32,
  },
  featureText: {
    flex: 1,
    gap: 4,
  },
  featureBody: {
    lineHeight: 20,
  },
  // Tone
  toneCards: {
    gap: Spacing.sm,
  },
  toneCard: {
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
  },
  toneCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryMuted,
  },
  toneCardInactive: {
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surfaceElevated,
  },
  toneCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  toneActiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  toneExample: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.primaryMuted,
  },
  // Permissions
  permIcon: {
    marginTop: Spacing['2xl'],
    marginBottom: Spacing.sm,
  },
  permTitle: {
    lineHeight: 38,
    marginBottom: Spacing.xs,
  },
  permBody: {
    lineHeight: 26,
    paddingHorizontal: Spacing.md,
  },
  permPromise: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    width: '100%',
  },
  permPromiseText: {
    lineHeight: 20,
  },
  // Done
  doneSymbol: {
    marginTop: Spacing['2xl'],
    marginBottom: Spacing.sm,
  },
  doneTitle: {
    lineHeight: 38,
    marginBottom: Spacing.xs,
  },
  doneSubtitle: {
    lineHeight: 26,
    paddingHorizontal: Spacing.md,
  },
});
