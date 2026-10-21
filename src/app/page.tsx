import Link from 'next/link';
import { LogoMark } from '@/components/logo';
import { Icon, type IconName } from '@/components/icon';

const FEATURES: { icon: IconName; title: string; subtitle: string; box: string }[] = [
  {
    icon: 'sparkle',
    title: 'Adaptive Question Engine',
    subtitle: 'Calibrated to your weak syllabus units',
    box: 'bg-[#E0E0FF] text-primary',
  },
  {
    icon: 'book',
    title: 'Sri Lankan A/L Past Papers',
    subtitle: 'English medium curated derivations & MCQs',
    box: 'bg-indigo-soft text-indigo-mid',
  },
  {
    icon: 'insights',
    title: 'Topic Mastery Analytics',
    subtitle: 'Real-time island percentile ranking insights',
    box: 'bg-amber-soft text-amber-ink',
  },
];

export default function WelcomePage() {
  return (
    <main
      id="main"
      className="relative flex min-h-dvh flex-col overflow-hidden px-5 pt-[max(20px,env(safe-area-inset-top))] pb-[max(20px,env(safe-area-inset-bottom))]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -right-24 h-64 w-64 rounded-full bg-[#E0E0FF]/60 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -left-32 h-60 w-60 rounded-full bg-[#E1E0FF]/40 blur-2xl"
      />

      <div className="relative mx-auto flex w-full max-w-[420px] flex-1 flex-col md:my-auto md:flex-none md:rounded-sheet md:border md:border-border md:bg-surface/80 md:p-8 md:shadow-card md:backdrop-blur">
        <header className="flex items-center justify-between gap-2">
          <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border-strong bg-surface px-3 text-label-sm tracking-[0.06em] text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-green" aria-hidden="true" />
            G.C.E. A/L 2025/2026
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container/70 px-2.5 py-1.5 text-label-sm font-semibold text-primary">
            <Icon name="flask" size={15} />
            Physics
          </span>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center py-8 md:py-4">
          <div className="grid h-[84px] w-[84px] place-items-center rounded-sheet border border-border-strong/40 bg-surface shadow-raised">
            <LogoMark size={64} />
          </div>
          <h1 className="mt-4 font-display text-[30px] leading-[38px] tracking-[-0.9px] text-primary">
            Bhauthika
          </h1>
          <p className="mt-0.5 text-body-md font-medium text-ink-muted">
            Practise smarter. Master Physics.
          </p>

          <ul className="mt-6 w-full max-w-[330px] space-y-2">
            {FEATURES.map((feature) => (
              <li
                key={feature.title}
                className="flex items-center gap-3 rounded-card border border-border-strong/50 bg-surface px-3 py-2.5"
              >
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-tile ${feature.box}`}>
                  <Icon name={feature.icon} size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-label-md font-semibold text-primary">
                    {feature.title}
                  </span>
                  <span className="block text-label-sm leading-[15px] text-ink-muted">
                    {feature.subtitle}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <Link
            href="/home"
            className="flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-card border border-border bg-surface text-body-md font-semibold text-ink shadow-card transition-colors hover:bg-canvas"
          >
            <GoogleIcon size={20} />
            Continue with Google
          </Link>
          <Link
            href="/home"
            className="flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-card bg-primary text-body-md font-semibold text-white shadow-[0_4px_12px_rgba(32,37,107,0.2)] transition-colors hover:bg-primary-pressed"
          >
            <Icon name="mail" size={20} />
            Continue with email
          </Link>
          <p className="pt-1 text-center text-label-sm text-ink-muted">
            Demo profile · Google and email sign-in arrive in Phase 2
          </p>        <p className="text-center text-[10px] tracking-[0.03em] text-ink-muted">
          Curated for the National NIE Physics Syllabus
        </p>
        </div>
      </div>
    </main>
  );
}

/** Google "G" mark for the demo sign-in button. */
function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}
