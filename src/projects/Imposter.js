import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import Terminal from "../components/animations/Terminal";
import CodeBlock from "../components/animations/CodeBlock";
import ProjectSiteEmbed from "../components/ProjectSiteEmbed";
import "../styles/project-shared.css";

const WEB_APP_URL = "https://imposter-game.pages.dev";

const Imposter = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const projectInfo = `const imposter = {
  name: "Imposter",
  tagline: "Who do you trust?",
  type: "Discord Activity + Web / PWA",
  description:
    "Word imposter party game: clues, votes, reveal — one client, PartyKit authority",
  stack: [
    "React 19, Vite 8, TypeScript, Tailwind v4, Radix / shadcn-style UI",
    "PartyKit WebSocket rooms (authoritative state machine)",
    "Cloudflare Pages + Worker (Discord OAuth; client secret never in browser)",
    "Optional Supabase: profiles, history, stats, saved word lists (RLS)",
  ],
  surfaces: ["Discord Activity iframe", "Open web / PWA"],
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
    "React 19, Vite 8, TypeScript 5.9, Tailwind CSS v4, partysocket",
    "PartyKit server (TypeScript): phases, timers, clue validation, voting",
    "@discord/embedded-app-sdk, Cloudflare Worker token exchange",
    "i18next / react-i18next (EN + ES pattern)",
    "Optional Supabase Auth + Postgres + RLS",
    "ESLint, Playwright e2e, GitHub Actions CI",
    "Deploy: Wrangler Pages, Worker, PartyKit CLI (`npm run deploy`)",
  ];

  const features = [
    "Lobby with word packs, custom pairs, timers, host options (rotate host, new words per round)",
    "Timed one-word clue rounds with server-enforced format (Unicode letter-aware)",
    "Clue reveal, suspicion marks, host-driven flow into voting",
    "Timed voting (skip vs accuse); server resolves outcomes",
    "Same React app in Discord’s iframe and in the browser; shared PartyKit host",
    "Join hardening: optional Discord verification, party JWT, rate limits (documented threat model)",
    "Guest play on web; optional cloud profiles with RLS-protected tables",
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
            src={`${process.env.PUBLIC_URL}/logos/Imposter.svg`}
            alt="Imposter Logo"
            className="project-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="project-title">
            <span className="code-comment">//</span> Imposter
          </h1>
          <Terminal
            lines={[
              "const imposter = {",
              "  name: 'Imposter',",
              "  surfaces: ['Discord Activity', 'Web / PWA'],",
              "  realtime: 'PartyKit authoritative rooms',",
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
            <a
              href={WEB_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link-button"
            >
              Play on web →
            </a>
          </motion.section>

          <motion.section
            className="project-section"
            aria-labelledby="imposter-live-site-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
          >
            <h2 className="section-title" id="imposter-live-site-heading">
              <span className="code-comment">//</span> Live site
            </h2>
            <p className="section-description">
              The web / PWA build loads below when you scroll (lazy iframe). If the frame stays blank,
              the host may block embedding—use Play on web above.
            </p>
            <ProjectSiteEmbed
              url={WEB_APP_URL}
              iframeTitle="Imposter — word party game"
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
              Imposter is a real-time multiplayer &ldquo;word imposter&rdquo; party game. Players receive
              a secret word—or a different word when they are the imposter—then submit one-word clues
              across timed rounds and vote. The experience ships as a Discord Activity embedded in
              voice channels and as a standalone web app / PWA, sharing one React client and one
              authoritative PartyKit game server that validates every phase transition, clue, and vote.
            </p>
            <p className="section-description">
              A Cloudflare Worker proxies Discord OAuth so the client secret never ships to the
              browser; optional Supabase adds accounts, round history, stats, and synced word lists
              behind RLS, while guests can still play with session-local identity.
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

export default Imposter;
