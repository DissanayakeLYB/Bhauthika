import type { Metadata } from 'next';
import { WelcomeScreen } from '@/components/welcome-screen';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return <WelcomeScreen />;
}
