import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import Terminal from "../components/animations/Terminal";
import CodeBlock from "../components/animations/CodeBlock";
import ProjectSiteEmbed from "../components/ProjectSiteEmbed";
import useMediaTracking from "../hooks/useMediaTracking";
import "../styles/project-shared.css";
import "../styles/Culinairy.css";

const CULINAIRY_URL = "https://culinairy-239n.onrender.com";

const CulinAIry = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { trackMediaClick } = useMediaTracking();

  const images = [
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Homepage.png`, caption: "Homepage" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Recipe Generated.png`, caption: "Recipe Generated" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Login page.png`, caption: "Login and Register" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Meal Planner.png`, caption: "Meal Planner" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/MealsPlaned.png`, caption: "Planned Meals" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Profile.png`, caption: "Profile Settings" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Saved Recipes Closed.png`, caption: "Saved Recipes Overview" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/SaveD Recipes Expanded.png`, caption: "Saved Recipes Expanded" },
  ];

  const projectInfo = `const culinary = {
  name: "CulinAIry",
  type: "Web Application",
  description: "AI-powered recipe generator for personalized meals",
  technologies: [
    "React.js",
    "Node.js",
    "Firebase",
    "TypeScript",
    "Render"
  ],
  features: [
    "AI-powered recipe generation",
    "Meal planning",
    "Recipe saving",
    "User profiles",
    "Personalized meal suggestions"
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
            src={`${process.env.PUBLIC_URL}/logos/CulinAIry.png`}
            alt="CulinAIry Logo"
            className="project-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="project-title">
            <span className="code-comment">//</span> CulinAIry
          </h1>
          <Terminal
            lines={[
              "const culinary = {",
              "  name: 'CulinAIry',",
              "  type: 'Web Application',",
              "  description: 'AI-powered recipe generator for personalized meals',",
              "  url: 'https://culinairy-239n.onrender.com'",
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
              href={CULINAIRY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link-button"
            >
              Visit the Website →
            </a>
          </motion.section>

          <motion.section
            className="project-section"
            aria-labelledby="culinairy-live-site-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
          >
            <h2 className="section-title" id="culinairy-live-site-heading">
              <span className="code-comment">//</span> Live site
            </h2>
            <p className="section-description">
              Deployed app (lazy-loaded iframe).
            </p>
            <ProjectSiteEmbed url={CULINAIRY_URL} iframeTitle="CulinAIry" />
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

export default CulinAIry;
