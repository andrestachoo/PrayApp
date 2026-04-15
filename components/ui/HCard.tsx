import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radii, Shadows, Spacing } from '@/constants/theme';

interface HCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function HCard({ children, style, elevated = false, padding = 'md' }: HCardProps) {
  return (
    <View
      style={[
        styles.card,
        elevated ? styles.elevated : styles.flat,
        paddingStyles[padding],
        style,
      ]}
    >
      {children}
    </View>
  );
}

const paddingStyles: Record<string, ViewStyle> = {
  none: {},
  sm: { padding: Spacing.sm },
  md: { padding: Spacing.md },
  lg: { padding: Spacing.lg },
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceElevated,
  },
  flat: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  elevated: {
    ...Shadows.md,
  },
});
