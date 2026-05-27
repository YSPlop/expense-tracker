import type { Category } from '@/types/category';
import type { AnalyticsSummary, CategoryTotal, TimeBucket, TimeRange } from '@/types/analytics';
import type { Transaction } from '@/types/transaction';
import { isWithinRange } from './dates';

function filterByRange(transactions: Transaction[], range: TimeRange): Transaction[] {
  return transactions.filter((t) => isWithinRange(t.createdAt, range));
}

function buildCategoryTotals(
  transactions: Transaction[],
  categories: Category[],
  type: 'expense' | 'income'
): CategoryTotal[] {
  const filtered = transactions.filter((t) => t.type === type);
  const total = filtered.reduce((sum, t) => sum + t.amount, 0);
  if (total === 0) return [];

  const map = new Map<string, number>();
  for (const t of filtered) {
    map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount);
  }

  return Array.from(map.entries())
    .map(([categoryId, amount]) => {
      const category = categories.find((c) => c.id === categoryId);
      return {
        categoryId,
        title: category?.title ?? 'Unknown',
        color: category?.color ?? '#9CA3AF',
        icon: category?.icon ?? 'questionmark.circle.fill',
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

function buildTimeBuckets(transactions: Transaction[], range: TimeRange): TimeBucket[] {
  const now = new Date();

  if (range === 'weekly') {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const buckets: TimeBucket[] = days.map((label) => ({ label, expense: 0, income: 0 }));
    for (const t of transactions) {
      const d = new Date(t.createdAt);
      const dayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1;
      if (t.type === 'expense') buckets[dayIndex].expense += t.amount;
      else buckets[dayIndex].income += t.amount;
    }
    return buckets;
  }

  if (range === 'monthly') {
    const weeks = ['W1', 'W2', 'W3', 'W4', 'W5'];
    const buckets: TimeBucket[] = weeks.map((label) => ({ label, expense: 0, income: 0 }));
    for (const t of transactions) {
      const d = new Date(t.createdAt);
      const weekIndex = Math.min(Math.floor((d.getDate() - 1) / 7), 4);
      if (t.type === 'expense') buckets[weekIndex].expense += t.amount;
      else buckets[weekIndex].income += t.amount;
    }
    return buckets;
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const buckets: TimeBucket[] = months.map((label) => ({ label, expense: 0, income: 0 }));
  for (const t of transactions) {
    const d = new Date(t.createdAt);
    if (d.getFullYear() !== now.getFullYear()) continue;
    const monthIndex = d.getMonth();
    if (t.type === 'expense') buckets[monthIndex].expense += t.amount;
    else buckets[monthIndex].income += t.amount;
  }
  return buckets;
}

export function computeAnalytics(
  transactions: Transaction[],
  categories: Category[],
  range: TimeRange
): AnalyticsSummary {
  const filtered = filterByRange(transactions, range);
  const totalExpense = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalIncome = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);

  return {
    totalExpense,
    totalIncome,
    categoryTotals: buildCategoryTotals(filtered, categories, 'expense'),
    timeBuckets: buildTimeBuckets(filtered, range),
  };
}

export function computeBalance(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount;
  }, 0);
}
