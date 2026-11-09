'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Formula } from '@/components/formula';
import { ActionButton } from '@/components/button';
import { Label, Mono } from '@/components/type';
import type { Question } from '@/lib/questions';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

/** The values question_reports.reason accepts, in the order the panel shows them. */
const REPORT_REASONS = [
  { value: 'wrong_answer_key', label: 'Wrong answer key', needsKey: true, needsVideo: false },
  { value: 'bad_image', label: 'Bad image', needsKey: false, needsVideo: false },
  { value: 'wrong_video', label: 'Wrong video', needsKey: false, needsVideo: true },
  { value: 'other', label: 'Something else', needsKey: false, needsVideo: false },
] as const;

type ReportReason = (typeof REPORT_REASONS)[number]['value'];

/** Mirrors the check constraint on question_reports.note. */
const NOTE_LIMIT = 300;

interface FeedbackSheetProps {
  open: boolean;
  question: Question;
  correct: boolean;
  bookmarked: boolean;
  isLast: boolean;
  onNext: () => void;
  onClose: () => void;
  onToggleBookmark: () => void;
}

export function FeedbackSheet({
  open,
  question,
  correct,
  bookmarked,
  isLast,
  onNext,
  onClose,
  onToggleBookmark,
}: FeedbackSheetProps) {
  const hasKey = question.answer !== null;
  const hasVideo = Boolean(question.videoUrl);
  const unkeyed = !hasKey;

  const [reportOpen, setReportOpen] = useState(false);
  // 'sent' and 'duplicate' both mean this student is done reporting here.
  const [reported, setReported] = useState<'sent' | 'duplicate' | null>(null);
  const [reportState, setReportState] = useState<'idle' | 'sending' | 'error'>('idle');
  const [reason, setReason] = useState<ReportReason>(hasKey ? 'wrong_answer_key' : 'bad_image');
  const [note, setNote] = useState('');
  const reportHeadingRef = useRef<HTMLHeadingElement>(null);

  // The panel sits below the explanation, so bring all of it into view on open.
  useEffect(() => {
    if (!reportOpen) return;
    const heading = reportHeadingRef.current;
    if (!heading) return;
    heading.focus({ preventScroll: true });
    heading.closest('section')?.scrollIntoView({ block: 'end' });
  }, [reportOpen]);

  const openReport = () => {
    setReportState('idle');
    setReason(hasKey ? 'wrong_answer_key' : 'bad_image');
    setNote('');
    setReportOpen(true);
  };

  const closeReport = () => {
    setReportState('idle');
    setNote('');
    setReportOpen(false);
  };

  const toggleReport = () => {
    if (reportOpen) {
      closeReport();
      return;
    }
    openReport();
  };

  const sendReport = async () => {
    if (reportState === 'sending' || reported) return;
    setReportState('sending');
    const details = note.trim();

    try {
      // user_id is filled by the column default (auth.uid()), so it is not sent.
      const { error } = await supabase.from('question_reports').insert({
        question_id: question.id,
        reason,
        note: details.length > 0 ? details.slice(0, NOTE_LIMIT) : null,
      });

      if (!error) {
        setReported('sent');
        setReportState('idle');
        return;
      }
      if (error.code === '23505') {
        // Unique (user_id, question_id, reason): this report already exists.
        setReported('duplicate');
        setReportState('idle');
        return;
      }
      console.error('[report] insert failed:', error.message);
      setReportState('error');
    } catch (cause) {
      console.error('[report] insert failed:', cause);
      setReportState('error');
    }
  };

  const reasons = REPORT_REASONS.filter(
    (item) => (!item.needsKey || hasKey) && (!item.needsVideo || hasVideo),
  );

  return (
    <Sheet
      open={open}
      onClose={onClose}
      onEscape={() => {
        if (!reportOpen) return false;
        closeReport();
        return true;
      }}
      labelledBy="feedback-title"
      className="max-h-[92dvh] border-t border-line bg-bg sm:max-h-[88dvh] sm:border"
    >
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-6 pb-6 sm:px-8 sm:pt-8">
        <div className="flex items-baseline justify-between gap-4">
          <Label className={unkeyed ? 'text-muted' : correct ? 'text-correct' : 'text-wrong'}>
            {unkeyed ? 'Recorded' : correct ? 'Correct' : 'Incorrect'}
          </Label>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-label tracking-[0.14em] text-muted uppercase transition-colors hover:text-ink"
          >
            Close
          </button>
        </div>

        <h2
          id="feedback-title"
          className={cn(
            'mt-4 text-[1.75rem] leading-[1.15] font-medium tracking-[-0.01em]',
            unkeyed ? 'text-ink' : correct ? 'text-correct' : 'text-wrong',
          )}
        >
          {unkeyed ? 'Answer recorded.' : correct ? 'Correct.' : 'Not quite.'}
        </h2>
        <p className="mt-3 text-meta text-muted">
          {unkeyed
            ? 'This paper has no answer key yet, so nothing is marked.'
            : correct
              ? 'You picked the right option.'
              : 'The right option is below.'}
        </p>

        {question.answer !== null ? (
          <div className="mt-8 flex items-baseline gap-5 border-t border-line pt-6">
            <Mono className="text-[1.375rem] leading-none text-correct">{question.answer + 1}</Mono>
            <p className="min-w-0 text-body text-ink">
              {question.questionImageUrl
                ? 'The option printed with this number in the paper.'
                : question.options[question.answer]}
            </p>
          </div>
        ) : null}

        {question.videoUrl ? (
          <div className="mt-8 border-t border-line pt-6">
            <Label className="text-muted">Explanation video</Label>
            <a
              href={question.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block break-words font-mono text-meta text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
            >
              {question.videoUrl}
            </a>
          </div>
        ) : null}

        <ol className="mt-10 space-y-7">
          {question.steps.map((step, index) => {
            const isFinal = index === question.steps.length - 1;
            return (
              <li
                key={step.label}
                className={cn(
                  'border-l-2 pl-5',
                  isFinal ? 'border-l-correct' : 'border-l-line',
                )}
              >
                <Label className={isFinal ? 'text-correct' : 'text-muted'}>{step.label}</Label>
                <Formula
                  latex={step.latex}
                  fallback={step.formula}
                  className="mt-3 text-body"
                />
              </li>
            );
          })}
        </ol>

        {reportOpen ? (
          <section aria-labelledby="report-title" className="mt-10 border-t border-line pt-6">
            <h3
              id="report-title"
              ref={reportHeadingRef}
              tabIndex={-1}
              className="text-body font-medium text-ink outline-none"
            >
              What is wrong?
            </h3>

            {reported ? (
              <p role="status" className="mt-3 text-meta text-muted">
                {reported === 'duplicate'
                  ? 'You already reported this.'
                  : 'Thank you. We will check this question.'}
              </p>
            ) : (
              <>
                <fieldset className="mt-4 border-b border-line">
                  <legend className="sr-only">Reason</legend>
                  {reasons.map((item) => (
                    <label
                      key={item.value}
                      className="choice-row flex cursor-pointer items-center gap-3 border-t border-line py-2.5"
                    >
                      <input
                        type="radio"
                        name={`report-reason-${question.id}`}
                        value={item.value}
                        checked={reason === item.value}
                        onChange={() => setReason(item.value)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          'h-3 w-3 shrink-0 rounded-full border',
                          reason === item.value ? 'border-ink bg-ink' : 'border-line',
                        )}
                      />
                      <span className="text-body text-ink">{item.label}</span>
                    </label>
                  ))}
                </fieldset>

                <label
                  htmlFor={`report-note-${question.id}`}
                  className="mt-5 block font-mono text-label tracking-[0.14em] text-muted uppercase"
                >
                  Details (optional)
                </label>
                <textarea
                  id={`report-note-${question.id}`}
                  value={note}
                  onChange={(event) => setNote(event.target.value.slice(0, NOTE_LIMIT))}
                  maxLength={NOTE_LIMIT}
                  rows={3}
                  placeholder="What looks wrong?"
                  className={cn(
                    'mt-3 w-full resize-none rounded-sm border border-line bg-transparent px-3 py-3',
                    'text-body text-ink placeholder:text-muted',
                    'transition-colors hover:border-muted focus:border-ink focus:outline-none',
                  )}
                />
                <p className="mt-2 text-right font-mono text-meta text-muted tabular-nums">
                  {note.length}/{NOTE_LIMIT}
                </p>

                {reportState === 'error' ? (
                  <p role="alert" className="mt-2 text-meta text-wrong">
                    Could not send the report.
                  </p>
                ) : null}

                <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                  {reportState === 'error' ? (
                    <ActionButton
                      variant="text"
                      className="text-ink"
                      label="Try again"
                      onClick={sendReport}
                    />
                  ) : (
                    <ActionButton
                      variant="text"
                      className="text-ink"
                      label={reportState === 'sending' ? 'Sending…' : 'Send report'}
                      disabled={reportState === 'sending'}
                      onClick={sendReport}
                    />
                  )}
                  <ActionButton variant="text" label="Cancel" onClick={closeReport} />
                </div>
              </>
            )}
          </section>
        ) : null}
      </div>

      <div className="shrink-0 border-t border-line px-5 pt-5 pb-5 sm:px-8">
        <ActionButton
          label={isLast ? 'See results' : 'Next question'}
          onClick={onNext}
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <ActionButton
              variant="text"
              label={bookmarked ? 'Marked for review' : 'Mark for review'}
              aria-pressed={bookmarked}
              onClick={onToggleBookmark}
            />
            <ActionButton
              variant="text"
              label={reported ? 'Reported' : 'Report this question'}
              aria-expanded={reportOpen}
              onClick={toggleReport}
            />
          </div>
          {question.videoUrl ? (
            <ActionButton
              variant="text"
              label="Watch full explanation"
              onClick={() => window.open(question.videoUrl, '_blank', 'noopener,noreferrer')}
            />
          ) : null}
        </div>
      </div>
    </Sheet>
  );
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Bottom sheet on phones, centred dialog from sm up. Handles Escape, focus
 * trapping, focus restoration and background scroll locking.
 */
function Sheet({
  open,
  onClose,
  onEscape,
  labelledBy,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  /** Runs before the sheet closes on Escape; returns true when it handled the key. */
  onEscape?: () => boolean;
  labelledBy: string;
  children: ReactNode;
  className?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  // Kept in a ref so the key listener never needs re-subscribing.
  const onEscapeRef = useRef(onEscape);

  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (onEscapeRef.current?.()) return;
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null,
      );
      if (items.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && (current === first || current === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    panel?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      // The opener may have been replaced while the sheet was open (the
      // "Check answer" button becomes "Next question"), so fall back to the page.
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
      else document.getElementById('main')?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-bg/80 sm:items-center sm:p-8">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={cn(
          'flex w-full max-w-narrow flex-col outline-none',
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
