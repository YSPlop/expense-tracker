import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Platform, StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { GlassIntensity, Radius, ThemeColors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

export type GlassVariant = 'card' | 'dock' | 'modal' | 'input' | 'header';

/** Native blur is opt-in — BlurView + Reanimated on the same screen crashes on iOS at launch. */
export const GLASS_BLUR_ENABLED = true;

type GlassSurfaceProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  variant?: GlassVariant;
  intensity?: number;
  elevated?: boolean;
  hero?: boolean;
  borderRadius?: number;
  shadow?: boolean;
  overflow?: 'hidden' | 'visible';
};

function getElevationStyle(colors: ThemeColors, elevated: boolean): ViewStyle {
  const level = elevated ? colors.elevation.lg : colors.elevation.md;
  return Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: level.offset,
      shadowOpacity: level.opacity,
      shadowRadius: level.radius,
    },
    default: { elevation: elevated ? 6 : 4 },
  });
}

export function GlassSurface({
  children,
  style,
  contentStyle,
  variant = 'card',
  elevated = false,
  hero = false,
  borderRadius = Radius.lg,
  shadow = true,
  overflow = 'hidden',
}: GlassSurfaceProps) {
  const { colors } = useAppTheme();
  const fillColor =
    variant === 'dock' || variant === 'modal' ? colors.glassFillStrong : colors.glassFill;
  const elevationStyle = shadow ? getElevationStyle(colors as ThemeColors, elevated || hero) : undefined;

  return (
    <View
      style={[
        styles.wrapper,
        { borderRadius, borderColor: colors.glassBorder, overflow },
        elevationStyle,
        style,
      ]}>
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: fillColor, borderRadius },
        ]}
      />
      <LinearGradient
        colors={[colors.glassHighlight, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.4, y: 0.8 }}
        style={[StyleSheet.absoluteFill, styles.highlight, { borderRadius }]}
      />
      {hero && (
        <LinearGradient
          colors={[colors.glassSpecular, 'transparent']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.6 }}
          style={[StyleSheet.absoluteFill, styles.specular, { borderRadius }]}
        />
      )}
      <View
        style={[
          styles.edgeLight,
          {
            borderRadius,
            borderTopColor: colors.glassEdgeLight,
          },
        ]}
        pointerEvents="none"
      />
      {children != null && (
        <View style={[styles.content, contentStyle]}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: StyleSheet.hairlineWidth,
    position: 'relative',
  },
  highlight: {
    opacity: 0.4,
  },
  specular: {
    opacity: 0.5,
  },
  edgeLight: {
    ...StyleSheet.absoluteFillObject,
    borderTopWidth: StyleSheet.hairlineWidth,
    opacity: 0.35,
  },
  content: {
    position: 'relative',
  },
});
