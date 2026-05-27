import { StyleSheet, Text, View } from 'react-native';
import Svg, { G, Rect } from 'react-native-svg';

import type { TimeBucket } from '@/types/analytics';
import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

const CHART_HEIGHT = 140;
const CHART_WIDTH = 300;

type BarChartViewProps = {
  buckets: TimeBucket[];
};

export function BarChartView({ buckets }: BarChartViewProps) {
  const { colors } = useAppTheme();
  const displayBuckets = buckets
    .filter((_, i) => {
      if (buckets.length <= 7) return true;
      return i % Math.ceil(buckets.length / 7) === 0;
    })
    .slice(0, 7);

  const maxValue = Math.max(...displayBuckets.map((b) => Math.max(b.expense, b.income)), 1);
  const groupWidth = CHART_WIDTH / displayBuckets.length;
  const barWidth = Math.max(8, groupWidth / 2 - 6);

  return (
    <View style={styles.container}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {displayBuckets.map((bucket, index) => {
          const expenseH = (bucket.expense / maxValue) * (CHART_HEIGHT - 30);
          const incomeH = (bucket.income / maxValue) * (CHART_HEIGHT - 30);
          const x = index * groupWidth + groupWidth / 2 - barWidth - 2;

          return (
            <G key={`${bucket.label}-${index}`}>
              <Rect
                x={x}
                y={CHART_HEIGHT - 24 - expenseH}
                width={barWidth}
                height={Math.max(expenseH, 0)}
                rx={4}
                fill={colors.expense}
                opacity={0.85}
              />
              <Rect
                x={x + barWidth + 4}
                y={CHART_HEIGHT - 24 - incomeH}
                width={barWidth}
                height={Math.max(incomeH, 0)}
                rx={4}
                fill={colors.income}
                opacity={0.85}
              />
            </G>
          );
        })}
      </Svg>
      <View style={styles.labels}>
        {displayBuckets.map((b, i) => (
          <Text key={`${b.label}-${i}`} style={[styles.label, { color: colors.textSecondary, flex: 1 }]}>
            {b.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  labels: {
    flexDirection: 'row',
    width: CHART_WIDTH,
    paddingHorizontal: Spacing.xs,
  },
  label: {
    ...Typography.caption,
    fontSize: 11,
    textAlign: 'center',
  },
});
