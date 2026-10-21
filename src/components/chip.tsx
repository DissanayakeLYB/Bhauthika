import type { ReactNode } from 'react';
import { Icon, type IconName } from '@/components/icon';
import { cn } from '@/lib/utils';

export type ChipTone = 'neutral' | 'indigo' | 'softIndigo' | 'green' | 'amber' | 'red' | 'white';

const tones: Record<ChipTone, string> = {
  neutral: 'bg-surface-container text-ink-muted',
  indigo: 'bg-indigo-soft text-primary',
  softIndigo: 'bg-[#dfe2ff] text-primary',
  green: 'bg-green-soft text-green-ink',
  amber: 'bg-amber-soft text-amber-ink ring-1 ring-inset ring-amber/25',
  red: 'bg-red-soft text-red-ink',
  white: 'bg-surface text-primary',
};

interface ChipProps {
  label: string;
  tone?: ChipTone;
  icon?: IconName;
  uppercase?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Chip({ label, tone = 'neutral', icon, uppercase, className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex h-[26px] max-w-full items-center gap-1 rounded-full px-2.5 text-label-sm font-medium whitespace-nowrap',
        uppercase && 'tracking-[0.08em] uppercase',
        tones[tone],
        className,
      )}
    >
      {icon ? <Icon name={icon} size={13} /> : null}
      {label}
    </span>
  );
}
