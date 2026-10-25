'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Sidebar } from '@/components/nav';
import { useStudy } from '@/components/study-provider';
import { useAuth } from '@/lib/auth-context';

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { questionsLoading } = useStudy();
  const router = useRouter();

  // Redirect to the welcome screen when there is no signed-in user.
  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  // Show nothing while auth is resolving to avoid a flash.
  if (loading || !user) return null;

  return (
    <div className="min-h-dvh lg:pl-[220px]">
      <Sidebar />
      <AppHeader />
      <main
        id="main"
        className="mx-auto w-full max-w-wide px-5 pt-10 pb-20 sm:px-8 lg:px-14 lg:pt-20"
      >
        {questionsLoading ? <PracticeSetLoading /> : children}
      </main>
    </div>
  );
}

/** Shown while the question bank is arriving from Supabase. */
function PracticeSetLoading() {
  return (
    <div role="status" aria-live="polite" className="py-24">
      <p className="font-mono text-label tracking-[0.14em] text-muted uppercase">Physics</p>
      <p className="mt-4 text-body text-muted">Loading your practice set…</p>
    </div>
  );
}
