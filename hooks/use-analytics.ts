import { useMemo } from 'react';

import { useAppStore } from '@/store/use-app-store';
import { computeAnalytics } from '@/utils/analytics';

export function useAnalytics() {
  const transactions = useAppStore((s) => s.transactions);
  const categories = useAppStore((s) => s.categories);
  const timeRange = useAppStore((s) => s.timeRange);

  return useMemo(
    () => computeAnalytics(transactions, categories, timeRange),
    [transactions, categories, timeRange]
  );
}
