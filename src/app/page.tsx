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

/** Sized for the bar, but with a 44px-tall touch area for thumbs. */
const BAR_LINK =
  'relative font-mono text-label tracking-[0.14em] text-muted uppercase transition-colors before:absolute before:-inset-x-3 before:-inset-y-4 before:content-[""] hover:text-ink';

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

      <main id="main" className="flex flex-1 flex-col items-center justify-center py-16 text-center">
        <h1 className="max-w-[17ch] text-[clamp(2.5rem,7vw,4.75rem)] leading-[1.02] font-medium tracking-[-0.035em] text-ink">
          {site.tagline}
        </h1>
        <p className="mt-8 text-body text-muted">
          Answer a question, then watch a short video that explains it.
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
