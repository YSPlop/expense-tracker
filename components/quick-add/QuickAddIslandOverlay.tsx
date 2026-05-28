import * as Haptics from 'expo-haptics';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryIcon } from '@/components/categories/CategoryIcon';
import { GlassSurface } from '@/components/glass';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppStore } from '@/store/use-app-store';
import type { QuickAddSession } from '@/types/quick-add';
import { QUICK_ADD_PRESET_AMOUNTS } from '@/types/quick-add';
import type { TransactionType } from '@/types/transaction';
import { formatMoney } from '@/utils/money';

type Props = {
  session: QuickAddSession;
  onChooseType: (type: TransactionType) => void;
  onChooseAmount: (amount: number) => void;
  onChooseCategory: (categoryId: string) => void;
  onBack: () => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export function QuickAddIslandOverlay({
  session,
  onChooseType,
  onChooseAmount,
  onChooseCategory,
  onBack,
  onCancel,
  onConfirm,
}: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const allCategories = useAppStore((s) => s.categories);
  const categories = useMemo(() => {
    if (!session.type) return [];
    return allCategories.filter((c) => c.type === session.type || c.type === 'both');
  }, [allCategories, session.type]);

  if (!session.isActive) return null;

  return (
    <View pointerEvents="box-none" style={styles.root}>
      <View style={[styles.wrap, { top: insets.top + Spacing.sm }]}>
        <GlassSurface variant="modal" borderRadius={Radius.full} elevated style={styles.surface}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: colors.text }]}>Quick Add</Text>
            <View style={styles.actions}>
              <OverlayIconButton icon="chevron.right" rotated onPress={onBack} disabled={session.step === 'type'} />
              <OverlayIconButton icon="xmark" onPress={onCancel} />
            </View>
          </View>

          {session.step === 'type' && (
            <View style={styles.typeRow}>
              <TypeButton label="Income" tint={colors.income} onPress={() => onChooseType('income')} />
              <TypeButton label="Expense" tint={colors.expense} onPress={() => onChooseType('expense')} />
            </View>
          )}

          {session.step === 'amount' && (
            <View style={styles.stepBody}>
              <Text style={[styles.stepLabel, { color: colors.textSecondary }]}>Pick an amount</Text>
              <View style={styles.amountRow}>
                {QUICK_ADD_PRESET_AMOUNTS.map((amount) => (
                  <Pressable
                    key={amount}
                    onPress={() => onChooseAmount(amount)}
                    style={({ pressed }) => [
                      styles.chip,
                      {
                        borderColor: colors.glassBorder,
                        backgroundColor: pressed ? colors.glassFillStrong : colors.glassFill,
                      },
                    ]}>
                    <Text style={[styles.chipText, { color: colors.text }]}>{formatMoney(amount)}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {session.step === 'category' && (
            <View style={styles.stepBody}>
              <Text style={[styles.stepLabel, { color: colors.textSecondary }]}>Choose a category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
                {categories.map((category) => (
                  <Pressable
                    key={category.id}
                    onPress={() => onChooseCategory(category.id)}
                    style={({ pressed }) => [
                      styles.categoryChip,
                      {
                        borderColor: colors.glassBorder,
                        backgroundColor: pressed ? colors.glassFillStrong : colors.glassFill,
                      },
                    ]}>
                    <CategoryIcon icon={category.icon} color={category.color} size={18} />
                    <Text style={[styles.categoryText, { color: colors.text }]}>{category.title}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {session.step === 'confirm' && (
            <View style={styles.stepBody}>
              <Text style={[styles.confirmText, { color: colors.text }]}>
                {session.type === 'income' ? 'Income' : 'Expense'} {formatMoney(session.amount)}
              </Text>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  onConfirm();
                }}
                style={[styles.confirmButton, { backgroundColor: session.type === 'income' ? colors.income : colors.expense }]}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </Pressable>
            </View>
          )}
        </GlassSurface>
      </View>
    </View>
  );
}

function TypeButton({ label, tint, onPress }: { label: string; tint: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.typeButton, { opacity: pressed ? 0.75 : 1, borderColor: tint }]}>
      <Text style={[styles.typeLabel, { color: tint }]}>{label}</Text>
    </Pressable>
  );
}

function OverlayIconButton({
  icon,
  onPress,
  disabled,
  rotated,
}: {
  icon: 'chevron.right' | 'xmark';
  onPress: () => void;
  disabled?: boolean;
  rotated?: boolean;
}) {
  const { colors } = useAppTheme();
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [{ opacity: disabled ? 0.25 : pressed ? 0.6 : 1 }]}>
      <IconSymbol
        name={icon}
        size={18}
        color={colors.textSecondary}
        style={rotated ? { transform: [{ rotate: '180deg' }] } : undefined}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
  },
  wrap: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
  },
  surface: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  title: {
    ...Typography.body,
    fontWeight: '600',
  },
  typeRow: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  typeButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Radius.full,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  typeLabel: {
    ...Typography.body,
    fontWeight: '600',
  },
  stepBody: {
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  stepLabel: {
    ...Typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  amountRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  chipText: {
    ...Typography.body,
  },
  categoryRow: {
    gap: Spacing.sm,
    paddingRight: Spacing.md,
  },
  categoryChip: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  categoryText: {
    ...Typography.caption,
  },
  confirmText: {
    ...Typography.sectionTitle,
  },
  confirmButton: {
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  confirmButtonText: {
    ...Typography.body,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
