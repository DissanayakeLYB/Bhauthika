---
name: Bhauthika Laboratory & Study System
colors:
  surface: '#faf8ff'
  surface-dim: '#d8d9e7'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#ecedfb'
  surface-container-high: '#e6e7f6'
  surface-container-highest: '#e0e2f0'
  on-surface: '#181b25'
  on-surface-variant: '#464650'
  inverse-surface: '#2d303b'
  inverse-on-surface: '#eff0fe'
  outline: '#777682'
  outline-variant: '#c7c5d2'
  surface-tint: '#52589f'
  primary: '#070b57'
  on-primary: '#ffffff'
  primary-container: '#20256b'
  on-primary-container: '#898fdb'
  inverse-primary: '#bec2ff'
  secondary: '#4f54b3'
  on-secondary: '#ffffff'
  secondary-container: '#959afe'
  on-secondary-container: '#282c8c'
  tertiary: '#261500'
  on-tertiary: '#ffffff'
  tertiary-container: '#422800'
  on-tertiary-container: '#cd8600'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bec2ff'
  on-primary-fixed: '#0b0f59'
  on-primary-fixed-variant: '#3a4086'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#03006d'
  on-secondary-fixed-variant: '#373b9a'
  tertiary-fixed: '#ffddb5'
  tertiary-fixed-dim: '#ffb957'
  on-tertiary-fixed: '#2a1800'
  on-tertiary-fixed-variant: '#643f00'
  background: '#faf8ff'
  on-background: '#181b25'
  surface-variant: '#e0e2f0'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  question-text:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system blends an analytical, experimental laboratory aesthetic with a tranquil, high-focus digital workspace tailored for Sri Lankan G.C.E. Advanced Level Physics students. 

The design narrative bridges rigor and accessibility. While Sri Lankan A/L Physics is intellectually demanding and high-stakes, the interface avoids clinical intimidation. It pairs technical, geometric headings (`Space Grotesk`) with the warm, open, and human contours of `Plus Jakarta Sans` for body reading. 

The visual style is characterized by:
- **Laboratory Clarity:** Generous whitespace, precise structural alignment, and clear mathematical hierarchy that strip away cognitive load.
- **Calm Modernism:** Soft layered surfaces, subtle slate borders, and deliberate accent signals that eliminate study anxiety.
- **Tactile Utility:** Highly visible tap targets (minimum 48px), pill indicators, and structured multi-choice modules engineered for rapid, error-free interaction across modern and budget mobile devices alike.

## Colors

The palette establishes a balance between deep academic authority and actionable visual feedback.

- **Primary Core (`#20256B` & `#3B3F9E`):** Represents focused intellect and stability. Deep Indigo serves as the anchoring base for headers, key callouts, and system emphasis, while `#2E3280` governs pressed and active states.
- **Canvas & Neutrals (`#F8F9FC`, `#FFFFFF`, `#E8ECF4`):** Soft, off-white canvas backgrounds mitigate eye strain during multi-hour study sessions. Elevated cards sit on crisp white with a delicate 1px border (`#E8ECF4`) to delineate interactive boundaries without visual noise.
- **Diagnostic Accents:**
  - **Attention Amber (`#F5A524` / `#FEF6E9`):** Flags weak syllabus topics, revision alerts, and active calculation prompts without inducing panic.
  - **Mastery Green (`#2E9E6B` / `#EBF7F1`):** Signals verified solutions, formula mastery, and completed derivation steps.
  - **Correction Red (`#D64545` / `#FDECEC`):** Highlights conceptual errors, incorrect options, and misapplied units cleanly.
- **Typography Tones:** Strict three-tiered slate hierarchy (`#1B1E28` for primary text and equations, `#636A7E` for contextual metadata, `#9CA3AF` for tertiary footnotes).

## Typography

The typographic system provides maximum legibility for complex physical notation, diagrams, and dense problem stems.

- **Headlines & Technical Meta (`Space Grotesk`):** Used for unit titles, topic hierarchies, score telemetry, and card labels. Its geometric structure imparts an authentic engineering/scientific feel.
- **Reading & Problems (`Plus Jakarta Sans`):** Selected for high clarity, open counters, and unstrained reading comfort. Physics problems, conceptual breakdowns, and worked solutions utilize a specialized `question-text` scale (18px font / 28px line height) to accommodate mathematical symbols, subscripts, and fractional units cleanly.
- **Numerics & Formulae:** Mathematical values, option letters (A–E, 1–5), and unit annotations maintain tabular alignment and tight horizontal precision.

## Layout & Spacing

The layout model is mobile-first, prioritizing one-handed operational ergonomics on Android viewports while scaling cleanly to tablets and study laptops.

- **Grids & Safe Bounds:**
  - **Mobile (< 640px):** Single-column layout with fixed 16px (`1rem`) outer canvas margins and 16px gutter spacing between card structures.
  - **Tablet (640px - 1024px):** 6-column fluid structure with 24px margins, allowing question diagrams and multiple-choice options to rest side-by-side.
  - **Desktop (> 1024px):** Centered max-width container (768px for deep-work quiz mode; 1080px for analytics and review dashboards) to prevent visual line lengths from exceeding 75 characters.
- **Vertical Rhythm:** 
  - Problem stems to options: `1.5rem` (`space-lg`).
  - Between individual MCQ card options: `0.75rem` (`space-sm`).
  - Bottom navigation clearance: strictly `4.5rem` (`72px`) clear padding to avoid content occlusion above the persistent menu.

## Elevation & Depth

Visual hierarchy relies on soft, ambient multi-layer surfaces rather than heavy drop shadows, reinforcing the calm study environment.

- **Level 0 (Canvas):** Pure `#F8F9FC`, flat base.
- **Level 1 (Surface Cards & Options):** `#FFFFFF` background with a crisp 1px solid `#E8ECF4` border and an ultra-diffused shadow: `0px 2px 8px rgba(27, 30, 40, 0.04)`.
- **Level 2 (Interactive Floating / Active MCQ):** Applied when an option is selected or a card is focused. Border shifts to 1.5px solid `#20256B` with a tinted ambient bloom: `0px 6px 16px rgba(32, 37, 107, 0.08)`.
- **Level 3 (Modal Sheets & Answer Explanations):** Slide-up bottom sheets employ a high-radius upward shadow: `0px -8px 24px rgba(27, 30, 40, 0.08)` complemented by a dimmed backdrop overlay of `rgba(27, 30, 40, 0.35)`.

## Shapes

The design system applies a cohesive **Rounded (Level 2)** geometry across its surfaces, delivering a friendly, approachable touch feel:

- **Base Radius (`rounded-md`, 0.5rem / 8px):** Small badges, button icons, and mathematical callout tags.
- **Intermediate Radius (`rounded-lg`, 1rem / 16px):** Primary content containers, question cards, option tiles, and dialog modals.
- **Large Radius (`rounded-xl`, 1.5rem / 24px):** Bottom sheet top contours and prominent dashboard milestone modules.
- **Pill Contours (`rounded-full`, 9999px):** Applied exclusively to metadata chips (exam year, syllabus topic, timer badges) and interactive segmented radio badges.

## Components

### 1. Multiple-Choice Question (MCQ) Cards
- **Structure:** Full-width card with minimum height of 56px to guarantee comfortable touch accuracy.
- **Badge Indicator:** A 32px circular or rounded-pill avatar on the left housing the option identifier (1 to 5 or A to E) set in `Space Grotesk` medium.
- **States:**
  - *Default:* `#FFFFFF` surface, 1px `#E8ECF4` border, `#1B1E28` body copy.
  - *Selected / Active:* `#FFFFFF` surface, 2px `#20256B` border, option badge filled with `#20256B` with white text.
  - *Verified Correct:* `#EBF7F1` surface, 1.5px `#2E9E6B` border, badge filled with `#2E9E6B` and white check icon.
  - *Incorrect Selected:* `#FDECEC` surface, 1.5px `#D64545` border, badge filled with `#D64545` and white cross icon.

### 2. Buttons
- **Primary:** Deep Indigo `#20256B` background, pure white text, 12px vertical padding, `rounded-lg` (16px), minimum height 48px. Pressed state darkens to `#2E3280`.
- **Secondary / Ghost:** Transparent background with 1px `#E8ECF4` border, `#20256B` text. Active state gains `#F8F9FC` background.
- **Amber Action (Review / Hint):** `#FEF6E9` background, `#F5A524` text, zero border for high-focus secondary aids.

### 3. Topic & Metadata Chips
- **Geometry:** Height 28px, `rounded-full` pill structure with 12px horizontal padding.
- **Styling:** Neutral background `#E8ECF4` with `#636A7E` text in `label-sm` (`Space Grotesk`).
- **Domain Variants:** Year tags (e.g., "2022 A/L") utilize neutral slate; Syllabus units (e.g., "Mechanics", "Fields") utilize light Indigo tint background (`#EEF0FF`) with `#20256B` text.

### 4. Sleek Progress Bar
- **Track:** 6px height, `rounded-full` track in `#E8ECF4`.
- **Fill:** Smooth gradient or solid `#20256B` with an animated easing curve (`cubic-bezier(0.4, 0, 0.2, 1)`).
- **Milestone Dividers:** Subtle 1.5px vertical cuts in `#FFFFFF` representing question segments.

### 5. Mobile Bottom Navigation Bar
- **Dimensions:** 64px height, docked to the screen bottom with integrated safe-area padding.
- **Surface:** `#FFFFFF` with a 1px border-top (`#E8ECF4`) and subtle elevation.
- **3-Tab Configuration:** Home, Practice, Progress.
- **States:** Active tab displays a solid `#20256B` icon paired with a micro pill indicator dot; inactive tabs use `#9CA3AF`.

### 6. Answer Feedback Bottom Sheet
- **Container:** Positioned at viewport bottom with 24px top radii (`rounded-t-2xl`), `#FFFFFF` surface, Level 3 elevation.
- **Top Pull Tab:** 36px wide by 4px high pill bar in `#E8ECF4` centered 8px below the top rim.
- **Content:** Immediate diagnostic status header ("Correct Answer" in `#2E9E6B` or "Conceptual Pitfall" in `#D64545`), followed by step-by-step physics derivations formatted in `question-text` line heights.