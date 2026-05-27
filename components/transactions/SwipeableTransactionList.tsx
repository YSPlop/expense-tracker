import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { GlassCard } from '@/components/glass/GlassCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { TransactionRow } from '@/components/transactions/TransactionRow';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppStore } from '@/store/use-app-store';
import type { Transaction } from '@/types/transaction';
import { Spacing, Typography } from '@/constants/theme';

type SwipeableTransactionListProps = {
  transactions: Transaction[];
  onPressTransaction: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
};

export function SwipeableTransactionList({
  transactions,
  onPressTransaction,
  onDelete,
}: SwipeableTransactionListProps) {
  const { colors } = useAppTheme();
  const categories = useAppStore((s) => s.categories);

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions yet"
        message="Tap Expense or Income above to add your first entry."
        icon="tray"
      />
    );
  }

  return (
    <GlassCard padding={Spacing.sm}>
      {transactions.map((transaction, index) => {
        const category = categories.find((c) => c.id === transaction.categoryId);

        const renderRightActions = () => (
          <View style={styles.deleteAction}>
            <Text style={styles.deleteText}>Delete</Text>
          </View>
        );

        return (
          <View key={transaction.id}>
            <Swipeable
              renderRightActions={renderRightActions}
              onSwipeableOpen={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onDelete(transaction.id);
              }}
              overshootRight={false}>
              <TransactionRow
                transaction={transaction}
                category={category}
                onPress={() => onPressTransaction(transaction)}
              />
            </Swipeable>
            {index < transactions.length - 1 && (
              <View style={[styles.separator, { backgroundColor: colors.separator }]} />
            )}
          </View>
        );
      })}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  deleteAction: {
    backgroundColor: '#FF453A',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
    marginVertical: 4,
    minWidth: 90,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 60,
  },
});
