'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudy } from '@/components/study-provider';
import { ScoreRing } from '@/components/score-ring';
import { ActionButton } from '@/components/button';
import { Chip } from '@/components/chip';
import { Icon } from '@/components/icon';
import { cn } from '@/lib/utils';

export default function SummaryPage() {
  const { result, progress, startSession } = useStudy();
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
            Complete a practice set to see your mastery movement.
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

        <p className="mt-3 flex items-center justify-center gap-1.5 rounded-card border border-indigo-line bg-indigo-soft px-3 py-2.5 text-center font-display text-[11px] font-semibold text-primary">
          <span aria-hidden="true">⚡</span>
          +{result.points} Mastery Points earned · {progress.streak}-day streak maintained!
        </p>

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
            {practiced.map((topic, index) => {
              const up = topic.delta > 0;
              const flat = topic.delta === 0;
              return (
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
                  <Chip
                    label={flat ? 'No change' : `${up ? '+' : ''}${topic.delta}% Mastery`}
                    tone={flat ? 'neutral' : up ? 'green' : 'amber'}
                    icon={flat ? undefined : up ? 'arrow-up' : 'arrow-down'}
                    className="shrink-0"
                  />
                </li>
              );
            })}
          </ul>
        </section>

        {practiced.some((topic) => topic.delta < 0) ? (
          <p className="mt-3 px-1 text-[11.5px] leading-[17px] text-ink-muted">
            Amber rows mark units where accuracy dipped — the adaptive engine will resurface them in
            your next set.
          </p>
        ) : null}
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
