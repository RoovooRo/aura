# Aura

Webcam playground of visual-AI experiences — pick an aura, become it. Built as a portfolio piece for job applications: every commit, PR, and deployment must reflect that bar.

Full design doc: `DESIGN.md` (in this folder). Read it once at project start, then operate from this file. When something isn't covered here or there, ask before assuming.

## Architecture: shared core + pluggable modes

The whole app is one abstraction: a **Mode**. The shell handles camera, navigation, settings, recording. Each mode declares what it needs and provides a play screen.

### Mode contract (`src/core/types.ts`)

```ts
interface Mode {
  id: string;
  name: string;
  tagline: string;
  longDescription: string;
  thumbnailUrl: string;
  accentColor: string;             // hex; drives card glow + HUD theming
  requires: TrackerKind[];         // which MediaPipe trackers to load
  Component: React.ComponentType;  // the play screen
}

type TrackerKind = "hand-landmarker" | "face-landmarker" | "selfie-segmentation";
```

### Where things go

- `src/core/` — camera, canvas, audio, tracking, particles, shared UI primitives. **Mode-agnostic.**
- `src/shell/` — title screen, launcher, `ModeShell` wrapper, settings, record button. **Mode-agnostic.**
- `src/modes/<mode-id>/` — a self-contained mode. Owns its component, classifier, effects, audio assets, tests.
- `src/modes/index.ts` — the registry. Adding a mode = adding one import + one array entry.
- `src/state/store.ts` — Zustand store for app-wide state.

### Rules for modes

- A mode never imports another mode.
- A mode never touches `getUserMedia`, MediaPipe loading, or canvas allocation directly — consume via shared core hooks.
- A mode's `requires` array is the source of truth for which trackers spin up. The shell mounts/unmounts trackers on mode switch.
- Modes load lazily via `React.lazy`. The launcher shows a per-card loading state.

## Tech stack

- Vite + React 18+ + TypeScript (**strict mode on**)
- Tailwind CSS
- Zustand for state
- `@mediapipe/tasks-vision` for trackers
- Canvas 2D for effects (upgrade to WebGL only if a specific effect demands it)
- Howler.js for audio
- MediaRecorder API for clip recording
- Vitest for tests
- React.lazy + Suspense for per-mode code splitting

## Code conventions

- TS strict. No `any` without an inline comment justifying it.
- Files cap at ~200 lines — split before that.
- Components: functional + hooks only.
- File naming: `kebab-case.ts` for non-component files, `PascalCase.tsx` for components.
- Import order: external → core → shell → modes → relative.
- Tailwind only. No inline styles or CSS-in-JS unless there's a real reason.

## Testing rules

Every feature with non-trivial logic has tests. Visual rendering does not.

- Pure functions (gesture classifiers, vector math, smoothing buffers, mana regen) → unit tests, colocated `*.test.ts` next to source.
- Each mode's classifier has **true AND false cases for every gesture** it recognizes.
- Fixture builders / mocks in `tests/helpers/` (e.g., `mockLandmarks.ts`).
- Run with `npm run test`. CI runs on every push.
- Skip: effect rendering, animations, MediaPipe internals, Canvas drawing.

**Definition of done for a feature**: code merged + tests passing + CI green + deployed URL works.

## Commits & PRs

- Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`. Scope encouraged: `feat(mana-hands): add finger gun`.
- One logical change per commit. No "wip" or "stuff" or 80-file dumps.
- CI (lint + test + build) must stay green on `main`. If a push breaks main, the next commit fixes it before anything else lands.
- Vercel auto-deploys from `main`. The deployed URL must always work — if a feature isn't demo-ready, gate it behind a feature flag or don't merge it.

## Portfolio bar

This repo is what a recruiter sees. Treat that as a constraint at all times:

- README stays up to date with current app state.
- Live demo link in README always works.
- Architecture and Challenges sections in README reflect real decisions and tradeoffs, not boilerplate.
- No committed secrets, no dead code, no commented-out blocks left in.

## Accessibility & UX

- Keyboard navigation works on title, launcher, and settings (tab order + visible focus rings).
- All interactive elements have `aria-label`s where the visible text isn't self-explanatory.
- Camera-permission denial → inline helpful message, never a crash.
- Auto-reduce particle count if frame time exceeds ~20ms sustained for a few seconds.
- Target Chrome / Edge. Safari has partial WebAssembly threading support — note this in README.

## Recurring gotchas

- `getUserMedia` requires HTTPS or `localhost`. Vite dev is fine; any other host needs HTTPS.
- MediaPipe model files load at runtime from Google's CDN — first paint includes a network fetch. Show a loading state.
- Mode switching **must** tear down the previous mode's trackers. Tracker leaks on mode switch are a real bug source.
- Mirror the video feed (CSS `transform: scaleX(-1)` on `<video>`). Apply the same flip to canvas coordinates so effects line up.
- Lazy-loaded modes need a Suspense fallback or the launcher freezes on first click into a mode.
