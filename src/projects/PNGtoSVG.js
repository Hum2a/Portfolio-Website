import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import Terminal from "../components/animations/Terminal";
import CodeBlock from "../components/animations/CodeBlock";
import ProjectSiteEmbed from "../components/ProjectSiteEmbed";
import useMediaTracking from "../hooks/useMediaTracking";
import "../styles/project-shared.css";
import "../styles/PNGtoSVG.css";

const PNG_TO_SVG_URL = "https://pngtosvg-ulmg.onrender.com";

const PNGtoSVG = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { trackMediaClick } = useMediaTracking();

  const projectInfo = `const pngToSvg = {
  name: "PNG to SVG Converter",
  type: "Web Application",
  description: "Easily convert PNG images into SVG format",
  technologies: [
    "Angular",
    "Node.js"
  ],
  features: [
    "Simple and intuitive upload process",
    "High-quality SVG conversions",
    "Downloadable results in one click"
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
            src={`${process.env.PUBLIC_URL}/logos/PNGtoSVG.png`}
            alt="PNG to SVG Logo"
            className="project-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="project-title">
            <span className="code-comment">//</span> PNG to SVG Converter
          </h1>
          <Terminal
            lines={[
              "const pngToSvg = {",
              "  name: 'PNG to SVG Converter',",
              "  type: 'Web Application',",
              "  description: 'Easily convert PNG images into SVG format',",
              "  url: 'https://pngtosvg-ulmg.onrender.com'",
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
              href={PNG_TO_SVG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link-button"
            >
              Visit the Website →
            </a>
          </motion.section>

          <motion.section
            className="project-section"
            aria-labelledby="pngtosvg-live-site-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
          >
            <h2 className="section-title" id="pngtosvg-live-site-heading">
              <span className="code-comment">//</span> Live site
            </h2>
            <p className="section-description">
              Web tool (lazy-loaded iframe).
            </p>
            <ProjectSiteEmbed url={PNG_TO_SVG_URL} iframeTitle="PNG to SVG" />
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Sample
            </h2>
            <div className="image-gallery">
              <motion.div
                className="image-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ y: -5 }}
                onClick={() => {
                  trackMediaClick('image', `${process.env.PUBLIC_URL}/images/PNGtoSVG/sample.png`, 'Sample Conversion Result');
                }}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/PNGtoSVG/sample.png`}
                  alt="Sample Conversion"
                  className="gallery-image"
                />
                <p className="image-caption">Sample Conversion Result</p>
              </motion.div>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
};

export default PNGtoSVG;
