import { StyleSheet, Text, View } from 'react-native';

import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { AppIconName } from '@/types/icons';
import { GlassCard } from '@/components/glass/GlassCard';

type EmptyStateProps = {
  title: string;
  message: string;
  icon?: AppIconName;
};

export function EmptyState({
  title,
  message,
  icon = 'tray',
}: EmptyStateProps) {
  const { colors } = useAppTheme();

  return (
    <GlassCard padding={Spacing.xl}>
      <View style={styles.content}>
        <IconSymbol name={icon} size={40} color={colors.textSecondary} />
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  title: {
    ...Typography.sectionTitle,
    fontSize: 17,
    marginTop: Spacing.sm,
  },
  message: {
    ...Typography.body,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
});
