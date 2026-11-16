import { QUESTIONS, type Question } from './questions';
import type { TopicId } from './topics';

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

/** Canonical watch link for a video id, so every item stores the same shape. */
function youtubeUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/** 2025 walkthrough videos, keyed by the question number printed on the paper. */
export const EM_2025_VIDEO_IDS: Readonly<Record<number, string>> = {
  1: 'xbWG22Rjk2s',
  2: 'pS3R-ZFuqy0',
  3: 'MCDx9F4PNcA',
  4: 'tIxRuTRirBo',
  5: 'bsQeK_HnP4g',
  6: 'IxWEBtVTh84',
  7: 'gWEt9fjPCxE',
  8: 'hO1dPGmx4r4',
  9: 'nmW787w6eeo',
  10: '7GzSPOhElaU',
  11: 'rJrp7BqGGe8',
  12: 'obdg008QRGo',
  13: 'nY4g8upo3hs',
};

/**
 * 2025 key from the paper's marking table. One entry is printed as "02/04":
 * both of those options were accepted for that question.
 */
export const EM_2025_ANSWER_KEY: (number | readonly number[] | null)[] = [
  5, 3, 1, 4, 3, 5, 1, 2, 2, 1, 2, 2, 4, 5, [2, 4], 5, 3, 1, 2, 2, 2, 3, 3, 4, 4, 1, 4, 5, 1, 5, 1, 1, 1,
  3, 1, 4, 3, 3, 4, 3, 2, 3, 2, 3, 5, 2, 5, 2, 3, 4,
];

/**
 * 2024 key from the paper's marking table: the option number (1-5) for
 * questions 1-50, in paper order.
 */
export const EM_2024_ANSWER_KEY: (number | null)[] = [
  5, 1, 5, 1, 5, 3, 3, 2, 3, 5, 2, 4, 5, 4, 4, 2, 5, 2, 4, 3, 4, 2, 2, 3, 2, 1, 1, 3, 2, 5, 4, 2, 2, 3,
  3, 4, 2, 3, 5, 1, 3, 1, 1, 1, 4, 1, 4, 2, 4, 5,
];

/**
 * 2023 key from the paper's marking table. `'all'` is the table's "ALL": every
 * option was accepted for that question.
 */
export const EM_2023_ANSWER_KEY: (number | 'all' | null)[] = [
  1, 2, 4, 3, 5, 4, 5, 2, 5, 1, 3, 4, 5, 3, 3, 2, 4, 4, 3, 2, 5, 3, 2, 1, 2, 3, 3, 5, 4, 3, 'all', 1, 3,
  5, 2, 5, 1, 1, 5, 2, 5, 4, 1, 3, 2, 3, 1, 4, 1, 4,
];

/**
 * 2022 key, same convention: the option number printed on the paper (1-5) for
 * questions 1-50, in paper order, taken from the paper's marking table.
 */
export const EM_2022_ANSWER_KEY: (number | null)[] = [
  4, 5, 5, 1, 4, 5, 4, 2, 2, 3, 3, 3, 1, 5, 2, 5, 4, 2, 1, 1, 2, 3, 4, 2, 2, 4, 3, 1, 5, 3, 5, 4, 3, 4,
  4, 2, 4, 5, 1, 2, 5, 1, 2, 3, 1, 2, 1, 4, 3, 2,
];

/**
 * 2021 key from the paper's marking table: the option number (1-5) for
 * questions 1-50, in paper order.
 */
export const EM_2021_ANSWER_KEY: (number | null)[] = [
  2, 1, 4, 5, 4, 4, 4, 3, 2, 1, 4, 3, 1, 5, 3, 2, 1, 5, 5, 1, 3, 2, 1, 2, 2, 5, 2, 3, 1, 2, 3, 1, 1, 4,
  3, 5, 1, 3, 2, 3, 4, 4, 1, 3, 2, 4, 2, 3, 5, 5,
];

/** Printed option number (1-based) to option index, or null when unkeyed. */
function toAnswerIndex(printed: number | null): number | null {
  return typeof printed === 'number' && printed >= 1 && printed <= OPTION_NUMBERS.length
    ? printed - 1
    : null;
}

/**
 * The syllabus unit each question tests, keyed by the number printed on the
 * paper. Empty until the mapping is supplied from the marking side: a scan with
 * no unit still counts in accuracy but credits no unit, so nothing is guessed.
 */
type PaperUnits = Readonly<Record<number, TopicId>>;

interface PaperScans {
  year: number;
  count: number;
  answerKey: readonly (number | 'all' | readonly number[] | null)[];
  imageUrl: (number: number) => string;
  /** Walkthrough video ids by printed question number; the rest use the placeholder. */
  videos?: Readonly<Record<number, string>>;
  /** Unit per printed question number. */
  units?: PaperUnits;
}

/** Unit per question for the 2025 paper. Fill as `{ 1: 'mechanics', 2: 'waves', … }`. */
export const EM_2025_UNITS: PaperUnits = {};

/** Unit per question for the 2024 paper. */
export const EM_2024_UNITS: PaperUnits = {};

/** Unit per question for the 2023 paper. */
export const EM_2023_UNITS: PaperUnits = {};

/** Unit per question for the 2022 paper. */
export const EM_2022_UNITS: PaperUnits = {};

/** Unit per question for the 2021 paper. */
export const EM_2021_UNITS: PaperUnits = {};

/** Every paper that ships as scans, newest first. Add a year here to list it. */
const SCAN_PAPERS: PaperScans[] = [
  {
    year: 2025,
    count: EM_2025_MCQ_COUNT,
    answerKey: EM_2025_ANSWER_KEY,
    imageUrl: em2025ImageUrl,
    videos: EM_2025_VIDEO_IDS,
    units: EM_2025_UNITS,
  },
  {
    year: 2024,
    count: EM_2024_MCQ_COUNT,
    answerKey: EM_2024_ANSWER_KEY,
    imageUrl: em2024ImageUrl,
    units: EM_2024_UNITS,
  },
  {
    year: 2023,
    count: EM_2023_MCQ_COUNT,
    answerKey: EM_2023_ANSWER_KEY,
    imageUrl: em2023ImageUrl,
    units: EM_2023_UNITS,
  },
  {
    year: 2022,
    count: EM_2022_MCQ_COUNT,
    answerKey: EM_2022_ANSWER_KEY,
    imageUrl: em2022ImageUrl,
    units: EM_2022_UNITS,
  },
  {
    year: 2021,
    count: EM_2021_MCQ_COUNT,
    answerKey: EM_2021_ANSWER_KEY,
    imageUrl: em2021ImageUrl,
    units: EM_2021_UNITS,
  },
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
    const printed = scanned.answerKey[index] ?? null;
    const videoId = scanned.videos?.[number];
    // "ALL" is the whole option set; a list is the options the table accepted.
    const accepted =
      printed === 'all'
        ? OPTION_NUMBERS.map((_, optionIndex) => optionIndex)
        : Array.isArray(printed)
          ? printed.map((option) => option - 1)
          : null;
    return {
      id: `em-${scanned.year}-q${String(number).padStart(2, '0')}`,
      topicId: scanned.units?.[number],
      year: scanned.year,
      paper: 'Paper I',
      number,
      stem: '',
      options: [...OPTION_NUMBERS],
      answer: toAnswerIndex(typeof printed === 'number' ? printed : null),
      acceptedAnswers: accepted ?? undefined,
      hint: '',
      steps: [],
      questionImageUrl: scanned.imageUrl(number),
      videoUrl: videoId ? youtubeUrl(videoId) : PLACEHOLDER_VIDEO_URL,
    };
  }),
);

/** Every question the app can draw from: past-paper images first. */
export const QUESTION_BANK: Question[] = [...PAST_PAPER_QUESTIONS, ...QUESTIONS];

export const QUESTION_BANK_MAP: Record<string, Question> = QUESTION_BANK.reduce(
  (acc, question) => ({ ...acc, [question.id]: question }),
  {} as Record<string, Question>,
);
