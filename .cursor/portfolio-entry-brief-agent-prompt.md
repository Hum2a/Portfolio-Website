# Portfolio entry brief — prompt for external Cursor agents

Copy everything below the horizontal rule into another project’s chat when you want that codebase’s agent to produce a **Portfolio Entry Brief**: a single document with all facts, URLs, and assets needed to add this project to Humza’s portfolio site.

The portfolio is a **Vite + React + TypeScript** site. Project listings and case-study pages are **JSON-driven** from `src/config/projects.json`. There is **no per-project React page** and **no per-project route file** to create — merging one complete JSON object plus logo/images is enough.

---

## Instructions for the agent (paste from here)

You are helping prepare a **Portfolio Entry Brief** for a separate repository: a Vite + React + TypeScript portfolio. Every project is a single object in `src/config/projects.json`. The site auto-registers a route from `route` and renders a shared case-study page from the nested `caseStudy` object.

Your job in **this** repository is to **discover and write down** everything below. Do **not** assume the reader has access to this repo—include paths here only as hints for where you found information.

Produce **one Markdown document** with these sections and headings (use exactly these `##` titles so the portfolio maintainer can skim):

### 1. Project identity

- **Working title** (display name as it should appear publicly).
- **`id`**: a short **lowercase slug** for URLs, OG images, and config (e.g. `encore`, `baseer-portfolio`). Prefer a **single path segment**. Nested slugs like `tools/brute-forcer` only if there is a strong reason.
- **One-line description** (~140 characters): what it is and who it’s for; used on project cards and Open Graph.
- **Categories** — one or more of exactly: `website`, `mobile`, `desktop`, `extension`, `library`, `game`. Default to `["website"]` if unsure. A product can have several (e.g. Recount is `["extension", "website"]`).
- **Suggested `dateAdded` / `dateUpdated`** as `YYYY-MM-DD` (ship date vs last meaningful update).

### 2. Links and deployment

- **Production URL** (canonical live site) — maps to `liveUrl`. Omit if there is no public deployment.
- **Staging / preview URLs** if any (Workers preview, etc.) — for the brief only; do not put these in JSON unless they are the canonical URL.
- **Repository URL** (GitHub/GitLab) if public or shareable — maps to `repoUrl`.
- **Embed policy**: Should this URL work inside an `<iframe>` on another origin? Many apps send `X-Frame-Options` or CSP `frame-ancestors` and **cannot** be embedded. Default recommendation for this portfolio is **`embeddable: false`** unless you have verified the live origin allows framing. Say so explicitly.
- **Any API base URLs** only if they are public and relevant to describing the product.

### 3. Tech stack and tooling

List **concrete versions** where easy to find (from `package.json`, lockfiles, Gradle, `pubspec.yaml`, etc.):

- Languages and frameworks (e.g. Next.js App Router, Flutter, Django, Vite + React).
- Runtime / hosting (Node version, Cloudflare Workers, Docker, etc.).
- Data layer (Postgres, Neon, SQLite, Firebase, Supabase, etc.).
- Auth / payments / email / analytics if used.
- Testing (Vitest, Playwright, pytest) and CI (GitHub Actions, etc.).

Also note **monorepo vs single package**, and **main entry points** (e.g. `apps/web`, `src/app`).

### 4. Case-study narrative (portfolio-ready)

Draft copy that maps 1:1 onto the shared case-study page. Be factual; flag uncertainty.

- **`claim`** — one punchy sentence under the title (can match the card description).
- **`role`** — how Humza showed up (e.g. `Sole engineer — puzzle engine, API, web client, and deploy`).
- **`timeline`** — short human string (e.g. `2026 · live at encore.casa` or `Shipped 2023 · Cloudflare API added 2026`).
- **`metrics`** — 1–4 `{ "value", "label" }` pairs for an “At a glance” row. Values can be numbers or short tokens (`PostGIS`, `3`).
- **`problem`** — 1–3 short paragraphs (`\n\n` between). What was broken, for whom, why it mattered.
- **`sections`** — **2–4** “What I built” blocks, each:
  - `title` — short heading
  - `body` — 1–2 paragraphs (`\n\n` between)
  - `image` — portfolio public path to recommend (see §7), usually `/images/<Folder>/hero.png` then `detail.png`
  - `imageAlt` — real alt text, not the filename
- **`decisions`** — **2–4** technical decisions, each `{ "choice", "why", "tradeoff" }`.
- **`outcome`** — 1–2 paragraphs: what shipped, what’s live, what’s still off.

Do **not** draft a faux terminal, `codeSnippet` object literal, or a separate Features list — those are from an older page layout and are no longer rendered.

### 5. Tech stack badges (for filtering)

Provide **12–30 short tags** (single words or short phrases like existing portfolio tags: `Next.js`, `TypeScript`, `Tailwind CSS`, `PostgreSQL`, `SaaS`, `WebApp`). Prefer **reusing common names** over obscure abbreviations. Include domain tags where relevant (`FinTech`, `EdTech`, `Game`, `Geospatial`, etc.).

These become the `tags` array (shown as pills on the case-study hero, max 12 visible) and power the projects-grid tech filter.

### 6. Visual branding

- **Primary colors** (hex if known—brand palette or dominant UI colors).
- **Suggested CSS `linear-gradient`** for a card background (e.g. `linear-gradient(135deg, #hex1 0%, #hex2 50%, #hex3 100%)`)—three stops are enough.
- **Logo**: Path to the best existing logo/icon in this repo **or** describe what to export (SVG preferred; PNG acceptable). Dimensions/aspect ratio if odd.

### 7. Media assets for the portfolio

List files that could be copied into the portfolio’s `public/` tree:

- Logo path(s) in this repo → will be saved as `public/logos/<filename>` (JSON stores **filename only**).
- Screenshots for case-study sections. Preferred convention:
  - Folder: `public/images/<PascalOrProductFolder>/`
  - First section: `hero.png` (also used as the live-site preview fallback)
  - Further sections: `detail.png`, or descriptive names
- One-line caption / `imageAlt` for each.
- Note **licensing** if any asset is not owned by the project author.

Open Graph images (`public/og/<id>.png`) are **generated at portfolio build time** from the project name, description, and a screenshot if present — do not supply a custom OG file unless asked.

### 8. Live demo section

The case-study page shows a “Live site” block when `liveUrl` is set. `ProjectSiteEmbed` **never ships a failing iframe**:

- `embeddable: true` only if you have **verified** the production origin allows framing from another site.
- Otherwise `embeddable: false` (the default): screenshot + “Visit live site →” overlay. First case-study section image is the preview.

State clearly:

- Recommended: screenshot + outbound link vs iframe.
- If iframe is **not** viable, say why (CSP `frame-ancestors`, login wall, heavy WebGL, etc.).
- Any sandbox quirks if embedding were attempted.

If there is **no public URL**, omit `liveUrl` and say so. The live-site block will not render.

### 9. Visibility and ordering hints

- **`visible`**: should this appear on the main projects grid? (`true`/`false`)
- **`featured`**: homepage featured stack? Justify in one sentence. (`true`/`false`)
- **`priority`**: `1` = highest band (surfaces first among peers); `2` next; omit/`99` last.
- **`comingSoon`**: set `true` only when the **case study is published** (`visible: true`, `caseStudy` present) but the **product is not publicly launched** (no end-user deployment). Locked cards are non-clickable; the case-study URL still works. Do **not** infer `comingSoon` from a missing `liveUrl` alone — some shipped work has no public URL. On launch: set `comingSoon` false and add `liveUrl`.

### 10. JSON snippet for `projects.json`

Close with a **single fenced `json` block** containing one object the portfolio could merge into its `projects` array. Use this shape (omit unknown optional fields — then say “UNKNOWN” in prose above, not inside JSON):

```json
{
  "id": "slug-here",
  "name": "Display Name",
  "description": "One-line card description.",
  "logo": "FileName.svg",
  "gradient": "linear-gradient(135deg, #color1 0%, #color2 50%, #color3 100%)",
  "route": "/slug-here",
  "tags": ["TypeScript", "React", "WebApp"],
  "visible": true,
  "featured": false,
  "priority": 2,
  "categories": ["website"],
  "dateAdded": "2026-09-12",
  "dateUpdated": "2026-09-12",
  "embeddable": false,
  "liveUrl": "https://example.com",
  "repoUrl": "https://github.com/Hum2a/example",
  "caseStudy": {
    "claim": "One-sentence product claim.",
    "role": "Sole engineer — …",
    "timeline": "2026 · live at example.com",
    "metrics": [
      { "value": "1", "label": "short metric label" }
    ],
    "problem": "Paragraph one.\n\nOptional paragraph two.",
    "sections": [
      {
        "title": "What shipped first",
        "body": "Paragraph.\n\nOptional second paragraph.",
        "image": "/images/SlugHere/hero.png",
        "imageAlt": "Describe the screenshot."
      },
      {
        "title": "Notable engineering surface",
        "body": "Paragraph.",
        "image": "/images/SlugHere/detail.png",
        "imageAlt": "Describe the screenshot."
      }
    ],
    "decisions": [
      {
        "choice": "Decision title",
        "why": "Why it was chosen.",
        "tradeoff": "What you gave up."
      }
    ],
    "outcome": "What is live, who can use it, what is still off."
  }
}
```

**Rules for this snippet:**

- `route` must start with `/` and should match `id` (`id: "encore"` → `route: "/encore"`).
- `logo` is **filename only** (files live under `public/logos/` in the portfolio).
- `categories` values must be from `website` | `mobile` | `desktop` | `extension` | `library` | `game`.
- Include `comingSoon: true` only when §9 says so; omit the key otherwise.
- Omit `liveUrl` if there is no public site. Omit `repoUrl` if the repo is private/unshareable.
- Keep `embeddable` **false** unless framing is verified.
- `caseStudy.sections[].image` paths are root-relative under `public/` (e.g. `/images/Encore/hero.png`).
- Do not include `terminalLines`, `codeSnippet`, `features`, `techStack`, or `embedUrl` — those are not part of this schema.

### 11. Open questions

Bullet list of anything you could not verify from this repo (exact deploy URL, private env vars, iframe embeddability, logo ownership, Humza’s role wording, etc.).

---

**How to execute:** Search the codebase and config files; read README; infer deployment from CI workflow names and host hints; if multiple environments exist, prefer **production** facts. Be factual—flag uncertainty instead of guessing deploy URLs or versions.

---

## Maintainer note (Humza — do not paste this block to external agents)

Adding an entry in this portfolio is **JSON + assets**. Do not add a page component, CSS file, or `<Route>`.

| Area | Location |
|------|----------|
| Listing + case study | `src/config/projects.json` — merge the brief’s §10 object into `projects` |
| Types / helpers | `src/data/projects.ts` — already typed; no change unless the schema grows |
| Route | Auto from `getProjectRoutePaths()` in `src/routes/AppRoutes.tsx` |
| Case-study UI | `src/pages/ProjectCaseStudyPage.tsx` → `src/components/projects/ProjectCaseStudy.tsx` |
| Logo | `public/logos/<filename>` — matches `logo` in JSON |
| Section images | `public/images/<Folder>/hero.png` (and `detail.png`, …) — matches `caseStudy.sections[].image` |
| OG image | Generated on `npm run og` / `npm run build` into `public/og/<id>.png` |

Featured work is `featured: true` **and** `visible: true`, sorted by `priority` then name (`getFeaturedProjects()`). Coming-soon cards use `comingSoon: true` + `ComingSoonLockedSurface` (see `.cursor/rules/coming-soon-projects.mdc`); case-study URLs stay reachable.

When you receive the brief: drop assets, paste the JSON object, rebuild. Map §4 → `caseStudy`, §5 → `tags`, §8 → `liveUrl` / `embeddable`, §9 → visibility flags.
