import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { useEffect } from 'react';

import { useQuickAdd } from '@/context/QuickAddContext';
import type { TransactionType } from '@/types/transaction';

function parseQuickAddType(url: string): TransactionType | undefined {
  const parsed = Linking.parse(url);
  const path = parsed.path ?? '';
  if (path.endsWith('/income')) return 'income';
  if (path.endsWith('/expense')) return 'expense';
  return undefined;
}

function isQuickAddURL(url: string) {
  return url.includes('quick-add');
}

export function useQuickAddDeepLink() {
  const router = useRouter();
  const { startQuickAdd } = useQuickAdd();

  useEffect(() => {
    const handleURL = (url: string) => {
      if (!isQuickAddURL(url)) return;
      startQuickAdd(parseQuickAddType(url));
      router.replace('/(tabs)');
    };

    Linking.getInitialURL().then((url) => {
      if (url) handleURL(url);
    });

    const sub = Linking.addEventListener('url', ({ url }) => {
      handleURL(url);
    });

    return () => sub.remove();
  }, [router, startQuickAdd]);
}
