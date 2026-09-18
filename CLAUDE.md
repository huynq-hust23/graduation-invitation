# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

A single-page, bilingual (VI/EN) graduation invitation built as a "boarding pass": the guest swipes to board (scrolling is locked until then), then pages through six sections ending in a guestbook. Next.js 15 App Router, React 19, Tailwind CSS v4, TypeScript. No backend, no animation library.

## Commands

Node is installed through **fnm** and is *not* on PATH in non-interactive shells. Prefix commands with:

```powershell
$env:PATH = "$env:APPDATA\fnm\node-versions\v22.18.0\installation;$env:PATH"
```

- `npm run dev` — dev server on http://localhost:3000
- `npm run build` — production build; this is the only type-check gate (no test suite, and ESLint is not installed, so `npm run lint` is not usable)
- **Never run `npm run build` while `npm run dev` is running.** They share `.next/` and the dev server breaks with `Cannot find module './NNN.js'`. Stop dev, build, delete `.next/`, then restart dev.
- **The same applies to `npm install`/`npm uninstall`.** Changing `node_modules` while dev is running can corrupt its module cache and produce a client-side exception on every page (`Cannot read properties of undefined...`) that has nothing to do with the actual code change. If a page suddenly white-screens right after a dependency change, stop dev, delete `.next/`, and restart before debugging the "error" further.

### Visual verification (Playwright)

`scripts/shoot.mjs` drives the running dev server with Playwright (Chromium is already installed).

```powershell
node scripts/shoot.mjs <outDir> <prefix>                 # screenshots
$env:SHOOT_MODE="measure"; node scripts/shoot.mjs x m    # measurements only
$env:SHOOT_SIZES="390x844,375x667,1280x720,1920x1080"    # viewports (width x height)
```

For each viewport it prints the height of every `main > section` (`s1:778(+58)` means 58px taller than the screen), flags horizontal overflow, and checks a `lock` (before boarding, wheel + PageDown must NOT move the page at all), a `boarded-sN` height recheck (the hero after boarding — boarding adds content, e.g. the "scroll on" hint), and that one mouse-wheel notch and one PageDown each land exactly on the next section (`snap OK` / `SAI`) — this second check only runs *after* boarding, since scrolling is locked before that. Full mode also saves the hero, each section (fixed UI hidden), and the post-swipe "boarded" state. Write screenshots to the session scratchpad, not the repo (`shots/` is gitignored).

**Playwright element screenshots of a section taller than the viewport can be misleading.** Fixed elements (Dock, LangToggle) get composited at whatever position they happened to occupy during the stitched capture, which can look like an overlap with content that never actually happens live. If a full-section screenshot shows a fixed bar overlapping something, verify with `scrollIntoViewIfNeeded()` + a normal (non-element) `page.screenshot()` before treating it as a real bug.

## Working rules

- **Look before claiming a UI change is done.** Run `shoot.mjs`, read the images, iterate. Three earlier design rounds were rejected because they were built from code alone; screenshots exposed clipped Vietnamese diacritics, muddy blur "glows", and a map iframe that trapped scrolling — none of which were visible in the source.
- **Every section must fit exactly one viewport, and one scroll gesture moves one section.** After any layout change, re-run measure mode at small phone (375x667), phone (390x844), tablet (768x1024) and short laptop (1280x720, 1024x768) sizes and keep every section at `+0` with `snap OK`. The Guestbook section (see below) currently has a known, minor `+15px` at exactly 1024x768 — everything else is `+0`.
- **Design direction comes from `references/f71f8a04dcf3866f413317b97d118100.jpg`** (the ZARYA event deck): black/red, wide geometric uppercase type, cinematic red stage lighting, glossy red ribbon shapes, solid red label blocks, headlines split into a red line and an indented white line. Tone is restrained — red should be rare enough to matter. `lxd.md` is a teardown of *someone else's* invitation site: use it for feature ideas only, never for colors or typography (copying it was the first rejected design). `references/image.png` is a different template and is not the chosen direction.
- **Never fabricate content that looks like it came from a real person.** The guestbook wall (below) intentionally shows generic, clearly-labeled sample messages instead of invented names/photos/testimonials, because this is a real invitation real guests will open — anything that reads as a genuine message from a specific person must actually be one.

## Architecture

### Content and i18n
- `lib/content.ts` holds every guest-facing string as `{ vi, en }` pairs plus the event facts (`EVENT`). Components never hardcode copy. Lines marked `TODO` are still placeholders; `PHOTOS_READY` switches the Places grid from placeholders to `/public/places/*.webp` (the `public/` folder does not exist yet).
- **Personal fields (`EVENT.graduateName`, `EVENT.contact.phone/email`) are read from env**, not hardcoded, so they never sit in git history (this repo's history was rewritten once already to scrub real values that had leaked in — see git log). Real values go in `.env.local` (gitignored); `.env.example` documents the variable names. Missing values fall back to bracket placeholders (`[YOUR_NAME]`, etc.).
  - **Gotcha:** Next.js only inlines `process.env.NEXT_PUBLIC_*` into the client bundle when it's a *static* member access written exactly like that. A dynamic lookup (`process.env[key]`, even inside a small helper function) is invisible to the bundler's replacement pass and always reads as `undefined` in the browser, even though it works fine server-side. Each personal field is therefore its own `const X = process.env.NEXT_PUBLIC_X?.trim() || fallback` — do not "simplify" this into a generic `env(key, fallback)` helper.
- `lib/i18n.tsx` — `LangProvider` / `useLang()`; defaults to `vi`, restores the saved choice from localStorage *after* mount so server and client render match.
- `lib/event.ts` derives all date/time strings from `EVENT.startsAt` (weekday is never hardcoded), builds Google Maps URLs, formats the venue's GPS coordinates as DMS (`venueWaypoint`), and generates the `.ics` download.
- The guest name comes from `?to=Name` and is read client-side in `BoardingPass`.

### Page and the one-screen system
- `app/page.tsx` renders the sections in order (…, Journey, **Guestbook**, Thanks). The selector `main > section` is load-bearing: `SectionPager` and `shoot.mjs` both treat each direct child section as one page.
- `.screen` (in `globals.css`, inside `@layer components`) gives a section `min-height: 100svh`, top/bottom padding that clears the fixed language toggle and dock, and `scroll-snap-align: start`. `html` has `scroll-snap-type: y mandatory`. The native scrollbar is hidden site-wide (`scrollbar-width: none` / `::-webkit-scrollbar{display:none}`) — the red bar in `Dock.tsx` is the only scroll-progress indicator, so it doesn't look broken when the OS scrollbar would otherwise pop in only after boarding.
- CSS snap alone is not enough on desktop: Chromium snaps a small wheel delta back to the *nearest* point (the current section). `components/SectionPager.tsx` intercepts vertical wheel events on fine-pointer devices, pages one section per gesture (swallowing trackpad inertia), respects `prefers-reduced-motion`, and leaves Ctrl+wheel, horizontal scroll, touch and keyboard to the browser. Sections taller than the viewport scroll natively until their edge (Guestbook uses this — see below).
- Fitting is done with height-aware sizing: `clamp(min, min(Nvw, Nsvh), max)` for type and spacing, plus `[@media(max-height:NNNpx)]:hidden` to drop secondary copy on short screens. Below `lg`, Places becomes a horizontal snap carousel.
- **Gotcha — nested responsive grids sharing a breakpoint pinch the middle.** Guestbook nests two 2-column grids: the section itself (form | wall) and the form's own internal grid (message | photo). Both used to switch to 2 columns at the same `lg` (1024px) breakpoint, so right around 1024px width each column only got ~1/4 of the page width — too narrow either stacked or split, and taller than the one-screen budget at "wide but short" sizes like 1024×768. Fix: stagger the breakpoints so nested grids change together (both use `xl`, not one `lg` and one `xl`) rather than fighting over the same one.
- `MapFrame` (in `Route.tsx`) keeps the Google Maps iframe at `pointer-events: none` until clicked; otherwise wheel/swipe over the map zooms it and the page gets stuck.

### Scroll lock until boarded (`components/BoardingPass.tsx`, `SectionPager.tsx`)
- The guest cannot preview the sections below the hero until they complete the swipe. On mount, `BoardingPass` sets `data-board-lock="true"` on `<html>` (and forces `scrollTo(0)`, plus `history.scrollRestoration = "manual"` so a refresh can't land mid-page while locked); a CSS rule (`html[data-board-lock="true"], html[data-board-lock="true"] body { overflow: hidden }`) makes the page unscrollable by wheel, touch, keyboard *and* scrollbar-drag alike. The attribute is removed once `phase` reaches `"boarded"`.
- `SectionPager`'s wheel handler also checks the same attribute and bails out immediately while locked, so it doesn't accumulate wheel deltas meant for the swipe gesture.
- `shoot.mjs`'s `lock` check exercises exactly this: it scrolls/PageDowns before clicking the swipe control and asserts `scrollY` never leaves `0`.

### Sound (`lib/sfx.ts`)
- All sound effects are synthesized at runtime with the Web Audio API — no audio files, so no licensing question and no extra network request. `playTick`, `playStamp`, `playChime`, `playWhoosh` are just oscillators/noise-buffers with short gain envelopes. The `AudioContext` is created lazily on first call, inside a real user-gesture handler, to satisfy browser autoplay policy.
- Wired in: swipe-to-board (`playStamp`, deliberately delayed to land when the CSS `stamp-in` keyframe actually fires — 900ms phase transition + 160ms `animation-delay`, not the instant the gesture completes), language toggle and map-activate (`playTick`), calendar save (`playChime`), directions link (`playTick`), and desktop section-to-section wheel paging (`playWhoosh`, skipped under `prefers-reduced-motion`).
- There is no mute toggle — a version with one was tried and removed; the sounds are quiet and short enough that the user didn't want the extra UI.
- Before adding a new sound, check whether the visual effect it's meant to accompany has its own CSS transition/animation delay — sync to that delay, not to the moment the state changes in React.

### Guestbook (`components/Guestbook.tsx`, last section, id `luu-but`)
- A `<form>` (`GuestbookForm.tsx`: name, message, an optional photo capped client-side at 8MB, a Cloudflare Turnstile widget, submit) next to a "wall" of messages (`GuestbookWall.tsx`) — form on the left, wall on the right from `xl` up; wall hidden below `xl` (mobile/tablet just get the form) because fitting both in one screen at narrower widths didn't work out.
- **There is no backend yet.** Submitting just flips local state to "sent" — nothing is persisted or sent anywhere. This was a deliberate, discussed decision: adding real storage needs an external service (Google Apps Script, a Cloudflare Worker, etc.) that only the site owner can set up, so it's parked until that's chosen.
- **The wall is placeholder data, on purpose.** `GUESTBOOK.wall` in `content.ts` is a handful of generic, upbeat sample lines; every card is signed with `GUESTBOOK.wallSampleLabel` ("Lời nhắn mẫu" / "Sample message") instead of a name, and there's no avatar/photo. Do not fill this with invented names or stock photos of "guests" — replace it with real submissions once the form has somewhere to write to, and drop `wallCaption` ("preview" notice) at that point.
- `TurnstileWidget.tsx` loads `https://challenges.cloudflare.com/turnstile/v0/api.js` itself and renders via the imperative `turnstile.render()` API rather than the data-attribute auto-render, so it can hand the token back through a plain callback prop. Without `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set, it renders a dashed placeholder notice instead of failing silently.
- `GuestbookWall.tsx` is a staggered, click-to-cycle card carousel (adapted from a pasted shadcn/21st.dev component template) — plain CSS `transform`/`clip-path`, no animation library. The notched card corners deliberately echo the boarding-pass ticket-stub cut. `ChevronLeftIcon`/`ChevronRightIcon` were added to `Icons.tsx` for its prev/next buttons rather than pulling in `lucide-react`, to keep the existing "inline SVG only" rule.
- Linked from `Thanks.tsx` via a plain in-page anchor (`href="#luu-but"`), not a route — an earlier version of this feature was built as a separate `/luu-but` page and was deliberately reverted back into the single-page scroll flow.

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
- **No animation library, still true after one detour.** `motion` (Framer Motion) was installed for an earlier version of the guestbook wall and then fully uninstalled once that design was replaced with a CSS-transform-only carousel — don't be surprised if you see it mentioned in old conversation history; it is not a dependency.
