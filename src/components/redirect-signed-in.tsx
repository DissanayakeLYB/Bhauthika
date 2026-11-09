'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

/**
 * The landing page is static so Google and WhatsApp can read its head tags, so
 * the signed-in redirect has to run in the browser: as soon as a session is
 * restored, send the student to Home.
 */
export function RedirectSignedIn() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace('/home');
  }, [user, loading, router]);

  return null;
}
