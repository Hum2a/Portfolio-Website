import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import Terminal from "../components/animations/Terminal";
import CodeBlock from "../components/animations/CodeBlock";
import useMediaTracking from "../hooks/useMediaTracking";
import "../styles/project-shared.css";
import "../styles/Doomscroll.css";

const DoomScroll = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { trackMediaClick } = useMediaTracking();

  const projectInfo = `const doomscroll = {
  name: "DoomScroll",
  type: "Web Application",
  description: "A satirical app to mimic infinite scrolling behavior",
  technologies: [
    "React.js",
    "Node.js",
    "Render"
  ],
  features: [
    "Infinite scrolling",
    "Useless facts generator",
    "Satirical design",
    "Endless entertainment"
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
            src={`${process.env.PUBLIC_URL}/logos/Doomscroll.png`}
            alt="DoomScroll Logo"
            className="project-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="project-title">
            <span className="code-comment">//</span> DoomScroll
          </h1>
          <Terminal
            lines={[
              "const doomscroll = {",
              "  name: 'DoomScroll',",
              "  type: 'Web Application',",
              "  description: 'A satirical app to mimic infinite scrolling',",
              "  url: 'https://infinite-useless-scroll.onrender.com'",
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
            <a
              href="https://infinite-useless-scroll.onrender.com"
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
              <span className="code-comment">//</span> Demo Video
            </h2>
            <div className="video-container" onClick={() => {
              trackMediaClick('video', `${process.env.PUBLIC_URL}/videos/DoomScroll/Doomscroll Demo.mp4`, 'DoomScroll App Demo');
              setIsModalOpen(true);
            }}>
              <video
                controls
                className="gallery-video"
              >
                <source
                  src={`${process.env.PUBLIC_URL}/videos/DoomScroll/Doomscroll Demo.mp4`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <p className="video-caption">DoomScroll App Demo</p>
            </div>
          </motion.section>
        </div>

        {isModalOpen && (
          <div className="modal" onClick={() => setIsModalOpen(false)}>
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
              <video controls className="modal-video" autoPlay>
                <source
                  src={`${process.env.PUBLIC_URL}/videos/DoomScroll/Doomscroll Demo.mp4`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DoomScroll;
