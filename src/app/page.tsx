import type { Metadata } from 'next';
import Link from 'next/link';
import { RedirectSignedIn } from '@/components/redirect-signed-in';
import { site } from '@/config/site';

const PAGE_TITLE = `${site.siteName} | A/L Physics Past Paper Practice`;
const PAGE_DESCRIPTION =
  'Practice Sri Lankan A/L Physics past paper MCQs in English, then watch a short video that explains each question.';

/** Same shape as the shared primary button, but a real link for search engines. */
const PRIMARY_LINK =
  'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-sm bg-accent px-6 py-3.5 text-[0.9375rem] font-medium text-bg transition-opacity hover:opacity-90';

/** Same shape as the shared text button. */
const TEXT_LINK =
  'inline-flex min-h-11 items-center text-[0.9375rem] font-medium underline-offset-4 transition-colors hover:text-ink hover:underline';

const BAR_LINK =
  'font-mono text-label tracking-[0.14em] text-muted uppercase transition-colors hover:text-ink';

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: site.siteUrl },
  openGraph: {
    type: 'website',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: site.siteUrl,
    siteName: site.siteName,
    images: [
      {
        url: `${site.siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: PAGE_TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [`${site.siteUrl}/og-image.png`],
  },
};

export default function LandingPage() {
  const year = new Date().getFullYear();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-wide flex-col px-5 sm:px-8 lg:px-14">
      <RedirectSignedIn />
      <header className="flex items-baseline justify-between gap-6 border-b border-line py-5">
        <span className="font-mono text-label tracking-[0.14em] text-ink uppercase">
          {site.siteName}
        </span>
        <Link href="/sign-in" className={BAR_LINK}>
          Sign in
        </Link>
      </header>

      <main id="main" className="flex flex-1 flex-col justify-center py-14">
        <h1 className="max-w-[20ch] text-title font-medium text-ink">{site.tagline}</h1>
        <p className="mt-6 max-w-[42ch] text-body text-muted">
          Answer past paper questions, then watch a short video that explains each one.
        </p>

        <div className="mt-10 w-full max-w-[22rem]">
          <Link href="/sign-up" className={PRIMARY_LINK}>
            Start practice
          </Link>
          <Link href="/sign-in" className={`${TEXT_LINK} mt-3 w-full justify-center text-muted`}>
            I already have an account
          </Link>
        </div>
      </main>

      <footer className="border-t border-line pt-6 pb-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
          <p className="text-meta text-muted">
            <span className="text-ink">{site.tutorName}</span> · Explanation videos on YouTube.
          </p>
          <div className="flex flex-wrap items-baseline gap-x-6">
            <a
              href={site.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${TEXT_LINK} text-ink`}
            >
              Watch on YouTube
            </a>
            {site.classesUrl ? (
              <a
                href={site.classesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${TEXT_LINK} text-ink`}
              >
                Join my classes
              </a>
            ) : null}
          </div>
        </div>
        <p className="mt-8 font-mono text-label tracking-[0.14em] text-muted uppercase">
          {site.siteName} · {year}
        </p>
      </footer>
    </div>
  );
}
