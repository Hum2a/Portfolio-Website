import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import Terminal from "../components/animations/Terminal";
import CodeBlock from "../components/animations/CodeBlock";
import "../styles/project-shared.css";
import "../styles/LiberalDemocrats.css";

const LiberalDemocrats = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/Homepage.png`, caption: "Homepage" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/AboutUs.png`, caption: "About Us" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/Campaigns.png`, caption: "Campaigns" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/ContactUs.png`, caption: "Contact Us" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/Education.png`, caption: "Education Policy" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/Equality.png`, caption: "Equality Campaign" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/Housing.png`, caption: "Housing" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/JoinUs.png`, caption: "Join Us" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/MentalHealth.png`, caption: "Mental Health" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/Brexit.png`, caption: "Brexit Policy" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/ClimateEmergency.png`, caption: "Climate Emergency" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/News.png`, caption: "News and Updates" },
  ];

  const projectInfo = `const liberalDemocrats = {
  name: "Liberal Democrats",
  type: "Informative Website",
  description: "Informative website for the Liberal Democrats Muslim Foundation (LDMF)",
  technologies: [
    "Vue.js",
    "Node.js"
  ],
  features: [
    "Policy information",
    "Campaign updates",
    "News and updates",
    "Contact forms",
    "Join us functionality"
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
            src={`${process.env.PUBLIC_URL}/logos/LDMF.png`}
            alt="Liberal Democrats Logo"
            className="project-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="project-title">
            <span className="code-comment">//</span> Liberal Democrats
          </h1>
          <Terminal
            lines={[
              "const liberalDemocrats = {",
              "  name: 'Liberal Democrats',",
              "  type: 'Informative Website',",
              "  description: 'Informative website for the LDMF',",
              "  url: 'https://ldmf.onrender.com'",
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
              href="https://ldmf.onrender.com"
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
              <span className="code-comment">//</span> Screenshots
            </h2>
            <div className="image-gallery">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  className="image-container"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedImage(image)}
                >
                  <img src={image.src} alt={image.caption} className="gallery-image" />
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
              <img src={selectedImage.src} alt={selectedImage.caption} className="modal-image" />
              <p className="modal-caption">{selectedImage.caption}</p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LiberalDemocrats;
