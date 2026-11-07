import { QUESTIONS, type Question } from './questions';

/** Where the scanned paper images are served from (public/past-papers). */
const EM_2024_DIR = '/past-papers/em-2024';

/** Fifty MCQs in the 2024 English-medium Paper I. */
export const EM_2024_MCQ_COUNT = 50;

/** The five options as numbered on the paper; the wording lives in the image. */
const OPTION_NUMBERS = ['1', '2', '3', '4', '5'];

/** Public path of the scan for one question number (1-based). */
export function em2024ImageUrl(number: number): string {
  return `${EM_2024_DIR}/EM_2024_Physics_MCQ_q${String(number).padStart(2, '0')}.png`;
}

/**
 * One question per scanned MCQ, built from the image files rather than written
 * by hand. The stem, option wording and derivation all sit inside the scan, so
 * an item only carries the five option numbers. The answer key has not been
 * entered yet: `answer` stays null, and these items are recorded but not marked.
 */
export const PAST_PAPER_QUESTIONS: Question[] = Array.from(
  { length: EM_2024_MCQ_COUNT },
  (_, index): Question => {
    const number = index + 1;
    return {
      id: `em-2024-q${String(number).padStart(2, '0')}`,
      year: 2024,
      paper: 'Paper I',
      number,
      stem: '',
      options: [...OPTION_NUMBERS],
      answer: null,
      hint: '',
      steps: [],
      questionImageUrl: em2024ImageUrl(number),
    };
  },
);

/** Every question the app can draw from: past-paper images first. */
export const QUESTION_BANK: Question[] = [...PAST_PAPER_QUESTIONS, ...QUESTIONS];

export const QUESTION_BANK_MAP: Record<string, Question> = QUESTION_BANK.reduce(
  (acc, question) => ({ ...acc, [question.id]: question }),
  {} as Record<string, Question>,
);
