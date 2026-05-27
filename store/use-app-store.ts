import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_CATEGORIES, UNCATEGORIZED_ID } from '@/constants/categories';
import type { ChartType, TimeRange } from '@/types/analytics';
import type { Category } from '@/types/category';
import type { Transaction, TransactionInput, TransactionType } from '@/types/transaction';

interface UndoState {
  transaction: Transaction | null;
  timeoutId: ReturnType<typeof setTimeout> | null;
}

interface AppState {
  transactions: Transaction[];
  categories: Category[];
  chartType: ChartType;
  timeRange: TimeRange;
  undo: UndoState;
  _hasHydrated: boolean;

  setHasHydrated: (value: boolean) => void;
  setChartType: (chartType: ChartType) => void;
  setTimeRange: (timeRange: TimeRange) => void;

  addTransaction: (input: TransactionInput) => string;
  updateTransaction: (id: string, input: Partial<TransactionInput>) => void;
  deleteTransaction: (id: string) => Transaction | null;
  restoreTransaction: (transaction: Transaction) => void;
  clearUndo: () => void;

  addCategory: (category: Omit<Category, 'id'>) => string;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id'>>) => void;
  deleteCategory: (id: string) => void;
  getCategoriesForType: (type: TransactionType) => Category[];
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: DEFAULT_CATEGORIES,
      chartType: 'donut',
      timeRange: 'monthly',
      undo: { transaction: null, timeoutId: null },
      _hasHydrated: false,

      setHasHydrated: (value) => set({ _hasHydrated: value }),
      setChartType: (chartType) => set({ chartType }),
      setTimeRange: (timeRange) => set({ timeRange }),

      addTransaction: (input) => {
        const id = Crypto.randomUUID();
        const transaction: Transaction = {
          id,
          amount: input.amount,
          type: input.type,
          categoryId: input.categoryId,
          description: input.description.trim() || 'No description',
          createdAt: input.createdAt ?? new Date().toISOString(),
        };
        set((state) => ({ transactions: [transaction, ...state.transactions] }));
        return id;
      },

      updateTransaction: (id, input) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id
              ? {
                  ...t,
                  ...(input.amount !== undefined && { amount: input.amount }),
                  ...(input.type !== undefined && { type: input.type }),
                  ...(input.categoryId !== undefined && { categoryId: input.categoryId }),
                  ...(input.description !== undefined && {
                    description: input.description.trim() || 'No description',
                  }),
                  ...(input.createdAt !== undefined && { createdAt: input.createdAt }),
                }
              : t
          ),
        }));
      },

      deleteTransaction: (id) => {
        const transaction = get().transactions.find((t) => t.id === id) ?? null;
        if (!transaction) return null;

        const { undo } = get();
        if (undo.timeoutId) clearTimeout(undo.timeoutId);

        const timeoutId = setTimeout(() => {
          set({ undo: { transaction: null, timeoutId: null } });
        }, 5000);

        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
          undo: { transaction, timeoutId },
        }));

        return transaction;
      },

      restoreTransaction: (transaction) => {
        const { undo } = get();
        if (undo.timeoutId) clearTimeout(undo.timeoutId);
        set((state) => ({
          transactions: [transaction, ...state.transactions.filter((t) => t.id !== transaction.id)],
          undo: { transaction: null, timeoutId: null },
        }));
      },

      clearUndo: () => {
        const { undo } = get();
        if (undo.timeoutId) clearTimeout(undo.timeoutId);
        set({ undo: { transaction: null, timeoutId: null } });
      },

      addCategory: (category) => {
        const id = Crypto.randomUUID();
        set((state) => ({
          categories: [...state.categories.filter((c) => c.id !== UNCATEGORIZED_ID), { ...category, id }, ...state.categories.filter((c) => c.id === UNCATEGORIZED_ID)],
        }));
        return id;
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },

      deleteCategory: (id) => {
        if (id === UNCATEGORIZED_ID) return;
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          transactions: state.transactions.map((t) =>
            t.categoryId === id ? { ...t, categoryId: UNCATEGORIZED_ID } : t
          ),
        }));
      },

      getCategoriesForType: (type) => {
        return get().categories.filter((c) => c.type === type || c.type === 'both');
      },
    }),
    {
      name: 'expense-tracker-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        categories: state.categories,
        chartType: state.chartType,
        timeRange: state.timeRange,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export function useBalance() {
  const transactions = useAppStore((s) => s.transactions);
  return transactions.reduce((sum, t) => (t.type === 'income' ? sum + t.amount : sum - t.amount), 0);
}

export function useRecentTransactions(limit = 50) {
  const transactions = useAppStore((s) => s.transactions);
  return [...transactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
}
