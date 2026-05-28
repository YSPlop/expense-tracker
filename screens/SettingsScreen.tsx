import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { GlassCard } from '@/components/glass';
import { useQuickAdd } from '@/context/QuickAddContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useSpringPress } from '@/hooks/motion/use-spring-press';

export default function SettingsScreen() {
  const router = useRouter();
  const { startQuickAdd } = useQuickAdd();
  const { colors } = useAppTheme();

  return (
    <SafeScreen>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      <GlassCard padding={Spacing.md}>
        <SettingsRow
          label="Categories"
          subtitle="Manage expense & income categories"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/categories');
          }}
        />
      </GlassCard>

      <GlassCard padding={Spacing.md}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Back Tap Quick Add</Text>
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          1) Create a Shortcut with Open URL `expensetracke://quick-add`{'\n'}
          2) Open Accessibility → Touch → Back Tap{'\n'}
          3) Assign the shortcut to Double Tap
        </Text>
        <View style={styles.quickActions}>
          <SettingsActionButton
            label="Quick Add URL"
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }}
          />
          <SettingsActionButton
            label="Test Quick Add"
            onPress={() => {
              startQuickAdd();
            }}
          />
        </View>
      </GlassCard>

      <GlassCard padding={Spacing.md}>
        <SettingsRow label="Profile" subtitle="Coming soon" disabled />
        <View style={[styles.divider, { backgroundColor: colors.separator }]} />
        <SettingsRow label="Preferences" subtitle="Coming soon" disabled />
      </GlassCard>
    </SafeScreen>
  );
}

function SettingsActionButton({ label, onPress }: { label: string; onPress: () => void }) {
  const { colors } = useAppTheme();
  const { animatedStyle, onPressIn, onPressOut, handlePress } = useSpringPress({
    onPress,
    haptic: true,
  });

  return (
    <Pressable onPress={handlePress} onPressIn={onPressIn} onPressOut={onPressOut} style={styles.actionWrap}>
      <Animated.View style={[styles.actionButton, animatedStyle, { borderColor: colors.glassBorder }]}>
        <Text style={[styles.actionText, { color: colors.text }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

function SettingsRow({
  label,
  subtitle,
  onPress,
  disabled,
}: {
  label: string;
  subtitle: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  const { animatedStyle, onPressIn, onPressOut, handlePress } = useSpringPress({
    onPress: disabled ? undefined : onPress,
    haptic: !disabled,
  });

  if (disabled) {
    return (
      <View style={[styles.row, styles.rowDisabled]}>
        <RowContent label={label} subtitle={subtitle} showChevron={false} />
      </View>
    );
  }

  return (
    <Pressable onPress={handlePress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[styles.row, animatedStyle]}>
        <RowContent label={label} subtitle={subtitle} showChevron />
      </Animated.View>
    </Pressable>
  );
}

function RowContent({
  label,
  subtitle,
  showChevron,
}: {
  label: string;
  subtitle: string;
  showChevron: boolean;
}) {
  const { colors } = useAppTheme();

  return (
    <>
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.rowSub, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>
      {showChevron && <IconSymbol name="chevron.right" size={18} color={colors.textSecondary} />}
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    ...Typography.largeTitle,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  rowDisabled: {
    opacity: 0.55,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    ...Typography.body,
    fontWeight: '600',
  },
  rowSub: {
    ...Typography.caption,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: Spacing.xs,
  },
  sectionTitle: {
    ...Typography.body,
    fontWeight: '600',
  },
  helperText: {
    ...Typography.caption,
    marginTop: Spacing.xs,
    lineHeight: 18,
  },
  quickActions: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionWrap: {
    flex: 1,
  },
  actionButton: {
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  actionText: {
    ...Typography.caption,
    fontWeight: '600',
  },
});
