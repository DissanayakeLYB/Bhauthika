'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { QUESTION_MAP, QUESTIONS, type Question } from '@/lib/questions';
import type { TopicId } from '@/lib/topics';
import { createSeedProgress, type StudyProgress } from '@/lib/progress';
import {
  LocalProgressRepository,
  LocalResultRepository,
  LocalSessionRepository,
} from '@/lib/repository';
import {
  applySessionResult,
  pickQuestions,
  type ActiveSession,
  type SessionResult,
} from '@/lib/session';

interface StartSessionOptions {
  count?: number;
  /** Top the set up from the rest of the bank when a unit is running thin. */
  fill?: boolean;
}

interface StudyContextValue {
  progress: StudyProgress;
  active: ActiveSession | null;
  result: SessionResult | null;
  bookmarks: string[];
  startSession: (topicIds: readonly TopicId[] | 'all', options?: StartSessionOptions) => number;
  answerCurrent: (choice: number) => void;
  goToNext: () => void;
  finishSession: () => void;
  toggleBookmark: (questionId: string) => void;
}

const StudyContext = createContext<StudyContextValue | null>(null);

// Module-level singletons: constructed once per bundle, and the repositories
// resolve storage lazily so server rendering never touches window.
const progressRepository = new LocalProgressRepository();
const sessionRepository = new LocalSessionRepository();
const resultRepository = new LocalResultRepository();

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<StudyProgress>(createSeedProgress);
  const [active, setActive] = useState<ActiveSession | null>(null);
  const [result, setResult] = useState<SessionResult | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  // Restore progress and any session that was interrupted by a reload.
  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const [storedProgress, storedSession, storedResult] = await Promise.all([
        progressRepository.load(),
        sessionRepository.load(),
        resultRepository.load(),
      ]);
      if (cancelled) return;

      if (storedProgress) setProgress(storedProgress);
      if (storedResult) setResult(storedResult);
      if (storedSession) {
        const questions = storedSession.questionIds
          .map((id) => QUESTION_MAP[id])
          .filter((question): question is Question => Boolean(question));
        if (questions.length === storedSession.questionIds.length) {
          setActive({ questions, index: storedSession.index, answers: storedSession.answers });
        }
      }
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    void progressRepository.save(progress);
  }, [ready, progress]);

  useEffect(() => {
    if (!ready) return;
    if (!active) {
      void sessionRepository.clear();
      return;
    }
    void sessionRepository.save({
      questionIds: active.questions.map((question) => question.id),
      index: active.index,
      answers: active.answers,
    });
  }, [ready, active]);

  useEffect(() => {
    if (!ready) return;
    if (result) {
      void resultRepository.save(result);
    } else {
      void resultRepository.clear();
    }
  }, [ready, result]);

  const startSession = useCallback(
    (topicIds: readonly TopicId[] | 'all', { count = 10, fill = false }: StartSessionOptions = {}) => {
      const picked = pickQuestions(QUESTIONS, { topicIds, count, fill });
      if (picked.length === 0) return 0;

      setActive({ questions: picked, index: 0, answers: picked.map(() => null) });
      setResult(null);
      return picked.length;
    },
    [],
  );

  const answerCurrent = useCallback((choice: number) => {
    setActive((previous) => {
      if (!previous) return previous;
      const answers = [...previous.answers];
      answers[previous.index] = choice;
      return { ...previous, answers };
    });
  }, []);

  const goToNext = useCallback(() => {
    setActive((previous) => {
      if (!previous) return previous;
      const index = Math.min(previous.index + 1, previous.questions.length - 1);
      return { ...previous, index };
    });
  }, []);

  const finishSession = useCallback(() => {
    if (!active) return;
    const { progress: nextProgress, result: nextResult } = applySessionResult(
      progress,
      active.questions,
      active.answers,
    );
    setProgress(nextProgress);
    setResult(nextResult);
    setActive(null);
  }, [active, progress]);

  const toggleBookmark = useCallback((questionId: string) => {
    setBookmarks((previous) =>
      previous.includes(questionId)
        ? previous.filter((id) => id !== questionId)
        : [...previous, questionId],
    );
  }, []);

  const value = useMemo<StudyContextValue>(
    () => ({
      progress,
      active,
      result,
      bookmarks,
      startSession,
      answerCurrent,
      goToNext,
      finishSession,
      toggleBookmark,
    }),
    [
      progress,
      active,
      result,
      bookmarks,
      startSession,
      answerCurrent,
      goToNext,
      finishSession,
      toggleBookmark,
    ],
  );

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy(): StudyContextValue {
  const context = useContext(StudyContext);
  if (!context) throw new Error('useStudy must be used inside a StudyProvider');
  return context;
}
