import { QUESTIONS, type Question } from './questions';

/** Where the scanned paper images are served from (public/past-papers). */
const EM_2025_DIR = '/past-papers/em-2025';
const EM_2024_DIR = '/past-papers/em-2024';
const EM_2023_DIR = '/past-papers/em-2023';
const EM_2022_DIR = '/past-papers/em-2022';
const EM_2021_DIR = '/past-papers/em-2021';

/** Fifty MCQs in the 2025 English-medium Paper I. */
export const EM_2025_MCQ_COUNT = 50;

/** Fifty MCQs in the 2024 English-medium Paper I. */
export const EM_2024_MCQ_COUNT = 50;

/** Fifty MCQs in the 2023 English-medium Paper I. */
export const EM_2023_MCQ_COUNT = 50;

/** Fifty MCQs in the 2022 English-medium Paper I. */
export const EM_2022_MCQ_COUNT = 50;

/** Fifty MCQs in the 2021 English-medium Paper I. */
export const EM_2021_MCQ_COUNT = 50;

/** The five options as numbered on the paper; the wording lives in the image. */
const OPTION_NUMBERS = ['1', '2', '3', '4', '5'];

/** Public path of the 2025 scan for one question number (1-based). */
export function em2025ImageUrl(number: number): string {
  return `${EM_2025_DIR}/EM_2025_Physics_MCQ_q${String(number).padStart(2, '0')}.webp`;
}

/** Public path of the scan for one question number (1-based). */
export function em2024ImageUrl(number: number): string {
  return `${EM_2024_DIR}/EM_2024_Physics_MCQ_q${String(number).padStart(2, '0')}.webp`;
}

/** Public path of the 2023 scan for one question number (1-based). */
export function em2023ImageUrl(number: number): string {
  return `${EM_2023_DIR}/EM_2023_Physics_MCQ_q${String(number).padStart(2, '0')}.webp`;
}

/** Public path of the 2022 scan for one question number (1-based). */
export function em2022ImageUrl(number: number): string {
  return `${EM_2022_DIR}/EM_2022_Physics_MCQ_q${String(number).padStart(2, '0')}.webp`;
}

/** Public path of the 2021 scan for one question number (1-based). */
export function em2021ImageUrl(number: number): string {
  return `${EM_2021_DIR}/EM_2021_Physics_MCQ_q${String(number).padStart(2, '0')}.webp`;
}

/**
 * Placeholder walkthrough link. Every scan points here until the real videos
 * are ready: replace an entry with its own YouTube URL to update it.
 */
export const PLACEHOLDER_VIDEO_URL = 'https://www.youtube.com/watch?v=XXXXXXXXXXX';

/** 2025 key, same convention as the others: printed option numbers or null. */
export const EM_2025_ANSWER_KEY: (number | null)[] = Array.from(
  { length: EM_2025_MCQ_COUNT },
  () => null,
);

/**
 * Answer key in paper order, written as the option numbers printed on the paper
 * (1-5). `null` means the key has not been entered yet: the question is still
 * recorded, but it is not marked. Fill an entry in and that question starts
 * showing correct/incorrect plus the explanation video.
 */
export const EM_2024_ANSWER_KEY: (number | null)[] = Array.from(
  { length: EM_2024_MCQ_COUNT },
  () => null,
);

/** 2023 key, same convention as the others: printed option numbers or null. */
export const EM_2023_ANSWER_KEY: (number | null)[] = Array.from(
  { length: EM_2023_MCQ_COUNT },
  () => null,
);

/**
 * 2022 key, same convention: the option number printed on the paper (1-5) for
 * questions 1-50, in paper order, taken from the paper's marking table.
 */
export const EM_2022_ANSWER_KEY: (number | null)[] = [
  4, 5, 5, 1, 4, 5, 4, 2, 2, 3, 3, 3, 1, 5, 2, 5, 4, 2, 1, 1, 2, 3, 4, 2, 2, 4, 3, 1, 5, 3, 5, 4, 3, 4,
  4, 2, 4, 5, 1, 2, 5, 1, 2, 3, 1, 2, 1, 4, 3, 2,
];

/** 2021 key, same convention again: printed option numbers or null. */
export const EM_2021_ANSWER_KEY: (number | null)[] = Array.from(
  { length: EM_2021_MCQ_COUNT },
  () => null,
);

/** Printed option number (1-based) to option index, or null when unkeyed. */
function toAnswerIndex(printed: number | null): number | null {
  return typeof printed === 'number' && printed >= 1 && printed <= OPTION_NUMBERS.length
    ? printed - 1
    : null;
}

interface PaperScans {
  year: number;
  count: number;
  answerKey: readonly (number | null)[];
  imageUrl: (number: number) => string;
}

/** Every paper that ships as scans, newest first. Add a year here to list it. */
const SCAN_PAPERS: PaperScans[] = [
  { year: 2025, count: EM_2025_MCQ_COUNT, answerKey: EM_2025_ANSWER_KEY, imageUrl: em2025ImageUrl },
  { year: 2024, count: EM_2024_MCQ_COUNT, answerKey: EM_2024_ANSWER_KEY, imageUrl: em2024ImageUrl },
  { year: 2023, count: EM_2023_MCQ_COUNT, answerKey: EM_2023_ANSWER_KEY, imageUrl: em2023ImageUrl },
  { year: 2022, count: EM_2022_MCQ_COUNT, answerKey: EM_2022_ANSWER_KEY, imageUrl: em2022ImageUrl },
  { year: 2021, count: EM_2021_MCQ_COUNT, answerKey: EM_2021_ANSWER_KEY, imageUrl: em2021ImageUrl },
];

/**
 * One question per scanned MCQ, built from the image files rather than written
 * by hand. The stem, option wording and derivation all sit inside the scan, so
 * an item only carries the five option numbers, the scan and the explanation
 * video. Items whose key entry is still null are recorded but not marked.
 */
export const PAST_PAPER_QUESTIONS: Question[] = SCAN_PAPERS.flatMap((scanned) =>
  Array.from({ length: scanned.count }, (_, index): Question => {
    const number = index + 1;
    return {
      id: `em-${scanned.year}-q${String(number).padStart(2, '0')}`,
      year: scanned.year,
      paper: 'Paper I',
      number,
      stem: '',
      options: [...OPTION_NUMBERS],
      answer: toAnswerIndex(scanned.answerKey[index] ?? null),
      hint: '',
      steps: [],
      questionImageUrl: scanned.imageUrl(number),
      videoUrl: PLACEHOLDER_VIDEO_URL,
    };
  }),
);

/** Every question the app can draw from: past-paper images first. */
export const QUESTION_BANK: Question[] = [...PAST_PAPER_QUESTIONS, ...QUESTIONS];

export const QUESTION_BANK_MAP: Record<string, Question> = QUESTION_BANK.reduce(
  (acc, question) => ({ ...acc, [question.id]: question }),
  {} as Record<string, Question>,
);
