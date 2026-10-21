import { TOPICS, type TopicId } from './topics';

export interface TopicProgress {
  mastery: number;
  solved: number;
}

export interface StudyProgress {
  /** Simple day count, nothing more. */
  streak: number;
  dailyTarget: number;
  answeredToday: number;
  correctToday: number;
  totalPractised: number;
  totalCorrect: number;
  pastPapers: number;
  monthlyDelta: number;
  topics: Record<TopicId, TopicProgress>;
}

export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export function createSeedTopics(): Record<TopicId, TopicProgress> {
  return TOPICS.reduce(
    (acc, topic) => ({
      ...acc,
      [topic.id]: {
        mastery: topic.mastery,
        solved: Math.round(topic.questionCount * 0.8),
      },
    }),
    {} as Record<TopicId, TopicProgress>,
  );
}

/** Demo profile used until a student has answered anything. */
export function createSeedProgress(): StudyProgress {
  return {
    streak: 4,
    dailyTarget: 25,
    answeredToday: 18,
    correctToday: 14,
    totalPractised: 482,
    totalCorrect: 328,
    pastPapers: 64,
    monthlyDelta: 3.5,
    topics: createSeedTopics(),
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
