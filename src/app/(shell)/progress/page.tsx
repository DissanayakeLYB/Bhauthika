'use client';

import { useStudy } from '@/components/study-provider';
import { Label, Mono } from '@/components/type';
import { PageHead, Screen } from '@/components/page';
import { ProgressBar } from '@/components/progress-bar';
import { StreakTicks } from '@/components/streak';
import { TopicRow } from '@/components/topic-row';
import { TOPICS } from '@/lib/topics';
import { overallAccuracy } from '@/lib/progress';

const DAY_LABELS = ['−6', '−5', '−4', '−3', '−2', '−1', 'Today'];

export default function ProgressPage() {
  const { progress } = useStudy();

  const accuracy = overallAccuracy(progress);
  const noDataYet = progress.totalPractised === 0;
  const weekMax = Math.max(1, ...progress.weeklyActivity);

  return (
    <Screen>
      <PageHead
        label="Progress"
        title="Mastery by unit"
        lead={
          noDataYet
            ? 'Nothing recorded yet. Finish one set and these lines start to fill.'
            : 'Eleven units in syllabus order. The line shows mastery; the figure is the same number.'
        }
      />

      <div className="grid gap-10 border-t border-line pt-10 sm:grid-cols-2 sm:gap-16">
        <section aria-labelledby="accuracy-title">
          <Label className="text-muted">
            <span id="accuracy-title">Accuracy</span>
          </Label>
          <p className="mt-5 text-[1.75rem] leading-none">
            <Mono>{accuracy}%</Mono>
          </p>
          <p className="mt-3 text-meta text-muted">
            {noDataYet ? 'No answers yet.' : `${progress.totalCorrect} of ${progress.totalPractised} answered correctly.`}
          </p>
        </section>

        <section aria-labelledby="streak-title">
          <Label className="text-muted">
            <span id="streak-title">Streak</span>
          </Label>
          <StreakTicks streak={progress.streak} className="mt-5" />
        </section>
      </div>

      <section aria-labelledby="week-title" className="border-t border-line pt-10">
        <h2 id="week-title" className="text-[1.125rem] leading-[1.3] font-medium text-ink">
          This week
        </h2>
        {noDataYet ? (
          <p className="mt-3 text-body text-muted">No activity recorded this week.</p>
        ) : null}
        <ul className="mt-6 space-y-4">
          {progress.weeklyActivity.map((count, index) => (
            <li key={DAY_LABELS[index]} className="flex items-center gap-5">
              <Label className="w-14 shrink-0 text-muted">{DAY_LABELS[index]}</Label>
              <ProgressBar
                value={(count / weekMax) * 100}
                label={`${count} questions on ${DAY_LABELS[index]}`}
                className="flex-1"
              />
              <Mono className="w-8 shrink-0 text-right text-meta text-muted">{count}</Mono>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="topics-title">
        <h2 id="topics-title" className="text-[1.125rem] leading-[1.3] font-medium text-ink">
          Units
        </h2>
        <ul className="mt-6 border-b border-line">
          {TOPICS.map((topic) => {
            const { mastery, solved } = progress.topics[topic.id];
            return (
              <li key={topic.id}>
                <TopicRow
                  number={topic.number}
                  title={topic.title}
                  meta={noDataYet ? 'Not started' : `${solved} questions answered`}
                  value={`${mastery}%`}
                  percent={mastery}
                />
              </li>
            );
          })}
        </ul>
      </section>
    </Screen>
  );
}
