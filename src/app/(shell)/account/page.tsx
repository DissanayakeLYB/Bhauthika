'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ActionButton } from '@/components/button';
import { Label } from '@/components/type';
import { PageHead, Screen } from '@/components/page';
import { useAuth } from '@/lib/auth-context';

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.replace('/');
  }, [signOut, router]);

  return (
    <Screen>
      <PageHead label="Account" title="Your account" lead="One student, one practice record." />

      <section aria-labelledby="email-title" className="border-t border-line pt-10">
        <Label className="text-muted">
          <span id="email-title">Email</span>
        </Label>
        <p className="mt-4 break-all font-mono text-body text-ink">{user?.email ?? '—'}</p>
      </section>

      <div className="border-t border-line pt-10">
        <ActionButton
          id="btn-account-sign-out"
          label="Sign out"
          variant="text"
          onClick={handleSignOut}
        />
      </div>
    </Screen>
  );
}
