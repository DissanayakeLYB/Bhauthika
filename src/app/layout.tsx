import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { StudyProvider } from '@/components/study-provider';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Bhauthika · A/L Physics practice',
    template: '%s · Bhauthika',
  },
  description:
    'Adaptive G.C.E. A/L Physics practice for Sri Lankan English-medium students: past-paper MCQs, worked derivations and topic mastery tracking.',
  applicationName: 'Bhauthika',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [{ url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    title: 'Bhauthika',
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light dark',
  themeColor: '#f8f9fc',
};

/** Applies the saved theme (or the system preference) before first paint. */
const THEME_SCRIPT = `try{var t=localStorage.getItem('bhauthika.theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jakarta.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-canvas font-body text-ink antialiased">
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-tile focus:bg-primary-solid focus:px-4 focus:py-3 focus:text-label-lg focus:text-white"
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
