import { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

type UseScrollParallaxOptions = {
  factor?: number;
};

export function useScrollParallax(options: UseScrollParallaxOptions = {}) {
  const { factor = 0.25 } = options;
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const parallaxStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -scrollY.value * factor }],
  }));

  return { scrollY, scrollHandler, parallaxStyle };
}
