import { Mono } from '@/components/type';
import { weekdayShort, type StreakDay } from '@/lib/streak';
import { cn } from '@/lib/utils';

/** The run as a figure, this week as seven labelled days, then the best run. */
export function StreakDisplay({
  streak,
  longestStreak,
  week,
  hint,
  className,
}: {
  streak: number;
  longestStreak: number;
  week: readonly StreakDay[];
  hint?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <Mono className="text-[2.75rem] leading-none text-ink">{streak}</Mono>
        <span className="text-meta text-muted">
          {streak === 1 ? 'day in a row' : 'days in a row'}
        </span>
      </p>

      <ol className="mt-7 grid grid-cols-7 gap-2" aria-hidden="true">
        {week.map((day) => (
          <li key={day.date} className="flex flex-col gap-2">
            <span
              className={cn(
                'w-full',
                day.isToday ? 'h-[3px]' : 'h-px',
                day.active ? 'bg-ink' : 'bg-line',
              )}
            />
            <span
              className={cn(
                'font-mono text-label uppercase',
                day.isToday ? 'text-ink' : 'text-muted',
              )}
            >
              {weekdayShort(day.date)}
            </span>
          </li>
        ))}
      </ol>

      {longestStreak > 1 ? (
        <p className="mt-5 text-meta text-muted">
          Longest run <Mono className="text-ink">{longestStreak}</Mono> days
        </p>
      ) : null}

      {hint ? <p className="mt-2 text-meta text-muted">{hint}</p> : null}
    </div>
  );
}
