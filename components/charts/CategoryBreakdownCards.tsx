import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/glass';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { CategoryTotal } from '@/types/analytics';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatMoney } from '@/utils/money';
import type { AppIconName } from '@/types/icons';

type CategoryBreakdownCardsProps = {
  data: CategoryTotal[];
};

function ProgressBar({ percentage, color }: { percentage: number; color: string }) {
  return (
    <View style={[styles.barTrack, { backgroundColor: `${color}22` }]}>
      <View style={[styles.barFill, { backgroundColor: color, width: `${Math.min(percentage, 100)}%` }]} />
    </View>
  );
}

export function CategoryBreakdownCards({ data }: CategoryBreakdownCardsProps) {
  const { colors } = useAppTheme();

  if (data.length === 0) {
    return (
      <Text style={[styles.empty, { color: colors.textSecondary }]}>No expense data for this period</Text>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      {data.map((item) => (
        <GlassCard key={item.categoryId} style={styles.card} padding={Spacing.md}>
          <View style={[styles.iconWrap, { backgroundColor: `${item.color}22` }]}>
            <IconSymbol name={item.icon as AppIconName} size={20} color={item.color} />
          </View>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.amount, { color: colors.text }]}>{formatMoney(item.amount)}</Text>
          <Text style={[styles.pct, { color: colors.textSecondary }]}>
            {item.percentage.toFixed(0)}%
          </Text>
          <ProgressBar percentage={item.percentage} color={item.color} />
        </GlassCard>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
    marginTop: Spacing.md,
  },
  card: {
    width: 128,
    minWidth: 128,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.caption,
    fontWeight: '600',
    marginBottom: 2,
  },
  amount: {
    ...Typography.amount,
    fontSize: 15,
  },
  pct: {
    ...Typography.caption,
    fontSize: 12,
    marginTop: 2,
    marginBottom: Spacing.xs,
  },
  barTrack: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  empty: {
    ...Typography.body,
    textAlign: 'center',
    paddingVertical: Spacing.lg,
  },
});
