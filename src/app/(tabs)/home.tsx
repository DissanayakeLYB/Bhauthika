import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TabScreen } from '@/components/tab-screen';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { FOCUS_TOPICS } from '@/data/topics';
import { useStudy } from '@/store/study-context';
import { colors, fonts, radius, spacing, type } from '@/theme';

function greetingForHour(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const { progress, startSession } = useStudy();
  const accuracy =
    progress.answeredToday === 0
      ? 0
      : Math.round((progress.correctToday / progress.answeredToday) * 100);
  const remaining = Math.max(0, progress.dailyTarget - progress.answeredToday);
  const greeting = greetingForHour(new Date().getHours());

  const beginAdaptive = () => {
    const count = startSession('all', 10);
    if (count > 0) router.push('/session');
  };

  const beginFocus = (topicId: (typeof FOCUS_TOPICS)[number]['topicId']) => {
    const count = startSession([topicId], 10);
    if (count > 0) router.push('/session');
  };

  return (
    <TabScreen streak={progress.streak} streakLabel="days">
      <View style={styles.greetingRow}>
        <View style={styles.greetingText}>
          <View style={styles.eyebrowRow}>
            <Text style={styles.eyebrow}>A/L PHYSICS 2025</Text>
            <View style={styles.eyebrowDot} />
            <Text style={styles.eyebrow}>ENG MEDIUM</Text>
          </View>
          <Text style={styles.greeting}>
            {greeting}, Nimal
          </Text>
        </View>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>N</Text>
          </View>
          <View style={styles.avatarStatus} />
        </View>
      </View>

      <LinearGradient
        colors={['#3B3F9E', '#20256B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroRing} pointerEvents="none" />
        <View style={styles.heroRingSmall} pointerEvents="none" />
        <View style={styles.heroTopRow}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>ADAPTIVE FOCUS</Text>
          </View>
          <View style={styles.heroTime}>
            <Icon name="schedule" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.heroTimeText}>~15 mins</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Practise your weak topics</Text>
        <Text style={styles.heroSubtitle}>
          Targeting Current Electricity &amp; Mechanics based on your recent errors.
        </Text>

        <View style={styles.heroActions}>
          <Pressable
            accessibilityRole="button"
            onPress={beginAdaptive}
            style={({ pressed }) => [styles.startButton, pressed ? styles.startPressed : null]}
          >
            <Text style={styles.startLabel}>Start</Text>
            <Icon name="play-arrow" size={18} color={colors.primary} />
          </Pressable>
          <View style={styles.questionCount}>
            <Text style={styles.questionCountText}>10 questions</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Today&apos;s progress</Text>
          <Text style={styles.sectionMeta}>Daily Target: {progress.dailyTarget} Qs</Text>
        </View>

        <View style={styles.statGrid}>
          <View style={styles.statCard}>
            <View style={styles.statHead}>
              <Text style={styles.statLabel}>ANSWERED</Text>
              <Icon name="check-circle" size={18} color={colors.indigoMid} />
            </View>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>{progress.answeredToday}</Text>
              <Text style={styles.statTarget}>/ {progress.dailyTarget}</Text>
            </View>
            <Text style={styles.statCaption}>{remaining} questions left</Text>
            <ProgressBar
              value={(progress.answeredToday / progress.dailyTarget) * 100}
              color={colors.primary}
              height={8}
              style={{ marginTop: 'auto' }}
            />
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHead}>
              <Text style={styles.statLabel}>ACCURACY</Text>
              <Icon name="insights" size={18} color={colors.green} />
            </View>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>{accuracy}%</Text>
            </View>
            <View style={styles.deltaRow}>
              <Icon name="trending-up" size={14} color={colors.green} />
              <Text style={styles.deltaText}>+4% vs yesterday</Text>
            </View>
            <ProgressBar
              value={accuracy}
              color={colors.green}
              height={8}
              style={{ marginTop: 'auto' }}
            />
          </View>
        </View>
      </View>

      <View style={[styles.section, styles.attentionSection]}>
        <View style={styles.attentionHead}>
          <View style={{ flex: 1 }}>
            <View style={styles.attentionTitleRow}>
              <Icon name="warning" size={17} color={colors.amberDeep} />
              <Text style={styles.sectionTitle}>Needs attention</Text>
            </View>
            <Text style={styles.attentionSubtitle}>High-yield topics with low accuracy</Text>
          </View>
          <Pressable onPress={() => router.push('/practice')} hitSlop={8}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        <View style={styles.focusList}>
          {FOCUS_TOPICS.map((topic) => (
            <Pressable
              key={topic.title}
              accessibilityRole="button"
              accessibilityLabel={`Practise ${topic.title}`}
              onPress={() => beginFocus(topic.topicId)}
              style={({ pressed }) => [styles.focusCard, pressed ? styles.focusPressed : null]}
            >
              <View style={styles.focusAccent} />
              <View style={styles.focusBody}>
                <View style={styles.focusMain}>
                  <Text style={styles.focusTitle}>{topic.title}</Text>
                  <View style={styles.focusChips}>
                    <Chip label={`Accuracy ${topic.accuracy}%`} tone="amber" />
                    <Text style={styles.focusUnit}>{topic.unitLabel}</Text>
                  </View>
                </View>
                <View style={styles.focusRight}>
                  <View style={styles.focusDue}>
                    <Text style={styles.dueText}>{topic.due} due</Text>
                    <Text style={styles.dueTag}>{topic.tag.toUpperCase()}</Text>
                  </View>
                  <View style={styles.chevron}>
                    <Icon name="chevron-right" size={18} color={colors.primary} />
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable
        onPress={() => router.push('/practice')}
        style={({ pressed }) => [styles.examBanner, pressed ? styles.examPressed : null]}
      >
        <View style={styles.examLeft}>
          <View style={styles.examIcon}>
            <Icon name="event" size={18} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.examTitle}>G.C.E. A/L Examination</Text>
            <Text style={styles.examSubtitle}>Target exam scheduled in 118 days</Text>
          </View>
        </View>
        <View style={styles.revisePill}>
          <Text style={styles.reviseText}>Revise Fast</Text>
        </View>
      </Pressable>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 16,
  },
  greetingText: {
    flex: 1,
    gap: 2,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eyebrow: {
    fontFamily: fonts.headingMedium,
    fontSize: 11,
    letterSpacing: 0.7,
    color: colors.inkMuted,
  },
  eyebrowDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
  },
  greeting: {
    fontFamily: fonts.heading,
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.3,
    color: colors.ink,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  avatarLetter: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: colors.surface,
  },
  avatarStatus: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: colors.canvas,
  },
  hero: {
    borderRadius: radius.lg,
    padding: 20,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  heroRing: {
    position: 'absolute',
    right: -24,
    bottom: -32,
    width: 176,
    height: 176,
    borderRadius: 88,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  heroRingSmall: {
    position: 'absolute',
    right: 48,
    top: 16,
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  heroBadgeText: {
    fontFamily: fonts.headingMedium,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.8,
    color: colors.surface,
  },
  heroTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroTimeText: {
    fontFamily: fonts.headingMedium,
    fontSize: 10.5,
    color: 'rgba(255,255,255,0.8)',
  },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.3,
    color: colors.surface,
    marginTop: 12,
  },
  heroSubtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 18,
  },
  startButton: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startPressed: {
    backgroundColor: '#EDF0FF',
  },
  startLabel: {
    fontFamily: fonts.heading,
    fontSize: 15,
    color: colors.primary,
  },
  questionCount: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionCountText: {
    fontFamily: fonts.headingMedium,
    fontSize: 11.5,
    color: colors.surface,
  },
  section: {
    marginTop: spacing.lg,
    gap: 12,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: -0.2,
    color: colors.ink,
  },
  sectionMeta: {
    fontFamily: fonts.headingMedium,
    fontSize: 11,
    color: colors.indigoMid,
  },
  statGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minHeight: 150,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    justifyContent: 'space-between',
  },
  statHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: fonts.headingMedium,
    fontSize: 10.5,
    letterSpacing: 0.7,
    color: colors.inkMuted,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 10,
  },
  statValue: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 40,
    color: colors.ink,
  },
  statTarget: {
    fontFamily: fonts.headingMedium,
    fontSize: 17,
    color: colors.inkFaint,
  },
  statCaption: {
    fontFamily: fonts.headingMedium,
    fontSize: 10.5,
    color: colors.inkMuted,
    marginTop: 2,
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  deltaText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 10.5,
    color: colors.green,
  },
  attentionSection: {
    marginTop: spacing.lg,
  },
  attentionHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  attentionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  attentionSubtitle: {
    ...type.bodySm,
    marginTop: 2,
  },
  seeAll: {
    fontFamily: fonts.heading,
    fontSize: 11,
    color: colors.primary,
    paddingVertical: 4,
  },
  focusList: {
    gap: 10,
  },
  focusCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  focusPressed: {
    opacity: 0.85,
  },
  focusAccent: {
    width: 4,
    backgroundColor: colors.amber,
  },
  focusBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  focusMain: {
    flex: 1,
    gap: 6,
  },
  focusTitle: {
    fontFamily: fonts.heading,
    fontSize: 15,
    lineHeight: 21,
    color: colors.ink,
  },
  focusChips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  focusUnit: {
    fontFamily: fonts.headingMedium,
    fontSize: 10.5,
    color: colors.inkFaint,
  },
  focusRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  focusDue: {
    alignItems: 'flex-end',
  },
  dueText: {
    fontFamily: fonts.heading,
    fontSize: 11.5,
    color: colors.amberDeep,
  },
  dueTag: {
    fontFamily: fonts.headingMedium,
    fontSize: 8.5,
    letterSpacing: 0.5,
    color: colors.inkFaint,
    marginTop: 1,
  },
  chevron: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  examBanner: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    backgroundColor: colors.surfaceLow,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
  },
  examPressed: {
    opacity: 0.8,
  },
  examLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  examIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(32,37,107,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  examTitle: {
    fontFamily: fonts.heading,
    fontSize: 11,
    color: colors.primary,
  },
  examSubtitle: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    color: colors.inkMuted,
  },
  revisePill: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  reviseText: {
    fontFamily: fonts.heading,
    fontSize: 10.5,
    color: colors.primary,
  },
});
