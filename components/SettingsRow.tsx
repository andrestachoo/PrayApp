import React from 'react';
import { View, TouchableOpacity, Switch, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Radii } from '@/constants/theme';
import { HText } from './ui/HText';

interface SettingsRowProps {
  label: string;
  description?: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
  style?: ViewStyle;
  destructive?: boolean;
}

export function SettingsRow({
  label,
  description,
  value,
  onPress,
  rightElement,
  showChevron = false,
  style,
  destructive = false,
}: SettingsRowProps) {
  const Inner = (
    <View style={[styles.row, style]}>
      <View style={styles.left}>
        <HText
          variant="body"
          serif={false}
          color={destructive ? Colors.error : Colors.text}
        >
          {label}
        </HText>
        {description && (
          <HText variant="caption" serif={false} color={Colors.textTertiary} style={styles.desc}>
            {description}
          </HText>
        )}
      </View>
      <View style={styles.right}>
        {rightElement ?? null}
        {value && (
          <HText variant="bodySm" serif={false} color={Colors.textTertiary}>
            {value}
          </HText>
        )}
        {showChevron && (
          <HText variant="body" serif={false} color={Colors.textTertiary}>
            ›
          </HText>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.65}>
        {Inner}
      </TouchableOpacity>
    );
  }

  return Inner;
}

interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  const childArray = React.Children.toArray(children);
  return (
    <View style={styles.section}>
      {title && (
        <HText
          variant="micro"
          weight="semibold"
          serif={false}
          color={Colors.textTertiary}
          style={styles.sectionTitle}
        >
          {title.toUpperCase()}
        </HText>
      )}
      <View style={styles.sectionBody}>
        {childArray.map((child, i) =>
          i === childArray.length - 1
            ? React.cloneElement(child as React.ReactElement, {
                style: styles.lastRow,
              })
            : child
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  sectionBody: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  left: {
    flex: 1,
    marginRight: Spacing.md,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  desc: {
    marginTop: 2,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
});
