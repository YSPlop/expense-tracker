import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, Platform, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Springs } from '@/constants/motion';
import { Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { AppIconName } from '@/types/icons';

import { GlassSurface } from './GlassSurface';

export const GLASS_TAB_BAR_HEIGHT = 56;

const TAB_CONFIG: Record<string, { label: string; icon: AppIconName }> = {
  index: { label: 'Home', icon: 'house.fill' },
  charts: { label: 'Charts', icon: 'chart.bar.fill' },
  settings: { label: 'Settings', icon: 'gearshape.fill' },
  pro: { label: 'Pro', icon: 'star.fill' },
};

type TabLayout = { x: number; width: number };

type GlassTabBarProps = BottomTabBarProps & {
  onTabPress?: () => void;
};

function findNearestTabIndex(x: number, xs: number[], ws: number[]): number {
  'worklet';
  let best = 0;
  let bestDist = Number.MAX_VALUE;
  for (let i = 0; i < xs.length; i++) {
    const center = xs[i] + ws[i] / 2;
    const dist = Math.abs(x - center);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
}

function bubbleAtFingerX(
  x: number,
  xs: number[],
  ws: number[]
): { x: number; width: number } {
  'worklet';
  if (xs.length === 0) return { x: 0, width: 0 };

  const centers = xs.map((xi, i) => xi + ws[i] / 2);
  if (x <= centers[0]) return { x: xs[0], width: ws[0] };
  const last = xs.length - 1;
  if (x >= centers[last]) return { x: xs[last], width: ws[last] };

  for (let i = 0; i < last; i++) {
    if (x >= centers[i] && x <= centers[i + 1]) {
      const span = centers[i + 1] - centers[i];
      const t = span > 0 ? (x - centers[i]) / span : 0;
      return {
        x: xs[i] + t * (xs[i + 1] - xs[i]),
        width: ws[i] + t * (ws[i + 1] - ws[i]),
      };
    }
  }
  return { x: xs[0], width: ws[0] };
}

type TabItemProps = {
  index: number;
  label: string;
  icon: AppIconName;
  highlighted: boolean;
  hoverIndex: SharedValue<number>;
  isDragging: SharedValue<boolean>;
  activeIndex: SharedValue<number>;
  selectedColor: string;
  defaultColor: string;
  onPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
};

function TabItem({
  index,
  label,
  icon,
  highlighted,
  hoverIndex,
  isDragging,
  activeIndex,
  selectedColor,
  defaultColor,
  onPress,
  onLayout,
}: TabItemProps) {
  const isSelected = useDerivedValue(() =>
    isDragging.value ? hoverIndex.value === index : activeIndex.value === index
  );

  const tabAnimatedStyle = useAnimatedStyle(() => ({
    opacity: isSelected.value ? 1 : 0.45,
    transform: [{ scale: isSelected.value ? 1.04 : 1 }],
  }));

  const color = highlighted ? selectedColor : defaultColor;

  return (
    <HapticTab
      accessibilityRole="button"
      accessibilityState={highlighted ? { selected: true } : {}}
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.tabButton}
      onLayout={onLayout}>
      <Animated.View style={[styles.tabInner, tabAnimatedStyle]}>
        <IconSymbol name={icon} size={22} color={color} />
        <Text
          style={[
            styles.tabLabel,
            {
              color,
              fontWeight: highlighted ? '600' : '500',
            },
          ]}>
          {label}
        </Text>
      </Animated.View>
    </HapticTab>
  );
}

export function GlassTabBar({
  state,
  descriptors,
  navigation,
  onTabPress,
}: GlassTabBarProps) {
  const { colors } = useAppTheme();
  const tabLayouts = useRef<TabLayout[]>([]);
  const layoutsReady = useRef(false);
  const lastHapticIndex = useRef(state.index);
  const [scrubIndex, setScrubIndex] = useState<number | null>(null);

  const bubbleX = useSharedValue(0);
  const bubbleWidth = useSharedValue(0);
  const layoutsX = useSharedValue<number[]>([]);
  const layoutsW = useSharedValue<number[]>([]);
  const hoverIndex = useSharedValue(state.index);
  const activeIndex = useSharedValue(state.index);
  const isDragging = useSharedValue(false);

  const syncLayoutsToShared = useCallback(() => {
    layoutsX.value = tabLayouts.current.map((l) => l?.x ?? 0);
    layoutsW.value = tabLayouts.current.map((l) => l?.width ?? 0);
  }, [layoutsX, layoutsW]);

  const moveBubbleToIndex = useCallback(
    (index: number, animated: boolean) => {
      const layout = tabLayouts.current[index];
      if (!layout) return;
      if (animated) {
        bubbleX.value = withSpring(layout.x, Springs.dock);
        bubbleWidth.value = withSpring(layout.width, Springs.dock);
      } else {
        bubbleX.value = layout.x;
        bubbleWidth.value = layout.width;
      }
      hoverIndex.value = index;
    },
    [bubbleX, bubbleWidth, hoverIndex]
  );

  const triggerSelectionHaptic = useCallback((index: number) => {
    setScrubIndex(index);
    if (lastHapticIndex.current === index) return;
    lastHapticIndex.current = index;
    if (process.env.EXPO_OS === 'ios') {
      Haptics.selectionAsync();
    }
  }, []);

  const endScrub = useCallback(() => {
    setScrubIndex(null);
  }, []);

  const navigateToTab = useCallback(
    (index: number) => {
      if (index < 0 || index >= state.routes.length) return;
      const route = state.routes[index];
      if (state.index === index) return;

      onTabPress?.();
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    },
    [navigation, onTabPress, state.index, state.routes]
  );

  useEffect(() => {
    activeIndex.value = state.index;
    lastHapticIndex.current = state.index;
    if (layoutsReady.current) {
      moveBubbleToIndex(state.index, true);
    }
  }, [state.index, activeIndex, moveBubbleToIndex]);

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: bubbleX.value }],
    width: bubbleWidth.value,
  }));

  const handleTabLayout = (index: number) => (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    tabLayouts.current[index] = { x, width };
    const allMeasured = state.routes.every((_, i) => tabLayouts.current[i] != null);
    if (!allMeasured) return;

    layoutsReady.current = true;
    syncLayoutsToShared();
    if (index === state.index) {
      moveBubbleToIndex(state.index, false);
    }
  };

  // Manual activation (UIKit-style): commit to pan only once horizontal movement wins,
  // so taps on tabs still reach Native handlers.
  const panGesture = Gesture.Pan()
    .manualActivation(true)
    .onTouchesMove((event, state) => {
      'worklet';
      const touch = event.changedTouches[0];
      const dx = Math.abs(touch.translationX ?? 0);
      const dy = Math.abs(touch.translationY ?? 0);
      if (dx > 6 && dx > dy) {
        state.activate();
      } else if (dy > 10) {
        state.fail();
      }
    })
    .onStart((e) => {
      isDragging.value = true;
      const xs = layoutsX.value;
      const ws = layoutsW.value;
      if (xs.length === 0) return;
      const pos = bubbleAtFingerX(e.x, xs, ws);
      bubbleX.value = pos.x;
      bubbleWidth.value = pos.width;
      const idx = findNearestTabIndex(e.x, xs, ws);
      hoverIndex.value = idx;
      runOnJS(triggerSelectionHaptic)(idx);
    })
    .onUpdate((e) => {
      const xs = layoutsX.value;
      const ws = layoutsW.value;
      if (xs.length === 0) return;
      const pos = bubbleAtFingerX(e.x, xs, ws);
      bubbleX.value = pos.x;
      bubbleWidth.value = pos.width;
      const idx = findNearestTabIndex(e.x, xs, ws);
      if (idx !== hoverIndex.value) {
        hoverIndex.value = idx;
        runOnJS(triggerSelectionHaptic)(idx);
      }
    })
    .onEnd((e) => {
      isDragging.value = false;
      const xs = layoutsX.value;
      const ws = layoutsW.value;
      if (xs.length === 0) return;
      const idx = findNearestTabIndex(e.x, xs, ws);
      hoverIndex.value = idx;
      bubbleX.value = withSpring(xs[idx], Springs.dock);
      bubbleWidth.value = withSpring(ws[idx], Springs.dock);
      runOnJS(navigateToTab)(idx);
      runOnJS(endScrub)();
    })
    .onFinalize(() => {
      isDragging.value = false;
      runOnJS(endScrub)();
    });

  // Pan first: horizontal drag scrubs the bubble; quick taps fall through to Native (tab buttons).
  // Matches UIKit’s pattern of deferring pan until movement exceeds a threshold (activeOffsetX).
  const tabGestures = Gesture.Exclusive(panGesture, Gesture.Native());

  const handleTabPress = useCallback(
    (index: number, routeKey: string, routeName: string, routeParams: object | undefined, isFocused: boolean) => {
      moveBubbleToIndex(index, true);
      activeIndex.value = index;
      hoverIndex.value = index;

      onTabPress?.();
      const event = navigation.emit({
        type: 'tabPress',
        target: routeKey,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(routeName, routeParams);
      }
    },
    [activeIndex, hoverIndex, moveBubbleToIndex, navigation, onTabPress]
  );

  return (
    <GlassSurface variant="dock" borderRadius={Radius.xl} style={styles.pill}>
      <GestureDetector gesture={tabGestures}>
        <View style={styles.pillContent}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.selectionBubble,
              {
                backgroundColor: colors.tabBubbleFill,
                borderColor: colors.tabBubbleBorder,
                ...Platform.select({
                  ios: {
                    shadowColor: colors.shadow,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.35,
                    shadowRadius: 12,
                  },
                  default: { elevation: 8 },
                }),
              },
              bubbleStyle,
            ]}>
            <View
              style={[styles.bubbleSpecular, { backgroundColor: colors.glassHighlight }]}
            />
          </Animated.View>

          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const highlighted = scrubIndex !== null ? scrubIndex === index : isFocused;
            const config = TAB_CONFIG[route.name] ?? {
              label: options.title ?? route.name,
              icon: 'house.fill' as AppIconName,
            };

            return (
              <TabItem
                key={route.key}
                index={index}
                label={config.label}
                icon={config.icon}
                highlighted={highlighted}
                hoverIndex={hoverIndex}
                isDragging={isDragging}
                activeIndex={activeIndex}
                selectedColor={colors.tabIconSelected}
                defaultColor={colors.tabIconDefault}
                onPress={() =>
                  handleTabPress(index, route.key, route.name, route.params, isFocused)
                }
                onLayout={handleTabLayout(index)}
              />
            );
          })}
        </View>
      </GestureDetector>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  pill: {
    flex: 1,
    minHeight: GLASS_TAB_BAR_HEIGHT,
  },
  pillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: GLASS_TAB_BAR_HEIGHT,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  selectionBubble: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    left: 0,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth * 2,
    overflow: 'hidden',
  },
  bubbleSpecular: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    opacity: 0.35,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    gap: 2,
    minWidth: 56,
  },
  tabLabel: {
    fontSize: 11,
  },
});
