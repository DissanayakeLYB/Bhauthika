'use client';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PotentiometerDiagram } from '@/components/circuit-diagram';
import { FeedbackSheet } from '@/components/feedback-sheet';
import { Formula } from '@/components/formula';
import { useStudy } from '@/components/study-provider';
import { ActionButton } from '@/components/button';
import { ProgressBar } from '@/components/progress-bar';
import { Label } from '@/components/type';
import { hasAnswerKey, isCorrectChoice, type Question } from '@/lib/questions';
import { TOPIC_MAP } from '@/lib/topics';
import { cn } from '@/lib/utils';

const pad = (value: number) => String(value).padStart(2, '0');

export default function SessionPage() {
  const { active, ready } = useStudy();
  const router = useRouter();

  // The saved set is read from storage on mount; until then show neither the
  // question nor the empty state.
  if (!ready) {
    return (
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-narrow px-5 py-20 sm:px-8">
        <Label className="text-muted">Practice</Label>
        <p role="status" aria-live="polite" className="mt-6 text-body text-muted">
          Restoring your set…
        </p>
      </main>
    );
  }

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

/** Exam clock: minutes and seconds, hours only once a paper runs that long. */
function clock(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
    : `${minutes}:${String(rest).padStart(2, '0')}`;
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
  const {
    active,
    answerCurrent,
    goTo,
    goToNext,
    finishSession,
    bookmarks,
    toggleBookmark,
    sheetOpen,
    setSheetOpen,
  } = useStudy();
  const router = useRouter();
  // Restore the checked state if the tab was reloaded mid-session.
  const currentAnswer = active ? (active.answers[active.index] ?? null) : null;
  const [selected, setSelected] = useState<number | null>(currentAnswer);
  const [submitted, setSubmitted] = useState(currentAnswer !== null);
  const [hintOpen, setHintOpen] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);
  // One tap only: a double click must not record the same attempt twice.
  const advancingRef = useRef(false);
  // Exam mode holds every answer back, so it runs its own clock.
  const exam = active?.exam === true;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!exam) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [exam]);

  const closeSheet = useCallback(() => setSheetOpen(false), [setSheetOpen]);

  if (!active) return null;

  const { questions, index } = active;
  const question: Question = questions[index];
  const total = questions.length;
  const isLast = index + 1 >= total;
  const hasKey = hasAnswerKey(question);
  const correct = isCorrectChoice(question, selected);
  const bookmarked = bookmarks.includes(question.id);
  const topic = question.topicId ? TOPIC_MAP[question.topicId] : null;
  const hasHint = question.steps.length > 0;
  const answeredCount = active.answers.filter((answer) => answer !== null).length;
  const elapsed = exam && active.startedAt ? Math.max(0, Math.round((now - active.startedAt) / 1000)) : null;

  const submit = () => {
    if (selected === null || submitted) return;
    answerCurrent(selected);
    setSubmitted(true);
    // Every set gets feedback: keyed items show a verdict, unkeyed ones still
    // offer the explanation video.
    if (!exam) setSheetOpen(true);
  };

  // In a paper, picking an option is the answer: it is kept, changeable, and
  // nothing is revealed until the paper is finished.
  const choose = (optionIndex: number) => {
    setSelected(optionIndex);
    if (!exam) return;
    answerCurrent(optionIndex);
    setSubmitted(true);
  };

  const finish = () => {
    setSheetOpen(false);
    finishSession();
    router.replace('/summary');
  };

  const next = () => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setSheetOpen(false);
    if (isLast) {
      finish();
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
            {elapsed === null ? null : (
              <p
                className="font-mono text-meta text-ink tabular-nums"
                aria-label="Time on this paper"
              >
                {clock(elapsed)}
              </p>
            )}
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
            {topic ? (
              <>
                <span>{topic.title}</span>
                <span aria-hidden="true">·</span>
              </>
            ) : null}
            <span>
              {question.year} {question.paper}
            </span>
          </p>

          {/* The paper prints its own question number inside the scan. */}
          {question.questionImageUrl ? null : (
            <p className="mt-8 font-mono text-numeral text-ink tabular-nums">{question.number}</p>
          )}

          {question.questionImageUrl ? (
            // Past-paper item: the scan carries the stem and the printed options.
            <figure className="mt-8">
              <img
                src={question.questionImageUrl}
                alt={`Question ${question.number} of the ${question.year} ${question.paper}, as printed in the paper`}
                loading="lazy"
                decoding="async"
                className="w-full rounded-xs border border-line"
              />
              <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
                <span className="text-meta text-muted">Question as printed in the paper.</span>
                <a
                  href={question.questionImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-label tracking-[0.14em] text-muted uppercase transition-colors hover:text-ink"
                >
                  Open full size
                </a>
              </figcaption>
            </figure>
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
              // An exam paper shows no verdict, only which option was taken.
              const showVerdict = submitted && !exam;
              // When several options are accepted, the one this student picked
              // is the correct row; there is no single answer to point at.
              const isCorrectOption =
                showVerdict &&
                hasKey &&
                (question.acceptedAnswers ? isSelected && correct : optionIndex === question.answer);
              const isIncorrectChoice = showVerdict && isSelected && !isCorrectOption;

              return (
                <label
                  key={option}
                  className={cn(
                    'choice-row relative flex w-full items-start gap-5 border-t border-line py-5 pl-4 transition-colors',
                    submitted ? 'cursor-default' : 'cursor-pointer hover:opacity-80',
                    !exam && submitted && !isCorrectOption && !isIncorrectChoice && 'opacity-50',
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
                          : isSelected && (!submitted || exam)
                            ? 'bg-ink'
                            : 'bg-transparent',
                    )}
                  />
                  <input
                    type="radio"
                    name={`answer-${question.id}`}
                    value={optionIndex}
                    aria-label={question.questionImageUrl ? `Option ${optionIndex + 1}` : undefined}
                    checked={isSelected}
                    onChange={() => choose(optionIndex)}
                    disabled={submitted && !exam}
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
                  {question.questionImageUrl ? null : (
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
                  )}
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

          {exam && submitted ? (
            <p role="status" className="mt-6 text-meta text-muted">
              Answer saved. You can change it until you finish; the answers and the time appear at
              the end.
            </p>
          ) : null}

          {submitted && !hasKey ? (
            <p role="status" className="mt-6 text-meta text-muted">
              Answer recorded. This paper has no answer key yet, so the set is not marked.
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
            {hasHint ? (
              <button
                type="button"
                onClick={() => setHintOpen((open) => !open)}
                aria-expanded={hintOpen}
                className="font-mono text-label tracking-[0.14em] text-muted uppercase transition-colors hover:text-ink"
              >
                {hintOpen ? 'Hide hint' : 'Show hint'}
              </button>
            ) : (
              <span aria-hidden="true" />
            )}
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
          {exam ? (
            <>
              <div className="flex items-baseline justify-between gap-4">
                <ActionButton
                  label="Previous"
                  variant="text"
                  disabled={index === 0}
                  onClick={() => goTo(index - 1)}
                />
                <p className="font-mono text-meta text-muted tabular-nums">
                  {answeredCount} / {total} answered
                </p>
              </div>
              {isLast ? (
                <ActionButton label="Finish paper" onClick={finish} />
              ) : (
                <ActionButton label="Next" onClick={() => goTo(index + 1)} />
              )}
              <ActionButton
                label={gridOpen ? 'Hide questions' : 'All questions'}
                variant="text"
                className="mt-1 w-full"
                aria-expanded={gridOpen}
                onClick={() => setGridOpen((open) => !open)}
              />
              {gridOpen ? (
                <>
                <ol className="mt-3 flex max-h-40 flex-wrap gap-2 overflow-y-auto">
                  {questions.map((item, itemIndex) => {
                    const answered = active.answers[itemIndex] !== null;
                    const current = itemIndex === index;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => goTo(itemIndex)}
                          aria-current={current ? 'step' : undefined}
                          aria-label={`Question ${itemIndex + 1}${answered ? ', answered' : ''}`}
                          className={cn(
                            'h-9 w-9 rounded-sm border font-mono text-meta tabular-nums transition-colors',
                            current
                              ? 'border-ink text-ink'
                              : answered
                                ? 'border-line text-ink'
                                : 'border-line text-muted hover:border-muted hover:text-ink',
                          )}
                        >
                          {itemIndex + 1}
                        </button>
                      </li>
                    );
                  })}
                </ol>
                {isLast ? null : (
                  <ActionButton
                    label="Finish paper"
                    variant="text"
                    className="mt-2 w-full"
                    onClick={finish}
                  />
                )}
                </>
              ) : null}
            </>
          ) : submitted && !sheetOpen ? (
            <ActionButton
              label={isLast ? 'See results' : 'Next question'}
              onClick={next}
            />
          ) : (
            <ActionButton
              label="Check answer"
              disabled={selected === null || submitted}
              onClick={submit}
            />
          )}
          {submitted && !sheetOpen && !exam ? (
            <ActionButton
              label="View explanation"
              variant="text"
              className="mt-2 w-full"
              onClick={() => setSheetOpen(true)}
            />
          ) : null}
        </div>
      </div>

      <FeedbackSheet
        open={sheetOpen && !exam}
        question={question}
        correct={correct}
        chosen={selected}
        bookmarked={bookmarked}
        isLast={isLast}
        onNext={next}
        onClose={closeSheet}
        onToggleBookmark={() => toggleBookmark(question.id)}
      />
    </main>
  );
}
