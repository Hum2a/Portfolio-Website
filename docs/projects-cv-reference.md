# Humza Butt — Projects Reference for CV & Cover Letter Tailoring

> **Purpose:** Feed this document to a ChatGPT project (or similar) when tailoring CVs and cover letters for job applications. It contains every project in Humza's portfolio with what each does, technologies covered, live links, and guidance on when to highlight each one.

---

## Developer Profile (Quick Context)

| Field | Detail |
|-------|--------|
| **Name** | Humza Butt |
| **Role** | Full Stack Software Developer |
| **Focus** | Building technology that improves lives — spanning FinTech, EdTech, HealthTech, SaaS, games, desktop, and mobile |
| **Education** | University of Portsmouth |
| **Leadership** | Social Secretary for Japanese & Self Defence Societies; nominated for "Most Improved Society of the Year" |

### Core Technical Strengths (Across Portfolio)

| Area | Technologies & Patterns |
|------|-------------------------|
| **Frontend** | React (19), Next.js (14–16), TypeScript, Vue.js, Angular (21), Ember.js, Nuxt.js, Tailwind CSS, Vite, PWA, Framer Motion |
| **Mobile** | Flutter, React Native, Android (Kotlin/Java), iOS (Swift/Objective-C) |
| **Desktop** | C# / .NET 8, WPF, Win32, Windows tray apps, Microsoft Store / MSIX |
| **Backend** | Node.js, Express, Hono, Python (Flask, Django), Cloudflare Workers |
| **Databases** | PostgreSQL, PostGIS, Neon, Supabase, Firebase/Firestore, Drizzle ORM, Prisma |
| **Auth** | Auth.js, Better Auth, Supabase Auth, magic links, OAuth (Google, Discord), RLS |
| **Payments & Email** | Stripe (checkout + webhooks), Resend |
| **AI / ML** | OpenAI API, NLP, sentiment analysis, AI report generation |
| **Realtime** | WebSockets, PartyKit, Firebase Realtime Database |
| **Geospatial** | OpenLayers, PostGIS, ST_DWithin geography queries |
| **DevOps** | Cloudflare Workers/Pages/Containers, Docker, GitHub Actions, Render, Vercel, Wrangler, OpenNext |
| **Testing** | Vitest, Playwright, Supertest, xUnit |
| **Extensions** | Chrome Manifest V3 |

---

## How to Use This Document for Job Applications

1. **Match by domain tag** — Each project has industry tags (FinTech, EdTech, HealthTech, etc.). Prioritise projects in the same domain as the job.
2. **Match by tech stack** — If the job asks for Next.js + PostgreSQL + Stripe, lead with Monzo 1p Challenge, Recount, or Networth Tool.
3. **Match by seniority signals** — Enterprise/client work (LifeSmart/SPZeroFinance, Ministry of Justice, Bgr8) vs. indie/SaaS (Recount, Imposter, Gremlins) vs. learning projects (Flashcards, Dad Joke Generator).
4. **Featured projects** are the strongest portfolio highlights — use these first unless the role needs a niche match.
5. **Quantify where possible** — Bgr8's 70+ matching criteria, LifeSmart's 4 learning modules, Gremlins' self-contained .NET publish, FireWatch's metre-accurate geodesic queries.
6. **Cover letter angle** — Pick 2–3 projects that mirror the employer's product type, stack, or mission. Explain *your contribution* and *engineering decisions*, not just what the app does.

### Featured Projects (Highest CV Priority)

Monzo 1p Challenge · Brute-forcer · Gremlins · FireWatch · Recount · Imposter · Breathapplyser · LifeSmart · Bgr8 · BakesByOlayide · BiasLens

### Hidden / Lower-Priority for Public CV (still valid for niche roles)

Ministry of Justice · Doppelgan-Car · Tindev

---

## Complete Project Breakdown (24 Projects)

---

### 1. Monzo 1p Challenge Calculator

| | |
|---|---|
| **Type** | FinTech web app + PWA |
| **What it does** | Savings calculator inspired by Monzo's 1p challenge — users save incrementally (1p day 1, 2p day 2, etc.). Three modes: Next N days, full month, or custom date range. Supports anonymous use or magic-link sign-in to save up to 10 calculator states. Installable PWA. |
| **Live URL** | https://monzo-1p-challenge-calculator.online |
| **Featured** | Yes |
| **Best for roles mentioning** | Next.js, React, TypeScript, FinTech, PWA, auth, PostgreSQL, Cloudflare |

**Technologies:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Radix UI / shadcn, Prisma, Neon PostgreSQL, Auth.js (magic link via Resend), Zod, Cloudflare Workers (OpenNext), Vitest, Playwright, PWA, GitHub Actions CI/CD

**Key features / talking points:**
- Three calculator modes with Monzo-inspired UI
- Anonymous localStorage use + optional magic-link auth (no passwords)
- Save/load up to 10 states per authenticated user
- PWA installable on mobile
- Rate limiting and Zod validation on API routes
- Deployed to Cloudflare Workers with 3 MiB bundle constraint

---

### 2. Brute-forcer

| | |
|---|---|
| **Type** | Privacy-focused security web tool |
| **What it does** | Password entropy and crack-time estimator. All calculations run client-side in the browser — no passwords are sent to any server. Users configure charset pools and guesses/sec to see search space, entropy, and estimated crack time with plain-language explanations. |
| **Live URL** | https://bruteforcer.online |
| **Featured** | Yes |
| **Best for roles mentioning** | Security, privacy, Next.js, TypeScript, Cloudflare, client-side computation |

**Technologies:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Cloudflare Workers (OpenNext)

**Key features / talking points:**
- 100% client-side math — no password storage or transmission
- Configurable guesses per second and character sets
- Strength labels and accessible explanations
- Embeddable live demo with lazy-loaded iframe
- Privacy-by-design architecture

---

### 3. Gremlins

| | |
|---|---|
| **Type** | Windows desktop app + marketing website |
| **What it does** | Playful Windows system-tray companion that runs configurable "gremlins" — small disruptive behaviours (e.g. prank cursor movements, sounds) with severity levels, quiet hours, idle boost, fullscreen pause, and instant panic mode. Local-first: settings stored in JSON, no data uploaded. Ships as self-contained .exe, Inno Setup installer, and Microsoft Store MSIX. |
| **Live URL** | https://gremlins.site (marketing site; desktop app via GitHub Releases / Store) |
| **Featured** | Yes |
| **Best for roles mentioning** | C#, .NET, WPF, Windows desktop, Win32, React, product engineering, Microsoft Store |

**Technologies:** C# / .NET 8, WPF, WinForms interop, Win32 P/Invoke, CommunityToolkit.Mvvm, NAudio, Inno Setup, MSIX, React 19, TypeScript, Vite 7, Cloudflare Workers, xUnit, GitHub Actions

**Key features / talking points:**
- Tray-first UX with per-gremlin severity (Mischievous → Annoying → Unhinged)
- Scheduling guardrails: quiet hours, idle boost, pause during fullscreen
- Panic mode silences everything instantly
- Win32 hooks only for user-enabled tricks — opt-in by design
- Self-contained win-x64 publish (no separate .NET runtime for end users)
- Microsoft Store packaging pipeline
- Marketing SPA on Cloudflare Workers

---

### 4. FireWatch — Fire Intelligence Dashboard

| | |
|---|---|
| **Type** | Full-stack geospatial web application |
| **What it does** | Map-first wildfire intelligence dashboard for analysts. Interactive perimeter maps with metre-accurate geodesic proximity checks (default 1 km), timeline scrub/playback, watch zones, alert-rule simulation, analytics charts (FWI, country spread, severity), and exportable incident briefs. |
| **Live URL** | No public deployment confirmed — GitHub: https://github.com/Hum2a/fire-intelligence-dashboard |
| **Featured** | Yes |
| **Best for roles mentioning** | Angular, geospatial, PostGIS, OpenLayers, GIS, data visualisation, Docker, enterprise dashboards |

**Technologies:** Angular 21, TypeScript, OpenLayers, Node.js, Express, Zod, PostgreSQL 16 + PostGIS, Cloudflare Workers + Containers, Docker Compose, Vitest, Supertest, Playwright, GitHub Actions

**Key features / talking points:**
- Server-side geodesic proximity via `ST_DWithin` geography (metre-accurate, not planar approximation)
- Timeline scrubber with autoplay for perimeter progression
- Watch-zone workflows and local alert simulation
- Analytics + data table with reverse geocoding and snapshot export
- Dockerised Angular frontend + Express/PostGIS backend

---

### 5. Recount

| | |
|---|---|
| **Type** | SaaS productivity suite (Chrome extension + web app + API) |
| **What it does** | Passive time-tracking product. Chrome MV3 extension aggregates active tab time by domain and batches events to a backend. Next.js web app provides marketing, authenticated dashboard (intentions, history, reports, settings), and staff admin. REST API on Express + Cloudflare Worker (Hono) with Supabase, Stripe licensing, optional AI daily reports, and Resend email digests. |
| **Live URL** | https://recount.world |
| **Featured** | Yes |
| **Best for roles mentioning** | SaaS, Chrome extensions, Next.js, Supabase, Stripe, monorepo, productivity, OpenAI integration |

**Technologies:** Next.js 14, React, TypeScript, Tailwind CSS, Chrome Extension MV3, esbuild, Express 4, Hono (Cloudflare Workers), Supabase (Auth, Postgres, RLS), Stripe, OpenAI, Resend, Zustand, Recharts, Framer Motion, Vitest, Supertest, npm workspaces monorepo

**Key features / talking points:**
- Monorepo: extension, web, api, api-worker, shared packages
- Passive domain-level time tracking with batched API events
- Stripe checkout + idempotent webhook processing
- Optional AI-generated daily reports and email digests
- Staff admin roles with elevated analytics
- Shared package for domain classification and app roles

---

### 6. Imposter

| | |
|---|---|
| **Type** | Real-time multiplayer party game (Discord Activity + web/PWA) |
| **What it does** | Word imposter party game — players get a secret word (or a different word if they're the imposter), submit one-word clues across timed rounds, then vote. Ships as a Discord Activity embedded in voice channels and as a standalone web/PWA. One React client, one authoritative PartyKit game server validating every phase, clue, and vote. |
| **Live URL** | https://imposter-game.site |
| **Featured** | Yes |
| **Best for roles mentioning** | Realtime, WebSockets, PartyKit, Discord, games, React, Cloudflare, multiplayer state machines |

**Technologies:** React 19, Vite 8, TypeScript 5.9, Tailwind CSS v4, PartyKit, partysocket, @discord/embedded-app-sdk, Cloudflare Pages + Worker (OAuth proxy), Supabase (optional profiles/history), i18next, Playwright, GitHub Actions

**Key features / talking points:**
- Authoritative server-side game state machine (lobby → clues → voting → reveal)
- Same React app in Discord iframe and browser — shared PartyKit host
- Cloudflare Worker proxies Discord OAuth (client secret never in browser)
- Join hardening: Discord verification, party JWT, rate limits
- Guest play on web; optional cloud profiles with RLS
- Unicode-aware one-word clue validation

---

### 7. Breathapplyser

| | |
|---|---|
| **Type** | Mobile app (Android + iOS) + web app + marketing site |
| **What it does** | Modern breathalyzer / drink-tracking app. Estimates blood alcohol content (BAC) over time, tracks caffeine intake, provides drink presets, social features (friend codes, leaderboards), comprehensive analytics graphs, and PDF health reports. V2 (2026) is a full redesign; legacy version (2024) also documented. |
| **Live URLs** | Web: https://breathapplyser.online · Downloads/stores: https://download.breathapplyser.online · GitHub org: https://github.com/Breathapplyser |
| **Featured** | Yes |
| **Best for roles mentioning** | Mobile (Flutter/React Native), HealthTech, BevTech, analytics, social features, cross-platform |

**Technologies:** Flutter, React Native, Android (Kotlin/Java), iOS (Swift/Objective-C), TypeScript, JavaScript, Node.js, Firebase, NeonDB, PostgreSQL, Google Play, App Store

**Key features / talking points:**
- Real-time BAC estimation with time-based graphs
- Dual tracking: alcohol + caffeine with separate history views
- Drink presets and quick entry modals
- Social: friend codes and competitive leaderboards
- PDF report generation for personal health tracking
- Profile customisation and comprehensive settings
- Published on Google Play and App Store
- Legacy (2024) → Modern (2026) full redesign demonstrates product iteration

---

### 8. LifeSmart (Client: SPZeroFinance)

| | |
|---|---|
| **Type** | Enterprise financial education platform suite |
| **What it does** | Comprehensive financial literacy platform built for SPZeroFinance. Hub at home.lifesmartfinance.com links multiple tools. Main product is **SpZero** — module-based learning with video/slide content, quizzes, progress tracking, and admin analytics. Additional standalone tools cover quizzes, budgeting, market simulation, and investment calculation. |
| **Live URL** | https://home.lifesmartfinance.com |
| **Featured** | Yes |
| **Best for roles mentioning** | EdTech, FinTech, enterprise client work, React, Cloudflare, PostgreSQL, admin dashboards, SSO, content management |

**Technologies:** React + Vite + TypeScript, Tailwind CSS, Hono, Cloudflare Workers/Pages, PostgreSQL + Drizzle ORM, Better-auth, Cloudflare R2, Bunny CDN, Cloudflare AI, Zustand, Recharts, Chart.js, Vue.js, Firebase, NeonDB, Vitest, Playwright, Wrangler

#### Sub-projects within LifeSmart

| Sub-project | URL | What it does |
|-------------|-----|--------------|
| **SpZero — Financial Education Platform** | https://spzero.lifesmartfinance.com | Flagship LMS: 4 modules (Foundations of Money, Personal Finance, Credit & Debt, Investing), video/slide player, quizzes, auto-save progress, admin CMS with drag-and-drop reordering, real-time analytics (engagement heatmaps, user drilldown), SSO with SPZeroFinance, export reports |
| **SpZero Calculator Widget** | https://investing-tool.lifesmartfinance.com | Embeddable iframe widget on SPZeroFinance main site — credit card interest calculator, 0% APR comparison, compound interest projections with Chart.js, dark/light mode |
| **Financial Quiz** | https://financial-quiz.lifesmartfinance.com | Interactive financial literacy quiz with difficulty levels, scoring, scoreboard |
| **Asset Market Simulation** | (via hub) | Stock market scenario simulator for teaching investment strategies — portfolio management, realistic conditions |
| **Budget Planning Tool** | https://lifebalance.lifesmartfinance.com | Step-by-step budget builder (income → needs → wants → savings) with 6-month projection and Excel export |
| **Investment Calculator** | https://investing-tool.lifesmartfinance.com | Future-value investment calculator with data-driven projections |

**Key features / talking points (suite-level):**
- Enterprise client delivery for SPZeroFinance
- Module-based learning with R2-hosted media and progress persistence
- Admin dashboard: user management, content CRUD, analytics drilldown, exports
- SSO integration with parent organisation
- Multiple deployable tools sharing auth/design language
- Real-time analytics with Recharts visualisations

---

### 9. Networth Tool

| | |
|---|---|
| **Type** | Consumer FinTech PWA (LifeSmart Finance product) |
| **What it does** | Mobile-first PWA for net worth tracking, financial onboarding, learning paths, analytics, badges, and phased monetisation. Users track assets/debts/snapshots/goals, complete lessons, and can upgrade via access codes or Stripe checkout. Admin dashboard for users, content, codes, and revenue. |
| **Live URLs** | Production: https://networthtool.lifesmartfinance.com · Staging: https://networthtool-staging.lifesmartfinance.com · API: https://api-networthtool.lifesmartfinance.com |
| **Featured** | No (but strong FinTech signal) |
| **Best for roles mentioning** | PWA, FinTech, B2C, Stripe, Better Auth, Neon, Drizzle, RLS, Cloudflare Workers monorepo |

**Technologies:** React 19, Vite 8, TypeScript, Tailwind CSS v4, Radix/shadcn, Hono, Cloudflare Workers, Neon PostgreSQL, Drizzle ORM, Better Auth (email + Google OAuth), Stripe, Resend, Workbox PWA, Vitest, Playwright, GitHub Actions, npm workspaces (apps/web, apps/api, packages/db)

**Key features / talking points:**
- Installable PWA with offline-friendly static caching
- Net worth domain: assets, debts, snapshots, goals
- Learning paths with lesson player + admin content tooling
- Access codes and Stripe checkout/webhooks
- Row-level security + encryption helpers for PII
- Dual staging/production Workers hostnames

---

### 10. Bgr8

| | |
|---|---|
| **Type** | Mentoring & community platform (EdTech / SocialTech) |
| **What it does** | Comprehensive mentoring platform with proprietary MentorAlgorithm matching mentors to mentees across 70+ weighted criteria (skills, experience, availability, location, compatibility). Includes real-time messaging, Cal.com calendar integration, mentor verification workflow, admin analytics, RBAC, email templates, and enquiry management. |
| **Live URL** | https://bgr8.com |
| **Featured** | Yes |
| **Best for roles mentioning** | React, TypeScript, Firebase, matching algorithms, admin dashboards, RBAC, real-time messaging, EdTech |

**Technologies:** React 18.2, TypeScript 5.7, Firebase 11.3 (Firestore, Realtime Database, Cloud Functions), Vite 6.1, Cal.com API, Chart.js, Recharts, Framer Motion, React Email

**Key features / talking points:**
- Proprietary MentorAlgorithm with 70+ weighted matching criteria
- Real-time messaging with read receipts, typing indicators, file attachments
- Cal.com integration for booking and availability
- Multi-stage mentor verification workflow (state machine pattern)
- Admin: analytics dashboard, DB query terminal, user management, RBAC, email drafter, announcement banners
- Multi-layered security: CSP headers, XSS protection, rate limiting
- A/B testing on homepage CTAs

---

### 11. BakesByOlayide

| | |
|---|---|
| **Type** | E-commerce web application (FoodTech) |
| **What it does** | E-commerce platform for a bespoke bakery — custom cake ordering, product catalog, secure Stripe payments, order management, and user accounts. Built with strong frontend engineering: custom carousel, CSS Grid/Flexbox architecture, accessibility, and mobile-first design. |
| **Live URL** | https://bakesbyolayide.co.uk |
| **Featured** | Yes |
| **Best for roles mentioning** | React, e-commerce, Stripe, Firebase, accessibility, CSS architecture, client websites |

**Technologies:** React.js, JavaScript, Node.js, Firebase, Stripe

**Key features / talking points:**
- Custom hardware-accelerated touch-friendly carousel
- Stripe payment integration
- Mobile-first responsive design with ARIA accessibility
- Error boundaries, loading states, modular component architecture
- Real client business (not just a demo)

---

### 12. BiasLens

| | |
|---|---|
| **Type** | Media analysis web application (MediaTech) |
| **What it does** | Political alignment analyser for web articles and news sources. Aggregates news, analyses articles for political bias and sentiment using NLP techniques. Helps users understand media slant. |
| **Live URL** | https://biaslens.vercel.app |
| **Featured** | Yes |
| **Best for roles mentioning** | NLP, Python, Next.js, Django, sentiment analysis, media tech, full-stack |

**Technologies:** Next.js, JavaScript, Node.js, Python, Django, Firebase, Vercel

**Key features / talking points:**
- News source aggregation and article analysis
- Political bias detection and sentiment scoring
- NLP pipeline (Python/Django backend + Next.js frontend)
- Deployed on Vercel

---

### 13. Ministry of Justice *(hidden on portfolio)*

| | |
|---|---|
| **Type** | Enterprise web applications (public sector) |
| **What it does** | Digital transformation initiatives for the UK justice system. Three sub-systems: Case Management (secure documentation, real-time status, court scheduling integration), Court Scheduling (automated scheduling, conflict detection, resource allocation), and Legal Research Portal (case law search, citation management, research analytics). |
| **Live URL** | Not publicly listed |
| **Featured** | No (hidden) |
| **Best for roles mentioning** | Public sector, enterprise, React, Node.js, Firebase, government, legal tech |

**Technologies:** React.js, Node.js, Firebase, Render

**Sub-projects:**
- **Case Management System** — secure case docs, real-time updates, document management, access controls
- **Court Scheduling System** — automated scheduling, conflict detection, calendar integration, notifications
- **Legal Research Portal** — advanced search, case law database, citation management, analytics

---

### 14. Mentage

| | |
|---|---|
| **Type** | AI-powered EdTech web application |
| **What it does** | AI chatbot designed to help students revise. Users manage topics, converse with an AI tutor for personalised revision help. Web interface with topic editing, profile management, and conversational learning. |
| **Live URL** | https://mentage.onrender.com |
| **Featured** | No |
| **Best for roles mentioning** | AI, chatbots, EdTech, OpenAI, Flask, React, conversational UI |

**Technologies:** React.js, Python, Flask, Firebase, OpenAI API

**Key features / talking points:**
- AI-powered revision assistance with topic management
- Conversational interface with personalised help
- User profiles and topic CRUD

---

### 15. Therabot

| | |
|---|---|
| **Type** | HealthTech chatbot (web + WhatsApp) |
| **What it does** | Conversational AI mental health support chatbot. Offers guided meditations, personalised mental health tips, and anonymous chat sessions. Available on web and WhatsApp. Configurable tone, role settings, and conversation history. |
| **Live URL** | https://therabot-site.onrender.com |
| **Featured** | No |
| **Best for roles mentioning** | HealthTech, chatbots, WhatsApp API, OpenAI, mental health, multi-platform |

**Technologies:** React.js, Node.js, Firebase, Render, OpenAI API

**Key features / talking points:**
- Web chat + WhatsApp integration
- Guided meditations and personalised tips
- Anonymous sessions with conversation history
- Configurable tone and role settings
- Dashboard for managing bot behaviour

---

### 16. Flashcards

| | |
|---|---|
| **Type** | Educational web application |
| **What it does** | Interactive flashcard application for learning React concepts. Card flipping animation, multiple card sets, progress tracking, mobile-friendly interface. |
| **Live URL** | https://flashcards-pj01.onrender.com |
| **Featured** | No |
| **Best for roles mentioning** | React fundamentals, CSS animations, education, learning projects |

**Technologies:** React, CSS3, HTML5

**Key features / talking points:**
- Interactive 3D card flip animations
- React concept question/answer sets
- Simple, clean learning UI

---

### 17. CulinAIry

| | |
|---|---|
| **Type** | AI-powered FoodTech web application |
| **What it does** | AI-powered recipe generator for personalised meals. Users generate recipes, plan meals, save favourites, and manage profiles. Includes meal planner and saved recipes library. |
| **Live URL** | https://culinairy-239n.onrender.com |
| **Featured** | No |
| **Best for roles mentioning** | AI, FoodTech, React, Firebase, meal planning, OpenAI |

**Technologies:** React.js, Node.js, Firebase, TypeScript, Render

**Key features / talking points:**
- AI recipe generation from user preferences
- Meal planner with planned meals view
- Saved recipes library
- User authentication and profiles

---

### 18. Dad Joke Generator

| | |
|---|---|
| **Type** | Fun/demo web application |
| **What it does** | Press a button, get a random dad joke. Simple entertainment app demonstrating Ember.js frontend with Node.js backend. |
| **Live URL** | https://dad-joke-generator-68xz.onrender.com |
| **Featured** | No |
| **Best for roles mentioning** | Ember.js, Node.js, API integration, humour projects |

**Technologies:** Ember.js, Node.js, Render

**Key features / talking points:**
- Random joke API consumption
- Ember.js framework experience (less common in portfolio)
- Simple, fun UX

---

### 19. DoomScroll

| | |
|---|---|
| **Type** | Satirical/demo web application |
| **What it does** | Infinitely scrolling feed of useless facts — a satirical commentary on doom-scrolling behaviour. Endless entertainment with humour. |
| **Live URL** | https://infinite-useless-scroll.onrender.com |
| **Featured** | No |
| **Best for roles mentioning** | React, infinite scroll, creative projects, UX commentary |

**Technologies:** React.js, Node.js, Render

**Key features / talking points:**
- Infinite scroll implementation
- Useless facts API/generation
- Satirical design demonstrating UX awareness

---

### 20. Contrarian

| | |
|---|---|
| **Type** | AI-powered FinTech / InvestTech web application |
| **What it does** | Pitch deck classifier for investors. Uses AI to analyse startup pitch decks, classify them, and provide investment insights. Includes OmniWidget integration for embedded analysis. |
| **Live URL** | Not listed (screenshots/demo in portfolio) |
| **Featured** | No |
| **Best for roles mentioning** | AI, FinTech, InvestTech, Flask, OpenAI, pitch analysis, startup ecosystem |

**Technologies:** React.js, Python, Flask, OpenAI API, Firebase, Render

**Key features / talking points:**
- AI-powered pitch deck analysis and classification
- Investment insights generation
- OmniWidget embeddable analysis component

---

### 21. Liberal Democrats (LDMF)

| | |
|---|---|
| **Type** | Informative/political website |
| **What it does** | Informative website for the Liberal Democrats Muslim Foundation (LDMF). Policy pages (education, housing, mental health, climate, Brexit), campaign updates, news, contact forms, and join-us functionality. |
| **Live URL** | https://ldmf.onrender.com |
| **Featured** | No |
| **Best for roles mentioning** | Vue.js, content websites, non-profit, civic tech |

**Technologies:** Vue.js, Node.js

**Key features / talking points:**
- Multi-page policy and campaign site
- Contact and membership forms
- Vue.js SPA experience

---

### 22. PNG to SVG

| | |
|---|---|
| **Type** | Utility web tool |
| **What it does** | Web tool to convert PNG images to SVG format. Simple upload, high-quality conversion, one-click download. |
| **Live URL** | https://pngtosvg-ulmg.onrender.com |
| **Featured** | No |
| **Best for roles mentioning** | Angular, image processing, utility tools, Node.js |

**Technologies:** Angular, Node.js

**Key features / talking points:**
- Intuitive upload-and-convert workflow
- High-quality SVG output
- Angular framework experience

---

### 23. Doppelgan-Car *(hidden on portfolio)*

| | |
|---|---|
| **Type** | AI-powered fun web application |
| **What it does** | AI-powered car personality matcher. Users upload an image or answer questions; AI analyses personality and matches to a car. Mobile-friendly interface. |
| **Live URL** | https://doppelgang-car.vercel.app |
| **Featured** | No (hidden) |
| **Best for roles mentioning** | AI, Nuxt.js, OpenAI, image processing, creative projects |

**Technologies:** Nuxt.js, JavaScript, Python, Flask, OpenAI, Render, Vercel

**Key features / talking points:**
- AI personality analysis + car matching
- Image upload and processing
- Nuxt.js (Vue meta-framework) experience

---

### 24. Tindev *(hidden on portfolio, no detail page)*

| | |
|---|---|
| **Type** | SocialTech / developer networking web application |
| **What it does** | Developer-focused networking platform for tech professionals — inspired by dating-app UX but for professional connections. Includes WebRTC for real-time communication. |
| **Live URL** | Not listed |
| **Featured** | No (hidden) |
| **Best for roles mentioning** | React, WebRTC, Firebase, social platforms, real-time communication |

**Technologies:** React.js, Node.js, Firebase, WebRTC

**Key features / talking points:**
- Developer networking with swipe/match UX patterns
- WebRTC real-time communication
- Firebase backend

---

## Tech Coverage Matrix (Quick Lookup)

Use this table to find which projects demonstrate a given technology:

| Technology | Projects |
|------------|----------|
| **React** | Monzo 1p, Brute-forcer, Recount, Imposter, LifeSmart, Networth Tool, Bgr8, BakesByOlayide, Mentage, Therabot, Flashcards, CulinAIry, DoomScroll, Contrarian, Tindev, Ministry of Justice, Breathapplyser (RN) |
| **Next.js** | Monzo 1p, Brute-forcer, Recount, BiasLens |
| **TypeScript** | Monzo 1p, Brute-forcer, Gremlins (site), FireWatch, Recount, Imposter, LifeSmart, Networth Tool, Bgr8, CulinAIry, Breathapplyser |
| **Vue.js** | Liberal Democrats, LifeSmart (legacy tools), Doppelgan-Car (Nuxt) |
| **Angular** | FireWatch, PNG to SVG |
| **Ember.js** | Dad Joke Generator |
| **Flutter / Mobile** | Breathapplyser |
| **C# / .NET / WPF** | Gremlins |
| **Node.js / Express** | Recount, FireWatch, Breathapplyser, BakesByOlayide, BiasLens, Mentage, Therabot, CulinAIry, Dad Joke, DoomScroll, Liberal Democrats, PNG to SVG, Ministry of Justice, Tindev |
| **Python / Flask / Django** | BiasLens (Django), Mentage, Contrarian, Doppelgan-Car |
| **Hono / Cloudflare Workers** | LifeSmart, Networth Tool, Recount, Monzo 1p, Brute-forcer, Gremlins, Imposter, FireWatch |
| **PostgreSQL / PostGIS** | Monzo 1p, FireWatch, LifeSmart, Networth Tool, Recount, Imposter, Breathapplyser |
| **Firebase** | Bgr8, BakesByOlayide, BiasLens, Mentage, Therabot, CulinAIry, Contrarian, Ministry of Justice, Tindev, Breathapplyser, LifeSmart |
| **Supabase** | Recount, Imposter |
| **Stripe** | Recount, Networth Tool, BakesByOlayide |
| **OpenAI / AI** | Recount, Mentage, Therabot, CulinAIry, Contrarian, BiasLens (NLP), Doppelgan-Car |
| **Chrome Extension** | Recount |
| **PartyKit / WebSockets** | Imposter, Bgr8 (messaging), Tindev (WebRTC) |
| **Discord SDK** | Imposter |
| **OpenLayers / GIS** | FireWatch |
| **PWA** | Monzo 1p, Networth Tool, Imposter, Breathapplyser |
| **Docker** | FireWatch |
| **Vitest / Playwright** | Monzo 1p, Brute-forcer, FireWatch, Recount, LifeSmart, Networth Tool, Imposter, Gremlins (xUnit for desktop) |

---

## Domain → Project Mapping (for Cover Letter Angles)

| Domain | Lead with these projects |
|--------|--------------------------|
| **FinTech** | LifeSmart, Networth Tool, Monzo 1p Challenge, Contrarian, SpZero Calculator |
| **EdTech** | LifeSmart (SpZero), Bgr8, Mentage, Flashcards, Financial Quiz |
| **HealthTech / Wellness** | Breathapplyser, Therabot |
| **SaaS / B2B** | Recount, Bgr8, LifeSmart admin tooling |
| **E-commerce** | BakesByOlayide |
| **Security / Privacy** | Brute-forcer |
| **Geospatial / GIS** | FireWatch |
| **Games / Realtime** | Imposter |
| **Desktop / Windows** | Gremlins |
| **Mobile** | Breathapplyser |
| **AI / ML / NLP** | BiasLens, CulinAIry, Contrarian, Mentage, Therabot, Recount (AI reports) |
| **Public Sector / Enterprise** | Ministry of Justice, LifeSmart (SPZeroFinance client) |
| **Media / Content** | BiasLens, LifeSmart (CMS) |
| **Social / Community** | Bgr8, Tindev, Imposter |
| **FoodTech** | BakesByOlayide, CulinAIry |
| **Productivity** | Recount, Gremlins |
| **Creative / Portfolio pieces** | Dad Joke Generator, DoomScroll, Doppelgan-Car |

---

## Suggested CV Bullet Templates (Adapt per Role)

> Replace [brackets] with specifics. Pick 3–5 bullets max per application.

**Full-stack / SaaS:**
> Built [Recount/Networth Tool/LifeSmart] — a [description] using [stack], implementing [auth/Stripe/RLS/Workers] with [testing/CI] and deploying to [Cloudflare/Neon].

**Frontend:**
> Developed [project] with [React/Next.js/TypeScript], delivering [PWA/responsive/real-time] UX including [specific feature] deployed to [host].

**Mobile:**
> Shipped Breathapplyser V2 (2026) on Android and iOS with [BAC tracking/caffeine monitoring/social features], alongside a web client at breathapplyser.online.

**Enterprise / client:**
> Delivered LifeSmart financial education suite for SPZeroFinance — [SpZero LMS / budget tool / quiz / calculator] with admin analytics, SSO, and Cloudflare Workers backend.

**AI:**
> Integrated OpenAI into [Therabot/Mentage/CulinAIry/Recount] for [conversational support / recipe generation / daily reports], with [Firebase/Flask/Node] backend.

**Geospatial:**
> Built FireWatch wildfire dashboard with Angular + PostGIS geodesic proximity queries, timeline analysis, and Dockerised full-stack deployment.

**Desktop:**
> Created Gremlins Windows tray app in C#/.NET 8 with WPF, Win32 hooks, self-contained publishing, and Microsoft Store MSIX pipeline.

---

## Portfolio Site Itself

| | |
|---|---|
| **What it is** | Humza's personal portfolio website showcasing all projects |
| **Technologies** | React 19, React Router 7, Framer Motion, Firebase Firestore (analytics), CSS theme system, Cloudflare Workers (wrangler.jsonc), GitHub Actions |
| **Notable engineering** | Centralised `projects.json` config, custom Firebase analytics (scroll depth, time on page, device info, anonymised IPs), traffic dashboard with UTM/ref-code tracking, protected admin routes |

---

*Last updated from portfolio repo: June 2026. Source: `src/config/projects.json` and individual project pages in `src/projects/`.*
