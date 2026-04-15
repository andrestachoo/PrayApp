import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useAppStore';
import { useNotificationActions } from '@/hooks/useNotifications';
import { CategoryPicker } from '@/components/CategoryPicker';
import { CategoryBadge } from '@/components/CategoryBadge';
import { DayPicker } from '@/components/DayPicker';
import { TimeWindowPicker } from '@/components/TimeWindowPicker';
import { HText } from '@/components/ui/HText';
import { Colors, Spacing, Radii, Shadows } from '@/constants/theme';
import { t, setLanguage, getSupportedLanguages, tp } from '@/i18n';
import { formatTime } from '@/lib/date';
import type {
  Tone, Category, ActiveDays, DayOfWeek,
  NotificationIntensity, DistributionStyle, PromptLength,
} from '@/types';

type SheetType = 'categories' | 'days' | 'time' | null;

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { settings, updateSettings, resetOnboarding } = useAppStore();
  const { requestPermissions } = useNotificationActions();

  const [activeSheet, setActiveSheet] = useState<SheetType>(null);

  // Draft state for modal pickers
  const [draftCategories, setDraftCategories] = useState<Category[]>(settings.categories);
  const [draftActiveDays, setDraftActiveDays] = useState<ActiveDays>(settings.activeDays);
  const [draftCustomDays, setDraftCustomDays] = useState<DayOfWeek[]>(settings.customDays);
  const [draftTimeWindow, setDraftTimeWindow] = useState(settings.timeWindow);

  function openSheet(type: SheetType) {
    setDraftCategories(settings.categories);
    setDraftActiveDays(settings.activeDays);
    setDraftCustomDays(settings.customDays);
    setDraftTimeWindow(settings.timeWindow);
    setActiveSheet(type);
  }

  function commitSheet() {
    switch (activeSheet) {
      case 'categories': updateSettings({ categories: draftCategories }); break;
      case 'days':       updateSettings({ activeDays: draftActiveDays, customDays: draftCustomDays }); break;
      case 'time':       updateSettings({ timeWindow: draftTimeWindow }); break;
    }
    setActiveSheet(null);
  }

  async function handleToggleNotifications(value: boolean) {
    if (value) {
      const status = await requestPermissions();
      if (status !== 'granted') {
        Alert.alert('', t('errors.notifications_denied'));
        return;
      }
    }
    updateSettings({ notificationsEnabled: value });
  }

  function handleResetOnboarding() {
    Alert.alert(
      t('settings.reset_onboarding'),
      t('settings.reset_onboarding_confirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.yes'),
          style: 'destructive',
          onPress: () => {
            resetOnboarding();
            router.replace('/onboarding');
          },
        },
      ],
    );
  }

  function handleLanguageChange(lang: string) {
    setLanguage(lang);
    updateSettings({ language: lang });
  }

  const daysSummary = {
    all:      t('onboarding.days_all'),
    weekdays: t('onboarding.days_weekdays'),
    weekends: t('onboarding.days_weekends'),
    custom:   tp('settings.custom_days_count', settings.customDays.length, { count: settings.customDays.length }),
  }[settings.activeDays];

  const timeSummary = `${formatTime(settings.timeWindow.startHour, settings.timeWindow.startMinute)} – ${formatTime(settings.timeWindow.endHour, settings.timeWindow.endMinute)}`;

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────────────────────── */}
        <Image
          source={require('@/assets/logo-dark.png')}
          style={styles.appLogo}
          resizeMode="contain"
        />
        <HText variant="heading" serif color={Colors.primary} style={styles.pageTitle}>
          {t('settings.title')}
        </HText>

        {/* ══ PRAYER ══════════════════════════════════════════════ */}
        <SectionLabel>{t('settings.section_prayer').toUpperCase()}</SectionLabel>

        {/* Categories — shows the actual selected badges */}
        <TouchableOpacity
          onPress={() => openSheet('categories')}
          activeOpacity={0.75}
          style={styles.categoriesCard}
        >
          <View style={styles.cardHeader}>
            <HText variant="caption" weight="semibold" serif={false} color={Colors.textSecondary}>
              {t('settings.categories')}
            </HText>
            <HText variant="caption" weight="semibold" serif={false} color={Colors.primary}>
              {t('common.edit')} ›
            </HText>
          </View>
          <View style={styles.badgesRow}>
            {settings.categories.length > 0
              ? settings.categories.map((cat) => (
                  <CategoryBadge key={cat} category={cat as Category} size="sm" />
                ))
              : (
                <HText variant="caption" serif={false} color={Colors.textTertiary}>
                  {t('settings.categories_none_warning')}
                </HText>
              )
            }
          </View>
        </TouchableOpacity>

        {/* Prayer tone — 3 inline selection cards */}
        <SectionRow label={t('settings.tone')}>
          <View style={styles.threeCol}>
            {(['contemplative', 'direct', 'warm'] as Tone[]).map((tone) => (
              <SelectionCard
                key={tone}
                label={t(`onboarding.tone_${tone}`)}
                description={t(`onboarding.tone_${tone}_desc`)}
                selected={settings.tone === tone}
                onPress={() => updateSettings({ tone })}
              />
            ))}
          </View>
        </SectionRow>

        {/* Prayer depth */}
        <SectionRow label={t('settings.prompt_length')}>
          <View style={styles.chipRow}>
            {(['any', 'short', 'reflective'] as PromptLength[]).map((len) => (
              <SelectChip
                key={len}
                label={t(`settings.prompt_length_${len}`)}
                selected={(settings.promptLength ?? 'any') === len}
                onPress={() => updateSettings({ promptLength: len })}
              />
            ))}
          </View>
        </SectionRow>

        {/* ══ SCHEDULE ════════════════════════════════════════════ */}
        <SectionLabel style={styles.sectionGap}>{t('settings.section_schedule').toUpperCase()}</SectionLabel>

        {/* Reminders per day */}
        <SectionRow label={t('settings.intensity')}>
          <View style={styles.threeCol}>
            {(['light', 'balanced', 'frequent'] as NotificationIntensity[]).map((level) => (
              <SelectionCard
                key={level}
                label={t(`settings.intensity_${level}`)}
                description={t(`settings.intensity_${level}_desc`)}
                selected={settings.intensity === level}
                onPress={() => updateSettings({ intensity: level })}
              />
            ))}
          </View>
        </SectionRow>

        {/* Daily rhythm — radio list */}
        <SectionRow label={t('settings.distribution')}>
          <View style={styles.rhythmStack}>
            {([
              { value: 'even',             hint: t('settings.distribution_even_hint') },
              { value: 'morning_evening',  hint: t('settings.distribution_morning_evening_hint') },
              { value: 'random',           hint: t('settings.distribution_random_hint') },
            ] as { value: DistributionStyle; hint: string }[]).map(({ value, hint }, i, arr) => (
              <RhythmRow
                key={value}
                label={t(`settings.distribution_${value}`)}
                hint={hint}
                selected={(settings.distributionStyle ?? 'even') === value}
                onPress={() => updateSettings({ distributionStyle: value })}
                isLast={i === arr.length - 1}
              />
            ))}
          </View>
        </SectionRow>

        {/* Active days */}
        <TapRow
          label={t('settings.active_days')}
          value={daysSummary}
          onPress={() => openSheet('days')}
        />

        {/* Time window */}
        <TapRow
          label={t('settings.time_window')}
          value={timeSummary}
          onPress={() => openSheet('time')}
        />

        {/* ══ NOTIFICATIONS ═══════════════════════════════════════ */}
        <SectionLabel style={styles.sectionGap}>{t('settings.section_notifications').toUpperCase()}</SectionLabel>

        <View style={styles.switchCard}>
          <View style={styles.switchLeft}>
            <HText variant="body" serif={false} color={Colors.text}>
              {t('settings.notifications_toggle')}
            </HText>
            <HText variant="caption" serif={false} color={Colors.textTertiary} style={styles.switchHint}>
              {settings.notificationsEnabled
                ? t('settings.notifications_auto_hint')
                : t('home.reminders_off')}
            </HText>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: Colors.borderLight, true: Colors.primaryLight }}
            thumbColor={Colors.surfaceElevated}
          />
        </View>

        {/* ══ APP ═════════════════════════════════════════════════ */}
        <SectionLabel style={styles.sectionGap}>{t('settings.section_app').toUpperCase()}</SectionLabel>

        {/* Language */}
        <SectionRow label={t('settings.language')}>
          <View style={styles.chipRow}>
            {getSupportedLanguages().map((lang) => (
              <SelectChip
                key={lang}
                label={t(`onboarding.language_${lang}`)}
                selected={settings.language === lang}
                onPress={() => handleLanguageChange(lang)}
              />
            ))}
          </View>
        </SectionRow>

        {/* Reset — visually separated danger zone */}
        <View style={styles.resetDivider} />
        <TouchableOpacity
          onPress={handleResetOnboarding}
          activeOpacity={0.7}
          style={styles.resetRow}
        >
          <HText variant="bodySm" serif={false} color={Colors.error}>
            {t('settings.reset_onboarding')}
          </HText>
          <Ionicons name="chevron-forward" size={14} color={Colors.error} />
        </TouchableOpacity>

        <View style={{ height: insets.bottom + Spacing.xl }} />
      </ScrollView>

      {/* ─── Modal pickers ─────────────────────────────────────── */}
      <BottomSheet
        visible={activeSheet !== null}
        onClose={() => setActiveSheet(null)}
        onDone={commitSheet}
      >
        {activeSheet === 'categories' && (
          <SheetContent title={t('settings.categories')}>
            <CategoryPicker selected={draftCategories} onChange={setDraftCategories} />
          </SheetContent>
        )}
        {activeSheet === 'days' && (
          <SheetContent title={t('settings.active_days')}>
            <DayPicker
              activeDays={draftActiveDays}
              customDays={draftCustomDays}
              onActiveDaysChange={setDraftActiveDays}
              onCustomDaysChange={setDraftCustomDays}
            />
          </SheetContent>
        )}
        {activeSheet === 'time' && (
          <SheetContent title={t('settings.time_window')}>
            <TimeWindowPicker value={draftTimeWindow} onChange={setDraftTimeWindow} />
          </SheetContent>
        )}
      </BottomSheet>
    </>
  );
}

// ─── Layout helpers ───────────────────────────────────────────────────────────

function SectionLabel({ children, style }: { children: string; style?: object }) {
  return (
    <HText
      variant="micro"
      weight="semibold"
      serif={false}
      color={Colors.textTertiary}
      style={[{ letterSpacing: 1.5, marginBottom: Spacing.xs }, style]}
    >
      {children}
    </HText>
  );
}

function SectionRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.sectionRow}>
      <HText variant="caption" weight="semibold" serif={false} color={Colors.textSecondary}>
        {label}
      </HText>
      {children}
    </View>
  );
}

function TapRow({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.72} style={styles.tapRow}>
      <HText variant="body" serif={false} color={Colors.text}>{label}</HText>
      <View style={styles.tapRowRight}>
        <HText variant="bodySm" serif={false} color={Colors.textTertiary}>{value}</HText>
        <Ionicons name="chevron-forward" size={14} color={Colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );
}

// ─── Selection controls ───────────────────────────────────────────────────────

/** Compact pill chip — for depth, language */
function SelectChip({ label, selected, onPress }: {
  label: string; selected: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[chipStyles.chip, selected ? chipStyles.selected : chipStyles.idle]}
    >
      <HText
        variant="caption"
        weight={selected ? 'semibold' : 'regular'}
        serif={false}
        color={selected ? Colors.primary : Colors.textSecondary}
        center
      >
        {label}
      </HText>
    </TouchableOpacity>
  );
}

/** Taller card with label + description — for tone, intensity */
function SelectionCard({ label, description, selected, onPress }: {
  label: string; description?: string; selected: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[cardStyles.card, selected ? cardStyles.selected : cardStyles.idle]}
    >
      {selected && (
        <View style={cardStyles.checkDot}>
          <View style={cardStyles.checkInner} />
        </View>
      )}
      <HText
        variant="caption"
        weight={selected ? 'semibold' : 'regular'}
        serif={false}
        color={selected ? Colors.primary : Colors.textSecondary}
        center
      >
        {label}
      </HText>
      {description ? (
        <HText
          variant="micro"
          serif={false}
          color={selected ? Colors.primary : Colors.textTertiary}
          style={{ marginTop: 4, lineHeight: 15, opacity: selected ? 0.7 : 1 }}
          center
        >
          {description}
        </HText>
      ) : null}
    </TouchableOpacity>
  );
}

/** Radio list row — for daily rhythm */
function RhythmRow({ label, hint, selected, onPress, isLast }: {
  label: string; hint: string; selected: boolean; onPress: () => void; isLast?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.72}
      style={[rhythmStyles.row, isLast && rhythmStyles.rowLast]}
    >
      <View style={[rhythmStyles.radio, selected && rhythmStyles.radioSelected]}>
        {selected && <View style={rhythmStyles.radioInner} />}
      </View>
      <View style={rhythmStyles.text}>
        <HText
          variant="bodySm"
          weight={selected ? 'semibold' : 'regular'}
          serif={false}
          color={selected ? Colors.primary : Colors.text}
        >
          {label}
        </HText>
        <HText variant="micro" serif={false} color={Colors.textTertiary} style={{ marginTop: 2 }}>
          {hint}
        </HText>
      </View>
    </TouchableOpacity>
  );
}

// ─── Bottom Sheet ─────────────────────────────────────────────────────────────

function BottomSheet({ visible, onClose, onDone, children }: {
  visible: boolean; onClose: () => void; onDone: () => void; children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={sheetStyles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <View style={[sheetStyles.sheet, { paddingBottom: insets.bottom + Spacing.md }]}>
          <View style={sheetStyles.handle} />
          <View style={sheetStyles.topRow}>
            <TouchableOpacity onPress={onClose} style={sheetStyles.topBtn} activeOpacity={0.7}>
              <HText variant="bodySm" serif={false} color={Colors.textTertiary}>{t('common.cancel')}</HText>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDone} style={sheetStyles.topBtn} activeOpacity={0.7}>
              <HText variant="bodySm" weight="semibold" serif={false} color={Colors.primary}>{t('common.done')}</HText>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={sheetStyles.sheetScroll}
            contentContainerStyle={sheetStyles.sheetScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function SheetContent({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sheetStyles.content}>
      <HText variant="title" serif color={Colors.primary} style={sheetStyles.sheetTitle}>
        {title}
      </HText>
      {children}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.lg, gap: Spacing.md },

  appLogo:   { width: 200, height: 60, alignSelf: 'center', marginBottom: Spacing.xs },
  pageTitle: { marginBottom: Spacing.sm, textAlign: 'center' },
  sectionGap: { marginTop: Spacing.sm },

  sectionRow: { gap: Spacing.sm },

  // Categories card
  categoriesCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    minHeight: 26,
  },

  // 3-column layout for tone / intensity
  threeCol: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  // Chip row for depth / language
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  // Radio list for rhythm
  rhythmStack: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
    ...Shadows.sm,
  },

  // Tappable row (days / time)
  tapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  tapRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // Notifications switch
  switchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  switchLeft:  { flex: 1, marginRight: Spacing.md },
  switchHint: { marginTop: 2 },

  // Reset
  resetDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginTop: Spacing.sm,
  },
  resetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
});

const chipStyles = StyleSheet.create({
  // borderWidth lives here — always present, no layout shift on selection
  chip: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    borderWidth: 1.5,
  },
  selected: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  idle: {
    backgroundColor: Colors.surfaceElevated,
    borderColor: Colors.borderLight,
  },
});

const cardStyles = StyleSheet.create({
  // borderWidth lives here — always present, no layout shift on selection
  card: {
    flex: 1,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm + 2,
    minHeight: 72,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  selected: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  idle: {
    backgroundColor: Colors.surfaceElevated,
    borderColor: Colors.borderLight,
  },
  // Subtle filled dot in top-right corner when selected
  checkDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primaryMuted,
  },
});

const rhythmStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  // Last row gets no bottom border — avoids orphaned hairline at card edge
  rowLast: {
    borderBottomWidth: 0,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: Colors.primary },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  text: { flex: 1 },
});

const sheetStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radii['2xl'],
    borderTopRightRadius: Radii['2xl'],
    maxHeight: '88%',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  topBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  sheetScroll: { flexGrow: 0 },
  sheetScrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  content: { gap: Spacing.lg },
  sheetTitle: { marginBottom: Spacing.sm },
});
