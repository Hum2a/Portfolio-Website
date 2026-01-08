import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import Terminal from "../components/animations/Terminal";
import CodeBlock from "../components/animations/CodeBlock";
import "../styles/Breathapplyser.css";

const Breathapplyser = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const videos = [
    { src: `${process.env.PUBLIC_URL}/videos/Breathapplyser/Homepage.mp4`, caption: "Homepage" },
    { src: `${process.env.PUBLIC_URL}/videos/Breathapplyser/TapToStartDrinking.mp4`, caption: "Tap to Start Drinking" },
    { src: `${process.env.PUBLIC_URL}/videos/Breathapplyser/History.mp4`, caption: "History" },
    { src: `${process.env.PUBLIC_URL}/videos/Breathapplyser/Animated Charts.mp4`, caption: "Animated Charts" },
    { src: `${process.env.PUBLIC_URL}/videos/Breathapplyser/AnimatedSettings.mp4`, caption: "Animated Settings" },
    { src: `${process.env.PUBLIC_URL}/videos/Breathapplyser/SettingsJumping.mp4`, caption: "Settings Jumping" },
  ];

  const projectInfo = `const breathapplyser = {
  name: "Breathapplyser",
  type: "Mobile Application",
  platforms: ["Android", "iOS"],
  description: "A modern breathalyzer app with smart insights",
  features: [
    "Accurate BAC estimations",
    "Integration with smart devices",
    "Health insights and tips"
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
            alt="Breathapplyser Logo"
            className="project-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="project-title">
            <span className="code-comment">//</span> Breathapplyser
          </h1>
          <Terminal
            lines={[
              "const breathapplyser = {",
              "  name: 'Breathapplyser',",
              "  type: 'Mobile Application',",
              "  platforms: ['Android', 'iOS'],",
              "  description: 'A modern breathalyzer app with smart insights'",
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
              <span className="code-comment">//</span> Project Information
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
              <span className="code-comment">//</span> Features
            </h2>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-keyword">✓</span>
                <span className="feature-text">Accurate BAC estimations</span>
              </div>
              <div className="feature-item">
                <span className="feature-keyword">✓</span>
                <span className="feature-text">Integration with smart devices</span>
              </div>
              <div className="feature-item">
                <span className="feature-keyword">✓</span>
                <span className="feature-text">Health insights and tips</span>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Demo Videos
            </h2>
            <div className="video-gallery">
              {videos.map((video, index) => (
                <motion.div
                  key={index}
                  className="video-container"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedVideo(video)}
                >
                  <video className="gallery-video" controls>
                    <source src={video.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <p className="video-caption">{video.caption}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {selectedVideo && (
          <div className="modal" onClick={() => setSelectedVideo(null)}>
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedVideo(null)}>
                ×
              </button>
              <video className="modal-video" controls autoPlay>
                <source src={selectedVideo.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p className="modal-caption">{selectedVideo.caption}</p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Breathapplyser;
