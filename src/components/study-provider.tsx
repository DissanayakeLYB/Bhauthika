'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { QUESTION_MAP, QUESTIONS, type Question } from '@/lib/questions';
import type { TopicId } from '@/lib/topics';
import { createSeedProgress, type StudyProgress } from '@/lib/progress';
import {
  LocalProgressRepository,
  LocalResultRepository,
  LocalSessionRepository,
  progressStorageKey,
  removeLegacyProgressKey,
} from '@/lib/repository';
import {
  applySessionResult,
  pickQuestions,
  type ActiveSession,
  type SessionResult,
} from '@/lib/session';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

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
  questionsLoading: boolean;
  startSession: (topicIds: readonly TopicId[] | 'all', options?: StartSessionOptions) => number;
  answerCurrent: (choice: number) => void;
  goToNext: () => void;
  finishSession: () => void;
  toggleBookmark: (questionId: string) => void;
}

const StudyContext = createContext<StudyContextValue | null>(null);

/** Map a Supabase row to the local Question type. */
function mapRow(row: Record<string, unknown>): Question | null {
  try {
    const steps: Question['steps'] = Array.isArray(row.derivation)
      ? (row.derivation as Array<{ label: string; formula: string }>).map((d) => ({
          label: d.label ?? '',
          formula: d.formula ?? '',
          latex: d.formula ?? '',
        }))
      : [];

    return {
      id: String(row.id),
      topicId: String(row.topic_id) as TopicId,
      year: Number(row.exam_year),
      paper: String(row.paper ?? 'Paper I'),
      number: Number(row.question_number),
      stem: String(row.question_text ?? ''),
      options: Array.isArray(row.options) ? (row.options as string[]) : [],
      answer: Number(row.correct_index),
      hint: String(row.formula_hint ?? ''),
      steps,
      diagram: row.diagram_type === 'potentiometer' ? 'potentiometer' : undefined,
      videoUrl: typeof row.video_url === 'string' && row.video_url ? row.video_url : undefined,
    };
  } catch {
    return null;
  }
}

/** Fetch questions from Supabase; fall back to the local bank on any error. */
async function fetchQuestions(): Promise<Question[]> {
  try {
    const { data, error } = await supabase.from('questions').select('*');
    if (error || !data || data.length === 0) return QUESTIONS;
    const mapped = data.map(mapRow).filter((q): q is Question => q !== null);
    return mapped.length > 0 ? mapped : QUESTIONS;
  } catch {
    return QUESTIONS;
  }
}

// Module-level singletons: constructed once per bundle, repositories resolve
// storage lazily so server rendering never touches window.
const progressRepository = new LocalProgressRepository();
const sessionRepository = new LocalSessionRepository();
const resultRepository = new LocalResultRepository();

// Remove the old v1 key on first load (safe to call multiple times).
if (typeof window !== 'undefined') {
  removeLegacyProgressKey();
}

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<StudyProgress>(createSeedProgress);
  const [active, setActive] = useState<ActiveSession | null>(null);
  const [result, setResult] = useState<SessionResult | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [allQuestions, setAllQuestions] = useState<Question[]>(QUESTIONS);
  const questionMapRef = useRef<Record<string, Question>>(QUESTION_MAP);

  // Fetch questions from Supabase once on mount.
  useEffect(() => {
    let cancelled = false;
    fetchQuestions().then((qs) => {
      if (cancelled) return;
      setAllQuestions(qs);
      // Build a lookup map for session restoration.
      questionMapRef.current = qs.reduce(
        (acc, q) => ({ ...acc, [q.id]: q }),
        {} as Record<string, Question>,
      );
      setQuestionsLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  // Whenever the user changes, update the repository key and reload progress.
  useEffect(() => {
    const key = progressStorageKey(user?.id);
    progressRepository.setKey(key);

    let cancelled = false;
    void (async () => {
      const [storedProgress, storedSession, storedResult] = await Promise.all([
        progressRepository.load(),
        sessionRepository.load(),
        resultRepository.load(),
      ]);
      if (cancelled) return;

      setProgress(storedProgress ?? createSeedProgress());
      setResult(storedResult ?? null);
      if (storedSession) {
        const questions = storedSession.questionIds
          .map((id) => questionMapRef.current[id])
          .filter((q): q is Question => Boolean(q));
        if (questions.length === storedSession.questionIds.length) {
          setActive({ questions, index: storedSession.index, answers: storedSession.answers });
        } else {
          setActive(null);
        }
      } else {
        setActive(null);
      }
      setReady(true);
    })();

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

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
      questionIds: active.questions.map((q) => q.id),
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
      const picked = pickQuestions(allQuestions, { topicIds, count, fill });
      if (picked.length === 0) return 0;
      setActive({ questions: picked, index: 0, answers: picked.map(() => null) });
      setResult(null);
      return picked.length;
    },
    [allQuestions],
  );

  const answerCurrent = useCallback((choice: number) => {
    setActive((previous) => {
      if (!previous) return previous;
      const answers = [...previous.answers];
      answers[previous.index] = choice;
      return { ...previous, answers };
    });
  }, []);

  /** Insert an attempt row in Supabase. Fire-and-forget; never blocks the student. */
  const recordAttempt = useCallback(
    async (questionId: string, selectedIndex: number, isCorrect: boolean) => {
      if (!user) return;
      const { error } = await supabase.from('attempts').insert({
        question_id: questionId,
        selected_index: selectedIndex,
        is_correct: isCorrect,
      });
      if (error) console.error('[attempts] insert failed:', error.message);
    },
    [user],
  );

  const goToNext = useCallback(() => {
    setActive((previous) => {
      if (!previous) return previous;
      // Record the attempt for the question being left.
      const q = previous.questions[previous.index];
      const sel = previous.answers[previous.index];
      if (sel !== null) {
        void recordAttempt(q.id, sel, sel === q.answer);
      }
      const index = Math.min(previous.index + 1, previous.questions.length - 1);
      return { ...previous, index };
    });
  }, [recordAttempt]);

  const finishSession = useCallback(() => {
    if (!active) return;

    // Record attempt for the very last question.
    const lastQ = active.questions[active.index];
    const lastSel = active.answers[active.index];
    if (lastSel !== null) {
      void recordAttempt(lastQ.id, lastSel, lastSel === lastQ.answer);
    }

    const { progress: nextProgress, result: nextResult } = applySessionResult(
      progress,
      active.questions,
      active.answers,
    );
    setProgress(nextProgress);
    setResult(nextResult);
    setActive(null);
  }, [active, progress, recordAttempt]);

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
      questionsLoading,
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
      questionsLoading,
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
