import { Redirect, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { useQuickAdd } from '@/context/QuickAddContext';
import type { TransactionType } from '@/types/transaction';

export default function QuickAddByTypeRoute() {
  const { type } = useLocalSearchParams<{ type?: TransactionType }>();
  const { startQuickAdd } = useQuickAdd();

  useEffect(() => {
    startQuickAdd(type === 'income' || type === 'expense' ? type : undefined);
  }, [startQuickAdd, type]);

  return <Redirect href="/(tabs)" />;
}
