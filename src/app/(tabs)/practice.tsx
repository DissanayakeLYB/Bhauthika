import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { TabScreen } from '@/components/tab-screen';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { TOPICS, masteryStatus, type Topic } from '@/data/topics';
import { useStudy } from '@/store/study-context';
import { colors, fonts, radius, spacing, type } from '@/theme';

type Mode = 'topic' | 'mix';

const statusLabel = {
  mastered: { label: 'Mastered', tone: 'green' as const },
  strong: { label: 'Strong', tone: 'green' as const },
  focus: { label: 'Needs focus', tone: 'amber' as const },
};

export default function PracticeScreen() {
  const { progress, startSession } = useStudy();
  const [mode, setMode] = useState<Mode>('topic');
  const [query, setQuery] = useState('');

  const averageMastery = useMemo(() => {
    const total = TOPICS.reduce((sum, topic) => sum + progress.topics[topic.id].mastery, 0);
    return Math.round(total / TOPICS.length);
  }, [progress.topics]);

  const weakTopics = useMemo(
    () =>
      [...TOPICS]
        .sort((a, b) => progress.topics[a.id].mastery - progress.topics[b.id].mastery)
        .slice(0, 3),
    [progress.topics],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return TOPICS;
    return TOPICS.filter(
      (topic) =>
        topic.title.toLowerCase().includes(needle) ||
        topic.unitLabel.toLowerCase().includes(needle),
    );
  }, [query]);

  const beginTopic = (topic: Topic) => {
    const count = startSession([topic.id], 10);
    if (count > 0) router.push('/session');
  };

  const beginMix = () => {
    const count = startSession(
      weakTopics.map((topic) => topic.id),
      10,
    );
    if (count > 0) router.push('/session');
  };

  return (
    <TabScreen streak={progress.streak} streakLabel="compact">
      <View style={styles.titleRow}>
        <Text style={styles.title}>Practice</Text>
        <Chip label="MCQ Unit-Bank" />
      </View>
      <Text style={styles.subtitle}>Sri Lankan A/L Physics Syllabus</Text>

      <View style={styles.segmented}>
        <Pressable
          onPress={() => setMode('mix')}
          style={[styles.segment, mode === 'mix' ? styles.segmentActive : null]}
          accessibilityRole="tab"
          accessibilityState={{ selected: mode === 'mix' }}
        >
          <Text style={[styles.segmentLabel, mode === 'mix' ? styles.segmentLabelActive : null]}>
            Smart mix
          </Text>
          <View style={styles.recPill}>
            <Text style={styles.recText}>REC</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => setMode('topic')}
          style={[styles.segment, mode === 'topic' ? styles.segmentActive : null]}
          accessibilityRole="tab"
          accessibilityState={{ selected: mode === 'topic' }}
        >
          <Text style={[styles.segmentLabel, mode === 'topic' ? styles.segmentLabelActive : null]}>
            Choose topic
          </Text>
          {mode === 'topic' ? <View style={styles.activeDot} /> : null}
        </Pressable>
      </View>

      {mode === 'topic' ? (
        <>
          <View style={styles.searchWrap}>
            <Icon name="search" size={19} color={colors.inkFaint} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search physics topics or concepts..."
              placeholderTextColor={colors.inkFaint}
              style={styles.searchInput}
              returnKeyType="search"
              accessibilityLabel="Search physics topics"
            />
            {query.length > 0 ? (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <Icon name="close" size={16} color={colors.inkFaint} />
              </Pressable>
            ) : null}
          </View>

          <View style={styles.statsBanner}>
            <View style={styles.statsLeft}>
              <Icon name="verified" size={17} color={colors.indigoMid} />
              <Text style={styles.statsLabel}>{TOPICS.length} Syllabus Units</Text>
            </View>
            <Text style={styles.statsValue}>Average Mastery: {averageMastery}%</Text>
          </View>

          <View style={styles.topicList}>
            {filtered.map((topic) => {
              const mastery = progress.topics[topic.id].mastery;
              const status = masteryStatus(mastery);
              const barColor = mastery >= 78 ? colors.green : mastery < 50 ? colors.amber : colors.primary;
              return (
                <Pressable
                  key={topic.id}
                  onPress={() => beginTopic(topic)}
                  accessibilityRole="button"
                  accessibilityLabel={`Practise ${topic.title}, ${mastery}% mastery`}
                  style={({ pressed }) => [styles.topicCard, pressed ? styles.topicPressed : null]}
                >
                  <View style={styles.topicHead}>
                    <View style={styles.topicTitleWrap}>
                      <View style={styles.numberBadge}>
                        <Text style={styles.numberText}>{topic.number}</Text>
                      </View>
                      <Text style={styles.topicTitle}>{topic.title}</Text>
                    </View>
                    <View style={styles.topicChips}>
                      {status ? (
                        <Chip
                          label={statusLabel[status].label}
                          tone={statusLabel[status].tone}
                          icon={status === 'mastered' ? 'check-circle' : undefined}
                        />
                      ) : null}
                      <Chip label={`${topic.questionCount} Qs`} />
                    </View>
                  </View>
                  <View style={styles.masteryRow}>
                    <Text style={styles.masteryLabel}>Topic Mastery</Text>
                    <Text
                      style={[
                        styles.masteryValue,
                        mastery >= 78
                          ? { color: colors.green }
                          : mastery < 50
                            ? { color: colors.amberDeep }
                            : { color: colors.primary },
                      ]}
                    >
                      {mastery}%
                    </Text>
                  </View>
                  <ProgressBar value={mastery} color={barColor} height={6} />
                </Pressable>
              );
            })}
            {filtered.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="search" size={26} color={colors.inkFaint} />
                <Text style={styles.emptyTitle}>No matching topics</Text>
                <Text style={styles.emptyCopy}>Try “current”, “waves” or “field”.</Text>
              </View>
            ) : null}
          </View>
        </>
      ) : (
        <View style={styles.mixWrap}>
          <View style={styles.mixCard}>
            <Chip label="SMART MIX · RECOMMENDED" tone="indigo" icon="auto-awesome" uppercase />
            <Text style={styles.mixTitle}>Your three weakest units</Text>
            <Text style={styles.mixCopy}>
              A balanced 10-question set drawn from the units where your recent accuracy dropped.
            </Text>
            <View style={styles.mixChips}>
              {weakTopics.map((topic) => (
                <View key={topic.id} style={styles.mixTopic}>
                  <Text style={styles.mixTopicTitle}>{topic.title}</Text>
                  <Text style={styles.mixTopicMeta}>
                    {progress.topics[topic.id].mastery}% mastery
                  </Text>
                </View>
              ))}
            </View>
            <Pressable
              onPress={beginMix}
              accessibilityRole="button"
              style={({ pressed }) => [styles.mixButton, pressed ? styles.mixPressed : null]}
            >
              <Text style={styles.mixButtonLabel}>Start Smart Mix</Text>
              <Icon name="arrow-forward" size={18} color={colors.surface} />
            </Pressable>
          </View>

          <View style={styles.statsBanner}>
            <View style={styles.statsLeft}>
              <Icon name="verified" size={17} color={colors.indigoMid} />
              <Text style={styles.statsLabel}>{TOPICS.length} Syllabus Units</Text>
            </View>
            <Text style={styles.statsValue}>Average Mastery: {averageMastery}%</Text>
          </View>

          <Text style={styles.browseHint}>
            Or switch to <Text style={styles.browseStrong}>Choose topic</Text> to drill a single unit.
          </Text>
        </View>
      )}
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: -0.5,
    color: colors.primary,
  },
  subtitle: {
    ...type.bodySm,
    marginTop: 2,
    marginBottom: 14,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.md,
    padding: 4,
    gap: 4,
    marginBottom: 12,
  },
  segment: {
    flex: 1,
    height: 36,
    borderRadius: radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  segmentActive: {
    backgroundColor: colors.surface,
    shadowColor: colors.ink,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  segmentLabel: {
    fontFamily: fonts.headingMedium,
    fontSize: 11.5,
    color: colors.inkMuted,
  },
  segmentLabelActive: {
    fontFamily: fonts.heading,
    color: colors.primary,
  },
  recPill: {
    backgroundColor: colors.amberSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  recText: {
    fontFamily: fonts.heading,
    fontSize: 8.5,
    letterSpacing: 0.4,
    color: colors.amberDeep,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(199,197,210,0.5)',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    minHeight: 42,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink,
    paddingVertical: 10,
  },
  statsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceLow,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 12,
    gap: 8,
  },
  statsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  statsLabel: {
    fontFamily: fonts.headingMedium,
    fontSize: 10.5,
    color: colors.inkMuted,
  },
  statsValue: {
    fontFamily: fonts.heading,
    fontSize: 10.5,
    color: colors.primary,
  },
  topicList: {
    gap: 10,
  },
  topicCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 8,
    minHeight: 56,
    justifyContent: 'center',
  },
  topicPressed: {
    backgroundColor: '#FDFDFF',
    borderColor: 'rgba(32,37,107,0.3)',
  },
  topicHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  topicTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontFamily: fonts.heading,
    fontSize: 10,
    color: colors.inkMuted,
  },
  topicTitle: {
    flex: 1,
    fontFamily: fonts.heading,
    fontSize: 15,
    lineHeight: 20,
    color: colors.ink,
  },
  topicChips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 0,
  },
  masteryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  masteryLabel: {
    ...type.labelSm,
    fontSize: 10,
    color: colors.inkFaint,
  },
  masteryValue: {
    fontFamily: fonts.heading,
    fontSize: 10.5,
  },
  emptyState: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 32,
  },
  emptyTitle: {
    ...type.headlineSm,
    fontSize: 15,
    color: colors.ink,
  },
  emptyCopy: {
    ...type.bodySm,
  },
  mixWrap: {
    gap: 12,
  },
  mixCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 10,
  },
  mixTitle: {
    ...type.headlineSm,
    fontSize: 19,
    color: colors.ink,
  },
  mixCopy: {
    ...type.bodySm,
    lineHeight: 19,
  },
  mixChips: {
    gap: 6,
    marginTop: 2,
  },
  mixTopic: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.canvas,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  mixTopicTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12.5,
    color: colors.ink,
  },
  mixTopicMeta: {
    fontFamily: fonts.headingMedium,
    fontSize: 10.5,
    color: colors.amberDeep,
  },
  mixButton: {
    marginTop: 4,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mixPressed: {
    backgroundColor: colors.primaryPressed,
  },
  mixButtonLabel: {
    fontFamily: fonts.heading,
    fontSize: 14,
    color: colors.surface,
  },
  browseHint: {
    ...type.bodySm,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  browseStrong: {
    fontFamily: fonts.bodySemiBold,
    color: colors.primary,
  },
});
