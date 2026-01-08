import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import HamburgerMenu from "../components/HamburgerMenu";
import Navbar from "../components/Navbar";
import Terminal from "../components/animations/Terminal";
import CodeBlock from "../components/animations/CodeBlock";
import "../styles/project-shared.css";
import "../styles/DoppelganCar.css";

const DoppelganCar = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const images = [
    { src: `${process.env.PUBLIC_URL}/images/DoppelganCar/Homepage.png`, caption: "Homepage" },
    { src: `${process.env.PUBLIC_URL}/images/DoppelganCar/Upload.png`, caption: "Upload and Analyze" },
    { src: `${process.env.PUBLIC_URL}/images/DoppelganCar/Results.png`, caption: "Car Match Results" },
    { src: `${process.env.PUBLIC_URL}/images/DoppelganCar/MobileView.png`, caption: "Mobile-Friendly UI" },
  ];

  const projectInfo = `const doppelganCar = {
  name: "Doppelgan-Car",
  type: "Web Application",
  description: "AI-powered car personality matcher",
  technologies: [
    "Nuxt.js",
    "JavaScript",
    "Python",
    "Flask",
    "OpenAI",
    "Render"
  ],
  features: [
    "AI-powered car matching",
    "Personality analysis",
    "Image upload and processing",
    "Mobile-friendly interface"
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
            src={`${process.env.PUBLIC_URL}/logos/Doppelgancar.png`}
            alt="DoppelganCar Logo"
            className="project-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="project-title">
            <span className="code-comment">//</span> Doppelgan-Car
          </h1>
          <Terminal
            lines={[
              "const doppelganCar = {",
              "  name: 'Doppelgan-Car',",
              "  type: 'Web Application',",
              "  description: 'AI-powered car personality matcher',",
              "  url: 'https://doppelgang-car.vercel.app'",
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
              href="https://doppelgang-car.vercel.app"
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
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedImage(image)}
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

export default DoppelganCar;
