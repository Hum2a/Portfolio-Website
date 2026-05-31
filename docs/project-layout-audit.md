# Project Page Layout Audit

> Read-only audit of every project case-study page in `src/projects/`, mapping shared
> scaffolding vs per-page variation so a `<ProjectLayout>` component can be designed
> with confidence. **No files were changed.**

## Scope & counts

- **23 project page components** exist in `src/projects/*.js`.
- **24 entries** exist in `src/config/projects.json`. The extra entry is **`tindev`**, which
  has **no page component and no route** (`visible: false`) — it is a catalog-only orphan.
  This is why the project is often described as "24 projects".
- **20 per-project CSS files** + `project-shared.css`. Three pages have **no dedicated CSS**
  and rely solely on `project-shared.css`: **FireWatch, Imposter, Recount**.

The 23 audited pages: `BakesByOlayide, Bgr8, BiasLens, Breathapplyser, BruteForcer, Contrarian,
Culinairy, DadJokeGenerator, Doomscroll, DoppelganCar, FireWatch, Flashcards, Gremlins, Imposter,
LiberalDemocrats, LifeSmart, Mentage, MinistryOfJustice, Monzo1pChallenge, NetworthTool, PNGtoSVG,
Recount, Therabot`.

---

## 1. Shared scaffolding

### 1.1 Components present on (nearly) every page

| Component | Import path | Present on | Notes |
|-----------|-------------|------------|-------|
| `Navbar` | `../components/layout/Navbar` | **23 / 23** | Rendered for desktop |
| `HamburgerMenu` | `../components/layout/HamburgerMenu` | **23 / 23** | Rendered for mobile |
| `Terminal` | `../components/animations/Terminal` | **23 / 23** | Always in header |
| `CodeBlock` | `../components/animations/CodeBlock` | **23 / 23** | Exactly **1 per page** |
| `ProjectSiteEmbed` | `../components/projects/ProjectSiteEmbed` | **18 / 23** | Absent on BruteForcer, Contrarian, FireWatch, MinistryOfJustice, NetworthTool |
| `useMediaTracking` | `../hooks/useMediaTracking` | **14 / 23** | Only pages with galleries/embeds-with-tracking |

The standard "frame" every page uses, verbatim:

```jsx
<div className="project-page">
  {/* desktop */} <Navbar />
  {/* mobile  */} <HamburgerMenu />
  <motion.div className="project-container" /* fade/slide variants */>
    <div className="project-header">
      <motion.img className="project-logo" ... />   {/* Flashcards omits the logo */}
      <h1 className="project-title">...</h1>
      <div className="project-terminal">
        <Terminal ... />
      </div>
    </div>
    <div className="project-content">
      {/* one or more <section className="project-section"> blocks */}
    </div>
  </motion.div>
  {/* optional <div className="modal"> lightbox sibling */}
</div>
```

### 1.2 Imports that are identical everywhere

- `import React, { useState, useEffect } from "react";` — on **all 23** (BruteForcer also adds
  `useRef, useCallback`).
- `import { motion } from "framer-motion";` — on **all 23** (BruteForcer also imports `useInView`).
- The four layout/animation components above.
- `./project-shared.css` is imported by **22 / 23 JS files**. The exception is **`Breathapplyser.js`**,
  which imports only `./Breathapplyser.css` (a full local reimplementation — see §4).
  - Note: `NetworthTool.js` does **not** import `project-shared.css` directly, but its
    `NetworthTool.css` does via `@import`, so the shared styles still apply.

### 1.3 `<Terminal>` props — identical vs varying

| Prop | Value | Varies? |
|------|-------|---------|
| `prompt` | `">"` | Identical on 22; **NetworthTool uses `"$"`** |
| `typingSpeed` | `35` | Identical on 22; **NetworthTool uses `28`** |
| `autoStart` | `true` | Identical (all 23) |
| `className` | `"project-terminal"` | Identical (all 23) |
| `title` | `"project.js"` | Identical on 22; **NetworthTool uses `"networth-tool.sh"`** |
| `lines` | array of strings | **Unique per page** (the main variable — see §2) |

The dominant `lines` convention is a fake JS object literal:
`["const <name> = {", "  name: '...',", "  type: '...',", "  description: '...',", "  url: '...'", "};"]`.
Outliers that break this pattern: **FireWatch** (boot-sequence log lines), **NetworthTool**
(shell commands), **Gremlins** (mixed build/log lines), **Imposter**/**Recount** (object literal
but with `surfaces`/`data` arrays instead of `description`/`url`).

### 1.4 `<CodeBlock>` props — identical vs varying

| Prop | Value | Varies? |
|------|-------|---------|
| `language` | `"javascript"` | Identical (all 23) |
| `showLineNumbers` | `true` | Identical (all 23) |
| `copyable` | `false` | Identical (all 23) |
| `code` | multi-line JS object string | **Unique per page** |

Every page renders **exactly one** CodeBlock containing a `projectInfo`-style object literal string.
Breathapplyser swaps the string when its version toggle changes.

### 1.5 `<ProjectSiteEmbed>` props — identical vs varying

Component signature (`src/components/projects/ProjectSiteEmbed.js`): lazy-loads via
`useInView` (margin `120px`), renders an iframe with `referrerPolicy="no-referrer-when-downgrade"`.

| Prop | Default | Usage |
|------|---------|-------|
| `url` | — (required) | **Unique per page** |
| `iframeTitle` | `"Live site"` | Always passed; **unique per page** |
| `useSandbox` | `false` | Overridden to `true` only on **Gremlins** and **Monzo1pChallenge** |
| `newTabLabel` | `"Open in new tab →"` | Overridden only on **Gremlins** (`"Open gremlins.site in a new tab →"`) |
| `secondaryLinkProps` | `{}` | Passed only on **Gremlins** (adds tracking `onClick`) |

### 1.6 Hooks always called

- `useState` + `useEffect` — all 23 (typically `useEffect(() => window.scrollTo(0,0), [])` and
  modal/version/sub-project state).
- `useMediaTracking()` — only the 14 pages that have clickable galleries or tracked embeds.

### 1.7 The truly universal core (safe to bake into `<ProjectLayout>`)

`.project-page` shell + Navbar/HamburgerMenu + `.project-container` motion wrapper + `.project-header`
(logo, title, `.project-terminal` Terminal) + `.project-content` + a "Project Information" section
containing one CodeBlock. Everything below that is variable.

---

## 2. Per-page variable data

Embed URL column lists the `url` passed to `<ProjectSiteEmbed>` (or notes a custom/absent embed).

| Page | Terminal lines (first / shape) | CodeBlock | Embed | Embed URL | Custom gallery | v1/v2 or sub-project toggle | Video | Unique sections |
|------|-------------------------------|-----------|-------|-----------|----------------|------------------------------|-------|-----------------|
| **BakesByOlayide** | obj literal `const bakesByOlayide` | 1 | ✓ | `https://bakesbyolayide.co.uk` | ✗ | ✗ | ✗ | `engineering-grid` (12 emoji marketing cards) |
| **Bgr8** | obj literal `const bgr8` | 1 | ✓ | `https://bgr8.com` | ✓ (12 imgs, list tiles + modal) | ✗ | ✗ | `business-grid` (6 feature cards); unused `media-controls`/`activeMediaType` |
| **BiasLens** | obj literal `const biaslens` | 1 | ✓ | `https://biaslens.vercel.app` | ✓ (3 imgs + modal) | ✗ | ✗ | none (info → embed → gallery) |
| **Breathapplyser** | obj literal (dynamic by version) | 1 (swaps) | ✓ (v2 only, **2 embeds**) | `https://breathapplyser.online` + `https://download.breathapplyser.online` | ✓ (v2: 18 imgs; legacy: video gallery) | **✓ v2/legacy switcher** | ✓ (legacy: 4 MP4s) | `version-switcher`, dual embeds, `project-links` |
| **BruteForcer** | obj literal `const bruteForcer` | 1 | ✗ (**custom iframe**) | `https://bruteforcer.online/?embed=1` | ✗ | ✗ | ✗ | Bespoke embed lifecycle (lazy, spinner, 28s timeout, error+retry); `tech-stack-grid` |
| **Contrarian** | obj literal `const contrarian` | 1 | ✗ | — | ✓ (2 imgs + 1 video, mixed) | ✗ | ✓ (`OmniWidget.mp4`) | **dual-modal** (separate image/video modal state); no info link/embed |
| **Culinairy** | obj literal `const culinary` | 1 | ✓ | `https://culinairy-239n.onrender.com` | ✓ (8 imgs + modal) | ✗ | ✗ | none |
| **DadJokeGenerator** | obj literal `const dadJokeGenerator` | 1 | ✓ | `https://dad-joke-generator-68xz.onrender.com` | ✗ | ✗ | ✓ (`DadJokeDemo.mp4` + modal) | video-click-to-modal |
| **Doomscroll** | obj literal `const doomscroll` | 1 | ✓ | `https://infinite-useless-scroll.onrender.com` | ✗ | ✗ | ✓ (`Doomscroll Demo.mp4` + modal) | none (mirrors DadJoke) |
| **DoppelganCar** | obj literal `const doppelganCar` | 1 | ✓ | `https://doppelgang-car.vercel.app` | ✓ (4 imgs + modal) | ✗ | ✗ | none |
| **FireWatch** | **boot-sequence log lines** | 1 | ✗ | — (GitHub link only) | ✗ | ✗ | ✗ | Overview/Features/Tech Stack text-only; `tech-stack-grid` **unstyled** (no page CSS) |
| **Flashcards** | obj literal `const flashcards` | 1 | ✓ | `https://flashcards-pj01.onrender.com` | ✗ | ✗ | ✗ | **In-page 3D flip-card demo** (5 hardcoded cards, prev/next); header has **no logo** |
| **Gremlins** | mixed build/log lines | 1 | ✓ (sandbox) | `https://gremlins.site` | ✓ (5 imgs + modal) | ✗ | ✗ | "Try it" install guidance; `inline-site-link`; sandboxed embed w/ custom labels |
| **Imposter** | obj literal w/ `surfaces[]` | 1 | ✓ | `https://imposter-game.site` | ✗ | ✗ | ✗ | Overview prose; no gallery; **no dedicated CSS** |
| **LiberalDemocrats** | obj literal `const liberalDemocrats` | 1 | ✓ | `https://ldmf.onrender.com` | ✓ (12 imgs + modal) | ✗ | ✗ | none (no Features/Tech) |
| **LifeSmart** | obj literal (suite summary) | 1 | ✓ (**dynamic per sub-project**) | 7 URLs (see §3) | ✓ (per sub-project, image+video) | **✓ 7-sub-project `<select>`** | ✓ (3 MP4s across sub-projects) | Sub-project dropdown; per-tool live preview w/ URL map; conditional `tech-stack-section` |
| **Mentage** | obj literal `const mentage` | 1 | ✓ | `https://mentage.onrender.com` | ✓ (5 imgs + modal) | ✗ | ✗ | none |
| **MinistryOfJustice** | obj literal `const ministryOfJustice` | 1 | ✗ | — | ✓ (per sub-project, 3 imgs each) | **✓ 3-sub-project `<select>`** | ✗ | Sub-project dropdown **without** embed/tech-stack/links |
| **Monzo1pChallenge** | obj literal w/ `features[]` | 1 | ✓ (sandbox) | `https://monzo-1p-challenge-calculator.online` | ✗ | ✗ | ✗ | Features + `tech-stack-grid` from local arrays |
| **NetworthTool** | **shell commands** | 1 | ✗ | — (link-outs) | ✗ | ✗ | ✗ | `networth-live-note`, `networth-link-row` (prod/staging), `networth-deploy-grid` (`<dl>` of 4 endpoints) |
| **PNGtoSVG** | obj literal `const pngToSvg` | 1 | ✓ | `https://pngtosvg-ulmg.onrender.com` | ✓ (1 img, **no modal**) | ✗ | ✗ | single-image "Sample" |
| **Recount** | obj literal w/ `data` field | 1 | ✓ | `https://recount.world` | ✗ | ✗ | ✗ | "Links" row: external + disabled "Chrome Web Store (coming soon)" button; `tech-stack-grid` **unstyled** |
| **Therabot** | obj literal `const therabot` | 1 | ✓ | `https://therabot-site.onrender.com` | ✓ (10 imgs + modal) | ✗ | ✗ | Features section is **static markup** (3 bullets, not array-mapped) |

### Exact Terminal `lines` for the structural outliers

**FireWatch** (boot log, not an object literal):
```
"booting firewatch stack...",
"loading wildfire perimeters into postgis...",
"serving angular ops dashboard on /map",
"running geodesic proximity query (radius: 1000m)",
"highlighting at-risk polygons in real time",
"syncing watch zones and alert rules"
```

**NetworthTool** (shell session, `prompt="$"`, `title="networth-tool.sh"`):
```
"git clone lifesmartfinance/networth-tool",
"npm ci && npm run check",
"> typecheck · lint · vitest (@networth/api + workspaces)",
"npm run dev",
"  web → :5173   api → wrangler dev",
"open https://networthtool.lifesmartfinance.com"
```

**Gremlins** (mixed build/log lines, last line interpolates `GREMLINS_SITE_URL`):
```
"dotnet publish -r win-x64 --self-contained",
"tray: listening · hooks: opt-in only",
"gremlin: TheTypist · severity: Annoying",
"settings → %APPDATA%\\Gremlins\\",
"panic: ALL SILENCED",
"vite build && wrangler deploy",
`url: '${GREMLINS_SITE_URL}'`   // → "url: 'https://gremlins.site'"
```

---

## 3. `ProjectSiteEmbed` usage detail

18 pages use the shared `<ProjectSiteEmbed>`. BruteForcer rolls its own iframe; FireWatch,
Contrarian, MinistryOfJustice, NetworthTool have no embed.

| Page | `url` | `iframeTitle` | Extra props | `useMediaTracking` alongside? |
|------|-------|---------------|-------------|-------------------------------|
| BakesByOlayide | `https://bakesbyolayide.co.uk` | `"BakesByOlayide"` | defaults | ✗ |
| Bgr8 | `https://bgr8.com` | `"Bgr8"` | defaults | ✓ (on gallery, not embed) |
| BiasLens | `https://biaslens.vercel.app` | `"BiasLens"` | defaults | ✓ (gallery) |
| Breathapplyser (v2) #1 | `https://breathapplyser.online` | `"Breathapplyser web app"` | defaults | ✓ (gallery) |
| Breathapplyser (v2) #2 | `https://download.breathapplyser.online` | `"Breathapplyser downloads"` | defaults | ✓ |
| Culinairy | `https://culinairy-239n.onrender.com` | `"CulinAIry"` | defaults | ✓ (gallery) |
| DadJokeGenerator | `https://dad-joke-generator-68xz.onrender.com` | `"Dad Joke Generator"` | defaults | ✓ (video) |
| Doomscroll | `https://infinite-useless-scroll.onrender.com` | `"DoomScroll"` | defaults | ✓ (video) |
| DoppelganCar | `https://doppelgang-car.vercel.app` | `"Doppelgan-Car"` | defaults | ✓ (gallery) |
| Flashcards | `https://flashcards-pj01.onrender.com` | `"Flashcards"` | defaults | ✗ |
| **Gremlins** | `https://gremlins.site` | `"Gremlins marketing site"` | `useSandbox`, `newTabLabel="Open gremlins.site in a new tab →"`, `secondaryLinkProps={{ onClick: trackMediaClick(...) }}` | ✓ |
| Imposter | `https://imposter-game.site` | `"Imposter — word party game"` | defaults | ✗ |
| LiberalDemocrats | `https://ldmf.onrender.com` | `"LDMF"` | defaults | ✓ (gallery) |
| **LifeSmart** | `{toolLiveUrl}` (dynamic, see below) | ``LifeSmart — ${selectedProject.title}`` | defaults; separate `external-link-button` above embed | ✓ |
| Mentage | `https://mentage.onrender.com` | `"Mentage"` | defaults | ✓ (gallery) |
| **Monzo1pChallenge** | `https://monzo-1p-challenge-calculator.online` | `"Monzo 1p Challenge Calculator"` | `useSandbox` | ✗ |
| PNGtoSVG | `https://pngtosvg-ulmg.onrender.com` | `"PNG to SVG"` | defaults | ✓ (gallery) |
| Recount | `https://recount.world` | `"Recount web app"` | defaults | ✗ |
| Therabot | `https://therabot-site.onrender.com` | `"Therabot"` | defaults | ✓ (gallery) |

**LifeSmart dynamic embed** — `url={LIFESMART_TOOL_URLS[selectedProject.id] ?? LIFESMART_HUB_URL}`:

| Sub-project id | URL |
|----------------|-----|
| `spzero` | `https://spzero.lifesmartfinance.com` |
| `spzero-calculator` | `https://investing-tool.lifesmartfinance.com` |
| `misc` | `https://home.lifesmartfinance.com` |
| `financial-quiz` | `https://financial-quiz.lifesmartfinance.com` |
| `asset-market-simulation` | `https://home.lifesmartfinance.com` |
| `budget-tool` | `https://lifebalance.lifesmartfinance.com` |
| `investment-calculator` | `https://investing-tool.lifesmartfinance.com` |
| fallback hub | `https://home.lifesmartfinance.com` |

**BruteForcer custom iframe** (not `ProjectSiteEmbed`): `src="https://bruteforcer.online/?embed=1"`
(retry appends `&v=${retryKey}`), `title="Brute-forcer: password strength and entropy analyzer"`,
`className="brute-forcer-iframe"`, `loading="lazy"`, `onLoad`/`onError` handlers,
`referrerPolicy="strict-origin-when-cross-origin"`, gated by its own `useInView`, with loading
overlay / 28s timeout / error `role="alert"` / **Retry embed** button.

**NetworthTool (no embed by design)**: links out to prod `https://networthtool.lifesmartfinance.com`,
staging `https://networthtool-staging.lifesmartfinance.com`, API prod `https://api-networthtool.lifesmartfinance.com`,
API staging `https://api-networthtool-staging.lifesmartfinance.com`.

---

## 4. Per-project CSS audit

`project-shared.css` (335 lines) is the structural base. Categorising each page's CSS:

### 4.1 Trivial / empty (import + comment only, ~5 lines) — 10 files

`BiasLens.css`, `Contrarian.css`, `Culinairy.css`, `DadJokeGenerator.css`, `Doomscroll.css`,
`DoppelganCar.css`, `LiberalDemocrats.css`, `Mentage.css`, `PNGtoSVG.css`, `Therabot.css`.

These only `@import './project-shared.css'`; all layout/gallery/modal styling comes from the shared
sheet. → **Fully shared layout; nothing to preserve.**

### 4.2 No dedicated CSS file — 3 pages

`FireWatch`, `Imposter`, `Recount` import only `project-shared.css`.
⚠ **Styling gaps**: FireWatch and Recount use `.tech-stack-grid` / `.tech-badge`, which are **not
defined in `project-shared.css`** and have no page CSS — those grids render unstyled. (Recount-specific
`.recount-links-row` / `.recount-store-soon` *are* defined inside the shared file.)

### 4.3 Minor overrides on top of shared base — several

| File | ~Lines | What it adds |
|------|--------|--------------|
| `BakesByOlayide.css` | 55 | `.engineering-grid` / `.engineering-card` auto-fill grid + hover |
| `Bgr8.css` | 127 | `.business-grid`/`.business-card`, media caption stack, **unused** `.media-controls` |
| `Gremlins.css` | 14 | `.inline-site-link` hover only |
| `LifeSmart.css` | 65 | `.tech-stack-section/-title/-grid/-badge/-icon/-name` + mobile |
| `Monzo1pChallenge.css` | 56 | `.external-link-button--secondary`, full `.tech-stack-grid`/`.tech-badge` |
| `NetworthTool.css` | 101 | `.networth-live-note`, `.networth-deploy-grid`, `.networth-link-row`, teal accents, dup `.tech-stack-grid` |
| `MinistryOfJustice.css` | ~5 | trivial (selector/gallery all shared) |
| `Flashcards.css` | 129 | **bespoke 3D flip-card UI** (perspective, `preserve-3d`, `rotateY(180deg)`, controls) |
| `BruteForcer.css` | 151 | bespoke embed card: tall iframe `min(720px,88vh)`, loading overlay, spinner, error/deferred placeholders, `.tech-stack-grid` |

### 4.4 Full reimplementation (does NOT import shared) — 1 file

**`Breathapplyser.css` (~357 lines)** re-declares the entire page shell locally (`.project-page`,
sections, modal, `.version-switcher`, `.project-links`, `.features-list`, `.video-gallery`). This page
is the single biggest outlier — it does not participate in the shared CSS system at all.

### 4.5 Layout patterns that must survive as `<ProjectLayout>` slots

- **Tech-stack grid** (`.tech-stack-grid` / `.tech-badge`) — used by 5+ pages but currently
  **duplicated across per-project CSS** and **missing from the shared sheet**. Prime candidate to
  hoist into the layout/shared CSS.
- **Sub-project selector** (`.project-selector` / `.project-dropdown`) — LifeSmart & MoJ.
- **Version switcher** (`.version-switcher`) — Breathapplyser only.
- **Media grids + modal lightbox** (`.image-gallery` / `.video-gallery` / `.project-media`, `.modal*`)
  — already shared; needs to support image + video items.
- **Bespoke card grids** (`.engineering-grid`, `.business-grid`) — page-specific marketing layouts.
- **Embed card with loading/error lifecycle** — BruteForcer's custom version is richer than
  `ProjectSiteEmbed`.

---

## 5. `projects.json` coverage

Every entry has the **same 13 fields**; there are **no presentational fields** in the JSON.

**Present in JSON (catalog/listing layer):** `id`, `name`, `description`, `logo`, `gradient`,
`route`, `tags`, `visible`, `featured`, `priority`, `categories`, `dateAdded`, `dateUpdated`.

These drive the Projects grid / homepage only. Detail pages largely **do not read JSON** — they even
hardcode their own logo path and `<h1>` title rather than pulling from `name`/`logo`.

### What §2 variable data already exists vs must be added

| §2 data slot | In JSON today? | Where it lives now |
|--------------|----------------|--------------------|
| Title | ✓ `name` (but re-hardcoded in JSX) | JSX `<h1>` + CodeBlock string |
| Short description | ✓ `description` (listing only) | JSX |
| Logo | ✓ `logo` (listing only) | JSX hardcodes path |
| Tags (coarse) | ✓ `tags` | JSX `techStack` arrays are separate/richer |
| Route / visibility / featuring | ✓ | `src/data/projects.js` |
| **Terminal lines** | ✗ | `<Terminal lines={[…]}>` hardcoded |
| **CodeBlock snippet** | ✗ | `projectInfo` template string hardcoded |
| **Embed / live URL** | ✗ | `const *_URL` + `<ProjectSiteEmbed>` |
| **External links (GitHub/store/download)** | ✗ | hardcoded `<a className="external-link-button">` |
| **Feature bullet list** | ✗ | local `features` arrays |
| **Detailed tech stack** | ✗ | local `techStack` arrays |
| **Image gallery list** | ✗ | local `images`/`media` arrays |
| **Video list** | ✗ | local `media`/`legacyVideos` arrays |
| **Sub-project selector data** | ✗ | local `projects` arrays (LifeSmart, MoJ) |
| **Version switcher data** | ✗ | local React state (Breathapplyser) |

**Conclusion:** To make `<ProjectLayout>` data-driven, the JSON (or a sibling content file per
project) would need new fields such as:
`terminalLines[]`, `terminalOptions{prompt,typingSpeed,title}`, `codeSnippet`, `embed{url,title,sandbox}`,
`links[]`, `features[]`, `techStack[]`, `media[]` (`{type, src, caption}`), `subProjects[]`, `versions[]`.

---

## 6. Outliers (hardest to fold into a shared layout)

Ranked by difficulty:

1. **Breathapplyser** — *(hardest)* has a **v2/legacy version switcher** that swaps the title,
   Terminal lines, CodeBlock, embeds (2 in v2, 0 in legacy), and the entire content branch (image
   gallery vs video gallery). It is also the **only page that doesn't use `project-shared.css`** —
   a full 357-line local reimplementation. Needs both a "variants" data model and CSS reconciliation.

2. **LifeSmart** — **7-sub-project `<select>`** driving a *dynamic embed URL map*, per-tool
   description/features/optional tech-stack, and per-tool mixed image+video galleries (all re-keyed
   on selection). Requires a nested sub-project data structure and a dynamic embed slot.

3. **MinistryOfJustice** — **3-sub-project `<select>`** but *without* embeds, tech stack, links, or
   live URLs. Same selector pattern as LifeSmart but a leaner shape — the layout must make the
   selector + per-section slots optional.

4. **BruteForcer** — **custom iframe embed lifecycle** (lazy `useInView`, loading overlay, 28s
   timeout, error `role="alert"`, **Retry** button, CSP `frame-ancestors` hint). Richer than
   `ProjectSiteEmbed`; either upgrade the shared embed or expose an embed "render slot".

5. **Flashcards** — **in-page interactive 3D flip-card demo** (5 hardcoded Q&A cards, prev/next
   controls, 500ms animation lock, bespoke ~129-line CSS). Pure custom interactivity that can only
   be a free-form slot. Also the only page with **no logo** in the header.

6. **Contrarian** — **dual-modal pattern**: separate `selectedImage` vs `selectedVideo` state with
   two distinct modals, and a gallery video without controls. Differs from the single-`selectedMedia`
   convention used elsewhere; minimal page (no info link / embed / features).

7. **NetworthTool** — **no embed by design**; instead a `networth-deploy-grid` (`<dl>` of 4
   prod/staging web+API endpoints) and a prod/staging link row, plus a shell-style Terminal
   (`prompt="$"`, custom title/speed). Needs a "deployment endpoints" slot + Terminal option overrides.

8. **Bakes / Bgr8** — bespoke marketing **card grids** (`engineering-grid`, `business-grid`) that are
   neither features lists nor galleries. Expressible as a generic "card grid" slot, but distinct from
   the standard patterns. Bgr8 also ships dead `media-controls` CSS / `activeMediaType` state.

**Styling-gap flags (not layout outliers, but worth noting):** FireWatch and Recount render
`.tech-stack-grid` with no governing CSS (not in shared sheet, no page CSS) — fold the tech-stack
grid into the shared/layout styles when building `<ProjectLayout>`.

**Comfortably standard (drop-in for a data-driven layout):** BiasLens, Culinairy, DadJokeGenerator,
Doomscroll, DoppelganCar, LiberalDemocrats, Mentage, PNGtoSVG, Therabot, Imposter, Gremlins (with a
sandbox/labels-configurable embed), Monzo1pChallenge, BakesByOlayide (aside from its card grid).
