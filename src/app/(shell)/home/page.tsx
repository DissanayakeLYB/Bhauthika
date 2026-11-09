'use client';

import { useRouter } from 'next/navigation';
import { useStudy } from '@/components/study-provider';
import { ActionButton } from '@/components/button';
import { Label, Lead, Mono } from '@/components/type';
import { PageHead, Screen } from '@/components/page';
import { ProgressBar } from '@/components/progress-bar';
import { StreakDisplay } from '@/components/streak';
import type { Question } from '@/lib/questions';
import { weakestTopicIds, type StudyProgress } from '@/lib/progress';
import type { ActiveSetMode } from '@/lib/repository';
import { TOPICS, TOPIC_MAP, type Topic, type TopicId } from '@/lib/topics';
import { useAuth } from '@/lib/auth-context';
import { displayNameFor } from '@/lib/account';

/** A unit needs this many questions in the bank before it is suggested. */
const SUGGESTION_MIN_QUESTIONS = 5;

function greetingForHour(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * The weakest unit that has enough questions to practise. Ties keep syllabus
 * order, so a new student is pointed at Unit 01.
 */
function suggestedTopic(progress: StudyProgress, bank: readonly Question[]): Topic | null {
  const counts = new Map<TopicId, number>();
  for (const question of bank) {
    if (question.topicId) counts.set(question.topicId, (counts.get(question.topicId) ?? 0) + 1);
  }

  let best: Topic | null = null;
  for (const topic of TOPICS) {
    if ((counts.get(topic.id) ?? 0) < SUGGESTION_MIN_QUESTIONS) continue;
    if (!best || progress.topics[topic.id].mastery < progress.topics[best.id].mastery) {
      best = topic;
    }
  }
  return best;
}

/** How the saved set is named on Home: unit, mixed, or the past paper. */
function setLabel(mode: ActiveSetMode, questions: readonly Question[]): string {
  if (mode === 'past-paper') {
    const paper = questions[0];
    return paper ? `${paper.year} ${paper.paper}` : 'Mixed set';
  }
  if (mode === 'unit') {
    const topicId = questions.find((question) => question.topicId)?.topicId;
    return topicId ? TOPIC_MAP[topicId].title : 'Mixed set';
  }
  return 'Mixed set';
}

export default function HomePage() {
  const { progress, streak, active, mode, questions, startSession } = useStudy();
  const { user } = useAuth();
  const router = useRouter();

  const greeting = greetingForHour(new Date().getHours());
  const noDataYet = progress.totalPractised === 0;
  const displayName = displayNameFor(user);
  const suggestion = suggestedTopic(progress, questions);

  const begin = () => {
    const total = startSession(weakestTopicIds(progress, 3), {
      count: 10,
      fill: true,
      mode: 'mixed',
    });
    if (total > 0) router.push('/session');
  };

  const practiseUnit = (topicId: TopicId) => {
    const total = startSession([topicId], { count: 10, mode: 'unit' });
    if (total > 0) router.push('/session');
  };

  return (
    <Screen>
      <PageHead
        title={`${greeting}, ${displayName}.`}
        lead={
          noDataYet
            ? 'Your record starts with the first set. Nothing is scored yet.'
            : 'Continue where your weakest units left off.'
        }
      />

      {active ? (
        <section aria-labelledby="resume-title" className="border-t border-line pt-8">
          <Label className="text-muted">
            <span id="resume-title">In progress</span>
          </Label>
          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
            <p className="text-body text-ink">
              Question {active.index + 1} of {active.questions.length} ·{' '}
              {setLabel(mode, active.questions)}
            </p>
            <ActionButton
              variant="text"
              className="ml-auto"
              label="Resume"
              onClick={() => router.push('/session')}
            />
          </div>
        </section>
      ) : null}

      <div>
        <ActionButton label="Start practice" onClick={begin} />
        {active ? (
          <p className="mt-3 text-meta text-muted">This replaces your set in progress.</p>
        ) : null}
      </div>

      {suggestion ? (
        <section aria-labelledby="suggested-title" className="border-t border-line pt-8">
          <Label className="text-muted">
            <span id="suggested-title">Suggested next</span>
          </Label>
          <div className="mt-5 flex items-baseline justify-between gap-4">
            <p className="flex min-w-0 items-baseline gap-4">
              <span className="font-mono text-meta text-muted">{suggestion.number}</span>
              <span className="min-w-0 text-[1.0625rem] leading-[1.4] text-ink">
                {suggestion.title}
              </span>
            </p>
            <Mono className="shrink-0 text-meta text-muted">
              {progress.topics[suggestion.id].mastery}%
            </Mono>
          </div>
          <ProgressBar
            value={progress.topics[suggestion.id].mastery}
            label={`${suggestion.title} mastery`}
            className="mt-4"
          />
          <div className="mt-4">
            <ActionButton
              variant="text"
              label="Practice this unit"
              onClick={() => practiseUnit(suggestion.id)}
            />
          </div>
        </section>
      ) : null}

      <section aria-labelledby="streak-title" className="border-t border-line pt-10">
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

      {noDataYet ? (
        <p className="text-body text-muted">
          Nothing recorded yet. Progress, mastery lines and weekly activity stay empty until you
          answer a set.
        </p>
      ) : (
        <section aria-labelledby="all-time-title" className="border-t border-line pt-10">
          <Label className="text-muted">
            <span id="all-time-title">All time</span>
          </Label>
          <div className="mt-5 flex flex-wrap gap-x-16 gap-y-6">
            <p>
              <Mono className="text-[1.5rem] leading-none">{progress.totalPractised}</Mono>
              <span className="mt-2 block text-meta text-muted">questions answered</span>
            </p>
            <p>
              <Mono className="text-[1.5rem] leading-none">
                {Math.round((progress.totalCorrect / Math.max(1, progress.totalPractised)) * 100)}%
              </Mono>
              <span className="mt-2 block text-meta text-muted">answered correctly</span>
            </p>
          </div>
          <Lead className="mt-8 text-meta">
            Keep the set short and regular; mastery moves with accuracy, not volume.
          </Lead>
        </section>
      )}
    </Screen>
  );
}
