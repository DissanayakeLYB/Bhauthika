'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoMark } from '@/components/logo';
import { useStudy } from '@/components/study-provider';
import { Icon, type IconName } from '@/components/icon';
import { ProgressBar } from '@/components/progress-bar';
import { cn } from '@/lib/utils';

const items: { href: string; label: string; icon: IconName }[] = [
  { href: '/home', label: 'Home', icon: 'home' },
  { href: '/practice', label: 'Practice', icon: 'flask' },
  { href: '/progress', label: 'Progress & Mastery', icon: 'insights' },
];

export function Sidebar() {
  const { progress, resetProgress } = useStudy();
  const pathname = usePathname();
  const dailyPercent = Math.min(100, (progress.answeredToday / progress.dailyTarget) * 100);

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
        <button
          type="button"
          onClick={resetProgress}
          className="flex min-h-11 w-full items-center gap-2 rounded-tile px-2 text-left font-display text-label-md text-ink-muted transition-colors hover:bg-canvas hover:text-ink"
        >
          <Icon name="restart" size={17} />
          Reset practice data
        </button>
        <p className="text-label-sm text-ink-muted">Phase 1 · stored on this device</p>
      </div>
    </aside>
  );
}
