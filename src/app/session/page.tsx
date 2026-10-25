'use client';

import { Fragment, useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PotentiometerDiagram } from '@/components/circuit-diagram';
import { FeedbackSheet } from '@/components/feedback-sheet';
import { Formula } from '@/components/formula';
import { useStudy } from '@/components/study-provider';
import { ActionButton } from '@/components/button';
import { ProgressBar } from '@/components/progress-bar';
import { Label } from '@/components/type';
import type { Question } from '@/lib/questions';
import { TOPIC_MAP } from '@/lib/topics';
import { cn } from '@/lib/utils';

const pad = (value: number) => String(value).padStart(2, '0');

export default function SessionPage() {
  const { active } = useStudy();
  const router = useRouter();

  if (!active) {
    return (
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-narrow px-5 py-20 sm:px-8">
        <Label className="text-muted">Practice</Label>
        <h1 className="mt-6 text-title font-medium text-ink">No set in progress.</h1>
        <p className="mt-6 text-body text-muted">
          Choose a unit and a set size, then your questions appear here.
        </p>
        <div className="mt-10 space-y-4">
          <ActionButton label="Choose a unit" onClick={() => router.push('/practice')} />
          <ActionButton label="Back to home" variant="text" onClick={() => router.push('/home')} />
        </div>
      </main>
    );
  }

  // Keyed by question so selection, hint and sheet state reset on every step.
  return <QuestionView key={active.questions[active.index].id} />;
}

/** Renders **double-asterisk** emphasis as ink weight inside the stem. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <>
      {parts.map((part, index) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={index} className="font-medium text-ink">
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
    <main id="main" tabIndex={-1} className="min-h-dvh">
      <div className="mx-auto w-full max-w-narrow px-5 pb-40 sm:px-8">
        <header className="flex items-baseline justify-between gap-4 py-5">
          <Link
            href="/home"
            className="font-mono text-label tracking-[0.14em] text-muted uppercase transition-colors hover:text-ink"
          >
            Close
          </Link>
          <div className="flex items-baseline gap-6">
            <button
              type="button"
              onClick={() => toggleBookmark(question.id)}
              aria-pressed={bookmarked}
              className="font-mono text-label tracking-[0.14em] text-muted uppercase transition-colors hover:text-ink"
            >
              {bookmarked ? 'Marked' : 'Mark'}
            </button>
            <p className="font-mono text-meta text-muted tabular-nums">
              <span className="text-ink">{pad(index + 1)}</span> / {pad(total)}
            </p>
          </div>
        </header>

        <ProgressBar
          value={((index + 1) / total) * 100}
          label={`Question ${index + 1} of ${total}`}
        />

        <section className="pt-10">
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-label tracking-[0.14em] text-muted uppercase">
            <span>{topic.title}</span>
            <span aria-hidden="true">·</span>
            <span>
              {question.year} {question.paper}
            </span>
          </p>

          <p className="mt-8 font-mono text-numeral text-ink tabular-nums">{question.number}</p>

          {question.questionImageUrl ? (
            // Optional image question: the image replaces the written stem.
            <img
              src={question.questionImageUrl}
              alt={`Question ${question.number}, ${question.year} ${question.paper}`}
              className="mt-8 w-full rounded-xs border border-line"
            />
          ) : (
            <p className="mt-6 max-w-[62ch] text-question text-ink">
              <RichText text={question.stem} />
            </p>
          )}

          {question.diagram === 'potentiometer' ? (
            <PotentiometerDiagram className="mt-8" />
          ) : null}

          <fieldset disabled={submitted} className="mt-12 border-b border-line">
            <legend className="sr-only">Choose one answer</legend>
            {question.options.map((option, optionIndex) => {
              const isSelected = selected === optionIndex;
              const isCorrectOption = submitted && optionIndex === question.answer;
              const isIncorrectChoice = submitted && isSelected && !isCorrectOption;

              return (
                <label
                  key={option}
                  className={cn(
                    'choice-row relative flex w-full items-start gap-5 border-t border-line py-5 pl-4 transition-colors',
                    submitted ? 'cursor-default' : 'cursor-pointer hover:opacity-80',
                    submitted && !isCorrectOption && !isIncorrectChoice && 'opacity-50',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-y-0 left-0 w-[2px]',
                      isCorrectOption
                        ? 'bg-correct'
                        : isIncorrectChoice
                          ? 'bg-wrong'
                          : !submitted && isSelected
                            ? 'bg-ink'
                            : 'bg-transparent',
                    )}
                  />
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
                      'w-5 shrink-0 pt-0.5 font-mono text-meta tabular-nums',
                      isCorrectOption
                        ? 'text-correct'
                        : isIncorrectChoice
                          ? 'text-wrong'
                          : isSelected
                            ? 'text-ink'
                            : 'text-muted',
                    )}
                  >
                    {optionIndex + 1}
                  </span>
                  <span
                    className={cn(
                      'min-w-0 flex-1 text-body',
                      isCorrectOption
                        ? 'text-correct'
                        : isIncorrectChoice
                          ? 'text-wrong'
                          : 'text-ink',
                    )}
                  >
                    {option}
                  </span>
                  {isCorrectOption ? (
                    <span className="shrink-0 font-mono text-label tracking-[0.14em] text-correct uppercase">
                      Correct
                    </span>
                  ) : isIncorrectChoice ? (
                    <span className="shrink-0 font-mono text-label tracking-[0.14em] text-wrong uppercase">
                      Yours
                    </span>
                  ) : null}
                </label>
              );
            })}
          </fieldset>

          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
            <button
              type="button"
              onClick={() => setHintOpen((open) => !open)}
              aria-expanded={hintOpen}
              className="font-mono text-label tracking-[0.14em] text-muted uppercase transition-colors hover:text-ink"
            >
              {hintOpen ? 'Hide hint' : 'Show hint'}
            </button>
            <p className="text-meta text-muted">One choice only</p>
          </div>

          {hintOpen ? (
            <div className="mt-5 border-l-2 border-l-line pl-5">
              <Label className="text-muted">{question.hint}</Label>
              <Formula
                latex={question.steps[0].latex}
                fallback={question.steps[0].formula}
                display={false}
                className="mt-3 text-body"
              />
            </div>
          ) : null}
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-line bg-bg px-5 py-4 sm:px-8">
        <div className="mx-auto w-full max-w-narrow">
          {submitted && !sheetOpen ? (
            <ActionButton
              label={isLast ? 'Finish session' : 'Next question'}
              onClick={next}
            />
          ) : (
            <ActionButton
              label="Check answer"
              disabled={selected === null || submitted}
              onClick={submit}
            />
          )}
          {submitted && !sheetOpen ? (
            <ActionButton
              label="Review explanation"
              variant="text"
              className="mt-2 w-full"
              onClick={() => setSheetOpen(true)}
            />
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
