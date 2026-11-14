'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS, NavLink } from '@/components/nav';

/**
 * Narrow-screen top bar: wordmark plus a menu button. Five links in a row do
 * not fit at phone widths, so the list sits behind this disclosure and closes
 * on navigation, Escape, an outside tap, or picking a section.
 */
export function AppHeader() {
  const pathname = usePathname();
  // Tied to the path it was opened on, so arriving at a new page closes it
  // without an effect that would set state after a render.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback((restoreFocus = false) => {
    setOpenedAt(null);
    if (restoreFocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close(true);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) close();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, close]);

  return (
    <header ref={headerRef} className="sticky top-0 z-30 border-b border-line bg-bg lg:hidden">
      <div className="flex items-center justify-between gap-4 px-5 py-3">
        <Link href="/home" className="font-mono text-[0.8125rem] tracking-[0.18em] text-ink uppercase">
          Bhauthika
        </Link>
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls="app-menu"
          onClick={() => (open ? close() : setOpenedAt(pathname))}
          className="-mr-2 flex min-h-11 items-center px-2 font-mono text-label tracking-[0.14em] text-ink uppercase transition-colors hover:text-muted"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open ? (
        <nav
          id="app-menu"
          aria-label="Primary"
          className="absolute inset-x-0 top-full border-b border-line bg-bg"
        >
          <ul className="px-5 pt-1 pb-2">
            {NAV_LINKS.map((item) => (
              <li key={item.href} className="border-t border-line first:border-t-0">
                <div className="flex min-h-11 items-center">
                  <NavLink href={item.href} label={item.label} />
                </div>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
