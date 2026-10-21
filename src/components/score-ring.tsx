import type { CSSProperties } from 'react';

const RADIUS = 60;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ScoreRingProps {
  correct: number;
  total: number;
  size?: number;
}

export function ScoreRing({ correct, total, size = 140 }: ScoreRingProps) {
  const ratio = total > 0 ? Math.min(1, Math.max(0, correct / total)) : 0;
  const offset = CIRCUMFERENCE * (1 - ratio);
  const style = {
    '--ring-circumference': CIRCUMFERENCE,
    '--ring-offset': offset,
  } as CSSProperties;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 140 140"
        className="h-full w-full -rotate-90"
        role="img"
        aria-label={`${correct} of ${total} questions correct`}
      >
        <circle cx="70" cy="70" r={RADIUS} fill="none" className="stroke-border" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r={RADIUS}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={style}
          className="ring-progress stroke-green"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <p className="font-display text-[32px] leading-[38px] text-primary">
          {correct}
          <span className="ml-1 font-display text-[22px] text-ink-muted">/ {total}</span>
        </p>
        <p className="text-label-sm text-ink-muted">Questions correct</p>
      </div>
    </div>
  );
}
