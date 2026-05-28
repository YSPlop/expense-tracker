import { forwardRef, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

import { GlassSurface } from './GlassSurface';

type GlassInputProps = TextInputProps & {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export const GlassInput = forwardRef<TextInput, GlassInputProps>(function GlassInput(
  { label, containerStyle, style, onFocus, onBlur, ...props },
  ref
) {
  const { colors } = useAppTheme();
  const [focused, setFocused] = useState(false);

  const handleFocus = (e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      )}
      <GlassSurface variant="input" borderRadius={Radius.md} shadow={false}>
        <View
          style={[
            styles.focusRing,
            {
              borderColor: focused ? colors.tint : colors.glassBorder,
              opacity: focused ? 1 : 0.35,
            },
          ]}
        />
        <TextInput
          ref={ref}
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.text }, style]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </GlassSurface>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.xs,
  },
  label: {
    ...Typography.caption,
    marginLeft: Spacing.xs,
  },
  focusRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    pointerEvents: 'none',
  },
  input: {
    ...Typography.body,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 48,
  },
});
