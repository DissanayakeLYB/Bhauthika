import { cn } from '@/lib/utils';

interface LogoMarkProps {
  size?: number;
  /** Draw only the orbit artwork, without the rounded indigo tile. */
  bare?: boolean;
  className?: string;
  /** Supply a label when the mark is the only accessible name. */
  label?: string;
}

/**
 * The Bhauthika mark: an orbital ellipse with an amber sine wave and nucleus.
 * Vector recreation of bhauthika_physics_logo/screen.png.
 */
export function LogoMark({ size = 72, bare = false, className, label }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      className={cn('shrink-0', className)}
    >
      {!bare && <rect width="80" height="80" rx="20" fill="#3B3F9E" />}
      <g transform="rotate(-30 40 40)">
        <ellipse cx="40" cy="40" rx="24" ry="10" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.95" fill="none" />
      </g>
      <path
        d="M22 43 C28 32,34 32,40 40 C46 48,52 48,58 37"
        stroke="#F5A524"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="40" cy="40" r="4" fill="#FFFFFF" />
      <circle cx="58" cy="30" r="2.5" fill="#F5A524" />
    </svg>
  );
}
