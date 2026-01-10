# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [Unreleased]

### Added
- Nothing yet

## [v0.2.1] - 2026-01-10

### 🐛 Bug Fixes

- Update Firestore rules and documentation to clarify access control philosophy, including public routes and user permissions. Enhance user document management for authenticated users and ensure analytics collections are properly defined. Fix URL in firebaseAnalytics.js for IP geolocation service. (07db5ac)

### 💅 Style

- Refactor Navbar component to include user authentication state and enhance layout. Introduce a login button for unauthenticated users and adjust styles for better responsiveness and visual appeal. (b4ad68b)

### 🔒 Security

- Add Firebase setup notes and update security headers in index.html (edbc486)

