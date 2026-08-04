# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [Unreleased]

### Added
- Nothing yet

## [v2.0.0] - 2026-08-04

### ✨ Features

- Add sync script for branches in package.json (c84cf19)
- Add layout width verification script and update CSS for responsive design (69a3716)
- Add Humza Butt's CV to the public directory (8e682a9)
- Add redesign audit and planning documents for portfolio overhaul (04d3537)
- Add Docket (Baseer) project assets and configuration (c4f8df8)
- Add Docket project assets and configuration (2c3af72)
- Add Baseer Portfolio project assets and configuration (34cfc74)
- Add Encore project assets and configuration (25765e2)
- Enhance environment configuration and add secrets synchronization script (151c8d8)
- Add email theme management and enhance HTML email structure (899b82f)
- Add email logging and management features to traffic analytics (f9180d3)
- Implement traffic notification system and enhance email management (d80c198)
- Add Career Shortcut and Update Sitemap (c61f9c2)
- Implement Career Section and Update LinkedIn Integration (e37239b)
- Add LinkedIn integration and profile page (689fec0)
- Add Buzzer project details and update tech stack (b5efec5)
- Add Buzzer project and logo (a46294b)
- Add Blitz project and logo (ddc43b3)

### ♻️ Refactoring

- Refactor project structure and update assets (d01641c)
- Refactor layout and enhance user experience (7543c27)

### 💅 Style

- Add owner tagging functionality and styles for visitor management (f057194)
- Enhance visitor tagging functionality and styles (60764b8)

### 🧪 Tests

- Enhance traffic notification system with test email functionality (fba5a08)

### 🔧 Chores

- Enhance staging environment setup and update sitemap (48d21ae)
- Update environment configuration and enhance secrets synchronization (da4dc26)

### 👷 CI/CD

- Update dependencies and enhance Traffic analytics UI (5bc1518)
- Add Oche project and associated assets (f6ffba0)

### 📝 Other Changes

- Enhance branch synchronization script to support pushing and local-only options (cc158eb)
- Confirm (f922c24)
- Phase 7 (ea614b0)
- Phase 5 (a646e7a)
- Phase 4 (844cbd3)
- Phase 3 (5650278)
- Phase 1 (0ce07ec)
- Phase 0 complete (1755e06)
- Phase 0c (3a882bf)
- Enhance project navigation and loading experience (3f72eec)
- Phase 0a (2f60711)


## Added
- Nothing yet

## [v1.1.0] - 2026-06-18

### ✨ Features

- Add library category and enhance project surfaces (24ea947)
- Add 501 Feature Cards project (a55cc7d)
- Add comprehensive project reference document for CV and cover letter tailoring (ac40dac)

### 🔧 Chores

- Update caniuse-lite dependency version in package-lock.json (9ca12b3)
- Update project configurations and enhance code readability (2820cd6)


## Added
- Nothing yet

## [v1.0.1] - 2026-05-31

### ✨ Features

- Phase 2: add shared ProjectLayout component (responsive shell, header, standard sections, image/video lightbox) + ProjectLayout.css that re-exports project-shared.css (035e89d)
- Add .cursorignore file to exclude unnecessary files from indexing (c7b56ef)
- Update wrangler configuration and add SPA redirect handling (aeb712b)
- Enhance traffic analytics with bot and VPN detection features (460e111)
- Add DeviceInfoPanel component for enhanced device information display (6a22bf8)
- Implement GitHub contributions feature with calendar visualization (4b72c45)
- Add Traffic Trends feature with new components and analytics integration (ba1212d)
- Add ref token analytics and visualization components (82da2f0)
- Add FireWatch project with SVG logo and detailed information (b029791)
- Add Networth Tool project with SVG logo and detailed information (666360a)
- Add dynamic project spotlight feature to About page (84e4180)
- Enhance project date display and add formatting utility (3c5d91e)
- Add ProjectSiteEmbed integration for multiple projects with live site sections (1f7e4ed)
- Add Gremlins project with detailed description and routing integration (d00a711)
- Add Brute-forcer project with detailed description and assets (9e1a87c)
- Add Cloudflare Workers configuration (029af97)
- Add Imposter project with detailed description and assets (027073e)
- Add Recount project with detailed description and logo (a24363d)
- Add production environment configuration to disable ESLint plugin (9c210df)
- Implement comprehensive Firestore rules and schema for portfolio analytics (20fcc38)
- Add shimmer effect to homepage button for enhanced interactivity (adc928e)
- Add tracking tokens management and drill-through functionality (633f769)

### 🐛 Bug Fixes

- Phase 4: Fix web-vitals to v4 API (onCLS/onINP/onFCP/onLCP/onTTFB) (9d8ca4b)
- Phase 2: Fix routing (7bc4499)
- Fix analytics IP fallback. (e2283f3)

### ⚡ Performance

- Update typing speed in Terminal components across multiple pages for improved user experience (b2d3a44)
- Update typing speed in Terminal components across About and Contact pages for improved user experience (0ff18d9)

### ♻️ Refactoring

- Phase 3: Restructure src/ directory (b18b862)
- Refactor TrafficFilters component to enhance admin page filtering options (94770be)
- Refactor geolocation logic in firebaseAnalytics.js to streamline visitor location retrieval (cd44574)
- Refactor parseRollupStats and mergeHeadlineStats functions for improved null handling (2b902e3)
- Refactor animation durations and transitions across components (2638cb5)

### 💅 Style

- Enhance project card styles and improve layout consistency (820468f)
- Refactor project card styles and enhance visual presentation (da017f0)

### 🔧 Chores

- Phase 5: Rename services/firebaseAnalytics.js to analyticsService.js and update imports (988e6b3)
- Update geolocation handling and permissions policy (2179efc)
- Update geolocation handling and environment configuration (837d1af)
- Update Firestore rules to allow open read/write access for portfolio analytics and contact data (c2ed814)
- Update project URLs and enhance project sections for Breathapplyser, BruteForcer, Imposter, LifeSmart, Monzo1pChallenge, and Recount (c7505c7)
- Remove deprecated video files from Breathapplyser project and update component references accordingly (682840b)
- Enhance Terminal component with completion callback and update Homepage for smooth scrolling (dabd4b1)

### 🔨 Build

- Update package version to 1.0.0 and add cross-env as a dev dependency for build script configuration (5bf98ba)

### 👷 CI/CD

- Phase 5: migrate complex outliers (Contrarian, BruteForcer, MinistryOfJustice, LifeSmart, Breathapplyser) to ProjectLayout; keep bespoke interactivity in children slot; reconcile Breathapplyser.css with shared sheet (b3c5c0e)
- Add Monzo 1p Challenge project and associated assets (0f187a0)

### 🔒 Security

- Add security.txt file for security contact information and policy expiration (bb987ea)
- Update Content Security Policy in index.html to include new Monzo project URL for enhanced security (9bb5f25)

### 📝 Other Changes

- Phase 4: migrate semi-standard outliers (FireWatch, Recount, Gremlins, NetworthTool, Flashcards) to ProjectLayout (e1417ce)
- Phase 3: migrate 13 standard project pages to ProjectLayout; delete 9 trivial per-project CSS wrappers (48f3704)
- Phase 1: hoist canonical .tech-stack-grid/.tech-badge into project-shared.css; remove duplicates from LifeSmart, Monzo1pChallenge, BruteForcer, NetworthTool (keep NetworthTool teal hover override) (cabde3d)
- Phase 1: Purge dead code (3a6747c)
- Enhance visitor analytics with improved country tracking and geo enrichment (f418979)
- Remove _redirects file as SPA redirect handling is no longer needed (5303930)
- Enhance traffic analytics with bounce rate calculations and improved data handling (36fbc75)
- Enhance traffic analytics with date filtering and admin path exclusion (4ce5fb4)
- Enhance analytics tracking and UI components (d826766)
- Enhance traffic analytics with ref hit tracking and data integration (2ab527c)
- Enhance project display and filtering capabilities (1d8858e)


## Added
- Nothing yet

## [v1.0.0] - 2026-02-24

### ✨ Features

- Add GitHub integration and enhance navigation (499d027)
- Add HomepageFeaturedProjects component and update project visibility (0ec658c)
- Enhance URL generation feature in Traffic page (4bdc0fd)
- Implement Firestore rules for analytics tracking tokens (19db281)
- Implement visitor activity tracking feature in Traffic page (b5bd2f9)

### ♻️ Refactoring

- Refactor project components and enhance animations (39121ce)
- Refactor Traffic page structure and functionality (a2da3af)
- Refactor visitor tracking in Traffic page to use anonymized IP (95a8b3d)

### 💅 Style

- Add project links section to Breathapplyser component and enhance styles (c2385b3)

### 🔧 Chores

- Update Firestore rules to include comprehensive access controls (66069e4)
- Update Permissions-Policy in index.html and remove browser geolocation fallback in firebaseAnalytics.js (cd9f6b0)

### 📝 Other Changes

- Enhance Traffic page with sorting functionality for visitors, page views, events, and more (d4f988a)


## Added
- Nothing yet

## [v0.3.2] - 2026-01-19

### 📝 Other Changes

- Enhance changelog functionality to include existing releases (60b8539)


## Added
- Nothing yet

## [v0.3.1] - 2026-01-19

### ✨ Features

- Add SpZero Calculator Widget with detailed features and media asset (64f0456)
- Add SpZero project with comprehensive features and media assets (adb9404)