import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    <Animated.View
      entering={FadeInDown.springify().damping(18)}
      exiting={FadeOutDown.duration(200)}
      style={[styles.container, { bottom: insets.bottom + Spacing.lg }]}>
      <View style={[styles.toast, { backgroundColor: colors.toast }]}>
        <Text style={[styles.message, { color: colors.toastText }]}>{message}</Text>
        {onAction && (
          <Pressable onPress={onAction} hitSlop={8}>
            <Text style={[styles.action, { color: colors.tint }]}>{actionLabel}</Text>
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 100,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
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
