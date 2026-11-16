import { describe, expect, it } from 'vitest';
import {
  EM_2021_ANSWER_KEY,
  EM_2021_MCQ_COUNT,
  EM_2022_ANSWER_KEY,
  EM_2022_MCQ_COUNT,
  EM_2023_ANSWER_KEY,
  EM_2023_MCQ_COUNT,
  EM_2024_ANSWER_KEY,
  EM_2024_MCQ_COUNT,
  EM_2021_UNITS,
  EM_2022_UNITS,
  EM_2023_UNITS,
  EM_2024_UNITS,
  EM_2025_ANSWER_KEY,
  EM_2025_MCQ_COUNT,
  EM_2025_UNITS,
  EM_2025_VIDEO_IDS,
  PAST_PAPER_QUESTIONS,
  PLACEHOLDER_VIDEO_URL,
} from './past-papers';
import type { TopicId } from './topics';

const PAPERS = [
  { year: 2021, count: EM_2021_MCQ_COUNT, key: EM_2021_ANSWER_KEY },
  { year: 2022, count: EM_2022_MCQ_COUNT, key: EM_2022_ANSWER_KEY },
  { year: 2023, count: EM_2023_MCQ_COUNT, key: EM_2023_ANSWER_KEY },
  { year: 2024, count: EM_2024_MCQ_COUNT, key: EM_2024_ANSWER_KEY },
  { year: 2025, count: EM_2025_MCQ_COUNT, key: EM_2025_ANSWER_KEY },
];

describe('past-paper image bank', () => {
  it('builds one item per scan for every paper, each with a scan, five options and a video', () => {
    expect(PAST_PAPER_QUESTIONS).toHaveLength(
      EM_2021_MCQ_COUNT +
      EM_2022_MCQ_COUNT +
      EM_2023_MCQ_COUNT +
      EM_2024_MCQ_COUNT +
      EM_2025_MCQ_COUNT,
    );

    PAPERS.forEach((paper) => {
      const items = PAST_PAPER_QUESTIONS.filter((question) => question.year === paper.year);
      expect(items, String(paper.year)).toHaveLength(paper.count);

      items.forEach((question, index) => {
        expect(question.questionImageUrl, question.id).toBe(
          `/past-papers/em-${paper.year}/EM_${paper.year}_Physics_MCQ_q${String(index + 1).padStart(2, '0')}.webp`,
        );
        expect(question.options, question.id).toHaveLength(5);
        expect(question.videoUrl, question.id).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=/);
      });
    });
  });

  it('carries the supplied 2025 walkthrough videos and leaves the rest unset', () => {
    const items = PAST_PAPER_QUESTIONS.filter((question) => question.year === 2025);
    const ids = Object.keys(EM_2025_VIDEO_IDS).map(Number).sort((a, b) => a - b);

    ids.forEach((number) => {
      expect(items[number - 1].videoUrl, String(number)).toBe(
        `https://www.youtube.com/watch?v=${EM_2025_VIDEO_IDS[number]}`,
      );
    });

    expect(
      items.slice(ids.length).every((question) => question.videoUrl === PLACEHOLDER_VIDEO_URL),
    ).toBe(true);
  });

  it('gives each scan the unit its paper map names, and nothing where it names none', () => {
    const maps: [number, Readonly<Record<number, TopicId>>][] = [
      [2021, EM_2021_UNITS],
      [2022, EM_2022_UNITS],
      [2023, EM_2023_UNITS],
      [2024, EM_2024_UNITS],
      [2025, EM_2025_UNITS],
    ];

    maps.forEach(([year, units]) => {
      const items = PAST_PAPER_QUESTIONS.filter((question) => question.year === year);
      const entries = Object.entries(units);

      entries.forEach(([number, unit]) => {
        expect(items[Number(number) - 1].topicId, `${year} q${number}`).toBe(unit);
      });
      // A number the map does not name stays untagged rather than defaulting.
      expect(items.filter((question) => question.topicId === undefined)).toHaveLength(
        items.length - entries.length,
      );
    });
  });

  it('keeps ids unique across papers', () => {
    const ids = PAST_PAPER_QUESTIONS.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('turns each filled-in key entry into a 0-based option index', () => {
    PAPERS.forEach((paper) => {
      // An entry per question, so a short key cannot silently unmark a tail.
      expect(paper.key, String(paper.year)).toHaveLength(paper.count);

      const items = PAST_PAPER_QUESTIONS.filter((question) => question.year === paper.year);
      items.forEach((question, index) => {
        const printed = paper.key[index] ?? null;

        if (printed === 'all') {
          // The table prints "ALL" where every option was accepted.
          expect(question.acceptedAnswers, question.id).toEqual([0, 1, 2, 3, 4]);
          expect(question.answer, question.id).toBeNull();
          return;
        }

        if (printed !== null && typeof printed === 'object') {
          // A printed pair such as "02/04" accepts both options.
          expect(question.acceptedAnswers, question.id).toEqual(printed.map((n) => n - 1));
          expect(question.answer, question.id).toBeNull();
          return;
        }

        expect(question.acceptedAnswers, question.id).toBeUndefined();
        expect(question.answer, question.id).toBe(printed === null ? null : printed - 1);
      });
    });
  });
});
