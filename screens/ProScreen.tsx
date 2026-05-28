import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/glass';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

export default function ProScreen() {
  const { colors } = useAppTheme();

  return (
    <SafeScreen>
      <Text style={[styles.title, { color: colors.text }]}>Pro</Text>

      <GlassCard hero elevated style={styles.hero} padding={Spacing.xl}>
        <View style={styles.iconGlow}>
          <LinearGradient
            colors={[`${colors.tint}40`, `${colors.tint}08`]}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.iconWrap, { backgroundColor: `${colors.tint}18` }]}>
            <IconSymbol name="star.fill" size={36} color={colors.tint} />
          </View>
        </View>
        <Text style={[styles.heroTitle, { color: colors.text }]}>Pro — Coming soon</Text>
        <Text style={[styles.heroBody, { color: colors.textSecondary }]}>
          Unlock advanced insights, exports, and cloud sync. Paid plans will connect to Stripe in a
          future update.
        </Text>
        <View style={[styles.cta, { borderColor: colors.glassBorder }]}>
          <Text style={[styles.ctaText, { color: colors.textSecondary }]}>Upgrade (soon)</Text>
        </View>
      </GlassCard>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...Typography.largeTitle,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconGlow: {
    width: 80,
    height: 80,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    ...Typography.sectionTitle,
    textAlign: 'center',
  },
  heroBody: {
    ...Typography.body,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
  },
  cta: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  ctaText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
