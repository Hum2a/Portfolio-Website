import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import Terminal from "../components/animations/Terminal";
import CodeBlock from "../components/animations/CodeBlock";
import "../styles/project-shared.css";

const FIREWATCH_REPO_URL = "https://github.com/Hum2a/fire-intelligence-dashboard";

const FireWatch = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const projectInfo = `const projectInfo = {
  name: "FireWatch - Fire Intelligence Dashboard",
  type: "Full-stack geospatial web app",
  description:
    "Map-first wildfire intelligence dashboard with metre-accurate proximity checks, timeline analysis, and operational watch-zone workflows.",
  stack: [
    "Angular 21",
    "TypeScript",
    "OpenLayers",
    "Node.js",
    "Express",
    "PostgreSQL",
    "PostGIS",
    "Cloudflare Workers",
    "Docker Compose"
  ],
  features: [
    "Geodesic 1 km proximity checks with ST_DWithin geography",
    "Interactive perimeter map with highlight and buffer overlays",
    "Timeline scrub/playback and compare-delta mode",
    "Watch zones and local alert-rule simulation",
    "Analytics charts for FWI, country spread, trend, and severity",
    "Data table with reverse geocoding and export snapshots"
  ]
};`;

  const features = [
    "Interactive wildfire map with OpenLayers vector rendering",
    "Server-side geodesic proximity checks (default 1 km) for metre-accurate results",
    "Timeline scrubber with autoplay to inspect perimeter progression",
    "Watch-zone workflows for local monitoring and alert simulation",
    "Analytics and data table explorer with export-ready incident brief snapshots",
    "Dockerized architecture with Angular frontend + Express/PostGIS backend",
  ];

  const techStack = [
    "Angular 21, TypeScript, OpenLayers",
    "Node.js, Express, Zod",
    "PostgreSQL 16 + PostGIS geography queries",
    "Cloudflare Workers + Cloudflare Containers",
    "Docker Compose orchestration",
    "Vitest, Supertest, Playwright, GitHub Actions",
  ];

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
            src={`${process.env.PUBLIC_URL}/logos/firewatch-logo.svg`}
            alt="FireWatch logo"
            className="project-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="project-title">
            <span className="code-comment">//</span> FireWatch
          </h1>
          <Terminal
            lines={[
              "booting firewatch stack...",
              "loading wildfire perimeters into postgis...",
              "serving angular ops dashboard on /map",
              "running geodesic proximity query (radius: 1000m)",
              "highlighting at-risk polygons in real time",
              "syncing watch zones and alert rules",
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
              FireWatch is a map-first wildfire intelligence dashboard designed for analysts who need
              accurate spatial decisions under time pressure. It combines an Angular + OpenLayers
              frontend with an Express + PostGIS backend so perimeter-distance calculations run
              server-side using geodesic geography operations.
            </p>
            <p className="section-description">
              It supports exploratory analysis (filters, timelines, analytics) and operational flows
              (watch zones, alerts, and incident briefing export) in one system, aimed at balancing
              geospatial correctness with clear UX.
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
            transition={{ delay: 0.45 }}
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

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Links
            </h2>
            <p className="section-description">
              Live deployment URL is not confirmed in this repository yet. For now, use the source
              repository as the canonical reference.
            </p>
            <a
              href={FIREWATCH_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link-button"
            >
              Open GitHub repository →
            </a>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
};

export default FireWatch;
