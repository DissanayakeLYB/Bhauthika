'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudy } from '@/components/study-provider';
import { ActionButton } from '@/components/button';
import { PageHead, Screen } from '@/components/page';
import { TopicRow } from '@/components/topic-row';
import { Label } from '@/components/type';
import type { Question } from '@/lib/questions';
import { shuffle } from '@/lib/session';
import { supabase } from '@/lib/supabase';
import { TOPIC_MAP } from '@/lib/topics';
import { cn } from '@/lib/utils';

/** The columns this page needs from `attempts`. */
interface AttemptRow {
  questionId: string;
  isCorrect: boolean;
}

interface ReviewItem {
  question: Question;
  /** How many times this question was answered wrongly. */
  wrongAttempts: number;
}

type Tab = 'wrong' | 'marked';

/** A review set is never longer than this. */
const PRACTICE_LIMIT = 10;

/** Shown in place of the list; the technical cause goes to the console. */
const LOAD_ERROR = 'Check your connection and try again.';

const pad = (value: number) => String(value).padStart(2, '0');

export default function ReviewPage() {
  const { questions, bookmarks, startQuestions } = useStudy();
  const router = useRouter();

  const [attempts, setAttempts] = useState<AttemptRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('wrong');
  // Bumped by "Try again": the effect below fetches once per value.
  const [reloadToken, setReloadToken] = useState(0);

  // Fetched once when the page opens; the latest row per question decides.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('attempts')
          .select('question_id, is_correct, created_at')
          .order('created_at', { ascending: false });
        if (cancelled) return;

        if (fetchError) {
          console.error('[review] attempts fetch failed:', fetchError.message);
          setAttempts(null);
          setError(LOAD_ERROR);
        } else {
          const rows = (data ?? []) as Array<{ question_id?: unknown; is_correct?: unknown }>;
          setAttempts(
            rows.flatMap((row) =>
              typeof row.question_id === 'string'
                ? [{ questionId: row.question_id, isCorrect: row.is_correct === true }]
                : [],
            ),
          );
          setError(null);
        }
      } catch (cause) {
        // No network at all: the query rejects instead of returning an error.
        console.error('[review] attempts fetch failed:', cause);
        if (cancelled) return;
        setAttempts(null);
        setError(LOAD_ERROR);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const retry = () => {
    setLoading(true);
    setError(null);
    setReloadToken((token) => token + 1);
  };

  const byId = useMemo(
    () => new Map(questions.map((question) => [question.id, question])),
    [questions],
  );

  const { wrong, marked } = useMemo(() => {
    const latest = new Map<string, AttemptRow>();
    const wrongCounts = new Map<string, number>();

    for (const row of attempts ?? []) {
      if (!latest.has(row.questionId)) latest.set(row.questionId, row);
      if (!row.isCorrect) {
        wrongCounts.set(row.questionId, (wrongCounts.get(row.questionId) ?? 0) + 1);
      }
    }

    const wrongItems: ReviewItem[] = [];
    latest.forEach((row, id) => {
      if (row.isCorrect) return;
      const question = byId.get(id);
      // A paper with no answer key stores every answer as not correct; those
      // attempts were never marked, so they are not mistakes.
      if (!question || question.answer === null) return;
      wrongItems.push({ question, wrongAttempts: wrongCounts.get(id) ?? 1 });
    });

    const markedItems: ReviewItem[] = [];
    const seen = new Set<string>();
    // Newest mark first.
    for (const id of [...bookmarks].reverse()) {
      if (seen.has(id)) continue;
      const question = byId.get(id);
      if (!question) continue;
      seen.add(id);
      markedItems.push({ question, wrongAttempts: 0 });
    }

    return { wrong: wrongItems, marked: markedItems };
  }, [attempts, byId, bookmarks]);

  const hasAny = wrong.length > 0 || marked.length > 0;
  const items = tab === 'wrong' ? wrong : marked;

  const practiseOne = (question: Question) => {
    if (startQuestions([question]) === 0) return;
    router.push('/session');
  };

  const practiseMistakes = () => {
    // Wrong and marked together, in random order, at most one set long.
    const pool = new Map<string, Question>();
    for (const item of [...wrong, ...marked]) pool.set(item.question.id, item.question);
    const picked = shuffle([...pool.values()]).slice(0, PRACTICE_LIMIT);
    if (startQuestions(picked) === 0) return;
    router.push('/session');
  };

  return (
    <Screen>
      <PageHead label="Review" title="Your mistakes." />

      {loading ? (
        <p role="status" aria-live="polite" className="text-body text-muted">
          Loading your review list…
        </p>
      ) : error ? (
        <div className="border-t border-line pt-10">
          <p role="alert" className="text-meta text-wrong">
            Could not load your answers. {error}
          </p>
          <ActionButton
            label="Try again"
            variant="text"
            className="mt-4 min-h-0 text-meta"
            onClick={retry}
          />
        </div>
      ) : !hasAny ? (
        <p className="border-t border-line pt-10 max-w-[46ch] text-body text-muted">
          Nothing to review yet. Questions you get wrong or mark will appear here.
        </p>
      ) : (
        <section aria-labelledby="review-lists-title" className="space-y-8">
          <h2 id="review-lists-title" className="sr-only">
            Review lists
          </h2>

          <div role="group" aria-label="Review lists" className="flex items-baseline gap-8">
            <TabButton
              label="Wrong"
              count={wrong.length}
              active={tab === 'wrong'}
              onClick={() => setTab('wrong')}
            />
            <TabButton
              label="Marked"
              count={marked.length}
              active={tab === 'marked'}
              onClick={() => setTab('marked')}
            />
          </div>

          <ActionButton label="Practice my mistakes" onClick={practiseMistakes} />

          {items.length > 0 ? (
            <ul className="border-b border-line">
              {items.map((item) => {
                const question = item.question;
                const unit = question.topicId ? TOPIC_MAP[question.topicId] : null;
                const exam = `${question.year} ${question.paper}`;
                const wrongLabel = `${item.wrongAttempts} wrong ${
                  item.wrongAttempts === 1 ? 'attempt' : 'attempts'
                }`;
                // A unit row keeps the paper it came from; a scan already
                // names its paper in the title.
                const meta = [unit ? exam : null, tab === 'wrong' ? wrongLabel : null]
                  .filter(Boolean)
                  .join(' · ');

                return (
                  <li key={question.id}>
                    <TopicRow
                      number={pad(question.number)}
                      title={unit ? unit.title : exam}
                      meta={meta || undefined}
                      onClick={() => practiseOne(question)}
                    />
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="border-t border-line pt-8 text-meta text-muted">
              {tab === 'wrong'
                ? 'No wrong answers right now.'
                : 'Nothing marked for review yet.'}
            </p>
          )}
        </section>
      )}
    </Screen>
  );
}

/** Text tab with its count in the mono face. */
function TabButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'min-h-11 transition-colors hover:text-ink',
        active ? 'text-ink' : 'text-muted',
      )}
    >
      <Label className={cn(active && 'underline underline-offset-[6px] decoration-line')}>
        {label} ({count})
      </Label>
    </button>
  );
}
