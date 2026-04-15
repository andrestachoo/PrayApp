/**
 * HText — Habita's typed text component.
 * Enforces consistent typography while keeping usage simple.
 */
import React from 'react';
import { Text, TextStyle, StyleSheet, TextProps, Platform } from 'react-native';
import { Colors, Typography } from '@/constants/theme';

type Variant =
  | 'display'   // 38px serif — big headings
  | 'heading'   // 30px serif — section headings
  | 'title'     // 24px serif — card titles
  | 'subtitle'  // 20px sans  — subtitles
  | 'body'      // 17px sans  — main body
  | 'bodySm'   // 15px sans  — secondary body
  | 'caption'  // 13px sans  — captions, labels
  | 'micro';   // 11px sans  — very small labels

type Weight = 'regular' | 'medium' | 'semibold' | 'bold';

interface HTextProps extends TextProps {
  variant?: Variant;
  color?: string;
  weight?: Weight;
  italic?: boolean;
  center?: boolean;
  serif?: boolean;
}

const variantStyles: Record<Variant, TextStyle> = {
  display: { fontSize: Typography.sizes['3xl'], lineHeight: Typography.sizes['3xl'] * Typography.lineHeights.tight },
  heading: { fontSize: Typography.sizes['2xl'], lineHeight: Typography.sizes['2xl'] * Typography.lineHeights.tight },
  title: { fontSize: Typography.sizes.xl, lineHeight: Typography.sizes.xl * Typography.lineHeights.normal },
  subtitle: { fontSize: Typography.sizes.lg, lineHeight: Typography.sizes.lg * Typography.lineHeights.normal },
  body: { fontSize: Typography.sizes.md, lineHeight: Typography.sizes.md * Typography.lineHeights.relaxed },
  bodySm: { fontSize: Typography.sizes.base, lineHeight: Typography.sizes.base * Typography.lineHeights.relaxed },
  caption: { fontSize: Typography.sizes.sm, lineHeight: Typography.sizes.sm * Typography.lineHeights.normal },
  micro: { fontSize: Typography.sizes.xs, lineHeight: Typography.sizes.xs * Typography.lineHeights.normal },
};

// Use serif for display/heading/title by default
const serifVariants: Set<Variant> = new Set(['display', 'heading', 'title']);

export function HText({
  variant = 'body',
  color = Colors.text,
  weight = 'regular',
  italic = false,
  center = false,
  serif,
  style,
  children,
  ...rest
}: HTextProps) {
  const useSerif = serif !== undefined ? serif : serifVariants.has(variant);
  const fontFamily = useSerif
    ? Typography.fontFamily.serif
    : Typography.fontFamily.sansSerif;

  const fontWeightMap: Record<Weight, TextStyle['fontWeight']> = {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  };

  const composed: TextStyle = {
    // Only set fontFamily when it has a value — on iOS sansSerif is undefined
    // so that React Native uses San Francisco with correct metrics.
    ...(fontFamily !== undefined && { fontFamily }),
    // Android's default font includes internal padding that shifts text upward;
    // setting includeFontPadding: false gives true vertical centering.
    ...(Platform.OS === 'android' && { includeFontPadding: false }),
    color,
    fontWeight: fontWeightMap[weight],
    fontStyle: italic ? 'italic' : 'normal',
    textAlign: center ? 'center' : undefined,
    ...variantStyles[variant],
  };

  return (
    <Text style={[composed, style]} {...rest}>
      {children}
    </Text>
  );
}
