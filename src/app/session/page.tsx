'use client';

import { Fragment, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PotentiometerDiagram } from '@/components/circuit-diagram';
import { FeedbackSheet } from '@/components/feedback-sheet';
import { Formula } from '@/components/formula';
import { useStudy } from '@/components/study-provider';
import { ActionButton } from '@/components/button';
import { Chip } from '@/components/chip';
import { Icon } from '@/components/icon';
import type { Question } from '@/lib/questions';
import { TOPIC_MAP } from '@/lib/topics';
import { cn } from '@/lib/utils';

export default function SessionPage() {
  const { active } = useStudy();
  const router = useRouter();

  if (!active) {
    return (
      <main id="main" tabIndex={-1} className="grid min-h-dvh place-items-center bg-canvas px-6">
        <div className="w-full max-w-sm text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-indigo-soft text-primary">
            <Icon name="flask" size={30} />
          </span>
          <h1 className="mt-4 font-display text-headline-sm text-primary">No active session</h1>
          <p className="mt-1 text-body-md text-ink-muted">
            Start an adaptive set and your questions will appear here.
          </p>
          <ActionButton
            label="Browse practice topics"
            icon="flask"
            onClick={() => router.push('/practice')}
            className="mt-4"
          />
          <ActionButton
            label="Back to home"
            variant="ghost"
            onClick={() => router.push('/home')}
            className="mt-2"
          />
        </div>
      </main>
    );
  }

  // Keyed by question so selection, hint and sheet state reset on every step.
  return <QuestionView key={active.questions[active.index].id} />;
}

/** Renders **double-asterisk** emphasis as the design's deep-indigo bold. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <>
      {parts.map((part, index) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={index} className="font-bold text-primary-deep">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}

function QuestionView() {
  const { active, answerCurrent, goToNext, finishSession, bookmarks, toggleBookmark } = useStudy();
  const router = useRouter();
  // Restore the checked state if the tab was reloaded mid-session.
  const currentAnswer = active ? (active.answers[active.index] ?? null) : null;
  const [selected, setSelected] = useState<number | null>(currentAnswer);
  const [submitted, setSubmitted] = useState(currentAnswer !== null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);

  const closeSheet = useCallback(() => setSheetOpen(false), []);

  if (!active) return null;

  const { questions, index } = active;
  const question: Question = questions[index];
  const total = questions.length;
  const isLast = index + 1 >= total;
  const correct = selected !== null && selected === question.answer;
  const bookmarked = bookmarks.includes(question.id);
  const topic = TOPIC_MAP[question.topicId];

  const submit = () => {
    if (selected === null || submitted) return;
    answerCurrent(selected);
    setSubmitted(true);
    setSheetOpen(true);
  };

  const next = () => {
    setSheetOpen(false);
    if (isLast) {
      finishSession();
      router.replace('/summary');
      return;
    }
    goToNext();
  };

  return (
    <main id="main" tabIndex={-1} className="flex min-h-dvh flex-col bg-canvas">
      <header className="sticky top-0 z-30 border-b border-border bg-surface pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-2 px-4">
          <button
            type="button"
            onClick={() => router.push('/home')}
            aria-label="Close question and return home"
            className="-ml-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-muted transition-colors hover:bg-surface-container"
          >
            <Icon name="close" size={22} />
          </button>
          <p className="flex items-baseline gap-1 text-label-md text-ink-muted">
            <span>Question</span>
            <span className="font-display text-[18px] font-semibold text-primary">{index + 1}</span>
            <span>of {total}</span>
          </p>
          <button
            type="button"
            onClick={() => toggleBookmark(question.id)}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark question'}
            aria-pressed={bookmarked}
            className="-mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors hover:bg-surface-container"
          >
            <Icon name="flag" size={22} className={bookmarked ? 'text-amber-ink' : 'text-ink-muted'} />
          </button>
        </div>
        <div
          className="mx-auto flex w-full max-w-3xl gap-[3px] px-4 pb-2"
          role="progressbar"
          aria-label="Session progress"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={index + 1}
        >
          {Array.from({ length: total }).map((_, segment) => (
            <span
              key={segment}
              aria-hidden="true"
              className={cn(
                'h-1.5 flex-1 rounded-full',
                segment <= index ? 'bg-primary' : 'bg-surface-high',
              )}
            />
          ))}
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl flex-1 px-4 pt-4 pb-6">
        <div className="flex flex-wrap items-center gap-1.5">
          <Chip label={topic.title} tone="indigo" icon="bolt" />
          <Chip label={`${question.year} · ${question.paper} · Q.${question.number}`} />
          <Chip label="A/L Past Paper" />
        </div>

        <h1 className="mt-4 text-question font-medium text-ink">
          <RichText text={question.stem} />
        </h1>

        {question.diagram === 'potentiometer' ? (
          <PotentiometerDiagram className="mt-4" />
        ) : null}

        <fieldset disabled={submitted} className="mt-4">
          <legend className="sr-only">Choose one answer</legend>
          <div className="space-y-2.5">
            {question.options.map((option, optionIndex) => {
              const isSelected = selected === optionIndex;
              const isCorrectOption = submitted && optionIndex === question.answer;
              const isIncorrectChoice = submitted && isSelected && !isCorrectOption;
              const isMuted = submitted && !isCorrectOption && !isIncorrectChoice;

              return (
                <label
                  key={option}
                  className={cn(
                    'option-tile flex min-h-[54px] w-full items-center gap-3 rounded-tile border px-3 py-2.5 transition-colors',
                    !submitted && 'cursor-pointer',
                    isCorrectOption && 'border-green bg-green-soft ring-[1.5px] ring-green ring-inset',
                    isIncorrectChoice && 'border-red bg-red-soft ring-[1.5px] ring-red ring-inset',
                    !submitted && isSelected && 'border-primary bg-[rgba(224,224,255,0.35)] ring-2 ring-primary ring-inset',
                    !submitted && !isSelected && 'border-border-strong/45 bg-surface hover:border-primary/40',
                    isMuted && 'border-border-strong/45 bg-surface opacity-55',
                  )}
                >
                  <input
                    type="radio"
                    name={`answer-${question.id}`}
                    value={optionIndex}
                    checked={isSelected}
                    onChange={() => setSelected(optionIndex)}
                    disabled={submitted}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      'grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full border font-display text-[11px] font-semibold',
                      isCorrectOption && 'border-green bg-green text-white',
                      isIncorrectChoice && 'border-red bg-red text-white',
                      !submitted && isSelected && 'border-primary bg-primary text-white',
                      !submitted && !isSelected && 'border-border-strong/50 bg-surface-container text-ink-muted',
                      isMuted && 'border-border-strong/50 bg-surface-container text-ink-muted',
                    )}
                  >
                    {isCorrectOption ? (
                      <Icon name="check" size={18} />
                    ) : isIncorrectChoice ? (
                      <Icon name="close" size={18} />
                    ) : (
                      optionIndex + 1
                    )}
                  </span>

                  <span
                    className={cn(
                      'min-w-0 flex-1 text-body-lg font-medium text-ink',
                      !submitted && isSelected && 'font-semibold text-primary',
                    )}
                  >
                    {option}
                  </span>

                  {isCorrectOption ? (
                    <span className="shrink-0 rounded-full bg-white/75 px-1.5 py-1 text-[10px] font-semibold text-green-ink">
                      Correct
                    </span>
                  ) : isIncorrectChoice ? (
                    <span className="shrink-0 rounded-full bg-white/75 px-1.5 py-1 text-[10px] font-semibold text-red-ink">
                      Your answer
                    </span>
                  ) : (
                    <span
                      aria-hidden="true"
                      className={cn(
                        'grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full border',
                        !submitted && isSelected ? 'border-primary bg-primary' : 'border-border-strong',
                      )}
                    >
                      {!submitted && isSelected ? (
                        <span className="h-[7px] w-[7px] rounded-full bg-white" />
                      ) : null}
                    </span>
                  )}
                  <span className="sr-only">
                    {isCorrectOption ? 'Correct answer.' : isIncorrectChoice ? 'Your answer, incorrect.' : ''}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {hintOpen ? (
          <div className="mt-4 rounded-tile border border-amber/25 bg-amber-soft p-2.5">
            <p className="text-label-sm tracking-[0.06em] text-amber-ink uppercase">
              {question.steps[0].label}
            </p>
            <Formula
              latex={question.steps[0].latex}
              fallback={question.steps[0].formula}
              display={false}
              className="mt-1 text-body-md"
            />
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setHintOpen((open) => !open)}
            aria-expanded={hintOpen}
            className="inline-flex min-h-11 max-w-full items-center gap-1.5 rounded-full bg-amber-soft px-3 py-2 text-left text-label-sm font-medium text-amber-ink transition-colors hover:bg-amber-tint"
          >
            <Icon name="lightbulb" size={15} className="shrink-0" />
            {question.hint}
          </button>
          <p className="text-label-sm text-ink-muted">Single tap to select</p>
        </div>
      </div>

      <div className="sticky bottom-0 z-30 border-t border-border bg-surface px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="mx-auto w-full max-w-3xl">
          {submitted && !sheetOpen ? (
            <ActionButton
              label={isLast ? 'Finish session' : 'Next question'}
              icon="arrow-right"
              iconPosition="right"
              onClick={next}
            />
          ) : (
            <ActionButton
              label="Check answer"
              icon="arrow-right"
              iconPosition="right"
              disabled={selected === null || submitted}
              onClick={submit}
            />
          )}
          {submitted && !sheetOpen ? (
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="mt-1 flex min-h-11 w-full items-center justify-center gap-1.5 rounded-tile text-label-md text-primary transition-colors hover:bg-canvas"
            >
              <Icon name="lightbulb" size={16} />
              Review explanation
            </button>
          ) : null}
        </div>
      </div>

      <FeedbackSheet
        open={sheetOpen}
        question={question}
        correct={correct}
        bookmarked={bookmarked}
        isLast={isLast}
        onNext={next}
        onClose={closeSheet}
        onToggleBookmark={() => toggleBookmark(question.id)}
      />
    </main>
  );
}
