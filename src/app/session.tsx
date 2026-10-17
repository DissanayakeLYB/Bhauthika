import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { PotentiometerDiagram } from '@/components/circuit-diagram';
import { FeedbackSheet } from '@/components/feedback-sheet';
import { RichText } from '@/components/rich-text';
import { ActionButton } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { TOPIC_MAP } from '@/data/topics';
import { useStudy, type ActiveSession } from '@/store/study-context';
import { colors, fonts, radius, spacing, type } from '@/theme';
import { tapFeedback } from '@/utils/haptics';

type OptionState = 'default' | 'selected' | 'correct' | 'incorrect' | 'muted';

function OptionTile({
  index,
  label,
  state,
  onPress,
}: {
  index: number;
  label: string;
  state: OptionState;
  onPress: () => void;
}) {
  const isSelected = state === 'selected';
  const isCorrect = state === 'correct';
  const isIncorrect = state === 'incorrect';

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected, checked: isSelected }}
      disabled={state === 'muted' || isCorrect || isIncorrect}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        isSelected ? styles.optionSelected : null,
        isCorrect ? styles.optionCorrect : null,
        isIncorrect ? styles.optionIncorrect : null,
        state === 'muted' ? styles.optionMuted : null,
        pressed && state === 'default' ? styles.optionPressed : null,
      ]}
    >
      <View style={styles.optionLeft}>
        <View
          style={[
            styles.badge,
            isSelected ? styles.badgeSelected : null,
            isCorrect ? styles.badgeCorrect : null,
            isIncorrect ? styles.badgeIncorrect : null,
          ]}
        >
          {isCorrect || isIncorrect ? (
            <Icon name={isCorrect ? 'check' : 'close'} size={18} color={colors.surface} />
          ) : (
            <Text
              style={[
                styles.badgeText,
                isSelected ? styles.badgeTextSelected : null,
              ]}
            >
              ({index + 1})
            </Text>
          )}
        </View>
        <Text
          style={[
            styles.optionLabel,
            isSelected ? styles.optionLabelSelected : null,
          ]}
        >
          {label}
        </Text>
      </View>

      {isCorrect ? (
        <Text style={styles.correctChip}>Correct</Text>
      ) : isIncorrect ? (
        <Text style={styles.incorrectChip}>Your answer</Text>
      ) : (
        <View
          style={[
            styles.radio,
            isSelected ? styles.radioSelected : null,
          ]}
        >
          {isSelected ? <View style={styles.radioDot} /> : null}
        </View>
      )}
    </Pressable>
  );
}

export default function SessionScreen() {
  const { active, startSession } = useStudy();

  if (!active) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIcon}>
            <Icon name="science" size={30} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No active session</Text>
          <Text style={styles.emptyCopy}>
            Start an adaptive set and your questions will appear here.
          </Text>
          <ActionButton
            label="Start a 10-question set"
            icon="play-arrow"
            onPress={() => startSession('all', 10)}
            style={{ alignSelf: 'stretch', marginTop: 12 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Keyed by question so selection, sheet and hint state reset on each step.
  return <QuestionView key={active.questions[active.index].id} session={active} />;
}

function QuestionView({ session }: { session: ActiveSession }) {
  const { answerCurrent, advance, completeSession, bookmarks, toggleBookmark } = useStudy();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);

  const index = session.index;
  const question = session.questions[index];
  const total = session.questions.length;

  const correct = useMemo(() => {
    if (selected === null) return false;
    return question.answer === selected;
  }, [question, selected]);

  const topic = TOPIC_MAP[question.topicId];
  const bookmarked = bookmarks.includes(question.id);
  const isLast = index + 1 >= total;

  const submit = () => {
    if (selected === null || submitted) return;
    answerCurrent(selected);
    setSubmitted(true);
    setSheetVisible(true);
    tapFeedback();
  };

  const next = () => {
    setSheetVisible(false);
    if (isLast) {
      completeSession();
      router.replace('/summary');
      return;
    }
    advance();
  };

  const close = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel="Close question"
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed ? styles.iconPressed : null]}
        >
          <Icon name="close" size={22} color={colors.inkMuted} />
        </Pressable>
        <View style={styles.counter}>
          <Text style={styles.counterLabel}>Question</Text>
          <Text style={styles.counterCurrent}>{index + 1}</Text>
          <Text style={styles.counterTotal}>of {total}</Text>
        </View>
        <Pressable
          onPress={() => toggleBookmark(question.id)}
          accessibilityRole="button"
          accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Bookmark question'}
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed ? styles.iconPressed : null]}
        >
          <Icon
            name="flag"
            size={22}
            color={bookmarked ? colors.amberDeep : colors.inkMuted}
          />
        </Pressable>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${((index + 1) / total) * 100}%` },
          ]}
        />
        {Array.from({ length: total - 1 }).map((_, divider) => (
          <View
            key={divider}
            style={[
              styles.progressDivider,
              { left: `${((divider + 1) / total) * 100}%` },
            ]}
          />
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.chipRow}>
          <Chip label={topic.title} tone="indigo" icon="bolt" />
          <Chip label={`${question.year} · ${question.paper} · Q.${question.number}`} />
          <Chip label="A/L Past Paper" />
        </View>

        <RichText
          text={question.stem}
          style={styles.stem}
          boldStyle={styles.stemBold}
        />

        {question.diagram === 'potentiometer' ? <PotentiometerDiagram /> : null}

        <View style={styles.options}>
          {question.options.map((option, optionIndex) => {
            let state: OptionState = 'default';
            if (submitted) {
              if (optionIndex === question.answer) state = 'correct';
              else if (optionIndex === selected) state = 'incorrect';
              else state = 'muted';
            } else if (optionIndex === selected) {
              state = 'selected';
            }
            return (
              <OptionTile
                key={option}
                index={optionIndex}
                label={option}
                state={state}
                onPress={() => {
                  setSelected(optionIndex);
                  tapFeedback();
                }}
              />
            );
          })}
        </View>

        {hintOpen ? (
          <View style={styles.hintPanel}>
            <Text style={styles.hintPanelLabel}>{question.steps[0].label.toUpperCase()}</Text>
            <Text style={styles.hintPanelFormula}>{question.steps[0].formula}</Text>
          </View>
        ) : null}

        <View style={styles.hintRow}>
          <Pressable
            onPress={() => setHintOpen((open) => !open)}
            accessibilityRole="button"
            style={({ pressed }) => [styles.hintPill, pressed ? styles.hintPressed : null]}
          >
            <Icon name="lightbulb" size={15} color={colors.amberDeep} />
            <Text style={styles.hintText}>{question.hint}</Text>
          </Pressable>
          <View style={styles.tapHint}>
            <Icon name="touch-app" size={14} color={colors.inkFaint} />
            <Text style={styles.tapHintText}>Single tap to select</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <ActionButton
          label={submitted ? 'Answer checked' : 'Check answer'}
          icon="arrow-forward"
          iconPosition="right"
          disabled={selected === null || submitted}
          onPress={submit}
        />
      </View>

      <FeedbackSheet
        visible={sheetVisible}
        question={question}
        selected={selected ?? 0}
        correct={correct}
        bookmarked={bookmarked}
        isLast={isLast}
        onNext={next}
        onToggleBookmark={() => toggleBookmark(question.id)}
      />
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
    backgroundColor: colors.surface,
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
  counter: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  counterLabel: {
    ...type.labelMd,
    color: colors.inkMuted,
  },
  counterCurrent: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: colors.primary,
  },
  counterTotal: {
    ...type.labelMd,
    color: colors.inkFaint,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.surfaceHigh,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: colors.primary,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  progressDivider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1.5,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  scroll: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  stem: {
    ...type.questionText,
  },
  stemBold: {
    fontFamily: fonts.bodyBold,
    color: colors.primaryDeep,
  },
  options: {
    gap: 10,
  },
  option: {
    minHeight: 54,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(199,197,210,0.45)',
    backgroundColor: colors.surface,
    paddingHorizontal: 13,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    shadowColor: colors.ink,
    shadowOpacity: 0.02,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  optionPressed: {
    borderColor: 'rgba(32,37,107,0.45)',
  },
  optionSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'rgba(224,224,255,0.35)',
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  optionCorrect: {
    borderWidth: 1.5,
    borderColor: colors.green,
    backgroundColor: colors.greenSoft,
  },
  optionIncorrect: {
    borderWidth: 1.5,
    borderColor: colors.red,
    backgroundColor: colors.redSoft,
  },
  optionMuted: {
    opacity: 0.55,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    flex: 1,
  },
  badge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: 'rgba(199,197,210,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  badgeCorrect: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  badgeIncorrect: {
    backgroundColor: colors.red,
    borderColor: colors.red,
  },
  badgeText: {
    fontFamily: fonts.headingMedium,
    fontSize: 11,
    color: colors.inkMuted,
  },
  badgeTextSelected: {
    color: colors.surface,
  },
  optionLabel: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 23,
    color: colors.ink,
  },
  optionLabelSelected: {
    fontFamily: fonts.bodySemiBold,
    color: colors.primary,
  },
  radio: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  radioDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.surface,
  },
  correctChip: {
    fontFamily: fonts.heading,
    fontSize: 10,
    color: colors.green,
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  incorrectChip: {
    fontFamily: fonts.heading,
    fontSize: 10,
    color: colors.red,
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  hintPanel: {
    backgroundColor: colors.amberSoft,
    borderWidth: 1,
    borderColor: 'rgba(245,165,36,0.25)',
    borderRadius: radius.md,
    padding: 10,
    gap: 3,
  },
  hintPanelLabel: {
    fontFamily: fonts.headingMedium,
    fontSize: 9.5,
    letterSpacing: 0.6,
    color: colors.amberDeep,
  },
  hintPanelFormula: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.ink,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
  hintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.amberSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  hintPressed: {
    opacity: 0.75,
  },
  hintText: {
    fontFamily: fonts.headingMedium,
    fontSize: 10.5,
    color: colors.amberDeep,
  },
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tapHintText: {
    fontFamily: fonts.headingMedium,
    fontSize: 10,
    color: colors.inkFaint,
  },
  footer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: 12,
    shadowColor: colors.ink,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  emptyWrap: {
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
