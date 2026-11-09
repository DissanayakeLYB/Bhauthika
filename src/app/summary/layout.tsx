import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Session summary',
  robots: { index: false, follow: false },
};

export default function SummaryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
