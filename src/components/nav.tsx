'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon, type IconName } from '@/components/icon';
import { LogoMark } from '@/components/logo';
import { ProgressBar } from '@/components/progress-bar';
import { useStudy } from '@/components/study-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

const items: { href: string; label: string; shortLabel: string; icon: IconName }[] = [
  { href: '/home', label: 'Home', shortLabel: 'Home', icon: 'home' },
  { href: '/practice', label: 'Practice', shortLabel: 'Practice', icon: 'flask' },
  { href: '/progress', label: 'Progress & Mastery', shortLabel: 'Progress', icon: 'insights' },
];

/** Left navigation from lg up; the same destinations drive the tab bar below. */
export function Sidebar() {
  const { progress } = useStudy();
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const dailyPercent = Math.min(100, (progress.answeredToday / progress.dailyTarget) * 100);

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.replace('/');
  }, [signOut, router]);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface px-4 py-6 pb-[max(24px,env(safe-area-inset-bottom))] lg:flex">
      <Link href="/home" className="flex items-center gap-2.5 rounded-tile p-1">
        <LogoMark size={40} />
        <span className="min-w-0">
          <span className="block truncate font-display text-headline-sm text-primary">Bhauthika</span>
          <span className="block truncate text-label-sm text-ink-muted">A/L Physics Mastery</span>
        </span>
      </Link>

      <nav aria-label="Primary" className="mt-8">
        <ul className="space-y-1">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex min-h-11 items-center gap-3 rounded-tile px-3 font-display text-label-md transition-colors',
                    active
                      ? 'bg-indigo-soft font-semibold text-primary'
                      : 'text-ink-muted hover:bg-canvas hover:text-ink',
                  )}
                >
                  <Icon name={item.icon} size={19} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-card border border-border bg-canvas p-3">
          <p className="text-label-sm tracking-[0.06em] text-ink-muted uppercase">Daily target</p>
          <p className="mt-1 font-display text-headline-sm text-ink">
            {progress.answeredToday}
            <span className="text-ink-muted"> / {progress.dailyTarget} Qs</span>
          </p>
          <ProgressBar
            value={dailyPercent}
            height={6}
            label="Daily questions answered"
            className="mt-2"
          />
        </div>
        <p className="flex items-center gap-2 text-body-sm text-ink-muted">
          <Icon name="fire" size={16} className="text-amber" />
          {progress.streak}-day streak
        </p>
        {user ? (
          <p className="truncate text-label-sm text-ink-muted">{user.email}</p>
        ) : null}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            id="btn-sign-out"
            type="button"
            onClick={handleSignOut}
            className="flex min-h-9 flex-1 items-center gap-2 rounded-tile px-2 text-label-sm text-ink-muted transition-colors hover:bg-canvas hover:text-ink"
          >
            <Icon name="close" size={15} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}

/** Bottom tab bar on phones, hidden once the sidebar takes over. */
export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="grid h-16 grid-cols-3">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href} className="min-w-0">
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-full flex-col items-center justify-center gap-0.5 transition-colors',
                  active ? 'text-primary' : 'text-ink-muted',
                )}
              >
                <Icon name={item.icon} size={22} />
                <span className={cn('font-display text-label-sm', active && 'font-semibold')}>
                  {item.shortLabel}
                </span>
                <span
                  className={cn('h-1 w-1 rounded-full', active ? 'bg-primary' : 'bg-transparent')}
                  aria-hidden="true"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
