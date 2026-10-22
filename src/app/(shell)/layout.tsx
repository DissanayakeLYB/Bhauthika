'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Sidebar, TabBar } from '@/components/nav';
import { useAuth } from '@/lib/auth-context';

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
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
        {children}
      </main>
      <TabBar />
    </div>
  );
}
