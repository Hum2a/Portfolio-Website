import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import Terminal from "../components/animations/Terminal";
import CodeBlock from "../components/animations/CodeBlock";
import "../styles/NetworthTool.css";

const NETWORTH_PROD_URL = "https://networthtool.lifesmartfinance.com";
const NETWORTH_STAGING_URL = "https://networthtool-staging.lifesmartfinance.com";
const API_PROD_URL = "https://api-networthtool.lifesmartfinance.com";
const API_STAGING_URL = "https://api-networthtool-staging.lifesmartfinance.com";

const NetworthTool = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const projectInfo = `const networthTool = {
  name: "Networth Tool",
  type: "full-stack-pwa",
  description:
    "LifeSmart Finance consumer PWA for net worth tracking, onboarding, learning paths, and phased monetization—React SPA plus Hono API on Cloudflare Workers with Neon Postgres and strict RLS.",
  stack: [
    "React 19",
    "TypeScript",
    "Vite 8",
    "Tailwind CSS v4",
    "Hono",
    "Cloudflare Workers",
    "Neon PostgreSQL",
    "Better Auth",
    "Stripe",
    "Vitest",
    "Playwright",
  ],
  features: [
    "PWA install + offline-friendly static caching",
    "Better Auth sessions + Google OAuth option",
    "Onboarding and home net-worth experience",
    "Learn tab with lessons and lesson player routes",
    "Analytics tab + server ingest endpoints",
    "Access codes and Stripe checkout flows",
    "Admin dashboard (users, content, codes, query terminal)",
    "RLS-scoped Postgres with encryption helpers for app PII",
  ],
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
    "React 19 + Vite 8 + TypeScript 5.7",
    "Tailwind CSS v4 + Radix + shadcn-style tokens + Lucide + Recharts",
    "PWA (vite-plugin-pwa, Workbox)",
    "Hono on Cloudflare Workers (API, nodejs_compat)",
    "Neon Postgres + Drizzle ORM + RLS",
    "Better Auth (email/password, Google OAuth, Resend reset)",
    "Stripe + Resend + AWS SDK (R2-style presigns)",
    "Vitest + Playwright + GitHub Actions CI",
    "npm workspaces monorepo (apps/web, apps/api, packages/db)",
  ];

  const features = [
    "Installable PWA with manifest and Workbox-driven caching",
    "Mobile-first shell: Home, Learn, Analytics, Me, Badges",
    "Guided onboarding and session-protected app shell",
    "Net worth domain: assets, debts, snapshots, goals, dashboard APIs",
    "Learning paths + admin content tooling",
    "Access codes, upgrades, Stripe checkout and webhooks",
    "Admin surfaces for users, progress, codes, revenue, analytics",
    "Dual staging/production Workers + hostnames for web and API",
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
            src={`${process.env.PUBLIC_URL}/logos/networth-tool.svg`}
            alt="Networth Tool"
            className="project-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="project-title">
            <span className="code-comment">//</span> Networth Tool
          </h1>
          <p className="section-description" style={{ maxWidth: "42rem", margin: "0 auto 1rem" }}>
            Mobile-first PWA for LifeSmart Finance: net worth, onboarding, learning paths,
            analytics, and access upgrades—built for consumers tracking wealth and financial literacy.
          </p>
          <Terminal
            lines={[
              "git clone lifesmartfinance/networth-tool",
              "npm ci && npm run check",
              "> typecheck · lint · vitest (@networth/api + workspaces)",
              "npm run dev",
              "  web → :5173   api → wrangler dev",
              "open https://networthtool.lifesmartfinance.com",
            ]}
            prompt="$"
            typingSpeed={28}
            autoStart={true}
            className="project-terminal"
            title="networth-tool.sh"
          />
        </div>

        <div className="project-content">
          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Project information
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
            transition={{ delay: 0.3 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Live product
            </h2>
            <p className="section-description">
              Production and staging frontends are public hostnames; the app is session-oriented
              (Better Auth) with allowlisted CORS—open in a new tab rather than expecting a
              third-party iframe to work reliably.
            </p>
            <div className="networth-live-note" role="note">
              No embedded preview here: framing/CSP is not guaranteed on Workers, and cookie-based
              auth typically breaks or degrades inside cross-site iframes. Visit the site directly
              to sign in and explore.
            </div>
            <div className="networth-link-row">
              <a
                href={NETWORTH_PROD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="external-link-button"
              >
                Visit production →
              </a>
              <a
                href={NETWORTH_STAGING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="external-link-button external-link-button--secondary"
              >
                Open staging (reviewers) →
              </a>
            </div>
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Deployment endpoints
            </h2>
            <p className="section-description">
              Web and API use separate Cloudflare Worker routes (from Wrangler configs). API hosts
              serve Better Auth and REST for the SPA—they are not casual public APIs for third
              parties.
            </p>
            <dl className="networth-deploy-grid">
              <div>
                <dt>Web (production)</dt>
                <dd>
                  <a href={NETWORTH_PROD_URL} target="_blank" rel="noopener noreferrer">
                    {NETWORTH_PROD_URL}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Web (staging)</dt>
                <dd>
                  <a href={NETWORTH_STAGING_URL} target="_blank" rel="noopener noreferrer">
                    {NETWORTH_STAGING_URL}
                  </a>
                </dd>
              </div>
              <div>
                <dt>API (production)</dt>
                <dd>{API_PROD_URL}</dd>
              </div>
              <div>
                <dt>API (staging)</dt>
                <dd>{API_STAGING_URL}</dd>
              </div>
            </dl>
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Overview
            </h2>
            <p className="section-description">
              Delivered as an npm monorepo so the Vite/React client, Hono API, and shared Drizzle
              migrations stay aligned across staging and production. Features ship in phases (auth,
              onboarding, Learn, payments, admin); Neon Postgres uses row-level security with an
              app-layer encryption helper for selected PII columns where documented.
            </p>
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
            transition={{ delay: 0.5 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Tech stack
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

export default NetworthTool;
