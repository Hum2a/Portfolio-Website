# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [Unreleased]

### Added
- Nothing yet

## [v0.2.0] - 2026-01-10

### ✨ Features

- Add media click tracking to MinistryOfJustice component by integrating useMediaTracking hook. This enhances user interaction logging for improved analytics. (982d5e5)
- Add page time and media click tracking to Traffic page; implement filtering and visualization features for enhanced analytics. Update styles for new UI components and improve data presentation. (bb985b3)
- Add useMediaTracking custom hook for tracking media interactions; integrates with Firebase Analytics to log media clicks on project pages. (252c08d)
- Add PageTimeTracker component to track time spent on pages; integrates with Firebase Analytics for improved user engagement metrics. (2dcd7f1)
- Add HumzaLogin and Traffic routes; implement ProtectedRoute for role-based access control to Traffic page. (7ed4cd8)
- Add Traffic analytics page with comprehensive visitor, page view, and event tracking; implement filtering options by environment and date range, and enhance data visualization with charts and tables for improved user insights. (7fa7a22)
- Add authentication context and protected route functionality; implement user role management and loading state handling for enhanced user experience. (4a62071)
- Add role-based link to Navbar for 'humza'; integrate useAuth context for user role management and enhance navigation options. (9891c26)
- Enhance release script to include error handling for missing changelog updater script; implement return codes for changelog update status. Add new Python script for automated changelog generation with categorized commit entries. (da92fc0)

### ⚡ Performance

- Enhance index.html with additional preconnect and dns-prefetch links for improved performance; update Content Security Policy to include new Google APIs for enhanced security and connectivity. (5ababd8)

### ♻️ Refactoring

- Enhance Firebase Analytics service by adding page time tracking and media click tracking functionalities. Refactor existing tracking methods to improve data collection, including session management and error handling. Update exports to include new tracking methods for better integration. (f9fe1f8)
- Refactor App component to replace PageTracker with PageTimeTracker for improved page time tracking functionality. (8967e6a)

### 💅 Style

- Enhance Traffic page with country filtering functionality; add UI components for country selection and display, including expanded view for country breakdown and associated styles for improved user interaction. (0024fcf)

### 👷 CI/CD

- Add media click tracking to various project components using the useMediaTracking hook. Update onClick handlers to log interactions for images and videos across multiple project files, enhancing analytics integration. (14199f2)
- Add HumzaLogin component and associated CSS for Google authentication; implement user redirection and error handling for improved login experience. (0025ea6)
- Update package-lock.json and package.json to bump version to 0.1.1 and add recharts dependency; includes updates to various package versions and new dependencies for enhanced functionality. (cc083df)

### 🔒 Security

- Update Firestore security rules to include new analytics collections; add read/write permissions for analytics_page_times, analytics_media_clicks, and analytics_sessions while maintaining strict deletion controls. (d738a7d)
- Add Firestore configuration and security rules; implement role-based access control for analytics data and user document management in Firestore. (f17c738)

### 📝 Other Changes

- Wrap App component with AuthProvider to enable authentication context; streamline user management within the application. (33fbc2d)

