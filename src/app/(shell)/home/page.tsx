'use client';

import { useRouter } from 'next/navigation';
import { useStudy } from '@/components/study-provider';
import { ActionButton } from '@/components/button';
import { Label, Lead, Mono } from '@/components/type';
import { PageHead, Screen } from '@/components/page';
import { ProgressBar } from '@/components/progress-bar';
import { StreakTicks } from '@/components/streak';
import { weakestTopicIds } from '@/lib/progress';
import { useAuth } from '@/lib/auth-context';

function greetingForHour(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomePage() {
  const { progress, startSession } = useStudy();
  const { user } = useAuth();
  const router = useRouter();

  const dailyPercent = Math.min(100, (progress.answeredToday / progress.dailyTarget) * 100);
  const remaining = Math.max(0, progress.dailyTarget - progress.answeredToday);
  const greeting = greetingForHour(new Date().getHours());
  const noDataYet = progress.totalPractised === 0;

  const displayName = user?.user_metadata?.full_name
    ? (user.user_metadata.full_name as string).split(' ')[0]
    : (user?.email?.split('@')[0] ?? 'there');

  const begin = () => {
    const total = startSession(weakestTopicIds(progress, 3), { count: 10, fill: true });
    if (total > 0) router.push('/session');
  };

  return (
    <Screen>
      <PageHead
        label="Ten questions a day"
        title={`${greeting}, ${displayName}.`}
        lead={
          noDataYet
            ? 'Your record starts with the first set. Nothing is scored yet.'
            : 'Continue where your weakest units left off.'
        }
      />

      <div>
        <ActionButton label="Start practice" onClick={begin} />
      </div>

      <div className="grid gap-10 border-t border-line pt-10 sm:grid-cols-2 sm:gap-16">
        <section aria-labelledby="streak-title">
          <Label className="text-muted">
            <span id="streak-title">Streak</span>
          </Label>
          <StreakTicks streak={progress.streak} className="mt-5" />
        </section>

        <section aria-labelledby="today-title">
          <Label className="text-muted">
            <span id="today-title">Today</span>
          </Label>
          <p className="mt-5 text-[1.75rem] leading-none">
            <Mono>{progress.answeredToday}</Mono>
            <Mono className="text-muted"> / {progress.dailyTarget}</Mono>
          </p>
          <ProgressBar
            value={dailyPercent}
            label="Daily questions answered"
            className="mt-5"
          />
          <p className="mt-3 text-meta text-muted">
            {noDataYet
              ? 'No questions answered yet.'
              : remaining === 0
                ? 'Daily target reached.'
                : `${remaining} questions left today.`}
          </p>
        </section>
      </div>

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
