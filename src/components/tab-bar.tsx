'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from '@/components/icon';
import { cn } from '@/lib/utils';

const items: { href: string; label: string; icon: IconName }[] = [
  { href: '/home', label: 'Home', icon: 'home' },
  { href: '/practice', label: 'Practice', icon: 'flask' },
  { href: '/progress', label: 'Progress', icon: 'insights' },
];

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
                  {item.label}
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
