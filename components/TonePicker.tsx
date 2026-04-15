import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Radii, Shadows } from '@/constants/theme';
import { HText } from './ui/HText';
import { t } from '@/i18n';
import type { Tone } from '@/types';

const TONES: Tone[] = ['contemplative', 'direct', 'warm'];

interface TonePickerProps {
  selected: Tone;
  onChange: (tone: Tone) => void;
}

export function TonePicker({ selected, onChange }: TonePickerProps) {
  return (
    <View style={styles.container}>
      {TONES.map((tone) => {
        const active = selected === tone;
        return (
          <TouchableOpacity
            key={tone}
            onPress={() => onChange(tone)}
            activeOpacity={0.75}
            style={[styles.card, active ? styles.cardActive : styles.cardInactive]}
          >
            <HText
              variant="body"
              weight={active ? 'semibold' : 'regular'}
              serif={false}
              color={active ? Colors.primary : Colors.text}
            >
              {t(`onboarding.tone_${tone}`)}
            </HText>
            <HText
              variant="caption"
              serif={false}
              color={active ? Colors.primaryLight : Colors.textTertiary}
              style={styles.desc}
            >
              {t(`onboarding.tone_${tone}_desc`)}
            </HText>
            {active && (
              <View style={styles.dot} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  card: {
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    position: 'relative',
  },
  cardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryMuted,
  },
  cardInactive: {
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceElevated,
  },
  desc: {
    marginTop: 2,
  },
  dot: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});
