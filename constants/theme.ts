import { Platform } from 'react-native';

const tintColorLight = '#007AFF';
const tintColorDark = '#0A84FF';

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const Radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  full: 999,
} as const;

export const BackgroundGradients = {
  light: ['#EEF2FA', '#DDE4F0', '#E8EDF5'] as const,
  dark: ['#121218', '#0A0A0E', '#0C0C0F'] as const,
};

export const Colors = {
  light: {
    text: '#1C1C1E',
    textSecondary: '#6B7280',
    background: '#E8EDF5',
    tint: tintColorLight,
    icon: '#8E8E93',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorLight,
    expense: '#FF453A',
    income: '#30D158',
    glassFill: 'rgba(255, 255, 255, 0.55)',
    glassFillStrong: 'rgba(255, 255, 255, 0.72)',
    glassBorder: 'rgba(255, 255, 255, 0.65)',
    glassHighlight: 'rgba(255, 255, 255, 0.9)',
    shadow: 'rgba(0, 0, 0, 0.08)',
    chartMuted: '#C7CDD8',
    card: 'rgba(255, 255, 255, 0.6)',
    separator: 'rgba(60, 60, 67, 0.12)',
    expenseGlass: 'rgba(255, 69, 58, 0.15)',
    incomeGlass: 'rgba(48, 209, 88, 0.15)',
    toast: 'rgba(28, 28, 30, 0.92)',
    toastText: '#FFFFFF',
  },
  dark: {
    text: '#F5F5F7',
    textSecondary: '#98989D',
    background: '#0C0C0F',
    tint: tintColorDark,
    icon: '#8E8E93',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorDark,
    expense: '#FF453A',
    income: '#30D158',
    glassFill: 'rgba(40, 40, 45, 0.65)',
    glassFillStrong: 'rgba(50, 50, 55, 0.8)',
    glassBorder: 'rgba(255, 255, 255, 0.12)',
    glassHighlight: 'rgba(255, 255, 255, 0.08)',
    shadow: 'rgba(0, 0, 0, 0.4)',
    chartMuted: '#3A3A3C',
    card: 'rgba(40, 40, 45, 0.7)',
    separator: 'rgba(84, 84, 88, 0.35)',
    expenseGlass: 'rgba(255, 69, 58, 0.2)',
    incomeGlass: 'rgba(48, 209, 88, 0.2)',
    toast: 'rgba(242, 242, 247, 0.95)',
    toastText: '#1C1C1E',
  },
};

export const Typography = {
  balance: {
    fontSize: 48,
    fontWeight: '700' as const,
    letterSpacing: -1.5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: -0.4,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  amount: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});

export type ThemeColors = typeof Colors.light;
