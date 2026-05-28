import { StyleSheet, Text, View } from 'react-native';

import { GlassCard, GlassChartContainer } from '@/components/glass';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { AnimatedAmount } from '@/components/ui/AnimatedAmount';
import { BarChartView } from '@/components/charts/BarChartView';
import { CategoryBreakdownCards } from '@/components/charts/CategoryBreakdownCards';
import { ChartTypeSwitcher } from '@/components/charts/ChartTypeSwitcher';
import { DonutPieChart } from '@/components/charts/DonutPieChart';
import { LineChartView } from '@/components/charts/LineChartView';
import { useAnalytics } from '@/hooks/use-analytics';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppStore } from '@/store/use-app-store';
import type { ChartType, TimeRange } from '@/types/analytics';
import { Spacing, Typography } from '@/constants/theme';

const TIME_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: 'weekly', label: 'Week' },
  { value: 'monthly', label: 'Month' },
  { value: 'yearly', label: 'Year' },
];

export function AnalyticsSection() {
  const { colors } = useAppTheme();
  const analytics = useAnalytics();
  const chartType = useAppStore((s) => s.chartType);
  const timeRange = useAppStore((s) => s.timeRange);
  const setChartType = useAppStore((s) => s.setChartType);
  const setTimeRange = useAppStore((s) => s.setTimeRange);

  const chartKey = `${chartType}-${timeRange}`;

  const renderChart = () => {
    switch (chartType) {
      case 'donut':
        return <DonutPieChart data={analytics.categoryTotals} variant="donut" />;
      case 'pie':
        return <DonutPieChart data={analytics.categoryTotals} variant="pie" />;
      case 'bar':
        return <BarChartView buckets={analytics.timeBuckets} />;
      case 'line':
        return <LineChartView buckets={analytics.timeBuckets} />;
      case 'categories':
        return <CategoryBreakdownCards data={analytics.categoryTotals} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.section}>
      <GlassCard>
        <SegmentedControl options={TIME_OPTIONS} value={timeRange} onChange={setTimeRange} />

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Spent</Text>
            <AnimatedAmount
              cents={analytics.totalExpense}
              color={colors.expense}
              style={styles.summaryValue}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.separator }]} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Earned</Text>
            <AnimatedAmount
              cents={analytics.totalIncome}
              color={colors.income}
              style={styles.summaryValue}
            />
          </View>
        </View>

        <ChartTypeSwitcher value={chartType} onChange={setChartType} />

        <View key={chartKey}>
          <GlassChartContainer minHeight={chartType === 'categories' ? 120 : 200}>
            {renderChart()}
          </GlassChartContainer>
        </View>

        {chartType !== 'categories' && (
          <CategoryBreakdownCards data={analytics.categoryTotals} />
        )}
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  summaryLabel: {
    ...Typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 18,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    marginVertical: 4,
  },
});
