import type { Question } from '@/data/questions';
import { TOPIC_MAP, type TopicId } from '@/data/topics';
import { clampPercent, type StudyProgress, type TopicProgress } from './progress';

export interface ActiveSession {
  questions: Question[];
  index: number;
  /** Selected option per question; null until answered. */
  answers: (number | null)[];
}

export interface SessionTopicResult {
  topicId: TopicId;
  title: string;
  total: number;
  correct: number;
  accuracy: number;
  delta: number;
}

export interface SessionResult {
  correct: number;
  total: number;
  points: number;
  topics: SessionTopicResult[];
}

export interface PickQuestionsOptions {
  /** Restrict the primary draw to these units, or 'all'. */
  topicIds?: readonly TopicId[] | 'all';
  count?: number;
  /** Injectable random source so tests are deterministic. */
  rng?: () => number;
  /** Top up from the rest of the bank when the primary pool is too small. */
  fill?: boolean;
}

/** Fisher–Yates on a copy; the input array is never mutated. */
export function shuffle<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const a = copy[i];
    const b = copy[j];
    copy[i] = b;
    copy[j] = a;
  }
  return copy;
}

/**
 * Draws a practice set. When `fill` is on and the chosen units do not hold
 * enough questions, the rest of the bank tops the set up to `count`.
 */
export function pickQuestions(
  pool: readonly Question[],
  { topicIds = 'all', count = 10, rng = Math.random, fill = false }: PickQuestionsOptions = {},
): Question[] {
  const limit = Math.max(0, Math.floor(count));
  const allowed = topicIds === 'all' ? null : new Set<TopicId>(topicIds);
  const primary = allowed ? pool.filter((question) => allowed.has(question.topicId)) : [...pool];
  const picked = shuffle(primary, rng).slice(0, limit);

  if (fill && picked.length < limit) {
    const pickedIds = new Set(picked.map((question) => question.id));
    const rest = shuffle(
      pool.filter((question) => !pickedIds.has(question.id)),
      rng,
    );
    picked.push(...rest.slice(0, limit - picked.length));
  }

  return picked;
}

/**
 * Mastery is a weighted blend of the previous value and this session's
 * accuracy: 70% prior, 30% new evidence, so one bad set cannot sink a unit.
 */
export function updateMastery(previous: number, accuracy: number, weight = 0.3): number {
  const w = Math.min(1, Math.max(0, weight));
  const prior = clampPercent(previous);
  const evidence = clampPercent(accuracy);
  const blended = prior * (1 - w) + evidence * w;
  // Trim binary float noise (43.4999… → 43.5) before rounding half up.
  return Math.round(Number(blended.toFixed(6)));
}

/**
 * Folds a finished session into progress: mastery per unit, volume counters,
 * the weekly pacing series and the daily streak numbers.
 */
export function applySessionResult(
  progress: StudyProgress,
  questions: readonly Question[],
  answers: readonly (number | null)[],
): { progress: StudyProgress; result: SessionResult } {
  const total = questions.length;
  let correct = 0;
  const byTopic = new Map<TopicId, { total: number; correct: number }>();

  questions.forEach((question, index) => {
    const entry = byTopic.get(question.topicId) ?? { total: 0, correct: 0 };
    entry.total += 1;
    if (answers[index] === question.answer) {
      entry.correct += 1;
      correct += 1;
    }
    byTopic.set(question.topicId, entry);
  });

  const topics = { ...progress.topics };
  const topicResults: SessionTopicResult[] = [];

  byTopic.forEach((stats, topicId) => {
    const accuracy = Math.round((stats.correct / stats.total) * 100);
    const current: TopicProgress = progress.topics[topicId] ?? {
      mastery: TOPIC_MAP[topicId].mastery,
      solved: 0,
    };
    const mastery = updateMastery(current.mastery, accuracy);
    topics[topicId] = { mastery, solved: current.solved + stats.total };
    topicResults.push({
      topicId,
      title: TOPIC_MAP[topicId].title,
      total: stats.total,
      correct: stats.correct,
      accuracy,
      delta: mastery - current.mastery,
    });
  });

  topicResults.sort((a, b) => b.accuracy - a.accuracy);

  const weekly = [...progress.weekly];
  if (progress.todayIndex >= 0 && progress.todayIndex < weekly.length) {
    weekly[progress.todayIndex] += total;
  }

  const nextProgress: StudyProgress = {
    ...progress,
    answeredToday: progress.answeredToday + total,
    correctToday: progress.correctToday + correct,
    totalPractised: progress.totalPractised + total,
    totalCorrect: progress.totalCorrect + correct,
    weekly,
    topics,
  };

  return {
    progress: nextProgress,
    result: {
      correct,
      total,
      points: correct * 15 + (correct > 0 ? 15 : 0),
      topics: topicResults,
    },
  };
}
