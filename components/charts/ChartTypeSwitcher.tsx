import * as Haptics from 'expo-haptics';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';

import { IconSymbol } from '@/components/ui/icon-symbol';
import type { ChartType } from '@/types/analytics';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useSpringPress } from '@/hooks/motion/use-spring-press';
import type { AppIconName } from '@/types/icons';

const CHART_OPTIONS: { value: ChartType; label: string; icon: AppIconName }[] = [
  { value: 'donut', label: 'Donut', icon: 'chart.donut' },
  { value: 'pie', label: 'Pie', icon: 'chart.pie.fill' },
  { value: 'bar', label: 'Bar', icon: 'chart.bar.fill' },
  { value: 'line', label: 'Line', icon: 'chart.line.uptrend.xyaxis' },
  { value: 'categories', label: 'Cards', icon: 'square.grid.2x2.fill' },
];

type ChartChipProps = {
  option: (typeof CHART_OPTIONS)[number];
  selected: boolean;
  onChange: (value: ChartType) => void;
};

function ChartChip({ option, selected, onChange }: ChartChipProps) {
  const { colors } = useAppTheme();
  const { animatedStyle, onPressIn, onPressOut, handlePress } = useSpringPress({
    haptic: false,
    onPress: () => {
      Haptics.selectionAsync();
      onChange(option.value);
    },
  });

  return (
    <Pressable onPress={handlePress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View
        style={[
          styles.chip,
          animatedStyle,
          {
            backgroundColor: selected ? colors.glassFillStrong : colors.glassFill,
            borderColor: selected ? colors.tint : colors.glassBorder,
          },
        ]}>
        <IconSymbol
          name={option.icon}
          size={18}
          color={selected ? colors.tint : colors.textSecondary}
        />
        <Text
          style={[
            styles.chipLabel,
            { color: selected ? colors.tint : colors.textSecondary },
          ]}>
          {option.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

type ChartTypeSwitcherProps = {
  value: ChartType;
  onChange: (value: ChartType) => void;
};

export function ChartTypeSwitcher({ value, onChange }: ChartTypeSwitcherProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {CHART_OPTIONS.map((option) => (
        <ChartChip
          key={option.value}
          option={option}
          selected={value === option.value}
          onChange={onChange}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipLabel: {
    ...Typography.caption,
    fontWeight: '600',
  },
});
