'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStudy } from '@/components/study-provider';
import { Chip, type ChipTone } from '@/components/chip';
import { Icon } from '@/components/icon';
import { ProgressBar } from '@/components/progress-bar';
import { countQuestionsForTopic } from '@/lib/questions';
import { TOPICS } from '@/lib/topics';
import { overallAccuracy } from '@/lib/progress';
import { cn } from '@/lib/utils';

function reviewStatus(mastery: number): { label: string; tone: ChipTone } {
  if (mastery >= 80) return { label: 'Mastered', tone: 'green' };
  if (mastery >= 65) return { label: 'On Track', tone: 'neutral' };
  if (mastery >= 55) return { label: 'In Review', tone: 'neutral' };
  return { label: 'Needs Focus', tone: 'amber' };
}

export default function ProgressPage() {
  const { progress, startSession } = useStudy();
  const router = useRouter();

  const accuracy = overallAccuracy(progress);
  const noDataYet = progress.totalPractised === 0;
  const sortedTopics = useMemo(
    () =>
      [...TOPICS].sort(
        (a, b) => progress.topics[a.id].mastery - progress.topics[b.id].mastery,
      ),
    [progress.topics],
  );
  const weakest = sortedTopics[0];
  const drillCount = countQuestionsForTopic(weakest.id);

  const drill = () => {
    const total = startSession([weakest.id], { count: 10 });
    if (total > 0) router.push('/session');
  };

  return (
    <div className="pt-2 pb-4 lg:pt-0">
      <div className="flex items-center justify-between gap-2">
        <h1 className="min-w-0 font-display text-headline-lg leading-8 tracking-[-0.5px] text-primary">
          Progress &amp; Mastery
        </h1>
        <span className="shrink-0 rounded-full border border-border bg-[#e1e0ff]/60 px-2.5 py-1 font-display text-[10.5px] font-semibold text-primary">
          Live Track
        </span>
      </div>
      <p className="mt-0.5 mb-3.5 text-body-sm text-ink-muted">A/L Physics 2025 · English Medium</p>

      {noDataYet ? (
        <p className="mb-3.5 rounded-card border border-dashed border-border-strong bg-surface px-4 py-5 text-center text-body-sm text-ink-muted">
          No practice data yet. Answer your first set and your mastery bars will fill in here.
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <article className="flex min-h-[116px] flex-col justify-between rounded-tile border border-border bg-surface p-3.5">
          <div className="flex items-center justify-between gap-1.5">
            <h2 className="min-w-0 text-label-sm text-ink-muted">Overall Accuracy</h2>
            <Icon name="verified" size={17} className="shrink-0 text-primary" />
          </div>
          <p className="mt-1.5 font-display text-[26px] leading-[34px] tracking-[-0.6px] text-primary">
            {accuracy}%
          </p>
          {noDataYet ? null : (
            <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-green-ink">
              <Icon name="trend-up" size={15} />
              +{progress.monthlyDelta}% this month
            </p>
          )}
        </article>

        <article className="flex min-h-[116px] flex-col justify-between rounded-tile border border-border bg-surface p-3.5">
          <div className="flex items-center justify-between gap-1.5">
            <h2 className="min-w-0 text-label-sm text-ink-muted">Total Practised</h2>
            <Icon name="check-circle" size={17} className="shrink-0 text-ink-faint" />
          </div>
          <p className="mt-1.5 font-display text-[26px] leading-[34px] tracking-[-0.6px] text-primary">
            {progress.totalPractised} Qs
          </p>
          <p className="mt-1 flex items-center gap-1 text-[10px] text-ink-muted">
            <Icon name="document" size={14} />
            {progress.pastPapers} Past papers
          </p>
        </article>
      </div>

      <div className="mt-6 mb-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="font-display text-headline-sm text-ink">Topic Mastery</h2>
          <p className="text-body-sm text-ink-muted">Weakest topics prioritized</p>
        </div>
        <Chip label="Needs attention first" tone="amber" icon="tune" className="shrink-0" />
      </div>

      <ul className="grid gap-2.5 lg:grid-cols-2">
        {sortedTopics.map((topic) => {
          const { mastery, solved } = progress.topics[topic.id];
          const status = reviewStatus(mastery);
          const tone = mastery < 55 ? 'amber' : mastery >= 80 ? 'green' : 'primary';
          const toneText =
            mastery < 55 ? 'text-amber-ink' : mastery >= 80 ? 'text-green-ink' : 'text-primary';
          return (
            <li key={topic.id}>
              <button
                type="button"
                onClick={() => {
                  const total = startSession([topic.id], { count: 10 });
                  if (total > 0) router.push('/session');
                }}
                className="w-full rounded-card border border-border bg-surface p-3.5 text-left transition-colors hover:border-primary/30"
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="min-w-0">
                    <span className="block text-[9.5px] tracking-[0.06em] text-ink-muted uppercase">
                      {topic.unitLabel}
                    </span>
                    <span className="block font-display text-[15px] leading-[21px] font-semibold text-ink">
                      {topic.title}
                    </span>
                  </span>
                  <Chip label={status.label} tone={status.tone} className="shrink-0" />
                </span>
                <span className="mt-2.5 flex items-center justify-between gap-2">
                  <span className="text-label-sm text-ink-muted">{solved} Questions solved</span>
                  <span className={cn('font-display text-[12px] font-semibold', toneText)}>
                    {mastery}% Mastery
                  </span>
                </span>
                <ProgressBar
                  value={mastery}
                  tone={tone}
                  height={8}
                  label={`${topic.title} mastery`}
                  className="mt-2"
                />
              </button>
            </li>
          );
        })}
      </ul>

      <section className="relative mt-6 overflow-hidden rounded-card bg-primary p-4">
        <span
          aria-hidden="true"
          className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-white/10"
        />
        <div className="relative flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-display text-[9px] font-semibold tracking-[0.07em] text-[#DCDEFF]">
              AI STUDY RECOMMENDATION
            </p>
            <h2 className="font-display text-[15px] font-semibold text-white">
              Boost {weakest.title}
            </h2>
            <p className="mt-0.5 text-[11px] leading-4 text-white/80">
              {drillCount} target questions on this unit are ready in your drill bank.
            </p>
          </div>
          <button
            type="button"
            onClick={drill}
            className="min-h-11 shrink-0 rounded-tile bg-surface px-3 py-2 font-display text-[10.5px] font-semibold text-primary transition-colors hover:bg-[#EDF0FF]"
          >
            Drill Topic
          </button>
        </div>
      </section>
    </div>
  );
}
