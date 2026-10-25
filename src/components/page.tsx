import type { ReactNode } from 'react';
import { Label, Lead, PageTitle } from '@/components/type';

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
