import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TabScreen } from '@/components/tab-screen';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { WeekChart } from '@/components/week-chart';
import { QUESTIONS } from '@/data/questions';
import { TOPICS } from '@/data/topics';
import { useStudy } from '@/store/study-context';
import { colors, fonts, radius, spacing, type } from '@/theme';

function reviewStatus(mastery: number) {
  if (mastery >= 80) return { label: 'Mastered', tone: 'green' as const, icon: 'check-circle' as const };
  if (mastery >= 65) return { label: 'On Track', tone: 'neutral' as const };
  if (mastery >= 55) return { label: 'In Review', tone: 'neutral' as const };
  return { label: 'Needs Focus', tone: 'amber' as const };
}

export default function ProgressScreen() {
  const { progress, startSession } = useStudy();

  const overallAccuracy = Math.round((progress.totalCorrect / Math.max(1, progress.totalPractised)) * 100);
  const sortedTopics = useMemo(
    () => [...TOPICS].sort((a, b) => progress.topics[a.id].mastery - progress.topics[b.id].mastery),
    [progress.topics],
  );
  const weakest = sortedTopics[0];
  const weakDrillCount = QUESTIONS.filter((question) => question.topicId === weakest.id).length;

  const drill = () => {
    const count = startSession([weakest.id], 10);
    if (count > 0) router.push('/session');
  };

  return (
    <TabScreen streak={progress.streak} streakLabel="short">
      <View style={styles.titleRow}>
        <Text style={styles.title}>Progress &amp; Mastery</Text>
        <View style={styles.liveChip}>
          <Text style={styles.liveText}>Live Track</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>A/L Physics 2025 · English Medium</Text>

      <View style={styles.metricGrid}>
        <View style={styles.metricCard}>
          <View style={styles.metricHead}>
            <Text style={styles.metricLabel}>Overall Accuracy</Text>
            <Icon name="verified" size={17} color={colors.primary} />
          </View>
          <Text style={styles.metricValue}>{overallAccuracy}%</Text>
          <View style={styles.metricFoot}>
            <Icon name="trending-up" size={15} color={colors.green} />
            <Text style={styles.metricDelta}>+{progress.monthlyDelta}% this month</Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricHead}>
            <Text style={styles.metricLabel}>Total Practised</Text>
            <Icon name="assignment-turned-in" size={17} color={colors.inkFaint} />
          </View>
          <Text style={styles.metricValue}>{progress.totalPractised} Qs</Text>
          <View style={styles.metricFoot}>
            <Icon name="description" size={14} color={colors.inkFaint} />
            <Text style={styles.metricPapers}>{progress.pastPapers} Past papers</Text>
          </View>
        </View>
      </View>

      <View style={styles.chartBlock}>
        <WeekChart values={progress.weekly} todayIndex={progress.todayIndex} />
      </View>

      <View style={styles.masteryHead}>
        <View style={styles.masteryHeadText}>
          <Text style={styles.sectionTitle}>Topic Mastery</Text>
          <Text style={styles.sectionSubtitle}>Weakest topics prioritized</Text>
        </View>
        <Chip label="Needs attention first" tone="amber" icon="tune" />
      </View>

      <View style={styles.masteryList}>
        {sortedTopics.map((topic) => {
          const { mastery, solved } = progress.topics[topic.id];
          const status = reviewStatus(mastery);
          const tone = mastery < 55 ? colors.amber : mastery >= 80 ? colors.green : colors.primary;
          return (
            <Pressable
              key={topic.id}
              onPress={() => {
                const count = startSession([topic.id], 10);
                if (count > 0) router.push('/session');
              }}
              style={({ pressed }) => [styles.masteryCard, pressed ? styles.masteryPressed : null]}
            >
              <View style={styles.masteryTop}>
                <View style={styles.masteryTitles}>
                  <Text style={styles.unitLabel}>{topic.unitLabel.toUpperCase()}</Text>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                </View>
                <Chip
                  label={status.label}
                  tone={status.tone}
                  icon={'icon' in status ? status.icon : undefined}
                />
              </View>
              <View style={styles.masteryStats}>
                <Text style={styles.solvedText}>{solved} Questions solved</Text>
                <Text style={[styles.masteryPercent, { color: tone }]}>{mastery}% Mastery</Text>
              </View>
              <ProgressBar value={mastery} color={tone} height={8} />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.recommendation}>
        <View style={styles.recGlow} pointerEvents="none" />
        <View style={styles.recBody}>
          <View style={styles.recCopy}>
            <Text style={styles.recEyebrow}>AI STUDY RECOMMENDATION</Text>
            <Text style={styles.recTitle}>Boost {weakest.title}</Text>
            <Text style={styles.recText}>
              {weakDrillCount} target questions on this unit are ready in your drill bank.
            </Text>
          </View>
          <Pressable
            onPress={drill}
            accessibilityRole="button"
            style={({ pressed }) => [styles.drillButton, pressed ? styles.drillPressed : null]}
          >
            <Text style={styles.drillLabel}>Drill Topic</Text>
          </Pressable>
        </View>
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    gap: 8,
  },
  title: {
    flex: 1,
    fontFamily: fonts.heading,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.5,
    color: colors.primary,
  },
  liveChip: {
    backgroundColor: 'rgba(225,224,255,0.6)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  liveText: {
    fontFamily: fonts.heading,
    fontSize: 10.5,
    color: colors.primary,
  },
  subtitle: {
    ...type.bodySm,
    fontFamily: fonts.bodyMedium,
    marginTop: 2,
    marginBottom: 14,
  },
  metricGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    minHeight: 116,
    justifyContent: 'space-between',
  },
  metricHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  metricLabel: {
    fontFamily: fonts.headingMedium,
    fontSize: 10.5,
    color: colors.inkMuted,
    flexShrink: 1,
  },
  metricValue: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: -0.6,
    color: colors.primary,
    marginTop: 6,
  },
  metricFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  metricDelta: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 10,
    color: colors.green,
  },
  metricPapers: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.inkMuted,
  },
  chartBlock: {
    marginTop: spacing.md,
  },
  masteryHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    gap: 8,
  },
  masteryHeadText: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 26,
    color: colors.ink,
  },
  sectionSubtitle: {
    ...type.bodySm,
  },
  masteryList: {
    gap: 10,
  },
  masteryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 10,
  },
  masteryPressed: {
    borderColor: 'rgba(32,37,107,0.3)',
  },
  masteryTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  masteryTitles: {
    flex: 1,
    gap: 1,
  },
  unitLabel: {
    fontFamily: fonts.headingMedium,
    fontSize: 9.5,
    letterSpacing: 0.7,
    color: colors.inkFaint,
  },
  topicTitle: {
    fontFamily: fonts.heading,
    fontSize: 15,
    lineHeight: 21,
    color: colors.ink,
  },
  masteryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  solvedText: {
    fontFamily: fonts.body,
    fontSize: 11.5,
    color: colors.inkMuted,
  },
  masteryPercent: {
    fontFamily: fonts.heading,
    fontSize: 12,
  },
  recommendation: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: 16,
    overflow: 'hidden',
  },
  recGlow: {
    position: 'absolute',
    right: -24,
    bottom: -24,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  recBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recCopy: {
    flex: 1,
    gap: 2,
  },
  recEyebrow: {
    fontFamily: fonts.heading,
    fontSize: 9,
    letterSpacing: 0.7,
    color: '#DCDEFF',
  },
  recTitle: {
    fontFamily: fonts.heading,
    fontSize: 15,
    color: colors.surface,
  },
  recText: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  drillButton: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  drillPressed: {
    backgroundColor: '#EDF0FF',
  },
  drillLabel: {
    fontFamily: fonts.heading,
    fontSize: 10.5,
    color: colors.primary,
  },
});
