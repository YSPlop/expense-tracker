import * as Haptics from 'expo-haptics';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import type { ChartType } from '@/types/analytics';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

const CHART_OPTIONS: { value: ChartType; label: string; icon: string }[] = [
  { value: 'donut', label: 'Donut', icon: 'chart.donut' },
  { value: 'pie', label: 'Pie', icon: 'chart.pie.fill' },
  { value: 'bar', label: 'Bar', icon: 'chart.bar.fill' },
  { value: 'line', label: 'Line', icon: 'chart.line.uptrend.xyaxis' },
  { value: 'categories', label: 'Cards', icon: 'square.grid.2x2.fill' },
];

type ChartTypeSwitcherProps = {
  value: ChartType;
  onChange: (value: ChartType) => void;
};

export function ChartTypeSwitcher({ value, onChange }: ChartTypeSwitcherProps) {
  const { colors } = useAppTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      {CHART_OPTIONS.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            style={[
              styles.chip,
              {
                backgroundColor: selected ? colors.glassFillStrong : colors.glassFill,
                borderColor: selected ? colors.tint : colors.glassBorder,
              },
            ]}
            onPress={() => {
              Haptics.selectionAsync();
              onChange(option.value);
            }}>
            <IconSymbol
              name={option.icon as 'chart.pie.fill'}
              size={16}
              color={selected ? colors.tint : colors.textSecondary}
            />
            <Text
              style={[
                styles.label,
                { color: selected ? colors.tint : colors.textSecondary },
              ]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    ...Typography.caption,
    fontWeight: '500',
  },
});
