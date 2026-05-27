import type { Category } from '@/types/category';

export const UNCATEGORIZED_ID = 'uncategorized';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'food',
    title: 'Food',
    icon: 'fork.knife',
    color: '#FF6B6B',
    type: 'expense',
  },
  {
    id: 'transport',
    title: 'Transport',
    icon: 'car.fill',
    color: '#4ECDC4',
    type: 'expense',
  },
  {
    id: 'bills',
    title: 'Bills',
    icon: 'bolt.fill',
    color: '#FFE66D',
    type: 'expense',
  },
  {
    id: 'shopping',
    title: 'Shopping',
    icon: 'bag.fill',
    color: '#A78BFA',
    type: 'expense',
  },
  {
    id: 'salary',
    title: 'Salary',
    icon: 'dollarsign.circle.fill',
    color: '#34D399',
    type: 'income',
  },
  {
    id: 'freelance',
    title: 'Freelance',
    icon: 'briefcase.fill',
    color: '#60A5FA',
    type: 'income',
  },
  {
    id: UNCATEGORIZED_ID,
    title: 'Uncategorized',
    icon: 'questionmark.circle.fill',
    color: '#9CA3AF',
    type: 'both',
  },
];

export const CATEGORY_COLOR_PRESETS = [
  '#FF6B6B',
  '#4ECDC4',
  '#FFE66D',
  '#A78BFA',
  '#34D399',
  '#60A5FA',
  '#F472B6',
  '#FB923C',
  '#94A3B8',
  '#FBBF24',
];

export const CATEGORY_ICON_PRESETS = [
  'fork.knife',
  'car.fill',
  'bolt.fill',
  'bag.fill',
  'house.fill',
  'heart.fill',
  'gamecontroller.fill',
  'gift.fill',
  'airplane',
  'book.fill',
  'dollarsign.circle.fill',
  'briefcase.fill',
  'creditcard.fill',
  'cart.fill',
  'cup.and.saucer.fill',
];
