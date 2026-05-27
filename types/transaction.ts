export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  description: string;
  createdAt: string;
}

export interface TransactionInput {
  amount: number;
  type: TransactionType;
  categoryId: string;
  description: string;
  createdAt?: string;
}
