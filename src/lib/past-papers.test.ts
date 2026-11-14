import { describe, expect, it } from 'vitest';
import {
  EM_2022_ANSWER_KEY,
  EM_2022_MCQ_COUNT,
  EM_2024_ANSWER_KEY,
  EM_2024_MCQ_COUNT,
  PAST_PAPER_QUESTIONS,
} from './past-papers';

const PAPERS = [
  { year: 2022, count: EM_2022_MCQ_COUNT, key: EM_2022_ANSWER_KEY },
  { year: 2024, count: EM_2024_MCQ_COUNT, key: EM_2024_ANSWER_KEY },
];

describe('past-paper image bank', () => {
  it('builds one item per scan for every paper, each with a scan, five options and a video', () => {
    expect(PAST_PAPER_QUESTIONS).toHaveLength(EM_2022_MCQ_COUNT + EM_2024_MCQ_COUNT);

    PAPERS.forEach((paper) => {
      const items = PAST_PAPER_QUESTIONS.filter((question) => question.year === paper.year);
      expect(items, String(paper.year)).toHaveLength(paper.count);

      items.forEach((question, index) => {
        expect(question.questionImageUrl, question.id).toBe(
          `/past-papers/em-${paper.year}/EM_${paper.year}_Physics_MCQ_q${String(index + 1).padStart(2, '0')}.png`,
        );
        expect(question.options, question.id).toHaveLength(5);
        expect(question.videoUrl, question.id).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=/);
      });
    });
  });

  it('keeps ids unique across papers', () => {
    const ids = PAST_PAPER_QUESTIONS.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('turns each filled-in key entry into a 0-based option index', () => {
    PAPERS.forEach((paper) => {
      const items = PAST_PAPER_QUESTIONS.filter((question) => question.year === paper.year);
      items.forEach((question, index) => {
        const printed = paper.key[index] ?? null;
        expect(question.answer, question.id).toBe(printed === null ? null : printed - 1);
      });
    });
  });
});
