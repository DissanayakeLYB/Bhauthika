'use client';

import { Icon } from '@/components/icon';
import { LogoMark } from '@/components/logo';
import { useStudy } from '@/components/study-provider';
import { ThemeToggle } from '@/components/theme-toggle';

/** Sticky phone header: brand mark plus the one streak number. */
export function AppHeader() {
  const { progress } = useStudy();

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-canvas/95 pt-[env(safe-area-inset-top)] backdrop-blur lg:hidden">
      <div className="flex h-14 items-center justify-between gap-2 px-4">
        <div className="flex min-w-0 items-center gap-2">
          <LogoMark size={26} className="hidden min-[360px]:block" />
          <span className="truncate font-display text-[22px] leading-[30px] tracking-[-0.4px] text-primary">
            Bhauthika
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="inline-flex h-7 items-center gap-1 rounded-full border border-border bg-surface px-2.5 text-label-sm font-medium text-amber-ink">
            <Icon name="fire" size={16} className="text-amber" />
            {progress.streak} Days Streak
          </span>
          <ThemeToggle className="h-8 w-8" />
        </div>
      </div>
    </header>
  );
}
