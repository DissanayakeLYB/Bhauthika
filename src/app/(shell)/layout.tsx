'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Sidebar } from '@/components/nav';
import { SessionLoading } from '@/components/page';
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

  // While the saved session is being read, show the loading state: never the
  // sign-in screen and never a redirect. Then, without a session, show nothing
  // because the effect above is already sending the student to the welcome page.
  if (loading) return <SessionLoading />;
  if (!user) return null;

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
