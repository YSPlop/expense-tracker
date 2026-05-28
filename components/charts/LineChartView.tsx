import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import type { TimeBucket } from '@/types/analytics';
import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

const CHART_HEIGHT = 140;
const CHART_WIDTH = 300;

type LineChartViewProps = {
  buckets: TimeBucket[];
};

function buildPath(
  buckets: TimeBucket[],
  key: 'expense' | 'income',
  maxValue: number,
  width: number,
  height: number
): string {
  const points = buckets.map((b, i) => {
    const x = (i / Math.max(buckets.length - 1, 1)) * (width - 20) + 10;
    const value = b[key];
    const y = height - 24 - (value / maxValue) * (height - 40);
    return { x, y };
  });

  if (points.length === 0) return '';

  return points.reduce((path, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = points[i - 1];
    const cx = (prev.x + point.x) / 2;
    return `${path} C ${cx} ${prev.y}, ${cx} ${point.y}, ${point.x} ${point.y}`;
  }, '');
}

export function LineChartView({ buckets }: LineChartViewProps) {
  const { colors } = useAppTheme();
  const displayBuckets = buckets.slice(-7);
  const maxValue = Math.max(
    ...displayBuckets.map((b) => Math.max(b.expense, b.income)),
    1
  );

  const expensePath = buildPath(displayBuckets, 'expense', maxValue, CHART_WIDTH, CHART_HEIGHT);
  const incomePath = buildPath(displayBuckets, 'income', maxValue, CHART_WIDTH, CHART_HEIGHT);

  return (
    <View style={styles.container}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {expensePath ? (
          <Path d={expensePath} stroke={colors.expense} strokeWidth={2.5} fill="none" />
        ) : null}
        {incomePath ? (
          <Path d={incomePath} stroke={colors.income} strokeWidth={2.5} fill="none" />
        ) : null}
        {displayBuckets.map((b, i) => {
          const x = (i / Math.max(displayBuckets.length - 1, 1)) * (CHART_WIDTH - 20) + 10;
          const y = CHART_HEIGHT - 24 - (b.expense / maxValue) * (CHART_HEIGHT - 40);
          return <Circle key={i} cx={x} cy={y} r={3} fill={colors.expense} />;
        })}
      </Svg>
      <View style={styles.labels}>
        {displayBuckets.map((b, i) => (
          <Text key={i} style={[styles.label, { color: colors.textSecondary, flex: 1 }]}>
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
  },
  label: {
    ...Typography.caption,
    fontSize: 11,
    textAlign: 'center',
  },
});
