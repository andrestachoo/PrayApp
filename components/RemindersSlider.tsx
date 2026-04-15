import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radii } from '@/constants/theme';
import { HText } from './ui/HText';
import { MIN_REMINDERS, MAX_REMINDERS } from '@/constants/defaults';

interface RemindersSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function RemindersSlider({ value, onChange }: RemindersSliderProps) {
  const options = Array.from(
    { length: MAX_REMINDERS - MIN_REMINDERS + 1 },
    (_, i) => i + MIN_REMINDERS,
  );

  return (
    <View style={styles.container}>
      {options.map((n) => {
        const active = n === value;
        return (
          <TouchableOpacity
            key={n}
            onPress={() => onChange(n)}
            activeOpacity={0.7}
            style={[styles.dot, active ? styles.dotActive : styles.dotInactive]}
          >
            <HText
              variant="caption"
              weight={active ? 'bold' : 'regular'}
              serif={false}
              color={active ? Colors.surfaceElevated : Colors.textTertiary}
            >
              {String(n)}
            </HText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  dot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
