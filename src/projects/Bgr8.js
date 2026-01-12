// Bgr8.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import HamburgerMenu from '../components/HamburgerMenu';
import Terminal from '../components/animations/Terminal';
import CodeBlock from '../components/animations/CodeBlock';
import useMediaTracking from '../hooks/useMediaTracking';
import '../styles/project-shared.css';
import '../styles/Bgr8.css';

const mediaSection = {
  images: [
    {
      src: `${process.env.PUBLIC_URL}/images/Bgr8/Homepage CTA.png`,
      title: 'Homepage CTA',
      description: 'Optimized homepage with conversion-focused call-to-action design. Built with React 18.2 and TypeScript, featuring responsive layouts, smooth animations using Framer Motion, and A/B testing capabilities for maximizing user engagement and mentor sign-ups.'
    },
    {
      src: `${process.env.PUBLIC_URL}/images/Bgr8/Matching Algorithm.png`,
      title: 'Matching Algorithm',
      description: 'Visual representation of the proprietary MentorAlgorithm matching system. Implements weighted scoring across 70+ criteria including skills, experience, availability, location, and compatibility factors. Built with complex TypeScript algorithms, real-time data processing, and machine learning-inspired matching logic for optimal mentor-mentee pairings.'
    },
    {
      src: `${process.env.PUBLIC_URL}/images/Bgr8/Mentee Dashboard.png`,
      title: 'Mentee Dashboard',
      description: 'Personalized dashboard with mentor recommendations and progress tracking. Features real-time data synchronization via Firebase Firestore, dynamic content rendering, personalized mentor suggestions based on the matching algorithm, and comprehensive progress tracking with visual analytics using Chart.js integration.'
    },
    {
      src: `${process.env.PUBLIC_URL}/images/Bgr8/Live Messaging between mentor and mentee.png`,
      title: 'Live Messaging System',
      description: 'Real-time messaging system with WebSocket/Firebase Realtime Database integration. Implements instant message delivery, read receipts, typing indicators, file attachments, and end-to-end encryption. Built with React hooks for real-time state management and optimized for low latency communication between mentors and mentees.'
    },
    {
      src: `${process.env.PUBLIC_URL}/images/Bgr8/Admin Panel Analytics.png`,
      title: 'Admin Panel Analytics',
      description: 'Comprehensive real-time analytics dashboard with advanced data visualization. Features custom Chart.js and Recharts implementations, real-time Firestore listeners for live data updates, complex data aggregation queries, exportable reports (CSV/PDF), and interactive filtering with date range selection. Includes metrics for user engagement, matching success rates, and platform growth.'
    },
    {
      src: `${process.env.PUBLIC_URL}/images/Bgr8/Admin Panel DB Query Terminal.png`,
      title: 'Database Query Terminal',
      description: 'Advanced database query interface with real-time Firestore operations. Implements secure query builder with syntax validation, real-time query execution, result pagination and filtering, query history management, and role-based access control. Built with TypeScript for type-safe queries and includes comprehensive error handling and query optimization features.'
    },
    {
      src: `${process.env.PUBLIC_URL}/images/Bgr8/Admin Panel User Management.png`,
      title: 'User Management System',
      description: 'Comprehensive user management interface with bulk operations and advanced filtering. Features real-time user data synchronization, bulk user operations (activate, deactivate, delete), advanced search and filtering with multiple criteria, user role assignment, activity tracking, and export capabilities. Built with React table components and optimized for handling large datasets efficiently.'
    },
    {
      src: `${process.env.PUBLIC_URL}/images/Bgr8/Admin Panel Role Cards.png`,
      title: 'Role-Based Access Control',
      description: 'Advanced RBAC (Role-Based Access Control) management interface. Implements granular permission system with role hierarchy, permission inheritance, dynamic role assignment, audit logging for permission changes, and visual permission matrix. Built with TypeScript for type-safe permissions and includes comprehensive security validation to prevent privilege escalation.'
    },
    {
      src: `${process.env.PUBLIC_URL}/images/Bgr8/Admin Verification Panel.png`,
      title: 'Mentor Verification Workflow',
      description: 'Multi-stage mentor verification workflow with automated and manual review processes. Features automated document verification, multi-stage approval workflow (pending → under_review → approved/rejected), real-time status updates, comprehensive verification data collection including background checks, and automated email notifications. Built with state machine pattern for reliable workflow management.'
    },
    {
      src: `${process.env.PUBLIC_URL}/images/Bgr8/Admin Enquiries Management.png`,
      title: 'Enquiries Management System',
      description: 'Comprehensive enquiry management system with intelligent routing and status tracking. Implements real-time enquiry processing, automated categorization using natural language processing, priority-based sorting, assignment to appropriate admins, status tracking with workflow management, and automated response templates. Features advanced filtering and search capabilities for efficient enquiry handling.'
    },
    {
      src: `${process.env.PUBLIC_URL}/images/Bgr8/Admin Email Drafter.png`,
      title: 'Email Template System',
      description: 'Automated email template system with dynamic content generation. Features WYSIWYG email editor, template library with reusable components, dynamic variable insertion, A/B testing capabilities, email scheduling, and comprehensive tracking (open rates, click rates). Built with React Email and integrated with Firebase Cloud Functions for reliable email delivery and tracking.'
    },
    {
      src: `${process.env.PUBLIC_URL}/images/Bgr8/Announcement Banner Manager.png`,
      title: 'Content Management System',
      description: 'Dynamic content management system for platform announcements. Implements real-time banner updates without page refresh, scheduling system for time-based announcements, targeting rules for user-specific announcements, A/B testing for banner effectiveness, and analytics tracking. Built with Firebase Firestore for real-time updates and includes comprehensive admin controls for content management.'
    }
  ],
  videos: []
};

export default function Bgr8() {
  const [activeMediaType, setActiveMediaType] = useState('images');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { trackMediaClick } = useMediaTracking();

  const projectInfo = `const bgr8 = {
  name: "Bgr8 Platform",
  type: "Mentoring & Community Platform",
  description: "Empowering individuals through intelligent mentor-mentee matching and community growth",
  technologies: [
    "React 18.2",
    "TypeScript 5.7",
    "Firebase 11.3",
    "Vite 6.1",
    "Cal.com API",
    "Custom MentorAlgorithm"
  ],
  features: [
    "Proprietary MentorAlgorithm with weighted scoring across 70+ criteria",
    "Real-time Cal.com calendar integration",
    "Comprehensive admin analytics dashboard",
    "Multi-layered security (CSP headers, XSS protection, rate limiting)",
    "Advanced matching algorithms",
    "Role-based authentication",
    "Automated release management",
    "Intelligent search and filtering",
    "Real-time availability management",
    "Professional development tracking"
  ]
};`;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="project-page">
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      <motion.div
        className="project-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="project-header">
          <motion.img
            src={`${process.env.PUBLIC_URL}/logos/Bgr8.png`}
            alt="Bgr8 Logo"
            className="project-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="project-title">
            <span className="code-comment">{'//'}</span> Bgr8 Platform
          </h1>
          <Terminal
            lines={[
              "const bgr8 = {",
              "  name: 'Bgr8 Platform',",
              "  type: 'Mentoring & Community Platform',",
              "  description: 'Empowering individuals through intelligent matching',",
              "  url: 'https://bgr8.com'",
              "};"
            ]}
            prompt=">"
            typingSpeed={80}
            autoStart={true}
            className="project-terminal"
            title="project.js"
          />
        </div>

        <div className="project-content">
          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="section-title">
              <span className="code-comment">{'//'}</span> Project Information
            </h2>
            <CodeBlock
              code={projectInfo}
              language="javascript"
              showLineNumbers={true}
              copyable={false}
            />
            <a
              href="https://bgr8.com"
              target="_blank"
              rel="noopener noreferrer"
              className="external-link-button"
            >
              Visit the Website →
            </a>
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="section-title">
              <span className="code-comment">{'//'}</span> About Bgr8 Platform
            </h2>
            <p className="section-description">
              I architect and develop the Bgr8 Platform - a comprehensive mentoring and community platform that empowers individuals through intelligent mentor-mentee matching. Built with React 18.2, TypeScript 5.7, and Firebase 11.3, the platform features a proprietary MentorAlgorithm with weighted scoring across 70+ criteria, real-time Cal.com calendar integration, comprehensive admin analytics, and multi-layered security implementation including CSP headers, XSS protection, and rate limiting.
            </p>
            <p className="section-description">
              Key Technical Achievements: Developed advanced matching algorithms, built responsive mobile-first interfaces, implemented role-based authentication, created automated release management systems, and delivered comprehensive admin tools for user management and analytics. The platform serves as a centralized hub for community growth, featuring intelligent search, real-time availability management, and professional development tracking.
            </p>
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="section-title">
              <span className="code-comment">{'//'}</span> Key Features
            </h2>
            <div className="business-grid">
              <motion.div
                className="business-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <h3 className="business-name">🤝 Mentor Matching</h3>
                <p className="business-description">Proprietary MentorAlgorithm with weighted scoring across 70+ criteria for intelligent mentor-mentee matching</p>
              </motion.div>
              <motion.div
                className="business-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                whileHover={{ y: -5 }}
              >
                <h3 className="business-name">📅 Cal.com Integration</h3>
                <p className="business-description">Real-time calendar integration for seamless booking and availability management</p>
              </motion.div>
              <motion.div
                className="business-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ y: -5 }}
              >
                <h3 className="business-name">📊 Admin Analytics</h3>
                <p className="business-description">Comprehensive admin dashboard with detailed analytics and user management tools</p>
              </motion.div>
              <motion.div
                className="business-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
                whileHover={{ y: -5 }}
              >
                <h3 className="business-name">🔒 Security</h3>
                <p className="business-description">Multi-layered security with CSP headers, XSS protection, and rate limiting</p>
              </motion.div>
              <motion.div
                className="business-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ y: -5 }}
              >
                <h3 className="business-name">🔍 Smart Search</h3>
                <p className="business-description">Intelligent search and filtering system for finding the perfect mentor match</p>
              </motion.div>
              <motion.div
                className="business-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
                whileHover={{ y: -5 }}
              >
                <h3 className="business-name">📱 Responsive Design</h3>
                <p className="business-description">Mobile-first responsive design for seamless experience across all devices</p>
              </motion.div>
            </div>
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="section-title">
              <span className="code-comment">{'//'}</span> Platform Showcase
            </h2>
            <div className="project-media">
              {mediaSection.images.map((image, index) => (
                <motion.div
                  key={index}
                  className="media-container"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => {
                    trackMediaClick('image', image.src, image.title);
                    setSelectedMedia(image);
                  }}
                >
                  <img src={image.src} alt={image.title} className="project-image" />
                  <div className="media-info">
                    <p className="media-caption">{image.title}</p>
                    <p className="media-description">{image.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {selectedMedia && (
          <div className="modal" onClick={() => setSelectedMedia(null)}>
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedMedia(null)}>
                ×
              </button>
              {selectedMedia.src.includes('.mp4') ? (
                <video controls className="modal-video" autoPlay>
                  <source src={selectedMedia.src} type="video/mp4" />
                  Your browser does not support video playback.
                </video>
              ) : (
                <img
                  src={selectedMedia.src}
                  alt={selectedMedia.title}
                  className="modal-image"
                />
              )}
              <div className="modal-info">
                <p className="modal-caption">{selectedMedia.title}</p>
                {selectedMedia.description && (
                  <p className="modal-description">{selectedMedia.description}</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
