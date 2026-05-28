import { StyleSheet, Text } from 'react-native';

import { AnalyticsSection } from '@/components/charts/AnalyticsSection';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

export default function ChartsScreen() {
  const { colors } = useAppTheme();

  return (
    <SafeScreen>
      <Text style={[styles.title, { color: colors.text }]}>Insights</Text>
      <AnalyticsSection />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...Typography.largeTitle,
  },
});
