import type { QuickAddSession } from '@/types/quick-add';

export type QuickAddLiveState = {
  title: string;
  subtitle: string;
  progressBar: {
    progress: number;
  };
};

function getStepText(session: QuickAddSession): string {
  if (session.step === 'type') return 'Choose type';
  if (session.step === 'amount') return 'Choose amount';
  if (session.step === 'category') return 'Choose category';
  return 'Confirm';
}

function getStepProgress(session: QuickAddSession) {
  if (session.step === 'type') return 0.2;
  if (session.step === 'amount') return 0.45;
  if (session.step === 'category') return 0.75;
  return 1;
}

export function buildQuickAddLiveActivityLayout(session: QuickAddSession): QuickAddLiveState {
  const kind = session.type === 'income' ? 'Income' : session.type === 'expense' ? 'Expense' : 'Quick Add';
  const amountText = session.amount > 0 ? ` • $${(session.amount / 100).toFixed(2)}` : '';

  return {
    title: `${kind}${amountText}`,
    subtitle: getStepText(session),
    progressBar: { progress: getStepProgress(session) },
  };
}
