export type TimeRange = 'weekly' | 'monthly' | 'yearly';

export type ChartType = 'donut' | 'pie' | 'bar' | 'line' | 'categories';

export interface CategoryTotal {
  categoryId: string;
  title: string;
  color: string;
  icon: string;
  amount: number;
  percentage: number;
}

export interface TimeBucket {
  label: string;
  expense: number;
  income: number;
}

export interface AnalyticsSummary {
  totalExpense: number;
  totalIncome: number;
  categoryTotals: CategoryTotal[];
  timeBuckets: TimeBucket[];
}
