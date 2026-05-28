import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/glass';
import { SwipeableTransactionList } from '@/components/transactions/SwipeableTransactionList';
import { AnimatedAmount } from '@/components/ui/AnimatedAmount';
import { AnimatedBalance } from '@/components/ui/AnimatedBalance';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { Toast } from '@/components/ui/Toast';
import { Spacing, Typography } from '@/constants/theme';
import { useTransactionSheet } from '@/context/TransactionSheetContext';
import { useAppTheme } from '@/hooks/use-app-theme';
import {
  useAppStore,
  useBalance,
  useRecentTransactions,
  useTotalByType,
} from '@/store/use-app-store';
import type { Transaction } from '@/types/transaction';

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const balance = useBalance();
  const totalExpenses = useTotalByType('expense');
  const totalIncome = useTotalByType('income');
  const transactions = useRecentTransactions();
  const { openForEdit } = useTransactionSheet();
  const deleteTransaction = useAppStore((s) => s.deleteTransaction);
  const restoreTransaction = useAppStore((s) => s.restoreTransaction);
  const undo = useAppStore((s) => s.undo);
  const clearUndo = useAppStore((s) => s.clearUndo);

  const handleDelete = useCallback(
    (id: string) => {
      deleteTransaction(id);
    },
    [deleteTransaction]
  );

  const handleUndo = useCallback(() => {
    if (undo.transaction) {
      restoreTransaction(undo.transaction);
    }
    clearUndo();
  }, [undo.transaction, restoreTransaction, clearUndo]);

  const handlePressTransaction = useCallback(
    (transaction: Transaction) => {
      openForEdit(transaction);
    },
    [openForEdit]
  );

  return (
    <View style={styles.root}>
      <SafeScreen
        header={
          <GlassCard hero elevated>
            <AnimatedBalance cents={balance} hero />
          </GlassCard>
        }>
        <View style={styles.statsRow}>
          <GlassCard style={styles.statCard} padding={Spacing.lg}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Expenses</Text>
            <AnimatedAmount cents={totalExpenses} color={colors.expense} style={styles.statValue} />
          </GlassCard>

          <GlassCard style={styles.statCard} padding={Spacing.lg}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Income</Text>
            <AnimatedAmount cents={totalIncome} color={colors.income} style={styles.statValue} />
          </GlassCard>
        </View>

        <GlassCard padding={Spacing.lg}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent</Text>
          <SwipeableTransactionList
            transactions={transactions}
            onPressTransaction={handlePressTransaction}
            onDelete={handleDelete}
          />
        </GlassCard>
      </SafeScreen>

      <Toast
        visible={!!undo.transaction}
        message="Transaction deleted"
        onAction={handleUndo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    gap: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  sectionTitle: {
    ...Typography.sectionTitle,
    marginBottom: Spacing.md,
  },
});
