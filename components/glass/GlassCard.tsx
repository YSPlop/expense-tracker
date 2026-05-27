import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

type GlassCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  padding?: number;
};

export function GlassCard({ children, style, intensity = 40, padding = Spacing.lg }: GlassCardProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View
      style={[
        styles.wrapper,
        {
          borderColor: colors.glassBorder,
          shadowColor: colors.shadow,
        },
        style,
      ]}>
      <BlurView
        intensity={intensity}
        tint={isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.glassFill }]} />
      <LinearGradient
        colors={[colors.glassHighlight, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[StyleSheet.absoluteFill, styles.highlight]}
      />
      <View style={[styles.content, { padding }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 24,
      },
      default: {
        elevation: 4,
      },
    }),
  },
  highlight: {
    opacity: 0.35,
  },
  content: {
    position: 'relative',
  },
});
