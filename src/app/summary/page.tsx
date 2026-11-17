'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStudy } from '@/components/study-provider';
import { ActionButton } from '@/components/button';
import { Label, Mono } from '@/components/type';
import { TopicRow } from '@/components/topic-row';
import { answerLabel, isCorrectChoice, type Question } from '@/lib/questions';
import { cn } from '@/lib/utils';

/** Exam clock in minutes and seconds, hours only when a paper runs that long. */
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return hours > 0
    ? `${hours}h ${String(minutes).padStart(2, '0')}m`
    : `${minutes}m ${String(rest).padStart(2, '0')}s`;
}

export default function SummaryPage() {
  const { result, startSession, startQuestions, questions } = useStudy();
  const router = useRouter();

  if (!result) {
    return (
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-narrow px-5 py-20 sm:px-8">
        <Label className="text-muted">Summary</Label>
        <h1 className="mt-6 text-title font-medium text-ink">No set finished yet.</h1>
        <p className="mt-6 text-body text-muted">
          Complete a practice set and your score appears here.
        </p>
        <div className="mt-10 space-y-4">
          <ActionButton label="Choose a unit" onClick={() => router.push('/practice')} />
          <ActionButton label="Back to home" variant="text" onClick={() => router.push('/home')} />
        </div>
      </main>
    );
  }

  // Weak topics first: the units that scored lowest in this set.
  const weakTopics = [...result.topics].sort((a, b) => a.accuracy - b.accuracy).slice(0, 3);
  // An exam paper carries every pick, so the answers can be revealed here.
  const review = result.review ?? [];
  const questionsById = new Map(questions.map((question) => [question.id, question]));

  const practiseAgain = () => {
    const total = startSession('all', { count: result.total, fill: true });
    if (total > 0) router.replace('/session');
  };

  // An exam paper carries its own questions, so it can be sat again as printed.
  const sitAgain = () => {
    const paper = review
      .map((item) => questionsById.get(item.questionId))
      .filter((question): question is Question => Boolean(question));
    if (startQuestions(paper, { exam: true }) > 0) router.replace('/session');
  };

  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-narrow px-5 py-10 sm:px-8">
      <header className="flex items-baseline justify-between gap-4">
        <Label className="text-muted">Set complete</Label>
        <Link
          href="/home"
          className="font-mono text-label tracking-[0.14em] text-muted uppercase transition-colors hover:text-ink"
        >
          Close
        </Link>
      </header>

      {result.total > 0 ? (
        <>
          <p className="mt-12 text-numeral font-mono text-ink tabular-nums">
            {result.correct}
            <Mono className="text-muted"> / {result.total}</Mono>
          </p>
          <p className="mt-4 text-body text-muted">
            {result.correct} of {result.total} correct in this set.
          </p>
        </>
      ) : (
        <>
          <p className="mt-12 text-numeral font-mono text-ink tabular-nums">{result.answered}</p>
          <p className="mt-4 text-body text-muted">
            {result.answered} {result.answered === 1 ? 'answer' : 'answers'} recorded. This paper
            has no answer key yet, so nothing is marked.
          </p>
        </>
      )}
      {result.total > 0 && result.answered < result.total ? (
        <p className="mt-2 text-meta text-muted">
          {result.total - result.answered} left unanswered, counted as incorrect.
        </p>
      ) : null}
      {result.durationSeconds ? (
        <p className="mt-2 font-mono text-meta text-muted tabular-nums">
          Time {formatDuration(result.durationSeconds)}
        </p>
      ) : null}

      {review.length > 0 ? (
        <section aria-labelledby="answers-title" className="mt-16">
          <h2 id="answers-title" className="text-[1.125rem] leading-[1.3] font-medium text-ink">
            Your answers
          </h2>
          <ul className="mt-6 border-b border-line">
            {review.map((item, itemIndex) => {
              const question = questionsById.get(item.questionId);
              if (!question) return null;
              const right = isCorrectChoice(question, item.chosen);
              return (
                <li
                  key={`${item.questionId}-${itemIndex}`}
                  className="border-t border-line py-3"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-mono text-meta text-muted tabular-nums">
                      Q{String(question.number).padStart(2, '0')}
                    </span>
                    <span
                      className={cn(
                        'font-mono text-label tracking-[0.14em] uppercase',
                        right ? 'text-correct' : 'text-wrong',
                      )}
                    >
                      {right ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="mt-1 text-meta text-muted">
                    You chose{' '}
                    <span className="font-mono text-ink tabular-nums">
                      {item.chosen === null ? '—' : item.chosen + 1}
                    </span>{' '}
                    · Answer{' '}
                    <span className="font-mono text-ink">{answerLabel(question) ?? '—'}</span>
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="weak-title" className="mt-16">
        <h2 id="weak-title" className="text-[1.125rem] leading-[1.3] font-medium text-ink">
          Weak topics
        </h2>
        {weakTopics.length > 0 ? (
          <ul className="mt-6 border-b border-line">
            {weakTopics.map((topic, index) => (
              <li key={topic.topicId}>
                <TopicRow
                  number={String(index + 1).padStart(2, '0')}
                  title={topic.title}
                  meta={`${topic.correct} of ${topic.total} correct`}
                  value={`${topic.accuracy}%`}
                  percent={topic.accuracy}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-body text-muted">Nothing to revisit from this set.</p>
        )}
      </section>

      <div className="mt-16 space-y-3">
        {review.length > 0 ? (
          <ActionButton label="Sit this paper again" onClick={sitAgain} />
        ) : (
          <ActionButton label="Practice again" onClick={practiseAgain} />
        )}
        <ActionButton
          label="Back to home"
          variant="text"
          className="w-full"
          onClick={() => router.push('/home')}
        />
      </div>
    </main>
  );
}
