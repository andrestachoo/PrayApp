import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, Radii } from '@/constants/theme';
import { HText } from './ui/HText';
import { t } from '@/i18n';
import type { Category } from '@/types';

const ALL_CATEGORIES: Category[] = [
  'gratitude',
  'petition',
  'silence',
  'offering',
  'examen',
  'trust',
  'intercession',
  'presence',
];

interface CategoryPickerProps {
  selected: Category[];
  onChange: (categories: Category[]) => void;
}

export function CategoryPicker({ selected, onChange }: CategoryPickerProps) {
  function toggle(cat: Category) {
    if (selected.includes(cat)) {
      // Don't allow deselecting the last one
      if (selected.length === 1) return;
      onChange(selected.filter((c) => c !== cat));
    } else {
      onChange([...selected, cat]);
    }
  }

  return (
    <View style={styles.container}>
      {ALL_CATEGORIES.map((cat) => {
        const active = selected.includes(cat);
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => toggle(cat)}
            activeOpacity={0.7}
            style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
          >
            <HText
              variant="bodySm"
              weight={active ? 'semibold' : 'regular'}
              serif={false}
              color={active ? Colors.surfaceElevated : Colors.textSecondary}
            >
              {t(`categories.${cat}`)}
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
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.full,
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipInactive: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
