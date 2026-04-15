import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HCard } from './ui/HCard';
import { HText } from './ui/HText';
import { Colors, Spacing } from '@/constants/theme';
import { t, tp } from '@/i18n';
import type { Stats } from '@/types';

interface StatsCardProps {
  stats: Stats;
}

export function StatsCard({ stats }: StatsCardProps) {
  return (
    <HCard style={styles.card} padding="lg">
      <HText variant="caption" weight="semibold" serif={false} color={Colors.textTertiary} style={styles.sectionLabel}>
        {t('stats.title').toUpperCase()}
      </HText>

      <View style={styles.row}>
        <Stat
          value={stats.currentStreak}
          label={t('stats.streak')}
          unit={stats.currentStreak === 1 ? t('stats.day') : t('stats.days')}
          accent
        />
        <View style={styles.separator} />
        <Stat
          value={stats.totalPrayed}
          label={t('stats.total_prayed')}
        />
        <View style={styles.separator} />
        <Stat
          value={stats.longestStreak}
          label={t('stats.longest_streak')}
          unit={stats.longestStreak === 1 ? t('stats.day') : t('stats.days')}
        />
      </View>
    </HCard>
  );
}

interface StatProps {
  value: number;
  label: string;
  unit?: string;
  accent?: boolean;
}

function Stat({ value, label, unit, accent }: StatProps) {
  return (
    <View style={styles.stat}>
      <View style={styles.valueRow}>
        <HText
          variant="heading"
          weight="bold"
          serif
          color={accent ? Colors.primary : Colors.text}
        >
          {String(value)}
        </HText>
        {unit && (
          <HText variant="caption" serif={false} color={Colors.textTertiary}>
            {unit}
          </HText>
        )}
      </View>
      <HText variant="micro" serif={false} color={Colors.textTertiary} center>
        {label}
      </HText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
  sectionLabel: {
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  separator: {
    width: 1,
    height: 40,
    backgroundColor: Colors.borderLight,
  },
});
