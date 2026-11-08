'use client';

import { useRouter } from 'next/navigation';
import { useStudy } from '@/components/study-provider';
import { ActionButton } from '@/components/button';
import { Label, Lead, Mono } from '@/components/type';
import { PageHead, Screen } from '@/components/page';
import { StreakDisplay } from '@/components/streak';
import { weakestTopicIds } from '@/lib/progress';
import { useAuth } from '@/lib/auth-context';
import { displayNameFor } from '@/lib/account';

function greetingForHour(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomePage() {
  const { progress, streak, startSession } = useStudy();
  const { user } = useAuth();
  const router = useRouter();

  const greeting = greetingForHour(new Date().getHours());
  const noDataYet = progress.totalPractised === 0;

  const displayName = displayNameFor(user);

  const begin = () => {
    const total = startSession(weakestTopicIds(progress, 3), {
      count: 10,
      fill: true,
      mode: 'mixed',
    });
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
