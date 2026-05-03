import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import Terminal from "../components/animations/Terminal";
import CodeBlock from "../components/animations/CodeBlock";
import ProjectSiteEmbed from "../components/ProjectSiteEmbed";
import useMediaTracking from "../hooks/useMediaTracking";
import "../styles/project-shared.css";
import "../styles/BiasLens.css";

const BIAS_LENS_URL = "https://biaslens.vercel.app";

const BiasLens = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { trackMediaClick } = useMediaTracking();

  const images = [
    {
      src: `${process.env.PUBLIC_URL}/images/BiasLens/Homepage 1.png`,
      caption: "Homepage displaying news sources",
    },
    {
      src: `${process.env.PUBLIC_URL}/images/BiasLens/Homepage 2.png`,
      caption: "News articles analyzed for bias",
    },
    {
      src: `${process.env.PUBLIC_URL}/images/BiasLens/Homepage 3.png`,
      caption: "News articles analyzed for bias",
    },
  ];

  const projectInfo = `const biaslens = {
  name: "BiasLens",
  type: "Web Application",
  description: "Political alignment analyser for web articles",
  technologies: [
    "Next.js",
    "JavaScript",
    "Node.js",
    "Python",
    "Django",
    "Firebase",
    "Vercel"
  ],
  features: [
    "News article analysis",
    "Political bias detection",
    "Sentiment analysis",
    "NLP techniques"
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
            src={`${process.env.PUBLIC_URL}/logos/BiasLens.png`}
            alt="BiasLens Logo"
            className="project-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="project-title">
            <span className="code-comment">//</span> BiasLens
          </h1>
          <Terminal
            lines={[
              "const biaslens = {",
              "  name: 'BiasLens',",
              "  type: 'Web Application',",
              "  description: 'Political alignment analyser for web articles',",
              "  url: 'https://biaslens.vercel.app'",
              "};"
            ]}
            prompt=">"
            typingSpeed={35}
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
              href={BIAS_LENS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link-button"
            >
              Visit the Website →
            </a>
          </motion.section>

          <motion.section
            className="project-section"
            aria-labelledby="biaslens-live-site-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
          >
            <h2 className="section-title" id="biaslens-live-site-heading">
              <span className="code-comment">//</span> Live site
            </h2>
            <p className="section-description">
              Embedded deployment (lazy-loaded). Open in a new tab if the preview is blocked.
            </p>
            <ProjectSiteEmbed url={BIAS_LENS_URL} iframeTitle="BiasLens" />
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Screenshots
            </h2>
            <div className="image-gallery">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  className="image-container"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => {
                    trackMediaClick('image', image.src, image.caption);
                    setSelectedImage(image);
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.caption}
                    className="gallery-image"
                  />
                  <p className="image-caption">{image.caption}</p>
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
      </motion.div>
    </div>
  );
};

export default BiasLens;
