# Bhauthika

Adaptive G.C.E. A/L Physics practice for Sri Lankan English-medium students. Past-paper MCQs, worked derivations and topic mastery tracking, rebuilt as a mobile-first web app.

The app is designed at **360 × 640** first (and must never scroll sideways at 320 px), then scales up to tablets and desktop. It runs entirely in the browser: no account, no backend, no secrets.

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js 16 (App Router) + TypeScript** | Static prerendering for every route, file-system routing, first-class Vercel deploys. |
| Styling | **Tailwind CSS v4** | Design tokens live in CSS (`@theme`), so the Stitch palette is available as utilities with no runtime CSS-in-JS. |
| Maths | **KaTeX** (lazy-loaded) | Typesets the worked derivations. Only fetched when a formula is on screen, with a plain-text fallback. |
| State | React context + pure functions | Session/mastery logic is framework-agnostic in `src/lib`, so it can move to a server later. |
| Persistence | `localStorage` behind `ProgressRepository` | Swappable for Supabase in Phase 2 without touching UI code. |
| Tests | **Vitest** | Fast unit tests for the question picker, mastery maths and storage adapters. |

There is no UI kit, chart library, animation library or state-management package. Icons are hand-rolled SVG, and the score ring, weekly chart and circuit diagram are hand-written SVG.

## Getting started

Requires Node.js 20.9+ (developed on Node 22).

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server (Turbopack). |
| `npm run build` | Production build; every route is statically prerendered. |
| `npm run start` | Serve the production build. |
| `npm run lint` | ESLint via `eslint-config-next`. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm run test` | Vitest unit tests (36 tests). |
| `npm run test:watch` | Vitest in watch mode. |

## Routes

| Screen | Route | Notes |
| --- | --- | --- |
| Welcome | `/` | Exam badge, value props, Google/email entry (both open the demo profile). |
| Home | `/home` | Adaptive focus hero, today's progress, weak topics, exam countdown. |
| Practice | `/practice` | Smart mix or choose from the 11 syllabus units, live search, mastery bars. |
| Question | `/session` | Segmented progress, past-paper chips, potentiometer diagram, five MCQ options, formula hint, sticky **Check answer**. |
| Answer feedback | overlay | Bottom sheet on phones, centred dialog from `md`; “Not quite”/“Correct answer” plus a step-by-step derivation. |
| Session summary | `/summary` | Animated score ring, mastery points, per-unit mastery movement, share/copy. |
| Progress | `/progress` | Accuracy and volume metrics, weekly pacing SVG, weakest-first mastery list, drill recommendation. |

Navigation is a bottom tab bar below `lg` and a left sidebar from `lg` up. Questions and summaries live outside the tab shell.

## Architecture

```
src/
  app/                 # App Router routes, layouts, PWA manifest, global tokens
    (shell)/           # home, practice, progress + tab/sidebar layout
    session/           # question flow (own full-screen layout)
    summary/           # session result
  components/          # Design-system primitives, navigation, charts, sheets
  data/                # Question bank and 11 syllabus units
  lib/
    session.ts         # pickQuestions, updateMastery, applySessionResult (pure)
    progress.ts        # StudyProgress model + seed profile helpers
    repository.ts      # ProgressRepository contract + localStorage adapters
    utils.ts           # tiny class-name helper
  components/providers/ # StudyProvider (client session state)
```

### Session engine

`src/lib/session.ts` is pure and dependency-free:

- `pickQuestions(pool, { topicIds, count, rng, fill })` draws a shuffled set, can top up from the rest of the bank, and accepts an injected `rng` for deterministic tests.
- `updateMastery(previous, accuracy, weight = 0.3)` blends 70 % prior mastery with 30 % session accuracy, clamps to 0–100 and rounds half-up (with float-noise trimming).
- `applySessionResult(progress, questions, answers)` folds a finished set into mastery, volume counters, the weekly series and points.

`src/components/providers/study-provider.tsx` is the only React-aware layer: it starts sessions (weakest units first on Home), records answers, persists progress, and keeps an interrupted session in `sessionStorage` so a phone reload does not lose the set.

### Persistence

`ProgressRepository` is a three-method contract (`load`, `save`, `clear`). `LocalProgressRepository` implements it over `localStorage` (`bhauthika.progress.v1`) and heals missing or corrupt fields with the seed profile. Phase 2 can add a Supabase implementation and pass it to the provider without changing UI code.

## Design system

The Stitch tokens are ported into `src/app/globals.css` via Tailwind’s `@theme`:

- Indigo core (`#20256B`), canvas `#F8F9FC`, elevated white cards with `#E8ECF4` borders.
- Diagnostic amber/green/red, with separate `*-ink` variants for text. The raw hues only reach 2.8–4.4:1 on our surfaces, so small text uses the darker variants (all ≥ 4.8:1) while fills and borders keep the design colours.
- Space Grotesk for headings/numerals and Plus Jakarta Sans for reading, self-hosted through `next/font/google` (two subset woff2 files, ~50 kB total).
- Type scale, radii (`tile` 12, `card` 16, `sheet` 28) and three elevation shadows are theme variables, not ad-hoc values.

Deliberate deviations from the Stitch screens are listed at the end of this file.

## Mobile-first implementation

- `min-h-dvh` everywhere (never `100vh`), `viewport-fit=cover`, and safe-area padding on the sticky top bars, session footer, tab bar, sheets and sidebar.
- Tap targets are at least 44 × 44 px; the search input is 16 px so iOS does not zoom.
- No hover-only interactions: hover is decoration, every action also works with tap/focus.
- Question screen keeps a full-width option card list, a SVG diagram that scales to `max-width: 100%`, and a sticky **Check answer** bar in thumb reach.
- Answer feedback is a bottom sheet with a focus trap on phones and a centred dialog from `md` up.
- Charts are hand-rolled SVG; KaTeX is code-split and only loads once feedback needs it.

## Accessibility & performance

- Semantic landmarks, one `h1` per screen, skip link, labelled `nav` regions, `aria-current` on tabs.
- Options are real radio inputs in a `<fieldset>`/`<legend>` with the tile focus ring drawn via `:has(input:focus-visible)`.
- Progress bars expose `role="progressbar"` with values; charts carry `role="img"` and text summaries.
- The sheet traps Tab, closes on Escape and restores focus; `prefers-reduced-motion` disables the ring/bar animations.
- Lighthouse mobile on the production build: **97 performance / 100 accessibility** for `/` and **95 / 100** for `/home` (CLS 0, ~246 KiB total page weight).

## PWA

`src/app/manifest.ts` serves a standalone manifest with 192/512 icons and a maskable icon generated from `assets/images/icon.png`; theme colour and Apple touch icon are set in the root layout metadata. Students can add the app to their home screen from Chrome/Safari. There is intentionally no service worker yet (offline caching is a Phase 2 concern).

## Deploying to Vercel

1. Import the repository in Vercel and keep the detected Next.js preset.
2. Deploy — no extra configuration, environment variables or build overrides are needed.

`.env.example` documents the (currently empty) environment surface and the Phase 2 Supabase placeholders. Never put a service-role key in a `NEXT_PUBLIC_*` variable.

## Scope and known limitations

- **Demo profile.** There is no authentication yet; both welcome buttons enter the seeded “Nimal” profile. Google/email sign-in is Phase 2 (the `expo-prototype` tag preserves the earlier Supabase experiment).
- **23 curated questions.** The bank covers 10 of the 11 units. The “42 Qs”, “128 Qs” numbers on Practice cards are syllabus-bank metadata from the design; the curated sets are shorter (2–3 per unit, and Measurement has none yet, which shows an inline notice). Home and summary copy therefore reports the real question count.
- **Home/Progress demo deltas.** “+3.5 % this month” and the four-day streak are seeded profile values; they are not computed from a real month of history.
- **Video explanations.** The prototype’s YouTube fields were placeholder `EXAMPLE` links, so they were dropped rather than shipped broken.
- **Design deviations.** The sign-in screen is a demo entry (no auth); “+4 % vs yesterday” is replaced with today’s correct/answered count because only today is tracked; small metadata uses `ink-muted` rather than the lighter `#9CA3AF` to pass AA contrast; the hero names the two weakest units dynamically instead of the hard-coded “Current Electricity & Mechanics”.
- **Verification.** Browser QA ran in Chrome at 360×640, 320×640 and 1440×900 (no horizontal overflow, all tap targets ≥ 44 px, no console errors) and Lighthouse was run against the production build. Native devices were not used; install on a physical Android/iOS phone is still on the manual QA list.

## Manual QA checklist (real phone)

1. Install from Chrome/Safari (“Add to Home Screen”) and confirm the icon, name and standalone launch at `/home`.
2. Sign-in entry: both buttons land on Home; back gesture returns to the welcome screen.
3. Home: start the adaptive set, answer ten questions, confirm summary and return home.
4. Question: rotate/resize or open the keyboard — the sticky **Check answer** stays reachable and no element overflows sideways.
5. Feedback: scroll the derivation, use the formula hint, and confirm KaTeX renders after the sheet opens (and that the plain text is readable before it loads).
6. Reload mid-session on purpose — the same question and answers should come back.
7. Finish a set, then reload `/progress`: totals and mastery must survive; “Reset practice data” returns the seeded profile.
8. Accessibility: keyboard-only pass (Tab/Shift+Tab, Escape closes the sheet), screen reader announces the radio group and progress bars, and reduced-motion turns off the score-ring animation.
9. Slow 3G / low-end Android: first load under ~5 s and no layout shift when fonts swap.

## History

The original Expo/React Native prototype (seven Stitch screens, AsyncStorage, a Supabase experiment) is tagged **`expo-prototype`** on `main`. This branch replaces it with the Next.js app; `supabase/schema.sql` and `seed.sql` are kept for Phase 2. Design references live in `stitch_bhauthika_physics_app_ui/` (local only, git-ignored).
