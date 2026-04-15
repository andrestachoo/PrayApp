import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface DividerProps {
  spacing?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export function Divider({ spacing = 'md', style }: DividerProps) {
  const margin = { sm: Spacing.sm, md: Spacing.md, lg: Spacing.lg }[spacing];
  return (
    <View
      style={[styles.line, { marginVertical: margin }, style]}
    />
  );
}

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
  },
});
