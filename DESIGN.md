# Aura — Project Brief

## One-line pitch
A webcam playground of visual-AI experiences. Open the app, pick an aura, become it. Mode #1 ships with hand-tracked superpowers; future modes add face morphs, AI character generation, background swap, and more.

## Why an umbrella app, not separate projects
- Camera handling, MediaPipe loading, Canvas overlay, settings, audio, recording — all of these are shared infrastructure. Building each mode as its own repo means writing this code three times.
- One URL on your resume that opens to a launcher with multiple impressive things → "this person ships." Three URLs to half-finished demos → "this person can't decide what they're building."
- The product itself is "pick a mode" — splitting it into separate apps fights the actual concept.
- Adding mode #2, #3, #4 later is just dropping a folder into `src/modes/` and adding one entry to a registry. Zero touching of the shared core.

---

## Tech stack & engineering rules
See `CLAUDE.md` — tech stack, code conventions, testing rules, commit standards, and recurring gotchas live there and apply to everything in this doc. Single repo, `npm install && npm run dev`, no backend.

---

## Architecture: shared core + pluggable modes

The whole app boils down to one abstraction: a **Mode**. Each mode declares what it needs (which MediaPipe model, which audio assets) and provides a React component for its play screen. The shell handles everything else.

### The Mode interface
```typescript
// src/core/types.ts
export interface Mode {
  id: string;                    // "mana-hands"
  name: string;                  // "Mana Hands"
  tagline: string;               // shown on the launcher card
  longDescription: string;       // shown when card is hovered/selected
  thumbnailUrl: string;          // launcher card preview image or video
  accentColor: string;           // hex; used for the card glow + HUD theming
  requires: TrackerKind[];       // ["hand-landmarker"]
  Component: React.ComponentType; // the play screen
}

export type TrackerKind = "hand-landmarker" | "face-landmarker" | "selfie-segmentation";
```

### The mode registry
```typescript
// src/modes/index.ts
import { manaHandsMode } from "./mana-hands";
// import { faceMorphMode } from "./face-morph";   // later
// import { aiCharacterMode } from "./ai-character"; // later

export const modes: Mode[] = [
  manaHandsMode,
  // faceMorphMode,
  // aiCharacterMode,
];
```

### App flow
1. **Title screen** — Aura logo, "Enter" CTA, ambient particle field, camera permission prompt
2. **Launcher** — grid of mode cards from the registry; hovering shows the long description and animates the thumbnail
3. **Active mode** — `ModeShell` mounts the selected mode's component, provides shared HUD chrome (back button, settings, record button), and ensures the right MediaPipe trackers are loaded based on the mode's `requires` array
4. **Back to launcher** — Esc or back button; mode unmounts, trackers stop, resources freed

### CameraProvider
A single React context owns the `MediaStream`, the `<video>` element, and a registry of active trackers. The `ModeShell` reads the active mode's `requires` and asks the provider to spin up the matching trackers. Switching modes tears down trackers the new mode doesn't need.

This keeps every mode honest: it can't accidentally hold onto resources, and the shell can show a "loading..." state while a tracker initializes.

---

## Mode #1: Mana Hands

Hand-tracked superpowers in a shonen-anime aesthetic. Four powers ship in v1, all triggered by gestures.

### The four powers (v1)

**1. Finger gun → energy bolts**
Pose: thumb up, index out, others curled. Trigger: thumb drops past a threshold. Effect: glowing yellow-orange bolt fires from the index fingertip with muzzle flash and brief recoil jitter.

**2. Fireball charge & throw**
Pose: closed fist (charging). Trigger: open palm forward with forward velocity. Effect: red-orange swirling sphere on the fist while charging, launches forward on release with a fire trail.

**3. Lightning between fingertips**
Pose: open hand, all five fingers spread. Trigger: held continuously. Effect: jagged electric-blue arcs jump between adjacent fingertips, halo glow around the hand.

**4. Two-palm Kamehameha**
Pose: both hands present, palms facing each other within ~hand-width. Trigger: both palms thrust forward. Effect: cyan-white energy ball charges between palms, releases as a thick beam with shockwave and motion lines.

### Gesture classifier
A pure function `classifyGesture(landmarks): Gesture` reads the 21 MediaPipe landmarks and returns one of `FINGER_GUN | FIST | OPEN_SPREAD | TWO_PALM_KAMEHAMEHA | NONE`. Heuristics, not ML:
- Finger "extended" = tip far from palm center AND tip farther from palm than the PIP joint
- "Curled" = tip near palm center
- "Spread" = average angle between adjacent extended fingertips above threshold
- "Two-palm" = both hands detected + palm-normal dot product < -0.5 + palm-to-palm distance < 1.5 × hand width

Smooth output with a 3-frame majority filter to prevent flicker. This function is pure, deterministic, and **fully unit-testable** — write tests for true and false cases of each gesture.

### Visual aesthetic — anime / shonen energy
- Saturated neon palette: yellow (gun), orange-red (fire), cyan (lightning + Kamehameha)
- Heavy bloom/glow on every effect (layered blurred Canvas draws)
- Brief screen-shake on big releases
- Speed-lines from screen edges toward the action when a power fires
- Comic-book SFX text bursts on impact ("ZAP!", "BOOM!", "KA-MEHA!"), 0.4s pop-and-fade
- White flash-frame on Kamehameha release
- All particle counts behind a single tunable config so we can dial down on slower machines

### Mana Hands HUD (rendered by `ModeShell` + a mode-specific overlay)
- Active gesture indicator (icon row, lights up the detected pose)
- Mana bar (regens; powers cost different amounts; Kamehameha is expensive)
- Cooldown indicators per power

---

## Future modes (don't build now, design for them)

Each gets its own folder under `src/modes/` with its own internal structure. Sketched here so the architecture supports them without rework:

- **Face Morph** (`face-morph`) — anime/celebrity face overlays. Requires `face-landmarker`.
- **AI Character** (`ai-character`) — generate full character transformations from a text prompt. Requires segmentation + an external image-generation API (later).
- **Stage Swap** (`stage-swap`) — swap your background to anywhere. Requires `selfie-segmentation`.
- **Sign / Number Reader** (`sign-counter`) — gestures → numbers, simple sign-language demo. Requires `hand-landmarker`.

The point: every one of these slots into the same app. The user picks them from the launcher. They don't even know it's "different code paths" under the hood.

---

## Portfolio-grade requirements

Engineering rules (TS strict, lint, tests, conventional commits, no committed secrets, accessibility, etc.) are enforced via `CLAUDE.md`. This section covers the parts that are design decisions, not running rules.

### README — what recruiters actually read

In order:
1. Project name + one-line tagline
2. **Animated GIF demo** showing the launcher + Mana Hands powers in action (target <8MB)
3. Live demo link (Vercel URL) and "Try it yourself" instructions
4. Tech stack badges
5. What it does — 2-3 sentences
6. **How it works** — short technical explainer with a pipeline diagram (webcam → MediaPipe → mode → effects). The section that signals you understand what you built.
7. **Architecture overview** — the shared-core + pluggable-modes pattern, why you chose it. Signals seniority more than any other section.
8. Local dev — `git clone` / `npm install` / `npm run dev` block
9. **Design decisions** — why Canvas 2D over WebGL, why landmark heuristics over an ML classifier, why Zustand over Redux, why `tasks-vision` over the older `@mediapipe/hands` package
10. **Challenges & learnings** — 3-5 bullets on hard problems and how you solved them (gesture flicker, tracker lifecycle on mode switch, two-hand pose detection, perf tuning)
11. Roadmap / known limitations — honest list of what's not done
12. License

### Deployment

Vercel — connect the GitHub repo, deploys on every push to `main`, free, gives a real URL like `aura-app.vercel.app`. HTTPS is automatic (required for `getUserMedia`). This URL goes in the README and on your resume.

---

## File structure

```
aura/
├── README.md
├── LICENSE
├── .gitignore
├── .eslintrc.cjs
├── .prettierrc
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── vitest.config.ts
├── index.html
├── package.json
├── .github/
│   └── workflows/
│       └── ci.yml
├── public/
│   ├── og-image.png
│   └── sfx/                          # all audio assets, organized by mode
│       └── mana-hands/
├── src/
│   ├── main.tsx
│   ├── App.tsx                       # routes between TitleScreen → Launcher → ModeShell
│   ├── shell/
│   │   ├── TitleScreen.tsx
│   │   ├── Launcher.tsx              # grid of mode cards from the registry
│   │   ├── ModeCard.tsx
│   │   ├── ModeShell.tsx             # wraps the active mode, owns back button + chrome
│   │   ├── SettingsPanel.tsx
│   │   └── RecordButton.tsx
│   ├── core/
│   │   ├── types.ts                  # Mode interface + tracker kinds
│   │   ├── camera/
│   │   │   └── CameraProvider.tsx    # owns MediaStream + video element
│   │   ├── canvas/
│   │   │   └── EffectsCanvas.tsx     # the overlay <canvas>
│   │   ├── audio/
│   │   │   └── sfx.ts                # Howler setup + load helpers
│   │   ├── tracking/
│   │   │   ├── HandTracker.ts
│   │   │   ├── FaceTracker.ts        # stub for now; built when face-morph mode arrives
│   │   │   ├── SegmentationTracker.ts # stub for now
│   │   │   └── trackerRegistry.ts    # picks the right tracker based on mode.requires
│   │   ├── particles/
│   │   │   └── particleSystem.ts     # shared particle engine usable by any mode
│   │   └── ui/
│   │       ├── ManaBar.tsx           # a generic resource-bar component reusable across modes
│   │       └── GestureIndicator.tsx
│   ├── modes/
│   │   ├── index.ts                  # mode registry
│   │   └── mana-hands/
│   │       ├── index.ts              # exports the Mode object
│   │       ├── ManaHandsMode.tsx     # the play screen
│   │       ├── classifyGesture.ts
│   │       ├── effects/
│   │       │   ├── fingerGun.ts
│   │       │   ├── fireball.ts
│   │       │   ├── lightning.ts
│   │       │   └── kamehameha.ts
│   │       └── thumbnail.png
│   ├── state/
│   │   └── store.ts                  # Zustand: active mode, settings, mana, etc.
│   └── styles/
│       └── globals.css
└── tests/
    ├── classifyGesture.test.ts
    ├── particleSystem.test.ts
    └── helpers/
        └── mockLandmarks.ts          # fixture builders for hand poses
```

---

## Build order for Claude Code

**Phase 1 — foundation, shell, launcher (one solid sitting)**
1. Vite + React + TS + Tailwind scaffold with strict TypeScript
2. ESLint + Prettier configured, lint/format scripts
3. Vitest configured, sample test passes
4. `git init`, first commit, push to a fresh GitHub repo named `aura`
5. GitHub Actions CI workflow (lint + test + build)
6. Connect repo to Vercel — even an empty page is live at a URL
7. README skeleton with all section headers (placeholders for GIF, etc.)
8. Title screen with logo + Enter CTA + camera permission flow
9. CameraProvider — owns the MediaStream and exposes a `<video>` element
10. Define `Mode` interface in `core/types.ts`
11. Register a single dummy mode with one button that says "hello from mode" so we can verify Launcher → Mode → back works
12. Launcher screen renders mode cards from the registry
13. ModeShell with back-to-launcher button, settings gear, record button stub
14. Push — confirm CI green, confirm Vercel deployed, confirm full flow works end-to-end

**Phase 2 — Mana Hands mode, first power end-to-end**
15. HandTracker wired up; only initializes when active mode requires it
16. ManaHandsMode component renders landmarks as colored dots (proof of life inside the mode)
17. `classifyGesture` for finger-gun pose + unit tests covering true/false cases
18. EffectsCanvas overlay + finger-gun energy bolt (full polish — particles, SFX, screen-shake)
19. Push. The deployed app now has: launcher → Mana Hands → finger gun works. Try it on a friend's machine. This is your first "show people" moment.

**Phase 3 — remaining three Mana Hands powers**
20. Fireball + tests
21. Lightning + tests
22. Kamehameha + tests
23. Auto-particle-reduction perf fallback

**Phase 4 — Mana Hands UX polish**
24. Mana bar, cooldowns, gesture indicator HUD
25. SettingsPanel: mirror toggle, audio volume, particle intensity, camera selector
26. Record button via MediaRecorder
27. Accessibility pass (keyboard, aria-labels, denied-permission state)

**Phase 5 — overall portfolio polish (the part that gets you the job)**
28. Record a 10–15s demo clip (launcher tour + Mana Hands powers), convert to optimized GIF
29. Write the real README — every section in your own voice. Architecture and Challenges sections matter most.
30. Social preview image (`public/og-image.png`) + meta tags so links unfurl on Twitter/LinkedIn
31. Add live demo URL to the GitHub repo's "About" sidebar
32. Add to your portfolio site / resume
33. (High-leverage optional) Short blog or LinkedIn post on one technical challenge you solved (gesture flicker is a great one). Link the repo. This often does more for job applications than the repo alone.

**Phase 6+ — additional modes (later, on your own pace)**
Each new mode is its own focused mini-project: design the gestures/inputs, build the effects, write tests for the classifier, drop it into `src/modes/`, add to the registry. The Phase 5 README and demo GIF get updated each time.

Suggested order based on difficulty/impact: Stage Swap (easy, segmentation only) → Sign Counter (easy, reuses HandTracker) → Face Morph (medium) → AI Character (hardest, external API).
