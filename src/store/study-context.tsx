import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { QUESTIONS, type Question } from '@/data/questions';
import { TOPICS, TOPIC_MAP, type TopicId } from '@/data/topics';
import { fetchQuestions, recordAttempt } from '@/lib/questions';
import { useAuth } from '@/store/auth-context';

export interface TopicProgress {
  mastery: number;
  solved: number;
}

export interface StudyProgress {
  streak: number;
  dailyTarget: number;
  answeredToday: number;
  correctToday: number;
  totalPractised: number;
  totalCorrect: number;
  pastPapers: number;
  monthlyDelta: number;
  weekly: number[];
  todayIndex: number;
  topics: Record<TopicId, TopicProgress>;
}

export interface SessionTopicResult {
  topicId: TopicId;
  title: string;
  total: number;
  correct: number;
  accuracy: number;
  delta: number;
}

export interface SessionResult {
  correct: number;
  total: number;
  points: number;
  topics: SessionTopicResult[];
}

export interface ActiveSession {
  questions: Question[];
  index: number;
  answers: (number | null)[];
}

interface StudyContextValue {
  progress: StudyProgress;
  active: ActiveSession | null;
  result: SessionResult | null;
  bookmarks: string[];
  questionsLoading: boolean;
  startSession: (topicIds: TopicId[] | 'all', count?: number) => number;
  answerCurrent: (choice: number) => boolean;
  advance: () => void;
  completeSession: () => void;
  toggleBookmark: (questionId: string) => void;
  resetProgress: () => void;
}

const seededTopics = (): Record<TopicId, TopicProgress> =>
  TOPICS.reduce(
    (acc, topic) => ({
      ...acc,
      [topic.id]: { mastery: topic.mastery, solved: Math.round(topic.questionCount * 0.8) },
    }),
    {} as Record<TopicId, TopicProgress>,
  );

const seedProgress = (): StudyProgress => ({
  streak: 4,
  dailyTarget: 25,
  answeredToday: 18,
  correctToday: 14,
  totalPractised: 482,
  totalCorrect: 328,
  pastPapers: 64,
  monthlyDelta: 3.5,
  weekly: [24, 18, 32, 20, 28, 12, 8],
  todayIndex: 2,
  topics: seededTopics(),
});

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const StudyContext = createContext<StudyContextValue | null>(null);

/** Practice history is cached locally so streaks survive an app restart. */
const STORAGE_KEY = 'bhauthika.progress.v1';

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const { session, initializing: authInitializing } = useAuth();
  const userId = session?.user.id;
  const [questions, setQuestions] = useState<Question[]>(QUESTIONS);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [progress, setProgress] = useState<StudyProgress>(seedProgress);
  const [active, setActive] = useState<ActiveSession | null>(null);
  const [result, setResult] = useState<SessionResult | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const activeRef = useRef<ActiveSession | null>(null);
  const progressRef = useRef<StudyProgress>(progress);

  // The bank lives in Supabase; the bundled questions are the offline fallback.
  useEffect(() => {
    if (authInitializing) return;
    if (!userId) {
      setQuestions(QUESTIONS);
      setQuestionsLoading(false);
      return;
    }

    let cancelled = false;
    setQuestionsLoading(true);
    fetchQuestions()
      .then((next) => {
        if (!cancelled) setQuestions(next);
      })
      .catch(() => {
        if (!cancelled) setQuestions(QUESTIONS);
      })
      .finally(() => {
        if (!cancelled) setQuestionsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authInitializing, userId]);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled || !raw) return;
        const saved = JSON.parse(raw) as StudyProgress;
        if (saved && saved.topics) {
          progressRef.current = saved;
          setProgress(saved);
        }
      })
      .catch(() => {
        /* Corrupt or unavailable storage falls back to seeded progress. */
      })
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress)).catch(() => {});
  }, [hydrated, progress]);

  const startSession = useCallback(
    (topicIds: TopicId[] | 'all', count = 10) => {
      const pool =
        topicIds === 'all'
          ? questions
          : questions.filter((question) => topicIds.includes(question.topicId));
      const picked = shuffle(pool).slice(0, Math.min(count, pool.length));
      if (picked.length === 0) return 0;
      setActive({ questions: picked, index: 0, answers: picked.map(() => null) });
      setResult(null);
      return picked.length;
    },
    [questions],
  );

  const answerCurrent = useCallback((choice: number) => {
    const session = activeRef.current;
    if (!session) return false;
    const question = session.questions[session.index];
    const correct = question.answer === choice;
    const answers = [...session.answers];
    answers[session.index] = choice;
    const next = { ...session, answers };
    activeRef.current = next;
    setActive(next);
    void recordAttempt(question.id, choice, correct);
    return correct;
  }, []);

  const advance = useCallback(() => {
    const session = activeRef.current;
    if (!session) return;
    const index = Math.min(session.index + 1, session.questions.length - 1);
    const next = { ...session, index };
    activeRef.current = next;
    setActive(next);
  }, []);

  const completeSession = useCallback(() => {
    const session = activeRef.current;
    if (!session) return;

    const prev = progressRef.current;
    const correctCount = session.questions.reduce((total, question, index) => {
      return total + (session.answers[index] === question.answer ? 1 : 0);
    }, 0);

    const byTopic = new Map<TopicId, { total: number; correct: number }>();
    session.questions.forEach((question, index) => {
      const entry = byTopic.get(question.topicId) ?? { total: 0, correct: 0 };
      entry.total += 1;
      if (session.answers[index] === question.answer) entry.correct += 1;
      byTopic.set(question.topicId, entry);
    });

    const topicProgress = { ...prev.topics };
    const topics: SessionTopicResult[] = [];
    byTopic.forEach((stats, topicId) => {
      const accuracy = Math.round((stats.correct / stats.total) * 100);
      const current = prev.topics[topicId];
      const mastery = Math.round(current.mastery * 0.7 + accuracy * 0.3);
      topicProgress[topicId] = {
        mastery,
        solved: current.solved + stats.total,
      };
      topics.push({
        topicId,
        title: TOPIC_MAP[topicId].title,
        total: stats.total,
        correct: stats.correct,
        accuracy,
        delta: mastery - current.mastery,
      });
    });
    topics.sort((a, b) => b.accuracy - a.accuracy);

    const weekly = [...prev.weekly];
    weekly[prev.todayIndex] += session.questions.length;

    const nextProgress: StudyProgress = {
      ...prev,
      answeredToday: prev.answeredToday + session.questions.length,
      correctToday: prev.correctToday + correctCount,
      totalPractised: prev.totalPractised + session.questions.length,
      totalCorrect: prev.totalCorrect + correctCount,
      weekly,
      topics: topicProgress,
    };

    progressRef.current = nextProgress;
    setProgress(nextProgress);
    setResult({
      correct: correctCount,
      total: session.questions.length,
      points: correctCount * 15 + (correctCount > 0 ? 15 : 0),
      topics,
    });
    setActive(null);
    activeRef.current = null;
  }, []);

  const toggleBookmark = useCallback((questionId: string) => {
    setBookmarks((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId],
    );
  }, []);

  const resetProgress = useCallback(() => {
    const seeded = seedProgress();
    progressRef.current = seeded;
    setProgress(seeded);
    setActive(null);
    activeRef.current = null;
    setResult(null);
    setBookmarks([]);
  }, []);

  const value = useMemo<StudyContextValue>(
    () => ({
      progress,
      active,
      result,
      bookmarks,
      questionsLoading,
      startSession,
      answerCurrent,
      advance,
      completeSession,
      toggleBookmark,
      resetProgress,
    }),
    [
      progress,
      active,
      result,
      bookmarks,
      questionsLoading,
      startSession,
      answerCurrent,
      advance,
      completeSession,
      toggleBookmark,
      resetProgress,
    ],
  );

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy(): StudyContextValue {
  const context = useContext(StudyContext);
  if (!context) throw new Error('useStudy must be used inside a StudyProvider');
  return context;
}
