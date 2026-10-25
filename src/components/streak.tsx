import { cn } from '@/lib/utils';

/** Streak as seven small ticks; the caption carries the real count. */
export function StreakTicks({ streak, className }: { streak: number; className?: string }) {
  const filled = Math.min(7, Math.max(0, Math.round(streak)));

  return (
    <div className={className}>
      <div className="flex items-end gap-1.5" aria-hidden="true">
        {Array.from({ length: 7 }, (_, index) => (
          <span
            key={index}
            className={cn('h-5 w-[3px]', index < filled ? 'bg-ink' : 'bg-line')}
          />
        ))}
      </div>
      <p className="mt-3 font-mono text-meta text-muted">
        {streak} {streak === 1 ? 'day' : 'days'} in a row
      </p>
    </div>
  );
}
