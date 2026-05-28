import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { GestureResponderEvent } from 'react-native';
import { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { Durations, Springs } from '@/constants/motion';

type UseSpringPressOptions = {
  /** Opacity when pressed (default 0.88). Avoid scale transforms inside BlurView subtrees. */
  pressedOpacity?: number;
  haptic?: boolean;
  onPress?: () => void;
};

export function useSpringPress(options: UseSpringPressOptions = {}) {
  const { pressedOpacity = 0.88, haptic = true, onPress } = options;
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const onPressIn = useCallback(() => {
    opacity.value = withTiming(pressedOpacity, { duration: Durations.fast });
  }, [pressedOpacity, opacity]);

  const onPressOut = useCallback(() => {
    opacity.value = withSpring(1, Springs.press);
  }, [opacity]);

  const handlePress = useCallback(
    (_event?: GestureResponderEvent) => {
      if (haptic) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress?.();
    },
    [haptic, onPress]
  );

  return {
    animatedStyle,
    onPressIn,
    onPressOut,
    handlePress,
  };
}
