import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import Terminal from "../components/animations/Terminal";
import CodeBlock from "../components/animations/CodeBlock";
import "../styles/project-shared.css";
import "../styles/Monzo1pChallenge.css";

const Monzo1pChallenge = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const projectInfo = `const monzo1pChallenge = {
  name: "Monzo 1p Challenge Calculator",
  type: "Web Application",
  description: "Savings calculator inspired by the Monzo 1p challenge",
  stack: [
    "Next.js 16 (App Router)",
    "React 19",
    "TypeScript",
    "Tailwind CSS",
    "Radix UI / shadcn",
    "Prisma + Neon PostgreSQL",
    "Auth.js (NextAuth v5)",
    "Cloudflare Workers (OpenNext)"
  ],
  features: [
    "3 calculator modes: Next N days, Month, Custom range",
    "Anonymous use with localStorage",
    "Magic link sign-in (no password)",
    "Save/load up to 10 states per user",
    "PWA (installable on mobile)",
    "Monzo-inspired UI"
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

  const techStack = [
    "Next.js 16 (App Router)",
    "React 19",
    "TypeScript",
    "Tailwind CSS",
    "Radix UI / shadcn",
    "Prisma + Neon PostgreSQL",
    "Auth.js (NextAuth v5) – magic link via Resend",
    "Zod",
    "Cloudflare Workers (OpenNext)",
    "Vitest",
    "Playwright",
  ];

  const features = [
    "3 calculator modes: Next N days, Month, Custom range",
    "Anonymous use with localStorage",
    "Account sign-in via magic link (no password)",
    "Save/load up to 10 states per user",
    "PWA (installable on mobile)",
    "Monzo-inspired UI",
    "Rate limiting and Zod validation on API routes",
    "CI/CD with GitHub Actions",
    "Deploy to Cloudflare Workers (3 MiB bundle limit)",
  ];

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
            src={`${process.env.PUBLIC_URL}/logos/Monzo.png`}
            alt="Monzo 1p Challenge Logo"
            className="project-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="project-title">
            <span className="code-comment">//</span> Monzo 1p Challenge Calculator
          </h1>
          <Terminal
            lines={[
              "const monzo1pChallenge = {",
              "  name: 'Monzo 1p Challenge Calculator',",
              "  type: 'Web Application',",
              "  stack: 'Next.js 16 + React 19 + TypeScript',",
              "  features: ['3 calculator modes', 'PWA', 'Magic link auth']",
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
              href="https://monzo-1p-challenge-calculator.humzab1711.workers.dev"
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
            transition={{ delay: 0.35 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Live Demo
            </h2>
            <p className="section-description">
              Try the calculator below—configure your challenge settings and see your savings projection.
            </p>
            <div className="calculator-embed-wrapper">
              <iframe
                src="https://monzo-1p-challenge-calculator.humzab1711.workers.dev"
                title="Monzo 1p Challenge Calculator"
                className="calculator-iframe"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                loading="lazy"
              />
            </div>
            <a
              href="https://monzo-1p-challenge-calculator.humzab1711.workers.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="external-link-button external-link-button--secondary"
            >
              Open in new tab →
            </a>
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Features
            </h2>
            <div className="features-list">
              {features.map((feature, index) => (
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
            transition={{ delay: 0.55 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Tech Stack
            </h2>
            <div className="tech-stack-grid">
              {techStack.map((tech, index) => (
                <div key={index} className="tech-badge">
                  <span className="tech-icon">⚡</span>
                  <span className="tech-name">{tech}</span>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
};

export default Monzo1pChallenge;
