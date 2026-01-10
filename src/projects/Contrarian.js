import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import Terminal from "../components/animations/Terminal";
import CodeBlock from "../components/animations/CodeBlock";
import useMediaTracking from "../hooks/useMediaTracking";
import "../styles/project-shared.css";
import "../styles/Contrarian.css";

const Contrarian = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { trackMediaClick } = useMediaTracking();

  const media = [
    { type: "image", src: `${process.env.PUBLIC_URL}/images/Contrarian/Homepage.png`, caption: "Homepage" },
    { type: "image", src: `${process.env.PUBLIC_URL}/images/Contrarian/Round2.png`, caption: "Round 2" },
    { type: "video", src: `${process.env.PUBLIC_URL}/videos/Contrarian/OmniWidget.mp4`, caption: "OmniWidget Demo" },
  ];

  const projectInfo = `const contrarian = {
  name: "Contrarian",
  type: "Web Application",
  description: "Pitch deck classifier for investors to analyze startup pitches",
  technologies: [
    "React.js",
    "Python",
    "Flask",
    "OpenAI API",
    "Firebase",
    "Render"
  ],
  features: [
    "AI-powered pitch analysis",
    "Pitch deck classification",
    "Investment insights",
    "OmniWidget integration"
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
            src={`${process.env.PUBLIC_URL}/logos/Contrarian.png`}
            alt="Contrarian Logo"
            className="project-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="project-title">
            <span className="code-comment">//</span> Contrarian
          </h1>
          <Terminal
            lines={[
              "const contrarian = {",
              "  name: 'Contrarian',",
              "  type: 'Web Application',",
              "  description: 'Pitch deck classifier for investors',",
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
              <span className="code-comment">//</span> Media
            </h2>
            <div className="project-media">
              {media.map((item, index) => (
                <motion.div
                  key={index}
                  className="media-container"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => {
                    trackMediaClick(item.type, item.src, item.caption);
                    item.type === "image" ? setSelectedImage(item) : setSelectedVideo(item);
                  }}
                >
                  {item.type === "image" ? (
                    <img
                      src={item.src}
                      alt={item.caption}
                      className="gallery-image"
                    />
                  ) : (
                    <video className="gallery-video" src={item.src} />
                  )}
                  <p className="media-caption">{item.caption}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {selectedImage && (
          <div className="modal" onClick={() => setSelectedImage(null)}>
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedImage(null)}>
                ×
              </button>
              <img
                src={selectedImage.src}
                alt={selectedImage.caption}
                className="modal-image"
              />
              <p className="modal-caption">{selectedImage.caption}</p>
            </motion.div>
          </div>
        )}

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
              <video
                controls
                className="modal-video"
                autoPlay
                src={selectedVideo.src}
              />
              <p className="modal-caption">{selectedVideo.caption}</p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Contrarian;
