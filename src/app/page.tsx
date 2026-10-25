'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ActionButton } from '@/components/button';
import { TextField } from '@/components/field';
import { Label } from '@/components/type';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

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
        if (signUpError) {
          setError(signUpError.message);
          return;
        }
        setSuccessMessage('Check your email to confirm your account, then sign in.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          setError(signInError.message);
          return;
        }
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
    setMode((current) => (current === 'sign-in' ? 'sign-up' : 'sign-in'));
    setError('');
    setSuccessMessage('');
  };

  const busy = submitting || googleLoading;

  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh w-full max-w-wide flex-col px-5 py-10 sm:px-8 lg:px-14 lg:py-16"
    >
      <div className="grid flex-1 items-center gap-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-20">
        <section>
          <Label className="text-muted">G.C.E. A/L Physics · Sri Lanka</Label>
          <h1 className="mt-6 text-title font-medium text-ink">Bhauthika</h1>
          <p className="mt-6 max-w-[34ch] text-body text-muted">
            Past-paper MCQs for English-medium students. Answer, read the worked derivation, then
            watch the explanation.
          </p>
          <p className="mt-16 font-mono text-meta text-muted">Eleven units · 2025 / 2026 syllabus</p>
        </section>

        <section aria-labelledby="auth-title">
          <h2 id="auth-title" className="text-[1.5rem] leading-[1.2] font-medium text-ink">
            {mode === 'sign-in' ? 'Sign in' : 'Create an account'}
          </h2>
          <p className="mt-2 text-meta text-muted">
            {mode === 'sign-in'
              ? 'Use your email and password.'
              : 'Use your email, then confirm the link we send.'}
          </p>

          <form id="form-email-auth" onSubmit={handleEmailAuth} className="mt-10 space-y-6">
            <TextField
              id="input-email"
              label="Email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
            />
            <TextField
              id="input-password"
              label="Password"
              type="password"
              autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
              required
              minLength={6}
              placeholder={mode === 'sign-in' ? 'Your password' : 'At least 6 characters'}
              value={password}
              onChange={setPassword}
            />

            {error ? (
              <p id="auth-error" role="alert" className="text-meta text-wrong">
                {error}
              </p>
            ) : null}
            {successMessage ? (
              <p id="auth-success" role="status" className="text-meta text-correct">
                {successMessage}
              </p>
            ) : null}

            <ActionButton
              id="btn-email-auth"
              type="submit"
              label={submitting ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Sign up'}
              disabled={busy}
            />
          </form>

          <ActionButton
            id="btn-google"
            label={googleLoading ? 'Opening Google…' : 'Continue with Google'}
            variant="text"
            className="mt-4 w-full"
            disabled={busy}
            onClick={handleGoogle}
          />

          <p className="mt-10 border-t border-line pt-6 text-meta text-muted">
            {mode === 'sign-in' ? 'No account yet?' : 'Already have an account?'}{' '}
            <button
              id="btn-toggle-mode"
              type="button"
              onClick={toggle}
              className="text-ink underline underline-offset-4 hover:opacity-80"
            >
              {mode === 'sign-in' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </section>
      </div>
    </main>
  );
}
