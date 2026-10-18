import { QUESTIONS, type DerivationStep, type Question } from '@/data/questions';
import type { TopicId } from '@/data/topics';
import { supabase } from '@/lib/supabase';

interface QuestionRow {
  id: string;
  exam_year: number;
  question_number: number;
  topic_id: string;
  question_text: string;
  options: string[];
  correct_index: number;
  formula_hint: string | null;
  derivation: DerivationStep[] | null;
  diagram_url: string | null;
  video_url: string | null;
  paper: string | null;
  diagram_type: string | null;
}

function toQuestion(row: QuestionRow): Question {
  return {
    id: row.id,
    topicId: row.topic_id as TopicId,
    year: row.exam_year,
    paper: row.paper ?? 'Paper I',
    number: row.question_number,
    stem: row.question_text,
    options: row.options,
    answer: row.correct_index,
    hint: row.formula_hint ?? '',
    steps: row.derivation ?? [],
    diagram: row.diagram_type === 'potentiometer' ? 'potentiometer' : undefined,
    videoUrl: row.video_url ?? undefined,
  };
}

/** Loads the question bank from Supabase, falling back to the bundled set. */
export async function fetchQuestions(): Promise<Question[]> {
  const { data, error } = await supabase.from('questions').select('*');

  if (error) {
    console.error('Could not load questions from Supabase:', error.message);
    return QUESTIONS;
  }
  if (!data || data.length === 0) {
    return QUESTIONS;
  }
  return (data as QuestionRow[]).map(toQuestion);
}

/** Records one answer. Errors are logged only, so practice is never blocked. */
export async function recordAttempt(questionId: string, selectedIndex: number, isCorrect: boolean) {
  const { error } = await supabase.from('attempts').insert({
    question_id: questionId,
    selected_index: selectedIndex,
    is_correct: isCorrect,
  });
  if (error) {
    console.error('Could not save attempt:', error.message);
  }
}
