import { Platform } from 'react-native';

const tintColorLight = '#007AFF';
const tintColorDark = '#5E9EFF';

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const Radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
  full: 999,
} as const;

export const GlassIntensity = {
  card: 40,
  dock: 50,
  modal: 60,
  input: 35,
  header: 45,
} as const;

export const BackgroundGradients = {
  light: ['#E8ECF4', '#D8DEE8', '#E4E9F2'] as const,
  dark: ['#141418', '#0A0A0C', '#0C0C10'] as const,
};

const elevationLight = {
  sm: { offset: { width: 0, height: 4 }, opacity: 0.06, radius: 12 },
  md: { offset: { width: 0, height: 8 }, opacity: 0.1, radius: 20 },
  lg: { offset: { width: 0, height: 12 }, opacity: 0.14, radius: 28 },
} as const;

const elevationDark = {
  sm: { offset: { width: 0, height: 4 }, opacity: 0.25, radius: 12 },
  md: { offset: { width: 0, height: 8 }, opacity: 0.35, radius: 20 },
  lg: { offset: { width: 0, height: 12 }, opacity: 0.45, radius: 28 },
} as const;

export const Colors = {
  light: {
    text: '#1C1C1E',
    textSecondary: '#6B7280',
    background: '#E4E9F2',
    tint: tintColorLight,
    accentMuted: '#5A6A85',
    icon: '#8E8E93',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorLight,
    expense: '#FF453A',
    income: '#30D158',
    glassFill: 'rgba(255, 255, 255, 0.52)',
    glassFillStrong: 'rgba(255, 255, 255, 0.7)',
    glassBorder: 'rgba(255, 255, 255, 0.6)',
    glassHighlight: 'rgba(255, 255, 255, 0.85)',
    glassSpecular: 'rgba(255, 255, 255, 0.35)',
    glassEdgeLight: 'rgba(255, 255, 255, 0.95)',
    tabBubbleFill: 'rgba(255, 255, 255, 0.94)',
    tabBubbleBorder: 'rgba(255, 255, 255, 0.85)',
    surfaceElevated: 'rgba(255, 255, 255, 0.75)',
    shadow: 'rgba(0, 0, 0, 0.08)',
    chartMuted: '#C5CBD6',
    chartGlass: 'rgba(255, 255, 255, 0.35)',
    card: 'rgba(255, 255, 255, 0.58)',
    separator: 'rgba(60, 60, 67, 0.12)',
    expenseGlass: 'rgba(255, 69, 58, 0.12)',
    incomeGlass: 'rgba(48, 209, 88, 0.12)',
    scrim: 'rgba(0, 0, 0, 0.25)',
    toast: 'rgba(28, 28, 30, 0.88)',
    toastText: '#FFFFFF',
    elevation: elevationLight,
  },
  dark: {
    text: '#F5F5F7',
    textSecondary: '#98989D',
    background: '#0A0A0C',
    tint: tintColorDark,
    accentMuted: '#6E7A94',
    icon: '#8E8E93',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorDark,
    expense: '#FF453A',
    income: '#30D158',
    glassFill: 'rgba(38, 38, 42, 0.62)',
    glassFillStrong: 'rgba(48, 48, 52, 0.82)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    glassHighlight: 'rgba(255, 255, 255, 0.06)',
    glassSpecular: 'rgba(255, 255, 255, 0.04)',
    glassEdgeLight: 'rgba(255, 255, 255, 0.15)',
    tabBubbleFill: 'rgba(72, 72, 78, 0.96)',
    tabBubbleBorder: 'rgba(255, 255, 255, 0.22)',
    surfaceElevated: 'rgba(44, 44, 48, 0.85)',
    shadow: 'rgba(0, 0, 0, 0.5)',
    chartMuted: '#3A3A3E',
    chartGlass: 'rgba(255, 255, 255, 0.04)',
    card: 'rgba(38, 38, 42, 0.72)',
    separator: 'rgba(84, 84, 88, 0.32)',
    expenseGlass: 'rgba(255, 69, 58, 0.18)',
    incomeGlass: 'rgba(48, 209, 88, 0.18)',
    scrim: 'rgba(0, 0, 0, 0.45)',
    toast: 'rgba(242, 242, 247, 0.92)',
    toastText: '#1C1C1E',
    elevation: elevationDark,
  },
};

export const Typography = {
  display: {
    fontSize: 52,
    fontWeight: '700' as const,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.8,
  },
  balance: {
    fontSize: 48,
    fontWeight: '700' as const,
    letterSpacing: -1.5,
    fontVariant: ['tabular-nums'],
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
  footnote: {
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.2,
  },
  amount: {
    fontSize: 17,
    fontWeight: '600' as const,
    fontVariant: ['tabular-nums'],
  },
  monoAmount: {
    fontSize: 15,
    fontWeight: '600' as const,
    fontVariant: ['tabular-nums'],
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
