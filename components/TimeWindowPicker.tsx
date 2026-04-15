import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radii } from '@/constants/theme';
import { HText } from './ui/HText';
import { t } from '@/i18n';
import type { TimeWindow } from '@/types';
import { formatTime } from '@/lib/date';

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => i);
const MINUTE_OPTIONS = [0, 15, 30, 45];

interface TimeWindowPickerProps {
  value: TimeWindow;
  onChange: (window: TimeWindow) => void;
}

export function TimeWindowPicker({ value, onChange }: TimeWindowPickerProps) {
  return (
    <View style={styles.container}>
      <Row
        label={t('onboarding.time_from')}
        hour={value.startHour}
        minute={value.startMinute}
        onHourChange={(h) => onChange({ ...value, startHour: h })}
        onMinuteChange={(m) => onChange({ ...value, startMinute: m })}
      />
      <Row
        label={t('onboarding.time_to')}
        hour={value.endHour}
        minute={value.endMinute}
        onHourChange={(h) => onChange({ ...value, endHour: h })}
        onMinuteChange={(m) => onChange({ ...value, endMinute: m })}
      />
    </View>
  );
}

interface RowProps {
  label: string;
  hour: number;
  minute: number;
  onHourChange: (h: number) => void;
  onMinuteChange: (m: number) => void;
}

function Row({ label, hour, minute, onHourChange, onMinuteChange }: RowProps) {
  function stepHour(delta: number) {
    onHourChange((hour + delta + 24) % 24);
  }
  function stepMinute(delta: number) {
    const idx = MINUTE_OPTIONS.indexOf(minute);
    const next = (idx + delta + MINUTE_OPTIONS.length) % MINUTE_OPTIONS.length;
    if (delta > 0 && next === 0) onHourChange((hour + 1) % 24);
    if (delta < 0 && idx === 0) onHourChange((hour - 1 + 24) % 24);
    onMinuteChange(MINUTE_OPTIONS[next]);
  }

  return (
    <View style={styles.row}>
      <HText variant="bodySm" serif={false} color={Colors.textSecondary} style={styles.label}>
        {label}
      </HText>
      <View style={styles.timeControl}>
        <Stepper onMinus={() => stepHour(-1)} onPlus={() => stepHour(1)}>
          <HText variant="body" weight="semibold" serif={false}>
            {String(hour).padStart(2, '0')}
          </HText>
        </Stepper>
        <HText variant="body" serif={false} color={Colors.textTertiary} style={styles.colon}>
          :
        </HText>
        <Stepper onMinus={() => stepMinute(-1)} onPlus={() => stepMinute(1)}>
          <HText variant="body" weight="semibold" serif={false}>
            {String(minute).padStart(2, '0')}
          </HText>
        </Stepper>
        <HText variant="caption" serif={false} color={Colors.textTertiary} style={styles.period}>
          {hour < 12 ? 'AM' : 'PM'}
        </HText>
      </View>
    </View>
  );
}

function Stepper({
  children,
  onMinus,
  onPlus,
}: {
  children: React.ReactNode;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <View style={styles.stepper}>
      <TouchableOpacity onPress={onMinus} style={styles.stepBtn} activeOpacity={0.6}>
        <HText variant="body" serif={false} color={Colors.primary}>−</HText>
      </TouchableOpacity>
      {children}
      <TouchableOpacity onPress={onPlus} style={styles.stepBtn} activeOpacity={0.6}>
        <HText variant="body" serif={false} color={Colors.primary}>+</HText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    width: 48,
  },
  timeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  stepBtn: {
    paddingHorizontal: Spacing.xs,
  },
  colon: {
    marginHorizontal: 2,
  },
  period: {
    marginLeft: Spacing.xs,
    width: 24,
  },
});
