import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FloatingActionButton } from '@/components/glass/FloatingActionButton';
import { GlassTabBar, GLASS_TAB_BAR_HEIGHT } from '@/components/glass/GlassTabBar';
import { ExpenseActionBubble } from '@/components/navigation/ExpenseActionBubble';
import { DOCK_BOTTOM_MARGIN, DOCK_EXTRA_BOTTOM } from '@/constants/layout';
import { Durations } from '@/constants/motion';
import { Spacing } from '@/constants/theme';
import { useTransactionSheet } from '@/context/TransactionSheetContext';
import { useAppTheme } from '@/hooks/use-app-theme';

export const LIQUID_DOCK_BAR_HEIGHT = GLASS_TAB_BAR_HEIGHT;
export const LIQUID_DOCK_BOTTOM_MARGIN = DOCK_BOTTOM_MARGIN;
export const LIQUID_DOCK_EXTRA_BOTTOM = DOCK_EXTRA_BOTTOM;

export function LiquidDock(props: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { openForAdd, openRemovePicker } = useTransactionSheet();
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const scrimOpacity = useSharedValue(0);

  useEffect(() => {
    scrimOpacity.value = withTiming(bubbleOpen ? 1 : 0, { duration: Durations.normal });
  }, [bubbleOpen, scrimOpacity]);

  const scrimAnimatedStyle = useAnimatedStyle(() => ({
    opacity: scrimOpacity.value,
  }));

  const toggleBubble = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setBubbleOpen((open) => !open);
  };

  const closeBubble = () => {
    setBubbleOpen(false);
  };

  const dockBottom = insets.bottom + LIQUID_DOCK_BOTTOM_MARGIN;

  return (
    <>
      <Animated.View
        pointerEvents={bubbleOpen ? 'auto' : 'none'}
        style={[styles.scrim, { backgroundColor: colors.scrim }, scrimAnimatedStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={closeBubble} />
      </Animated.View>

      <View style={[styles.dockContainer, { bottom: dockBottom }]} pointerEvents="box-none">
        <View style={styles.menuLayer} pointerEvents="box-none">
          <ExpenseActionBubble
            visible={bubbleOpen}
            onAddIncome={() => {
              closeBubble();
              openForAdd('income');
            }}
            onRemoveIncome={() => {
              closeBubble();
              openRemovePicker('income');
            }}
            onAddExpense={() => {
              closeBubble();
              openForAdd('expense');
            }}
            onRemoveExpense={() => {
              closeBubble();
              openRemovePicker('expense');
            }}
          />
        </View>

        <GlassTabBar {...props} onTabPress={closeBubble} />

        <View style={styles.fabColumn}>
          <FloatingActionButton onPress={toggleBubble} open={bubbleOpen} size={LIQUID_DOCK_BAR_HEIGHT} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrim: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
  },
  dockContainer: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    zIndex: 100,
  },
  menuLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '100%',
    marginBottom: Spacing.md,
  },
  fabColumn: {
    position: 'relative',
    alignItems: 'center',
  },
});
