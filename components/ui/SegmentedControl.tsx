import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

type SegmentedControlProps<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.glassFill }]}>
      {options.map((option, index) => {
        const isSelected = option.value === value;
        return (
          <Pressable
            key={option.value}
            style={[styles.segment, isSelected && { backgroundColor: colors.glassFillStrong }]}
            onPress={() => {
              Haptics.selectionAsync();
              onChange(option.value);
            }}>
            <Text
              style={[
                styles.label,
                { color: isSelected ? colors.text : colors.textSecondary },
                isSelected && styles.labelSelected,
              ]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    padding: 3,
    gap: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  label: {
    ...Typography.caption,
    fontSize: 13,
  },
  labelSelected: {
    fontWeight: '600',
  },
});
