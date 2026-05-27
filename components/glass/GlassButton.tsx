import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type GlassButtonProps = {
  label: string;
  variant: 'expense' | 'income';
  onPress: () => void;
};

export function GlassButton({ label, variant, onPress }: GlassButtonProps) {
  const { colors } = useAppTheme();
  const scale = useSharedValue(1);

  const accent = variant === 'expense' ? colors.expense : colors.income;
  const glassBg = variant === 'expense' ? colors.expenseGlass : colors.incomeGlass;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const icon = variant === 'expense' ? 'minus.circle.fill' : 'plus.circle.fill';

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.button, animatedStyle]}>
      <View style={[styles.inner, { borderColor: colors.glassBorder, backgroundColor: glassBg }]}>
        <LinearGradient
          colors={[`${accent}22`, `${accent}08`]}
          style={StyleSheet.absoluteFill}
        />
        <IconSymbol name={icon} size={28} color={accent} />
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  inner: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    overflow: 'hidden',
    minHeight: 100,
  },
  label: {
    ...Typography.body,
    fontWeight: '600',
  },
});
