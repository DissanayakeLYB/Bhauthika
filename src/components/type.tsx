import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Large, left-aligned page heading. */
export function PageTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h1 className={cn('text-title font-medium text-ink', className)}>{children}</h1>;
}

/** Smaller heading for a group inside a page. */
export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn('text-[1.125rem] leading-[1.3] font-medium tracking-[-0.01em] text-ink', className)}>
      {children}
    </h2>
  );
}

/** Small mono label for section names and column headers. */
export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('font-mono text-label tracking-[0.14em] whitespace-nowrap uppercase', className)}>
      {children}
    </span>
  );
}

/** A figure or label set in the mono face. */
export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('font-mono tabular-nums', className)}>{children}</span>;
}

/** Lead paragraph under a heading. */
export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('max-w-[46ch] text-body text-muted', className)}>{children}</p>;
}
