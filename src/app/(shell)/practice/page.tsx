'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudy } from '@/components/study-provider';
import { Chip, type ChipTone } from '@/components/chip';
import { Icon } from '@/components/icon';
import { ProgressBar } from '@/components/progress-bar';
import { TOPICS, masteryStatus, type MasteryStatus, type Topic, type TopicId } from '@/lib/topics';
import { weakestTopicIds } from '@/lib/progress';
import { cn } from '@/lib/utils';

type Mode = 'topic' | 'mix';

const statusLabel: Record<MasteryStatus, { label: string; tone: ChipTone }> = {
  mastered: { label: 'Mastered', tone: 'green' },
  strong: { label: 'Strong', tone: 'green' },
  focus: { label: 'Needs focus', tone: 'amber' },
};

function masteryTone(mastery: number) {
  if (mastery >= 78) return 'text-green-ink';
  if (mastery < 50) return 'text-amber-ink';
  return 'text-primary';
}

function barTone(mastery: number): 'green' | 'amber' | 'primary' {
  if (mastery >= 78) return 'green';
  if (mastery < 50) return 'amber';
  return 'primary';
}

export default function PracticePage() {
  const { progress, startSession } = useStudy();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('topic');
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const averageMastery = useMemo(
    () => Math.round(TOPICS.reduce((sum, topic) => sum + progress.topics[topic.id].mastery, 0) / TOPICS.length),
    [progress.topics],
  );

  const weakTopics = useMemo(
    () => weakestTopicIds(progress, 3).map((id) => TOPICS.find((topic) => topic.id === id)!),
    [progress],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return TOPICS;
    return TOPICS.filter(
      (topic) =>
        topic.title.toLowerCase().includes(needle) ||
        topic.unitLabel.toLowerCase().includes(needle),
    );
  }, [query]);

  const begin = (topicIds: readonly TopicId[], fill = false) => {
    const total = startSession(topicIds, { count: 10, fill });
    if (total === 0) {
      setNotice('No curated past-paper questions for this unit yet — coming soon.');
      return;
    }
    setNotice(null);
    router.push('/session');
  };

  const beginTopic = (topic: Topic) => begin([topic.id]);

  return (
    <div className="pt-2 lg:pt-0">
      <div className="flex items-center justify-between gap-2">
        <h1 className="font-display text-headline-lg text-primary">Practice</h1>
        <Chip label="MCQ Unit-Bank" />
      </div>
      <p className="mt-0.5 mb-3.5 text-body-sm text-ink-muted">Sri Lankan A/L Physics Syllabus</p>

      <div
        role="group"
        aria-label="Practice mode"
        className="mb-3 flex gap-1 rounded-tile bg-surface-container p-1"
      >
        <button
          type="button"
          aria-pressed={mode === 'mix'}
          onClick={() => setMode('mix')}
          className={cn(
            'flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-[0.5rem] font-display text-label-md transition-colors',
            mode === 'mix'
              ? 'bg-surface font-semibold text-primary shadow-card'
              : 'text-ink-muted hover:text-ink',
          )}
        >
          Smart mix
          <span className="rounded-full bg-amber-soft px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.05em] text-amber-ink">
            REC
          </span>
        </button>
        <button
          type="button"
          aria-pressed={mode === 'topic'}
          onClick={() => setMode('topic')}
          className={cn(
            'flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-[0.5rem] font-display text-label-md transition-colors',
            mode === 'topic'
              ? 'bg-surface font-semibold text-primary shadow-card'
              : 'text-ink-muted hover:text-ink',
          )}
        >
          Choose topic
          {mode === 'topic' ? <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" /> : null}
        </button>
      </div>

      {notice ? (
        <p
          role="status"
          className="mb-3 rounded-tile border border-amber/25 bg-amber-soft px-3 py-2 text-body-sm text-amber-ink"
        >
          {notice}
        </p>
      ) : null}

      {mode === 'topic' ? (
        <>
          <div className="flex h-11 items-center gap-2 rounded-tile bg-surface px-3 ring-1 ring-border ring-inset focus-within:ring-primary/50">
            <Icon name="search" size={19} className="shrink-0 text-ink-faint" />
            <label htmlFor="topic-search" className="sr-only">
              Search physics topics or concepts
            </label>
            <input
              id="topic-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search topics or concepts…"
              className="h-full min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-muted [&::-webkit-search-cancel-button]:appearance-none"
              autoComplete="off"
            />
            {query.length > 0 ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-muted hover:bg-surface-container"
              >
                <Icon name="close" size={16} />
              </button>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-tile border border-border bg-surface px-3 py-2.5">
            <span className="flex items-center gap-1.5">
              <Icon name="verified" size={17} className="shrink-0 text-indigo-mid" />
              <span className="font-display text-label-md whitespace-nowrap text-ink">
                {TOPICS.length} Syllabus Units
              </span>
            </span>
            <span className="font-display text-label-sm font-medium text-indigo-mid">
              Average Mastery: {averageMastery}%
            </span>
          </div>

          <ul className="mt-3 grid gap-2.5 lg:grid-cols-2">
            {filtered.map((topic) => {
              const mastery = progress.topics[topic.id].mastery;
              const status = masteryStatus(mastery);
              return (
                <li key={topic.id}>
                  <button
                    type="button"
                    onClick={() => beginTopic(topic)}
                    className="w-full rounded-card border border-border bg-surface p-3.5 text-left shadow-card transition-colors hover:border-primary/30"
                  >
                    <span className="flex flex-wrap items-center justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface-container font-display text-[10px] font-semibold text-ink-muted">
                          {topic.number}
                        </span>
                        <span className="font-display text-[15px] leading-5 font-semibold text-ink">
                          {topic.title}
                        </span>
                      </span>
                      <span className="flex shrink-0 flex-wrap items-center gap-1">
                        {status ? (
                          <Chip
                            label={statusLabel[status].label}
                            tone={statusLabel[status].tone}
                            icon={status === 'mastered' ? 'check-circle' : undefined}
                          />
                        ) : null}
                        <Chip label={`${topic.questionCount} Qs`} />
                      </span>
                    </span>
                    <span className="mt-2.5 flex items-center justify-between gap-2">
                      <span className="text-label-sm text-ink-muted">Topic Mastery</span>
                      <span className={cn('font-display text-[12px] font-semibold', masteryTone(mastery))}>
                        {mastery}%
                      </span>
                    </span>
                    <ProgressBar
                      value={mastery}
                      tone={barTone(mastery)}
                      label={`${topic.title} mastery`}
                      className="mt-1.5"
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          {filtered.length === 0 ? (
            <div className="mt-6 flex flex-col items-center gap-1.5 rounded-card border border-dashed border-border-strong bg-surface px-4 py-8 text-center">
              <Icon name="search" size={26} className="text-ink-muted" />
              <p className="font-display text-headline-sm text-primary">No matching topics</p>
              <p className="text-body-sm text-ink-muted">Try “current”, “waves” or “field”.</p>
            </div>
          ) : null}
        </>
      ) : (
        <div className="space-y-3">
          <div className="rounded-card border border-border bg-surface p-4 shadow-card">
            <Chip label="Smart mix · recommended" tone="indigo" icon="sparkle" uppercase />
            <h2 className="mt-3 font-display text-headline-sm text-ink">Your three weakest units</h2>
            <p className="mt-1 text-body-md text-ink-muted">
              A balanced 10-question set drawn from the units where your recent accuracy dropped.
            </p>
            <ul className="mt-3 divide-y divide-border">
              {weakTopics.map((topic) => (
                <li key={topic.id} className="flex items-center justify-between gap-2 py-2.5">
                  <span className="min-w-0">
                    <span className="block truncate font-display text-label-lg text-ink">
                      {topic.title}
                    </span>
                    <span className="block text-label-sm text-ink-muted">
                      {progress.topics[topic.id].solved} questions solved
                    </span>
                  </span>
                  <span className={cn('shrink-0 font-display text-[12px] font-semibold', masteryTone(progress.topics[topic.id].mastery))}>
                    {progress.topics[topic.id].mastery}%
                  </span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => begin(weakTopics.map((topic) => topic.id), true)}
              className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-tile bg-primary font-display text-[15px] font-semibold text-white transition-colors hover:bg-primary-pressed"
            >
              Start Smart Mix
              <Icon name="arrow-right" size={19} />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-tile border border-border bg-surface px-3 py-2.5">
            <span className="flex items-center gap-1.5">
              <Icon name="verified" size={17} className="shrink-0 text-indigo-mid" />
              <span className="font-display text-label-md whitespace-nowrap text-ink">
                {TOPICS.length} Syllabus Units
              </span>
            </span>
            <span className="font-display text-label-sm font-medium text-indigo-mid">
              Average Mastery: {averageMastery}%
            </span>
          </div>

          <p className="px-1 text-body-sm text-ink-muted">
            Or switch to <span className="font-semibold text-ink">Choose topic</span> to drill a single
            unit.
          </p>
        </div>
      )}
    </div>
  );
}
