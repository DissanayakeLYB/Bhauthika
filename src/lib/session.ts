import { hasAnswerKey, isCorrectChoice, type Question } from '@/lib/questions';
import { TOPIC_MAP, type TopicId } from '@/lib/topics';
import { clampPercent, type StudyProgress, type TopicProgress } from './progress';

export interface ActiveSession {
  questions: Question[];
  index: number;
  /** Selected option per question; null until answered. */
  answers: (number | null)[];
  /** Exam mode: nothing is revealed until the set is finished. */
  exam?: boolean;
  /** Epoch ms the set started, so the finished paper can report its time. */
  startedAt?: number;
}

export interface SessionTopicResult {
  topicId: TopicId;
  title: string;
  total: number;
  correct: number;
  accuracy: number;
}

/** One answered question, kept so an exam paper can be revealed at the end. */
export interface SessionAnswerReview {
  questionId: string;
  chosen: number | null;
}

export interface SessionResult {
  correct: number;
  /** Questions that carried an answer key and were therefore marked. */
  total: number;
  /** Answers recorded, including items whose answer key is still pending. */
  answered: number;
  points: number;
  topics: SessionTopicResult[];
  /** Exam runs only: every question with the option this student picked. */
  review?: SessionAnswerReview[];
  /** Exam runs only: how long the paper took, in seconds. */
  durationSeconds?: number;
}

interface PickQuestionsOptions {
  /** Restrict the primary draw to these units, or 'all'. */
  topicIds?: readonly TopicId[] | 'all';
  count?: number;
  /** Injectable random source so tests are deterministic. */
  rng?: () => number;
  /** Top up from the rest of the bank when the primary pool is too small. */
  fill?: boolean;
  /** Restrict the draw to one exam year, e.g. a single past paper. */
  year?: number;
  /** Keep the pool's own order (a paper as printed) instead of shuffling it. */
  ordered?: boolean;
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
  { topicIds = 'all', count = 10, rng = Math.random, fill = false, year, ordered = false }: PickQuestionsOptions = {},
): Question[] {
  const limit = Math.max(0, Math.floor(count));
  const inYear = year === undefined ? [...pool] : pool.filter((question) => question.year === year);
  const allowed = topicIds === 'all' ? null : new Set<TopicId>(topicIds);
  const primary = allowed
    ? inYear.filter((question) => question.topicId !== undefined && allowed.has(question.topicId))
    : inYear;
  // A paper is sat as printed: same questions, same order, no draw.
  const drawn = ordered ? [...primary].sort((a, b) => a.number - b.number) : shuffle(primary, rng);
  const picked = drawn.slice(0, limit);

  if (fill && picked.length < limit) {
    const pickedIds = new Set(picked.map((question) => question.id));
    const rest = shuffle(
      inYear.filter((question) => !pickedIds.has(question.id)),
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
 * Folds a finished session into progress: mastery per unit and the volume
 * counters behind the Progress screen.
 */
export function applySessionResult(
  progress: StudyProgress,
  questions: readonly Question[],
  answers: readonly (number | null)[],
): { progress: StudyProgress; result: SessionResult } {
  // A paper can be finished early, so count the answers actually given.
  const answered = answers.filter((answer) => answer !== null).length;
  let correct = 0;
  let scored = 0;
  const byTopic = new Map<TopicId, { total: number; correct: number }>();

  questions.forEach((question, index) => {
    // An answer with no key is recorded but never marked, so it counts towards
    // neither accuracy nor mastery.
    if (!hasAnswerKey(question)) return;
    scored += 1;
    const right = isCorrectChoice(question, answers[index] ?? null);
    if (right) correct += 1;
    // Past-paper scans span units, so they score above but only a tagged item
    // moves a unit's mastery.
    if (question.topicId === undefined) return;
    const entry = byTopic.get(question.topicId) ?? { total: 0, correct: 0 };
    entry.total += 1;
    if (right) entry.correct += 1;
    byTopic.set(question.topicId, entry);
  });

  const topics = { ...progress.topics };
  const topicResults: SessionTopicResult[] = [];

  byTopic.forEach((stats, topicId) => {
    const accuracy = Math.round((stats.correct / stats.total) * 100);
    const current: TopicProgress = progress.topics[topicId] ?? {
      mastery: 0,
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
    });
  });

  topicResults.sort((a, b) => b.accuracy - a.accuracy);

  const nextProgress: StudyProgress = {
    ...progress,
    answeredToday: progress.answeredToday + answered,
    correctToday: progress.correctToday + correct,
    // Both totals count marked answers only, so accuracy stays a true ratio.
    totalPractised: progress.totalPractised + scored,
    totalCorrect: progress.totalCorrect + correct,
    topics,
  };

  return {
    progress: nextProgress,
    result: {
      correct,
      total: scored,
      answered,
      points: correct * 15 + (correct > 0 ? 15 : 0),
      topics: topicResults,
    },
  };
}
