import { QUESTION_MAP } from '@/lib/questions';
import { TOPIC_MAP, TOPICS, type TopicId } from '@/lib/topics';
import {
  clampPercent,
  createSeedProgress,
  type StudyProgress,
  type TopicProgress,
} from './progress';
import type { SessionResult, SessionTopicResult } from './session';

/** The subset of the Web Storage API this app needs (easy to stub in tests). */
export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface Repository<T> {
  load(): Promise<T | null>;
  save(value: T): Promise<void>;
  clear(): Promise<void>;
}

/**
 * Persistence boundary for study progress. Phase 2 swaps the local
 * implementation for a Supabase-backed one without touching UI code.
 */
export interface ProgressRepository {
  load(): Promise<StudyProgress | null>;
  save(progress: StudyProgress): Promise<void>;
  clear(): Promise<void>;
}

export const PROGRESS_STORAGE_KEY = 'bhauthika.progress.v1';
export const SESSION_STORAGE_KEY = 'bhauthika.session.v1';
export const RESULT_STORAGE_KEY = 'bhauthika.result.v1';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function finiteNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function readStorage(kind: 'local' | 'session'): KeyValueStorage | null {
  try {
    if (typeof window === 'undefined') return null;
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    // Safari private mode and hardened browsers can throw on access.
    return null;
  }
}

/**
 * Reads a stored progress blob, healing missing or out-of-range fields with the
 * seed profile instead of throwing. Returns null when the blob is unusable.
 */
export function parseStoredProgress(raw: string): StudyProgress | null {
  const value = parseJson(raw);
  if (!isRecord(value)) return null;

  const seed = createSeedProgress();
  const storedTopics = isRecord(value.topics) ? value.topics : {};

  const topics = TOPICS.reduce(
    (acc, topic) => {
      const stored = storedTopics[topic.id];
      const fallback = seed.topics[topic.id];
      const topicValue = isRecord(stored) ? stored : {};
      acc[topic.id] = {
        mastery: clampPercent(finiteNumber(topicValue.mastery, fallback.mastery)),
        solved: Math.max(0, Math.round(finiteNumber(topicValue.solved, fallback.solved))),
      } satisfies TopicProgress;
      return acc;
    },
    {} as Record<TopicId, TopicProgress>,
  );

  const storedWeekly = value.weekly;
  const weekly =
    Array.isArray(storedWeekly) &&
    storedWeekly.length === 7 &&
    storedWeekly.every((day) => typeof day === 'number' && Number.isFinite(day) && day >= 0)
      ? (storedWeekly as number[]).map((day) => Math.round(day))
      : seed.weekly;

  return {
    streak: Math.max(0, Math.round(finiteNumber(value.streak, seed.streak))),
    dailyTarget: Math.max(1, Math.round(finiteNumber(value.dailyTarget, seed.dailyTarget))),
    answeredToday: Math.max(0, Math.round(finiteNumber(value.answeredToday, seed.answeredToday))),
    correctToday: Math.max(0, Math.round(finiteNumber(value.correctToday, seed.correctToday))),
    totalPractised: Math.max(
      0,
      Math.round(finiteNumber(value.totalPractised, seed.totalPractised)),
    ),
    totalCorrect: Math.max(0, Math.round(finiteNumber(value.totalCorrect, seed.totalCorrect))),
    pastPapers: Math.max(0, Math.round(finiteNumber(value.pastPapers, seed.pastPapers))),
    monthlyDelta: finiteNumber(value.monthlyDelta, seed.monthlyDelta),
    weekly,
    todayIndex: Math.min(6, Math.max(0, Math.round(finiteNumber(value.todayIndex, seed.todayIndex)))),
    topics,
  };
}

/** Session hand-off stored in sessionStorage so a refresh keeps the set. */
export interface StoredSession {
  questionIds: string[];
  index: number;
  answers: (number | null)[];
}

export function parseStoredSession(raw: string): StoredSession | null {
  const value = parseJson(raw);
  if (!isRecord(value)) return null;

  const ids = value.questionIds;
  const answers = value.answers;
  if (!Array.isArray(ids) || ids.length === 0) return null;
  if (!ids.every((id) => typeof id === 'string' && Boolean(QUESTION_MAP[id]))) return null;
  if (!Array.isArray(answers) || answers.length !== ids.length) return null;

  const parsedAnswers = answers.map((answer) =>
    typeof answer === 'number' && Number.isInteger(answer) && answer >= 0 ? answer : null,
  );
  const index = Math.min(
    ids.length - 1,
    Math.max(0, Math.trunc(finiteNumber(value.index, 0))),
  );

  return { questionIds: ids as string[], index, answers: parsedAnswers };
}

export function parseStoredResult(raw: string): SessionResult | null {
  const value = parseJson(raw);
  if (!isRecord(value)) return null;

  const total = Math.round(finiteNumber(value.total, 0));
  if (total <= 0) return null;
  const correct = Math.min(total, Math.max(0, Math.round(finiteNumber(value.correct, 0))));

  const topics: SessionTopicResult[] = [];
  if (Array.isArray(value.topics)) {
    value.topics.forEach((entry) => {
      if (!isRecord(entry)) return;
      const topicId = entry.topicId;
      if (typeof topicId !== 'string' || !(topicId in TOPIC_MAP)) return;
      const id = topicId as TopicId;
      const topicTotal = Math.max(0, Math.round(finiteNumber(entry.total, 0)));
      topics.push({
        topicId: id,
        title: TOPIC_MAP[id].title,
        total: topicTotal,
        correct: Math.min(topicTotal, Math.max(0, Math.round(finiteNumber(entry.correct, 0)))),
        accuracy: clampPercent(finiteNumber(entry.accuracy, 0)),
        delta: Math.round(finiteNumber(entry.delta, 0)),
      });
    });
  }

  return {
    correct,
    total,
    points: Math.max(0, Math.round(finiteNumber(value.points, 0))),
    topics,
  };
}

/** Generic JSON-over-Web-Storage repository. Never throws at the call site. */
export class JsonStorageRepository<T> implements Repository<T> {
  private storage: KeyValueStorage | null;

  constructor(
    kind: 'local' | 'session',
    private readonly key: string,
    private readonly parse: (raw: string) => T | null,
    storage?: KeyValueStorage | null,
  ) {
    this.storage = storage === undefined ? readStorage(kind) : storage;
  }

  async load(): Promise<T | null> {
    if (!this.storage) return null;
    try {
      const raw = this.storage.getItem(this.key);
      return raw === null ? null : this.parse(raw);
    } catch {
      return null;
    }
  }

  async save(value: T): Promise<void> {
    try {
      this.storage?.setItem(this.key, JSON.stringify(value));
    } catch {
      // Quota exceeded or storage disabled: practice must keep working.
    }
  }

  async clear(): Promise<void> {
    try {
      this.storage?.removeItem(this.key);
    } catch {
      // Nothing to recover from.
    }
  }
}

/**
 * Phase 1 persistence. Swapping in a Supabase-backed implementation only means
 * passing a different ProgressRepository to the study provider.
 */
export class LocalProgressRepository
  extends JsonStorageRepository<StudyProgress>
  implements ProgressRepository
{
  constructor(storage?: KeyValueStorage | null) {
    super('local', PROGRESS_STORAGE_KEY, parseStoredProgress, storage);
  }
}

export class LocalSessionRepository extends JsonStorageRepository<StoredSession> {
  constructor(storage?: KeyValueStorage | null) {
    super('session', SESSION_STORAGE_KEY, parseStoredSession, storage);
  }
}

export class LocalResultRepository extends JsonStorageRepository<SessionResult> {
  constructor(storage?: KeyValueStorage | null) {
    super('session', RESULT_STORAGE_KEY, parseStoredResult, storage);
  }
}
