import { cn } from '@/lib/utils';

type ProgressTone = 'primary' | 'green' | 'amber';

const fills: Record<ProgressTone, string> = {
  primary: 'bg-primary',
  green: 'bg-green',
  amber: 'bg-amber',
};

interface ProgressBarProps {
  /** Percentage, 0–100. */
  value: number;
  tone?: ProgressTone;
  height?: number;
  label: string;
  className?: string;
}

export function ProgressBar({ value, tone = 'primary', height = 6, label, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      className={cn('w-full overflow-hidden rounded-full bg-border', className)}
      style={{ height }}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-500 ease-out', fills[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
