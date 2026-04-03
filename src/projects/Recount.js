import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import Terminal from "../components/animations/Terminal";
import CodeBlock from "../components/animations/CodeBlock";
import "../styles/project-shared.css";

const Recount = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const projectInfo = `const recount = {
  name: "Recount",
  type: "Productivity (extension + web + API)",
  description:
    "Passive time tracking by domain, dashboard & billing, staff admin",
  stack: [
    "Chrome MV3 extension (esbuild, Tailwind)",
    "Next.js 14 App Router + Supabase SSR",
    "Express API + Cloudflare Worker (Hono) parity",
    "Supabase Auth + Postgres (RLS + service role)",
    "Stripe, OpenAI reports, Resend email",
  ],
  packages: ["extension", "web", "api", "api-worker", "shared"],
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
    "Next.js 14 (App Router), React, TypeScript, Tailwind CSS",
    "Chrome Extension MV3, esbuild, Zustand, Recharts, Framer Motion",
    "Express 4 (ESM), Hono on Cloudflare Workers",
    "Supabase (Auth, Postgres, RLS); Zod, Pino",
    "Stripe (checkout + webhooks), OpenAI, Resend",
    "Vitest, Supertest, GitHub Actions CI",
    "npm workspaces monorepo",
  ];

  const features = [
    "Extension passively aggregates active tab time by domain and batches events to the API",
    "Web app: marketing site plus authenticated dashboard (intentions, history, reports, settings)",
    "Elevated staff roles for admin analytics and operations",
    "REST API owns mutations and privileged reads; browser uses anon JWT + RLS where appropriate",
    "Stripe licensing with idempotent webhook processing",
    "Optional AI-generated daily reports and email digests (Resend)",
    "Shared package for domain classification and app roles",
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
            src={`${process.env.PUBLIC_URL}/logos/Recount.svg`}
            alt="Recount Logo"
            className="project-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="project-title">
            <span className="code-comment">//</span> Recount
          </h1>
          <Terminal
            lines={[
              "const recount = {",
              "  name: 'Recount',",
              "  type: 'Extension + Next.js + API',",
              "  data: 'Supabase + Stripe + OpenAI + Resend',",
              "};",
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
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Overview
            </h2>
            <p className="section-description">
              Recount is a productivity product built as an npm workspaces monorepo: a Chrome
              Manifest V3 extension passively tracks time by domain and sends batched events to a
              backend; a Next.js web app serves the marketing site and authenticated experience
              (intentions, history, reports, settings, and staff admin); and a REST API handles
              mutations and privileged reads against Supabase (Postgres and Auth), with Stripe for
              licensing, optional OpenAI for report generation, and Resend for transactional and
              digest email.
            </p>
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
            transition={{ delay: 0.5 }}
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

export default Recount;
