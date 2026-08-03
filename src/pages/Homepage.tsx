import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Typewriter from "../components/animations/Typewriter";
import Terminal from "../components/animations/Terminal";
import { HomepageFeaturedProjects } from "../components/projects/HomepageFeaturedProjects";
import { CareerSection } from "../components/linkedin/CareerSection";
import { GitHubSection } from "../components/github/GitHubSection";
import { prefetchProjects } from "../utils/prefetchRoute";
import Seo, { DEFAULT_DESCRIPTION } from "../components/seo/Seo";
import "./Homepage.css";

const Homepage = () => {
  const navigate = useNavigate();
  const [showTerminal, setShowTerminal] = useState(false);
  const careerRef = useRef(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.35, ease: "easeOut" },
    },
  };

  const handleTypewriterComplete = () => {
    setTimeout(() => {
      setShowTerminal(true);
    }, 150);
  };

  const handleTerminalComplete = useCallback(() => {
    setTimeout(() => {
      careerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 500);
  }, []);

  return (
    <div className="homepage">
      <Seo
        title="Humza Butt — Software Engineer, Full Stack & Platform Configuration"
        description={DEFAULT_DESCRIPTION}
        path="/"
      />
      <Navbar />
      <motion.div
        className="homepage-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="homepage-hero">
          <div className="homepage-intro">
            <span className="homepage-greeting">{"// Hello, I'm"}</span>
            <h1 className="homepage-title">
              <Typewriter
                text="Humza Butt"
                speed={45}
                showCursor={true}
                onComplete={handleTypewriterComplete}
                codeStyle={false}
                className="homepage-name"
              />
            </h1>
            <div className="homepage-subtitle-container">
              {showTerminal && (
                <Terminal
                  lines={[
                    "const developer = {",
                    "  name: 'Humza Butt',",
                    "  role: 'Full Stack Developer',",
                    "  passion: 'Crafting solutions with code',",
                    "  skills: ['React', 'Node.js', 'TypeScript', '...']",
                    "};"
                  ]}
                  prompt=">"
                  typingSpeed={22}
                  autoStart={true}
                  className="homepage-terminal"
                  title="about.js"
                  onComplete={handleTerminalComplete}
                />
              )}
            </div>
          </div>
        </div>

        <motion.div
          className="homepage-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "var(--shadow-lift-strong)",
            }}
            whileTap={{ scale: 0.98 }}
            className="homepage-button"
            onMouseEnter={prefetchProjects}
            onFocus={prefetchProjects}
            onClick={() => navigate("/projects")}
          >
            <span className="button-text">Explore My Work</span>
            <span className="button-arrow">→</span>
          </motion.button>
        </motion.div>

        <motion.div
          className="homepage-scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.3 }}
        >
          <span className="scroll-hint-text">Scroll to explore career &amp; projects</span>
          <motion.span
            className="scroll-hint-chevron"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
        </motion.div>
      </motion.div>

      <div ref={careerRef}>
        <CareerSection />
      </div>
      <HomepageFeaturedProjects />
      <GitHubSection />
    </div>
  );
};

export default Homepage;
