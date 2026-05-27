import type { TimeRange } from '@/types/analytics';

export function getRangeBounds(range: TimeRange, reference = new Date()): { start: Date; end: Date } {
  const end = new Date(reference);
  end.setHours(23, 59, 59, 999);

  const start = new Date(reference);
  start.setHours(0, 0, 0, 0);

  if (range === 'weekly') {
    const day = start.getDay();
    const diff = day === 0 ? 6 : day - 1;
    start.setDate(start.getDate() - diff);
    return { start, end };
  }

  if (range === 'monthly') {
    start.setDate(1);
    return { start, end };
  }

  start.setMonth(0, 1);
  return { start, end };
}

export function isWithinRange(isoDate: string, range: TimeRange, reference = new Date()): boolean {
  const date = new Date(isoDate);
  const { start, end } = getRangeBounds(range, reference);
  return date >= start && date <= end;
}

export function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
