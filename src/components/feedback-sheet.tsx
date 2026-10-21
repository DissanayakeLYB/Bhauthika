'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Formula } from '@/components/formula';
import { ActionButton } from '@/components/button';
import { Icon } from '@/components/icon';
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
      className="overflow-hidden rounded-t-sheet bg-surface shadow-sheet md:rounded-sheet md:shadow-dialog"
    >
      <div className="mx-auto mt-2.5 h-1 w-9 shrink-0 rounded-full bg-border md:hidden" aria-hidden="true" />

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-3 md:px-5 md:pt-5">
        <div
          className={cn(
            'flex items-start gap-3 rounded-card border p-3.5',
            correct ? 'border-green/40 bg-green-soft' : 'border-red/40 bg-red-soft',
          )}
        >
          <span
            className={cn(
              'mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-white',
              correct ? 'bg-green' : 'bg-red',
            )}
            aria-hidden="true"
          >
            <Icon name={correct ? 'check' : 'close'} size={18} />
          </span>
          <div className="min-w-0">
            <h2
              id="feedback-title"
              className={cn(
                'font-display text-headline-sm',
                correct ? 'text-green-ink' : 'text-red-ink',
              )}
            >
              {correct ? 'Correct answer' : 'Not quite'}
            </h2>
            <p className="mt-0.5 text-body-md text-ink-muted">
              The correct answer is{' '}
              <strong className="font-semibold text-ink">
                ({question.answer + 1}) {question.options[question.answer]}
              </strong>
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-card border border-border bg-surface-low p-3.5">
          <h3 className="flex items-center gap-1.5 font-display text-headline-sm text-ink">
            <Icon name="lightbulb" size={19} className="text-indigo-mid" />
            Why?
          </h3>
          <ol className="mt-2 space-y-2">
            {question.steps.map((step, index) => {
              const isFinal = index === question.steps.length - 1;
              return (
                <li
                  key={step.label}
                  className={cn(
                    'rounded-tile border bg-surface p-2.5',
                    isFinal ? 'border-green/30 bg-green-soft' : 'border-border',
                  )}
                >
                  <p
                    className={cn(
                      'text-label-sm tracking-[0.06em] uppercase',
                      isFinal ? 'text-green-ink' : 'text-ink-muted',
                    )}
                  >
                    {step.label}
                  </p>
                  <Formula
                    latex={step.latex}
                    fallback={step.formula}
                    className="mt-1 text-[15px] leading-6"
                  />
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="shrink-0 border-t border-border px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] md:px-5 md:pb-4">
        <ActionButton
          label={isLast ? 'Finish session' : 'Next question'}
          icon="arrow-right"
          iconPosition="right"
          onClick={onNext}
        />
        <button
          type="button"
          onClick={onToggleBookmark}
          aria-pressed={bookmarked}
          className="mt-1 flex min-h-11 w-full items-center justify-center gap-1.5 rounded-tile text-label-md text-ink-muted transition-colors hover:text-primary"
        >
          <Icon name="bookmark" size={17} className={bookmarked ? 'text-primary' : undefined} />
          {bookmarked ? 'Marked for review' : 'Mark for review'}
        </button>
      </div>
    </Sheet>
  );
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Bottom sheet on phones, centred dialog from md up. Handles Escape, focus
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 md:items-center md:p-6"
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
        className={cn('flex max-h-[88dvh] w-full max-w-full flex-col outline-none md:max-w-lg', className)}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
