import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatMoney } from '@/utils/money';

type AnimatedBalanceProps = {
  cents: number;
  label?: string;
};

export function AnimatedBalance({ cents, label = 'Current Balance' }: AnimatedBalanceProps) {
  const { colors } = useAppTheme();
  const animatedValue = useSharedValue(cents);
  const [displayText, setDisplayText] = useState(formatMoney(cents));

  useEffect(() => {
    animatedValue.value = withTiming(cents, { duration: 600, easing: Easing.out(Easing.cubic) });
  }, [cents, animatedValue]);

  useAnimatedReaction(
    () => animatedValue.value,
    (value) => {
      const sign = value < 0 ? '-' : '';
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(Math.abs(value) / 100);
      runOnJS(setDisplayText)(`${sign}${formatted}`);
    },
    [cents]
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Animated.Text
        style={[
          styles.balance,
          {
            color: cents >= 0 ? colors.text : colors.expense,
          },
        ]}>
        {displayText}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
  },
  label: {
    ...Typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  balance: {
    fontSize: 44,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
});
