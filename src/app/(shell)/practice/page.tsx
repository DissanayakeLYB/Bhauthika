'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudy } from '@/components/study-provider';
import { Label } from '@/components/type';
import { PageHead, Screen } from '@/components/page';
import { TopicRow } from '@/components/topic-row';
import { TOPICS, type TopicId } from '@/lib/topics';
import { cn } from '@/lib/utils';

const COUNTS = [5, 10, 15] as const;

export default function PracticePage() {
  const { progress, startSession } = useStudy();
  const router = useRouter();
  const [count, setCount] = useState<number>(10);
  const [notice, setNotice] = useState<string | null>(null);

  const begin = (topicIds: readonly TopicId[] | 'all', fill = false) => {
    const total = startSession(topicIds, { count, fill });
    if (total === 0) {
      setNotice('No questions for this unit yet.');
      return;
    }
    setNotice(null);
    router.push('/session');
  };

  return (
    <Screen>
      <PageHead
        label="Practice"
        title="Choose a unit"
        lead="Eleven units from the Sri Lankan syllabus, or a mixed set drawn from all of them."
      />

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

      {notice ? (
        <p role="status" className="text-meta text-wrong">
          {notice}
        </p>
      ) : null}

      <ul className="border-b border-line">
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
      </ul>
    </Screen>
  );
}
