import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryIcon } from '@/components/categories/CategoryIcon';
import { FrostedHeader, GlassCard } from '@/components/glass';
import { IconSymbol } from '@/components/ui/icon-symbol';
import {
  CATEGORY_COLOR_PRESETS,
  CATEGORY_ICON_PRESETS,
  UNCATEGORIZED_ID,
} from '@/constants/categories';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppStore } from '@/store/use-app-store';
import type { Category } from '@/types/category';
import type { TransactionType } from '@/types/transaction';
import { isCategoryEmojiIcon } from '@/utils/category-icon';

export default function CategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const categories = useAppStore((s) => s.categories);
  const addCategory = useAppStore((s) => s.addCategory);
  const updateCategory = useAppStore((s) => s.updateCategory);
  const deleteCategory = useAppStore((s) => s.deleteCategory);

  const [editing, setEditing] = useState<Category | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState(CATEGORY_ICON_PRESETS[0]);
  const [emojiText, setEmojiText] = useState('');
  const [color, setColor] = useState(CATEGORY_COLOR_PRESETS[0]);
  const [type, setType] = useState<TransactionType>('expense');

  const editableCategories = categories.filter((c) => c.id !== UNCATEGORIZED_ID);

  const startNew = () => {
    setIsNew(true);
    setEditing(null);
    setTitle('');
    setIcon(CATEGORY_ICON_PRESETS[0]);
    setEmojiText('');
    setColor(CATEGORY_COLOR_PRESETS[0]);
    setType('expense');
  };

  const startEdit = (category: Category) => {
    setIsNew(false);
    setEditing(category);
    setTitle(category.title);
    setIcon(category.icon);
    setEmojiText(isCategoryEmojiIcon(category.icon) ? category.icon : '');
    setColor(category.color);
    setType(category.type === 'income' ? 'income' : 'expense');
  };

  const selectPreset = (iconName: string) => {
    setIcon(iconName);
    setEmojiText('');
  };

  const handleEmojiChange = (value: string) => {
    const trimmed = value.trim();
    setEmojiText(value);
    if (trimmed) {
      const chars = [...trimmed];
      setIcon(chars[0] ?? trimmed);
    }
  };

  const handleSave = () => {
    if (!title.trim() || !icon.trim()) return;

    if (isNew) {
      addCategory({ title: title.trim(), icon, color, type });
    } else if (editing) {
      updateCategory(editing.id, { title: title.trim(), icon, color, type });
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setEditing(null);
    setIsNew(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete category', 'Transactions will move to Uncategorized.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteCategory(id);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setEditing(null);
        },
      },
    ]);
  };

  const showForm = isNew || editing !== null;
  const usingEmoji = isCategoryEmojiIcon(icon);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FrostedHeader
        title="Categories"
        left={
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={[styles.close, { color: colors.tint }]}>Done</Text>
          </Pressable>
        }
        right={
          <Pressable onPress={startNew} hitSlop={12}>
            <IconSymbol name="plus.circle.fill" size={28} color={colors.tint} />
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}>
        {showForm ? (
          <GlassCard style={styles.formCard}>
            <Text style={[styles.formTitle, { color: colors.text }]}>
              {isNew ? 'New Category' : 'Edit Category'}
            </Text>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Title"
              placeholderTextColor={colors.textSecondary}
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.glassBorder,
                  backgroundColor: colors.glassFill,
                },
              ]}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>Type</Text>
            <View style={styles.typeRow}>
              {(['expense', 'income'] as TransactionType[]).map((t) => (
                <Pressable
                  key={t}
                  style={[
                    styles.typeChip,
                    {
                      backgroundColor: type === t ? colors.glassFillStrong : colors.glassFill,
                      borderColor: type === t ? colors.tint : colors.glassBorder,
                    },
                  ]}
                  onPress={() => setType(t)}>
                  <Text style={{ color: colors.text, fontWeight: type === t ? '600' : '400' }}>
                    {t === 'expense' ? 'Expense' : 'Income'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Emoji</Text>
            <View style={styles.emojiRow}>
              <TextInput
                value={emojiText}
                onChangeText={handleEmojiChange}
                placeholder="🍕"
                placeholderTextColor={colors.textSecondary}
                style={[
                  styles.emojiInput,
                  {
                    color: colors.text,
                    borderColor: colors.glassBorder,
                    backgroundColor: colors.glassFill,
                  },
                ]}
                maxLength={4}
              />
              <View
                style={[
                  styles.iconCell,
                  {
                    backgroundColor: usingEmoji ? `${color}33` : colors.glassFill,
                    borderColor: usingEmoji ? color : colors.glassBorder,
                  },
                ]}>
                {usingEmoji ? (
                  <CategoryIcon icon={icon} size={24} color={color} />
                ) : (
                  <Text style={{ color: colors.textSecondary, fontSize: 20 }}>?</Text>
                )}
              </View>
            </View>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Icon presets</Text>
            <View style={styles.iconGrid}>
              {CATEGORY_ICON_PRESETS.map((iconName) => (
                <Pressable
                  key={iconName}
                  style={[
                    styles.iconCell,
                    {
                      backgroundColor:
                        !usingEmoji && icon === iconName ? `${color}33` : colors.glassFill,
                      borderColor:
                        !usingEmoji && icon === iconName ? color : colors.glassBorder,
                    },
                  ]}
                  onPress={() => selectPreset(iconName)}>
                  <IconSymbol name={iconName as 'fork.knife'} size={22} color={color} />
                </Pressable>
              ))}
            </View>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Color</Text>
            <View style={styles.colorRow}>
              {CATEGORY_COLOR_PRESETS.map((c) => (
                <Pressable
                  key={c}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: c, borderWidth: color === c ? 3 : 0, borderColor: colors.text },
                  ]}
                  onPress={() => setColor(c)}
                />
              ))}
            </View>

            <Pressable style={[styles.saveBtn, { backgroundColor: colors.tint }]} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Category</Text>
            </Pressable>

            {editing && (
              <Pressable onPress={() => handleDelete(editing.id)} style={styles.deleteBtn}>
                <Text style={{ color: colors.expense, fontWeight: '600' }}>Delete Category</Text>
              </Pressable>
            )}

            <Pressable onPress={() => { setEditing(null); setIsNew(false); }}>
              <Text style={[styles.cancel, { color: colors.textSecondary }]}>Cancel</Text>
            </Pressable>
          </GlassCard>
        ) : null}

        <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>EXPENSE</Text>
        {editableCategories
          .filter((c) => c.type === 'expense')
          .map((c) => (
            <CategoryListItem key={c.id} category={c} onPress={() => startEdit(c)} />
          ))}

        <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>INCOME</Text>
        {editableCategories
          .filter((c) => c.type === 'income')
          .map((c) => (
            <CategoryListItem key={c.id} category={c} onPress={() => startEdit(c)} />
          ))}
      </ScrollView>
    </View>
  );
}

function CategoryListItem({ category, onPress }: { category: Category; onPress: () => void }) {
  const { colors } = useAppTheme();

  return (
    <Pressable onPress={onPress} style={styles.listItemWrap}>
      <GlassCard padding={Spacing.md}>
        <View style={styles.listItem}>
          <View style={[styles.listIcon, { backgroundColor: `${category.color}22` }]}>
            <CategoryIcon icon={category.icon} size={22} color={category.color} />
          </View>
          <Text style={[styles.listTitle, { color: colors.text }]}>{category.title}</Text>
          <IconSymbol name="chevron.right" size={18} color={colors.textSecondary} />
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    ...Typography.sectionTitle,
  },
  close: {
    fontSize: 17,
    fontWeight: '600',
  },
  scroll: {
    padding: Spacing.lg,
    gap: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  groupLabel: {
    ...Typography.caption,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
    letterSpacing: 1,
  },
  listItemWrap: {
    marginBottom: Spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  listIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listTitle: {
    ...Typography.body,
    flex: 1,
    fontWeight: '500',
  },
  formCard: {
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  formTitle: {
    ...Typography.sectionTitle,
    fontSize: 18,
  },
  input: {
    ...Typography.body,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    ...Typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  typeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  typeChip: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  emojiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emojiInput: {
    flex: 1,
    ...Typography.body,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 24,
    textAlign: 'center',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  iconCell: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  saveBtn: {
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  deleteBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  cancel: {
    textAlign: 'center',
    ...Typography.body,
  },
});
