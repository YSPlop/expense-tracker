import * as Haptics from 'expo-haptics';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryIcon } from '@/components/categories/CategoryIcon';
import { GlassSurface } from '@/components/glass/GlassSurface';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppStore, useRecentTransactions } from '@/store/use-app-store';
import type { TransactionType } from '@/types/transaction';
import { formatMoney } from '@/utils/money';

type RemoveTransactionPickerProps = {
  visible: boolean;
  type: TransactionType;
  onClose: () => void;
};

export function RemoveExpensePicker({ visible, type, onClose }: RemoveTransactionPickerProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const categories = useAppStore((s) => s.categories);
  const deleteTransaction = useAppStore((s) => s.deleteTransaction);
  const recent = useRecentTransactions(20);
  const items = recent.filter((t) => t.type === type).slice(0, 8);

  const isExpense = type === 'expense';
  const typeLabel = isExpense ? 'expense' : 'income';
  const amountColor = isExpense ? colors.expense : colors.income;

  const confirmDelete = (id: string, label: string) => {
    Alert.alert(`Remove ${typeLabel}`, `Delete "${label}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          deleteTransaction(id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onClose();
        },
      },
    ]);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={[styles.backdrop, { backgroundColor: colors.scrim }]} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { marginBottom: insets.bottom + 100 }]}
          onPress={(e) => e.stopPropagation()}>
          <GlassSurface variant="modal" borderRadius={Radius.xl} elevated>
            <View style={styles.cardContent}>
              <Text style={[styles.title, { color: colors.text }]}>
                Remove {isExpense ? 'Expense' : 'Income'}
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Select a recent {typeLabel} to delete
              </Text>

              {items.length === 0 ? (
                <Text style={[styles.empty, { color: colors.textSecondary }]}>
                  No {typeLabel}s to remove
                </Text>
              ) : (
                items.map((transaction) => {
                  const category = categories.find((c) => c.id === transaction.categoryId);
                  return (
                    <Pressable
                      key={transaction.id}
                      style={[styles.row, { borderColor: colors.separator }]}
                      onPress={() =>
                        confirmDelete(transaction.id, transaction.description)
                      }>
                      <View
                        style={[
                          styles.rowIcon,
                          { backgroundColor: `${category?.color ?? colors.textSecondary}22` },
                        ]}>
                        <CategoryIcon
                          icon={category?.icon ?? 'questionmark.circle.fill'}
                          size={20}
                          color={category?.color ?? colors.textSecondary}
                        />
                      </View>
                      <View style={styles.rowText}>
                        <Text style={[styles.rowTitle, { color: colors.text }]} numberOfLines={1}>
                          {transaction.description}
                        </Text>
                        <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
                          {category?.title ?? 'Unknown'}
                        </Text>
                      </View>
                      <Text style={[styles.rowAmount, { color: amountColor }]}>
                        {formatMoney(transaction.amount, { showSign: true, type })}
                      </Text>
                    </Pressable>
                  );
                })
              )}

              <Pressable onPress={onClose} style={styles.cancelBtn}>
                <Text style={[styles.cancelText, { color: colors.tint }]}>Cancel</Text>
              </Pressable>
            </View>
          </GlassSurface>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    paddingHorizontal: Spacing.lg,
  },
  cardContent: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  title: {
    ...Typography.sectionTitle,
    fontSize: 18,
  },
  subtitle: {
    ...Typography.caption,
    marginBottom: Spacing.sm,
  },
  empty: {
    ...Typography.body,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    ...Typography.body,
    fontWeight: '500',
  },
  rowSub: {
    ...Typography.caption,
  },
  rowAmount: {
    ...Typography.amount,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
  cancelText: {
    fontSize: 17,
    fontWeight: '600',
  },
});
