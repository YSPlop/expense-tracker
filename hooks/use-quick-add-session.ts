import * as Haptics from 'expo-haptics';
import { useCallback, useMemo, useState } from 'react';

import {
  endQuickAddLiveActivity,
  startQuickAddLiveActivity,
  syncQuickAddLiveActivity,
} from '@/services/quick-add-live-activity';
import { useAppStore } from '@/store/use-app-store';
import type { QuickAddSession, QuickAddStep } from '@/types/quick-add';
import type { TransactionType } from '@/types/transaction';
import { supportsDynamicIsland } from '@/utils/device-capabilities';

const STEP_ORDER: QuickAddStep[] = ['type', 'amount', 'category', 'confirm'];

type UseQuickAddSessionReturn = {
  session: QuickAddSession;
  start: (initialType?: TransactionType) => void;
  chooseType: (type: TransactionType) => void;
  chooseAmount: (amount: number) => void;
  chooseCategory: (categoryId: string) => void;
  goBack: () => void;
  cancel: () => void;
  confirm: () => void;
};

const INITIAL_SESSION: QuickAddSession = {
  isActive: false,
  step: 'type',
  type: null,
  amount: 0,
  categoryId: null,
};

export function useQuickAddSession(): UseQuickAddSessionReturn {
  const addTransaction = useAppStore((s) => s.addTransaction);
  const getCategoriesForType = useAppStore((s) => s.getCategoriesForType);
  const [session, setSession] = useState<QuickAddSession>(INITIAL_SESSION);

  const setAndSync = useCallback((next: QuickAddSession) => {
    setSession(next);
    if (next.isActive) {
      syncQuickAddLiveActivity(next);
    }
  }, []);

  const start = useCallback(
    (initialType?: TransactionType) => {
      const categories = initialType ? getCategoriesForType(initialType) : [];
      const next: QuickAddSession = {
        isActive: true,
        step: initialType ? 'amount' : 'type',
        type: initialType ?? null,
        amount: 0,
        categoryId: categories[0]?.id ?? null,
      };

      setSession(next);
      if (supportsDynamicIsland()) {
        startQuickAddLiveActivity(next);
      }
    },
    [getCategoriesForType]
  );

  const chooseType = useCallback(
    (type: TransactionType) => {
      const categories = getCategoriesForType(type);
      setAndSync({
        ...session,
        type,
        step: 'amount',
        categoryId: categories[0]?.id ?? null,
      });
    },
    [getCategoriesForType, session, setAndSync]
  );

  const chooseAmount = useCallback(
    (amount: number) => {
      setAndSync({
        ...session,
        amount,
        step: 'category',
      });
    },
    [session, setAndSync]
  );

  const chooseCategory = useCallback(
    (categoryId: string) => {
      setAndSync({
        ...session,
        categoryId,
        step: 'confirm',
      });
    },
    [session, setAndSync]
  );

  const goBack = useCallback(() => {
    const idx = STEP_ORDER.indexOf(session.step);
    if (idx <= 0) return;
    setAndSync({
      ...session,
      step: STEP_ORDER[idx - 1] ?? 'type',
    });
  }, [session, setAndSync]);

  const cancel = useCallback(() => {
    setSession(INITIAL_SESSION);
    void endQuickAddLiveActivity();
  }, []);

  const confirm = useCallback(() => {
    if (!session.type || !session.categoryId || session.amount <= 0) return;
    addTransaction({
      amount: session.amount,
      type: session.type,
      categoryId: session.categoryId,
      description: 'Quick Add',
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSession(INITIAL_SESSION);
    void endQuickAddLiveActivity();
  }, [addTransaction, session]);

  return useMemo(
    () => ({
      session,
      start,
      chooseType,
      chooseAmount,
      chooseCategory,
      goBack,
      cancel,
      confirm,
    }),
    [session, start, chooseType, chooseAmount, chooseCategory, goBack, cancel, confirm]
  );
}
