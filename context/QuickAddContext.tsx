import { createContext, useContext, type ReactNode } from 'react';

import { QuickAddIslandOverlay } from '@/components/quick-add/QuickAddIslandOverlay';
import { useQuickAddSession } from '@/hooks/use-quick-add-session';
import type { TransactionType } from '@/types/transaction';

type QuickAddContextValue = {
  isActive: boolean;
  startQuickAdd: (initialType?: TransactionType) => void;
};

const QuickAddContext = createContext<QuickAddContextValue | null>(null);

export function QuickAddProvider({ children }: { children: ReactNode }) {
  const { session, start, chooseType, chooseAmount, chooseCategory, goBack, cancel, confirm } =
    useQuickAddSession();

  return (
    <QuickAddContext.Provider value={{ isActive: session.isActive, startQuickAdd: start }}>
      {children}
      <QuickAddIslandOverlay
        session={session}
        onChooseType={chooseType}
        onChooseAmount={chooseAmount}
        onChooseCategory={chooseCategory}
        onBack={goBack}
        onCancel={cancel}
        onConfirm={confirm}
      />
    </QuickAddContext.Provider>
  );
}

export function useQuickAdd() {
  const ctx = useContext(QuickAddContext);
  if (!ctx) {
    throw new Error('useQuickAdd must be used within QuickAddProvider');
  }
  return ctx;
}
