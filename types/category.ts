import type { TransactionType } from './transaction';

export type CategoryType = TransactionType | 'both';

export interface Category {
  id: string;
  title: string;
  icon: string;
  color: string;
  type: CategoryType;
}
