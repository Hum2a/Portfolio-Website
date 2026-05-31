# Portfolio entry brief — prompt for external Cursor agents

Copy everything below the horizontal rule into another project’s chat when you want that codebase’s agent to produce a **Portfolio Entry Brief**: a single document with all facts, URLs, and assets needed to add this project to Humza’s portfolio site.

---

## Instructions for the agent (paste from here)

You are helping prepare a **Portfolio Entry Brief** for a separate repository: a React portfolio that lists projects from `src/config/projects.json` and gives each project its own route and detail page.

Your job in **this** repository is to **discover and write down** everything below. Do **not** assume the reader has access to this repo—include paths here only as hints for where you found information.

Produce **one Markdown document** with these sections and headings (use exactly these `##` titles so the portfolio maintainer can skim):

### 1. Project identity

- **Working title** (display name as it should appear publicly).
- **`id`**: a short **lowercase slug** for URLs and config (e.g. `my-app`, `tools/brute-forcer` only if the portfolio route should be nested—prefer a single segment like `myapp` unless there is a strong reason).
- **One-line description** (~140 characters): what it is and who it’s for; suitable for a card listing.
- **Longer summary** (2–4 sentences): problem, approach, outcome—suitable for a project detail page intro.

### 2. Links and deployment

- **Production URL** (canonical live site).
- **Staging / preview URLs** if any (Vercel preview, Workers preview, etc.).
- **Repository URL** (GitHub/GitLab) if public or shareable.
- **Embed policy**: Should this URL work inside an `<iframe>` on another origin? (Many apps send `X-Frame-Options` or CSP `frame-ancestors` and **cannot** be embedded—say so explicitly.)
- **Any API base URLs** only if they are public and relevant to describing the product.

### 3. Tech stack and tooling

List **concrete versions** where easy to find (from `package.json`, lockfiles, Gradle, `pubspec.yaml`, etc.):

- Languages and frameworks (e.g. Next.js App Router, Flutter, Django).
- Runtime / hosting (Node version, Cloudflare Workers, Docker, etc.).
- Data layer (Postgres, SQLite, Firebase, etc.).
- Auth / payments / email / analytics if used.
- Testing (Vitest, Playwright, pytest) and CI (GitHub Actions, etc.).

Also note **monorepo vs single package**, and **main entry points** (e.g. `apps/web`, `src/app`).

### 4. Features (portfolio-ready)

Bullet list of **8–15 user-visible or technical features** suitable for a “Features” section—mix product capabilities and notable engineering choices (performance, security, offline, PWA, realtime, etc.).

### 5. Tech stack badges (for filtering)

Provide **15–35 short tags** (single words or short phrases like existing portfolio tags: `Next.js`, `TypeScript`, `Tailwind CSS`, `PostgreSQL`, `SaaS`, `WebApp`). Prefer **reusing common names** over obscure abbreviations. Include domain tags where relevant (`FinTech`, `EdTech`, `Game`, etc.).

### 6. Visual branding

- **Primary colors** (hex if known—brand palette or dominant UI colors).
- **Suggested CSS `linear-gradient`** for a card background (e.g. `linear-gradient(135deg, #hex1 0%, #hex2 50%, #hex3 100%)`)—three stops are enough.
- **Logo**: Path to the best existing logo/icon in this repo **or** describe what to export (SVG preferred; PNG acceptable). Dimensions/aspect ratio if odd.

### 7. Media assets for the portfolio

List files that could be copied into the portfolio’s `public/` tree:

- Logo path(s) in this repo.
- Optional screenshots: paths + **one-line caption** each (hero, dashboard, mobile, etc.).
- Note **licensing** if any asset is not owned by the project author.

### 8. Detail page content hooks

Every portfolio project page is rendered through a shared `<ProjectLayout>` component that takes the content below as **props**. Draft each as copy-pasteable text:

- **`title`** — display name shown as the page `<h1>`.
- **`terminalLines`** — array of short strings (4–8 lines) summarizing the project for the animated faux terminal in the header. Optionally note a custom `terminalPrompt` (default `>`), `terminalSpeed` (default `35`), or `terminalTitle` (default `project.js`) if the project warrants a shell-style look (e.g. `$` prompt, `deploy.sh` title).
- **`codeSnippet`** — a **code-shaped “Project Information” blurb** (object-literal style: name, type, description, stack array, features array) rendered in a syntax-highlighted block. Draft the literal as copy-pasteable text.
- **`features`** — array of short strings → rendered as a “Features” list.
- **`techStack`** — array of short strings → rendered as the tech-badge grid.
- **`images`** / **`videos`** — arrays of `{ src, alt/caption }` → rendered as galleries with a lightbox modal. List candidate media paths.

If the project needs bespoke interactivity (version switcher, sub-project selector, custom embed lifecycle, etc.), note it here—on the portfolio side that lives in the `children` slot of `<ProjectLayout>` rather than a standard prop.

### 9. Live demo section

`<ProjectLayout>` renders an embedded live site when given an `embedUrl`. State clearly:

- **Recommended primary CTA**: “Visit site” link only, vs **embedded iframe** (`embedUrl` + `embedTitle`) of the production URL.
- If iframe is **not** viable, say why (security headers, login wall, heavy WebGL, etc.)—in that case the page should use a plain link in `children` instead of `embedUrl`.
- Any **sandbox** needs (maps to the `embedSandbox` prop) or quirks if embedding were attempted (`allow-scripts`, auth cookies, etc.), plus a suggested `embedNewTabLabel` if the default “Open in new tab →” doesn’t fit.

### 10. Visibility and ordering hints

- Should this appear on the **main projects grid** immediately? (`visible: true/false`)
- Should it be **featured** on the homepage carousel? (`featured: true/false`)—justify in one sentence.
- **Priority** suggestion (`1` = highest band used in the portfolio—lower numbers surface first among peers).

### 11. JSON snippet for `projects.json`

Close with a **single fenced `json` block** containing one object the portfolio could merge into its `projects` array. Use this shape (omit or adjust fields only if unknown—then say “UNKNOWN” in prose above, not inside JSON):

```json
{
  "id": "slug-here",
  "name": "Display Name",
  "description": "One-line card description.",
  "logo": "FileName.png",
  "gradient": "linear-gradient(135deg, #color1 0%, #color2 50%, #color3 100%)",
  "route": "/slug-here",
  "tags": ["Tag1", "Tag2"],
  "visible": true,
  "featured": false,
  "priority": 2
}
```

**Rules for this snippet:** `route` must start with `/` and match how the portfolio route will be registered; `logo` is **filename only** (assets live under `public/logos/` in the portfolio). Align `id` with the slug in `route` when possible.

### 12. Open questions

Bullet list of anything you could not verify from this repo (exact deploy URL, private env vars, iframe embeddability, logo ownership, etc.).

---

**How to execute:** Search the codebase and config files; read README; infer deployment from CI workflow names and host hints; if multiple environments exist, prefer **production** facts. Be factual—flag uncertainty instead of guessing deploy URLs or versions.

---

## Maintainer note (Humza — do not paste this block to external agents)

Adding an entry in this portfolio typically involves:

| Area | Location |
|------|----------|
| Listing metadata | `src/config/projects.json` |
| Project page component | `src/projects/<Name>.js` — renders a single `<ProjectLayout>` (from `src/components/projects/ProjectLayout.js`) and passes content as props |
| Styles | `src/projects/<Name>.css` (co-located; only needed for per-project overrides—`ProjectLayout.css` already pulls in `project-shared.css`). Trivial pages need no CSS file at all. |
| Route | `src/routes/AppRoutes.js` — `<Route path={...} element={<... />} />` |
| Logo file | `public/logos/<filename>` — matches `logo` in JSON |
| Optional images | `public/images/<ProjectFolder>/...` |

Featured projects are driven by `featured` + `visible` in JSON (`src/data/projects.js` reads the file).

**Standard page shape:** most pages are now just `<ProjectLayout title=… terminalLines={…} logo=… codeSnippet={…} features={…} techStack={…} images={…} embedUrl=… />` with no Navbar/Terminal/CodeBlock/framer-motion wiring (the layout owns all of that). Map the brief’s section **8** props straight onto `<ProjectLayout>`. Anything bespoke goes in the `children` slot. For media click-tracking, call `useMediaTracking()` in the page and thread `onClick` handlers through the `images`/`videos` item objects or `children`.

When you receive the brief from another agent, use section **11** as the starting point for `projects.json`, then implement the page and assets using sections **1–10**.
