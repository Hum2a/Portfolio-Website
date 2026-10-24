# Animation polish plan — smoothness + functionality pass

> Hand this file to Claude Code. Work on a branch (`feat/animation-polish`), one commit per numbered item.
> Findings come from reading the source **and** driving the live site (humza-butt.space, 24 Oct 2026).

## Ground rules (read first)

1. **Do not remove any animation, component, or visual identity.** Every item below keeps the effect and fixes how it runs. That includes currently-unused ones (`Terminal`, `Typewriter`, `CodeBlock`, `ProjectLayout`): fix them, don't delete them.
2. The `*-contract` CSS files ("portable contract. Do not restyle to host tokens") keep their look. You *can* fix bugs in them: timing, geometry, specificity, and compositor-friendliness.
3. Animate only `transform`/`opacity` (and `clip-path` where it's the effect). Never animate `width`/`height`/`top`/`left` per frame unless noted.
4. Every animation must respect reduced motion through **one** shared helper (Phase 0), plus `[data-force-reduced-motion='true']`.
5. Replace chains of `setTimeout(...)` that guess when CSS finishes with `animationend`/`Animation.finished` where an item says so. Fixed timers drift when the tab is throttled or a frame drops.
6. Gate hover-only effects behind `@media (hover: hover) and (pointer: fine)` so they don't stick on touch.
7. Before and after each item, run `npm run lint`, `npm run build`, and the relevant `verify:*` script. Also check visually with Playwright at 1280×720 and 375×812.

---

## Inventory (what exists and where it's used)

| Animation | Files | Used in |
|---|---|---|
| Comic Panel Wipe (route transition) | `components/animations/comic-wipe/*`, `App.css` | Every pathname change (`App.tsx`) |
| Calling Card Peel (tile → case study) | `components/animations/calling-card-peel/*` | `ProjectTile`, `HomepageFeaturedProjects` |
| Content Declassification (censor bars) | `components/animations/content-declassification/*` | `CareerTimeline` (home + /career) |
| Paper Stack Shuffle | `components/animations/paper-stack-shuffle/*` | `GitHubRepoPaperStack` (home + /github) |
| Coming Soon Tape (marquee) | `components/animations/coming-soon-tape/*` | Locked tiles (home + /projects) |
| Textarea Paper Expansion | `components/animations/textarea-paper-expansion/*` | `/contact`, `ui/textarea.tsx` |
| Code Editor typing + tilt | `components/animations/CodeEditor.*` | Homepage hero |
| Hover Cutout buttons | `components/ui/HoverCutout.css`, `CutoutAction.tsx` | Hero CTAs, header CTA, LinkedIn button |
| Project tile hover "attack" | `pages/Projects.css` (`pt-ccs-*`) | /projects tiles |
| Section backdrop parallax | `components/media/SectionBackdrop.*` | Home sections |
| Monogram hover | `components/brand/Monogram.*` | Header logo |
| Framer Motion entrances / header hide / nav `layoutId` | `SiteHeader`, `Projects`, `ProjectTile`, `About`, `GitHub`, `LinkedIn`, `CareerSection`, `GitHubSection`, `HomepageFeaturedProjects` | Site-wide |
| Terminal / Typewriter / CodeBlock | `components/animations/*` | **Unused** (only `ProjectLayout`, which nothing imports). Keep and fix. |

---

## Phase 0 — Shared motion foundation (do first)

**0.1 Single reduced-motion source.** `prefersReducedMotion()` / `usePrefersReducedMotion()` is copy-pasted in at least 6 places (comicWipe, peelCallingCard, revealCensor, paperStackShuffle, CodeEditor, SiteHeader, SectionBackdrop). Create `src/lib/motion.ts` exporting:
- `prefersReducedMotion(): boolean`, which checks the media query plus `data-force-reduced-motion`.
- `useReducedMotion()`, a hook that listens for changes to both the media query and the attribute (MutationObserver on `<html>`).
- `waitForAnimations(el: Element, subtree = true): Promise<void>`, which resolves when `el.getAnimations({subtree})` have all finished, with a safety timeout.
- `nextPaint(): Promise<void>`, a double rAF.
- Easing/duration tokens shared by JS and CSS (`--ease-out-expo` already exists in `globals.css`; mirror it).

Replace every duplicate with imports. The behaviour must not change.

**0.2 Framer Motion config.** Wrap the app in `<MotionConfig reducedMotion="user">`. Consider `LazyMotion` + `domAnimation` with `m.*` components to shrink the `framer-motion` chunk, but only if nothing uses layout or drag features that need `domMax`. (`SiteHeader` uses `layoutId`, so check before switching.)

**0.3 Hover gating utility.** Add a convention (comment in `globals.css`) that hover-only motion lives inside `@media (hover: hover) and (pointer: fine)`.

---

## Phase 1 — P0 functional bugs (user-visible breakage)

### 1. Comic Wipe: plays off-screen, swaps the page before it's covered, no scroll reset
Observed live:
- **Positioned against the page, not the viewport.** `App.css` overrides `.app-main .comic-wipe { position: absolute; inset: 0 }`, so computed `position` is `absolute` inside `.app-main`, which is about 4,600px tall on the homepage. The panels are sized in `vw`/`vh` from the **top of the page**. If you navigate while scrolled (footer links, project tiles, "Browse all projects"), the wipe plays above the fold and you see nothing for about 1s, then a hard cut.
- **Route swaps too early.** `COVERED_MS = 450`, but panel 3 lands at 470ms, panel 4 at 515ms and panel 5 at 560ms (the file's own comment says so). The bottom-right of the viewport is still uncovered when `blocker.proceed()` runs, so the content swap is visible.
- **No scroll restoration anywhere.** After navigation the new page keeps the old `scrollY`. Verified: clicking a homepage tile at `scrollY=2700` lands mid-way down `/bgr8`. This affects the peel path too, which bypasses the wipe.
- **Lazy chunk race.** Routes are `lazy()`. If the chunk isn't loaded when `proceed()` fires, the panels tear away on a stale page or the Suspense skeleton, and then the page pops in.

Fix:
- Make the overlay viewport-fixed: `position: fixed; inset: 0` (keep the header visible by starting it at the header's bottom if that was the intent, e.g. `inset: var(--header-h, 0) 0 0 0`). Delete or replace the `App.css` override. Mount `<ComicWipeOverlay/>` outside `.app-main` (sibling of header) so `overflow:hidden` can't clip it.
- Drive phases from real animation completion: covered = panel 5's `animationend` (or `waitForAnimations(root)`), not a 450ms guess.
- While covered: (a) start loading the target route's chunk at click time (reuse `utils/prefetchRoute.ts`; add a path → importer map) and `await Promise.race([chunk, timeout(900)])`; (b) `proceed()`; (c) `window.scrollTo({top:0, behavior:'instant'})` for PUSH/REPLACE, and restore the saved position for POP (back/forward), with a `Map<location.key, scrollY>`; (d) `await nextPaint()`; then add `--exit`.
- Move focus to the new page's `<h1>` (or `#main-content` with `tabIndex=-1`) after exit, for keyboard and screen-reader users.
- Keep `busy` + blocker reset logic. Add an `AbortController`-style cancel if the provider unmounts mid-wipe.
- Add a global scroll reset for navigations that **don't** use the wipe (peel links, `NavigateWithoutWipe`, login): either React Router `<ScrollRestoration/>` (you're on `createBrowserRouter`, so it's available; render it in `App`) coordinated with the wipe, or the same scroll helper called from `CallingCardPeelLink`.
- Reduced motion: keep the 40ms flash, but still scroll and focus correctly.
- Accept: from any scroll position, the wipe is fully visible, the old page is never seen changing, the new page starts at the top (back restores position), and no skeleton flashes after panels exit on a warm cache.

### 2. Calling Card Peel: snapping clip-path, unreadable label, abrupt hand-off
Observed live: every non-locked project tile shows the cream "NOTICE // ARCHIVE" sheet at rest (intended).
- **Clip-path snaps.** `.ccp__surface` changes polygon vertex count between phases (rest 6 → lift 6 → tension 6 → **peel 5 → release 4**). CSS can't interpolate polygons with different point counts, so it jumps at 340ms and 800ms. Rewrite every phase polygon with the **same 6 points**, collapsing extra points onto neighbours where the shape needs fewer.
- **Label contrast.** `.ccp__message` computes to `rgb(180,188,207)` on `#f2eee3` (a global `p`/heading colour leaks in), so the project name is barely readable. Pin the colours inside the contract with higher specificity (`.ccp .ccp__surface .ccp__message { color: var(--ccp-ink) }`, and the same for eyebrow, secondary and microtype). Check WCAG with `npm run verify:contrast`.
- **3D is flattened.** `perspective` is on `.ccp`, but `.ccp__obstruction` has its own `transform: rotate(-3deg)` with no `transform-style: preserve-3d`, so `rotateY` on `.ccp__paper` does nothing. Add `preserve-3d` on the obstruction (or move `perspective` onto it).
- **Phase timers → animation events.** Replace the 4 `setTimeout`s with chained phases triggered by `transitionend` on `.ccp__paper` (filter by `propertyName === 'transform'`), plus a timeout fallback. Make `busy` per-instance (a WeakSet of roots) rather than module-global.
- **Hand-off.** After 1,040ms the route swaps with a hard cut and no scroll reset. Prefetch the route chunk on `pointerenter`/`focus`/`pointerdown`. Start navigation as soon as `release` begins (~800ms), and give the incoming page a short fade-in (e.g. 180ms opacity on `#main-content` via a `data-enter` attribute) so it doesn't cut. Scroll to top as in item 1.
- **Affordance (additive):** on `hover: hover` devices, show a small corner pre-lift on hover/focus-visible (the `lift` pose at ~40%) so people know the card peels. Also a pressed state on `pointerdown`.
- The obstruction overhangs (`left:-6%; width:112%`). Keep the look, but make sure the tile's `overflow:hidden` + `border-radius` don't clip the release path oddly on the large hero tile (574×714). Test both tile sizes.
- Accept: no visible jump at any phase in a 60fps Playwright screen recording; the label is legible; the destination page starts at the top.

### 3. Content Declassification: bars don't cover the text
Observed live (`/career`, homepage Career): bars are fixed-width per variant (`min(100%, 8.4rem)`, `4.6rem`, `6.2rem`…), so most redacted text is visible before the reveal:
- "Full Stack Software Engineer": bar 134px over 218px of text
- Highlights: bar **74px** over 379–520px of text
- Multi-line prose (value height 40–44px) only has its **first line** covered

Fix:
- Size bars from the text itself. In `CensoredText`, use a `useLayoutEffect` + `ResizeObserver` to read `valueRef.current.getClientRects()` (one rect per line box) and render one bar per line, absolutely positioned relative to the censor wrapper. Keep the 5 variant clip-paths and rotations, applied per line (cycle variant by line index for variety).
- Keep `.cdc__censor` inline (not `inline-block`) so wrapping behaves like normal text.
- Split / strike / peel behaviours apply to every line bar, with a tiny per-line stagger (20–30ms).
- Slash: animate `transform: scaleX()` from `transform-origin: left` instead of `width`.
- Cap cumulative stagger: `delayMs = Math.min(slot * STAGGER_MS, 520)`.
- Keep the value in the DOM for screen readers (it already is). Make sure bars are `aria-hidden`.
- Re-measure on font load (`document.fonts.ready`) and resize.
- Accept: before reveal, zero glyph pixels visible for every censored string at 375, 768 and 1280 widths.

### 4. Paper Stack Shuffle: wrong card during "Previous", jerky motion, content overflow
Observed live on `/github`: pressing **PREVIOUS**, the rising card shows `Monzo-1p-Challenge-Calculator` for the whole flight and then **pops to `Brim`** when it lands. Content is assigned by depth (`cursor + depth`) and only updates after `setCursor`.

Fix:
- **Content by sheet, not depth.** Keep `sheetRepo: Record<SheetId, repoIndex>` in state. Before a `prev` animation, set the back sheet's repo to `cursor-1` and commit that render (`flushSync` or await a paint) **before** animating. After a `next` animation lands the old front at the back, set that sheet to `cursor+4`. No sheet's content changes while it's visible.
- **Remove the stop-start.** `runNext`/`runPrev` chain 2–3 separate WAAPI animations, each with `cubic-bezier(0.7,0,0.3,1)` (ease-in-out), so velocity hits zero between segments. Merge each sheet's path into **one** `el.animate()` with offset keyframes and per-keyframe `easing`. Put `zIndex` in the keyframes too (WAAPI animates it discretely), so the "goes behind" swap happens at an exact offset instead of between awaits.
- **Interruptible input.** Instead of disabling buttons while busy, queue at most one pending direction. If a click arrives mid-flight, call `.finish()` on running animations, settle, then run the queued one. Add ← / → keys when the stack has focus, and horizontal swipe via pointer events (threshold ~40px) on touch.
- **Height.** `--stack-h: 220px` is fixed, and GitHub cards are taller: the stats row renders below the sheet and collides with the PREVIOUS/NEXT buttons. Size to content. Either stack sheets in one CSS grid cell (`display:grid; > * {grid-area:1/1}`) so the container takes the tallest face, or measure faces with `ResizeObserver` and set `--stack-h`.
- Check the large empty gap under the stack in `GitHubSection` / `GitHubPage.css` (there's about 200px of dead space before "View all repositories").
- `getSheetList()` filters nulls and then indexes by sheet id, which shifts indices if any ref is null. Index the raw array.
- Make registration callbacks in `GitHubRepoPaperStack` stable (`useCallback`) so ref callbacks don't re-fire every render.
- Accept: no content change on any visible sheet, a continuous motion curve (no mid-flight stall) on a frame-by-frame capture, and rapid double-clicks advance twice smoothly.

---

## Phase 2 — Smoothness / performance

### 5. Code Editor (hero)
- Typing calls `setTypedLen` every rAF for 1.2s, and each call re-tokenises **every line**. Tokenise each file once (`useMemo` per file → `lines: Token[][]` with cumulative char offsets) and only slice at render time. Or advance `typedLen` at most every 2 frames.
- Tilt lerp `0.32` per frame is frame-rate dependent (twice as fast on 120Hz). Use time-based damping: `k = 1 - Math.exp(-dt / 70)`.
- `getBoundingClientRect()` on every pointermove: cache the rect on `pointerenter` + `resize`/`scroll`.
- Disable tilt on `(hover: none)`.
- The IntersectionObserver only ever sets `inView = true`. Make it toggle, and pause auto-cycle + the cursor blink (`animation-play-state: paused` via a class) when out of view or `document.hidden`.
- Tab switch: crossfade the body (opacity 120ms) instead of an instant swap. The tablist should support ←/→ (roving tabindex) per the ARIA tabs pattern.
- Accept: no long tasks over 16ms during typing on 4× CPU throttle (`npm run verify:throttle`).

### 6. Coming Soon Tape
- The marquee runs `infinite` even off-screen, and `filter: drop-shadow` on the rotated tape forces repaint. Move the shadow to a static pseudo-element behind the band (or a `box-shadow` on a non-animated wrapper), and keep `transform` on the track only (`translate3d`).
- Pause off-screen: a shared IntersectionObserver toggles `.is-offscreen { animation-play-state: paused }`.
- Accept: 0 running animations for tapes outside the viewport (`document.getAnimations()`).

### 7. Textarea Paper Expansion (/contact)
- It animates `height` (layout every frame). It's acceptable for one field, but: add `will-change: height` only during focus, and consider `field-sizing: content` (with `min-height: var(--tpe-h)` / `max-height: 24rem`) as a progressive enhancement so long messages grow instead of scrolling inside 12.5rem.
- Make sure the open state persists when the field has text (`:has(:not(:placeholder-shown))` already does this), and that validation-error styling doesn't jump the height.

### 8. Hover Cutout buttons
- `.hco__red` and `.hco__mass` are sized larger than the button (`inset:-18% …`, `width:135%`), but the parent's `clip-path` clips them, so most of the red misregistration and mass never shows. Move the clip-path from `.hco__item` onto a background pseudo-element (or wrap the label + cut in a clipped inner span), so overflow layers can escape as designed. Verify the look still matches.
- On un-hover, `transform-origin` flips from `20% 50%` to `85% 45%` instantly, so the exit scale jumps. Either keep one origin or add the origin to the exit keyframe.
- `.hco__mass` has both `animation` and `transition` on `transform`. Pick one (keyframe enter, transition exit) and make sure the exit starts from the animated end value.
- Gate under `(hover: hover)`, and keep `:focus-visible` always.

### 9. Project tile hover "attack" (Projects.css)
- `transition` and `animation` both target `transform` on backing/misreg/shards. Same cleanup as item 8.
- Gate under `(hover: hover)`, because on phones the hover state sticks after a tap.

### 10. Framer Motion usage
- **Projects grid remounts on every filter change.** `key={sortMode|query|categories|tags}` on `.projects-grid-modern` throws away all 32 tiles (peel instances, images, entrance animations) on each keystroke or filter. Use a stable key. Wrap tiles in `<AnimatePresence mode="popLayout">` and give `ProjectTile`'s root `layout` + exit `{opacity:0, scale:0.98}`. Debounce search (~120ms).
- `ProjectTile` entrance animates on mount for all 32 tiles (delay up to 0.4s), even off-screen. Switch to `whileInView` + `viewport={{ once: true, margin: '-10% 0px' }}`.
- `HomepageFeaturedProjects`: fine, but make the cards' `y` entrance not conflict with the tile hover transform (they're different elements; double-check).
- `SiteHeader` hide-on-scroll: only call `setHidden` when the value changes. Keep it.
- `LinkedIn.tsx` `whileHover={{ y: -4 }}`: gate on hover devices (Framer's `whileHover` already ignores touch; just verify).

### 11. Section Backdrop parallax
- It writes `style.transform` on every pointermove and calls `getBoundingClientRect` each time. Throttle to one rAF, cache the rect, skip `pointerType === 'touch'`, and lerp toward the target like the editor tilt (time-based).

### 12. Terminal / Typewriter (unused, but fix)
- `Terminal` renders the just-finished line with a **new** `<Typewriter>` (`index === currentLineIndex - 1`), so every line types twice while the next line starts. Render completed lines as static text, and only the current line as `Typewriter`.
- `Typewriter` re-renders per character via `setTimeout`. Use one rAF loop with elapsed time, and `aria-label` the full text with `aria-hidden` on the animated span.
- `onComplete` in effect deps causes restarts if the parent passes an inline function. Store it in a ref.

---

## Phase 3 — humza.website ("struggling")

`humza.website` failed to load at all in a fresh browser (navigation error), while `humza-butt.space` loads fine. It isn't in `worker/index.ts` `REDIRECT_HOSTS` and appears nowhere in config except `projects.json`, so it isn't served by this Worker. Likely causes: DNS still points at an old host (Render/Firebase), or there's no cert on the custom domain.
- Code change (Claude Code): add `humza.website` and `www.humza.website` to `REDIRECT_HOSTS` so the Worker 301s them to the canonical domain. Update `.cursor/DOMAIN-REDIRECTS-2026.md`.
- Dashboard step (Humza, manual): add both as Custom Domains on the `humza-butt-portfolio` Worker in Cloudflare. Then `curl -sI https://humza.website` should show `301` → `https://humza-butt.space/`.

---

## Phase 4 — Verification harness

Add `scripts/verify/animations.mjs` (Playwright, Chromium, headed or `--headless=new`) and `npm run verify:anim`:
1. **Wipe coverage:** expose `window.__motionDebug` in dev and preview builds only (events: `wipe:covered`, `wipe:exit`). At `wipe:covered`, assert every panel animation has `playState === 'finished'` and take a screenshot. Assert no pixel from the old page is visible (sample 9 points against the panel colours).
2. **Scroll reset:** scroll to 2,700px, click a nav link, a peel tile and a footer link; assert `scrollY === 0` after each. Go back; assert the position is restored.
3. **Censor coverage:** before the reveal, for each `.cdc__value` rect, assert it's fully contained in the union of bar rects.
4. **Paper stack:** click PREV/NEXT 6× quickly; record `h3` text of the depth-0 sheet every frame; assert it only changes once per shuffle, at landing.
5. **Peel:** record a 60fps CDP screencast of a peel; assert no frame-to-frame jump of the surface bounding box above a threshold.
6. **Jank budget:** use the CDP `Performance` + `longtask` observer during each animation with 4× CPU throttle; fail on any long task over 50ms.
7. **Reduced motion:** run 1–5 with `reducedMotion: 'reduce'`; everything must still navigate, reveal and shuffle correctly with no motion.
8. **Off-screen idle:** at page bottom, `document.getAnimations().filter(a => a.playState === 'running')` should contain nothing infinite that's off-screen.

Also run the existing `verify:lh`, `verify:axe`, `verify:contrast`, `verify:prefs` and `verify:throttle` before merging.

> Note: frame timings measured during this inspection came from a background browser pane and aren't reliable. Re-measure on a real foreground window or headed Playwright.

---

## Suggested commit order
1. Phase 0 (motion lib, MotionConfig)
2. Item 1 (wipe + scroll restoration + route prefetch map)
3. Item 2 (peel)
4. Item 3 (censor bars)
5. Item 4 (paper stack)
6. Items 5–12 (one commit each)
7. Phase 3 redirect code
8. Phase 4 harness, run everything, fix regressions
