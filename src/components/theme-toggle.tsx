'use client';

import { Icon } from '@/components/icon';
import { cn } from '@/lib/utils';

export const THEME_STORAGE_KEY = 'bhauthika.theme';

/**
 * Flips the .dark class on <html> and remembers the choice. The icon swaps
 * through CSS, so there is no state to hydrate and no mismatch to guard.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = !root.classList.contains('dark');
    root.classList.toggle('dark', next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
    } catch {
      // Storage disabled: the choice still applies for this page view.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className={cn(
        'grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-surface text-ink-muted transition-colors hover:text-ink',
        className,
      )}
    >
      <Icon name="moon" size={17} className="dark:hidden" />
      <Icon name="sun" size={17} className="hidden dark:block" />
    </button>
  );
}
