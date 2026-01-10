# Personal Portfolio Website

## 🚀 Overview

This is a modern, responsive personal portfolio website built with React. It showcases my projects, skills, and professional experience with a **subtle, professional design** featuring coding-inspired aesthetics, typewriter animations, and terminal-style effects. The site includes detailed analytics tracking to monitor visitor engagement while respecting privacy.

## ✨ Features

- **Responsive Design**: Fully responsive layout that works across desktop, tablet, and mobile devices
- **Project Showcase**: Detailed project pages with descriptions, technologies used, and links
- **Professional UI**: Subtle, professional design with coding-inspired aesthetics
- **Typewriter Animations**: Terminal-style text animations and typewriter effects
- **Project Management**: Centralized project data system using JSON configuration
- **Contact Form**: Direct communication channel for potential clients and collaborators

## 🛠️ Technologies Used

### Frontend
- React 19
- React Router 7
- Framer Motion (animations)
- CSS Variables (theme system)
- Responsive Design
- Typewriter & Terminal animations

### Analytics & Backend
- Firebase Firestore
- Custom Analytics Implementation

### DevOps
- GitHub Actions for CI/CD

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── animations/   # Animation components (Typewriter, Terminal, CodeBlock)
│   ├── layout/        # Layout components (Navbar, Footer, etc.)
│   └── ui/            # UI components (Buttons, Cards, etc.)
├── config/            # Configuration files
│   └── projects.json  # Centralized project data
├── data/              # Data management
│   └── projects.js    # Project data utilities
├── pages/             # Main page components
├── projects/          # Individual project detail pages
├── routes/            # Routing configuration
├── services/          # Firebase and analytics services
├── styles/            # Global styles and themes
│   ├── themes/        # Theme files (colors, typography)
│   └── components/    # Component-specific styles
└── utils/             # Helper functions and utilities
```

## 📊 Analytics Implementation

The portfolio includes a custom analytics solution built with Firebase Firestore that:

- Tracks visitors with anonymized IPs to respect privacy
- Collects detailed device and browser information
- Monitors user engagement through scroll depth and time tracking
- Records specific events like button clicks and form submissions
- Organizes data in Firestore for easy querying and visualization

## 🔧 Setup and Installation

1. **Clone the repository**
   ```
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore
   - Add your Firebase configuration to `src/utils/env.js` (via environment variables)
   - Deploy Firestore security rules (see below)

4. **Deploy Firestore Security Rules**
   
   The project includes Firestore security rules to protect sensitive analytics data. To deploy:
   
   ```bash
   # Install Firebase CLI (if not already installed)
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Initialize Firebase (if not already done)
   firebase init firestore
   
   # Deploy the rules
   firebase deploy --only firestore:rules
   ```
   
   **Security Rules Overview:**
   - Analytics collections (`analytics_visitors`, `analytics_pageviews`, `analytics_events`, `analytics_stats`) are only readable by users with the "humza" role
   - Analytics collections allow write access to anyone (for anonymous visitor tracking)
   - Users collection allows users to read/update their own document
   - All other collections are publicly accessible (read/write)

5. **Start the development server**
   ```
   npm start
   ```

6. **Build for production**
   ```
   npm run build
   ```

## 📱 Featured Projects

The portfolio showcases several key projects:

- **Breathapplyser**: An AI-driven application that analyzes breath samples
- **BiasLens**: Tool for detecting bias in news articles and media content
- **LifeSmart**: Smart home automation system with AI integration
- **Mentage**: Mentorship platform connecting professionals with students
- **Therabot**: AI therapeutic chatbot for mental health support
- **CulinAIry**: AI-powered recipe suggestion and meal planning app
- **DadJokeGenerator**: Fun application that generates dad jokes on demand
- **Contrarian**: Opinion analysis tool for identifying diverse perspectives
- **And more...**

## 📈 Performance Optimization

The site is optimized for performance through:

- Code splitting and lazy loading of components
- Image optimization
- Efficient CSS with minimal dependencies
- Analytics code that doesn't impact page load times

## 🔒 Privacy Considerations

This portfolio takes privacy seriously:

- IP addresses are anonymized before storage
- Detailed cookie consent mechanism is implemented
- Data collection is transparent and minimal
- No third-party analytics tools that might track users across sites

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

Feel free to reach out through the contact form on the website or connect on social media.

---

© 2024 All Rights Reserved.
