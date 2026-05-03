import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import Terminal from "../components/animations/Terminal";
import CodeBlock from "../components/animations/CodeBlock";
import ProjectSiteEmbed from "../components/ProjectSiteEmbed";
import useMediaTracking from "../hooks/useMediaTracking";
import "../styles/project-shared.css";
import "../styles/LifeSmart.css";

/** Hub / marketing entry */
const LIFESMART_HUB_URL = "https://home.lifesmartfinance.com";

/** Deployed URL per tool (SPZeroFinance subdomains) */
const LIFESMART_TOOL_URLS = {
  spzero: "https://spzero.lifesmartfinance.com",
  "spzero-calculator": "https://investing-tool.lifesmartfinance.com",
  misc: "https://home.lifesmartfinance.com",
  "financial-quiz": "https://financial-quiz.lifesmartfinance.com",
  "asset-market-simulation": "https://home.lifesmartfinance.com",
  "budget-tool": "https://lifebalance.lifesmartfinance.com",
  "investment-calculator": "https://investing-tool.lifesmartfinance.com",
};

const projects = [
  {
    id: "spzero",
    title: "SpZero – Financial Education Platform",
    description: "A comprehensive, modern financial education platform developed for SPZeroFinance. Built with React, TypeScript, and Cloudflare Workers, featuring interactive learning modules, video content, quizzes, and a powerful admin dashboard with real-time analytics.",
    features: [
      "Interactive module-based learning with 4 comprehensive financial education modules",
      "Video and slide content management with Cloudflare R2 storage",
      "Progress tracking with automatic save functionality",
      "Interactive quizzes with scoring and feedback",
      "Real-time analytics dashboard tracking user engagement and content performance",
      "Admin dashboard with user management, content management, and comprehensive reporting",
      "SSO integration with SPZeroFinance for seamless authentication",
      "Database-backed with PostgreSQL and Drizzle ORM",
      "Export functionality for users, modules, analytics, and system reports",
      "Responsive design optimized for all devices",
    ],
    techStack: [
      "React.js + Vite + TypeScript",
      "Tailwind CSS",
      "Hono (Backend API)",
      "Cloudflare Workers",
      "PostgreSQL + Drizzle ORM",
      "Better-auth (Authentication)",
      "Cloudflare R2 (Media Storage)",
      "Zustand (State Management)",
      "Recharts (Analytics Visualization)",
    ],
    media: [
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/SpZero/Home Page - Overview (Full).png`, caption: "SpZero Homepage - Complete platform overview showcasing the modern, gradient-based design" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/SpZero/Home Page - Overview.png`, caption: "Homepage Hero Section - Clean and inviting entry point to financial education" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/SpZero/Module Road Layout.png`, caption: "Interactive Learning Path - Visual module progression with 4 main areas: Foundations of Money, Personal Finance, Credit & Debt, and Investing" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/SpZero/Video Modal.png`, caption: "Video Content Player - Full-screen video player with progress tracking and seamless navigation" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/SpZero/Slides Modal.png`, caption: "Presentation Viewer - Interactive slide viewer for educational content with navigation controls" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/SpZero/Video and Slide Progress Saving.png`, caption: "Progress Tracking System - Automatic save functionality preserving user progress across sessions" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/SpZero/Admin Analytics General Stats.png`, caption: "Admin Analytics Dashboard - Comprehensive overview of user engagement, content performance, and system metrics" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/SpZero/Admin Analytics Content Drilldown.png`, caption: "Content Analytics Drilldown - Detailed analytics for modules, sections, and topics with engagement heatmaps" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/SpZero/Admin User Focused Analytics.png`, caption: "User-Centric Analytics - Individual user tracking, activity logs, and learning progress monitoring" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/SpZero/Admin Module Management.png`, caption: "Content Management Interface - Full CRUD operations with drag-and-drop module reordering and content organization" },
    ],
  },
  {
    id: "spzero-calculator",
    title: "SpZero Calculator Widget",
    description: "Professional credit card interest and investment calculator widget embedded as an iframe on SPZeroFinance's main website. Features real-time interest calculations, SPZero 0% APR comparisons, and compound interest investment projections with interactive Chart.js visualizations.",
    features: [
      "Credit card interest calculator with real-time APR calculations",
      "SPZero 0% APR card comparison showing potential savings",
      "Interactive balance paid-off slider with 5% increments",
      "Investment growth calculator with compound interest visualization",
      "Chart.js powered interactive growth charts (1-30 year projections)",
      "Dark/Light mode with smooth purple theme transitions",
      "Fully responsive design optimized for iframe embedding",
      "Type-safe TypeScript implementation",
      "Fast load times with Vite optimization",
      "Deployed on Cloudflare Workers for edge performance",
    ],
    techStack: [
      "React 19.2.0",
      "TypeScript 5.9.3",
      "Vite 7.1.9",
      "Tailwind CSS 3.4.18",
      "Chart.js 4.5.0",
      "React Chart.js 2",
      "React Icons",
      "Cloudflare Workers",
      "Wrangler 4.42.1",
      "Vitest 3.2.4",
      "Playwright 1.48.2",
      "Prettier 3.3.3",
    ],
    media: [
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/SpZero Calculator/SpZero I frame calculator.png`, caption: "SpZero Calculator Widget - Professional iframe calculator embedded on SPZeroFinance website showing credit card interest calculations and investment growth projections" },
    ],
  },
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
  client: "SPZeroFinance",
  description: "Enterprise financial education platform with interactive learning",
  mainProject: {
    name: "SpZero Platform",
    stack: [
      "React + Vite + TypeScript",
      "Tailwind CSS",
      "Hono + Cloudflare Workers",
      "PostgreSQL + Drizzle ORM",
      "Better-auth",
      "Cloudflare R2 Storage"
    ],
    features: [
      "Module-based learning system",
      "Video & slide content",
      "Progress tracking",
      "Real-time analytics",
      "Admin dashboard",
      "SSO integration"
    ]
  },
  otherTools: [
    "Financial Quiz",
    "Asset Market Simulation",
    "Budget Planning Tool",
    "Investment Calculator"
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

  const toolLiveUrl =
    LIFESMART_TOOL_URLS[selectedProject.id] ?? LIFESMART_HUB_URL;

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
              "  type: 'Financial Education Platform',",
              "  client: 'SPZeroFinance',",
              "  mainProject: 'SpZero Learning Platform',",
              "  stack: 'React + TypeScript + Cloudflare',",
              "  hub: 'https://home.lifesmartfinance.com',",
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
              href={LIFESMART_HUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link-button"
            >
              Open LifeSmart hub →
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
            {selectedProject.techStack && (
              <div className="tech-stack-section">
                <h3 className="tech-stack-title">
                  <span className="code-comment">//</span> Tech Stack
                </h3>
                <div className="tech-stack-grid">
                  {selectedProject.techStack.map((tech, index) => (
                    <div key={index} className="tech-badge">
                      <span className="tech-icon">⚡</span>
                      <span className="tech-name">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.section>

          <motion.section
            className="project-section"
            aria-labelledby="lifesmart-live-preview-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            key={`live-${selectedProject.id}`}
          >
            <h2 className="section-title" id="lifesmart-live-preview-heading">
              <span className="code-comment">//</span> Live preview
            </h2>
            <p className="section-description">
              Deployed instance for <strong>{selectedProject.title}</strong> (
              {toolLiveUrl.replace(/^https:\/\//, "")}). Other tools use their own subdomains—pick a
              tool above to switch the preview.
            </p>
            <a
              href={toolLiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link-button"
            >
              Open in new tab →
            </a>
            <ProjectSiteEmbed
              url={toolLiveUrl}
              iframeTitle={`LifeSmart — ${selectedProject.title}`}
            />
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
