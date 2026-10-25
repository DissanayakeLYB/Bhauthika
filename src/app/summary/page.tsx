'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStudy } from '@/components/study-provider';
import { ActionButton } from '@/components/button';
import { Label, Mono } from '@/components/type';
import { TopicRow } from '@/components/topic-row';

export default function SummaryPage() {
  const { result, startSession } = useStudy();
  const router = useRouter();

  if (!result) {
    return (
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-narrow px-5 py-20 sm:px-8">
        <Label className="text-muted">Summary</Label>
        <h1 className="mt-6 text-title font-medium text-ink">No set finished yet.</h1>
        <p className="mt-6 text-body text-muted">
          Complete a practice set and your score appears here.
        </p>
        <div className="mt-10 space-y-4">
          <ActionButton label="Choose a unit" onClick={() => router.push('/practice')} />
          <ActionButton label="Back to home" variant="text" onClick={() => router.push('/home')} />
        </div>
      </main>
    );
  }

  // Weak topics first: the units that scored lowest in this set.
  const weakTopics = [...result.topics].sort((a, b) => a.accuracy - b.accuracy).slice(0, 3);

  const practiseAgain = () => {
    const total = startSession('all', { count: result.total, fill: true });
    if (total > 0) router.replace('/session');
  };

  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-narrow px-5 py-10 sm:px-8">
      <header className="flex items-baseline justify-between gap-4">
        <Label className="text-muted">Set complete</Label>
        <Link
          href="/home"
          className="font-mono text-label tracking-[0.14em] text-muted uppercase transition-colors hover:text-ink"
        >
          Close
        </Link>
      </header>

      <p className="mt-12 text-numeral font-mono text-ink tabular-nums">
        {result.correct}
        <Mono className="text-muted"> / {result.total}</Mono>
      </p>
      <p className="mt-4 text-body text-muted">
        {result.correct} of {result.total} correct in this set.
      </p>

      <section aria-labelledby="weak-title" className="mt-16">
        <h2 id="weak-title" className="text-[1.125rem] leading-[1.3] font-medium text-ink">
          Weak topics
        </h2>
        {weakTopics.length > 0 ? (
          <ul className="mt-6 border-b border-line">
            {weakTopics.map((topic, index) => (
              <li key={topic.topicId}>
                <TopicRow
                  number={String(index + 1).padStart(2, '0')}
                  title={topic.title}
                  meta={`${topic.correct} of ${topic.total} correct`}
                  value={`${topic.accuracy}%`}
                  percent={topic.accuracy}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-body text-muted">Nothing to revisit from this set.</p>
        )}
      </section>

      <div className="mt-16 space-y-3">
        <ActionButton label="Practice again" onClick={practiseAgain} />
        <ActionButton
          label="Back to home"
          variant="text"
          className="w-full"
          onClick={() => router.push('/home')}
        />
      </div>
    </main>
  );
}
