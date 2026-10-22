import { QUESTION_MAP } from './questions';
import { TOPIC_MAP, TOPICS, type TopicId } from './topics';
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

/** Build the per-user progress key. Falls back to a guest key. */
export function progressStorageKey(userId?: string | null): string {
  return userId ? `progress:${userId}` : 'bhauthika.progress.guest';
}

/** Legacy key that must be removed on first run so old seed data does not bleed in. */
export const LEGACY_PROGRESS_KEY = 'bhauthika.progress.v1';

const SESSION_STORAGE_KEY = 'bhauthika.session.v1';
const RESULT_STORAGE_KEY = 'bhauthika.result.v1';

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
 * zero-start profile instead of throwing. Returns null when the blob is unusable.
 */
export function parseStoredProgress(raw: string): StudyProgress | null {
  const value = parseJson(raw);
  if (!isRecord(value)) return null;

  const seed = createSeedProgress();
  const storedTopics = isRecord(value.topics) ? value.topics : {};

  const topics = TOPICS.reduce(
    (acc, topic) => {
      const stored = storedTopics[topic.id];
      const topicValue = isRecord(stored) ? stored : {};
      acc[topic.id] = {
        mastery: clampPercent(finiteNumber(topicValue.mastery, 0)),
        solved: Math.max(0, Math.round(finiteNumber(topicValue.solved, 0))),
      } satisfies TopicProgress;
      return acc;
    },
    {} as Record<TopicId, TopicProgress>,
  );

  const weeklyRaw = value.weeklyActivity;
  const weeklyActivity: number[] = Array.isArray(weeklyRaw)
    ? weeklyRaw.slice(0, 7).map((v) => Math.max(0, Math.round(finiteNumber(v, 0))))
    : [0, 0, 0, 0, 0, 0, 0];
  while (weeklyActivity.length < 7) weeklyActivity.push(0);

  return {
    streak: Math.max(0, Math.round(finiteNumber(value.streak, 0))),
    dailyTarget: Math.max(1, Math.round(finiteNumber(value.dailyTarget, seed.dailyTarget))),
    answeredToday: Math.max(0, Math.round(finiteNumber(value.answeredToday, 0))),
    correctToday: Math.max(0, Math.round(finiteNumber(value.correctToday, 0))),
    totalPractised: Math.max(0, Math.round(finiteNumber(value.totalPractised, 0))),
    totalCorrect: Math.max(0, Math.round(finiteNumber(value.totalCorrect, 0))),
    pastPapers: Math.max(0, Math.round(finiteNumber(value.pastPapers, 0))),
    monthlyDelta: finiteNumber(value.monthlyDelta, 0),
    topics,
    weeklyActivity,
    lastActiveDate: typeof value.lastActiveDate === 'string' ? value.lastActiveDate : undefined,
  };
}

/** Session hand-off stored in sessionStorage so a refresh keeps the set. */
interface StoredSession {
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

function parseStoredResult(raw: string): SessionResult | null {
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

/**
 * JSON-over-Web-Storage persistence.
 */
class JsonStorageRepository<T> {
  private storage: KeyValueStorage | null;

  constructor(
    kind: 'local' | 'session',
    private key: string,
    private readonly parse: (raw: string) => T | null,
    storage?: KeyValueStorage | null,
  ) {
    this.storage = storage === undefined ? readStorage(kind) : storage;
  }

  /** Change the storage key (used when the userId becomes known). */
  setKey(key: string) {
    this.key = key;
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

export class LocalProgressRepository extends JsonStorageRepository<StudyProgress> {
  constructor(key = progressStorageKey(), storage?: KeyValueStorage | null) {
    super('local', key, parseStoredProgress, storage);
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

/** Remove the legacy v1 key once at app start. Fire-and-forget. */
export function removeLegacyProgressKey(): void {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(LEGACY_PROGRESS_KEY);
  } catch {
    // Nothing to recover.
  }
}
