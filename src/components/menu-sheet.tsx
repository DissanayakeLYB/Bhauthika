'use client';

import Link from 'next/link';
import { LogoMark } from '@/components/brand/logo';
import { useStudy } from '@/components/providers/study-provider';
import { Icon, type IconName } from '@/components/ui/icon';
import { Sheet } from '@/components/ui/sheet';

interface MenuSheetProps {
  open: boolean;
  onClose: () => void;
}

const destinations: { label: string; icon: IconName; href: string }[] = [
  { label: 'Home', icon: 'home', href: '/home' },
  { label: 'Practice', icon: 'flask', href: '/practice' },
  { label: 'Progress & Mastery', icon: 'insights', href: '/progress' },
];

export function MenuSheet({ open, onClose }: MenuSheetProps) {
  const { progress, resetProgress } = useStudy();

  return (
    <Sheet
      open={open}
      onClose={onClose}
      labelledBy="menu-title"
      className="overflow-hidden rounded-t-sheet bg-surface shadow-sheet md:rounded-sheet md:shadow-dialog"
    >
      <div className="mx-auto mt-2.5 h-1 w-9 shrink-0 rounded-full bg-border md:hidden" aria-hidden="true" />

      <div className="flex items-center gap-3 px-4 pt-3">
        <LogoMark size={44} />
        <div className="min-w-0 flex-1">
          <h2 id="menu-title" className="font-display text-headline-sm text-primary">
            Bhauthika
          </h2>
          <p className="truncate text-body-sm text-ink-muted">A/L Physics · English Medium</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-soft px-2.5 py-1 text-label-sm font-medium text-amber-ink">
          <Icon name="fire" size={14} className="text-amber" />
          {progress.streak} days
        </span>
      </div>

      <nav aria-label="Menu" className="px-2 pt-2 pb-2">
        <ul>
          {destinations.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className="flex min-h-12 items-center gap-3 rounded-tile px-2 py-2 text-body-md font-semibold text-ink transition-colors hover:bg-canvas"
              >
                <span className="grid h-9 w-9 place-items-center rounded-tile bg-canvas text-primary">
                  <Icon name={item.icon} size={19} />
                </span>
                <span className="flex-1">{item.label}</span>
                <Icon name="chevron-right" size={18} className="text-ink-faint" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-4 border-t border-border" />

      <div className="px-2 py-2">
        <button
          type="button"
          onClick={() => {
            resetProgress();
            onClose();
          }}
          className="flex min-h-12 w-full items-center gap-3 rounded-tile px-2 py-2 text-left text-body-md font-semibold text-ink transition-colors hover:bg-canvas"
        >
          <span className="grid h-9 w-9 place-items-center rounded-tile bg-amber-soft text-amber-ink">
            <Icon name="restart" size={19} />
          </span>
          Reset practice data
        </button>
      </div>

      <p className="px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-1 text-body-sm text-ink-muted">
        Phase 1 · your progress is stored on this device.
      </p>
    </Sheet>
  );
}
