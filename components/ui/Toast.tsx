import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassSurface } from '@/components/glass/GlassSurface';
import { DOCK_EXTRA_BOTTOM } from '@/constants/layout';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

type ToastProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  visible: boolean;
};

export function Toast({ message, actionLabel = 'Undo', onAction, visible }: ToastProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  if (!visible) return null;

  return (
    <View style={[styles.container, { bottom: insets.bottom + DOCK_EXTRA_BOTTOM }]}>
      <GlassSurface variant="modal" borderRadius={Radius.md} elevated style={styles.toastSurface}>
        <View style={styles.toastInner}>
          <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
          {onAction && (
            <Pressable onPress={onAction} hitSlop={8}>
              <Text style={[styles.action, { color: colors.tint }]}>{actionLabel}</Text>
            </Pressable>
          )}
        </View>
      </GlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 100,
  },
  toastSurface: {
    overflow: 'hidden',
  },
  toastInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  message: {
    ...Typography.body,
    flex: 1,
  },
  action: {
    ...Typography.body,
    fontWeight: '600',
  },
});
