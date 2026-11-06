import { cn } from '@/lib/utils';
import type { StreakDay } from '@/lib/streak';

/** Streak as seven small ticks; the caption carries the real count. */
export function StreakTicks({
  streak,
  week,
  hint,
  className,
}: {
  streak: number;
  week: readonly StreakDay[];
  hint?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-end gap-1.5" aria-hidden="true">
        {week.map((day) => (
          <span
            key={day.date}
            className={cn('h-5 w-[3px]', day.active ? 'bg-ink' : 'bg-line')}
          />
        ))}
      </div>
      <p className="mt-3 font-mono text-meta text-muted">
        {streak} {streak === 1 ? 'day' : 'days'} in a row
      </p>
      {hint ? <p className="mt-2 text-meta text-muted">{hint}</p> : null}
    </div>
  );
}
