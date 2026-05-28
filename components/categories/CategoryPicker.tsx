import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CategoryIcon } from '@/components/categories/CategoryIcon';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { Category } from '@/types/category';
import type { TransactionType } from '@/types/transaction';

type CategoryPickerProps = {
  type: TransactionType;
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function CategoryPicker({ type, categories, selectedId, onSelect }: CategoryPickerProps) {
  const { colors } = useAppTheme();
  const router = useRouter();

  const filtered = categories.filter((c) => c.type === type || c.type === 'both');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
        <Pressable
          onPress={() => router.push('/categories')}
          hitSlop={12}
          style={[
            styles.manageBtn,
            {
              backgroundColor: colors.glassFillStrong,
              borderColor: colors.glassBorder,
            },
          ]}>
          <Text style={[styles.manageText, { color: colors.tint }]}>Manage</Text>
          <IconSymbol name="chevron.right" size={12} color={colors.tint} />
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {filtered.map((category) => {
          const selected = category.id === selectedId;
          return (
            <Pressable
              key={category.id}
              style={[
                styles.chip,
                {
                  backgroundColor: selected ? `${category.color}33` : colors.glassFill,
                  borderColor: selected ? category.color : colors.glassBorder,
                },
              ]}
              onPress={() => onSelect(category.id)}>
              <CategoryIcon icon={category.icon} size={18} color={category.color} />
              <Text style={[styles.chipLabel, { color: colors.text }]}>{category.title}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    ...Typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: StyleSheet.hairlineWidth,
  },
  manageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scroll: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipLabel: {
    ...Typography.caption,
    fontWeight: '500',
  },
});
