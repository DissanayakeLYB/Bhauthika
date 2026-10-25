'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

/**
 * Landing page for the Supabase OAuth redirect.
 * Supabase's detectSessionInUrl will automatically exchange the token from the
 * URL hash; we just wait for auth state to settle then push to /home.
 */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.replace('/home');
      }
    });

    // Also handle the case where getSession resolves immediately.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/home');
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <main id="main" className="mx-auto w-full max-w-narrow px-5 py-20 sm:px-8">
      <p className="font-mono text-label tracking-[0.14em] text-muted uppercase">Bhauthika</p>
      <p className="mt-6 text-body text-muted">Signing you in…</p>
    </main>
  );
}
