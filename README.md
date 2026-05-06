# Aura

> Webcam playground of visual-AI experiences — pick an aura, become it.

<!-- TODO(phase 5): replace with optimized GIF demo (<8MB) -->
<!-- ![Aura demo](docs/demo.gif) -->

**Live demo:** _coming soon_ <!-- TODO: paste Vercel URL once deployed -->

[![CI](https://github.com/RoovooRo/aura/actions/workflows/ci.yml/badge.svg)](https://github.com/RoovooRo/aura/actions/workflows/ci.yml)

---

## What it does

Aura is a single-page web app that turns your webcam into a stage. Open it, grant
camera access, pick a **mode** from the launcher, and become an aura. Mode #1 ships
with hand-tracked superpowers (finger-gun bolts, fireballs, lightning, Kamehameha);
future modes add face morphs, AI character generation, and background swap.

## How it works

```
webcam ──► <video> ──► MediaPipe tracker(s) ──► active mode ──► canvas effects + audio
                            │
                       (per-mode: hand / face / segmentation)
```

The **shell** owns the camera, navigation, settings, and recording. Each **mode**
declares which trackers it needs and provides a play screen — the shell mounts and
unmounts trackers as the user switches modes.

## Architecture overview

One abstraction runs the whole app: a `Mode`. Adding a new experience is dropping
a folder into `src/modes/` and adding one entry to a registry — no shared-core
changes required.

```
src/
├── core/      mode-agnostic: camera, canvas, audio, tracking, particles, primitives
├── shell/     mode-agnostic: title screen, launcher, mode wrapper, settings, record
├── modes/     self-contained modes — each owns its component, classifier, effects
├── state/     Zustand store for app-wide state
└── styles/    Tailwind base + globals
```

Why this shape:

- **Camera, MediaPipe loading, and canvas are shared infrastructure.** Building
  each mode as its own repo means writing this code three times.
- **One URL on a resume that opens to a launcher with multiple impressive things**
  signals "this person ships."
- **The product itself is "pick a mode."** Splitting it fights the concept.
- **Adding mode #2, #3, #4** is one folder + one registry line. The shared core
  doesn't change.

## Local dev

```bash
git clone https://github.com/RoovooRo/aura.git
cd aura
npm install
npm run dev          # http://localhost:5173 — needs camera permission
```

Other scripts:

```bash
npm run typecheck    # tsc -b --noEmit
npm run lint         # ESLint, zero warnings
npm run test         # Vitest run-once
npm run build        # production build
```

## Tech stack

- **Vite + React 18 + TypeScript** (strict)
- **Tailwind CSS** for styling
- **Zustand** for state
- **`@mediapipe/tasks-vision`** for hand / face / segmentation trackers <!-- (Phase 2+) -->
- **Canvas 2D** for effects (upgrades to WebGL only if a specific effect demands it)
- **Howler.js** for audio <!-- (Phase 2+) -->
- **MediaRecorder API** for clip capture <!-- (Phase 4) -->
- **Vitest** for unit tests, **GitHub Actions** for CI, **Vercel** for hosting

## Design decisions

<!-- TODO(phase 5): write these in your own voice once each call has been made -->

- **Canvas 2D over WebGL** — the bloom/glow effects are layered blurred draws, well
  inside Canvas 2D's perf budget; reaching for WebGL early adds shader complexity
  for no visual gain at v1.
- **Landmark heuristics over an ML gesture classifier** — the four poses are
  geometrically distinct (finger-gun is "thumb up + index out"), trivial to express
  as pure functions on 21 landmarks, and unit-testable without fixtures of a model.
- **Zustand over Redux** — single store, no middleware ceremony; the app state is
  small (active mode, screen, mana, settings).
- **`@mediapipe/tasks-vision` over `@mediapipe/hands`** — `tasks-vision` is the
  current Google-supported package; `@mediapipe/hands` is unmaintained.

## Challenges & learnings

<!-- TODO(phase 5): rewrite as 3-5 bullets with real specifics from the build -->

- _gesture flicker — 3-frame majority filter on classifier output_
- _tracker lifecycle on mode switch — provider tears down on unmount_
- _two-hand pose detection — palm-normal dot product + distance gate_
- _perf — auto-reduce particle count when frame time spikes_

## Roadmap

- [x] **Phase 1** — foundation, shell, launcher, dummy mode, CI, deployed URL
- [ ] **Phase 2** — Mana Hands: hand tracker + finger-gun power end-to-end
- [ ] **Phase 3** — fireball, lightning, Kamehameha
- [ ] **Phase 4** — HUD (mana bar, cooldowns), settings, record button, accessibility
- [ ] **Phase 5** — demo GIF, full README, social preview, portfolio polish
- [ ] **Phase 6+** — additional modes: Stage Swap, Sign Counter, Face Morph, AI Character

## Known limitations

- Webcam required (the app does nothing without it).
- Tested on Chrome / Edge. Safari has partial WebAssembly threading support and may
  show degraded performance.
- HTTPS is required for `getUserMedia` outside `localhost`.

## License

MIT — see [LICENSE](./LICENSE).
