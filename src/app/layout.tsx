import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/lib/auth-context';
import { StudyProvider } from '@/components/study-provider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Bhauthika · A/L Physics practice',
    template: '%s · Bhauthika',
  },
  description:
    'G.C.E. A/L Physics past-paper MCQs for English-medium students in Sri Lanka: practice, worked explanations and topic mastery.',
  applicationName: 'Bhauthika',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [{ url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    title: 'Bhauthika',
    statusBarStyle: 'black',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'dark',
  themeColor: '#0b0b0c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-dvh bg-bg font-sans text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-sm focus:bg-accent focus:px-4 focus:py-3 focus:text-label focus:tracking-[0.14em] focus:text-bg focus:uppercase"
        >
          Skip to content
        </a>
        <AuthProvider>
          <StudyProvider>{children}</StudyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
