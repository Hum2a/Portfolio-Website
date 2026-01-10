import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import Terminal from "../components/animations/Terminal";
import CodeBlock from "../components/animations/CodeBlock";
import useMediaTracking from "../hooks/useMediaTracking";
import "../styles/project-shared.css";
import "../styles/LifeSmart.css";

const projects = [
  {
    id: "misc",
    title: "LifeSmart Platform Overview",
    description: "A comprehensive look at the LifeSmart platform's main interfaces and features.",
    features: [
      "Modern and intuitive user interface",
      "Secure user authentication",
      "Admin dashboard for content management",
      "Seamless navigation between tools",
    ],
    media: [
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Misc/HomeScreen.png`, caption: "Home Screen" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Misc/SelectScreen.png`, caption: "Tool Selection Screen" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Misc/Login.png`, caption: "Login Interface" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Misc/Admin Dashboard.png`, caption: "Admin Dashboard" },
    ],
  },
  {
    id: "financial-quiz",
    title: "Financial Quiz",
    description: "A fun and interactive quiz to test and improve financial literacy.",
    features: [
      "Engaging financial questions",
      "Customizable difficulty levels",
      "Real-time scoring and feedback",
    ],
    media: [
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Quiz/LandingPage.png`, caption: "Quiz Landing Page" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Quiz/Quizcreation.png`, caption: "Quiz Creation Page" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Quiz/Question 1.png`, caption: "Question 1 Example" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Quiz/Question 1 answered.png`, caption: "Answered Question" },
      { type: "video", src: `${process.env.PUBLIC_URL}/videos/LifeSmart/Quiz/Highlighted words.mp4`, caption: "Highlighted Words Feature" },
      { type: "video", src: `${process.env.PUBLIC_URL}/videos/LifeSmart/Quiz/Scoreboard video.mp4`, caption: "Scoreboard Feature Demo" },
    ],
  },
  {
    id: "asset-market-simulation",
    title: "Asset Market Simulation Tool",
    description: "Simulate stock market scenarios to teach investment strategies.",
    features: [
      "Realistic market conditions",
      "Portfolio management",
      "Data-driven analytics and reports",
    ],
    media: [
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Asset Simulation/Homepage.png`, caption: "Homepage" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Asset Simulation/Results.png`, caption: "Simulation Results" },
      { type: "video", src: `${process.env.PUBLIC_URL}/videos/LifeSmart/Asset Simulation/Simulation.mp4`, caption: "Simulation in Action" },
    ],
  },
  {
    id: "budget-tool",
    title: "Budget Planning Tool",
    description: "An interactive tool to help users create and manage their personal budgets effectively.",
    features: [
      "Step-by-step budget creation process",
      "Visual budget breakdown",
      "Excel export functionality",
      "Customizable expense categories",
      "Interactive progress tracking",
    ],
    media: [
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Budget Tool/Step1.png`, caption: "Step 1: Income Input" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Budget Tool/Step2.png`, caption: "Step 2: Needs Expenses" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Budget Tool/Step3.png`, caption: "Step 3: Wants Expenses" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Budget Tool/Step4no.png`, caption: "Step 4: Savings Details" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Budget Tool/Step4yes.png`, caption: "Step 4: Savings Input" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Budget Tool/Step5.png`, caption: "Step 5: Budget Review" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Budget Tool/Step6.png`, caption: "Step 6: 6 Month Projection" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Budget Tool/Step7.png`, caption: "Step 7: Final Spreadsheet" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Budget Tool/ExcelSpreadsheet.png`, caption: "Excel Export Example" },
    ],
  },
  {
    id: "investment-calculator",
    title: "Investment Calculator",
    description: "An interactive tool to help users calculate the future value of their investments.",
    features: [
      "Realistic market conditions",
      "Portfolio management",
      "Data-driven analytics and reports",
    ],
    media: [
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Investment Calculator/Investment Calculator.png`, caption: "Investment Calculator" },
    ],
  }
];

const LifeSmart = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const { trackMediaClick } = useMediaTracking();

  const projectInfo = `const lifesmart = {
  name: "LifeSmart",
  type: "Web Application Suite",
  description: "Collection of tools to teach financial literacy to young people",
  technologies: [
    "React.js",
    "Vue.js",
    "Node.js",
    "Firebase",
    "Chart.js",
    "HostPresto",
    "Render"
  ],
  features: [
    "Financial Quiz",
    "Asset Market Simulation",
    "Budget Planning Tool",
    "Investment Calculator",
    "Admin Dashboard"
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
            src={`${process.env.PUBLIC_URL}/logos/LifeSmart.png`}
            alt="LifeSmart Logo"
            className="project-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="project-title">
            <span className="code-comment">//</span> LifeSmart
          </h1>
          <Terminal
            lines={[
              "const lifesmart = {",
              "  name: 'LifeSmart',",
              "  type: 'Web Application Suite',",
              "  description: 'Collection of tools to teach financial literacy',",
              "  url: 'https://lifesmart.onrender.com'",
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
              href="https://lifesmart.onrender.com"
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
              <span className="code-comment">//</span> Select a Tool
            </h2>
            <div className="project-selector">
              <label htmlFor="project-dropdown" className="selector-label">
                Select a Project:
              </label>
              <select
                id="project-dropdown"
                value={selectedProject.id}
                onChange={(e) =>
                  setSelectedProject(
                    projects.find((project) => project.id === e.target.value)
                  )
                }
                className="project-dropdown"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            key={selectedProject.id}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> {selectedProject.title}
            </h2>
            <p className="section-description">{selectedProject.description}</p>
            <div className="features-list">
              {selectedProject.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <span className="feature-keyword">✓</span>
                  <span className="feature-text">{feature}</span>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            key={`media-${selectedProject.id}`}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Media
            </h2>
            <div className="project-media">
              {selectedProject.media.map((media, index) => (
                <motion.div
                  key={index}
                  className="media-container"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => {
                    trackMediaClick(media.type, media.src, media.caption);
                    setSelectedMedia(media);
                  }}
                >
                  {media.type === "image" ? (
                    <img
                      src={media.src}
                      alt={media.caption}
                      className="project-image"
                    />
                  ) : (
                    <video className="project-video-preview" src={media.src} />
                  )}
                  <p className="media-caption">{media.caption}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {selectedMedia && (
          <div className="modal" onClick={() => setSelectedMedia(null)}>
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedMedia(null)}>
                ×
              </button>
              {selectedMedia.type === "image" ? (
                <img
                  src={selectedMedia.src}
                  alt={selectedMedia.caption}
                  className="modal-image"
                />
              ) : (
                <video
                  controls
                  className="modal-video"
                  autoPlay
                  src={selectedMedia.src}
                />
              )}
              <p className="modal-caption">{selectedMedia.caption}</p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LifeSmart;
