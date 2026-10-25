'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

export const NAV_LINKS = [
  { href: '/home', label: 'Home' },
  { href: '/practice', label: 'Practice' },
  { href: '/progress', label: 'Progress' },
  { href: '/account', label: 'Account' },
] as const;

/** Nav link row used by both the wide column and the narrow top bar. */
export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'font-mono text-label tracking-[0.14em] whitespace-nowrap uppercase transition-colors hover:text-ink',
        active ? 'text-ink underline underline-offset-[6px] decoration-line' : 'text-muted',
      )}
    >
      {label}
    </Link>
  );
}

/** Narrow column of text links from lg up. No icons. */
export function Sidebar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.replace('/');
  }, [signOut, router]);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[220px] flex-col border-r border-line px-8 py-10 lg:flex">
      <Link href="/home" className="font-mono text-[0.8125rem] tracking-[0.18em] text-ink uppercase">
        Bhauthika
      </Link>
      <p className="mt-2 font-mono text-label tracking-[0.14em] text-muted uppercase">A/L Physics</p>

      <nav aria-label="Primary" className="mt-14">
        <ul className="space-y-4">
          {NAV_LINKS.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href} label={item.label} />
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto space-y-3">
        {user?.email ? (
          <p className="truncate font-mono text-label tracking-[0.06em] text-muted">{user.email}</p>
        ) : null}
        <button
          id="btn-sign-out"
          type="button"
          onClick={handleSignOut}
          className="font-mono text-label tracking-[0.14em] text-muted uppercase transition-colors hover:text-ink"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
