import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useSpringPress } from '@/hooks/motion/use-spring-press';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { AppIconName } from '@/types/icons';

import { GlassSurface } from './GlassSurface';

export type GlassButtonVariant = 'primary' | 'secondary' | 'expense' | 'income' | 'ghost';

type GlassButtonProps = {
  label: string;
  onPress: () => void;
  variant?: GlassButtonVariant;
  icon?: AppIconName;
  style?: ViewStyle;
  compact?: boolean;
};

export function GlassButton({
  label,
  onPress,
  variant = 'secondary',
  icon,
  style,
  compact = false,
}: GlassButtonProps) {
  const { colors } = useAppTheme();
  const { animatedStyle, onPressIn, onPressOut, handlePress } = useSpringPress({ onPress });

  const accent =
    variant === 'expense'
      ? colors.expense
      : variant === 'income'
        ? colors.income
        : variant === 'primary'
          ? colors.tint
          : colors.text;

  const glassBg =
    variant === 'expense'
      ? colors.expenseGlass
      : variant === 'income'
        ? colors.incomeGlass
        : 'transparent';

  const resolvedIcon =
    icon ??
    (variant === 'expense'
      ? 'minus.circle.fill'
      : variant === 'income'
        ? 'plus.circle.fill'
        : variant === 'primary'
          ? 'plus'
          : 'chevron.right');

  const useTint = variant === 'expense' || variant === 'income' || variant === 'primary';

  if (variant === 'ghost') {
    return (
      <Pressable
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[styles.button, style]}>
        <Animated.View style={[styles.ghostInner, compact && styles.compact, animatedStyle]}>
          {icon && <IconSymbol name={resolvedIcon} size={compact ? 20 : 24} color={accent} />}
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.button, style]}>
      <GlassSurface variant="card" borderRadius={Radius.lg} shadow={false} style={styles.surface}>
        <Animated.View
          style={[styles.inner, compact && styles.compact, useTint && { backgroundColor: glassBg }, animatedStyle]}>
          {useTint && (
            <LinearGradient
              colors={[`${accent}28`, `${accent}06`]}
              style={StyleSheet.absoluteFill}
            />
          )}
          <IconSymbol name={resolvedIcon} size={compact ? 22 : 28} color={accent} />
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        </Animated.View>
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  surface: {
    flex: 1,
  },
  inner: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    minHeight: 96,
    overflow: 'hidden',
  },
  compact: {
    minHeight: 48,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  ghostInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  label: {
    ...Typography.body,
    fontWeight: '600',
  },
});
