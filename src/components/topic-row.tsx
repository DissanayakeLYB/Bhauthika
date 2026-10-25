import { ProgressBar } from '@/components/progress-bar';
import { cn } from '@/lib/utils';

interface TopicRowProps {
  number: string;
  title: string;
  /** Small line under the title, e.g. the syllabus unit or question count. */
  meta?: string;
  /** Mono figure on the right, e.g. "42%". */
  value?: string;
  /** Mastery line under the row; omit for rows without progress. */
  percent?: number;
  onClick?: () => void;
  className?: string;
}

/** One numbered row of a syllabus list: number, title, figure, thin line. */
export function TopicRow({ number, title, meta, value, percent, onClick, className }: TopicRowProps) {
  const content = (
    <>
      <span className="flex items-baseline justify-between gap-4">
        <span className="flex min-w-0 items-baseline gap-4">
          <span className="font-mono text-meta text-muted">{number}</span>
          <span className="min-w-0 text-[1.0625rem] leading-[1.4] text-ink">{title}</span>
        </span>
        {value ? <span className="shrink-0 font-mono text-meta text-muted">{value}</span> : null}
      </span>
      {typeof percent === 'number' ? (
        <ProgressBar value={percent} label={`${title} mastery`} className="mt-4" />
      ) : null}
      {meta ? <span className="mt-2 block text-meta text-muted">{meta}</span> : null}
    </>
  );

  const classes = cn('flex w-full flex-col border-t border-line py-5 text-left', className);

  if (!onClick) return <div className={classes}>{content}</div>;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(classes, 'hover:opacity-80 focus-visible:outline-offset-0')}
    >
      {content}
    </button>
  );
}
