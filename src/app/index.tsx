import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleIcon } from '@/components/brand/google-icon';
import { LogoMark } from '@/components/brand/logo';
import { Icon, type IconName } from '@/components/ui/icon';
import { colors, fonts, radius, spacing, type } from '@/theme';

const FEATURES: { icon: IconName; title: string; subtitle: string; tone: 'indigo' | 'soft' | 'amber' }[] =
  [
    {
      icon: 'auto-awesome',
      title: 'Adaptive Question Engine',
      subtitle: 'Calibrated to your weak syllabus units',
      tone: 'indigo',
    },
    {
      icon: 'menu-book',
      title: 'Sri Lankan A/L Past Papers',
      subtitle: 'English medium curated derivations & MCQs',
      tone: 'soft',
    },
    {
      icon: 'insights',
      title: 'Topic Mastery Analytics',
      subtitle: 'Real-time island percentile ranking insights',
      tone: 'amber',
    },
  ];

export default function WelcomeScreen() {
  const enterApp = () => router.replace('/home');

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.glowTop} pointerEvents="none" />
      <View style={styles.glowLeft} pointerEvents="none" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.header}>
          <View style={styles.examPill}>
            <View style={styles.liveDot} />
            <Text style={styles.examText}>G.C.E. A/L 2025/2026</Text>
          </View>
          <View style={styles.subjectPill}>
            <Icon name="science" size={15} color={colors.primary} />
            <Text style={styles.subjectText}>Physics</Text>
          </View>
        </View>

        <View style={styles.brandBlock}>
          <View style={styles.logoFrame}>
            <LogoMark size={64} />
          </View>
          <Text style={styles.title}>Bhauthika</Text>
          <Text style={styles.tagline}>Practise smarter. Master Physics.</Text>

          <View style={styles.features}>
            {FEATURES.map((feature) => (
              <View key={feature.title} style={styles.featureRow}>
                <View
                  style={[
                    styles.featureIcon,
                    feature.tone === 'indigo'
                      ? styles.featureIconIndigo
                      : feature.tone === 'soft'
                        ? styles.featureIconSoft
                        : styles.featureIconAmber,
                  ]}
                >
                  <Icon
                    name={feature.icon}
                    size={18}
                    color={
                      feature.tone === 'indigo'
                        ? colors.primary
                        : feature.tone === 'soft'
                          ? colors.indigoMid
                          : colors.amber
                    }
                  />
                </View>
                <View style={styles.featureCopy}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            onPress={enterApp}
            style={({ pressed }) => [styles.googleButton, pressed ? styles.pressed : null]}
          >
            <GoogleIcon size={20} />
            <Text style={styles.googleLabel}>Continue with Google</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={enterApp}
            style={({ pressed }) => [styles.emailButton, pressed ? styles.emailPressed : null]}
          >
            <Icon name="mail" size={20} color={colors.surface} />
            <Text style={styles.emailLabel}>Continue with email</Text>
          </Pressable>

          <View style={styles.createRow}>
            <Text style={styles.createText}>New here?</Text>
            <Pressable
              onPress={() =>
                Alert.alert(
                  'Account creation',
                  'This demo build signs you straight into a sample student profile (Nimal) so you can explore the practice flow.',
                  [{ text: 'Got it' }],
                )
              }
            >
              <Text style={styles.createLink}>Create account</Text>
            </Pressable>
          </View>

          <Text style={styles.footnote}>Curated for the National NIE Physics Syllabus</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  glowTop: {
    position: 'absolute',
    top: -120,
    right: -100,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(224, 224, 255, 0.5)',
  },
  glowLeft: {
    position: 'absolute',
    top: '45%',
    left: -140,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(225, 224, 255, 0.35)',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  examPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  examText: {
    ...type.labelSm,
    color: colors.inkMuted,
    letterSpacing: 0.7,
  },
  subjectPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(236, 237, 251, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  subjectText: {
    ...type.labelSm,
    fontFamily: fonts.heading,
    color: colors.primary,
  },
  brandBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoFrame: {
    width: 84,
    height: 84,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(199, 197, 210, 0.45)',
    shadowColor: colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 38,
    letterSpacing: -0.9,
    color: colors.primary,
    marginTop: 14,
  },
  tagline: {
    ...type.bodyMd,
    fontFamily: fonts.bodyMedium,
    color: colors.inkMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  features: {
    marginTop: spacing.lg,
    width: '100%',
    maxWidth: 330,
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(199, 197, 210, 0.5)',
    borderRadius: radius.lg,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIconIndigo: {
    backgroundColor: '#E0E0FF',
  },
  featureIconSoft: {
    backgroundColor: colors.indigoSoft,
  },
  featureIconAmber: {
    backgroundColor: colors.amberSoft,
  },
  featureCopy: {
    flex: 1,
    gap: 1,
  },
  featureTitle: {
    fontFamily: fonts.heading,
    fontSize: 12,
    lineHeight: 17,
    color: colors.primary,
  },
  featureSubtitle: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    color: colors.inkMuted,
  },
  footer: {
    gap: 8,
  },
  googleButton: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    shadowColor: colors.ink,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  pressed: {
    backgroundColor: colors.canvas,
  },
  googleLabel: {
    ...type.bodyMd,
    fontFamily: fonts.bodySemiBold,
    color: colors.ink,
  },
  emailButton: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  emailPressed: {
    backgroundColor: colors.primaryDeep,
  },
  emailLabel: {
    ...type.bodyMd,
    fontFamily: fonts.bodySemiBold,
    color: colors.surface,
  },
  createRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    paddingTop: 4,
  },
  createText: {
    ...type.bodySm,
    color: colors.inkFaint,
  },
  createLink: {
    ...type.bodySm,
    fontFamily: fonts.bodySemiBold,
    color: colors.primary,
    textDecorationLine: 'underline',
    textDecorationColor: colors.primary,
  },
  footnote: {
    fontFamily: fonts.headingMedium,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.3,
    color: colors.inkFaint,
    textAlign: 'center',
    paddingBottom: 2,
  },
});
