'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Sidebar, TabBar } from '@/components/nav';
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
    <div className="min-h-dvh lg:pl-64">
      <Sidebar />
      <AppHeader />
      <main
        id="main"
        className="mx-auto w-full max-w-[720px] px-4 pt-1 pb-[calc(76px+env(safe-area-inset-bottom))] lg:max-w-4xl lg:px-10 lg:pt-8 lg:pb-16"
      >
        {questionsLoading ? <PracticeSetLoading /> : children}
      </main>
      <TabBar />
    </div>
  );
}

/** Shown while the question bank is arriving from Supabase. */
function PracticeSetLoading() {
  return (
    <div role="status" aria-live="polite" className="grid min-h-[50dvh] place-items-center">
      <div className="flex flex-col items-center gap-3">
        <svg
          className="h-6 w-6 animate-spin text-primary"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <p className="text-body-md text-ink-muted">Loading your practice set…</p>
      </div>
    </div>
  );
}
