import { TOPICS, type TopicId } from './topics';

export interface TopicProgress {
  mastery: number;
  solved: number;
}

export interface StudyProgress {
  dailyTarget: number;
  answeredToday: number;
  correctToday: number;
  totalPractised: number;
  totalCorrect: number;
  pastPapers: number;
  monthlyDelta: number;
  topics: Record<TopicId, TopicProgress>;
  /** Calendar days on which the signed-in student answered at least one question. */
  activeDays: string[];
}

export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

function createEmptyTopics(): Record<TopicId, TopicProgress> {
  return TOPICS.reduce(
    (acc, topic) => ({
      ...acc,
      [topic.id]: { mastery: 0, solved: 0 },
    }),
    {} as Record<TopicId, TopicProgress>,
  );
}

/** Zero-state profile for a brand-new student. No placeholder data. */
export function createSeedProgress(): StudyProgress {
  return {
    dailyTarget: 25,
    answeredToday: 0,
    correctToday: 0,
    totalPractised: 0,
    totalCorrect: 0,
    pastPapers: 0,
    monthlyDelta: 0,
    topics: createEmptyTopics(),
    activeDays: [],
  };
}

/** Topics ordered weakest first; ties keep syllabus order. */
export function weakestTopicIds(progress: StudyProgress, count = 3): TopicId[] {
  return [...TOPICS]
    .sort((a, b) => progress.topics[a.id].mastery - progress.topics[b.id].mastery)
    .slice(0, count)
    .map((topic) => topic.id);
}

export function overallAccuracy(progress: StudyProgress): number {
  if (progress.totalPractised <= 0) return 0;
  return Math.round((progress.totalCorrect / progress.totalPractised) * 100);
}

export function todayAccuracy(progress: StudyProgress): number {
  if (progress.answeredToday <= 0) return 0;
  return Math.round((progress.correctToday / progress.answeredToday) * 100);
}
