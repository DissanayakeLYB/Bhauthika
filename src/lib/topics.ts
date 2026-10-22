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
}

/** The 11 units of the Sri Lankan G.C.E. A/L Physics syllabus (English medium). */
export const TOPICS: Topic[] = [
  {
    id: 'measurement',
    number: '01',
    title: 'Measurement',
    unitLabel: 'Unit 01 · Fundamentals',
    questionCount: 42,
  },
  {
    id: 'mechanics',
    number: '02',
    title: 'Mechanics',
    unitLabel: 'Unit 02 · Mechanics',
    questionCount: 128,
  },
  {
    id: 'waves',
    number: '03',
    title: 'Oscillations and Waves',
    unitLabel: 'Unit 03 · Waves',
    questionCount: 95,
  },
  {
    id: 'thermal',
    number: '04',
    title: 'Thermal Physics',
    unitLabel: 'Unit 04 · Heat',
    questionCount: 60,
  },
  {
    id: 'gravitation',
    number: '05',
    title: 'Gravitational Field',
    unitLabel: 'Unit 05 · Fields',
    questionCount: 35,
  },
  {
    id: 'electrostatics',
    number: '06',
    title: 'Electrostatic Field',
    unitLabel: 'Unit 06 · Fields',
    questionCount: 54,
  },
  {
    id: 'magnetism',
    number: '07',
    title: 'Magnetic Field',
    unitLabel: 'Unit 07 · Electromagnetism',
    questionCount: 48,
  },
  {
    id: 'current',
    number: '08',
    title: 'Current Electricity',
    unitLabel: 'Unit 08 · Electrodynamics',
    questionCount: 86,
  },
  {
    id: 'electronics',
    number: '09',
    title: 'Electronics',
    unitLabel: 'Unit 09 · Electronics',
    questionCount: 40,
  },
  {
    id: 'matter-properties',
    number: '10',
    title: 'Mechanical Properties of Matter',
    unitLabel: 'Unit 10 · Matter',
    questionCount: 38,
  },
  {
    id: 'radiation',
    number: '11',
    title: 'Matter and Radiation',
    unitLabel: 'Unit 11 · Modern Physics',
    questionCount: 52,
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
