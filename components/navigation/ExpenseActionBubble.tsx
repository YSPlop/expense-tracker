import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { GlassSurface } from '@/components/glass/GlassSurface';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Durations, Springs } from '@/constants/motion';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { AppIconName } from '@/types/icons';

type DockActionMenuProps = {
  visible: boolean;
  onAddIncome: () => void;
  onRemoveIncome: () => void;
  onAddExpense: () => void;
  onRemoveExpense: () => void;
};

type GridActionProps = {
  label: string;
  icon: AppIconName;
  tint: string;
  tintGlass: string;
  onPress: () => void;
};

function GridAction({ label, icon, tint, tintGlass, onPress }: GridActionProps) {
  const { colors } = useAppTheme();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.gridCell, pressed && styles.gridCellPressed]}
      onPress={handlePress}
      hitSlop={6}>
      <View style={[styles.iconCircle, { backgroundColor: tintGlass }]}>
        <IconSymbol name={icon} size={26} color={tint} />
      </View>
      <Text style={[styles.gridLabel, { color: colors.text }]} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Glass grid menu above the dock row (tab bar + FAB width). */
export function ExpenseActionBubble({
  visible,
  onAddIncome,
  onRemoveIncome,
  onAddExpense,
  onRemoveExpense,
}: DockActionMenuProps) {
  const { colors } = useAppTheme();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.94);
  const translateY = useSharedValue(8);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: Durations.normal });
      scale.value = withSpring(1, Springs.modal);
      translateY.value = withSpring(0, Springs.dock);
    } else {
      opacity.value = withTiming(0, { duration: Durations.fast });
      scale.value = withTiming(0.94, { duration: Durations.fast });
      translateY.value = withTiming(8, { duration: Durations.fast });
    }
  }, [visible, opacity, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[styles.wrapper, animatedStyle]}
      accessibilityElementsHidden={!visible}
      importantForAccessibility={visible ? 'auto' : 'no-hide-descendants'}>
      <GlassSurface variant="modal" borderRadius={Radius.xxl} elevated style={styles.bubble}>
        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <GridAction
              label="Add Income"
              icon="plus.circle.fill"
              tint={colors.income}
              tintGlass={colors.incomeGlass}
              onPress={onAddIncome}
            />
            <GridAction
              label="Remove Income"
              icon="minus.circle.fill"
              tint={colors.income}
              tintGlass={colors.incomeGlass}
              onPress={onRemoveIncome}
            />
          </View>
          <View style={styles.gridRow}>
            <GridAction
              label="Add Expense"
              icon="dollarsign.circle.fill"
              tint={colors.expense}
              tintGlass={colors.expenseGlass}
              onPress={onAddExpense}
            />
            <GridAction
              label="Remove Expense"
              icon="minus.circle.fill"
              tint={colors.expense}
              tintGlass={colors.expenseGlass}
              onPress={onRemoveExpense}
            />
          </View>
        </View>
      </GlassSurface>
    </Animated.View>
  );
}

const ICON_CIRCLE = 52;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  bubble: {
    width: '100%',
    overflow: 'hidden',
  },
  grid: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    gap: Spacing.lg,
  },
  gridRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  gridCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 88,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  gridCellPressed: {
    opacity: 0.7,
  },
  iconCircle: {
    width: ICON_CIRCLE,
    height: ICON_CIRCLE,
    borderRadius: ICON_CIRCLE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridLabel: {
    ...Typography.caption,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 15,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
});
