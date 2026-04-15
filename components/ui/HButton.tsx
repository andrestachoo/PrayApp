import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { Colors, Radii, Typography, Spacing } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface HButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function HButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: HButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Colors.surfaceElevated : Colors.primary}
        />
      ) : (
        <Text style={[labelStyles[size], { color: variantTextColors[variant] }]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// Plain Text instead of HText so we can set lineHeight === fontSize,
// which is the only reliable way to get pixel-perfect vertical centering
// across iOS and Android without relying on includeFontPadding tricks.
const labelStyles: Record<Size, TextStyle> = {
  sm: {
    ...Typography.button.sm,
    fontWeight: '600',
    ...(Platform.OS === 'android' && { includeFontPadding: false }),
  },
  md: {
    ...Typography.button.md,
    fontWeight: '600',
    ...(Platform.OS === 'android' && { includeFontPadding: false }),
  },
  lg: {
    ...Typography.button.lg,
    fontWeight: '600',
    ...(Platform.OS === 'android' && { includeFontPadding: false }),
  },
};

const variantStyles: Record<Variant, ViewStyle> = {
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.primaryMuted,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.error,
  },
};

const variantTextColors: Record<Variant, string> = {
  primary: Colors.surfaceElevated,
  secondary: Colors.primary,
  ghost: Colors.textSecondary,
  danger: Colors.error,
};

const sizeStyles: Record<Size, ViewStyle> = {
  sm: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md, borderRadius: Radii.md },
  md: { paddingVertical: Spacing.sm + 4, paddingHorizontal: Spacing.lg, borderRadius: Radii.lg },
  lg: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: Radii.xl },
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.45,
  },
});
