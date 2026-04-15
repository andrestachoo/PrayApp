import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Radii } from '@/constants/theme';
import { HText } from './ui/HText';
import { t } from '@/i18n';
import type { ActiveDays, DayOfWeek } from '@/types';

const PRESET_OPTIONS: { value: ActiveDays; labelKey: string }[] = [
  { value: 'all', labelKey: 'onboarding.days_all' },
  { value: 'weekdays', labelKey: 'onboarding.days_weekdays' },
  { value: 'weekends', labelKey: 'onboarding.days_weekends' },
  { value: 'custom', labelKey: 'onboarding.days_custom' },
];

const DAY_KEYS: { day: DayOfWeek; key: string }[] = [
  { day: 0, key: 'onboarding.day_sun' },
  { day: 1, key: 'onboarding.day_mon' },
  { day: 2, key: 'onboarding.day_tue' },
  { day: 3, key: 'onboarding.day_wed' },
  { day: 4, key: 'onboarding.day_thu' },
  { day: 5, key: 'onboarding.day_fri' },
  { day: 6, key: 'onboarding.day_sat' },
];

interface DayPickerProps {
  activeDays: ActiveDays;
  customDays: DayOfWeek[];
  onActiveDaysChange: (days: ActiveDays) => void;
  onCustomDaysChange: (days: DayOfWeek[]) => void;
}

export function DayPicker({
  activeDays,
  customDays,
  onActiveDaysChange,
  onCustomDaysChange,
}: DayPickerProps) {
  function toggleCustomDay(day: DayOfWeek) {
    if (customDays.includes(day)) {
      if (customDays.length === 1) return; // Require at least one day
      onCustomDaysChange(customDays.filter((d) => d !== day));
    } else {
      onCustomDaysChange([...customDays, day].sort() as DayOfWeek[]);
    }
  }

  return (
    <View style={styles.container}>
      {/* Preset options */}
      <View style={styles.presets}>
        {PRESET_OPTIONS.map((opt) => {
          const active = activeDays === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => onActiveDaysChange(opt.value)}
              activeOpacity={0.7}
              style={[styles.preset, active ? styles.presetActive : styles.presetInactive]}
            >
              <HText
                variant="bodySm"
                weight={active ? 'semibold' : 'regular'}
                serif={false}
                color={active ? Colors.surfaceElevated : Colors.textSecondary}
              >
                {t(opt.labelKey)}
              </HText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Custom day selector */}
      {activeDays === 'custom' && (
        <View style={styles.customDays}>
          {DAY_KEYS.map(({ day, key }) => {
            const active = customDays.includes(day);
            return (
              <TouchableOpacity
                key={day}
                onPress={() => toggleCustomDay(day)}
                activeOpacity={0.7}
                style={[styles.dayCircle, active ? styles.dayCircleActive : styles.dayCircleInactive]}
              >
                <HText
                  variant="caption"
                  weight={active ? 'semibold' : 'regular'}
                  serif={false}
                  color={active ? Colors.surfaceElevated : Colors.textSecondary}
                >
                  {t(key)}
                </HText>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  preset: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.full,
  },
  presetActive: {
    backgroundColor: Colors.primary,
  },
  presetInactive: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  customDays: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleActive: {
    backgroundColor: Colors.primary,
  },
  dayCircleInactive: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
