import katex from 'katex';
import { describe, expect, it } from 'vitest';
import { QUESTIONS } from './questions';
import { TOPIC_MAP } from './topics';

describe('question bank', () => {
  it('has unique ids', () => {
    const ids = QUESTIONS.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every question five options and an in-range answer', () => {
    QUESTIONS.forEach((question) => {
      expect(question.options, question.id).toHaveLength(5);
      expect(question.answer, question.id).toBeGreaterThanOrEqual(0);
      expect(question.answer, question.id).toBeLessThan(5);
      expect(question.options[question.answer], question.id).toBeTruthy();
    });
  });

  it('points every question at a real syllabus unit', () => {
    QUESTIONS.forEach((question) => {
      expect(TOPIC_MAP[question.topicId], question.id).toBeDefined();
    });
  });

  it('ships a worked derivation with a plain-text and KaTeX formula per step', () => {
    QUESTIONS.forEach((question) => {
      expect(question.steps.length, question.id).toBeGreaterThanOrEqual(3);
      question.steps.forEach((step) => {
        expect(step.label, question.id).toBeTruthy();
        expect(step.formula, question.id).toBeTruthy();
        expect(step.latex, question.id).toBeTruthy();
      });
    });
  });

  it('renders every KaTeX formula without a parse error', () => {
    QUESTIONS.forEach((question) => {
      question.steps.forEach((step) => {
        expect(
          () =>
            katex.renderToString(step.latex, {
              throwOnError: true,
              displayMode: true,
              strict: false,
            }),
          `${question.id}: ${step.latex}`,
        ).not.toThrow();
      });
    });
  });

  it('emphasises at least one value in each stem', () => {
    QUESTIONS.forEach((question) => {
      expect(question.stem, question.id).toContain('**');
    });
  });
});
