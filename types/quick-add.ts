import type { TransactionType } from '@/types/transaction';

export type QuickAddStep = 'type' | 'amount' | 'category' | 'confirm';

export type QuickAddSession = {
  isActive: boolean;
  step: QuickAddStep;
  type: TransactionType | null;
  amount: number;
  categoryId: string | null;
};

export const QUICK_ADD_PRESET_AMOUNTS = [500, 1000, 2500, 5000] as const;
