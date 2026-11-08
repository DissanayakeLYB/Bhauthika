import type { ReactNode } from 'react';
import { Label, Lead, PageTitle } from '@/components/type';

/** Neutral full-page state while the saved Supabase session is restored. */
export function SessionLoading() {
  return (
    <main id="main" className="mx-auto w-full max-w-wide px-5 py-10 sm:px-8 lg:px-14 lg:py-16">
      <Label className="text-muted">Bhauthika</Label>
      <p role="status" aria-live="polite" className="mt-6 text-body text-muted">
        Checking your session…
      </p>
    </main>
  );
}

/** Vertical rhythm for a signed-in screen. */
export function Screen({ children }: { children: ReactNode }) {
  return <div className="space-y-12 pb-6">{children}</div>;
}

/** Mono eyebrow, large title and optional lead, all left aligned. */
export function PageHead({
  label,
  title,
  lead,
}: {
  label?: string;
  title: string;
  lead?: string;
}) {
  return (
    <header>
      {label ? <Label className="text-muted">{label}</Label> : null}
      <PageTitle className="mt-4">{title}</PageTitle>
      {lead ? <Lead className="mt-4">{lead}</Lead> : null}
    </header>
  );
}
