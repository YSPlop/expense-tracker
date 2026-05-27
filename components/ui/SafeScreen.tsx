import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackgroundGradients, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

type SafeScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
};

export function SafeScreen({ children, scroll = true, contentStyle }: SafeScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors, scheme } = useAppTheme();

  const content = (
    <View
      style={[
        styles.content,
        { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.xl },
        contentStyle,
      ]}>
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
          keyboardShouldPersistTaps="handled">
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
