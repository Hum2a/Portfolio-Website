import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../layout/Navbar";
import HamburgerMenu from "../layout/HamburgerMenu";
import Terminal from "../animations/Terminal";
import CodeBlock from "../animations/CodeBlock";
import ProjectSiteEmbed from "./ProjectSiteEmbed";
import Img from "../media/Img";
import "./ProjectLayout.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/**
 * Shared scaffolding for project case-study pages.
 *
 * Renders the standard page shell (responsive nav, animated container, header
 * with optional logo + title + terminal) and a set of optional standard
 * sections. Anything bespoke is passed via `children` and rendered inside
 * `.project-content` after the standard sections. The "Project Information"
 * code-block section is always rendered last when `codeSnippet` is provided.
 */
const ProjectLayout = ({
  // Required
  title,
  terminalLines,

  // Terminal overrides
  terminalPrompt = ">",
  terminalSpeed = 35,
  terminalTitle = "project.js",

  // Header
  logo,

  // CodeBlock
  codeSnippet,

  // Embed
  embedUrl,
  embedTitle = "Live site",
  embedSandbox = false,
  embedNewTabLabel = "Open in new tab →",
  embedSecondaryLinkProps = {},

  // Standard sections
  features = [],
  techStack = [],
  images = [],
  videos = [],

  // Free-form slot
  children,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="project-page">
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      <motion.div
        className="project-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="project-header">
          {logo && (
            <motion.img
              src={logo}
              alt={`${title} logo`}
              className="project-logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            />
          )}
          <h1 className="project-title">
            <span className="code-comment">{'//'}</span> {title}
          </h1>
          <div className="project-terminal">
            <Terminal
              lines={terminalLines}
              prompt={terminalPrompt}
              typingSpeed={terminalSpeed}
              title={terminalTitle}
              autoStart={true}
              className="project-terminal"
            />
          </div>
        </div>

        <div className="project-content">
          {features.length > 0 && (
            <motion.section
              className="project-section"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="section-title">
                <span className="code-comment">{'//'}</span> Features
              </h2>
              <div className="features-list">
                {features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="feature-keyword">✓</span>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {techStack.length > 0 && (
            <motion.section
              className="project-section"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="section-title">
                <span className="code-comment">{'//'}</span> Tech Stack
              </h2>
              <div className="tech-stack-grid">
                {techStack.map((tech, index) => (
                  <div key={index} className="tech-badge">
                    <span className="tech-icon">⚡</span>
                    <span className="tech-name">{tech}</span>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {images.length > 0 && (
            <motion.section
              className="project-section"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="section-title">
                <span className="code-comment">{'//'}</span> Screenshots
              </h2>
              <div className="image-gallery">
                {images.map((image, index) => (
                  <motion.div
                    key={index}
                    className="image-container"
                    whileHover={{ y: -5 }}
                    onClick={() => {
                      if (image.onClick) image.onClick();
                      setSelectedImage(image);
                    }}
                  >
                    <Img
                      src={image.src}
                      alt={image.alt || image.caption || ""}
                      className="gallery-image"
                    />
                    {image.caption && (
                      <p className="image-caption">{image.caption}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {videos.length > 0 && (
            <motion.section
              className="project-section"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="section-title">
                <span className="code-comment">{'//'}</span> Videos
              </h2>
              <div className="video-gallery">
                {videos.map((video, index) => (
                  <motion.div
                    key={index}
                    className="video-container"
                    whileHover={{ y: -5 }}
                    onClick={() => {
                      if (video.onClick) video.onClick();
                      setSelectedVideo(video);
                    }}
                  >
                    <video
                      className="gallery-video"
                      controls
                      poster={video.poster}
                    >
                      <source src={video.src} type="video/mp4" />
                    </video>
                    {video.caption && (
                      <p className="video-caption">{video.caption}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {embedUrl && (
            <motion.section
              className="project-section"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="section-title">
                <span className="code-comment">{'//'}</span> Live site
              </h2>
              <ProjectSiteEmbed
                url={embedUrl}
                iframeTitle={embedTitle}
                useSandbox={embedSandbox}
                newTabLabel={embedNewTabLabel}
                secondaryLinkProps={embedSecondaryLinkProps}
              />
            </motion.section>
          )}

          {children}

          {codeSnippet && (
            <motion.section
              className="project-section"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="section-title">
                <span className="code-comment">{'//'}</span> Project Information
              </h2>
              <CodeBlock
                code={codeSnippet}
                language="javascript"
                showLineNumbers={true}
                copyable={false}
              />
            </motion.section>
          )}
        </div>
      </motion.div>

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
            <Img
              src={selectedImage.src}
              alt={selectedImage.alt || selectedImage.caption || ""}
              className="modal-image"
              priority
            />
            {selectedImage.caption && (
              <p className="modal-caption">{selectedImage.caption}</p>
            )}
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
            <video className="modal-video" controls autoPlay src={selectedVideo.src} />
            {selectedVideo.caption && (
              <p className="modal-caption">{selectedVideo.caption}</p>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProjectLayout;
