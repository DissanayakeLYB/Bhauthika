import React from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Question } from '@/data/questions';
import { ActionButton } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { colors, fonts, radius, sheetShadow, spacing, type } from '@/theme';

interface FeedbackSheetProps {
  visible: boolean;
  question: Question;
  selected: number;
  correct: boolean;
  bookmarked: boolean;
  isLast: boolean;
  onNext: () => void;
  onToggleBookmark: () => void;
}

const monoFont = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'ui-monospace, SFMono-Regular, Menlo, monospace',
});

export function FeedbackSheet({
  visible,
  question,
  selected,
  correct,
  bookmarked,
  isLast,
  onNext,
  onToggleBookmark,
}: FeedbackSheetProps) {
  const statusColor = correct ? colors.green : colors.red;
  const statusSoft = correct ? colors.greenSoft : colors.redSoft;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => {}}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={[styles.banner, { backgroundColor: statusSoft, borderColor: `${statusColor}66` }]}>
              <View style={[styles.bannerIcon, { backgroundColor: statusColor }]}>
                <Icon name={correct ? 'check' : 'close'} size={20} color={colors.surface} />
              </View>
              <View style={styles.bannerText}>
                <Text style={[styles.bannerTitle, { color: statusColor }]}>
                  {correct ? 'Correct answer' : 'Not quite'}
                </Text>
                <Text style={styles.bannerSubtitle}>
                  {correct ? 'The correct answer is ' : 'The correct answer is '}
                  <Text style={styles.bannerStrong}>
                    ({question.answer + 1}) {question.options[question.answer]}
                  </Text>
                </Text>
              </View>
            </View>

            <View style={styles.whyCard}>
              <View style={styles.whyHeader}>
                <Icon name="lightbulb" size={19} color={colors.indigoMid} />
                <Text style={styles.whyTitle}>Why?</Text>
              </View>

              {question.steps.map((step, index) => {
                const isFinal = index === question.steps.length - 1;
                return (
                  <View
                    key={step.label}
                    style={[styles.step, isFinal ? styles.stepFinal : null]}
                  >
                    <Text style={[styles.stepLabel, isFinal ? styles.stepLabelFinal : null]}>
                      {step.label.toUpperCase()}
                    </Text>
                    <Text style={styles.stepFormula}>{step.formula}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.actions}>
              <ActionButton
                label={isLast ? 'Finish session' : 'Next question'}
                icon="arrow-forward"
                iconPosition="right"
                onPress={onNext}
              />
              <Pressable
                onPress={onToggleBookmark}
                accessibilityRole="button"
                accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Mark for review'}
                style={({ pressed }) => [styles.bookmark, pressed ? styles.bookmarkPressed : null]}
              >
                <Icon
                  name={bookmarked ? 'bookmark' : 'bookmark-border'}
                  size={18}
                  color={bookmarked ? colors.primary : colors.inkMuted}
                />
                <Text
                  style={[styles.bookmarkLabel, bookmarked ? styles.bookmarkLabelActive : null]}
                >
                  {bookmarked ? 'Marked for review' : 'Mark for review'}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(27,30,40,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '82%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderTopWidth: 1,
    borderColor: 'rgba(199,197,210,0.2)',
    ...sheetShadow,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginTop: 10,
    marginBottom: 8,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: 12,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 14,
  },
  bannerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  bannerText: {
    flex: 1,
    gap: 2,
  },
  bannerTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 24,
  },
  bannerSubtitle: {
    ...type.bodyMd,
    color: colors.inkMuted,
  },
  bannerStrong: {
    fontFamily: fonts.bodyBold,
    color: colors.ink,
  },
  whyCard: {
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 8,
  },
  whyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  whyTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 24,
    color: colors.ink,
  },
  step: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 10,
    gap: 3,
  },
  stepFinal: {
    backgroundColor: colors.greenSoft,
    borderColor: 'rgba(46,158,107,0.3)',
  },
  stepLabel: {
    fontFamily: fonts.headingMedium,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.7,
    color: colors.inkMuted,
  },
  stepLabelFinal: {
    color: colors.green,
  },
  stepFormula: {
    fontFamily: monoFont,
    fontSize: 12.5,
    lineHeight: 19,
    color: colors.ink,
  },
  actions: {
    gap: 4,
    paddingTop: 4,
  },
  bookmark: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  bookmarkPressed: {
    opacity: 0.6,
  },
  bookmarkLabel: {
    ...type.labelMd,
    fontFamily: fonts.bodyMedium,
    color: colors.inkMuted,
  },
  bookmarkLabelActive: {
    color: colors.primary,
  },
});
