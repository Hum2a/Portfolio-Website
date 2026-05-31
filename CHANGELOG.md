# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [Unreleased]

### Added
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