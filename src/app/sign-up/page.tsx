import type { Metadata } from 'next';
import { WelcomeScreen } from '@/components/welcome-screen';

export const metadata: Metadata = {
  title: 'Sign up',
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return <WelcomeScreen initialMode="sign-up" />;
}
