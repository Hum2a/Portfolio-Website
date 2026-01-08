import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Typewriter from "../components/animations/Typewriter";
import Terminal from "../components/animations/Terminal";
import "../styles/Homepage.css";

const Homepage = () => {
  const navigate = useNavigate();
  const [showTerminal, setShowTerminal] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const handleTypewriterComplete = () => {
    setTimeout(() => {
      setShowTerminal(true);
    }, 500);
  };

  return (
    <div className="homepage">
      <Navbar />
      <motion.div
        className="homepage-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="homepage-hero">
          <div className="homepage-intro">
            <span className="homepage-greeting">// Hello, I'm</span>
            <h1 className="homepage-title">
              <Typewriter
                text="Humza Butt"
                speed={100}
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
                  typingSpeed={60}
                  autoStart={true}
                  className="homepage-terminal"
                  title="about.js"
                />
              )}
            </div>
          </div>
        </div>

        <motion.div
          className="homepage-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "var(--shadow-glow-strong)",
            }}
            whileTap={{ scale: 0.98 }}
            className="homepage-button"
            onClick={() => navigate("/projects")}
          >
            <span className="button-text">Explore My Work</span>
            <span className="button-arrow">→</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Homepage;
