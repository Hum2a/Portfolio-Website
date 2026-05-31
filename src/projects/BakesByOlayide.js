import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import Terminal from "../components/animations/Terminal";
import CodeBlock from "../components/animations/CodeBlock";
import ProjectSiteEmbed from "../components/ProjectSiteEmbed";
import "../styles/project-shared.css";
import "../styles/BakesByOlayide.css";

const BAKES_SITE_URL = "https://bakesbyolayide.co.uk";

const BakesByOlayide = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const projectInfo = `const bakesByOlayide = {
  name: "BakesByOlayide",
  type: "E-commerce Platform",
  description: "E-commerce platform for custom baked goods and desserts",
  technologies: [
    "React.js",
    "Node.js",
    "Firebase",
    "Stripe"
  ],
  features: [
    "Custom cake ordering",
    "Product catalog",
    "Secure payment processing",
    "Order management",
    "User accounts"
  ]
};`;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
            src={`${process.env.PUBLIC_URL}/logos/BakesByOlayide.png`}
            alt="BakesByOlayide Logo"
            className="project-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="project-title">
            <span className="code-comment">//</span> BakesByOlayide
          </h1>
          <Terminal
            lines={[
              "const bakesByOlayide = {",
              "  name: 'BakesByOlayide',",
              "  type: 'E-commerce Platform',",
              "  description: 'E-commerce platform for custom baked goods',",
              "  url: 'https://bakesbyolayide.co.uk'",
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
              href={BAKES_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link-button"
            >
              Visit the Website →
            </a>
          </motion.section>

          <motion.section
            className="project-section"
            aria-labelledby="bakes-live-site-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
          >
            <h2 className="section-title" id="bakes-live-site-heading">
              <span className="code-comment">//</span> Live site
            </h2>
            <p className="section-description">
              Storefront preview (lazy-loaded iframe).
            </p>
            <ProjectSiteEmbed url={BAKES_SITE_URL} iframeTitle="BakesByOlayide" />
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> About
            </h2>
            <p className="section-description">
              BakesByOlayide offers a seamless online experience for ordering bespoke cakes and baked goods. Whether you're celebrating a birthday, wedding, or any special event, our platform makes it easy to customize, order, and enjoy delicious treats with just a few clicks.
            </p>
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Engineering Excellence
            </h2>
            <div className="engineering-grid">
              <div className="engineering-card">
                <span className="engineering-icon">🎠</span>
                <strong>Sophisticated Carousel</strong>
                <p>Custom-built, touch-friendly, hardware-accelerated, and responsive.</p>
              </div>
              <div className="engineering-card">
                <span className="engineering-icon">🎨</span>
                <strong>Advanced CSS Architecture</strong>
                <p>Responsive, animated, and themable with CSS Grid & Flexbox.</p>
              </div>
              <div className="engineering-card">
                <span className="engineering-icon">⚡</span>
                <strong>Performance Optimizations</strong>
                <p>Hardware-accelerated, efficient image loading, and smooth transitions.</p>
              </div>
              <div className="engineering-card">
                <span className="engineering-icon">♿</span>
                <strong>Accessibility Features</strong>
                <p>ARIA labels, semantic HTML, keyboard navigation, and high contrast.</p>
              </div>
              <div className="engineering-card">
                <span className="engineering-icon">🛡️</span>
                <strong>Robust Error Handling</strong>
                <p>Graceful fallbacks, loading states, and error boundaries.</p>
              </div>
              <div className="engineering-card">
                <span className="engineering-icon">🔄</span>
                <strong>State Management</strong>
                <p>Efficient, predictable, and clean separation of UI and logic.</p>
              </div>
              <div className="engineering-card">
                <span className="engineering-icon">📦</span>
                <strong>Code Organization</strong>
                <p>Modular, reusable, and well-documented components.</p>
              </div>
              <div className="engineering-card">
                <span className="engineering-icon">✨</span>
                <strong>User Experience</strong>
                <p>Smooth transitions, intuitive navigation, and responsive feedback.</p>
              </div>
              <div className="engineering-card">
                <span className="engineering-icon">📱</span>
                <strong>Mobile-First Approach</strong>
                <p>Touch-friendly, responsive, and optimized for all devices.</p>
              </div>
              <div className="engineering-card">
                <span className="engineering-icon">🛠️</span>
                <strong>Maintainability</strong>
                <p>DRY principles, consistent styling, and easy to extend.</p>
              </div>
              <div className="engineering-card">
                <span className="engineering-icon">🔒</span>
                <strong>Security</strong>
                <p>Safe input handling, secure image loading, and protected routes.</p>
              </div>
              <div className="engineering-card">
                <span className="engineering-icon">🧪</span>
                <strong>Testing</strong>
                <p>Testable, isolated, and predictable component logic.</p>
              </div>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
};

export default BakesByOlayide;
