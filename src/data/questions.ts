import type { TopicId } from './topics';

export interface DerivationStep {
  label: string;
  formula: string;
}

export interface Question {
  id: string;
  topicId: TopicId;
  year: number;
  paper: string;
  number: number;
  /** Problem stem. Wrap emphasised values in **double asterisks**. */
  stem: string;
  options: string[];
  answer: number;
  hint: string;
  steps: DerivationStep[];
  diagram?: 'potentiometer';
  /** Optional YouTube link to a full worked video explanation. */
  videoUrl?: string;
}

/**
 * Curated English-medium MCQs in the style of Sri Lankan A/L Physics past
 * papers (Paper I). Every item ships with a worked derivation so the answer
 * feedback sheet can teach the concept, not just reveal the option.
 */
export const QUESTIONS: Question[] = [
  {
    id: 'ce-potentiometer',
    topicId: 'current',
    year: 2019,
    paper: 'Paper I',
    number: 28,
    stem: 'A uniform potentiometer wire **AB** of length **100 cm** and resistance **10 Ω** is connected in series with a cell of e.m.f. **2 V** and internal resistance **1 Ω**. What is the potential gradient along the wire?',
    options: ['0.018 V cm⁻¹', '0.020 V cm⁻¹', '0.022 V cm⁻¹', '0.180 V cm⁻¹', '0.200 V cm⁻¹'],
    answer: 0,
    hint: 'Formula Hint (V = IR)',
    videoUrl: 'https://www.youtube.com/watch?v=EXAMPLE',
    diagram: 'potentiometer',
    steps: [
      { label: 'Step 1: Circuit Total Resistance', formula: 'R_total = 10 Ω + 1 Ω = 11 Ω' },
      { label: 'Step 2: Circuit Current (I)', formula: 'I = E / R_total = 2 V / 11 Ω ≈ 0.1818 A' },
      { label: 'Step 3: Potential Difference V_AB', formula: 'V_AB = I × R_wire = 0.1818 A × 10 Ω = 1.818 V' },
      { label: 'Step 4: Potential Gradient (k)', formula: 'k = V_AB / L = 1.818 V / 100 cm = 0.018 V cm⁻¹' },
    ],
  },
  {
    id: 'ce-parallel',
    topicId: 'current',
    year: 2021,
    paper: 'Paper I',
    number: 24,
    stem: 'Three resistors of **2 Ω**, **3 Ω** and **6 Ω** are connected in parallel across a **6 V** battery of negligible internal resistance. What is the total current drawn from the battery?',
    options: ['0.5 A', '1.0 A', '3.0 A', '6.0 A', '12.0 A'],
    answer: 3,
    hint: 'Formula Hint (1/R = Σ1/R)',
    videoUrl: 'https://www.youtube.com/watch?v=EXAMPLE',
    steps: [
      { label: 'Step 1: Parallel Equivalent Resistance', formula: '1/R_p = 1/2 + 1/3 + 1/6 = 1 Ω⁻¹' },
      { label: 'Step 2: Equivalent Resistance', formula: 'R_p = 1 Ω' },
      { label: 'Step 3: Total Current', formula: 'I = V / R_p = 6 V / 1 Ω = 6 A' },
    ],
  },
  {
    id: 'ce-terminal-pd',
    topicId: 'current',
    year: 2018,
    paper: 'Paper I',
    number: 30,
    stem: 'A cell of e.m.f. **12 V** and internal resistance **1 Ω** is connected to an external resistor of **5 Ω**. What is the terminal potential difference of the cell?',
    options: ['2 V', '7 V', '10 V', '11 V', '12 V'],
    answer: 2,
    hint: 'Formula Hint (V = E − Ir)',
    steps: [
      { label: 'Step 1: Circuit Current', formula: 'I = E / (R + r) = 12 V / (5 Ω + 1 Ω) = 2 A' },
      { label: 'Step 2: Lost Volts Inside the Cell', formula: 'Ir = 2 A × 1 Ω = 2 V' },
      { label: 'Step 3: Terminal Potential Difference', formula: 'V = E − Ir = 12 V − 2 V = 10 V' },
    ],
  },
  {
    id: 'me-stopping',
    topicId: 'mechanics',
    year: 2020,
    paper: 'Paper I',
    number: 9,
    stem: 'A body starting from rest moves with a uniform acceleration of **4 m s⁻²** for **5 s**. What distance does it travel in that time?',
    options: ['10 m', '20 m', '25 m', '50 m', '100 m'],
    answer: 3,
    hint: 'Formula Hint (s = ut + ½at²)',
    steps: [
      { label: 'Step 1: Known Quantities', formula: 'u = 0 m s⁻¹, a = 4 m s⁻², t = 5 s' },
      { label: 'Step 2: Apply the Equation of Motion', formula: 's = ut + ½at² = 0 + ½ × 4 × 5²' },
      { label: 'Step 3: Evaluate', formula: 's = 2 × 25 = 50 m' },
    ],
  },
  {
    id: 'me-rotation',
    topicId: 'mechanics',
    year: 2022,
    paper: 'Paper I',
    number: 16,
    stem: 'A solid cylinder of mass **2 kg** and radius **0.5 m** rotates about its central axis. What is its moment of inertia about that axis?',
    options: ['0.125 kg m²', '0.25 kg m²', '0.50 kg m²', '1.0 kg m²', '2.0 kg m²'],
    answer: 1,
    hint: 'Formula Hint (I = ½MR²)',
    steps: [
      { label: 'Step 1: Moment of Inertia of a Solid Cylinder', formula: 'I = ½ M R²' },
      { label: 'Step 2: Substitute Values', formula: 'I = ½ × 2 kg × (0.5 m)²' },
      { label: 'Step 3: Evaluate', formula: 'I = 1 × 0.25 = 0.25 kg m²' },
    ],
  },
  {
    id: 'me-impulse',
    topicId: 'mechanics',
    year: 2019,
    paper: 'Paper I',
    number: 12,
    stem: 'A ball of mass **0.2 kg** strikes a wall horizontally at **10 m s⁻¹** and rebounds along the same line at **8 m s⁻¹**. What is the magnitude of the impulse on the ball?',
    options: ['0.4 N s', '1.6 N s', '2.0 N s', '3.6 N s', '4.0 N s'],
    answer: 3,
    hint: 'Formula Hint (impulse = Δp)',
    steps: [
      { label: 'Step 1: Choose a Positive Direction', formula: 'Take towards the wall as positive: u = +10 m s⁻¹, v = −8 m s⁻¹' },
      { label: 'Step 2: Change of Momentum', formula: 'Δp = m(v − u) = 0.2 × (−8 − 10)' },
      { label: 'Step 3: Magnitude of Impulse', formula: '|Δp| = 0.2 × 18 = 3.6 N s' },
    ],
  },
  {
    id: 'ow-pendulum',
    topicId: 'waves',
    year: 2021,
    paper: 'Paper I',
    number: 20,
    stem: 'A simple pendulum of length **1.0 m** performs small oscillations where g = **9.8 m s⁻²**. What is its period of oscillation?',
    options: ['1.0 s', '1.4 s', '2.0 s', '3.1 s', '6.3 s'],
    answer: 2,
    hint: 'Formula Hint (T = 2π√(L/g))',
    steps: [
      { label: 'Step 1: Period of a Simple Pendulum', formula: 'T = 2π√(L/g)' },
      { label: 'Step 2: Substitute Values', formula: 'T = 2π√(1.0 / 9.8) = 2π × 0.3194' },
      { label: 'Step 3: Evaluate', formula: 'T ≈ 2.0 s' },
    ],
  },
  {
    id: 'ow-wave-speed',
    topicId: 'waves',
    year: 2020,
    paper: 'Paper I',
    number: 24,
    stem: 'A progressive wave is described by **y = 0.02 sin(100πt − 5πx)** in SI units. What is the speed of the wave?',
    options: ['5 m s⁻¹', '10 m s⁻¹', '20 m s⁻¹', '50 m s⁻¹', '100 m s⁻¹'],
    answer: 2,
    hint: 'Formula Hint (v = ω/k)',
    steps: [
      { label: 'Step 1: Compare with y = A sin(ωt − kx)', formula: 'ω = 100π rad s⁻¹, k = 5π rad m⁻¹' },
      { label: 'Step 2: Wave Speed', formula: 'v = ω / k = 100π / 5π' },
      { label: 'Step 3: Evaluate', formula: 'v = 20 m s⁻¹' },
    ],
  },
  {
    id: 'ow-closed-pipe',
    topicId: 'waves',
    year: 2017,
    paper: 'Paper I',
    number: 27,
    stem: 'A closed pipe of length **0.5 m** resonates at its fundamental frequency. Taking the speed of sound in air as **340 m s⁻¹**, what is that frequency?',
    options: ['85 Hz', '170 Hz', '340 Hz', '510 Hz', '680 Hz'],
    answer: 1,
    hint: 'Formula Hint (f₁ = v/4L)',
    steps: [
      { label: 'Step 1: Fundamental Mode of a Closed Pipe', formula: 'λ₁ / 4 = L, so λ₁ = 4L' },
      { label: 'Step 2: Fundamental Frequency', formula: 'f₁ = v / 4L = 340 / (4 × 0.5)' },
      { label: 'Step 3: Evaluate', formula: 'f₁ = 340 / 2 = 170 Hz' },
    ],
  },
  {
    id: 'th-isochoric',
    topicId: 'thermal',
    year: 2022,
    paper: 'Paper I',
    number: 11,
    stem: 'A fixed mass of ideal gas is heated at constant volume from **27 °C** until its pressure doubles. What is the final temperature?',
    options: ['54 °C', '300 °C', '327 °C', '600 °C', '627 °C'],
    answer: 2,
    hint: 'Formula Hint (P/T = constant)',
    steps: [
      { label: 'Step 1: Convert to Kelvin', formula: 'T₁ = 27 + 273 = 300 K' },
      { label: 'Step 2: Constant Volume Relation', formula: 'P₁/T₁ = P₂/T₂, and P₂ = 2P₁ ⇒ T₂ = 2T₁' },
      { label: 'Step 3: Final Temperature', formula: 'T₂ = 600 K = 600 − 273 = 327 °C' },
    ],
  },
  {
    id: 'th-heating',
    topicId: 'thermal',
    year: 2020,
    paper: 'Paper I',
    number: 14,
    stem: 'How much heat is required to raise the temperature of **2 kg** of water from **20 °C** to **70 °C**? Take the specific heat capacity of water as **4200 J kg⁻¹ K⁻¹**.',
    options: ['42 kJ', '84 kJ', '210 kJ', '420 kJ', '840 kJ'],
    answer: 3,
    hint: 'Formula Hint (Q = mcΔT)',
    steps: [
      { label: 'Step 1: Temperature Rise', formula: 'ΔT = 70 − 20 = 50 K' },
      { label: 'Step 2: Heat Energy Required', formula: 'Q = mcΔT = 2 × 4200 × 50' },
      { label: 'Step 3: Evaluate', formula: 'Q = 420 000 J = 420 kJ' },
    ],
  },
  {
    id: 'gr-height',
    topicId: 'gravitation',
    year: 2019,
    paper: 'Paper I',
    number: 18,
    stem: 'At a height equal to **half** the radius of the Earth above its surface, what is the acceleration due to gravity? Take g at the surface as **9.8 m s⁻²**.',
    options: ['2.2 m s⁻²', '4.4 m s⁻²', '6.5 m s⁻²', '8.7 m s⁻²', '9.8 m s⁻²'],
    answer: 1,
    hint: 'Formula Hint (g′ = g / (1 + h/R)²)',
    steps: [
      { label: 'Step 1: Variation with Height', formula: 'g′ = g / (1 + h/R)²' },
      { label: 'Step 2: Substitute h = R/2', formula: 'g′ = 9.8 / (1 + 0.5)² = 9.8 / 2.25' },
      { label: 'Step 3: Evaluate', formula: 'g′ ≈ 4.4 m s⁻²' },
    ],
  },
  {
    id: 'gr-orbit',
    topicId: 'gravitation',
    year: 2023,
    paper: 'Paper I',
    number: 21,
    stem: 'A satellite orbits the Earth at a distance of **2R** from the Earth’s centre, where R = **6.4 × 10⁶ m** and g = **9.8 m s⁻²**. What is its orbital speed?',
    options: ['3.2 km s⁻¹', '5.6 km s⁻¹', '7.9 km s⁻¹', '11.2 km s⁻¹', '15.8 km s⁻¹'],
    answer: 1,
    hint: 'Formula Hint (v = √(GM/r))',
    steps: [
      { label: 'Step 1: Orbital Speed', formula: 'v = √(GM / r), with GM = gR²' },
      { label: 'Step 2: Substitute r = 2R', formula: 'v = √(gR² / 2R) = √(gR / 2)' },
      { label: 'Step 3: Evaluate', formula: 'v = √(9.8 × 6.4 × 10⁶ / 2) ≈ 5.6 × 10³ m s⁻¹' },
    ],
  },
  {
    id: 'el-coulomb',
    topicId: 'electrostatics',
    year: 2022,
    paper: 'Paper I',
    number: 22,
    stem: 'Two point charges of **2 μC** and **8 μC** are placed **0.3 m** apart in air. What is the magnitude of the electrostatic force between them? Take 1/(4πε₀) = **9 × 10⁹ N m² C⁻²**.',
    options: ['0.16 N', '0.53 N', '1.6 N', '5.3 N', '16 N'],
    answer: 2,
    hint: 'Formula Hint (F = kq₁q₂/r²)',
    steps: [
      { label: 'Step 1: Coulomb’s Law', formula: 'F = (1/4πε₀) q₁q₂ / r²' },
      { label: 'Step 2: Substitute Values', formula: 'F = 9 × 10⁹ × (2 × 10⁻⁶)(8 × 10⁻⁶) / (0.3)²' },
      { label: 'Step 3: Evaluate', formula: 'F = 9 × 10⁹ × 16 × 10⁻¹² / 0.09 = 1.6 N' },
    ],
  },
  {
    id: 'el-plates',
    topicId: 'electrostatics',
    year: 2018,
    paper: 'Paper I',
    number: 25,
    stem: 'Two parallel plates **2 cm** apart are maintained at a potential difference of **200 V**. What is the electric field strength between them?',
    options: ['100 V m⁻¹', '400 V m⁻¹', '1000 V m⁻¹', '10 000 V m⁻¹', '40 000 V m⁻¹'],
    answer: 3,
    hint: 'Formula Hint (E = V/d)',
    steps: [
      { label: 'Step 1: Uniform Field Between Parallel Plates', formula: 'E = V / d' },
      { label: 'Step 2: Convert Separation to Metres', formula: 'd = 2 cm = 2 × 10⁻² m' },
      { label: 'Step 3: Evaluate', formula: 'E = 200 / 0.02 = 10 000 V m⁻¹' },
    ],
  },
  {
    id: 'mg-force',
    topicId: 'magnetism',
    year: 2021,
    paper: 'Paper I',
    number: 29,
    stem: 'An electron moves at **2 × 10⁶ m s⁻¹** perpendicular to a uniform magnetic field of **0.5 T**. What is the magnitude of the magnetic force on it? Take e = **1.6 × 10⁻¹⁹ C**.',
    options: ['8.0 × 10⁻¹⁴ N', '1.6 × 10⁻¹³ N', '3.2 × 10⁻¹³ N', '1.6 × 10⁻¹² N', '1.6 × 10⁻¹⁹ N'],
    answer: 1,
    hint: 'Formula Hint (F = qvB)',
    steps: [
      { label: 'Step 1: Magnetic Force on a Moving Charge', formula: 'F = qvB sin θ, with θ = 90°' },
      { label: 'Step 2: Substitute Values', formula: 'F = 1.6 × 10⁻¹⁹ × 2 × 10⁶ × 0.5' },
      { label: 'Step 3: Evaluate', formula: 'F = 1.6 × 10⁻¹³ N' },
    ],
  },
  {
    id: 'mg-flux',
    topicId: 'magnetism',
    year: 2019,
    paper: 'Paper I',
    number: 31,
    stem: 'A circular loop of radius **0.1 m** lies perpendicular to a uniform magnetic field of **0.4 T**. What is the magnetic flux through the loop?',
    options: ['0.004 Wb', '0.013 Wb', '0.040 Wb', '0.126 Wb', '0.400 Wb'],
    answer: 1,
    hint: 'Formula Hint (Φ = BA)',
    steps: [
      { label: 'Step 1: Area of the Loop', formula: 'A = πr² = π × (0.1)² = 0.0314 m²' },
      { label: 'Step 2: Magnetic Flux', formula: 'Φ = BA cos θ, with θ = 0°' },
      { label: 'Step 3: Evaluate', formula: 'Φ = 0.4 × 0.0314 ≈ 0.013 Wb' },
    ],
  },
  {
    id: 'ec-opamp',
    topicId: 'electronics',
    year: 2022,
    paper: 'Paper I',
    number: 35,
    stem: 'An ideal inverting amplifier uses an input resistor of **2 kΩ** and a feedback resistor of **10 kΩ**. What is its voltage gain?',
    options: ['−5', '−0.2', '−2', '+5', '+6'],
    answer: 0,
    hint: 'Formula Hint (G = −R_f/R_in)',
    steps: [
      { label: 'Step 1: Inverting Amplifier Gain', formula: 'G = −R_f / R_in' },
      { label: 'Step 2: Substitute Values', formula: 'G = −10 kΩ / 2 kΩ' },
      { label: 'Step 3: Evaluate', formula: 'G = −5 (inverted and amplified five times)' },
    ],
  },
  {
    id: 'ec-diode',
    topicId: 'electronics',
    year: 2021,
    paper: 'Paper I',
    number: 34,
    stem: 'A silicon diode with a forward voltage drop of **0.7 V** is connected in series with a **1 kΩ** resistor across a **5 V** supply. What is the current in the circuit?',
    options: ['0.7 mA', '4.3 mA', '5.0 mA', '7.0 mA', '50 mA'],
    answer: 1,
    hint: 'Formula Hint (I = (V − V_D)/R)',
    steps: [
      { label: 'Step 1: Voltage Across the Resistor', formula: 'V_R = V − V_D = 5 V − 0.7 V = 4.3 V' },
      { label: 'Step 2: Ohm’s Law', formula: 'I = V_R / R = 4.3 V / 1000 Ω' },
      { label: 'Step 3: Evaluate', formula: 'I = 4.3 × 10⁻³ A = 4.3 mA' },
    ],
  },
  {
    id: 'mp-young',
    topicId: 'matter-properties',
    year: 2020,
    paper: 'Paper I',
    number: 32,
    stem: 'A wire of length **2 m** and cross-sectional area **1 × 10⁻⁶ m²** is stretched by a force of **100 N**. If Young’s modulus of the material is **2 × 10¹¹ N m⁻²**, what is the extension?',
    options: ['0.1 mm', '0.5 mm', '1.0 mm', '2.0 mm', '10 mm'],
    answer: 2,
    hint: 'Formula Hint (e = FL/AY)',
    steps: [
      { label: 'Step 1: Young’s Modulus Definition', formula: 'Y = (F/A) / (e/L) ⇒ e = FL / AY' },
      { label: 'Step 2: Substitute Values', formula: 'e = (100 × 2) / (1 × 10⁻⁶ × 2 × 10¹¹)' },
      { label: 'Step 3: Evaluate', formula: 'e = 200 / 2 × 10⁵ = 1 × 10⁻³ m = 1.0 mm' },
    ],
  },
  {
    id: 'mp-surface-tension',
    topicId: 'matter-properties',
    year: 2018,
    paper: 'Paper I',
    number: 33,
    stem: 'A soap film is formed on a rectangular frame of length **0.1 m**. If the surface tension of the soap solution is **0.04 N m⁻¹**, what is the force on the movable wire due to the film?',
    options: ['2 mN', '4 mN', '8 mN', '16 mN', '40 mN'],
    answer: 2,
    hint: 'Formula Hint (F = 2TL for a soap film)',
    steps: [
      { label: 'Step 1: Two Surfaces of a Soap Film', formula: 'F = 2 T L' },
      { label: 'Step 2: Substitute Values', formula: 'F = 2 × 0.04 × 0.1' },
      { label: 'Step 3: Evaluate', formula: 'F = 0.008 N = 8 mN' },
    ],
  },
  {
    id: 'mr-photoelectric',
    topicId: 'radiation',
    year: 2023,
    paper: 'Paper I',
    number: 38,
    stem: 'Light of photon energy **3.0 eV** falls on a metal surface whose work function is **2.0 eV**. What is the maximum kinetic energy of the emitted photoelectrons?',
    options: ['0.5 eV', '1.0 eV', '2.0 eV', '3.0 eV', '5.0 eV'],
    answer: 1,
    hint: 'Formula Hint (K_max = hf − Φ)',
    steps: [
      { label: 'Step 1: Einstein’s Photoelectric Equation', formula: 'K_max = hf − Φ' },
      { label: 'Step 2: Substitute Values', formula: 'K_max = 3.0 eV − 2.0 eV' },
      { label: 'Step 3: Evaluate', formula: 'K_max = 1.0 eV' },
    ],
  },
  {
    id: 'mr-half-life',
    topicId: 'radiation',
    year: 2019,
    paper: 'Paper I',
    number: 40,
    stem: 'A radioactive sample of mass **80 g** has a half-life of **5 days**. What mass of the original nuclide remains after **15 days**?',
    options: ['5 g', '10 g', '20 g', '40 g', '60 g'],
    answer: 1,
    hint: 'Formula Hint (N = N₀(½)ⁿ)',
    steps: [
      { label: 'Step 1: Number of Half-lives', formula: 'n = t / T½ = 15 / 5 = 3' },
      { label: 'Step 2: Decay Relation', formula: 'N = N₀ × (½)ⁿ = 80 × (½)³' },
      { label: 'Step 3: Evaluate', formula: 'N = 80 / 8 = 10 g' },
    ],
  },
];

export const QUESTION_MAP: Record<string, Question> = QUESTIONS.reduce(
  (acc, question) => ({ ...acc, [question.id]: question }),
  {} as Record<string, Question>,
);

export function questionsForTopics(topicIds: TopicId[]): Question[] {
  const allowed = new Set(topicIds);
  return QUESTIONS.filter((question) => allowed.has(question.topicId));
}
