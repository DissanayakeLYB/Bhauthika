'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStudy } from '@/components/study-provider';
import { Label, PageTitle } from '@/components/type';
import { PageHead, Screen } from '@/components/page';
import { ActionButton } from '@/components/button';
import { TopicRow } from '@/components/topic-row';
import { PAST_PAPER_QUESTIONS } from '@/lib/past-papers';
import { TOPICS, type TopicId } from '@/lib/topics';
import { cn } from '@/lib/utils';

const COUNTS = [5, 10, 15] as const;

type Mode = 'unit' | 'year';

/**
 * Past papers read from the scan bank, newest year first. Only papers that
 * actually have questions are listed, so adding a year needs no change here.
 */
const PAPERS = (() => {
  const grouped = new Map<string, { year: number; paper: string; count: number }>();

  for (const question of PAST_PAPER_QUESTIONS) {
    const key = `${question.year}|${question.paper}`;
    const entry = grouped.get(key) ?? { year: question.year, paper: question.paper, count: 0 };
    entry.count += 1;
    grouped.set(key, entry);
  }

  return [...grouped.values()].sort((a, b) => b.year - a.year);
})();

export default function PracticePage() {
  return (
    <Suspense fallback={null}>
      <PracticeFlow />
    </Suspense>
  );
}

function PracticeFlow() {
  const { progress, startSession } = useStudy();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [count, setCount] = useState<number>(10);
  const [notice, setNotice] = useState<string | null>(null);

  const rawMode = searchParams.get('mode');
  const mode: Mode | null = rawMode === 'unit' || rawMode === 'year' ? rawMode : null;

  const begin = (topicIds: readonly TopicId[] | 'all', fill = false, year?: number) => {
    const total = startSession(topicIds, { count, fill, year });
    if (total === 0) {
      setNotice('No questions for this unit yet.');
      return;
    }
    setNotice(null);
    router.push('/session');
  };

  const openMode = (next: Mode) => {
    setNotice(null);
    router.push(`/practice?mode=${next}`);
  };

  // Step 1 is the only screen without a mode, so Back returns here.
  const changeMode = () => {
    setNotice(null);
    router.replace('/practice');
  };

  if (mode === null) {
    return (
      <Screen>
        <PageHead label="Practice" title="How do you want to practice?" />

        <ul className="border-b border-line">
          <li>
            <TopicRow
              number="01"
              title="By unit"
              meta="Pick a syllabus unit, or a mixed set."
              onClick={() => openMode('unit')}
            />
          </li>
          <li>
            <TopicRow
              number="02"
              title="By year"
              meta="Practice a full past paper, as printed."
              onClick={() => openMode('year')}
            />
          </li>
        </ul>
      </Screen>
    );
  }

  const head = (
    <header>
      <div className="flex items-baseline justify-between gap-6">
        <Label className="text-muted">Practice</Label>
        <ActionButton
          id="btn-change-mode"
          label="Change mode"
          variant="text"
          className="min-h-0 text-meta"
          onClick={changeMode}
        />
      </div>
      <PageTitle className="mt-4">{mode === 'unit' ? 'Choose a unit' : 'Choose a past paper'}</PageTitle>
    </header>
  );

  return (
    <Screen>
      {head}

      {mode === 'unit' ? (
        <div>
          <Label className="text-muted">Questions in this set</Label>
          <div className="mt-4 flex gap-2" role="group" aria-label="Questions in this set">
            {COUNTS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={count === option}
                onClick={() => setCount(option)}
                className={cn(
                  'min-h-11 w-16 rounded-sm border font-mono text-meta tabular-nums transition-colors',
                  count === option
                    ? 'border-ink text-ink'
                    : 'border-line text-muted hover:border-muted hover:text-ink',
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {notice ? (
        <p role="status" className="text-meta text-wrong">
          {notice}
        </p>
      ) : null}

      <ul className="border-b border-line">
        {mode === 'unit' ? (
          <>
            <li>
              <TopicRow
                number="—"
                title="Mixed set"
                meta="All eleven units"
                value="Mixed"
                onClick={() => begin('all')}
              />
            </li>
            {TOPICS.map((topic) => (
              <li key={topic.id}>
                <TopicRow
                  number={topic.number}
                  title={topic.title}
                  meta={topic.unitLabel}
                  value={`${progress.topics[topic.id].mastery}%`}
                  onClick={() => begin([topic.id])}
                />
              </li>
            ))}
          </>
        ) : (
          PAPERS.map((paper) => (
            <li key={`${paper.year}-${paper.paper}`}>
              <TopicRow
                number={String(paper.count)}
                title={`EM ${paper.year} · ${paper.paper}`}
                meta="Past-paper MCQs shown as printed"
                value="Images"
                onClick={() => begin('all', false, paper.year)}
              />
            </li>
          ))
        )}
      </ul>
    </Screen>
  );
}
