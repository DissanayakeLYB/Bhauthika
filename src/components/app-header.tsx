'use client';

import Link from 'next/link';
import { NAV_LINKS, NavLink } from '@/components/nav';

/** Narrow-screen top bar: wordmark over a row of text links. */
export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg lg:hidden">
      <div className="flex items-baseline justify-between gap-4 px-5 pt-4 pb-4">
        <Link href="/home" className="font-mono text-[0.8125rem] tracking-[0.18em] text-ink uppercase">
          Bhauthika
        </Link>
        <span className="font-mono text-label tracking-[0.14em] text-muted uppercase">A/L Physics</span>
      </div>
      <nav aria-label="Primary" className="overflow-x-auto px-5 pb-4">
        <ul className="flex gap-6">
          {NAV_LINKS.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href} label={item.label} />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
