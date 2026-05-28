import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';

import { GlassSurface } from './GlassSurface';

type GlassCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  hero?: boolean;
  elevated?: boolean;
  shadow?: boolean;
};

export function GlassCard({
  children,
  style,
  padding = Spacing.lg,
  hero = false,
  elevated = false,
  shadow = true,
}: GlassCardProps) {
  return (
    <GlassSurface
      variant="card"
      hero={hero}
      elevated={elevated || hero}
      borderRadius={hero ? Radius.xxl : Radius.lg}
      shadow={shadow}
      style={style}
      contentStyle={{ padding }}>
      {children}
    </GlassSurface>
  );
}
