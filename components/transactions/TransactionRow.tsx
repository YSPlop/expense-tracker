import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import type { Category } from '@/types/category';
import type { Transaction } from '@/types/transaction';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatMoney } from '@/utils/money';
import { formatRelativeDate } from '@/utils/dates';

type TransactionRowProps = {
  transaction: Transaction;
  category?: Category;
  onPress: () => void;
};

export function TransactionRow({ transaction, category, onPress }: TransactionRowProps) {
  const { colors } = useAppTheme();
  const isExpense = transaction.type === 'expense';
  const accent = category?.color ?? colors.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: pressed ? colors.glassFill : 'transparent' },
      ]}>
      <View style={[styles.icon, { backgroundColor: `${accent}22` }]}>
        <IconSymbol
          name={(category?.icon ?? 'questionmark.circle.fill') as 'fork.knife'}
          size={20}
          color={accent}
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {category?.title ?? 'Unknown'} · {formatRelativeDate(transaction.createdAt)}
        </Text>
      </View>
      <Text
        style={[
          styles.amount,
          { color: isExpense ? colors.expense : colors.income },
        ]}>
        {formatMoney(transaction.amount, { showSign: true, type: transaction.type })}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.md,
    borderRadius: Radius.md,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...Typography.body,
    fontWeight: '500',
  },
  subtitle: {
    ...Typography.caption,
    fontSize: 13,
  },
  amount: {
    ...Typography.amount,
  },
});
