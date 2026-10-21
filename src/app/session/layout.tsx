import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Practice set',
};

export default function SessionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
