# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

A single-page, bilingual (VI/EN) graduation invitation built as a "boarding pass": the guest swipes to board, then pages through five sections. Next.js 15 App Router, React 19, Tailwind CSS v4, TypeScript. No backend, no animation library.

## Commands

Node is installed through **fnm** and is *not* on PATH in non-interactive shells. Prefix commands with:

```powershell
$env:PATH = "$env:APPDATA\fnm\node-versions\v22.18.0\installation;$env:PATH"
```

- `npm run dev` — dev server on http://localhost:3000
- `npm run build` — production build; this is the only type-check gate (no test suite, and ESLint is not installed, so `npm run lint` is not usable)
- **Never run `npm run build` while `npm run dev` is running.** They share `.next/` and the dev server breaks with `Cannot find module './NNN.js'`. Stop dev, build, delete `.next/`, then restart dev.

### Visual verification (Playwright)

`scripts/shoot.mjs` drives the running dev server with Playwright (Chromium is already installed).

```powershell
node scripts/shoot.mjs <outDir> <prefix>                 # screenshots
$env:SHOOT_MODE="measure"; node scripts/shoot.mjs x m    # measurements only
$env:SHOOT_SIZES="390x844,375x667,1280x720,1920x1080"    # viewports (width x height)
```

For each viewport it prints the height of every `main > section` (`s1:778(+58)` means 58px taller than the screen), flags horizontal overflow, and checks that one mouse-wheel notch and one PageDown each land exactly on the next section (`snap OK` / `SAI`). Full mode also saves the hero, each section (fixed UI hidden), and the post-swipe "boarded" state. Write screenshots to the session scratchpad, not the repo (`shots/` is gitignored).

## Working rules

- **Look before claiming a UI change is done.** Run `shoot.mjs`, read the images, iterate. Three earlier design rounds were rejected because they were built from code alone; screenshots exposed clipped Vietnamese diacritics, muddy blur "glows", and a map iframe that trapped scrolling — none of which were visible in the source.
- **Every section must fit exactly one viewport, and one scroll gesture moves one section.** After any layout change, re-run measure mode at small phone (375x667), phone (390x844), tablet (768x1024) and short laptop (1280x720) sizes and keep every section at `+0` with `snap OK`.
- **Design direction comes from `references/f71f8a04dcf3866f413317b97d118100.jpg`** (the ZARYA event deck): black/red, wide geometric uppercase type, cinematic red stage lighting, glossy red ribbon shapes, solid red label blocks, headlines split into a red line and an indented white line. Tone is restrained — red should be rare enough to matter. `lxd.md` is a teardown of *someone else's* invitation site: use it for feature ideas only, never for colors or typography (copying it was the first rejected design). `references/image.png` is a different template and is not the chosen direction.

## Architecture

### Content and i18n
- `lib/content.ts` holds every guest-facing string as `{ vi, en }` pairs plus the event facts (`EVENT`). Components never hardcode copy. Lines marked `TODO` are still placeholders; `PHOTOS_READY` switches the Places grid from placeholders to `/public/places/*.webp` (the `public/` folder does not exist yet).
- `lib/i18n.tsx` — `LangProvider` / `useLang()`; defaults to `vi`, restores the saved choice from localStorage *after* mount so server and client render match.
- `lib/event.ts` derives all date/time strings from `EVENT.startsAt` (weekday is never hardcoded), builds Google Maps URLs, and generates the `.ics` download.
- The guest name comes from `?to=Name` and is read client-side in `BoardingPass`.

### Page and the one-screen system
- `app/page.tsx` renders the sections in order. The selector `main > section` is load-bearing: `SectionPager` and `shoot.mjs` both treat each direct child section as one page.
- `.screen` (in `globals.css`, inside `@layer components`) gives a section `min-height: 100svh`, top/bottom padding that clears the fixed language toggle and dock, and `scroll-snap-align: start`. `html` has `scroll-snap-type: y mandatory`.
- CSS snap alone is not enough on desktop: Chromium snaps a small wheel delta back to the *nearest* point (the current section). `components/SectionPager.tsx` intercepts vertical wheel events on fine-pointer devices, pages one section per gesture (swallowing trackpad inertia), respects `prefers-reduced-motion`, and leaves Ctrl+wheel, horizontal scroll, touch and keyboard to the browser. Sections taller than the viewport scroll natively until their edge.
- Fitting is done with height-aware sizing: `clamp(min, min(Nvw, Nsvh), max)` for type and spacing, plus `[@media(max-height:NNNpx)]:hidden` to drop secondary copy on short screens. Below `lg`, Places becomes a horizontal snap carousel.
- `MapFrame` (in `Route.tsx`) keeps the Google Maps iframe at `pointer-events: none` until clicked; otherwise wheel/swipe over the map zooms it and the page gets stuck.

### Styling
- Tailwind v4 is configured CSS-first: tokens live in `@theme` in `app/globals.css`; there is no `tailwind.config`.
- **Gotcha:** custom classes written outside `@layer` beat Tailwind utilities. A custom class that sets `display` or padding will silently defeat `hidden`, `xl:flex`, `pt-*`, etc. Put such classes in `@layer components` (as `.screen` and `.tag` are), or leave that property to the markup (as `.side-bar` does). This caused three separate bugs.
- Sections are light or dark "bands": `.band` / `.band--light` define `--band-fg`, `--band-fg-dim`, `--band-rule`, `--band-red`, `--band-surface`, and components read them with `text-[var(--band-fg)]` so they work on either background.
- Per-section backgrounds: the section gets `.decor-host` plus a `bg-*` class, and decoration goes inside a `.decor` layer (`z-index: -1`). `components/StageDecor.tsx` provides the stage spotlights (`StageBeams`) and the glossy SVG `Ribbon`; `Ribbon` uses `useId()` because several ribbons render on one page and duplicate gradient ids would collide.
- Fonts come from `next/font`: Unbounded (`.display`, `.numeral`), Be Vietnam Pro (body), JetBrains Mono (ticket values). **Any font must ship a `vietnamese` subset** — Bebas Neue and Archivo Black look right but break diacritics. Keep `.display` line-height around 1.2 and avoid `overflow: hidden`/`truncate` on large uppercase text, or stacked marks (Ố, Ừ, Ẹ) get clipped or collide.
- Contrast: `--color-red` (#E8112D) on black is only 4.29:1 — use it for large text, blocks and graphics. Body-size red text on dark backgrounds must use `--color-red-text`.

### Hero boarding pass (`components/BoardingPass.tsx`)
- `phase` goes `idle → boarding → boarded`; the matching `is-boarding` / `is-boarded` classes on `.pass` drive every effect in CSS (scan beam, sheen, stub tear, stamp).
- "Used ticket" state: `.pass.is-boarded > :not(.stamp)` gets `grayscale(1)`, and the paper background on `.pass` itself turns gray, so the red stamp stays red on top.
- The two perforation notches are real holes cut with a CSS `mask` on `.pass`. A mask also clips `box-shadow`, so the ticket's shadow is a `drop-shadow` filter on the parent `.pass-stage`. `--stub-h` (mobile) and `--stub-w` (≥md) must match the stub's real size for the notches to line up.
- `SwipeTrack` completes on drag, click/tap, or Enter/Space — dragging is never the only path (WCAG 2.2 Dragging Movements).

### Motion
- Everything is CSS transforms plus `IntersectionObserver` (`components/Reveal.tsx`, `useRevealRef`). The only scroll listener is in `Dock.tsx`; it is rAF-throttled and writes the progress bar as a CSS variable rather than React state.
- All decorative animation is disabled in the `prefers-reduced-motion` block at the bottom of `globals.css`; add new animated classes there.
- Content hidden for reveal is un-hidden for no-JS readers by a `<noscript><style>` block in `app/layout.tsx`. Do not mutate `<html>` from an inline script before hydration — an earlier `no-js` class toggle caused a hydration mismatch.
