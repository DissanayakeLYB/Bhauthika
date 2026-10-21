import { DAY_LABELS, weeklyTotal, type StudyProgress } from '@/lib/progress';

const CHART_WIDTH = 320;
const BASELINE = 108;
const MAX_BAR_HEIGHT = 86;
const SLOT = CHART_WIDTH / 7;
const BAR_WIDTH = 18;

interface WeekChartProps {
  progress: StudyProgress;
}

/** Hand-rolled SVG bars: no charting library, only ~2 kB of markup. */
export function WeekChart({ progress }: WeekChartProps) {
  const { weekly, todayIndex } = progress;
  const max = Math.max(...weekly, 32);
  const total = weeklyTotal(progress);
  const summary = DAY_LABELS.map((day, index) => `${day} ${weekly[index]}`).join(', ');

  return (
    <figure className="rounded-card border border-border bg-surface p-4 shadow-card">
      <figcaption className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-body-md font-semibold text-ink">Questions answered this week</h3>
          <p className="text-body-sm text-ink-muted">7-day pacing velocity</p>
        </div>
        <p className="shrink-0 font-display text-headline-sm text-primary">{total} Qs</p>
      </figcaption>

      <svg
        viewBox={`0 0 ${CHART_WIDTH} 132`}
        className="mt-5 h-auto w-full"
        role="img"
        aria-label={`Questions answered each day this week: ${summary}`}
      >
        <defs>
          <clipPath id="week-chart-clip">
            <rect x="0" y="0" width={CHART_WIDTH} height={BASELINE} />
          </clipPath>
        </defs>
        <g clipPath="url(#week-chart-clip)">
          {weekly.map((value, index) => {
            const height = Math.max(8, Math.round((value / max) * MAX_BAR_HEIGHT));
            const x = index * SLOT + (SLOT - BAR_WIDTH) / 2;
            const y = BASELINE - height;
            const isToday = index === todayIndex;
            return (
              <g key={DAY_LABELS[index]}>
                {isToday ? (
                  <g>
                    <rect
                      x={x + BAR_WIDTH / 2 - 18}
                      y={Math.max(0, y - 24)}
                      width="36"
                      height="17"
                      rx="8.5"
                      className="fill-primary"
                    />
                    <text
                      x={x + BAR_WIDTH / 2}
                      y={Math.max(0, y - 24) + 12}
                      textAnchor="middle"
                      className="fill-white font-display text-[10px] font-semibold"
                    >
                      {value} Qs
                    </text>
                  </g>
                ) : null}
                <rect
                  x={x}
                  y={y}
                  width={BAR_WIDTH}
                  height={height}
                  rx="5"
                  className={isToday ? 'fill-primary' : 'fill-primary/20 bar-grow'}
                  style={{ animationDelay: `${index * 45}ms` }}
                />
              </g>
            );
          })}
        </g>
        <line
          x1="0"
          y1={BASELINE + 0.5}
          x2={CHART_WIDTH}
          y2={BASELINE + 0.5}
          className="stroke-surface-high"
          strokeWidth="1"
        />
      </svg>

      <div className="mt-2 grid grid-cols-7">
        {DAY_LABELS.map((day, index) => (
          <div key={day} className="flex flex-col items-center gap-1">
            <span
              className={
                index === todayIndex
                  ? 'font-display text-label-sm font-semibold text-primary'
                  : 'text-label-sm text-ink-muted'
              }
            >
              {day}
            </span>
            {index === todayIndex ? <span className="h-1 w-1 rounded-full bg-primary" /> : null}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-surface-high pt-3">
        <p className="flex items-center gap-1.5 text-body-sm text-ink-muted">
          <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
          Today: peak session recorded
        </p>
        <p className="font-display text-label-sm font-semibold text-primary">
          Daily Goal: {progress.dailyTarget} Qs
        </p>
      </div>
      <p className="sr-only">{summary}</p>
    </figure>
  );
}
