import { Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useSpringPress } from '@/hooks/motion/use-spring-press';

import { GlassSurface } from './GlassSurface';

type FloatingActionButtonProps = {
  onPress: () => void;
  open: boolean;
  size?: number;
};

export function FloatingActionButton({
  onPress,
  open,
  size = 56,
}: FloatingActionButtonProps) {
  const { colors } = useAppTheme();
  const { animatedStyle, onPressIn, onPressOut, handlePress } = useSpringPress({ onPress });

  return (
    <Pressable onPress={handlePress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <GlassSurface variant="dock" borderRadius={size / 2} style={{ width: size, height: size }}>
        <Animated.View style={[styles.iconWrap, { width: size, height: size }, animatedStyle]}>
          <IconSymbol name={open ? 'xmark' : 'plus'} size={open ? 22 : 26} color={colors.text} />
        </Animated.View>
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
