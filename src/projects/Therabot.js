import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import Terminal from "../components/animations/Terminal";
import CodeBlock from "../components/animations/CodeBlock";
import "../styles/project-shared.css";
import "../styles/Therabot.css";

const Therabot = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const images = [
    { src: `${process.env.PUBLIC_URL}/images/Therabot/Dashboard.png`, caption: "Dashboard" },
    { src: `${process.env.PUBLIC_URL}/images/Therabot/Settings.png`, caption: "Settings" },
    { src: `${process.env.PUBLIC_URL}/images/Therabot/Role settings.png`, caption: "Role Settings" },
    { src: `${process.env.PUBLIC_URL}/images/Therabot/Tone settings.png`, caption: "Tone Settings" },
    { src: `${process.env.PUBLIC_URL}/images/Therabot/Profile.png`, caption: "Profile Settings" },
    { src: `${process.env.PUBLIC_URL}/images/Therabot/Web chat empty.png`, caption: "Chat interface overview" },
    { src: `${process.env.PUBLIC_URL}/images/Therabot/ACtive webchat.png`, caption: "Live chat in action" },
    { src: `${process.env.PUBLIC_URL}/images/Therabot/Conversation History.png`, caption: "Review past sessions" },
    { src: `${process.env.PUBLIC_URL}/images/Therabot/Conveersation Hisotry expanded a bit.png`, caption: "Expanded Conversation History" },
    { src: `${process.env.PUBLIC_URL}/images/Therabot/Whatsapp chat.png`, caption: "Whatsapp Chat" },
  ];

  const projectInfo = `const therabot = {
  name: "Therabot",
  type: "Web Application & WhatsApp Bot",
  description: "Chatbot offering mental health support and resources",
  platforms: ["Web", "WhatsApp"],
  technologies: [
    "React.js",
    "Node.js",
    "Firebase",
    "Render",
    "OpenAI API"
  ],
  features: [
    "Guided meditations",
    "Personalized mental health tips",
    "Anonymous chat sessions",
    "WhatsApp integration",
    "Conversation history"
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
            src={`${process.env.PUBLIC_URL}/logos/Therabot.png`}
            alt="Therabot Logo"
            className="project-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="project-title">
            <span className="code-comment">//</span> Therabot
          </h1>
          <Terminal
            lines={[
              "const therabot = {",
              "  name: 'Therabot',",
              "  type: 'Web Application & WhatsApp Bot',",
              "  description: 'Chatbot offering mental health support',",
              "  url: 'https://therabot-site.onrender.com'",
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
              href="https://therabot-site.onrender.com"
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
              <span className="code-comment">//</span> Features
            </h2>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-keyword">✓</span>
                <span className="feature-text">Guided meditations</span>
              </div>
              <div className="feature-item">
                <span className="feature-keyword">✓</span>
                <span className="feature-text">Personalized mental health tips</span>
              </div>
              <div className="feature-item">
                <span className="feature-keyword">✓</span>
                <span className="feature-text">Anonymous chat sessions</span>
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
              <span className="code-comment">//</span> Screenshots
            </h2>
            <div className="image-gallery">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  className="image-container"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
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

export default Therabot;
