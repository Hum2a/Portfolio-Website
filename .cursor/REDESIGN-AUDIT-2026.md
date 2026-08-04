# Portfolio Redesign — Audit & Plan

**Site:** https://humza-butt.space · **Repo:** `portfolio` (CRA 5 / React 19 / Firebase / Cloudflare Workers)
**Audited:** 1 Aug 2026 · **Method:** full source read, live-site inspection across all routes, benchmark comparison against `emmabostian/developer-portfolios` (1,686 entries)

**Agreed direction:**
- **Build** — migrate CRA → **Vite**, keep React Router. Adopt **Tailwind + shadcn/ui**, **Hono** on the Worker, **TypeScript**
- **Visual** — **glass / depth layering** over blurred screenshot backdrops
- **Hero** — **rebuild the code animation richer**: multi-file editor, syntax highlighting, scroll-triggered
- **Case studies** — full treatment on all 29
- **Positioning** — available for **contract** work, not full-time

> Decisions, stack rationale, monogram spec and the sequenced Cursor prompts live in
> **`REDESIGN-PROMPTS-2026.md`**. This document is the findings record.

---

## 1. Executive summary

The site is not badly built. The information architecture is sound, the project data is properly normalised in `config/projects.json`, the token system in `styles/themes/` exists and is used, and the Projects and Career pages are genuinely decent. **The problem is not the structure — it's the delivery and the surface.**

Three things are doing most of the damage:

1. **Nothing is visible for 3–5 seconds on every single route.** One 1.6 MB JS bundle, no code splitting, no prerender. I measured this repeatedly: navigating to `/contact` showed a bare navbar on a black page for over 4 seconds. A recruiter with a tab open for 10 seconds sees an empty site for half of them.
2. **The hero costs ~8 seconds before a visitor reaches anything substantive** — name types, *then* the terminal mounts, *then* it types six lines, *then* it auto-scrolls you. It runs sequentially and the page is inert while it does.
3. **Your project detail pages — the pages that actually make the case for you — render a broken image box.** `/bgr8` shows a grey placeholder with a broken-file icon where the live-site iframe should be, occupying the entire first screen below the title. Meanwhile 47 MB of real screenshots sit unused in `/public/images`.

That third point is the single highest-value fix in this document. Everything else is polish on top of it.

---

## 2. Problems

### 2.1 Performance & delivery — *the first impression is broken*

| Finding | Evidence | Impact |
|---|---|---|
| Single monolithic JS bundle | `build/static/js/main.e1680f8d.js` = **1,613,774 bytes** | 3–5s blank screen on every route |
| Zero code splitting | `routes/AppRoutes.js` statically imports all 36 project pages + `Traffic` + `HumzaLogin` at module scope | Every public visitor downloads your private admin dashboard |
| Admin CSS ships to the public | `pages/Traffic/Traffic.css` is **4,532 lines** — 45% of all CSS in the project — inside a 144 KB single stylesheet | Render-blocking weight nobody but you will ever use |
| No image optimisation | `public/images` = **47 MB across 159 files**, **zero** `.webp` or `.avif`. Largest single file: `Liberal Democrats/News.png` at **5.4 MB** | Any page using imagery will be unusable on mobile data |
| Four font families loaded, two unused | `index.html` loads Roboto + Source Code Pro; `typography.css` `@import`s Inter + Fira Code. Only Inter and Fira Code are referenced in CSS | Wasted requests + a render-blocking `@import` chain inside CSS |
| Render-blocking CSS `@import` | `index.css` → `themes/index.css` → `colors.css` + `typography.css` → two Google Fonts URLs | Serial waterfall before first paint |
| `react-scripts` 5.0.1 | Effectively unmaintained; webpack 4-era toolchain | Slow builds, no modern splitting defaults |
| No SSR / prerender | Pure client-rendered SPA. Raw HTML contains only the "JavaScript Required" notice | Crawlers and previews see an empty shell |

### 2.2 The hero — *an 8-second toll gate*

`pages/Homepage.js`:

```
Typewriter "Humza Butt" (45ms/char ≈ 0.5s)
  → onComplete → setTimeout 150ms → mount Terminal
    → Terminal types 6 lines sequentially (22ms/char ≈ 3s)
      → onComplete → setTimeout 500ms → auto-scrollIntoView
```

Add the 3–5s bundle wait in front and it's ~8 seconds before the visitor reaches the Career section — which they didn't ask to be scrolled to.

Specific faults:

- **Everything is sequential.** The terminal doesn't even *exist* in the DOM until the name finishes typing, so `homepage-subtitle-container` holds a `min-height: 200px` empty box for the first second.
- **Auto-scroll hijacks the user.** `handleTerminalComplete` scrolls the page for them. If they've already started scrolling, it fights them.
- **No `prefers-reduced-motion` handling anywhere in the codebase.** Vestibular-sensitive users and accessibility-conscious reviewers get the full animation.
- **The content is filler.** `passion: 'Crafting solutions with code'` and `skills: [..., '...']` say nothing. The animation is the most prominent thing on your site and it's spending its attention budget on a truncated array literal.
- **The terminal is cosmetically confused.** It has macOS traffic-light dots and a title bar reading `about.js` — a terminal chrome wrapping a JavaScript file. It's neither a terminal nor an editor.
- **Duplicated three times.** The same `Terminal` component with the same treatment opens Home, About *and* Contact. What reads as a signature on one page reads as a template by the third.

### 2.3 Header — *functional, but the weakest element on the page*

`components/layout/Navbar.js` / `Navbar.css`:

- **Seven items, flat, no hierarchy.** Career · Home · About · Projects · Contact · GitHub · Login — all identical weight. Home sits *second*, after Career, which is disorienting.
- **"Login" is the loudest thing in the header.** It's a filled gradient button with a glow and a 300px expanding ripple on hover — the strongest visual treatment anywhere in the nav — and it's a **private admin login that no visitor can use.** Your primary CTA slot is occupied by a door only you can open.
- **No real CTA.** There is no "Contact me", no CV download, no email. The single most valuable action a visitor can take has no affordance in the header.
- **`<HB />` logo** — the angle-bracket-initials logo is the single most common developer-portfolio cliché in the reference list. It's also `<span>`-based rather than an SVG, so it can't scale or animate cleanly.
- **Two separate nav components** — `Navbar` and `HamburgerMenu` — switched by a **JS `window.innerWidth` check**, not CSS. `Homepage.js` and `NotFound.js` render `Navbar` *only*, so **the homepage has no mobile navigation at all.** There are 15 `window.innerWidth` checks across the codebase doing responsive work that belongs in media queries.
- **Backdrop blur is declared but defeated** — `backdrop-filter: blur(10px)` with `background: rgba(26,31,58,0.8)`, and a duplicate `background` property above it that the second one overrides. The blur barely registers.
- **No scroll state.** The header looks identical at the top of the page and 4,000px down.

### 2.4 Visual design — *what actually reads as dated*

To be precise: the Bootstrap-era purple gradients (`#667eea` / `#764ba2`, 89 and 17 occurrences) and light-theme greys (`#f8f9fa`, `#dee2e6`, `#e9ecef`) are confined to `Traffic.css` and `HumzaLogin.css` — your **private** pages. The public site's palette is genuinely consistent. The dated feel comes from elsewhere:

- **Flat surfaces, no depth.** Every card is `background: var(--bg-secondary)` + `1px solid var(--border-primary)` + `border-radius: 8–12px`. Same recipe on career cards, project cards, GitHub repo cards, contact cards, project sections. Nothing is layered, nothing recedes, nothing advances.
- **Glow-on-hover is the only interaction language.** `box-shadow: var(--shadow-glow)` + `border-color: var(--accent-primary)` on hover, applied identically everywhere. It's the 2019 "cyberpunk dashboard" idiom.
- **Everything is `//` prefixed.** `// Hello, I'm`, `// Career`, `// Open Source`, `// Professional Journey`, `// About Bgr8 Platform`, `/ Projects`, `// Get in Touch`. A code-comment prefix on a section header is a nice touch *once*. Nine times it's a tic.
- **Typography has no scale contrast.** `h1` through `h6` step 48 → 40 → 30 → 24 → 20 → 18px — nearly linear. Modern editorial layouts want a much steeper jump between display type and body. Body copy is 16px `--leading-relaxed` at full container width, giving line lengths well over 90 characters on desktop.
- **`--border-primary: #2d3748` sits at 1.59:1 against the background** — the borders defining every card are barely visible, so cards read as vague dark rectangles rather than deliberate objects.
- **The button shimmer never stops.** `.homepage-button::after` runs `button-shimmer` on `infinite`. A permanently animating primary button is a 2018 landing-page tell and it burns compositor cycles forever.
- **No imagery on the public pages at all** — except project card thumbnails and two small avatar photos. The site is text-in-boxes from top to bottom.

### 2.5 Project detail pages — *the highest-value failure*

- **`ProjectSiteEmbed` renders a broken box.** On `/bgr8` the "Live site" panel shows a grey rectangle with a broken-image glyph, roughly 500px tall, immediately below the title. Most target sites send `X-Frame-Options: DENY` / restrictive `frame-ancestors`, so this will fail for most projects. **This is the first thing a visitor sees on your most important pages.**
- **Content is undifferentiated prose.** The Bgr8 page is wall-to-wall paragraphs: *"Key Technical Achievements: Developed advanced matching algorithms, built responsive mobile-first interfaces, implemented role-based authentication…"* — a list flattened into a sentence. No metrics, no headings, no scan path, no visual break.
- **Your screenshots are unused.** You have curated, well-named captures — `Bgr8/Matching Algorithm.png`, `Bgr8/Live Messaging between mentor and mentee.png`, `Bgr8/Admin Panel Analytics.png`. These are *proof of work* and they're sitting on disk while the page shows a broken iframe.
- **36 near-duplicate hand-written components.** `src/projects/*.js` — each project is a bespoke file. Adding a project means writing a component; restyling means touching 36 files. The data to drive these generically already exists in `projects.json`.

### 2.6 Accessibility

Contrast ratios measured against the actual tokens:

| Token | Ratio vs `--bg-primary` | Verdict |
|---|---|---|
| `--text-primary` `#e8eaf6` | 15.86:1 | Pass |
| `--text-secondary` `#9ca3af` | 7.49:1 | Pass |
| **`--text-tertiary` `#6b7280`** | **3.93:1** | **Fails AA** (3.34:1 on `--bg-secondary` cards) |
| **Login button text on `#3b82f6`** | **3.07:1** | **Fails AA** |
| `--border-primary` `#2d3748` | 1.59:1 | Below the 3:1 non-text minimum |

`--text-tertiary` is used for the scroll hint, all project dates, all card metadata and every `//` comment prefix — so a meaningful share of your secondary content is below standard.

Also: no `prefers-reduced-motion` anywhere; no skip-link target verified against the actual `#main-content` landmark; the mobile nav is absent on the homepage entirely; `31` inline `style={{}}` objects bypass the token system.

### 2.7 SEO & metadata — *three different domains*

`public/index.html` is internally inconsistent:

- `<link rel="canonical">` → `humza-butt.onrender.com`
- `og:url` / `twitter:url` → `humzabutt.com`
- Schema.org `Person.url` → `humza-butt.onrender.com`
- **Actual site** → `humza-butt.space`

Canonical pointing at a stale Render deployment actively tells Google your real site is a duplicate.

Further:

- `theme-color: #1f4037` — a **dark green**, from an older design. Your site is navy `#0a0e27`. Mobile browser chrome renders green.
- Meta description sells a *"cyberpunk aesthetic"*. The site is a restrained navy dark theme. Not cyberpunk, and the word does you no favours with a hiring manager.
- Single `og:image` for the whole site; no per-project preview images.
- `keywords` meta tag — ignored by every search engine since ~2009.
- No `sitemap.xml`, no per-route `<title>`/description (SPA, no head management).

---

## 3. Benchmark findings

I worked through the reference list (1,686 portfolios) and inspected the standouts. Very few are strong; the strong ones cluster into two archetypes.

**Archetype A — the editorial engineer** (Brittany Chiang, Lee Robinson, Delba)

Brittany Chiang's is the most-copied portfolio in the list for good reason: a **fixed left column** with name, role, one-line pitch and a scroll-spy nav, against a **scrolling right column** of content. Experience entries are a two-column grid — date range on the left, role + prose + tech pills on the right. No hero animation, no page-load ceremony, content visible instantly. A soft cursor-tracking radial gradient is the *only* decoration.

Lee Robinson goes further — no nav, no cards, no imagery. Name, three paragraphs, a list of links. It works because the writing is specific.

**What to take:** the fixed-rail + scrolling-content split; date-left/content-right experience rows; instant content; one restrained ambient effect rather than many.

**Archetype B — the visual statement** (Adham Dannaway, Artur Bień / expensive.toys)

Adham Dannaway's split-face hero — "designer" on the left, `<coder>` on the right, a photo bisected down the middle between them — is a decade old and still the most memorable thing in the list. **One** idea, executed exactly. Artur Bień's `expensive.toys` is craft-forward: interactive components as the portfolio itself.

**What to take:** one committed visual idea beats five decent ones. And personal imagery, used deliberately, is what makes a portfolio memorable rather than competent.

**What the strong ones all share, and you don't yet:**

1. **Content is visible immediately** — none of them make you wait.
2. **A specific claim, not a generic title.** "Frontend Engineer — I build accessible, pixel-perfect experiences" beats "Full Stack Developer".
3. **Proof over description.** Named companies, real outcomes, live links.
4. **One ambient effect, restrained** — not glow-on-hover everywhere.
5. **Deep case studies over long project lists.** Your 29 projects are an asset, but 4 with real depth would convert better.

**What you already have that most of them don't:** 29 shipped projects across six surfaces (web, mobile, desktop, extension, npm, games), a live GitHub integration, a real career timeline with dates, and a working analytics pipeline. Your *substance* is above the median of that list. Only the presentation isn't.

---

## 4. Redesign plan

### 4.0 Foundation — Vite migration

Keep React Router, keep the component tree, keep Firebase. Replace the toolchain.

- `react-scripts` → `vite` + `@vitejs/plugin-react`
- `public/index.html` → root `index.html` with `<script type="module" src="/src/index.js">`
- `process.env.REACT_APP_*` → `import.meta.env.VITE_*` (touches `utils/env.js`, `services/firebase.js`, `scripts/sync-cloudflare-secrets.mjs`, `.env*`)
- Rename any `.js` file containing JSX to `.jsx` (Vite requires it) — ~90 files, mechanical
- `manualChunks` to isolate `firebase`, `recharts` and `framer-motion` vendor bundles
- **`React.lazy` + `Suspense` on every route** in `AppRoutes.js` — this alone removes the Traffic dashboard, `recharts` and 36 project pages from the initial payload
- `vite-plugin-compression` (brotli) + `vite-plugin-image-optimizer`
- Keep the Cloudflare Worker deploy; update `wrangler.jsonc` asset directory to `dist`

**Target: initial JS under 200 KB gzipped, First Contentful Paint under 1.2s.**

### 4.1 Design system

**Colour** — keep the navy identity, deepen it and fix what fails.

```
--bg-void        #05070f   /* new: page floor, below bg-primary */
--bg-primary     #0a0e27   /* unchanged — your identity colour */
--bg-elevated    rgba(255,255,255,0.03)   /* glass fill */
--bg-elevated-2  rgba(255,255,255,0.06)
--border-glass   rgba(255,255,255,0.08)   /* replaces #2d3748 */
--border-glow    rgba(255,255,255,0.14)   /* top-edge highlight */

--text-primary   #e8eaf6   /* keep */
--text-secondary #a8b0c4   /* lifted from #9ca3af */
--text-tertiary  #8792a8   /* lifted from #6b7280 — clears 4.5:1 */

--accent         #4a9eff   /* keep */
--accent-warm    #f0883e   /* new: one warm counterpoint, used sparingly */
```

Add `--text-on-accent: #04122b` so the CTA passes contrast. Retire `--shadow-glow` as a hover default.

**Type** — steepen the scale and drop a family.

- Display: **Satoshi** or **General Sans** (variable) for h1/h2 — gives you the editorial jump the current all-Inter stack lacks
- Body: **Inter** (keep, self-hosted, variable, subset)
- Code: **JetBrains Mono** (replace Fira Code — better at small sizes, and you already list it as a fallback)
- Self-host all three as `woff2` with `font-display: swap`. Delete Roboto and Source Code Pro entirely. Remove the CSS `@import` chain.
- Display scale: `clamp(3rem, 7vw, 5.5rem)` for h1, `clamp(2rem, 4vw, 3rem)` for h2 — a real gap, not a linear step
- Body max line length `68ch`

**Glass depth system** — this is the new visual language, replacing flat-card-plus-glow.

Three elevation tiers, applied consistently:

```css
.surface-1 {  /* recessed — section backdrops */
  background: var(--bg-elevated);
  border: 1px solid var(--border-glass);
  border-radius: 16px;
}
.surface-2 {  /* default — cards */
  background: var(--bg-elevated-2);
  border: 1px solid var(--border-glass);
  border-top-color: var(--border-glow);   /* light from above */
  border-radius: 20px;
  box-shadow: 0 1px 0 0 rgba(255,255,255,.06) inset,
              0 24px 48px -24px rgba(0,0,0,.6);
}
.surface-3 {  /* floating — hero editor, modals */
  backdrop-filter: blur(24px) saturate(140%);
  /* ...surface-2 plus stronger shadow */
}
```

**Performance guardrail — this matters.** `backdrop-filter` is the most expensive property in the plan. Rules:

1. **Never more than 3 blurred elements composited at once.** Cards get the glass *look* (translucent fill + inset highlight + top-edge glow) **without** `backdrop-filter`. Only the header, the hero editor and modals actually blur.
2. Blur **static backdrops only** — never blur over something that scrolls behind at a different rate.
3. Pre-blur the screenshot backdrops **at build time** as small WebP files rather than blurring live in CSS. A 40px-wide image scaled up *is* a blur, and it costs nothing.
4. `@media (prefers-reduced-transparency)` and low-end detection → solid fallbacks.

Hover language changes from *glow* to *lift*: `translateY(-2px)` + shadow deepen + border-top brighten. Cheaper, more tactile, less 2019.

### 4.2 Header — full rebuild

**Structure:** floating pill, not a full-width bar. Detached from the viewport edge (`top: 16px`), `max-width: 1100px`, centred, `border-radius: 999px`, `surface-3` glass. This is where `backdrop-filter` earns its cost.

**Scroll behaviour:**
- At top: transparent, no border, no shadow
- On scroll past 80px: glass fill fades in, border appears, pill contracts slightly (`scale(0.98)`)
- Scrolling down past 400px: slides up out of view; scrolling up: returns immediately

**Contents, left to right:**

1. **Logo** — retire `<HB />`. Replace with a monogram SVG: an **`H` whose crossbar is offset**, reading as both an H and an equals/assignment glyph. Codes as "developer" without the bracket cliché. Animates its crossbar on hover.
2. **Nav — five items, correctly ordered:** `Work · About · Career · Writing/GitHub · Contact`. "Home" is removed — the logo is home, which is a universal convention. Career and GitHub stop competing with primary sections.
3. **Active indicator** — a shared-layout pill sliding behind the active item (`framer-motion` `layoutId`), replacing the current 2px underline. Scroll-spy driven on the homepage.
4. **Primary CTA** — `Get in touch` as the only filled element in the header, using `--text-on-accent`.
5. **Login** — removed from the header entirely. Move it to a discreet footer link or a keyboard shortcut. It is admin-only and does not belong in a visitor's primary navigation.

**Mobile:** one component, CSS-driven — no `window.innerWidth`. Below 860px the nav collapses to a menu button; the panel is a full-height glass sheet with large tap targets, staggered entrance, and a focus trap. **`HamburgerMenu` and `Navbar` merge into a single `SiteHeader`** so the homepage stops shipping without mobile nav.

### 4.3 Hero — the rich code editor

Replace `Typewriter` + `Terminal` with a new `CodeEditor` component. Keep the character of the typing; upgrade everything around it.

**Layout — asymmetric split, not centred stack:**

```
┌──────────────────────────────┬─────────────────────────┐
│  Available for work ●        │                         │
│                              │   ╭─────────────────╮   │
│  Humza Butt                  │   │ ○ ○ ○  ┌──┬──┐  │   │
│  ─────────────                │   │        │hb│pr│  │   │
│  I build platforms across    │   │ 1 const…│  │  │  │   │
│  edtech, mentoring and       │   │ 2   …   │  │  │  │   │
│  consumer apps.              │   │ 3   …▌  │  │  │  │   │
│                              │   ╰─────────────────╯   │
│  [ View work ] [ Get in touch]│                         │
│                              │                         │
│  29 projects · 6 surfaces ·  │                         │
│  7yr 11mo                    │                         │
└──────────────────────────────┴─────────────────────────┘
```

**Left column renders instantly.** No animation gate. Name, claim, CTAs and stats are in the DOM on first paint. This is the single most important change on the page.

**Right column — the `CodeEditor`:**

- **Editor chrome, not terminal chrome.** Multiple **file tabs** (`humza.ts`, `projects.ts`, `contact.ts`), a **line-number gutter**, an active-line highlight, a minimap sliver. Drop the macOS traffic lights — they read as generic; an editor tab bar reads as *your* tool.
- **Real syntax highlighting** via a token map, not a single green. Keywords, strings, numbers, comments, punctuation each in their own palette colour. This is the difference between "code-styled text" and "code".
- **Scroll-triggered, not autoplay.** Typing begins on `IntersectionObserver` entry. Tabs cycle on a slow loop after the first file completes — each tab types its own content, so it rewards a visitor who stays without punishing one who doesn't.
- **Typing runs in parallel with everything else.** No `onComplete` chain, no auto-scroll, no blocking.
- **Faster and chunkier** — type in 2–3 character bursts on a `requestAnimationFrame` loop rather than one `setTimeout` per character. Reads as faster and costs far fewer renders. Target ~1.2s per file.
- **Write content worth reading.** Replace `passion: 'Crafting solutions with code'` with something specific and true:

```ts
const humza = {
  role:     "Full Stack Developer",
  based:    "Sutton, UK",
  building: ["Bgr8 — mentoring platform",
             "TheraBot — GPT-4 mental health chatbot",
             "LifeSmart — financial literacy tools"],
  stack:    ["React", "TypeScript", "Firebase", "Cloudflare Workers"],
  shipped:  29,
} as const;
```

- **`prefers-reduced-motion`** → full content rendered immediately, cursor static, no typing.
- **Depth:** the editor is `surface-3`, floats above a **pre-blurred, tinted screenshot backdrop** of a real project, with a radial mask fading it into the background. Slight `rotateY`/`rotateX` on pointer move, disabled on touch.

**Removed:** the auto-scroll, the infinite button shimmer, the "Scroll to explore" hint (a scroll hint that is `display: none` on mobile is decoration, not affordance).

### 4.4 Image treatment — the blended-background system

This is where your 47 MB of screenshots becomes an asset. One `SectionBackdrop` component, used consistently:

```jsx
<SectionBackdrop
  src="/images/Bgr8/Matching Algorithm.webp"
  placement="right"     // left | right | center
  intensity={0.14}      // 0.10–0.18, never higher
  tint="accent"         // duotone toward --accent
/>
```

**Rules — this is what separates tasteful from amateur:**

1. **Two masks, always.** A radial mask fading the image to nothing at the edges, *plus* a linear mask fading toward the text side. Screenshots must never have a visible rectangular edge.
2. **Opacity 0.10–0.18.** Above that it competes with text. Below it, it isn't doing anything.
3. **Duotone-tint every image** toward the palette (`--accent` / `--bg-primary`) so a red screenshot and a green one don't fight each other. A CSS `filter` chain does this without touching the source files.
4. **Pre-blurred at build time** — generate an 8–16px-wide WebP per screenshot (~1 KB each) and scale it up. Zero runtime blur cost. Full-resolution versions load only in lightboxes.
5. **One backdrop per section, maximum.** Alternate sides down the page to create rhythm.
6. **Never behind body copy at full width** — the image sits behind the *side* of a section that the text doesn't occupy.
7. **`prefers-reduced-motion`** → no parallax; backdrops stay fixed.

Asset pipeline: convert all 159 PNGs to WebP at 1600px max (expect ~47 MB → ~4 MB), generate blur placeholders, add an AVIF tier for supporting browsers. Every `<img>` gets explicit `width`/`height` and `loading="lazy"` to kill layout shift.

### 4.5 Section-by-section

**Career** — restructure to the Brittany Chiang two-column pattern: date range in a left gutter (`--text-tertiary`, monospace, `120px`), role + company + prose + tech pills on the right. No card borders — a **left rail line** with a node dot per role, so it reads as a genuine timeline. Company logos where you have them. Backdrop: your profile photo, right-placed, heavily masked.

**Projects (homepage featured)** — replace the uniform 2-col grid with an **editorial bento**: one large feature (2×2) + four standard tiles. The feature tile uses a full screenshot with a bottom gradient scrim and text over it. Standard tiles keep the current thumbnail-over-content pattern with the new glass treatment. On hover, tiles lift and the thumbnail scales 1.04 inside `overflow: hidden`.

**Projects (full page)** — keep the filter architecture, it's good. Fix: the `+16` tech-tag overflow indicator is a dead end — make it expand in place. Add a sort control (recent / surface / tech). Add a text search. Card heights should equalise per row.

**Project detail pages** — the biggest rebuild:

1. **Delete `ProjectSiteEmbed`, or gate it.** Probe embeddability at build time; where framing is blocked, render a **screenshot with a "Visit live site →" overlay** instead of a broken box. Never ship an iframe that might fail.
2. **Drive from `projects.json`, not 36 components.** One `ProjectCaseStudy` template + per-project data. Collapse the `src/projects/` directory.
3. **Case study structure:** Hero (title, one-line claim, tech pills, live/repo links) → **At a glance** (3–4 metric tiles — users, scale, timeline, role) → **The problem** (2 sentences) → **What I built** (3–4 subsections, *each with a real screenshot*) → **Technical decisions** (the interesting choices, framed as trade-offs) → **Outcome** → next/prev project.
4. **Break up the prose.** "Key Technical Achievements: A, B, C, D" becomes an actual list. Every wall of text gets a screenshot beside it.
5. **Per-project OG images** — generate at build from title + screenshot. Right now every shared link previews identically.

**GitHub** — keep the live integration, it's a genuine differentiator. Restyle repo cards to `surface-2`, add the contribution calendar above the fold (it's the visually strongest element you have and it's currently buried), sort by recent activity, filter out `Portfolio-Website` from its own portfolio.

**Contact** — drop the third `Terminal` instance. Two columns: form on the left, direct channels on the right. Add inline validation, a proper success state, and honeypot spam protection. Add a **CV download** — it's the most requested thing on a developer portfolio and you don't offer it anywhere.

**Footer** — you don't have one. Add: nav repeat, social links, "Built with React + Vite — source on GitHub", last-updated, and the admin login link that's leaving the header.

### 4.6 SEO & metadata

- **Pick one canonical domain** (`humza-butt.space`) and make canonical, `og:url`, `twitter:url` and Schema `Person.url` all agree. 301 the others.
- `theme-color` → `#0a0e27`.
- Rewrite the description without "cyberpunk": *"Humza Butt — Full Stack Developer in Sutton, UK. 29 shipped projects across web, mobile, desktop and browser extensions. React, TypeScript, Firebase, Cloudflare Workers."*
- Per-route `<title>` and description via `react-helmet-async` or a small head hook.
- Generate `sitemap.xml` at build from `projects.json`.
- Per-project OG images.
- Drop the `keywords` meta.
- Extend Schema: `Person` + `knowsAbout` from your real stack, plus `CreativeWork` entries for flagship projects.

---

## 5. Phased roadmap

| Phase | Work | Why this order |
|---|---|---|
| **0 — Foundation** | Vite migration, route-level `React.lazy`, self-hosted fonts, image pipeline (WebP + blur placeholders), fix canonical/OG/theme-color | Everything else is invisible until the site paints. Nothing visual should be built on the old toolchain. |
| **1 — Design system** | Token overhaul, glass surface tiers, type scale, contrast fixes, `prefers-reduced-motion`, retire glow-hover | Establishes the vocabulary so later phases don't invent one-offs. |
| **2 — Header** | `SiteHeader` rebuild: floating glass pill, scroll states, new monogram, 5-item nav, real CTA, unified mobile nav, Login removed | Highest visibility per unit of effort; touches every page. |
| **3 — Hero** | `CodeEditor` component, instant left column, asymmetric layout, remove auto-scroll and shimmer | The 8-second toll gate is the biggest single UX defect. |
| **4 — Imagery** | `SectionBackdrop` component + placement across Career, Projects, GitHub, Contact | Depends on Phase 0's image pipeline and Phase 1's tokens. |
| **5 — Case studies** | Kill `ProjectSiteEmbed`, `ProjectCaseStudy` template, collapse 36 components, restructure content, screenshots throughout | Largest content effort, highest conversion payoff. |
| **6 — Sections** | Career timeline, bento featured grid, GitHub restyle, Contact rebuild, footer, CV download | Polish once the system is proven. |
| **7 — Verify** | Lighthouse (mobile + desktop), axe-core audit, real-device check on mid-range Android, contrast re-measure, bundle analysis | Glass effects specifically need real-device validation, not desktop Chrome. |

---

## 6. Success criteria

| Metric | Now | Target |
|---|---|---|
| Initial JS (gzipped) | ~1.6 MB raw, single chunk | **< 200 KB** |
| CSS (gzipped) | 145 KB single file | **< 40 KB** route-split |
| First Contentful Paint (mobile) | 3–5s | **< 1.2s** |
| Time to meaningful hero content | ~8s | **< 1.5s** |
| Lighthouse Performance (mobile) | untested, low | **≥ 90** |
| Lighthouse Accessibility | contrast failures present | **100** |
| Image payload | 47 MB PNG | **< 5 MB** WebP/AVIF |
| Contrast failures | 3 tokens | **0** |
| Nav items | 7 flat, admin CTA | **5 + real CTA** |
| Project components | 36 bespoke | **1 template + data** |
| Broken iframes on case studies | present | **0** |

---

## 7. CV cross-reference — content the site is missing

Reviewed against `Humza Butt CV - General 2026.pdf`. The CV is materially stronger than the site. Every item below is real, verifiable and currently absent from humza-butt.space.

### 7.1 The big one — Tier 1 client work is nowhere on the site

> *"Configured enterprise GRC and reporting platforms for Tier 1 clients including **Shell, the BBC, the NHS and the Home Office**"* — Configuration Analyst & Web Developer, CoreStream GRC, Jul–Dec 2025

**This is the single strongest credibility signal you have, and the site does not mention it once.** Named enterprise clients are exactly what separates the strong portfolios in the reference list from the other 1,600 — Brittany Chiang leads with Klaviyo, Apple and Upstatement. Four recognisable UK institutions beat any amount of "passionate about clean code".

It also fixes a real gap: everything currently on your site is self-founded (Bgr8, TheraBot, Breathapplyser). That reads as *builds own things*. Shell/BBC/NHS/Home Office reads as *trusted in enterprise delivery*. For contract work specifically, that is the difference.

**Action:** CoreStream becomes a first-class Career entry with the client names surfaced as logos or a labelled row. Add "Enterprise clients" to the hero stat strip.

### 7.2 Quantified outcomes the site omits

| From the CV | Currently on site |
|---|---|
| **95% match accuracy in production** (Bgr8 weighted matching algorithm) | "intelligent mentor-mentee matching" |
| **7 production SaaS tools**, **sub-second global load times** (LifeSmart) | "Maintain production software each month" |
| **Server-authoritative state** real-time multiplayer, PartyKit (imposter-game) | "Party games, live scoreboards" |
| Owned backend end to end: Node, PostgreSQL, Docker, CI/CD (Breathapplyser) | "Modern breathalyzer app with advanced tracking" |
| **BSc Computer Science, 1st Class Honours** | Only the MEng is listed |

The site consistently describes *what a thing is*; the CV states *what it achieved*. Case study copy should move to the CV's register throughout.

### 7.3 The stack list on the site is out of date

`pages/About.js` currently advertises:

```js
frontend: ['React.js', 'Vue.js', 'Angular', 'Ember.js', 'Next.js', 'Nuxt.js']
```

**Ember.js and Angular are not on your CV.** Listing six frontend frameworks including a 2011-era one reads as padding, and it's the fastest way to look dated to a senior reviewer. The CV's list is tighter, more current and more credible — use it verbatim:

```
Frontend    TypeScript · JavaScript · React · React Native · Vue · Vite · Tailwind
Backend     Node.js · Express · Hono · Python · Flask · C# · REST APIs
Data        PostgreSQL · SQL · SQLite · Firebase/Firestore · ETL pipelines
Cloud       AWS · Azure · Cloudflare Workers · Docker · CI/CD · GitHub Actions
Practices   Agile/Scrum · unit & integration testing · code review · documentation
```

### 7.4 Positioning — rewrite the top line

Site says **"Full Stack Software Developer"**. CV says **"Software Engineer, Full Stack & Platform Configuration"**. The CV title is better — "Engineer" over "Developer", and "Platform Configuration" is the differentiator that carries the enterprise work.

Hero copy should become something like:

> **Humza Butt** — Software Engineer, Full Stack & Platform Configuration
> I build SaaS platforms, APIs and real-time systems — and configure enterprise platforms for Shell, the BBC, the NHS and the Home Office.
> **Available for contract work.**

The availability pill reads **"Available for contract"**, not "Available for work" — it filters out full-time approaches rather than inviting them.

### 7.5 Two discrepancies to reconcile before launch

1. **"7 years 11 months experience"** appears on the live Career section, but the earliest role on your CV is **Jun 2023** — about three years. The LinkedIn figure presumably includes non-software work. As it stands, a reviewer who compares your site to your CV finds a four-year gap, and that costs more than the bigger number gains. Either scope it (`3 yrs commercial software · 8 yrs working`) or drop it and lead with `29 shipped · 6 surfaces · 4 Tier 1 clients`.
2. **Role dates differ.** Site: *LifeSmart — Software Maintainer, Jun 2026 – Present*. CV: *LifeSmart — Full Stack Software Engineer, Mar 2024 – Present*. Site: *Bgr8 — Technology Lead*. CV: *Bgr8 — Lead Full Stack Engineer & Tech Founder*. **`config/linkedin.json` should be regenerated from the CV** so there is exactly one source of truth. The CV titles are stronger in every case.

### 7.6 CV download

The PDF becomes `public/Humza-Butt-CV.pdf`, linked from the header CTA area, the Contact page and the footer, with a tracked download event through your existing analytics. Add `?v=2026-08` to the filename or query so it cache-busts when you update it.
