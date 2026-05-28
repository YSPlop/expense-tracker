import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DOCK_EXTRA_BOTTOM } from '@/constants/layout';
import { BackgroundGradients, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

type SafeScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
  /** Rendered above scroll content (e.g. hero balance). Avoid layout animations on this node when it contains blur. */
  header?: ReactNode;
};

export function SafeScreen({
  children,
  scroll = true,
  contentStyle,
  header,
}: SafeScreenProps) {
  const insets = useSafeAreaInsets();
  const { scheme } = useAppTheme();

  const paddingTop = insets.top + Spacing.md;
  const paddingBottom = insets.bottom + DOCK_EXTRA_BOTTOM;

  const content = (
    <View style={[styles.content, { paddingTop, paddingBottom }, contentStyle]}>
      {header}
      {children}
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[...BackgroundGradients[scheme]]}
        style={StyleSheet.absoluteFill}
      />
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          decelerationRate="fast">
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
  },
});
