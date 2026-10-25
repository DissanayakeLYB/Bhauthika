'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Formula } from '@/components/formula';
import { ActionButton } from '@/components/button';
import { Label, Mono } from '@/components/type';
import type { Question } from '@/lib/questions';
import { cn } from '@/lib/utils';

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
  return (
    <Sheet
      open={open}
      onClose={onClose}
      labelledBy="feedback-title"
      className="max-h-[92dvh] border-t border-line bg-bg sm:max-h-[88dvh] sm:border"
    >
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-6 pb-6 sm:px-8 sm:pt-8">
        <div className="flex items-baseline justify-between gap-4">
          <Label className={correct ? 'text-correct' : 'text-wrong'}>
            {correct ? 'Correct' : 'Incorrect'}
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
            correct ? 'text-correct' : 'text-wrong',
          )}
        >
          {correct ? 'Correct.' : 'Not quite.'}
        </h2>
        <p className="mt-3 text-meta text-muted">
          {correct ? 'You picked the right option.' : 'The right option is below.'}
        </p>

        <div className="mt-8 flex items-baseline gap-5 border-t border-line pt-6">
          <Mono className="text-[1.375rem] leading-none text-correct">{question.answer + 1}</Mono>
          <p className="min-w-0 text-body text-ink">{question.options[question.answer]}</p>
        </div>

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
      </div>

      <div className="shrink-0 border-t border-line px-5 pt-5 pb-5 sm:px-8">
        <ActionButton
          label={isLast ? 'Finish session' : 'Next question'}
          onClick={onNext}
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          {/* Video link: shown only if the question has a videoUrl. */}
          {question.videoUrl ? (
            <ActionButton
              variant="text"
              label="Watch full explanation"
              onClick={() => window.open(question.videoUrl, '_blank', 'noopener,noreferrer')}
            />
          ) : null}
          <ActionButton
            variant="text"
            label={bookmarked ? 'Marked for review' : 'Mark for review'}
            aria-pressed={bookmarked}
            onClick={onToggleBookmark}
          />
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
  labelledBy,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  className?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

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
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-bg/80 sm:items-center sm:p-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
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
