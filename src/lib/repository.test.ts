import { describe, expect, it } from 'vitest';
import { createSeedProgress } from './progress';
import {
  LocalProgressRepository,
  LocalResultRepository,
  LocalSessionRepository,
  PROGRESS_STORAGE_KEY,
  parseStoredProgress,
  parseStoredSession,
  type KeyValueStorage,
} from './repository';

class MemoryStorage implements KeyValueStorage {
  private readonly map = new Map<string, string>();

  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }

  removeItem(key: string): void {
    this.map.delete(key);
  }
}

class BrokenStorage implements KeyValueStorage {
  getItem(): string | null {
    throw new Error('blocked');
  }

  setItem(): void {
    throw new Error('blocked');
  }

  removeItem(): void {
    throw new Error('blocked');
  }
}

describe('LocalProgressRepository', () => {
  it('round-trips a progress snapshot', async () => {
    const storage = new MemoryStorage();
    const repository = new LocalProgressRepository(storage);
    const progress = createSeedProgress();
    progress.topics.current.mastery = 71;
    progress.streak = 9;

    await repository.save(progress);
    const loaded = await repository.load();

    expect(loaded?.topics.current.mastery).toBe(71);
    expect(loaded?.streak).toBe(9);
    expect(loaded?.weekly).toEqual(progress.weekly);
  });

  it('returns null when nothing is stored', async () => {
    await expect(new LocalProgressRepository(new MemoryStorage()).load()).resolves.toBeNull();
  });

  it('clears the stored snapshot', async () => {
    const storage = new MemoryStorage();
    const repository = new LocalProgressRepository(storage);
    await repository.save(createSeedProgress());
    expect(storage.getItem(PROGRESS_STORAGE_KEY)).not.toBeNull();

    await repository.clear();
    expect(storage.getItem(PROGRESS_STORAGE_KEY)).toBeNull();
    await expect(repository.load()).resolves.toBeNull();
  });

  it('degrades quietly when storage throws', async () => {
    const repository = new LocalProgressRepository(new BrokenStorage());
    await expect(repository.load()).resolves.toBeNull();
    await expect(repository.save(createSeedProgress())).resolves.toBeUndefined();
    await expect(repository.clear()).resolves.toBeUndefined();
  });

  it('returns null when no storage is available (SSR)', async () => {
    await expect(new LocalProgressRepository(null).load()).resolves.toBeNull();
  });
});

describe('parseStoredProgress', () => {
  it('rejects unreadable blobs', () => {
    expect(parseStoredProgress('not json')).toBeNull();
    expect(parseStoredProgress('[]')).toBeNull();
    expect(parseStoredProgress('null')).toBeNull();
  });

  it('heals missing fields with the seed profile', () => {
    const parsed = parseStoredProgress(JSON.stringify({ streak: 12 }));
    const seed = createSeedProgress();
    expect(parsed?.streak).toBe(12);
    expect(parsed?.dailyTarget).toBe(seed.dailyTarget);
    expect(parsed?.topics.current).toEqual(seed.topics.current);
    expect(parsed?.weekly).toEqual(seed.weekly);
  });

  it('clamps out-of-range values', () => {
    const parsed = parseStoredProgress(
      JSON.stringify({
        topics: { current: { mastery: 250, solved: -4 } },
        todayIndex: 99,
        dailyTarget: 0,
        weekly: [1, 2, 3],
      }),
    );
    expect(parsed?.topics.current.mastery).toBe(100);
    expect(parsed?.topics.current.solved).toBe(0);
    expect(parsed?.todayIndex).toBe(6);
    expect(parsed?.dailyTarget).toBe(1);
    expect(parsed?.weekly).toHaveLength(7);
  });
});

describe('session and result repositories', () => {
  it('round-trips the active session', async () => {
    const storage = new MemoryStorage();
    const repository = new LocalSessionRepository(storage);
    const session = {
      questionIds: ['ce-potentiometer', 'me-stopping'],
      index: 1,
      answers: [0, null],
    };

    await repository.save(session);
    await expect(repository.load()).resolves.toEqual(session);
  });

  it('drops sessions that point at unknown questions', () => {
    expect(
      parseStoredSession(
        JSON.stringify({ questionIds: ['deleted-question'], index: 0, answers: [null] }),
      ),
    ).toBeNull();
  });

  it('drops malformed sessions', () => {
    expect(parseStoredSession(JSON.stringify({ questionIds: [], index: 0, answers: [] }))).toBeNull();
    expect(
      parseStoredSession(JSON.stringify({ questionIds: ['me-stopping'], index: 0, answers: [] })),
    ).toBeNull();
  });

  it('clamps a stored index into range', () => {
    const parsed = parseStoredSession(
      JSON.stringify({ questionIds: ['me-stopping'], index: 8, answers: [null] }),
    );
    expect(parsed?.index).toBe(0);
  });

  it('round-trips a session result and rejects emptiness', async () => {
    const storage = new MemoryStorage();
    const repository = new LocalResultRepository(storage);
    const result = {
      correct: 7,
      total: 10,
      points: 120,
      topics: [
        {
          topicId: 'current' as const,
          title: 'Current Electricity',
          total: 4,
          correct: 3,
          accuracy: 75,
          delta: 4,
        },
      ],
    };

    await repository.save(result);
    await expect(repository.load()).resolves.toEqual(result);

    storage.setItem('bhauthika.result.v1', JSON.stringify({ correct: 0, total: 0 }));
    await expect(repository.load()).resolves.toBeNull();
  });
});
