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
    { src: `${process.env.PUBLIC_URL}/images/B8/Bgr8.png`, title: 'Bgr8 Platform Homepage' },
    { src: `${process.env.PUBLIC_URL}/images/B8/AdminPortalAnalytics.png`, title: 'Admin Portal Analytics' },
    { src: `${process.env.PUBLIC_URL}/images/B8/AdminPortalUsers.png`, title: 'Admin Portal Users' },
    { src: `${process.env.PUBLIC_URL}/images/B8/AdminPortalEnquiries.png`, title: 'Admin Portal Enquiries' },
    { src: `${process.env.PUBLIC_URL}/images/B8/AdminPortalSettings.png`, title: 'Admin Portal Settings' },
  ],
  videos: [
    { src: `${process.env.PUBLIC_URL}/videos/B8/Profile.mp4`, title: 'Bgr8 Profile' },
  ]
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
              <span className="code-comment">//</span> About Bgr8 Platform
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
              <span className="code-comment">{'//'}</span> Media Showcase
            </h2>
            <div className="media-controls">
              <button
                className={`media-button ${activeMediaType === 'images' ? 'active' : ''}`}
                onClick={() => setActiveMediaType('images')}
              >
                Images
              </button>
              <button
                className={`media-button ${activeMediaType === 'videos' ? 'active' : ''}`}
                onClick={() => setActiveMediaType('videos')}
              >
                Videos
              </button>
            </div>
            <div className="project-media">
              {activeMediaType === 'images' &&
                mediaSection.images.map((image, index) => (
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
                    <p className="media-caption">{image.title}</p>
                  </motion.div>
                ))}
              {activeMediaType === 'videos' &&
                mediaSection.videos.map((video, index) => (
                  <motion.div
                    key={index}
                    className="media-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    onClick={() => {
                      trackMediaClick('video', video.src, video.title);
                      setSelectedMedia(video);
                    }}
                  >
                    <video controls className="project-video-preview">
                      <source src={video.src} type="video/mp4" />
                      Your browser does not support video playback.
                    </video>
                    <p className="media-caption">{video.title}</p>
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
              <p className="modal-caption">{selectedMedia.title}</p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
