import { describe, expect, it } from 'vitest';
import {
  EM_2024_ANSWER_KEY,
  EM_2024_MCQ_COUNT,
  PAST_PAPER_QUESTIONS,
} from './past-papers';

describe('past-paper image bank', () => {
  it('builds one item per scan, each with a scan, five options and a video', () => {
    expect(PAST_PAPER_QUESTIONS).toHaveLength(EM_2024_MCQ_COUNT);

    PAST_PAPER_QUESTIONS.forEach((question) => {
      expect(question.questionImageUrl, question.id).toMatch(
        /^\/past-papers\/em-2024\/EM_2024_Physics_MCQ_q\d{2}\.png$/,
      );
      expect(question.options, question.id).toHaveLength(5);
      expect(question.videoUrl, question.id).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=/);
    });
  });

  it('turns each filled-in key entry into a 0-based option index', () => {
    PAST_PAPER_QUESTIONS.forEach((question, index) => {
      const printed = EM_2024_ANSWER_KEY[index] ?? null;
      expect(question.answer, question.id).toBe(printed === null ? null : printed - 1);
    });
  });
});
