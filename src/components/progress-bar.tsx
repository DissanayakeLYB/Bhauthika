import { cn } from '@/lib/utils';

type ProgressTone = 'ink' | 'correct' | 'wrong';

const fills: Record<ProgressTone, string> = {
  ink: 'bg-ink',
  correct: 'bg-correct',
  wrong: 'bg-wrong',
};

interface ProgressBarProps {
  /** Percentage, 0–100. */
  value: number;
  tone?: ProgressTone;
  label: string;
  className?: string;
}

/** A thin horizontal line, never a circle or a chart. */
export function ProgressBar({ value, tone = 'ink', label, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      className={cn('h-px w-full bg-line', className)}
    >
      <div
        className={cn('h-px transition-[width] duration-500 ease-out', fills[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
