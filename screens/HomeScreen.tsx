import { useCallback, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AnalyticsSection } from '@/components/charts/AnalyticsSection';
import { GlassButton } from '@/components/glass/GlassButton';
import { SwipeableTransactionList } from '@/components/transactions/SwipeableTransactionList';
import {
  TransactionSheet,
  type TransactionSheetHandle,
} from '@/components/transactions/TransactionSheet';
import { AnimatedBalance } from '@/components/ui/AnimatedBalance';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { Toast } from '@/components/ui/Toast';
import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppStore, useBalance, useRecentTransactions } from '@/store/use-app-store';
import type { Transaction } from '@/types/transaction';

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const balance = useBalance();
  const transactions = useRecentTransactions();
  const sheetRef = useRef<TransactionSheetHandle>(null);
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

  const handlePressTransaction = useCallback((transaction: Transaction) => {
    sheetRef.current?.openForEdit(transaction);
  }, []);

  return (
    <View style={styles.root}>
      <SafeScreen>
        <AnimatedBalance cents={balance} />

        <View style={styles.actions}>
          <GlassButton label="Expense" variant="expense" onPress={() => sheetRef.current?.openForAdd('expense')} />
          <GlassButton label="Income" variant="income" onPress={() => sheetRef.current?.openForAdd('income')} />
        </View>

        <AnalyticsSection />

        <View style={styles.listSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent</Text>
          <SwipeableTransactionList
            transactions={transactions}
            onPressTransaction={handlePressTransaction}
            onDelete={handleDelete}
          />
        </View>
      </SafeScreen>

      <TransactionSheet ref={sheetRef} />

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
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  listSection: {
    gap: Spacing.md,
  },
  sectionTitle: {
    ...Typography.sectionTitle,
  },
});
