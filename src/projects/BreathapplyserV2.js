import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import Terminal from "../components/animations/Terminal";
import CodeBlock from "../components/animations/CodeBlock";
import useMediaTracking from "../hooks/useMediaTracking";
import "../styles/Breathapplyser.css";

const BreathapplyserV2 = () => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { trackMediaClick } = useMediaTracking();

  const images = [
    { src: `${process.env.PUBLIC_URL}/images/BreathapplyserV2/Home.png`, title: 'Home Screen' },
    { src: `${process.env.PUBLIC_URL}/images/BreathapplyserV2/Drink Modal.png`, title: 'Drink Modal' },
    { src: `${process.env.PUBLIC_URL}/images/BreathapplyserV2/Drink Presets.png`, title: 'Drink Presets' },
    { src: `${process.env.PUBLIC_URL}/images/BreathapplyserV2/Recent Drinks.png`, title: 'Recent Drinks' },
    { src: `${process.env.PUBLIC_URL}/images/BreathapplyserV2/History Screen Recent Drinks.png`, title: 'History Screen' },
    { src: `${process.env.PUBLIC_URL}/images/BreathapplyserV2/Drinks History.png`, title: 'Drinks History' },
    { src: `${process.env.PUBLIC_URL}/images/BreathapplyserV2/Drinks per day.png`, title: 'Drinks per Day' },
    { src: `${process.env.PUBLIC_URL}/images/BreathapplyserV2/BAC Over time Graph.png`, title: 'BAC Over Time Graph' },
    { src: `${process.env.PUBLIC_URL}/images/BreathapplyserV2/Caffeine.png`, title: 'Caffeine Tracking' },
    { src: `${process.env.PUBLIC_URL}/images/BreathapplyserV2/Caffeine History.png`, title: 'Caffeine History' },
    { src: `${process.env.PUBLIC_URL}/images/BreathapplyserV2/Caffeine Level History page graph.png`, title: 'Caffeine Level History Graph' },
    { src: `${process.env.PUBLIC_URL}/images/BreathapplyserV2/Caffeine Over time Graph.png`, title: 'Caffeine Over Time Graph' },
    { src: `${process.env.PUBLIC_URL}/images/BreathapplyserV2/Profile Editing.png`, title: 'Profile Editing' },
    { src: `${process.env.PUBLIC_URL}/images/BreathapplyserV2/Friend Code.png`, title: 'Friend Code' },
    { src: `${process.env.PUBLIC_URL}/images/BreathapplyserV2/Leaderboard.png`, title: 'Leaderboard' },
    { src: `${process.env.PUBLIC_URL}/images/BreathapplyserV2/Settings 1.png`, title: 'Settings Page 1' },
    { src: `${process.env.PUBLIC_URL}/images/BreathapplyserV2/Settings 2.png`, title: 'Settings Page 2' },
    { src: `${process.env.PUBLIC_URL}/images/BreathapplyserV2/Report Generation pdf.png`, title: 'Report Generation PDF' },
  ];

  const projectInfo = `const breathapplyserV2 = {
  name: "Breathapplyser V2",
  type: "Mobile Application",
  platforms: ["Android", "iOS"],
  year: 2026,
  description: "Modern breathalyzer app with advanced tracking and social features",
  features: [
    "Advanced BAC tracking with time-based graphs",
    "Caffeine level monitoring and history",
    "Drink presets and quick entry",
    "Social features: friend codes and leaderboards",
    "Comprehensive history and analytics",
    "PDF report generation",
    "Profile customization"
  ],
  technologies: [
    "React Native",
    "JavaScript",
    "TypeScript",
    "Firebase",
    "Node.js"
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
            src={`${process.env.PUBLIC_URL}/logos/Breathapplyser.png`}
            alt="Breathapplyser V2 Logo"
            className="project-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="project-title">
            <span className="code-comment">{'//'}</span> Breathapplyser V2
          </h1>
          <Terminal
            lines={[
              "const breathapplyserV2 = {",
              "  name: 'Breathapplyser V2',",
              "  type: 'Mobile Application',",
              "  year: 2026,",
              "  description: 'Modern breathalyzer app with advanced features'",
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
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="section-title">
              <span className="code-comment">{'//'}</span> About Breathapplyser V2 (2026)
            </h2>
            <p className="section-description">
              Breathapplyser V2 is a complete redesign and modernization of the original Breathapplyser app, released in 2026. This version introduces advanced tracking capabilities, comprehensive analytics, social features, and an improved user experience.
            </p>
            <p className="section-description">
              Key improvements include dual tracking for both alcohol (BAC) and caffeine levels, interactive time-based graphs, drink presets for quick entry, social features with friend codes and leaderboards, and comprehensive PDF report generation for personal tracking and health insights.
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
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-keyword">✓</span>
                <span className="feature-text">Advanced BAC tracking with time-based visualization</span>
              </div>
              <div className="feature-item">
                <span className="feature-keyword">✓</span>
                <span className="feature-text">Caffeine level monitoring and history tracking</span>
              </div>
              <div className="feature-item">
                <span className="feature-keyword">✓</span>
                <span className="feature-text">Drink presets for quick and easy entry</span>
              </div>
              <div className="feature-item">
                <span className="feature-keyword">✓</span>
                <span className="feature-text">Social features: friend codes and competitive leaderboards</span>
              </div>
              <div className="feature-item">
                <span className="feature-keyword">✓</span>
                <span className="feature-text">Comprehensive history and analytics dashboard</span>
              </div>
              <div className="feature-item">
                <span className="feature-keyword">✓</span>
                <span className="feature-text">PDF report generation for health tracking</span>
              </div>
              <div className="feature-item">
                <span className="feature-keyword">✓</span>
                <span className="feature-text">Profile customization and settings</span>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="section-title">
              <span className="code-comment">{'//'}</span> Screenshots
            </h2>
            <div className="image-gallery">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  className="image-container"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => {
                    trackMediaClick('image', image.src, image.title);
                    setSelectedMedia(image);
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.title}
                    className="gallery-image"
                  />
                  <p className="image-caption">{image.title}</p>
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
              <img
                src={selectedMedia.src}
                alt={selectedMedia.title}
                className="modal-image"
              />
              <p className="modal-caption">{selectedMedia.title}</p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BreathapplyserV2;
