'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStudy } from '@/components/providers/study-provider';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { FOCUS_TOPICS, TOPIC_MAP, type TopicId } from '@/data/topics';
import { todayAccuracy, weakestTopicIds } from '@/lib/progress';

function greetingForHour(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomePage() {
  const { progress, startSession } = useStudy();
  const router = useRouter();

  const weakIds = weakestTopicIds(progress, 3);
  const weakTopics = weakIds.map((id) => TOPIC_MAP[id]);
  const accuracy = todayAccuracy(progress);
  const remaining = Math.max(0, progress.dailyTarget - progress.answeredToday);
  const greeting = greetingForHour(new Date().getHours());

  const beginAdaptive = () => {
    const total = startSession(weakIds, { count: 10, fill: true });
    if (total > 0) router.push('/session');
  };

  const beginFocus = (topicId: TopicId) => {
    const total = startSession([topicId], { count: 10 });
    if (total > 0) router.push('/session');
  };

  return (
    <div className="pt-2 lg:pt-0">
      <div className="flex items-center justify-between gap-3 pb-4">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-1.5 text-label-sm tracking-[0.06em] text-ink-muted">
            <span>A/L PHYSICS 2025</span>
            <span className="h-0.5 w-0.5 rounded-full bg-border-strong" aria-hidden="true" />
            <span>ENG MEDIUM</span>
          </p>
          <h1
            suppressHydrationWarning
            className="mt-0.5 font-display text-headline-md leading-[30px] tracking-[-0.3px] text-ink"
          >
            {greeting}, Nimal
          </h1>
        </div>
        <div className="relative shrink-0">
          <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-surface bg-primary font-display text-[18px] text-white">
            N
          </span>
          <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-canvas bg-green" aria-hidden="true" />
        </div>
      </div>

      <section
        aria-labelledby="hero-title"
        className="relative overflow-hidden rounded-card bg-gradient-to-br from-indigo-mid to-primary p-5 shadow-hero"
      >
        <span
          aria-hidden="true"
          className="absolute -right-6 -bottom-8 h-44 w-44 rounded-full border border-white/[0.07] bg-white/[0.025]"
        />
        <span aria-hidden="true" className="absolute top-4 right-12 h-28 w-28 rounded-full bg-white/[0.02]" />

        <div className="relative flex items-center justify-between gap-2">
          <span className="rounded-full border border-white/10 bg-white/20 px-2.5 py-0.5 font-display text-[10px] font-medium tracking-[0.08em] text-white">
            ADAPTIVE FOCUS
          </span>
          <span className="inline-flex items-center gap-1 text-[10.5px] text-white/80">
            <Icon name="clock" size={14} />~15 mins
          </span>
        </div>

        <h2
          id="hero-title"
          className="relative mt-3 font-display text-[20px] leading-[26px] tracking-[-0.3px] text-white"
        >
          Practise your weak topics
        </h2>
        <p className="relative mt-1 text-body-md text-white/85">
          Targeting {weakTopics[0].title} &amp; {weakTopics[1].title} based on your recent errors.
        </p>

        <div className="relative mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={beginAdaptive}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-tile bg-white font-display text-[15px] font-semibold text-primary transition-colors hover:bg-[#EDF0FF] active:bg-[#E0E4FF]"
          >
            Start
            <Icon name="play" size={16} />
          </button>
          <span className="grid h-12 shrink-0 place-items-center rounded-tile border border-white/15 bg-white/10 px-3.5 font-display text-[11.5px] font-medium text-white">
            10 questions
          </span>
        </div>
      </section>

      <section aria-labelledby="today-title" className="mt-6">
        <div className="flex items-end justify-between gap-2">
          <h2 id="today-title" className="font-display text-headline-sm text-ink">
            Today&apos;s progress
          </h2>
          <p className="font-display text-label-sm font-medium text-indigo-mid">
            Daily Target: {progress.dailyTarget} Qs
          </p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <article className="flex min-h-[150px] flex-col rounded-card border border-border bg-surface p-4">
            <div className="flex items-center justify-between gap-1">
              <h3 className="text-label-sm tracking-[0.06em] text-ink-muted">ANSWERED</h3>
              <Icon name="check-circle" size={18} className="shrink-0 text-indigo-mid" />
            </div>
            <p className="mt-2 font-display text-display-lg leading-[40px] text-ink">
              {progress.answeredToday}
              <span className="font-display text-[17px] text-ink-muted"> / {progress.dailyTarget}</span>
            </p>
            <p className="mt-auto pt-1 font-display text-[10.5px] text-ink-muted">
              {remaining === 0 ? 'Daily target reached' : `${remaining} questions left`}
            </p>
            <ProgressBar
              value={(progress.answeredToday / progress.dailyTarget) * 100}
              height={8}
              label="Daily questions answered"
              className="mt-2"
            />
          </article>

          <article className="flex min-h-[150px] flex-col rounded-card border border-border bg-surface p-4">
            <div className="flex items-center justify-between gap-1">
              <h3 className="text-label-sm tracking-[0.06em] text-ink-muted">ACCURACY</h3>
              <Icon name="insights" size={18} className="shrink-0 text-green-ink" />
            </div>
            <p className="mt-2 font-display text-display-lg leading-[40px] text-ink">{accuracy}%</p>
            <p className="mt-auto flex items-center gap-1 pt-1 text-[10.5px] text-ink-muted">
              <Icon name="trend-up" size={14} className="text-green-ink" />
              {progress.correctToday} of {progress.answeredToday} correct
            </p>
            <ProgressBar
              value={accuracy}
              tone="green"
              height={8}
              label="Accuracy today"
              className="mt-2"
            />
          </article>
        </div>
      </section>

      <section aria-labelledby="attention-title" className="mt-6">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 id="attention-title" className="flex items-center gap-1.5 font-display text-headline-sm text-ink">
              <Icon name="warning" size={17} className="text-amber-ink" />
              Needs attention
            </h2>
            <p className="mt-0.5 text-body-sm text-ink-muted">High-yield topics with low accuracy</p>
          </div>
          <Link
            href="/practice"
            className="inline-flex min-h-11 shrink-0 items-center px-1 font-display text-label-md text-primary"
          >
            See all
          </Link>
        </div>

        <ul className="mt-3 space-y-2.5">
          {FOCUS_TOPICS.map((topic) => (
            <li key={topic.title}>
              <button
                type="button"
                onClick={() => beginFocus(topic.topicId)}
                className="flex w-full items-stretch gap-3 overflow-hidden rounded-tile border border-border bg-surface pr-3 pl-0 text-left transition-colors hover:bg-canvas"
              >
                <span className="w-1 shrink-0 bg-amber" aria-hidden="true" />
                <span className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 py-3">
                  <span className="font-display text-[15px] leading-[20px] font-semibold text-ink">
                    {topic.title}
                  </span>
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <Chip label={`Accuracy ${topic.accuracy}%`} tone="amber" />
                    <span className="text-label-sm text-ink-muted">{topic.unitLabel}</span>
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end justify-center gap-1 py-3">
                  <span className="font-display text-[11.5px] font-semibold text-amber-ink">
                    {topic.due} due
                  </span>
                  <span className="text-[10px] tracking-[0.05em] uppercase text-ink-muted">
                    {topic.tag}
                  </span>
                </span>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-container text-primary">
                  <Icon name="chevron-right" size={16} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <Link
        href="/practice"
        className="mt-6 flex items-center justify-between gap-2.5 rounded-tile border border-border bg-surface-low p-3 transition-colors hover:bg-surface-container"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-tile bg-primary/10 text-primary">
            <Icon name="calendar" size={17} />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-[11px] font-semibold text-primary">
              G.C.E. A/L Examination
            </span>
            <span className="block truncate text-[11px] text-ink-muted">
              Target exam scheduled in 118 days
            </span>
          </span>
        </span>
        <span className="shrink-0 rounded-tile border border-border bg-surface px-2 py-1.5 font-display text-[10.5px] font-semibold text-primary">
          Revise Fast
        </span>
      </Link>
    </div>
  );
}
