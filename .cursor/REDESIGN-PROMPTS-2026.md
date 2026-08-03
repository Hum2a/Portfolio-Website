# Portfolio Redesign — Decisions & Cursor Prompt Pack

Companion to **`REDESIGN-AUDIT-2026.md`** (findings). This document holds the resolved decisions, the specs Cursor needs, and the sequenced prompts.

**Run the prompts in order.** Each is self-contained and assumes the previous ones have landed. Commit after each. Do not skip Phase 0 — everything downstream assumes the Vite/TS/Tailwind foundation.

---

## Part 1 — Decisions

### 1.1 Stack

| Choice | Verdict | Why |
|---|---|---|
| **Vite** (replacing CRA) | Yes | `react-scripts` is effectively unmaintained. Vite gives real code splitting by default, and it's already on your CV via LifeSmart and imposter-game. |
| **TypeScript** | Yes — do it during the migration | Your CV leads with TypeScript. A 100% JavaScript portfolio from a TypeScript-first engineer is a small but real credibility gap, and the first thing a reviewer notices in the repo. The Vite migration renames ~90 files to `.jsx` anyway — renaming to `.tsx` in the same pass costs marginally more and saves doing it twice. Use `allowJs: true` and `strict: false` initially so it's incremental, not a rewrite. |
| **Tailwind CSS** | Yes | You have **10,110 lines of CSS across 29 files** with an already-good token layer. Tailwind maps your CSS variables to utilities cleanly and kills the duplication. Also on your CV. |
| **shadcn/ui** | Yes — **with one hard rule** | Genuinely useful here: `Dialog` (screenshot lightbox), `Tabs` (editor tabs, project filters), `Sheet` (mobile nav), `Tooltip`, `Badge`, `Accordion`, `Command` (project search). |
| **Hono** on the Worker | Yes | `worker/index.js` currently hand-rolls routing for `/api/*`. Hono is purpose-built for Workers, ~12 KB, and cleans that up. Also on your CV via imposter-game. |
| Firebase / Firestore | **Keep** | Out of scope. It works, and migrating your analytics data layer buys nothing for this redesign. |

> **The shadcn rule — this matters more than it sounds.**
> shadcn's default theme is a light neutral SaaS-dashboard look, and it is *everywhere* right now. If you ship shadcn defaults you will land in exactly the "looks like a template" trap this redesign exists to escape — and it will look dated faster than what you have now, because it will look dated *specifically as a 2025 shadcn site*.
> **Re-theme `globals.css` to your navy + glass tokens before building a single component**, and treat every `components/ui/*` file as a starting point to edit, not a finished component. That's the whole point of shadcn being copy-in rather than a dependency.

### 1.2 Monogram — final spec

Three options were drawn; **use the Stacked H**. It's the only one that stays legible at 16px favicon size (the Split H's two small bars merge, and the Reaching H is unbalanced as a square app icon), and the double crossbar reads simultaneously as an **H**, an **`=`** and as **two stacked layers** — front end and back end. That's a full-stack mark without a single angle bracket.

**Geometry** — 32×32 viewBox, four rounded rects, no paths, no gradients:

```svg
<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Humza Butt">
  <rect class="hb-stem hb-stem-l" x="6"  y="4.667" width="4" height="22.667" rx="1.333" fill="currentColor"/>
  <rect class="hb-stem hb-stem-r" x="22" y="4.667" width="4" height="22.667" rx="1.333" fill="currentColor"/>
  <rect class="hb-bar hb-bar-t"   x="10" y="11.333" width="12" height="3.667" rx="1"     fill="currentColor"/>
  <rect class="hb-bar hb-bar-b"   x="10" y="17"     width="12" height="3.667" rx="1"     fill="currentColor"/>
</svg>
```

Proportions (fractions of the 32-unit box, so it scales to any size):
- Stems: width `0.125`, height `0.708`, inset `0.1875` from each side
- Bars: width `0.375`, height `0.115`, gap between them `0.062`
- Optical centre sits at `y = 0.5` — the bars are deliberately *above* geometric centre so it doesn't read bottom-heavy

**Colour:** `currentColor` throughout. In the header it inherits `--text-primary`; the top bar takes `--accent` (`#4a9eff`) so there's one point of colour. Never fill both bars in accent — it reads as a logo trying too hard.

**Hover animation** (`SiteHeader` only, ~240ms `cubic-bezier(0.16, 1, 0.3, 1)`):
- Top bar translates `+2` on X, bottom bar translates `-2` on X, then both return
- Reads as a shuffle/swap — code motion, not a spin
- Wrap in `@media (prefers-reduced-motion: no-preference)`

**Derived assets:** favicon (16/32/48 ICO + SVG), `apple-touch-icon` 180×180 (mark at 60% scale, centred on `#0a0e27`, `rx="40"`), maskable PWA icon 512×512 (mark at 50% scale for safe zone), OG watermark. **Delete the current `<HB />` span-based logo entirely.**

### 1.3 Case studies — all 29, made tractable

You chose full treatment on all 29. Straight answer: that is **the largest single effort in this project** — 29 pieces of real writing, and no amount of templating removes that. But the structure below makes it a fill-in-the-blanks job rather than 29 blank pages, and it means the *design* work is done once.

The approach:
1. **One `ProjectCaseStudy` template**, driven entirely by data. The 36 bespoke files in `src/projects/` collapse into it.
2. **Extend `config/projects.json`** with a `caseStudy` block per project (schema in Prompt 8).
3. **Cursor drafts the first pass** for each project from the existing component prose, `README.md`, `CHANGELOG.md` and the screenshot filenames — which are unusually descriptive (`Bgr8/Matching Algorithm.png`, `Bgr8/Live Messaging between mentor and mentee.png`). That's most of the structure already.
4. **You edit for accuracy**, and add the metrics only you know. Budget ~20 minutes per project.
5. **Ship in tiers.** Every project gets the full template; the five flagships (Bgr8, TheraBot, LifeSmart, Breathapplyser, Encore) get hand-written depth first so the site is never in a half-finished state.

**Non-negotiable:** every case study needs at least one real screenshot and one specific claim. A template filled with generic prose across 29 pages is worse than 5 good pages — it makes the thinness systematic and obvious.

---

## Part 2 — Cursor prompts

### Prompt 0 — Ground rules (paste once at the start of the session)

```
You are working on my React portfolio at humza-butt.space. Read
.cursor/REDESIGN-AUDIT-2026.md and .cursor/REDESIGN-PROMPTS-2026.md in full
before making any change. They contain the audit findings and the agreed plan.

Rules for this entire redesign:
- Work in phases. Do not start a later phase before I confirm the current one.
- Never bulk-rewrite a file you have not read. Read, then edit.
- Preserve all existing functionality: Firebase auth, the Traffic analytics
  dashboard, the tracking-token service, the Cloudflare Worker email notify API,
  and every existing route path. Route URLs must not change — they are indexed.
- No new runtime dependency without telling me what it is and what it costs in KB.
- Every animation must be wrapped in prefers-reduced-motion handling.
- Every colour must come from a token. No hardcoded hex in components.
- After each phase, run `npm run build` and report the bundle sizes.

Current baseline to beat: 1.61 MB single JS chunk, 145 KB CSS, 47 MB images,
3-5s blank screen on every route.
```

---

### Prompt 1 — Vite + TypeScript migration

```
Phase 0. Migrate this Create React App project to Vite with TypeScript.
Keep React Router, keep Firebase, keep the Cloudflare Worker deploy.

1. Install vite, @vitejs/plugin-react, typescript, @types/react, @types/react-dom,
   @types/node. Remove react-scripts.
2. Move public/index.html to the project root. Replace %PUBLIC_URL% with absolute
   paths and add <script type="module" src="/src/index.tsx"></script> before </body>.
3. Create vite.config.ts:
   - plugins: [react()]
   - build.outDir: 'build'   (keep this - wrangler.jsonc points at it)
   - resolve.alias: '@' -> './src'
   - build.rollupOptions.output.manualChunks: split 'firebase', 'recharts' and
     'framer-motion' into their own vendor chunks
4. Create tsconfig.json with "allowJs": true, "strict": false, "jsx": "react-jsx",
   and the '@/*' path alias. We are migrating incrementally - do NOT try to make
   the whole codebase type-clean in this pass.
5. Rename every file containing JSX from .js to .tsx, and non-JSX modules to .ts.
   Fix the resulting import paths. Add `// @ts-nocheck` at the top of any file
   that would otherwise need real type work right now - we will remove those
   progressively. Prioritise proper types in src/data, src/config and src/services.
6. Migrate env vars: process.env.REACT_APP_* -> import.meta.env.VITE_*.
   Update .env, .env.example, .env.production, src/utils/env.ts,
   src/services/firebase.ts and scripts/sync-cloudflare-secrets.mjs.
7. Update package.json scripts: dev/build/preview via vite. Keep the existing
   deploy, secrets:sync and lint scripts working. Migrate ESLint to flat config
   with typescript-eslint.
8. Add vite-plugin-compression (brotli).

Verify: `npm run build` succeeds, `npm run dev` serves the site, every route
renders, Firebase auth works, and the Traffic dashboard still loads.
Report before/after bundle sizes.
```

---

### Prompt 2 — Route-level code splitting

```
Phase 0b. The single biggest performance problem: src/routes/AppRoutes.tsx
statically imports all 36 project pages, the Traffic admin dashboard and
HumzaLogin at module scope, so every public visitor downloads all of it.

1. Convert every route component in AppRoutes.tsx to React.lazy(). Wrap the
   <Routes> in <Suspense>.
2. Homepage is the ONLY exception - keep it statically imported so the landing
   route has no lazy-loading delay.
3. Build a <RouteFallback /> that renders the page shell (header + a content
   skeleton matching the target layout) - never a spinner, never a blank screen.
   This is what visitors see instead of the current 3-5 second void.
4. Traffic and HumzaLogin must be in their own chunks and must never appear in
   the initial graph. Verify this in the build output.
5. Prefetch the Projects chunk on hover/focus of any link pointing to /projects.

Acceptance: initial JS under 250 KB gzipped, Traffic chunk absent from the
homepage network waterfall, and no route shows a blank screen at any point.
Report the full chunk list with sizes.
```

---

### Prompt 3 — Tailwind + shadcn, themed to the glass system

```
Phase 1. Add Tailwind and shadcn/ui, themed to our design system BEFORE building
any component.

Read section 4.1 of .cursor/REDESIGN-AUDIT-2026.md for the token values.

1. Install and configure Tailwind for Vite. Set darkMode: 'class' and put .dark
   on <html> permanently - this site is dark-only, but the class keeps a light
   mode possible later.
2. Create src/styles/globals.css defining these as CSS variables in @layer base,
   then map them into tailwind.config.ts theme.extend so they are available as
   utilities:

   --bg-void        #05070f
   --bg-primary     #0a0e27
   --bg-elevated    rgba(255,255,255,0.03)
   --bg-elevated-2  rgba(255,255,255,0.06)
   --border-glass   rgba(255,255,255,0.08)
   --border-glow    rgba(255,255,255,0.14)
   --text-primary   #e8eaf6
   --text-secondary #a8b0c4
   --text-tertiary  #8792a8     (was #6b7280 - failed WCAG AA at 3.93:1)
   --text-on-accent #04122b     (fixes the 3.07:1 button failure)
   --accent         #4a9eff
   --accent-warm    #f0883e

3. Type scale: display font Satoshi (or General Sans), body Inter, code
   JetBrains Mono - all self-hosted woff2 variable fonts in public/fonts with
   font-display: swap and preload links for the two used above the fold.
   DELETE the Google Fonts <link> in index.html (Roboto + Source Code Pro are
   loaded and never used) and DELETE the @import chain in src/index.css.
   h1: clamp(3rem, 7vw, 5.5rem). h2: clamp(2rem, 4vw, 3rem). Body max-width 68ch.

4. Add three surface utilities as Tailwind components - .surface-1 (recessed),
   .surface-2 (card), .surface-3 (floating). Spec in audit section 4.1.

   PERFORMANCE RULE, enforce this strictly: only .surface-3 uses backdrop-filter,
   and no more than 3 backdrop-filtered elements may be composited at once
   (header, hero editor, modals). .surface-1 and .surface-2 achieve the glass
   look with translucent fill + inset top highlight + border-top-color ONLY.
   Add a @media (prefers-reduced-transparency: reduce) block with solid fallbacks.

5. Hover language: replace box-shadow glow everywhere with lift -
   translateY(-2px) + shadow deepen + border-top brighten. Retire --shadow-glow.

6. Init shadcn/ui pointing at these tokens. Add only: button, dialog, tabs,
   sheet, tooltip, badge, accordion, command, input, textarea, sonner.
   Then immediately re-theme every generated components/ui file to our glass
   surfaces. Do NOT leave shadcn defaults in place - default shadcn is the most
   recognisable template look on the web right now and we are specifically
   trying not to look like a template.

7. Global: add a prefers-reduced-motion base rule that reduces all animation
   and transition durations to 0.01ms.

Do not convert existing page CSS yet - that happens per-section in later phases.
```

---

### Prompt 4 — Image pipeline

```
Phase 0c. public/images is 47 MB across 159 PNG files with zero WebP or AVIF.
The largest single file, "Liberal Democrats/News.png", is 5.4 MB. This blocks
the whole imagery direction.

1. Write scripts/optimize-images.mjs using sharp:
   - For each image in public/images, emit .webp (quality 82, max 1600px wide)
     and .avif (quality 60) alongside the original
   - Emit a 16px-wide .blur.webp placeholder for every image (~1 KB each) into
     public/images/_blur/ mirroring the directory structure
   - Write public/images/manifest.json mapping each source path to its variants
     plus intrinsic width/height and a dominant colour
   - Make it idempotent - skip files whose output is newer than the source
2. Add `npm run images` and wire it into the build.
3. Build <Img /> in src/components/media/: <picture> with avif/webp/png sources,
   explicit width and height from the manifest (kills layout shift),
   loading="lazy" and decoding="async" by default with an `priority` prop for
   above-the-fold images, and the blur placeholder as a CSS background that
   cross-fades out on load.
4. Filenames contain spaces (e.g. "Admin Panel Analytics.png"). Handle encoding
   correctly rather than renaming - the paths are referenced in projects.json.

Target: total image payload under 5 MB. Report before/after.
```

---

### Prompt 5 — SEO and metadata correctness

```
Phase 0d. index.html currently points at THREE different domains and this is
actively damaging: canonical says humza-butt.onrender.com, og:url and
twitter:url say humzabutt.com, Schema Person.url says onrender.com, and the
real site is humza-butt.space. Canonical pointing at a stale Render deploy tells
Google your live site is the duplicate.

1. Make canonical, og:url, twitter:url and Schema Person.url all
   https://humza-butt.space. Confirm the other domains 301 to it.
2. theme-color, msapplication-TileColor, msapplication-navbutton-color and
   apple-mobile-web-app-status-bar-style are all #1f4037 - a dark green left
   over from an old design. Change to #0a0e27.
3. Rewrite the meta description. Remove "cyberpunk aesthetic" - it is inaccurate
   and it does not help with a hiring manager. Use:
   "Humza Butt - Software Engineer, Full Stack & Platform Configuration.
   Sutton, UK. Enterprise platform work for Shell, the BBC, the NHS and the
   Home Office. 29 shipped projects across web, mobile, desktop and extensions."
4. Delete the keywords meta tag.
5. Add react-helmet-async. Every route sets its own title and description.
   Project routes derive theirs from projects.json.
6. Extend the Schema.org Person block: correct url, jobTitle from the CV,
   alumniOf University of Portsmouth, knowsAbout from the CV skills list, and
   worksFor entries. Add CreativeWork entries for the flagship projects.
7. Generate public/sitemap.xml at build from projects.json plus static routes.
   Add robots.txt referencing it.
8. Per-project OG images: generate at build time from title + primary screenshot
   into public/og/. Every project route sets its own og:image. Currently every
   shared link previews identically.
```

---

### Prompt 6 — SiteHeader

```
Phase 2. Replace the header entirely. Read audit section 4.2 for the full
findings. Delete components/layout/Navbar and components/layout/HamburgerMenu
and build a single components/layout/SiteHeader.

Problems being fixed:
- Two nav components switched by a JS window.innerWidth check. Homepage.tsx and
  NotFound.tsx render Navbar only, so THE HOMEPAGE HAS NO MOBILE NAV AT ALL.
- "Login" is a filled gradient button with a glow and a 300px expanding ripple -
  the loudest element in the header - and it is an admin login no visitor can use.
- No contact CTA anywhere in the header.
- backdrop-filter: blur(10px) is defeated by a duplicate background property
  directly above it.
- Seven flat items with "Home" in second position.

Build:
1. Floating pill: top: 16px, max-width 1100px, centred, rounded-full, .surface-3.
   This is one of the three places backdrop-filter is allowed.
2. Scroll states via a single IntersectionObserver sentinel (not a scroll
   listener): transparent at top; glass fill + border + scale(0.98) past 80px;
   slides up when scrolling down past 400px, returns immediately on scroll up.
3. Logo: the Stacked H monogram. Full SVG spec and hover animation in
   .cursor/REDESIGN-PROMPTS-2026.md section 1.2. Build it as
   components/brand/Monogram.tsx taking a size prop and using currentColor.
   Top bar takes --accent. Delete the old <HB /> span logo.
4. Nav - exactly five items in this order: Work, About, Career, GitHub, Contact.
   "Home" is removed; the logo is home. Keep /projects as the Work href - the
   URL must not change.
5. Active indicator: a shared-layout pill sliding behind the active item using
   framer-motion layoutId. Scroll-spy driven on the homepage.
6. Primary CTA: "Get in touch" - the only filled element in the header, using
   --text-on-accent so it passes contrast. Secondary: "CV" linking to
   /Humza-Butt-CV.pdf with a tracked download event.
7. Login moves out of the header entirely, to a discreet footer link.
8. Mobile: ONE component, CSS-driven at 860px. No window.innerWidth anywhere.
   Use shadcn Sheet for the panel - full-height glass, 48px minimum tap targets,
   staggered entrance, focus trap, Escape to close, body scroll lock.
9. Render SiteHeader once in App.tsx, not per-page. Remove the per-page imports.

Acceptance: mobile nav works on every route including the homepage, zero
window.innerWidth references remain in layout code, keyboard navigable
end to end, and the header is fully usable with JS animations disabled.
```

---

### Prompt 7 — Hero and the CodeEditor

```
Phase 3. Rebuild the homepage hero. Read audit section 4.3.

The current chain costs roughly 8 seconds before a visitor reaches anything
substantive: Typewriter types the name -> onComplete -> 150ms timeout ->
Terminal mounts -> types 6 lines sequentially -> onComplete -> 500ms timeout ->
auto-scrollIntoView. The page is inert throughout and it scrolls the user
somewhere they did not ask to go.

Keep the code-typing character. Change everything around it.

1. Asymmetric two-column hero, not a centred stack.

2. LEFT COLUMN RENDERS INSTANTLY - no animation gate, present in the DOM on
   first paint. This is the single most important change on the page:
   - Availability pill: "Available for contract" (contract, not full-time)
   - h1 "Humza Butt"
   - "Software Engineer, Full Stack & Platform Configuration"
   - "I build SaaS platforms, APIs and real-time systems - and configure
     enterprise platforms for Shell, the BBC, the NHS and the Home Office."
   - CTAs: "View work" (primary) and "Get in touch" (ghost)
   - Stat strip: 29 shipped - 6 surfaces - 4 Tier 1 clients

3. RIGHT COLUMN - new components/animations/CodeEditor.tsx, replacing both
   Typewriter and Terminal:
   - EDITOR chrome, not terminal chrome. File tabs (humza.ts, work.ts,
     contact.ts), a line-number gutter, active-line highlight, a minimap sliver.
     Remove the macOS traffic lights - the current component wraps a file called
     about.js in terminal chrome, which is neither one thing nor the other.
   - Real syntax highlighting via a token map - keywords, strings, numbers,
     comments and punctuation each in their own palette colour. Not one green.
   - Scroll-triggered via IntersectionObserver, not autoplay on mount.
   - Type in 2-3 character bursts on a requestAnimationFrame loop, NOT one
     setTimeout per character. Reads faster and costs far fewer renders.
     Target 1.2s per file.
   - After the first file completes, cycle tabs on a slow loop, each typing its
     own content. Clicking a tab jumps to it and pauses the loop.
   - prefers-reduced-motion: render all content immediately, static cursor.
   - .surface-3, floating over a pre-blurred tinted screenshot backdrop with a
     radial mask. Subtle rotateX/rotateY on pointer move, disabled on touch.

   humza.ts content - specific and true, replacing
   passion: 'Crafting solutions with code':

   const humza = {
     role:     "Software Engineer, Full Stack & Platform Configuration",
     based:    "Sutton, London",
     building: ["Bgr8 - mentoring platform, 95% match accuracy",
                "LifeSmart - 7 SaaS tools, sub-second global loads",
                "TheraBot - GPT-4 mental health chatbot"],
     clients:  ["Shell", "BBC", "NHS", "Home Office"],
     stack:    ["TypeScript", "React", "Node", "Hono", "Cloudflare Workers"],
     shipped:  29,
   } as const;

4. DELETE: the auto-scroll on terminal complete, the infinite button-shimmer
   keyframe on .homepage-button (it animates forever and burns compositor
   cycles), and the "Scroll to explore" hint (it is display:none on mobile, so
   it is decoration rather than an affordance).

5. Do not reuse the Terminal component on About or Contact - three instances of
   the same device is what makes it read as a template. About and Contact get
   different treatments in Phase 9.

Acceptance: hero text is in the DOM on first paint and visible under 1.5s,
nothing blocks scrolling at any point, and the whole hero is readable and
usable with prefers-reduced-motion: reduce.
```

---

### Prompt 8 — Case study engine

```
Phase 4. The highest-value fix in the audit. Read audit sections 2.5 and 4.5.

Two problems:
(a) components/projects/ProjectSiteEmbed renders a BROKEN IMAGE BOX on live
    project pages - /bgr8 shows a grey rectangle with a broken-file glyph,
    roughly 500px tall, immediately below the title. Most target sites send
    X-Frame-Options DENY. This is the first thing a visitor sees on the pages
    that make the case for me.
(b) src/projects/ contains 36 near-duplicate hand-written components, and the
    content is undifferentiated prose - "Key Technical Achievements: Developed
    advanced matching algorithms, built responsive mobile-first interfaces,
    implemented role-based authentication..." - a list flattened into a sentence.

1. Fix the embed first. Add an `embeddable` boolean to each project in
   projects.json. Where false or unknown, render a screenshot with a
   "Visit live site ->" overlay instead of an iframe. Never ship an iframe that
   can fail. Add a load-timeout fallback for the ones we do embed.

2. Extend config/projects.json with a caseStudy block per project:

   "caseStudy": {
     "claim": "One sentence. What it does and why it mattered.",
     "role": "What I owned",
     "timeline": "Mar 2024 - present",
     "metrics": [{ "value": "95%", "label": "match accuracy in production" }],
     "problem": "Two sentences maximum.",
     "sections": [{
       "title": "Weighted matching algorithm",
       "body": "Markdown. Two or three short paragraphs.",
       "image": "/images/Bgr8/Matching Algorithm.png",
       "imageAlt": "..."
     }],
     "decisions": [{ "choice": "...", "why": "...", "tradeoff": "..." }],
     "outcome": "What shipped and what happened."
   }

3. Build components/projects/ProjectCaseStudy.tsx rendering that schema:
   Hero (title, claim, tech pills, live + repo links) -> At a glance (metric
   tiles) -> The problem -> What I built (alternating image/text, images in a
   shadcn Dialog lightbox) -> Technical decisions (choice / why / trade-off) ->
   Outcome -> prev/next project.

4. Replace all 36 files in src/projects/ with a single dynamic route driven by
   the JSON. EVERY EXISTING URL MUST STILL RESOLVE - /bgr8, /breathapplyser,
   /biaslens etc. are indexed. Keep the slug mapping exactly as it is in
   AppRoutes today, including the /breathapplyser-v2 alias.

5. Draft the caseStudy content for all 29 projects. Source material: the prose
   in the existing src/projects components, each project's README.md and
   CHANGELOG.md where present, and the screenshot filenames in public/images -
   they are unusually descriptive and map well to section titles.
   Mark every field you inferred rather than sourced with a "TODO(verify)"
   comment so I can check it. Do not invent metrics - leave metrics: [] if
   there is no number in the source material.

6. Do the five flagships first and show me those before generating the other 24:
   Bgr8, TheraBot, LifeSmart, Breathapplyser, Encore.

Acceptance: zero broken iframes anywhere, every old project URL resolves,
every case study has at least one real screenshot, and no case study ships with
an empty section.
```

---

### Prompt 9 — Imagery, remaining sections, footer

```
Phase 5. Read audit sections 4.4 and 4.5.

1. SectionBackdrop component - the blended-image system:
   <SectionBackdrop src=... placement="left|right|center" intensity={0.14}
                    tint="accent" />
   Rules, all enforced in the component:
   - TWO masks always: a radial fade to transparent at the edges PLUS a linear
     fade toward the text side. A screenshot must never show a rectangular edge.
   - Opacity clamped to 0.10-0.18. Reject values outside that range.
   - Duotone-tint toward --accent via a CSS filter chain so a red screenshot and
     a green one do not fight each other.
   - Use the build-time blur placeholders from Phase 0c scaled up. NO runtime
     backdrop-filter here.
   - One backdrop per section maximum, alternating sides down the page.
   - Never behind body copy at full width - it sits behind the side of the
     section the text does not occupy.
   - No parallax under prefers-reduced-motion.

2. Career: restructure to the two-column pattern - date range in a left gutter
   (mono, --text-tertiary, 120px), role/company/prose/tech-pills on the right,
   a left rail line with a node dot per role. No card borders.
   ADD CoreStream GRC as a first-class entry with Shell, BBC, NHS and Home
   Office surfaced - it is currently absent from the site entirely and it is the
   strongest credential I have. Regenerate config/linkedin.json from my CV so
   titles and dates match it exactly (see audit section 7.5 - the site and CV
   currently disagree). Add the BSc 1st Class alongside the MEng.

3. Homepage featured projects: replace the uniform grid with an editorial bento -
   one 2x2 feature using a full screenshot with a bottom gradient scrim and text
   over it, plus four standard tiles. Hover: lift, and thumbnail scales 1.04
   inside overflow-hidden.

4. Projects page: keep the filter architecture, it works. Fix the "+16" tech-tag
   overflow indicator - it is a dead end, make it expand in place. Add sort
   (recent / surface / tech) and text search via shadcn Command. Equalise card
   heights per row.

5. About: rewrite the skills block. It currently advertises Ember.js and Angular,
   neither of which is on my CV - six frontend frameworks including a 2011-era
   one reads as padding. Use the CV list verbatim (audit section 7.3). Do not
   reuse the Terminal component here.

6. GitHub: move the contribution calendar above the fold - it is the strongest
   visual element on the site and it is currently buried. Restyle repo cards to
   .surface-2, sort by recent activity, filter out the Portfolio-Website repo
   from my own portfolio.

7. Contact: two columns, form left, direct channels right. Drop the third
   Terminal instance. Inline validation, proper success state, honeypot field.
   Add the CV download.

8. Footer - there is currently none. Nav repeat, socials, "Built with React,
   Vite and Tailwind - source on GitHub", last-updated, and the admin login link
   relocated from the header.
```

---

### Prompt 10 — Hono worker + Traffic restyle

```
Phase 6.

1. Migrate worker/index.js to Hono and TypeScript:
   - It currently hand-rolls routing, method checks and JSON responses for the
     /api/* traffic-notify endpoints.
   - Rewrite as a Hono app with typed routes and middleware. Preserve exactly:
     the RESEND_API_KEY / NOTIFY_SECRET secret handling, the ALLOWED_TYPES set
     (new_visitor, ref_hit, test), recipient normalisation and the
     MAX_RECIPIENTS cap of 20, the HTML escaping in the email templates, and the
     Cache-Control: no-store headers.
   - Add zod validation on request bodies and proper CORS middleware.
   - Keep wrangler.jsonc's assets config and run_worker_first: ["/api/*"]
     working unchanged.
   - Test every endpoint against the live Traffic dashboard before we deploy.

2. Restyle the Traffic dashboard to the new design system. It is 4,532 lines of
   CSS - 45% of the entire stylesheet - and it is the only place the old
   Bootstrap-era palette survives: 88 uses of #667eea, 17 of #764ba2, and
   light-theme greys (#f8f9fa, #dee2e6, #e9ecef) inside a dark-theme site.
   - Replace all hardcoded hex with tokens.
   - Convert the layout to Tailwind and shadcn (Tabs, Dialog, Command, Badge).
   - Restyle the recharts charts to the palette - grid lines at --border-glass,
     axis labels at --text-tertiary, series in --accent and --accent-warm.
   - This route is already lazy-loaded from Phase 0b, so none of its weight
     reaches public visitors. Confirm that is still true after the rewrite.
```

---

### Prompt 11 — Verify

```
Phase 7. Verification. Do not skip - the glass effects specifically need real
measurement, not desktop Chrome eyeballing.

1. Lighthouse on mobile AND desktop for: /, /projects, /about, /career,
   /contact, and /bgr8. Report all four scores per page.
   Targets: Performance >= 90 mobile, Accessibility 100, Best Practices >= 95,
   SEO 100.
2. axe-core on every route. Zero violations. Pay attention to the mobile nav
   focus trap and the case study lightbox.
3. Re-measure contrast on every token pair against the rendered site. These
   three failed in the audit and must now pass:
   --text-tertiary on --bg-primary (was 3.93:1), --text-tertiary on card
   surfaces (was 3.34:1), and CTA text on --accent (was 3.07:1).
4. Bundle analysis: rollup-plugin-visualizer. Confirm Traffic, HumzaLogin and
   the case study chunks are absent from the initial graph.
5. Test with prefers-reduced-motion: reduce - the site must be fully usable and
   nothing should animate.
6. Test with prefers-reduced-transparency: reduce - glass falls back to solid.
7. THROTTLED TEST, this is the important one: Chrome DevTools 4x CPU throttle +
   Fast 3G. Scroll the full homepage and one case study. Watch for dropped
   frames from backdrop-filter. If the header, hero editor and modals together
   cause jank, drop backdrop-filter from the header first and use a solid
   translucent fill.
8. Verify every pre-existing URL still resolves, including all 36 project slugs
   and /linkedin -> /career.
9. Confirm Firebase auth, the Traffic dashboard, tracking tokens and the email
   notify API all still work end to end.

Report everything as a table of metric / before / after / target.
```

---

## Part 3 — Sanity checklist before launch

- [x] `humza-butt.space` is canonical; other domains 301 to it — Worker host redirect + [`DOMAIN-REDIRECTS-2026.md`](DOMAIN-REDIRECTS-2026.md); Render still needs dashboard cutover via [`redirect/`](../redirect/) or suspend
- [x] Availability pill says **contract**, not full-time
- [x] Shell / BBC / NHS / Home Office appear on the Career section and in the hero stat strip
- [x] `linkedin.json` titles and dates match the CV exactly — spot-checked (LifeSmart Mar 2024, Bgr8 Lead Full Stack, CoreStream Jul–Dec 2025); final PDF eye-check recommended
- [x] The "7 years 11 months" figure is scoped or removed (see audit 7.5)
- [x] Ember.js and Angular are gone from the skills list
- [x] CV PDF is downloadable from header, contact and footer
- [x] Zero broken iframes on any case study
- [x] All 29 case studies have a real screenshot and at least one specific claim — screenshots under `/images/…` (product cards for offline-only projects); `TODO(verify)` cleared
- [x] No `TODO(verify)` comments left in `projects.json`
- [x] Old `<HB />` logo fully removed; favicons regenerated from the monogram (`npm run favicons`)
- [x] Login is not in the header
- [x] Homepage has working mobile navigation
