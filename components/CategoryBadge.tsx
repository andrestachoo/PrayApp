import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HText } from './ui/HText';
import { Colors, Spacing, Radii } from '@/constants/theme';
import { t } from '@/i18n';
import type { Category } from '@/types';

const CATEGORY_COLORS: Record<Category, { bg: string; text: string }> = {
  gratitude:     { bg: '#F0EDD6', text: '#6B5B1A' },
  petition:      { bg: '#DDE8F5', text: '#1A3A6B' },
  silence:       { bg: '#E8E8E8', text: '#3A3A3A' },
  offering:      { bg: '#F5E8DD', text: '#6B3A1A' },
  examen:        { bg: '#E8EEE8', text: '#1A4A1A' },
  trust:         { bg: '#EDE8F5', text: '#3A1A6B' },
  intercession:  { bg: '#F5DDDD', text: '#6B1A1A' },
  presence:      { bg: '#D4E4DF', text: '#2C4A3E' },
  scripture:     { bg: '#E8EAF5', text: '#1A2B6B' },
  struggle:      { bg: '#F5E8EC', text: '#6B1A2E' },
};

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md';
  /** When true, renders a translucent white badge for use on dark backgrounds. */
  inverted?: boolean;
}

export function CategoryBadge({ category, size = 'md', inverted = false }: CategoryBadgeProps) {
  const colors = CATEGORY_COLORS[category];
  const bg    = inverted ? 'rgba(255,255,255,0.15)' : colors.bg;
  const text  = inverted ? 'rgba(250,247,242,0.85)' : colors.text;
  return (
    <View style={[styles.badge, { backgroundColor: bg }, size === 'sm' && styles.badgeSm]}>
      <HText
        variant={size === 'sm' ? 'micro' : 'caption'}
        weight="semibold"
        serif={false}
        color={text}
      >
        {t(`categories.${category}`)}
      </HText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm + 2,
    borderRadius: Radii.full,
  },
  badgeSm: {
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
  },
});
