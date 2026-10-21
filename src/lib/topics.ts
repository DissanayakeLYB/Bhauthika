export type TopicId =
  | 'measurement'
  | 'mechanics'
  | 'waves'
  | 'thermal'
  | 'gravitation'
  | 'electrostatics'
  | 'magnetism'
  | 'current'
  | 'electronics'
  | 'matter-properties'
  | 'radiation';

export interface Topic {
  id: TopicId;
  number: string;
  title: string;
  unitLabel: string;
  /** Past-paper questions in the curated bank for this syllabus unit. */
  questionCount: number;
  /** Seed mastery before the student has answered anything. */
  mastery: number;
}

/** The 11 units of the Sri Lankan G.C.E. A/L Physics syllabus (English medium). */
export const TOPICS: Topic[] = [
  {
    id: 'measurement',
    number: '01',
    title: 'Measurement',
    unitLabel: 'Unit 01 · Fundamentals',
    questionCount: 42,
    mastery: 85,
  },
  {
    id: 'mechanics',
    number: '02',
    title: 'Mechanics',
    unitLabel: 'Unit 02 · Mechanics',
    questionCount: 128,
    mastery: 64,
  },
  {
    id: 'waves',
    number: '03',
    title: 'Oscillations and Waves',
    unitLabel: 'Unit 03 · Waves',
    questionCount: 95,
    mastery: 48,
  },
  {
    id: 'thermal',
    number: '04',
    title: 'Thermal Physics',
    unitLabel: 'Unit 04 · Heat',
    questionCount: 60,
    mastery: 72,
  },
  {
    id: 'gravitation',
    number: '05',
    title: 'Gravitational Field',
    unitLabel: 'Unit 05 · Fields',
    questionCount: 35,
    mastery: 80,
  },
  {
    id: 'electrostatics',
    number: '06',
    title: 'Electrostatic Field',
    unitLabel: 'Unit 06 · Fields',
    questionCount: 54,
    mastery: 58,
  },
  {
    id: 'magnetism',
    number: '07',
    title: 'Magnetic Field',
    unitLabel: 'Unit 07 · Electromagnetism',
    questionCount: 48,
    mastery: 62,
  },
  {
    id: 'current',
    number: '08',
    title: 'Current Electricity',
    unitLabel: 'Unit 08 · Electrodynamics',
    questionCount: 86,
    mastery: 42,
  },
  {
    id: 'electronics',
    number: '09',
    title: 'Electronics',
    unitLabel: 'Unit 09 · Electronics',
    questionCount: 40,
    mastery: 70,
  },
  {
    id: 'matter-properties',
    number: '10',
    title: 'Mechanical Properties of Matter',
    unitLabel: 'Unit 10 · Matter',
    questionCount: 38,
    mastery: 76,
  },
  {
    id: 'radiation',
    number: '11',
    title: 'Matter and Radiation',
    unitLabel: 'Unit 11 · Modern Physics',
    questionCount: 52,
    mastery: 55,
  },
];

export const TOPIC_MAP: Record<TopicId, Topic> = TOPICS.reduce(
  (acc, topic) => ({ ...acc, [topic.id]: topic }),
  {} as Record<TopicId, Topic>,
);

export type MasteryStatus = 'mastered' | 'strong' | 'focus';

/** Status pills shown on Practice cards. */
export function masteryStatus(mastery: number): MasteryStatus | null {
  if (mastery >= 85) return 'mastered';
  if (mastery >= 78) return 'strong';
  if (mastery < 50) return 'focus';
  return null;
}

interface FocusTopic {
  topicId: TopicId;
  title: string;
  accuracy: number;
  unitLabel: string;
  due: number;
  tag: 'High Yield' | 'Core Topic';
}

/**
 * Topics flagged on Home. Rotational Mechanics is a high-yield sub-topic of
 * Unit 02, so it drills the Mechanics bank.
 */
export const FOCUS_TOPICS: FocusTopic[] = [
  {
    topicId: 'current',
    title: 'Current Electricity',
    accuracy: 42,
    unitLabel: 'Unit 08 · Electrodynamics',
    due: 8,
    tag: 'High Yield',
  },
  {
    topicId: 'waves',
    title: 'Oscillations and Waves',
    accuracy: 48,
    unitLabel: 'Unit 03 · Waves',
    due: 6,
    tag: 'Core Topic',
  },
  {
    topicId: 'mechanics',
    title: 'Rotational Mechanics',
    accuracy: 53,
    unitLabel: 'Unit 02 · Mechanics',
    due: 5,
    tag: 'High Yield',
  },
];
