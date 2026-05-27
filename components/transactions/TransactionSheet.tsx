import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { CategoryPicker } from '@/components/categories/CategoryPicker';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppStore } from '@/store/use-app-store';
import type { Transaction, TransactionType } from '@/types/transaction';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { dollarsToCents, parseAmountInput } from '@/utils/money';

export type TransactionSheetHandle = {
  openForAdd: (type: TransactionType) => void;
  openForEdit: (transaction: Transaction) => void;
};

type TransactionSheetProps = {
  onDismiss?: () => void;
};

export const TransactionSheet = forwardRef<TransactionSheetHandle, TransactionSheetProps>(
  function TransactionSheet({ onDismiss }, ref) {
    const { colors } = useAppTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const categories = useAppStore((s) => s.categories);
    const addTransaction = useAppStore((s) => s.addTransaction);
    const updateTransaction = useAppStore((s) => s.updateTransaction);
    const getCategoriesForType = useAppStore((s) => s.getCategoriesForType);

    const [mode, setMode] = useState<'add' | 'edit'>('add');
    const [type, setType] = useState<TransactionType>('expense');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState<string | null>(null);

    const snapPoints = useMemo(() => ['58%', '92%'], []);

    const resetForm = useCallback(() => {
      setAmount('');
      setDescription('');
      setCategoryId(null);
      setEditingId(null);
      setMode('add');
    }, []);

    useImperativeHandle(ref, () => ({
      openForAdd: (transactionType: TransactionType) => {
        resetForm();
        setType(transactionType);
        setMode('add');
        const cats = getCategoriesForType(transactionType);
        setCategoryId(cats[0]?.id ?? null);
        bottomSheetRef.current?.present();
      },
      openForEdit: (transaction: Transaction) => {
        setMode('edit');
        setEditingId(transaction.id);
        setType(transaction.type);
        setAmount((transaction.amount / 100).toFixed(2));
        setDescription(transaction.description);
        setCategoryId(transaction.categoryId);
        bottomSheetRef.current?.present();
      },
    }));

    const handleSave = () => {
      const cents = dollarsToCents(amount);
      if (cents <= 0 || !categoryId) return;

      if (mode === 'edit' && editingId) {
        updateTransaction(editingId, {
          amount: cents,
          type,
          categoryId,
          description,
        });
      } else {
        addTransaction({
          amount: cents,
          type,
          categoryId,
          description,
        });
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      bottomSheetRef.current?.dismiss();
      resetForm();
    };

    const renderBackdrop = useCallback(
      (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
      ),
      []
    );

    const title = mode === 'edit' ? 'Edit Transaction' : type === 'expense' ? 'Add Expense' : 'Add Income';

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.glassFillStrong }}
        handleIndicatorStyle={{ backgroundColor: colors.textSecondary }}
        onDismiss={() => {
          resetForm();
          onDismiss?.();
        }}
        keyboardBehavior="interactive"
        android_keyboardInputMode="adjustResize">
        <BottomSheetView style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Amount</Text>
          <BottomSheetTextInput
            value={amount}
            onChangeText={(t) => setAmount(parseAmountInput(t))}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={colors.textSecondary}
            style={[styles.amountInput, { color: colors.text, borderColor: colors.glassBorder }]}
          />

          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Description</Text>
          <BottomSheetTextInput
            value={description}
            onChangeText={setDescription}
            placeholder="What was this for?"
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.glassBorder, backgroundColor: colors.glassFill },
            ]}
          />

          <CategoryPicker
            type={type}
            categories={categories}
            selectedId={categoryId}
            onSelect={setCategoryId}
          />

          <Pressable
            onPress={handleSave}
            style={[styles.saveButton, { backgroundColor: type === 'expense' ? colors.expense : colors.income }]}>
            <Text style={styles.saveText}>Save</Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  title: {
    ...Typography.sectionTitle,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  fieldLabel: {
    ...Typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountInput: {
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    letterSpacing: -1,
  },
  input: {
    ...Typography.body,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  saveButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
