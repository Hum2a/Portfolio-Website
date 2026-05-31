# Codebase Audit — Portfolio

> Read-only audit. No source files were modified to produce this document.
> Generated for the repository at `e:\Humza\Programming\portfolio`.

---

## Table of contents

1. [Project overview](#1-project-overview)
2. [Full directory tree](#2-full-directory-tree)
3. [Component inventory](#3-component-inventory)
4. [Routing structure](#4-routing-structure)
5. [State management](#5-state-management)
6. [Styling approach](#6-styling-approach)
7. [Assets inventory](#7-assets-inventory)
8. [Dead code / unused files](#8-dead-code--unused-files)
9. [Anti-patterns / structural issues](#9-anti-patterns--structural-issues)
10. [Dependencies](#10-dependencies)

---

## 1. Project overview

**What it is:** A personal developer portfolio single-page application. It presents a homepage, an About page, a Projects listing, individual project case-study pages (~24 projects), a Contact form, a live GitHub activity page, and a private, role-gated **analytics dashboard** (`/traffic`) that visualizes first-party traffic data collected by the site itself.

**Framework / stack:**

| Layer | Technology |
|------|-----------|
| UI framework | React 19 |
| Tooling / build | Create React App (`react-scripts` 5.0.1) |
| Routing | `react-router-dom` v7 (`BrowserRouter`) |
| Animation | `framer-motion` (page transitions, scroll-in effects) |
| Charts | `recharts` (Traffic dashboard) |
| Icons | `react-icons` |
| Backend / data | Firebase (Firestore for analytics + enquiries, Firebase Auth for admin login) |
| Auxiliary | `crypto-js` (IP hashing), `uuid` (visitor/session IDs), `react-ga4` (legacy GA4 — effectively unwired), `web-vitals` |
| Hosting / deploy | Cloudflare Workers via `wrangler` (`build/` served as SPA); Firestore rules via `firebase` CLI |

**Entry point chain:**

```
public/index.html  (HTML shell, #root)
  └── src/index.js          → ReactDOM.createRoot, <React.StrictMode>, reportWebVitals()
        └── src/App.js       → <Router><AuthProvider> + PageTimeTracker + AppRoutes; calls firebaseAnalytics.initAnalytics()
              └── src/routes/AppRoutes.js  → <Routes> with framer-motion page transitions
```

**Data model:** Analytics are written client-side to Firestore collections (`analytics_visitors`, `analytics_pageviews`, `analytics_events`, `analytics_page_times`, `analytics_media_clicks`, `analytics_ref_hits`, `analytics_stats`, `enquiries`) and read back by the Traffic dashboard. Firestore rules (`firestore.rules`) are currently **fully open** (`allow read, write: if true`).

---

## 2. Full directory tree

> `node_modules/`, `.git/`, `build/`, and `.wrangler/` are omitted. One-line annotations describe each file's role.

```
portfolio/
├── .cursorignore                       # Excludes deps/build/assets/secrets from Cursor indexing
├── .env / .env.example / .env.production  # Firebase + ipinfo env vars (REACT_APP_*)
├── .gitignore                          # Standard CRA + wrangler ignores
├── .hintrc                             # webhint linter config
├── CHANGELOG.md                        # Auto-generated release changelog
├── PROJECT_MANAGEMENT.md               # Project notes
├── PROJECT_PAGES_UPDATE.md             # Project notes
├── REDESIGN_COMPLETE.md                # Redesign notes
├── REDESIGN_ROADMAP.md                 # Redesign notes
├── REDESIGN_SUMMARY.md                 # Redesign notes
├── README.md                           # Project readme
├── firebase.json                       # Firebase config → points to firestore.rules only
├── firestore.rules                     # OPEN Firestore security rules (read/write: true)
├── package.json                        # Dependencies, scripts (start/build/deploy/preview)
├── package-lock.json                   # npm lockfile
├── release.sh                          # Bash semver tag manager + changelog automation
├── wrangler.jsonc                      # Cloudflare Workers deploy config (serves build/ as SPA)
│
├── .cursor/                            # Cursor-only project docs (not shipped)
│   ├── firebase-setup-notes.md
│   ├── firestore-rules-maintenance.md
│   ├── firestore-schema.md             # Documents analytics_* collection schema
│   ├── portfolio-entry-brief-agent-prompt.md
│   └── utm-tracking-guide.md
│
├── scripts/
│   └── update_changelog.py             # Parses git commits → categorized CHANGELOG.md entries
│
├── public/                             # Static assets (CRA public/, 226 files) — see §7
│   ├── index.html                      # HTML shell + meta/OG/favicons
│   ├── manifest.json / site.webmanifest# PWA manifests
│   ├── robots.txt, sitemap*.xml        # SEO / crawler files
│   ├── BingSiteAuth.xml, google*.html  # Search-console verification
│   ├── favicon*, *-chrome-*.png, apple-touch-icon.png  # Icons
│   ├── .well-known/security.txt        # Security contact
│   ├── images/                         # 158 project screenshots (per-project subfolders)
│   ├── logos/                          # 25 project/site logos (PNG/SVG)
│   └── videos/                         # 27 project demo videos (per-project subfolders)
│
└── src/
    ├── index.js                        # React entry; mounts <App/>, reportWebVitals
    ├── index.css                       # Imports theme system (themes/index.css)
    ├── App.js                          # Root: Router + AuthProvider + trackers + AppRoutes
    ├── App.css                         # .App wrapper styling
    ├── App.test.js                     # Default CRA smoke test
    ├── setupTests.js                   # jest-dom setup (CRA default)
    ├── reportWebVitals.js              # CRA web-vitals reporter (uses deprecated getCLS/getFID API)
    │
    ├── routes/
    │   └── AppRoutes.js                # All <Route> definitions + page transition wrapper
    │
    ├── contexts/
    │   └── AuthContext.js              # AuthProvider + useAuth (Firebase user + role)
    │
    ├── hooks/
    │   └── useMediaTracking.js         # Hook → firebaseAnalytics.trackMediaClick for project media
    │
    ├── config/
    │   └── projects.json               # Canonical project catalog (24 entries)
    │
    ├── data/
    │   └── projects.js                 # Loads projects.json; adds getters/filters/category meta
    │
    ├── services/                       # Firebase + external integrations
    │   ├── firebase.js                 # Firebase app init; exports auth + db
    │   ├── firebaseAnalytics.js        # ★ ACTIVE analytics (Firestore visitors/sessions/events)
    │   ├── analyticsStatsUpdater.js    # Increment/merge analytics_stats rollup docs
    │   ├── analyticsAdminService.js    # Owner tags + bulk delete analytics by IP (Traffic admin)
    │   ├── trackingTokenService.js     # Ref/UTM tokens, attribution cookie, ref-hit records
    │   ├── authService.js              # Google sign-in/out, user docs, roles
    │   ├── githubService.js            # GitHub REST/GraphQL with localStorage caching
    │   └── setupFirestoreAnalytics.js  # One-shot rollup seed script — NO IMPORTERS (dead)
    │
    ├── utils/
    │   ├── env.js                      # REACT_APP_* env helpers, firebaseConfig, featureFlags
    │   ├── analyticsPaths.js           # Exclude /traffic from analytics; admin-path filtering
    │   ├── trafficSignals.js           # Bot/VPN/hosting/timezone heuristics + badges
    │   ├── analytics.js                # LEGACY GA4 (react-ga4) helpers — unwired (see §8)
    │   └── firebaseAnalytics.js        # LEGACY Realtime-DB tracker — NO IMPORTERS (dead)
    │
    ├── components/                     # Shared UI + tracking components
    │   ├── Navbar.js                   # Top nav (+ conditional Traffic link for humza role)
    │   ├── HamburgerMenu.js            # Mobile menu dropdown
    │   ├── ProtectedRoute.js           # Auth/role gate → redirects to /humza-login
    │   ├── PageTimeTracker.js          # Invisible page-view + time-on-page tracker (mounted)
    │   ├── ScrollTracker.js            # Scroll-depth tracker — imported but NOT rendered (dead)
    │   ├── TimeTracker.js              # Engagement timer — imported but NOT rendered (dead)
    │   ├── CookieConsent.js            # Cookie banner — NO IMPORTERS (dead)
    │   ├── EnhancedCookieConsent.js    # Enhanced banner — commented out in App.js (dead)
    │   ├── EnhancedCookieConsent.css   # Co-located CSS for the above
    │   ├── ContactForm.js              # Stub contact form — NO IMPORTERS (dead)
    │   ├── DownloadButton.js           # Tracked download link — NO IMPORTERS (dead)
    │   ├── TrackedLink.js              # Tracked anchor — NO IMPORTERS (dead)
    │   ├── VisibilityTracker.js        # Viewport-tracking HOC — NO IMPORTERS (dead)
    │   ├── ErrorBoundary.js            # Class error boundary — NO IMPORTERS (dead)
    │   ├── navigation.js               # Legacy route table — superseded by AppRoutes (dead)
    │   ├── HomepageFeaturedProjects.js # Homepage "selected work" bento grid
    │   ├── GitHubSection.js            # Homepage GitHub profile/repos section
    │   ├── ContributionCalendar.js     # GitHub-style contribution heatmap (/github)
    │   ├── ProjectSiteEmbed.js         # Lazy iframe embed for live project demos
    │   └── animations/
    │       ├── Typewriter.js / .css    # Typing animation
    │       ├── Terminal.js / .css      # Mac-style terminal hero (uses Typewriter)
    │       └── CodeBlock.js / .css     # Code display + copy button
    │
    ├── pages/                          # Top-level routed pages
    │   ├── Homepage.js                 # Landing hero + featured projects + GitHub section
    │   ├── Projects.js                 # Filterable project grid (category + tag chips)
    │   ├── About.js                    # Bio + skills code block + project spotlights
    │   ├── Contact.js                  # Social links + Firestore enquiry form
    │   ├── GitHub.js                   # Full GitHub profile/repos/contributions page
    │   ├── HumzaLogin.js               # Admin Google sign-in (gateway to /traffic)
    │   ├── BakesByOlayide.js           # Project case study (lives in pages/, not projects/)
    │   ├── PrivacyPolicy.js            # Static privacy policy — UNROUTED (orphan, see §8)
    │   └── Traffic/                    # Analytics dashboard module (role-gated /traffic)
    │       ├── index.js                # Route entry: auth gate + Navbar + TrafficProvider
    │       ├── TrafficDashboard.js     # Dashboard layout shell (only consumer of context UI)
    │       ├── TrafficContext.js       # Context provider; delegates to useTrafficData
    │       ├── useTrafficData.js       # ★ Central hook (~1,400 lines) — all dashboard state
    │       ├── loadTrafficData.js      # Firestore fetch layer (8 collections, 800-doc cap)
    │       ├── statsHelpers.js         # Rollup parsing, headline merge, daily series, bounce
    │       ├── refTokenAnalytics.js    # Ref-token drill data + charts (pure functions)
    │       ├── trafficTrends.js        # Week-over-week momentum metrics (pure functions)
    │       ├── constants.js            # Chart color palette
    │       ├── utils.js                # Date/duration/location formatting
    │       ├── TrafficTabContent.js    # Tab router + heavy charts/tables UI
    │       └── components/
    │           ├── TrafficFilters.js       # Environment/admin/bot toggles + date range
    │           ├── TrafficStats.js         # Headline stat cards (incl. countries breakdown)
    │           ├── TrafficTabList.js        # Tab bar with counts
    │           ├── TrafficTrendsContent.js  # Trends tab (WoW KPIs, insights, charts)
    │           ├── UrlGeneratorSection.js    # UTM / ref-link generator
    │           ├── ReferenceCodesList.js     # Tracking-token CRUD table
    │           ├── RefCodeRowDetails.js      # Expanded ref-code analytics + CSV export
    │           ├── RefCodeCompare.js         # Side-by-side ref-code comparison
    │           ├── ClicksDrillThrough.js     # Ref-click modal — NO IMPORTERS (dead)
    │           ├── VisitorDataAdmin.js       # Per-visitor tag/delete + OwnerDevicesPanel
    │           ├── DeviceInfoPanel.js        # Visitor device fingerprint display
    │           └── TrafficSignalsPanel.js    # Bot/VPN signal badges
    │
    ├── projects/                       # Individual project case-study pages (routed)
    │   ├── Bgr8.js                     # Bgr8 mentoring platform
    │   ├── BiasLens.js                 # News-bias analyzer
    │   ├── Breathapplyser.js           # Breathalyser app (serves v1 AND v2 routes)
    │   ├── BreathapplyserV2.js         # Standalone V2 page — UNROUTED (dead, see §8)
    │   ├── BruteForcer.js              # Password entropy tool
    │   ├── Contrarian.js               # Pitch-deck classifier
    │   ├── Culinairy.js                # AI recipe generator (route /culinary)
    │   ├── DadJokeGenerator.js         # Dad joke generator
    │   ├── Doomscroll.js               # Satirical infinite-scroll app
    │   ├── DoppelganCar.js             # AI car-personality matcher
    │   ├── FireWatch.js                # Wildfire intelligence dashboard
    │   ├── Flashcards.js               # Flashcards learning app
    │   ├── Gremlins.js                 # Windows tray companion
    │   ├── Imposter.js                 # Discord/web party game
    │   ├── LiberalDemocrats.js         # LDMF informational site (route /ldmf)
    │   ├── LifeSmart.js                # Multi-tool finance education hub
    │   ├── Mentage.js                  # AI revision chatbot
    │   ├── MinistryOfJustice.js        # MoJ enterprise projects showcase
    │   ├── Monzo1pChallenge.js         # Savings calculator
    │   ├── NetworthTool.js             # Net-worth PWA
    │   ├── PNGtoSVG.js                 # PNG→SVG converter
    │   ├── Recount.js                  # Productivity suite (extension + dashboard)
    │   └── Therabot.js                 # Mental-health chatbot
    │
    └── styles/                         # Global stylesheets (see §6)
        ├── project-shared.css          # Shared layout for project detail pages
        ├── About.css, Contact.css, Homepage.css, HomepageFeaturedProjects.css
        ├── Navbar.css, HamburgerMenu.css, Projects.css, PrivacyPolicy.css
        ├── HumzaLogin.css, GitHubSection.css, GitHubPage.css, Traffic.css (~3,700 lines)
        ├── ProjectSiteEmbed.css, CookieConsent.css, EnhancedCookieConsent.css
        ├── <PerProject>.css            # Bgr8, BiasLens, Breathapplyser, BruteForcer, Contrarian,
        │                               #  Culinairy, DadJokeGenerator, Doomscroll, DoppelganCar,
        │                               #  Flashcards, Gremlins, LiberalDemocrats, LifeSmart,
        │                               #  Mentage, MinistryOfJustice, Monzo1pChallenge,
        │                               #  NetworthTool, PNGtoSVG, Therabot, BakesByOlayide
        └── themes/
            ├── index.css               # Global reset, body, scrollbar, focus, utilities
            ├── colors.css              # Color/shadow/transition CSS variables
            └── typography.css          # Google Fonts + typography scale variables
```

---

## 3. Component inventory

### 3.1 Shared components (`src/components/`)

| Component | Renders | Key imports | Used by |
|----------|---------|-------------|---------|
| `Navbar.js` | Top nav bar; logo, links, conditional Traffic link (`humza` role), login button | `react-router-dom`, `useAuth` | ~31 files (all pages + projects + Traffic) |
| `HamburgerMenu.js` | Mobile dropdown menu | `react-router-dom` Link | ~28 pages/projects |
| `ProtectedRoute.js` | Auth/role gate; redirects to `/humza-login` | `react-router-dom` Navigate, `useAuth` | `AppRoutes.js` (`/traffic`) |
| `PageTimeTracker.js` | `null` — tracks page views + time on route change/unload | `react-router-dom` useLocation, `services/firebaseAnalytics` | `App.js` |
| `HomepageFeaturedProjects.js` | Featured-projects bento grid | `framer-motion`, `react-router-dom`, `data/projects` | `Homepage.js` |
| `GitHubSection.js` | Homepage GitHub avatar/bio/repo cards | `framer-motion`, `react-icons/fa`, `githubService` | `Homepage.js` |
| `ContributionCalendar.js` | GitHub contribution heatmap | `githubService` | `GitHub.js` |
| `ProjectSiteEmbed.js` | Lazy iframe embed for live demos | `framer-motion` useInView | ~18 project pages |
| `animations/Typewriter.js` | Char-by-char typing effect | — | `Homepage.js`, `Terminal.js` |
| `animations/Terminal.js` | Terminal hero typing prompt lines | `./Typewriter` | About, Contact, Homepage, BakesByOlayide, all 23 projects |
| `animations/CodeBlock.js` | Syntax-styled code + copy button | — | About, BakesByOlayide, 23 projects (not Homepage/Contact) |

**Dead/unused shared components** (detailed in §8): `navigation.js`, `ErrorBoundary.js`, `CookieConsent.js`, `EnhancedCookieConsent.js`, `ContactForm.js`, `DownloadButton.js`, `TrackedLink.js`, `VisibilityTracker.js`, `ScrollTracker.js`, `TimeTracker.js`.

### 3.2 Page components (`src/pages/`)

| Page | Renders | Notable imports |
|------|---------|-----------------|
| `Homepage.js` | Hero + typewriter terminal + featured work + GitHub | Navbar, Typewriter, Terminal, HomepageFeaturedProjects, GitHubSection |
| `Projects.js` | Filterable project grid (category + tags) | Navbar, HamburgerMenu, `data/projects` |
| `About.js` | Bio + skills CodeBlock + project spotlights | Navbar, HamburgerMenu, Terminal, CodeBlock |
| `Contact.js` | Social links + Firestore enquiry form | Navbar, HamburgerMenu, Terminal, `firebase/firestore`, `trackContactSubmit` |
| `GitHub.js` | Profile, repos, contribution calendar | Navbar, HamburgerMenu, ContributionCalendar, githubService |
| `HumzaLogin.js` | Google sign-in admin gateway | `signInWithGoogle`, `useAuth` |
| `BakesByOlayide.js` | Project case study (in `pages/`, not `projects/`) | Navbar, HamburgerMenu, Terminal, CodeBlock, ProjectSiteEmbed |
| `PrivacyPolicy.js` | Static privacy policy (**unrouted**) | Navbar |
| `Traffic/index.js` | Role-gated dashboard shell | useAuth, Navbar, TrafficProvider, TrafficDashboard |

### 3.3 Project pages (`src/projects/`)

All 23 project files share a near-identical structure: `Navbar` + `HamburgerMenu` + `Terminal` + `CodeBlock`, with most adding `ProjectSiteEmbed` (live demo) and `useMediaTracking` (media-click analytics), plus `framer-motion`. See the directory tree (§2) for the one-line description of each. Notable variations:

- **No `ProjectSiteEmbed`:** `BruteForcer`, `FireWatch`, `MinistryOfJustice`, `NetworthTool` (use custom embeds or external links).
- **`useMediaTracking` present in 16 of 23** project pages.
- **`BreathapplyserV2.js`** duplicates content already served by `Breathapplyser.js` (which has a built-in v2 toggle) and is **not routed**.

### 3.4 Traffic dashboard components (`src/pages/Traffic/components/`)

| Component | Renders |
|----------|---------|
| `TrafficFilters.js` | Environment filter, admin/bot toggles, date-range controls, owner-devices panel |
| `TrafficStats.js` | Headline stat cards incl. unique-countries breakdown |
| `TrafficTabList.js` | Tab bar with per-tab counts |
| `TrafficTabContent.js` | Active-tab content: charts/tables for each data type (largest UI file) |
| `TrafficTrendsContent.js` | Week-over-week KPIs, insights, path/event charts |
| `UrlGeneratorSection.js` | UTM/ref-link generator with presets |
| `ReferenceCodesList.js` | Tracking-token CRUD table |
| `RefCodeRowDetails.js` | Expanded ref-code analytics + CSV export |
| `RefCodeCompare.js` | Side-by-side comparison of two ref codes |
| `VisitorDataAdmin.js` | Per-visitor tag/delete + `OwnerDevicesPanel` |
| `DeviceInfoPanel.js` | Visitor device fingerprint fields |
| `TrafficSignalsPanel.js` | Bot/VPN/proxy signal badges |
| `ClicksDrillThrough.js` | Ref-click drill modal — **orphaned (no importers)** |

---

## 4. Routing structure

All routing is centralized in `src/routes/AppRoutes.js` using `react-router-dom` v7 `<Routes>`, wrapped in a `framer-motion` `<AnimatePresence>` for page transitions. There is **no 404 / catch-all route**.

| Path | Component | Notes |
|------|-----------|-------|
| `/` | `Homepage` | |
| `/projects` | `Projects` | |
| `/Contact` | `Contact` | **Capitalized** path |
| `/About` | `About` | **Capitalized** path |
| `/github` | `GitHub` | |
| `/humza-login` | `HumzaLogin` | Admin login |
| `/traffic` | `Traffic` | Wrapped in `ProtectedRoute requiredRole="humza"` |
| `/bakesbyolayide` | `BakesByOlayide` | Component lives in `pages/` |
| `/breathapplyser` | `Breathapplyser` | |
| `/breathapplyser-v2` | `Breathapplyser` | Same component as above (not `BreathapplyserV2`) |
| `/biaslens` | `BiasLens` | |
| `/lifesmart` | `LifeSmart` | |
| `/networth-tool` | `NetworthTool` | |
| `/mentage` | `Mentage` | |
| `/therabot` | `Therabot` | |
| `/culinary` | `CulinAIry` (Culinairy.js) | Route spelling differs from file/logo (`CulinAIry`) |
| `/dadjokegenerator` | `DadJokeGenerator` | |
| `/doomscroll` | `DoomScroll` | |
| `/contrarian` | `Contrarian` | |
| `/ldmf` | `LiberalDemocrats` | |
| `/pngtosvg` | `PNGtoSVG` | |
| `/doppelgancar` | `DoppelganCar` | |
| `/bgr8` | `Bgr8` | |
| `/monzo1pchallenge` | `Monzo1pChallenge` | |
| `/recount` | `Recount` | |
| `/imposter` | `Imposter` | |
| `/ministryofjustice` | `MinistryOfJustice` | |
| `/flashcards` | `Flashcards` | |
| `/tools/brute-forcer` | `BruteForcer` | Only nested-style path; differs from flat convention |
| `/gremlins` | `Gremlins` | |
| `/firewatch` | `FireWatch` | |

**Routing observations:**

- **Inconsistent casing:** `/Contact` and `/About` are capitalized while every other route is lowercase. React Router paths are case-sensitive, so `/contact` would 404.
- **Inconsistent path conventions:** most routes are flat single-segment slugs; `/tools/brute-forcer` is the only nested route and the only one using a hyphenated multi-word slug with a sub-path.
- **No fallback route:** unknown paths render nothing (blank), with no 404 page.
- **Two route entries share one component:** `/breathapplyser` and `/breathapplyser-v2` both map to `Breathapplyser`, leaving `BreathapplyserV2.js` unrouted.
- **Double auth enforcement:** `/traffic` is guarded by both `ProtectedRoute` (routing layer) and an in-component `role === 'humza'` check inside `Traffic/index.js`.

---

## 5. State management

**No external state library** (no Redux, Zustand, Jotai, React Query, etc.). State is handled three ways:

### 5.1 Global context — authentication

`src/contexts/AuthContext.js` exposes `AuthProvider` + `useAuth()`. It subscribes to `onAuthStateChange` (from `authService`) and stores `{ user, role, loading }`. Consumed by `Navbar`, `ProtectedRoute`, `HumzaLogin`, and the Traffic module. This is the only app-wide context.

### 5.2 Feature-scoped context — Traffic dashboard

`src/pages/Traffic/TrafficContext.js` is a context whose value is the **entire return object of the `useTrafficData(role)` hook**. `useTraffic()` reads it; components throughout the Traffic module consume slices of it.

`src/pages/Traffic/useTrafficData.js` (~1,400 lines) is the single source of truth for the dashboard and holds **~47 `useState` variables**, grouped as:

- **Raw Firestore data:** `visitors`, `pageViews`, `events`, `pageTimes`, `mediaClicks`, `enquiries`, `refHits`, `stats`, `dataTruncated`, `loading`
- **UI/expansion:** `activeTab`, `expandedVisitors`, `visitorActiveTabs`, `selectedLocation`, `expandedCountries`, `selectedCountry`, `selectedVisitorAnonymizedIP`
- **Filters:** `environmentFilter`, `excludeAdminPaths`, `hideBots`, `dateRange`, `timeRange`
- **URL/ref generator:** `showUrlGenerator`, `urlGeneratorData`, `generatedUrl`, `copiedUrl`, `urlGeneratorMode`, `generatedRefUrl`, `refUrlLoading`, `refUrlError`
- **Tracking tokens:** `trackingTokens`, `trackingTokensLoading`, `trackingTokensError`
- **Sorting:** six `*SortBy` / `*SortDirection` pairs (visitors, pageViews, events, pageTimes, mediaClicks, enquiries)
- **Admin:** `ownerTags`, `deleteAnalyticsLoading`, `adminMessage`

All derived data (filtered/sorted lists, `filteredStats`, chart series, `trafficTrends`, rollups) is computed via `useMemo`/`useCallback` rather than stored. Side effects load data when `role === 'humza'` and fetch owner tags + tracking tokens on mount.

### 5.3 Local component state

Standard `useState`/`useEffect` throughout pages and projects — e.g. `GitHubSection`/`GitHub` (fetch + cache via `githubService`), `Contact` (form fields), project pages (gallery/modal toggles, v1/v2 toggles), and a few Traffic components keeping local UI-only state (`ReferenceCodesList` edit/compare modals, `VisitorDataAdmin` delete confirmation).

### 5.4 Persistence / external state

- `localStorage`: visitor/session IDs, anonymized IP, GitHub API caches, cookie-consent flags.
- `sessionStorage`: landing path, page count, campaign/ref token for the current session.
- Cookies: ref attribution cookie (`trackingTokenService`).
- Firestore: server-side source of truth for analytics, enquiries, users, and tracking tokens.

---

## 6. Styling approach

**Strategy:** Global CSS stylesheets (CRA-style), imported directly into JS components, layered over a CSS-variables theme. **No CSS Modules, no Tailwind, no styled-components / CSS-in-JS library.** `framer-motion` handles animation/layout; `react-icons` provides UI icons. Inline `style={{}}` is used sparingly (~11 files — mostly Traffic charts, the contribution calendar, and `ProtectedRoute`'s loading state).

**Theme system** (CSS custom properties), loaded once via an `@import` chain — not imported from JS:

```
src/index.js → src/index.css → src/styles/themes/index.css
                                   ├── colors.css      (color/shadow/transition vars)
                                   └── typography.css  (Google Fonts: Inter, Fira Code + scale)
```

`themes/index.css` also provides the global reset, body styles, custom scrollbar, focus rings, and utility classes (`.container`, `.sr-only`).

**Project-page pattern:** Most project stylesheets `@import './project-shared.css'` and add overrides; the component imports both `project-shared.css` and its per-project sheet.

**Inventory:** 44 unique CSS files under `src/` — root (`App.css`, `index.css`), 3 theme files, 3 co-located animation CSS files (`src/components/animations/`), and the rest in `src/styles/` (site pages, shared, per-project, and the ~3,700-line `Traffic.css`). The full list is in §2.

**Inconsistencies identified:**

- **Mixed filename casing:** PascalCase page/project sheets (`LifeSmart.css`, `Traffic.css`) vs kebab-case shared/theme files (`project-shared.css`, `themes/colors.css`).
- **Mixed CSS location:** animation CSS is co-located in `components/animations/`; everything else is centralized in `src/styles/` — and `EnhancedCookieConsent.css` exists in *both* the component folder (co-located, imported) and `src/styles/` (orphaned copy).
- **Inconsistent shared-style adoption:** most project pages use `project-shared.css`, but `Breathapplyser.css` and `NetworthTool.css` reimplement layout without importing it; `FireWatch`, `Imposter`, `Recount` have **no** dedicated CSS and rely solely on `project-shared.css`.
- **Hardcoded values vs theme variables:** e.g. `PrivacyPolicy.css` hardcodes colors (`#f5f5f5`) instead of using the theme variables.
- **Two cookie-consent stylesheets** for two competing (and both inactive) components.

---

## 7. Assets inventory

**There is no `src/assets/` folder.** All static assets live in `public/` (CRA convention) — **226 files** total — and are referenced at runtime via `` `${process.env.PUBLIC_URL}/...` `` strings (no bare paths, no `url()` in CSS).

| Location | Count | Contents |
|----------|------:|----------|
| `public/` (root) | 15 | Favicons, PWA icons, `manifest.json`, `site.webmanifest`, `robots.txt`, sitemaps, search-console verification, `index.html` |
| `public/images/` | 158 | Project screenshots, in per-project subfolders (largest: `LifeSmart/` 48, `B8/` 24, `BreathapplyserV2/` 19) |
| `public/logos/` | 25 | Project + site logos (PNG/SVG) |
| `public/videos/` | 27 | Project demo videos, in per-project subfolders |
| `public/.well-known/` | 1 | `security.txt` |

**Reference patterns:**

- **Logos** are driven by data: each entry in `src/config/projects.json` has a `"logo"` filename, resolved as `` `${process.env.PUBLIC_URL}/logos/${project.logo}` `` in `Projects.js` and `HomepageFeaturedProjects.js`. Individual project pages also hardcode the same pattern for hero logos.
- **Screenshots / videos** are referenced from project page JS via `` `${PUBLIC_URL}/images/<Project>/...` `` and `` .../videos/... ``.
- **`react-icons`** supplies UI-chrome icons (separate from the static brand logos).

**Asset issues identified:**

- **Icon path mismatch:** `public/index.html` references some icons under `%PUBLIC_URL%/logos/` that actually live at `public/` root.
- **Missing OG image:** `index.html` references `%PUBLIC_URL%/images/portfolio-preview.jpg`, which was not found on disk.
- **Missing video folders:** `LifeSmart.js` references `/videos/LifeSmart/Quiz/` and `/videos/LifeSmart/Asset Simulation/`, which appear empty/missing.
- **Folder names with spaces / mismatched casing:** e.g. `public/images/Liberal Democrats/`, and `CulinAIry` (folder/logo) vs `/culinary` (route).

---

## 8. Dead code / unused files

Files and exports with no reachable usage in the running app. (Verified by grepping importers across `src/`.)

### 8.1 Fully unreferenced files (no importers anywhere)

| File | Notes |
|------|-------|
| `src/components/navigation.js` | Legacy route table, superseded by `routes/AppRoutes.js` |
| `src/components/ErrorBoundary.js` | Never wired into `index.js`/`App.js` |
| `src/components/CookieConsent.js` (+ `styles/CookieConsent.css`) | Banner never mounted |
| `src/components/ContactForm.js` | Stub; `pages/Contact.js` has its own form |
| `src/components/DownloadButton.js` | Never used |
| `src/components/TrackedLink.js` | Never used |
| `src/components/VisibilityTracker.js` | HOC exported but never applied |
| `src/utils/firebaseAnalytics.js` | Legacy Realtime-DB tracker (duplicate filename of the active service) |
| `src/services/setupFirestoreAnalytics.js` | One-shot seed script; referenced only in `.cursor/firestore-schema.md` |
| `src/pages/PrivacyPolicy.js` (+ `styles/PrivacyPolicy.css`) | Complete page, but no route and no links to it |
| `src/projects/BreathapplyserV2.js` | Unrouted; content duplicated by `Breathapplyser.js` v2 toggle |
| `src/pages/Traffic/components/ClicksDrillThrough.js` | Exported but never imported |
| `src/styles/EnhancedCookieConsent.css` | Orphaned copy (component imports its co-located CSS, and is itself disabled) |

### 8.2 Imported but not rendered (effectively dead)

| File | Notes |
|------|-------|
| `src/components/ScrollTracker.js` | Imported in `App.js` but never placed in JSX |
| `src/components/TimeTracker.js` | Imported in `App.js` but never placed in JSX |
| `src/components/EnhancedCookieConsent.js` | Import is commented out in `App.js` |

### 8.3 Legacy analytics layer (broken import chain)

`src/utils/analytics.js` (GA4 via `react-ga4`) is imported only by the dead components above (`ContactForm`, `DownloadButton`, `ErrorBoundary`, `TrackedLink`, `VisibilityTracker`, `ScrollTracker`, `TimeTracker`). Its initializers `initGA` / `logPageView` are **never called anywhere**, so GA4 is effectively unwired. All live analytics flow through `src/services/firebaseAnalytics.js`.

### 8.4 Unused exports (within otherwise-live files)

- `src/data/projects.js`: `getAllProjects`, `getProjectById`, `getProjectByRoute`, `filterProjectsByTags`, and the default `projectsData` export have no external importers.
- `src/services/authService.js`: `getUserRole`, `isHumza` are used only internally.
- `src/services/firebase.js`: the default `app` export and `auth` export are only used inside `authService`.
- `src/services/firebaseAnalytics.js`: `trackContactFormStart` is exported but never imported.

---

## 9. Anti-patterns / structural issues

Things that currently work but are inefficient, inconsistent, or poorly placed.

1. **Duplicate filename collision — `firebaseAnalytics.js` in two folders.** `src/services/firebaseAnalytics.js` (active, Firestore) vs `src/utils/firebaseAnalytics.js` (dead, Realtime DB). Same name, different implementations — a real footgun for imports and search.

2. **Two parallel analytics systems.** A first-party Firestore system (live) and a GA4 system (`utils/analytics.js`, dead). `ScrollTracker` would even dual-write to both if it were mounted. The codebase should commit to one.

3. **God hook / single-file state store.** `useTrafficData.js` is ~1,400 lines with ~47 `useState` variables and returns ~130 properties through a single context. It is the dominant maintenance surface and would benefit from decomposition (e.g. separate hooks for filters, sorting, ref-tokens, admin actions, or a reducer).

4. **Whole-hook-as-context-value.** `TrafficContext` passes the entire `useTrafficData` return object as its value, so any state change re-renders every consumer. Splitting contexts or memoizing slices would reduce re-renders.

5. **Inconsistent route conventions and casing.** `/About` and `/Contact` are capitalized (case-sensitive 404 risk); `/tools/brute-forcer` is the lone nested/hyphenated route; `/culinary` route vs `CulinAIry` file/logo naming.

6. **No 404 / catch-all route.** Unknown URLs render a blank page.

7. **Highly repetitive project pages.** The 23 `projects/*.js` files repeat near-identical scaffolding (Navbar + HamburgerMenu + Terminal + CodeBlock + gallery + embed). Much of this could be a shared `<ProjectLayout>` driven by `projects.json`, reducing duplication and per-page CSS.

8. **`BakesByOlayide` placed in `pages/` instead of `projects/`.** It is a project case study but lives outside the projects folder, breaking the otherwise-clear pages-vs-projects separation.

9. **Inconsistent shared-style usage.** Most project pages use `project-shared.css`; a few reimplement layout (`Breathapplyser`, `NetworthTool`) or have no CSS at all (`FireWatch`, `Imposter`, `Recount`).

10. **Hardcoded styling values** instead of theme variables in some sheets (e.g. `PrivacyPolicy.css`), undermining the CSS-variable theme system.

11. **Open Firestore security rules.** `firestore.rules` allows unrestricted public read/write (`if true`). Even for "non-sensitive analytics," this permits arbitrary writes/deletes to all collections.

12. **Deprecated web-vitals API.** `reportWebVitals.js` calls `getCLS/getFID/getFCP/getLCP/getTTFB`, which were removed in `web-vitals` v4 (the installed version is `^4.2.4`) in favor of `onCLS/onINP/...`. The dynamic import will resolve to `undefined` functions and silently no-op.

13. **`build` script disables CI checks** (`cross-env CI=false`), which suppresses lint/test failures during production builds — masking warnings.

14. **Asset reference drift.** Missing OG image and missing `LifeSmart` video folders (see §7) will produce broken images/media at runtime.

15. **Numerous root-level docs.** Five redesign/management markdown files (`REDESIGN_*`, `PROJECT_*`) sit at the repo root, mixing working notes with project config.

---

## 10. Dependencies

From `package.json`. "Used for" reflects how each package is actually consumed in this codebase.

### Runtime dependencies

| Package | Version | What it's actually used for |
|---------|---------|------------------------------|
| `react` | ^19.0.0 | Core UI library |
| `react-dom` | ^19.0.0 | DOM renderer (`createRoot` in `index.js`) |
| `react-scripts` | 5.0.1 | CRA build/dev/test tooling (`start`, `build`, `test`) |
| `cra-template` | 1.2.0 | CRA project template — **vestigial**; only needed at project creation, not at runtime |
| `react-router-dom` | ^7.1.1 | All client routing (`BrowserRouter`, `Routes`, `Route`, `Navigate`, `useLocation`, `useNavigate`, `Link`) |
| `framer-motion` | ^11.15.0 | Page transitions (`AnimatePresence`), scroll-in animations (`useInView`), `motion` components across homepage/projects |
| `recharts` | ^3.6.0 | All charts in the Traffic dashboard (line/bar/area series) |
| `react-icons` | ^5.4.0 | UI icons (Font Awesome set) in Traffic, GitHub, Contact, filters |
| `firebase` | ^11.4.0 | Firestore (analytics + enquiries + tokens) and Firebase Auth (admin login). The dead `utils/firebaseAnalytics.js` also pulls in `firebase/database` |
| `crypto-js` | ^4.2.0 | Hashing/anonymizing visitor IPs in `services/firebaseAnalytics.js` (and the dead legacy tracker) |
| `uuid` | ^11.1.0 | Generating visitor/session IDs in analytics |
| `react-ga4` | ^2.1.0 | **Legacy GA4** wrapper in `utils/analytics.js` — imported only by dead components; `initGA` never called. Effectively unused |
| `web-vitals` | ^4.2.4 | Performance metrics via `reportWebVitals.js` — but the code uses the **pre-v4 API** and silently no-ops (see §9.12) |

### Dev dependencies

| Package | Version | What it's used for |
|---------|---------|--------------------|
| `cross-env` | ^10.1.0 | Sets `CI=false` cross-platform in the `build` script |
| `wrangler` | ^4.80.0 | Cloudflare Workers deploy/preview (`deploy`, `preview` scripts; configured by `wrangler.jsonc`) |

### npm scripts (`package.json`)

| Script | Command |
|--------|---------|
| `start` | `react-scripts start` |
| `build` | `cross-env CI=false react-scripts build` |
| `test` | `react-scripts test` |
| `eject` | `react-scripts eject` |
| `deploy` | `npm run build && wrangler deploy` |
| `preview` | `npm run build && wrangler dev` |

### Dependency notes

- **Likely removable:** `react-ga4` (dead GA4 layer) and `cra-template` (creation-time only) — pending a decision to delete the legacy analytics components.
- **Needs attention:** `web-vitals` is installed at v4 but consumed via the v3 API; either update `reportWebVitals.js` or pin the older API.
- **Python tooling** (`scripts/update_changelog.py`, invoked by `release.sh`) is outside the npm dependency graph and requires a local Python 3 interpreter.

---

*End of audit.*
