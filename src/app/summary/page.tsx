'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudy } from '@/components/study-provider';
import { ActionButton } from '@/components/button';
import { Icon } from '@/components/icon';
import { cn } from '@/lib/utils';

export default function SummaryPage() {
  const { result, startSession } = useStudy();
  const router = useRouter();
  const [shareNote, setShareNote] = useState<string | null>(null);

  if (!result) {
    return (
      <main id="main" tabIndex={-1} className="grid min-h-dvh place-items-center bg-canvas px-6">
        <div className="w-full max-w-sm text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-indigo-soft text-primary">
            <Icon name="insights" size={28} />
          </span>
          <h1 className="mt-4 font-display text-headline-sm text-primary">No session summary yet</h1>
          <p className="mt-1 text-body-md text-ink-muted">
            Complete a practice set to see your results.
          </p>
          <ActionButton
            label="Start practising"
            icon="flask"
            onClick={() => router.push('/practice')}
            className="mt-4"
          />
          <ActionButton
            label="Back to home"
            variant="ghost"
            onClick={() => router.push('/home')}
            className="mt-2"
          />
        </div>
      </main>
    );
  }

  const practiced = result.topics.slice(0, 3);
  const headline =
    practiced.length > 1
      ? `${practiced[0].title} and ${practiced[1].title}`
      : (practiced[0]?.title ?? 'your topics');

  const share = async () => {
    const text = `I scored ${result.correct}/${result.total} in a Bhauthika A/L Physics practice session. Practise smarter. Master Physics.`;
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        await navigator.share({ title: 'Bhauthika session', text });
        setShareNote('Summary shared.');
        return;
      }
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setShareNote('Result copied to your clipboard.');
        return;
      }
      setShareNote(text);
    } catch {
      // Sharing was dismissed or blocked; leave the screen unchanged.
      setShareNote(null);
    }
  };

  const practiseMore = () => {
    const total = startSession('all', { count: 10, fill: true });
    if (total > 0) router.replace('/session');
  };

  return (
    <main id="main" tabIndex={-1} className="flex min-h-dvh flex-col bg-canvas">
      <header className="flex h-14 items-center justify-between gap-2 px-4 pt-[env(safe-area-inset-top)]">
        <button
          type="button"
          onClick={() => router.push('/home')}
          aria-label="Close summary and return home"
          className="-ml-2 grid h-11 w-11 place-items-center rounded-full text-ink-muted transition-colors hover:bg-surface-container"
        >
          <Icon name="close" size={22} />
        </button>
        <h1 className="font-display text-headline-sm text-primary">Session Complete</h1>
        <button
          type="button"
          onClick={share}
          aria-label="Share session summary"
          className="-mr-2 grid h-11 w-11 place-items-center rounded-full text-ink-muted transition-colors hover:bg-surface-container"
        >
          <Icon name="share" size={21} />
        </button>
      </header>

      <div className="mx-auto w-full max-w-2xl flex-1 px-4 pb-6">
        <section className="rounded-card border border-border bg-surface p-5 text-center">
          <div className="flex justify-center">
            <ScoreRing correct={result.correct} total={result.total} />
          </div>
          <h2 className="mt-3 font-display text-[20px] leading-[27px] text-ink">
            Great effort, Nimal!
          </h2>
          <p className="mx-auto mt-1 max-w-[280px] text-body-md text-ink-muted">
            You&apos;ve strengthened your fundamentals in {headline} today.
          </p>
        </section>

        {shareNote ? (
          <p role="status" className="mt-2 text-center text-label-sm text-ink-muted">
            {shareNote}
          </p>
        ) : null}

        <section className="mt-3 rounded-card border border-border bg-surface p-4">
          <div className="flex items-center justify-between gap-2 pb-2">
            <h2 className="font-display text-body-md font-semibold text-primary">Topics practiced</h2>
            <p className="text-[10px] text-ink-muted">Sri Lanka A/L Physics</p>
          </div>

          <ul>
            {practiced.map((topic, index) => (
              <li
                key={topic.topicId}
                className={cn(
                  'flex items-center justify-between gap-2 py-3',
                  index > 0 && 'border-t border-border',
                )}
              >
                <div className="min-w-0">
                  <p className="truncate font-body text-[13.5px] font-semibold text-ink">
                    {topic.title}
                  </p>
                  <p className="text-[11.5px] text-ink-muted">
                    Accuracy:{' '}
                    <span className="font-semibold text-ink">
                      {topic.accuracy}% ({topic.correct}/{topic.total})
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="sticky bottom-0 border-t border-border bg-surface px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="mx-auto w-full max-w-2xl space-y-2">
          <ActionButton label="Practise more" icon="flask" onClick={practiseMore} />
          <ActionButton
            label="Back to home"
            variant="ghost"
            onClick={() => router.push('/home')}
          />
        </div>
      </div>
    </main>
  );
}

const RADIUS = 60;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Hand-drawn SVG score ring for the finished set. */
function ScoreRing({ correct, total, size = 140 }: { correct: number; total: number; size?: number }) {
  const ratio = total > 0 ? Math.min(1, Math.max(0, correct / total)) : 0;
  const offset = CIRCUMFERENCE * (1 - ratio);
  const style = {
    '--ring-circumference': CIRCUMFERENCE,
    '--ring-offset': offset,
  } as CSSProperties;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 140 140"
        className="h-full w-full -rotate-90"
        role="img"
        aria-label={`${correct} of ${total} questions correct`}
      >
        <circle cx="70" cy="70" r={RADIUS} fill="none" className="stroke-border" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r={RADIUS}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={style}
          className="ring-progress stroke-green"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <p className="font-display text-[32px] leading-[38px] text-primary">
          {correct}
          <span className="ml-1 font-display text-[22px] text-ink-muted">/ {total}</span>
        </p>
        <p className="text-label-sm text-ink-muted">Questions correct</p>
      </div>
    </div>
  );
}
