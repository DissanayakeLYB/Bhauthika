import Link from 'next/link';
import { GoogleIcon } from '@/components/brand/google-icon';
import { LogoMark } from '@/components/brand/logo';
import { Icon, type IconName } from '@/components/ui/icon';

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
          </p>
          <p className="text-center text-[10px] tracking-[0.03em] text-ink-muted">
            Curated for the National NIE Physics Syllabus
          </p>
        </div>
      </div>
    </main>
  );
}
