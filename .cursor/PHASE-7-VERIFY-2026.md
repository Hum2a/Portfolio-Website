# Phase 7 — Verification report (2026-08-03)

Measurement base: production `vite build` + `vite preview` at `http://127.0.0.1:4173`.  
Notify API: `wrangler dev` at `http://127.0.0.1:8787`.  
Artifacts: `tmp/verify/` (gitignored). Scripts: `npm run verify:*`.

## Summary

| Area | Result |
|------|--------|
| axe-core (42 routes) | **Pass** — 0 violations; mobile nav focus trap OK |
| Contrast (3 audit pairs) | **Pass** |
| Reduced motion / transparency | **Pass** |
| URL crawl (42 paths + `/linkedin` → `/career`) | **Pass** |
| Bundle (Traffic / HumzaLogin / case study absent from entry) | **Pass** |
| Notify Worker contract | **Pass** (test send needs `RESEND_API_KEY`) |
| Throttled scroll (4× CPU + Fast 3G) | **Pass for glass** — header `backdrop-filter: none`; 0 blur nodes; residual long-tasks are JS, not blur |
| Lighthouse mobile Performance ≥ 90 | **Fail** — best home **79**; LCP 4–10s under LH throttle |
| Lighthouse A11y / BP / SEO targets | **Mixed** — many pages A11y 100 / BP ≥ 95; SEO often **92** (SPA client meta); career Perf **0** (NO_LCP / lantern) |

---

## 1. Lighthouse (metric / before / after / target)

Before: audit §6 — Perf “untested/low”, A11y “contrast failures”.

| Metric | Before | After | Target | Pass |
|--------|--------|-------|--------|------|
| `/` mobile Performance | untested/low | 79 | ≥ 90 | No |
| `/` mobile Accessibility | contrast fails | 100 | 100 | Yes |
| `/` mobile Best Practices | n/a | 96 | ≥ 95 | Yes |
| `/` mobile SEO | n/a | 100 | 100 | Yes |
| `/` desktop Performance | n/a | 54 | (track) | — |
| `/` desktop Accessibility | n/a | 97 | 100 | No |
| `/` desktop Best Practices | n/a | 96 | ≥ 95 | Yes |
| `/` desktop SEO | n/a | 100 | 100 | Yes |
| `/projects` mobile Performance | n/a | 66 | ≥ 90 | No |
| `/projects` mobile Accessibility | n/a | 100 | 100 | Yes |
| `/projects` mobile Best Practices | n/a | 100 | ≥ 95 | Yes |
| `/projects` mobile SEO | n/a | 92 | 100 | No |
| `/projects` desktop Performance | n/a | 53 | (track) | — |
| `/projects` desktop Accessibility | n/a | 100 | 100 | Yes |
| `/projects` desktop Best Practices | n/a | 100 | ≥ 95 | Yes |
| `/projects` desktop SEO | n/a | 92 | 100 | No |
| `/about` mobile Performance | n/a | 71 | ≥ 90 | No |
| `/about` mobile Accessibility | n/a | 100 | 100 | Yes |
| `/about` mobile Best Practices | n/a | 93 | ≥ 95 | No |
| `/about` mobile SEO | n/a | 92 | 100 | No |
| `/about` desktop Performance | n/a | 61 | (track) | — |
| `/about` desktop Accessibility | n/a | 100 | 100 | Yes |
| `/about` desktop Best Practices | n/a | 100 | ≥ 95 | Yes |
| `/about` desktop SEO | n/a | 92 | 100 | No |
| `/career` mobile Performance | n/a | 0* | ≥ 90 | No |
| `/career` mobile Accessibility | n/a | 95 | 100 | No |
| `/career` mobile Best Practices | n/a | 96 | ≥ 95 | Yes |
| `/career` mobile SEO | n/a | 100 | 100 | Yes |
| `/career` desktop Performance | n/a | 0* | (track) | — |
| `/career` desktop Accessibility | n/a | 95 | 100 | No |
| `/career` desktop Best Practices | n/a | 96 | ≥ 95 | Yes |
| `/career` desktop SEO | n/a | 100 | 100 | Yes |
| `/contact` mobile Performance | n/a | 72 | ≥ 90 | No |
| `/contact` mobile Accessibility | n/a | 100 | 100 | Yes |
| `/contact` mobile Best Practices | n/a | 100 | ≥ 95 | Yes |
| `/contact` mobile SEO | n/a | 92 | 100 | No |
| `/contact` desktop Performance | n/a | 60 | (track) | — |
| `/contact` desktop Accessibility | n/a | 100 | 100 | Yes |
| `/contact` desktop Best Practices | n/a | 100 | ≥ 95 | Yes |
| `/contact` desktop SEO | n/a | 92 | 100 | No |
| `/bgr8` mobile Performance | n/a | 70 | ≥ 90 | No |
| `/bgr8` mobile Accessibility | n/a | 100 | 100 | Yes |
| `/bgr8` mobile Best Practices | n/a | 100 | ≥ 95 | Yes |
| `/bgr8` mobile SEO | n/a | 92 | 100 | No |
| `/bgr8` desktop Performance | n/a | 60 | (track) | — |
| `/bgr8` desktop Accessibility | n/a | 100 | 100 | Yes |
| `/bgr8` desktop Best Practices | n/a | 100 | ≥ 95 | Yes |
| `/bgr8` desktop SEO | n/a | 92 | 100 | No |

\*Career Perf 0: Lighthouse lantern `NO_LCP` / null LCP under this run (page still renders).

**Perf note:** Mobile LCP under LH simulation is 4.0s (home) to ~10s (projects). Dominant cost is main-thread JS (Firebase + React vendor) on throttled CPU, not backdrop-filter. Closing the ≥90 gap needs further code-splitting / deferred analytics / SSR or prerender — out of band for token/a11y fixes done here.

**SEO 92:** Typical SPA gap — `react-helmet-async` meta is not in the first HTML response LH crawls.

---

## 2. axe-core

| Metric | Before | After | Target | Pass |
|--------|--------|-------|--------|------|
| Violations (all routes) | unknown | **0** | 0 | Yes |
| Mobile nav focus trap | n/a | Focus stays in nav | Trap OK | Yes |
| Case study lightbox | n/a | Opener below fold (skipped in auto); Dialog uses `sr-only` title | Manual OK | Partial |

Fixes landed this phase: footer underline, opaque surfaces, tertiary/secondary token sync (`colors.css` no longer overrides globals), login restyle, GitHub select name + language chips, Projects search `Input` (removed cmdk aria bug), hidden project routes resolve when `caseStudy` exists, code gutter opacity removed.

---

## 3. Contrast (rendered)

| Metric | Before | After | Target | Pass |
|--------|--------|-------|--------|------|
| `--text-tertiary` on `--bg-primary` | 3.93:1 | **8.92:1** | ≥ 4.5:1 | Yes |
| `--text-tertiary` on card / surface-2 | 3.34:1 | **6.51:1** | ≥ 4.5:1 | Yes |
| CTA `--text-on-accent` on `--accent` | 3.07:1 | **6.77:1** | ≥ 4.5:1 | Yes |

Token after: `--text-tertiary: #a8b2c7`, `--text-secondary: #b4bccf`; surfaces use solid `--bg-secondary` / `--bg-tertiary`.

---

## 4. Bundle

| Metric | Before | After | Target | Pass |
|--------|--------|-------|--------|------|
| Traffic in initial graph | n/a | Separate lazy chunk | Absent from entry | Yes |
| HumzaLogin in initial graph | n/a | `HumzaLogin-*.js` lazy | Absent from entry | Yes |
| Case study page in initial graph | n/a | `ProjectCaseStudyPage-*.js` lazy | Absent from entry | Yes |
| Main static `recharts` import | fixed in Phase 6 | **false** | false | Yes |
| Visualizer | n/a | `tmp/verify/stats.html` + `stats.json` | Present | Yes |

---

## 5–6. Prefs

| Metric | Before | After | Target | Pass |
|--------|--------|-------|--------|------|
| `prefers-reduced-motion: reduce` | missing historically | 0 running animations; editor content present; `#main-content` present | Usable, no motion | Yes |
| `prefers-reduced-transparency: reduce` | added Phase 1 | `.surface-3` → `backdrop-filter: none`, solid `rgb(37,43,71)` | Solid fallback | Yes |

---

## 7. Throttled scroll (4× CPU + Fast 3G)

| Metric | Before | After | Target | Pass |
|--------|--------|-------|--------|------|
| Header backdrop-filter | risk | **none** (scrolled + clear) | No blur jank from header | Yes |
| Blur node count (home / bgr8) | n/a | **0 / 0** | Prefer 0 under throttle | Yes |
| Long-task max (home) | n/a | 355ms | Watch JS jank | Note — not blur |

Remediation rule satisfied without further blur removal (header already solid translucent / no filter).

---

## 8. URL crawl

| Metric | Before | After | Target | Pass |
|--------|--------|-------|--------|------|
| Public + project routes | n/a | **42/42** OK | All resolve | Yes |
| `/linkedin` → `/career` | n/a | Final URL `/career` | Redirect | Yes |
| Hidden projects (`/ministryofjustice`, `/doppelgancar`, `/tindev`) | 404 when `visible:false` | Serve case study if `caseStudy` present | Pre-existing URLs work | Yes |

---

## 9. Firebase / Traffic / notify

| Metric | Before | After | Target | Pass |
|--------|--------|-------|--------|------|
| Notify OPTIONS | n/a | 204 | 204 | Yes |
| Notify no auth | n/a | 401 | 401 | Yes |
| Notify bad body | n/a | 400 | 400 | Yes |
| Notify localhost skip | n/a | 200 skipped | skip | Yes |
| Notify test email | n/a | 500 Missing `RESEND_API_KEY` | 200 when key set | Config gap |
| `/humza-login` + `/traffic` gate | n/a | Pages load (login chrome restyled) | Auth E2E | Manual — needs real Google session |
| Tracking tokens UI | n/a | Code path unchanged; not logged-in exercised | E2E | Manual |

---

## Fixes applied during Phase 7

- Verify tooling: `lighthouse`, `playwright`, `@axe-core/playwright`, `rollup-plugin-visualizer`, `scripts/verify/*`, `VERIFY_BUNDLE=1` build
- A11y/contrast CSS: footer links, surfaces, text tokens, HumzaLogin, GitHub, About, CodeEditor gutter, ProjectCaseStudy metrics
- Routing: invisible projects with `caseStudy` no longer hard-404
- Landmark: `#main-content` on `.app-main`
- `colors.css` stopped overriding globals tertiary/secondary

## Follow-ups (LH targets)

1. ~~Defer Firebase analytics until after first paint / idle.~~ Done 2026-08-03 (`App` + `PageTimeTracker` idle dynamic import).
2. ~~Prerender or inject critical meta description for SEO 100 on first HTML.~~ Done via `npm run shells` post-build.
3. ~~Career stable LCP element.~~ Loading state now renders an `h1` immediately (no opacity-0 wrapper). Re-run LH when convenient.
4. Paste a valid `RESEND_API_KEY` into `.dev.vars` / Worker (see `.cursor/OPS-TRAFFIC-NOTIFY-2026.md`) and re-run Traffic test email.
5. Manual login as `humza` → `/traffic` filters + token create + notify UI.
