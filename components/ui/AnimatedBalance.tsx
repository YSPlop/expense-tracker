import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatMoney } from '@/utils/money';

type AnimatedBalanceProps = {
  cents: number;
  label?: string;
  hero?: boolean;
};

export function AnimatedBalance({ cents, label = 'Current Balance', hero = false }: AnimatedBalanceProps) {
  const { colors } = useAppTheme();
  const [displayText, setDisplayText] = useState(() => formatMoney(cents));

  useEffect(() => {
    setDisplayText(formatMoney(cents));
  }, [cents]);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Text
        style={[
          hero ? styles.display : styles.balance,
          { color: cents >= 0 ? colors.text : colors.expense },
        ]}>
        {displayText}
      </Text>
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
    letterSpacing: 1.2,
  },
  balance: {
    ...Typography.balance,
    textAlign: 'center',
  },
  display: {
    ...Typography.display,
    textAlign: 'center',
  },
});
