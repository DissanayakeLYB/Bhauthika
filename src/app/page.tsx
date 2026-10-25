'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogoMark } from '@/components/logo';
import { Icon, type IconName } from '@/components/icon';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

const FEATURES: { icon: IconName; title: string; subtitle: string; box: string }[] = [
  {
    icon: 'sparkle',
    title: 'Adaptive Question Engine',
    subtitle: 'Calibrated to your weak syllabus units',
    box: 'bg-[#E0E0FF] text-primary dark:bg-indigo-soft',
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

type Mode = 'sign-in' | 'sign-up';

export default function WelcomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect to home once signed in.
  useEffect(() => {
    if (!loading && user) router.replace('/home');
  }, [user, loading, router]);

  const handleEmailAuth = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setSubmitting(true);
    try {
      if (mode === 'sign-up') {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) { setError(signUpError.message); return; }
        setSuccessMessage('Check your email to confirm your account, then sign in.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) { setError(signInError.message); return; }
        // onAuthStateChange in AuthProvider will update user → useEffect redirects.
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
        },
      });
      if (oauthError) setError(oauthError.message);
      // On success the browser navigates to Google; Supabase redirects back to the
      // site origin, where detectSessionInUrl picks the session up.
    } finally {
      setGoogleLoading(false);
    }
  };

  const toggle = () => {
    setMode((m) => (m === 'sign-in' ? 'sign-up' : 'sign-in'));
    setError('');
    setSuccessMessage('');
  };

  return (
    <main
      id="main"
      className="relative flex min-h-dvh flex-col overflow-hidden px-5 pt-[max(20px,env(safe-area-inset-top))] pb-[max(20px,env(safe-area-inset-bottom))]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -right-24 h-64 w-64 rounded-full bg-[#E0E0FF]/60 blur-2xl dark:bg-indigo-mid/25"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -left-32 h-60 w-60 rounded-full bg-[#E1E0FF]/40 blur-2xl dark:bg-indigo-mid/20"
      />

      <div className="relative mx-auto flex w-full max-w-[420px] flex-1 flex-col md:my-auto md:flex-none md:rounded-sheet md:border md:border-border md:bg-surface/80 md:p-8 md:shadow-card md:backdrop-blur">
        <header className="flex items-center justify-between gap-2">
          <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border-strong bg-surface px-3 text-label-sm tracking-[0.06em] text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-green" aria-hidden="true" />
            G.C.E. A/L 2025/2026
          </span>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container/70 px-2.5 py-1.5 text-label-sm font-semibold text-primary">
              <Icon name="flask" size={15} />
              Physics
            </span>
            <ThemeToggle className="h-8 w-8" />
          </div>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center py-6 md:py-4">
          <div className="grid h-[84px] w-[84px] place-items-center rounded-sheet border border-border-strong/40 bg-surface shadow-raised">
            <LogoMark size={64} />
          </div>
          <h1 className="mt-4 font-display text-[30px] leading-[38px] tracking-[-0.9px] text-primary">
            Bhauthika
          </h1>
          <p className="mt-0.5 text-body-md font-medium text-ink-muted">
            Practise smarter. Master Physics.
          </p>

          <ul className="mt-5 w-full max-w-[330px] space-y-2">
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

        {/* ── Auth section ───────────────────────────────────────── */}
        <div className="space-y-3">
          {/* Google OAuth */}
          <button
            id="btn-google"
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || submitting}
            className="flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-card border border-border bg-surface text-body-md font-semibold text-ink shadow-card transition-colors hover:bg-canvas disabled:opacity-50"
          >
            {googleLoading ? (
              <Spinner />
            ) : (
              <GoogleIcon size={20} />
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative flex items-center gap-2">
            <span className="h-px flex-1 bg-border" />
            <span className="text-label-sm text-ink-muted">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* Email / password form */}
          <form id="form-email-auth" onSubmit={handleEmailAuth} className="space-y-2">
            <input
              id="input-email"
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-card border border-border bg-surface px-4 py-3 text-body-md text-ink placeholder:text-ink-faint focus:border-primary focus:outline-none"
            />
            <input
              id="input-password"
              type="password"
              required
              minLength={6}
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-card border border-border bg-surface px-4 py-3 text-body-md text-ink placeholder:text-ink-faint focus:border-primary focus:outline-none"
            />

            {error ? (
              <p id="auth-error" role="alert" className="text-label-sm text-red-ink">
                {error}
              </p>
            ) : null}
            {successMessage ? (
              <p id="auth-success" role="status" className="text-label-sm text-green-ink">
                {successMessage}
              </p>
            ) : null}

            <button
              id="btn-email-auth"
              type="submit"
              disabled={submitting || googleLoading}
              className="flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-card bg-primary-solid text-body-md font-semibold text-white shadow-[0_4px_12px_rgba(32,37,107,0.2)] transition-colors hover:bg-primary-pressed disabled:opacity-50"
            >
              {submitting ? <Spinner light /> : <Icon name="mail" size={20} />}
              {mode === 'sign-in' ? 'Sign in with email' : 'Create account'}
            </button>
          </form>

          <p className="pt-1 text-center text-label-sm text-ink-muted">
            {mode === 'sign-in' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              id="btn-toggle-mode"
              type="button"
              onClick={toggle}
              className="font-semibold text-primary hover:underline"
            >
              {mode === 'sign-in' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
          <p className="text-center text-[10px] tracking-[0.03em] text-ink-muted">
            Curated for the National NIE Physics Syllabus
          </p>
        </div>
      </div>
    </main>
  );
}

function Spinner({ light = false }: { light?: boolean }) {
  return (
    <svg
      className={`h-5 w-5 animate-spin ${light ? 'text-white' : 'text-primary'}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

/** Google "G" mark for the sign-in button. */
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
