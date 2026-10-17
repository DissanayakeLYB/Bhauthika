import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScoreRing } from '@/components/score-ring';
import { ActionButton } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { useStudy } from '@/store/study-context';
import { colors, fonts, radius, spacing, type } from '@/theme';

export default function SummaryScreen() {
  const { result, progress, startSession } = useStudy();
  const insets = useSafeAreaInsets();

  const share = async () => {
    if (!result) return;
    try {
      await Share.share({
        message: `I scored ${result.correct}/${result.total} in a Bhauthika A/L Physics practice session. Practise smarter. Master Physics.`,
      });
    } catch {
      /* Sharing can be dismissed or unavailable; nothing to recover. */
    }
  };

  if (!result) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Icon name="insights" size={28} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No session summary yet</Text>
          <Text style={styles.emptyCopy}>Complete a practice set to see your mastery movement.</Text>
          <ActionButton
            label="Back to home"
            onPress={() => router.replace('/home')}
            style={{ alignSelf: 'stretch', marginTop: 12 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const practiced = result.topics.slice(0, 3);
  const improved = practiced.map((topic) => topic.title);
  const headlineTopics =
    improved.length > 1 ? `${improved[0]} and ${improved[1]}` : improved[0] ?? 'your topics';

  const practiseMore = () => {
    const count = startSession('all', 10);
    if (count > 0) router.replace('/session');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace('/home')}
          accessibilityRole="button"
          accessibilityLabel="Close summary"
          style={({ pressed }) => [styles.iconButton, pressed ? styles.iconPressed : null]}
        >
          <Icon name="close" size={22} color={colors.inkMuted} />
        </Pressable>
        <Text style={styles.headerTitle}>Session Complete</Text>
        <Pressable
          onPress={share}
          accessibilityRole="button"
          accessibilityLabel="Share session summary"
          style={({ pressed }) => [styles.iconButton, pressed ? styles.iconPressed : null]}
        >
          <Icon name="share" size={21} color={colors.inkMuted} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.scoreCard}>
          <ScoreRing correct={result.correct} total={result.total} />
          <Text style={styles.thanks}>Great effort, Nimal!</Text>
          <Text style={styles.thanksCopy}>
            You&apos;ve strengthened your fundamentals in {headlineTopics} today.
          </Text>
        </View>

        <View style={styles.rewardPill}>
          <Text style={styles.rewardEmoji}>⚡</Text>
          <Text style={styles.rewardText}>
            +{result.points} Mastery Points earned · {progress.streak}-day streak maintained!
          </Text>
        </View>

        <View style={styles.topicsCard}>
          <View style={styles.topicsHead}>
            <Text style={styles.topicsTitle}>Topics practiced</Text>
            <Text style={styles.topicsMeta}>Sri Lanka A/L Physics</Text>
          </View>

          <View>
            {practiced.map((topic, index) => {
              const up = topic.delta > 0;
              const flat = topic.delta === 0;
              return (
                <View
                  key={topic.topicId}
                  style={[
                    styles.topicRow,
                    index > 0 ? styles.topicRowBorder : null,
                  ]}
                >
                  <View style={styles.topicText}>
                    <Text style={styles.topicName}>{topic.title}</Text>
                    <Text style={styles.topicAccuracy}>
                      Accuracy:{' '}
                      <Text style={styles.topicAccuracyStrong}>
                        {topic.accuracy}% ({topic.correct}/{topic.total})
                      </Text>
                    </Text>
                  </View>
                  <Chip
                    label={flat ? 'No change' : `${up ? '+' : ''}${topic.delta}% Mastery`}
                    tone={flat ? 'neutral' : up ? 'green' : 'amber'}
                    icon={flat ? undefined : up ? 'arrow-upward' : 'arrow-downward'}
                  />
                </View>
              );
            })}
          </View>
        </View>

        {practiced.some((topic) => topic.delta < 0) ? (
          <Text style={styles.note}>
            Amber rows mark units where accuracy dipped — the adaptive engine will resurface them in
            your next set.
          </Text>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <ActionButton label="Practise more" icon="science" onPress={practiseMore} />
        <ActionButton
          label="Back to home"
          variant="ghost"
          onPress={() => router.replace('/home')}
          style={{ marginTop: 8 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    height: 56,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPressed: {
    backgroundColor: colors.surfaceContainer,
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: 17,
    color: colors.primary,
  },
  scroll: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: 12,
  },
  scoreCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    alignItems: 'center',
  },
  thanks: {
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 27,
    color: colors.ink,
    marginTop: 14,
  },
  thanksCopy: {
    ...type.bodyMd,
    color: colors.inkMuted,
    textAlign: 'center',
    maxWidth: 280,
    marginTop: 4,
  },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.indigoSoft,
    borderWidth: 1,
    borderColor: '#C9CCF6',
    borderRadius: radius.lg,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  rewardEmoji: {
    fontSize: 14,
  },
  rewardText: {
    fontFamily: fonts.heading,
    fontSize: 11,
    color: colors.primary,
    textAlign: 'center',
    flexShrink: 1,
  },
  topicsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  topicsHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingBottom: 8,
  },
  topicsTitle: {
    fontFamily: fonts.heading,
    fontSize: 14,
    color: colors.primary,
  },
  topicsMeta: {
    fontFamily: fonts.headingMedium,
    fontSize: 10,
    color: colors.inkFaint,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 12,
  },
  topicRowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  topicText: {
    flex: 1,
    gap: 2,
  },
  topicName: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13.5,
    color: colors.ink,
  },
  topicAccuracy: {
    fontFamily: fonts.body,
    fontSize: 11.5,
    color: colors.inkMuted,
  },
  topicAccuracyStrong: {
    fontFamily: fonts.bodySemiBold,
    color: colors.ink,
  },
  note: {
    ...type.bodySm,
    fontSize: 11.5,
    lineHeight: 17,
    color: colors.inkMuted,
    paddingHorizontal: 4,
  },
  footer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: 12,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: 6,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.indigoSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  emptyTitle: {
    ...type.headlineSm,
    color: colors.primary,
  },
  emptyCopy: {
    ...type.bodyMd,
    color: colors.inkMuted,
    textAlign: 'center',
  },
});
