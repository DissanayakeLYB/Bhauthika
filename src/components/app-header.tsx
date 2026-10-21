'use client';

import { useCallback, useState } from 'react';
import { LogoMark } from '@/components/logo';
import { MenuSheet } from '@/components/menu-sheet';
import { useStudy } from '@/components/study-provider';
import { Icon } from '@/components/icon';
import { cn } from '@/lib/utils';

export function StreakChip({
  streak,
  label = 'days',
  className,
}: {
  streak: number;
  label?: 'days' | 'compact' | 'short';
  className?: string;
}) {
  const text = label === 'compact' ? `${streak}` : label === 'short' ? `${streak} d` : `${streak} Days Streak`;

  return (
    <span
      className={cn(
        'inline-flex h-7 shrink-0 items-center gap-1 rounded-full border px-2.5 text-label-sm font-medium',
        label === 'days' && 'border-border bg-surface text-amber-ink',
        label === 'compact' && 'border-indigo-line bg-indigo-soft font-semibold text-primary',
        label === 'short' && 'border-border-strong bg-surface-high font-semibold text-primary',
        className,
      )}
    >
      <Icon name="fire" size={16} className="text-amber" />
      {text}
    </span>
  );
}

export function AppHeader() {
  const { progress } = useStudy();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border/70 bg-canvas/95 pt-[env(safe-area-inset-top)] backdrop-blur lg:hidden">
        <div className="flex h-14 items-center justify-between gap-2 px-4">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              className="-ml-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-surface-container"
            >
              <Icon name="menu" size={22} />
            </button>
            <LogoMark size={26} className="hidden min-[360px]:block" />
            <span className="truncate font-display text-[22px] leading-[30px] tracking-[-0.4px] text-primary">
              Bhauthika
            </span>
          </div>
          <StreakChip streak={progress.streak} />
        </div>
      </header>
      <MenuSheet open={menuOpen} onClose={closeMenu} />
    </>
  );
}
