'use client';

import { useStudy } from '@/components/study-provider';
import { Label, Mono } from '@/components/type';
import { PageHead, Screen } from '@/components/page';
import { ProgressBar } from '@/components/progress-bar';
import { StreakDisplay } from '@/components/streak';
import { weekdayShort } from '@/lib/streak';
import { cn } from '@/lib/utils';
import { TopicRow } from '@/components/topic-row';
import { TOPICS } from '@/lib/topics';
import { overallAccuracy } from '@/lib/progress';

export default function ProgressPage() {
  const { progress, streak } = useStudy();

  const accuracy = overallAccuracy(progress);
  const noDataYet = progress.totalPractised === 0;

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
          <StreakDisplay
            streak={streak.currentStreak}
            longestStreak={streak.longestStreak}
            week={streak.week}
            hint={!streak.todayActive && streak.currentStreak > 0 ? 'Practice today to keep your streak.' : undefined}
            className="mt-5"
          />
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
          {streak.week.map((day) => (
            <li key={day.date} className="flex items-center gap-5">
              <Label
                className={cn('w-14 shrink-0', day.isToday ? 'text-ink' : 'text-muted')}
              >
                {day.isToday ? 'Today' : weekdayShort(day.date)}
              </Label>
              <ProgressBar
                value={day.active ? 100 : 0}
                label={`${day.active ? 'Activity recorded' : 'No activity'} on ${day.date}`}
                className="flex-1"
              />
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
