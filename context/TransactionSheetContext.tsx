import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

import {
  TransactionSheet,
  type TransactionSheetHandle,
} from '@/components/transactions/TransactionSheet';
import { RemoveExpensePicker } from '@/components/transactions/RemoveExpensePicker';
import type { Transaction, TransactionType } from '@/types/transaction';

type TransactionSheetContextValue = {
  openForAdd: (type: TransactionType) => void;
  openForEdit: (transaction: Transaction) => void;
  openRemovePicker: (type: TransactionType) => void;
  closeBubbleUI: () => void;
};

const TransactionSheetContext = createContext<TransactionSheetContextValue | null>(null);

export function TransactionSheetProvider({ children }: { children: ReactNode }) {
  const sheetRef = useRef<TransactionSheetHandle>(null);
  const [removePickerType, setRemovePickerType] = useState<TransactionType | null>(null);

  const openForAdd = useCallback((type: TransactionType) => {
    setRemovePickerType(null);
    sheetRef.current?.openForAdd(type);
  }, []);

  const openForEdit = useCallback((transaction: Transaction) => {
    setRemovePickerType(null);
    sheetRef.current?.openForEdit(transaction);
  }, []);

  const openRemovePicker = useCallback((type: TransactionType) => {
    setRemovePickerType(type);
  }, []);

  const closeBubbleUI = useCallback(() => {
    setRemovePickerType(null);
  }, []);

  return (
    <TransactionSheetContext.Provider
      value={{ openForAdd, openForEdit, openRemovePicker, closeBubbleUI }}>
      {children}
      <TransactionSheet ref={sheetRef} onDismiss={() => setRemovePickerType(null)} />
      <RemoveExpensePicker
        visible={removePickerType != null}
        type={removePickerType ?? 'expense'}
        onClose={() => setRemovePickerType(null)}
      />
    </TransactionSheetContext.Provider>
  );
}

export function useTransactionSheet() {
  const ctx = useContext(TransactionSheetContext);
  if (!ctx) {
    throw new Error('useTransactionSheet must be used within TransactionSheetProvider');
  }
  return ctx;
}
