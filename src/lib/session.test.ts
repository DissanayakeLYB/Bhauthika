import { describe, expect, it } from 'vitest';
import { QUESTIONS, type Question } from '@/data/questions';
import type { TopicId } from '@/data/topics';
import { applySessionResult, pickQuestions, shuffle, updateMastery } from './session';
import { createSeedProgress } from './progress';

function question(id: string, topicId: TopicId, answer = 0): Question {
  return {
    id,
    topicId,
    year: 2020,
    paper: 'Paper I',
    number: 1,
    stem: 'stem',
    options: ['a', 'b', 'c', 'd', 'e'],
    answer,
    hint: 'hint',
    steps: [],
  };
}

const pool: Question[] = [
  question('c1', 'current'),
  question('c2', 'current'),
  question('c3', 'current'),
  question('m1', 'mechanics'),
  question('m2', 'mechanics'),
  question('w1', 'waves'),
];

describe('pickQuestions', () => {
  it('draws the requested number of unique questions', () => {
    const picked = pickQuestions(QUESTIONS, { count: 10 });
    expect(picked).toHaveLength(10);
    expect(new Set(picked.map((item) => item.id)).size).toBe(10);
  });

  it('respects the topic filter', () => {
    const picked = pickQuestions(pool, { topicIds: ['current'], count: 10 });
    expect(picked).toHaveLength(3);
    expect(picked.every((item) => item.topicId === 'current')).toBe(true);
  });

  it('tops up from the rest of the bank when fill is on', () => {
    const picked = pickQuestions(pool, { topicIds: ['waves'], count: 4, fill: true });
    expect(picked).toHaveLength(4);
    expect(picked.filter((item) => item.topicId === 'waves')).toHaveLength(1);
    expect(new Set(picked.map((item) => item.id)).size).toBe(4);
  });

  it('never returns more than the pool holds', () => {
    const picked = pickQuestions(pool, { topicIds: ['waves'], count: 10 });
    expect(picked).toHaveLength(1);
  });

  it('does not mutate the source pool', () => {
    const before = pool.map((item) => item.id);
    pickQuestions(pool, { count: 4 });
    expect(pool.map((item) => item.id)).toEqual(before);
  });

  it('is deterministic for a fixed random source', () => {
    const first = pickQuestions(pool, { count: 4, rng: () => 0.42 });
    const second = pickQuestions(pool, { count: 4, rng: () => 0.42 });
    expect(first.map((item) => item.id)).toEqual(second.map((item) => item.id));
  });

  it('handles a zero count and an empty pool', () => {
    expect(pickQuestions(pool, { count: 0 })).toEqual([]);
    expect(pickQuestions([], { count: 5, fill: true })).toEqual([]);
  });
});

describe('shuffle', () => {
  it('keeps every element', () => {
    const input = [1, 2, 3, 4, 5];
    expect(shuffle(input, () => 0.9).sort()).toEqual([1, 2, 3, 4, 5]);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('updateMastery', () => {
  it('blends 70% prior with 30% session accuracy', () => {
    expect(updateMastery(42, 100)).toBe(59);
    expect(updateMastery(80, 0)).toBe(56);
  });

  it('rounds to a whole percentage', () => {
    expect(updateMastery(48, 33)).toBe(44);
  });

  it('clamps out-of-range input', () => {
    expect(updateMastery(120, 100)).toBe(100);
    expect(updateMastery(-10, -50)).toBe(0);
  });

  it('supports a custom weight', () => {
    expect(updateMastery(40, 90, 1)).toBe(90);
    expect(updateMastery(40, 90, 0)).toBe(40);
  });
});

describe('applySessionResult', () => {
  it('scores the set, moves mastery and advances the weekly series', () => {
    const progress = createSeedProgress();
    const seedMastery = progress.topics.current.mastery;
    const seedSolved = progress.topics.current.solved;

    const session = [
      question('c1', 'current', 2),
      question('c2', 'current', 1),
      question('c3', 'current', 0),
    ];
    const { progress: next, result } = applySessionResult(progress, session, [2, 1, 0]);

    expect(result.correct).toBe(3);
    expect(result.total).toBe(3);
    expect(result.points).toBe(3 * 15 + 15);
    expect(result.topics).toHaveLength(1);
    expect(result.topics[0]).toMatchObject({
      topicId: 'current',
      title: 'Current Electricity',
      total: 3,
      correct: 3,
      accuracy: 100,
    });
    expect(result.topics[0].delta).toBe(updateMastery(seedMastery, 100) - seedMastery);

    expect(next.topics.current.mastery).toBe(updateMastery(seedMastery, 100));
    expect(next.topics.current.solved).toBe(seedSolved + 3);
    expect(next.answeredToday).toBe(progress.answeredToday + 3);
    expect(next.correctToday).toBe(progress.correctToday + 3);
    expect(next.totalPractised).toBe(progress.totalPractised + 3);
    expect(next.totalCorrect).toBe(progress.totalCorrect + 3);
    expect(next.weekly[progress.todayIndex]).toBe(
      progress.weekly[progress.todayIndex] + 3,
    );
  });

  it('treats unanswered questions as incorrect', () => {
    const progress = createSeedProgress();
    const { result } = applySessionResult(
      progress,
      [question('m1', 'mechanics'), question('m2', 'mechanics')],
      [null, null],
    );
    expect(result.correct).toBe(0);
    expect(result.points).toBe(0);
    expect(result.topics[0].accuracy).toBe(0);
  });

  it('groups a mixed set by topic and sorts by accuracy', () => {
    const progress = createSeedProgress();
    const session = [
      question('c1', 'current', 0),
      question('m1', 'mechanics', 0),
      question('m2', 'mechanics', 0),
      question('c2', 'current', 0),
    ];
    const { result } = applySessionResult(progress, session, [0, 1, 1, 1]);

    expect(result.topics.map((topic) => topic.topicId)).toEqual(['current', 'mechanics']);
    expect(result.topics[0].correct).toBe(1);
    expect(result.topics[1].correct).toBe(0);
  });

  it('does not touch the original progress object', () => {
    const progress = createSeedProgress();
    const snapshot = structuredClone(progress);
    applySessionResult(progress, [question('c1', 'current')], [0]);
    expect(progress).toEqual(snapshot);
  });

  it('handles an empty session safely', () => {
    const progress = createSeedProgress();
    const { progress: next, result } = applySessionResult(progress, [], []);
    expect(next).toEqual(progress);
    expect(result).toMatchObject({ correct: 0, total: 0, points: 0, topics: [] });
  });
});
