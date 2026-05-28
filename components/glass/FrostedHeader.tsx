import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

import { GlassSurface } from './GlassSurface';

type FrostedHeaderProps = {
  title: string;
  left?: ReactNode;
  right?: ReactNode;
};

export function FrostedHeader({ title, left, right }: FrostedHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  return (
    <GlassSurface variant="header" borderRadius={0} shadow={false} style={styles.surface}>
      <View style={[styles.row, { paddingTop: insets.top + Spacing.sm }]}>
        <View style={styles.side}>{left}</View>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        <View style={[styles.side, styles.right]}>{right}</View>
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  surface: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    minHeight: 44,
  },
  side: {
    minWidth: 72,
    alignItems: 'flex-start',
  },
  right: {
    alignItems: 'flex-end',
  },
  title: {
    ...Typography.sectionTitle,
    flex: 1,
    textAlign: 'center',
  },
});
