# Bhauthika

Adaptive A/L Physics practice app for Sri Lankan students to practice past paper questions.

Built with **React Native + Expo (SDK 58)** and **Expo Router**, targeting both iOS and Android from a single TypeScript codebase (also runs on the web for quick previews). The UI implements the seven Stitch screens in [`stitch_bhauthika_physics_app_ui`](stitch_bhauthika_physics_app_ui) against the *Bhauthika Laboratory & Study System* design tokens.

## Screens

| Screen | Route | Notes |
| --- | --- | --- |
| Welcome / sign-in | `src/app/index.tsx` | Exam badge, value props, Google + email sign-in |
| Home | `src/app/(tabs)/home.tsx` | Adaptive focus hero, today's progress, focus topics, exam countdown |
| Practice | `src/app/(tabs)/practice.tsx` | Smart mix / choose topic, search, 11 syllabus units with mastery |
| Question | `src/app/session.tsx` | Segmented progress, past-paper chips, diagram, 5 MCQ options, formula hint |
| Answer feedback | `src/components/feedback-sheet.tsx` | Bottom sheet with "Not quite" / "Correct answer" and worked derivation |
| Session summary | `src/app/summary.tsx` | Score ring, mastery points, per-topic mastery movement |
| Progress | `src/app/(tabs)/progress.tsx` | Accuracy + volume metrics, weekly pacing chart, weakest-first mastery list, drill suggestion |

A shared slide-up menu (Home / Practice / Progress / reset / sign out) is reachable from every tab header.

## Running the app

```bash
npm install
npx expo start          # scan the QR code with Expo Go, or press a / i / w
```

Other scripts:

```bash
npm run android   # expo start --android (device or emulator)
npm run ios       # expo start --ios (macOS only)
npm run web       # expo start --web (browser preview)
npm run typecheck # tsc --noEmit
```

## How practice works

- `src/data/questions.ts` holds the curated English-medium MCQ bank. Each item carries the exam year/paper/number, five options, a formula hint and the step-by-step derivation shown in the feedback sheet.
- `src/data/topics.ts` holds the 11 syllabus units with their display metadata and seed mastery.
- `src/store/study-context.tsx` runs the session engine: it samples a question set, records answers, recomputes topic mastery (`70%` prior + `30%` session accuracy) and updates streaks, daily progress and weekly pacing.
- Progress is cached on-device with AsyncStorage (`bhauthika.progress.v1`), so streaks and mastery survive an app restart. Use **Reset practice data** in the menu to return to the seeded demo profile.

## Project structure

```
src/
  app/                 # Expo Router routes (welcome, tabs, session, summary)
  components/          # Brand mark, app header, tab bar, charts, sheets, UI primitives
  data/                # Question bank + syllabus topics
  store/               # Study/session context with local persistence
  theme/               # Color, spacing, radius, elevation and type tokens
  utils/               # Haptics helper
assets/images/         # App icon, adaptive icon layers, splash and favicon
```

Design references live in `stitch_bhauthika_physics_app_ui/` (screen PNGs, HTML and `DESIGN.md`).
