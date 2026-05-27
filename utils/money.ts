export function dollarsToCents(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  if (Number.isNaN(parsed) || parsed < 0) return 0;
  return Math.round(parsed * 100);
}

export function centsToDollars(cents: number): number {
  return cents / 100;
}

export function formatMoney(cents: number, options?: { showSign?: boolean; type?: 'expense' | 'income' }): string {
  const dollars = Math.abs(cents) / 100;
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(dollars);

  if (!options?.showSign) return formatted;

  if (options.type === 'expense') return `-${formatted}`;
  if (options.type === 'income') return `+${formatted}`;
  return cents < 0 ? `-${formatted}` : formatted;
}

export function parseAmountInput(value: string): string {
  const parts = value.replace(/[^0-9.]/g, '').split('.');
  if (parts.length <= 1) return parts[0] ?? '';
  return `${parts[0]}.${parts[1].slice(0, 2)}`;
}
