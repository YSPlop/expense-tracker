import { StyleSheet, Text, TextStyle } from 'react-native';

import { Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAnimatedCounter } from '@/hooks/motion/use-animated-counter';

type AnimatedAmountProps = {
  cents: number;
  color?: string;
  style?: TextStyle;
};

export function AnimatedAmount({ cents, color, style }: AnimatedAmountProps) {
  const { colors } = useAppTheme();
  const { displayText } = useAnimatedCounter(cents);

  return (
    <Text style={[styles.value, { color: color ?? colors.text }, style]}>{displayText}</Text>
  );
}

const styles = StyleSheet.create({
  value: {
    ...Typography.amount,
  },
});
