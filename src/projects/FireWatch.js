import React from "react";
import ProjectLayout from "../components/projects/ProjectLayout";

const FIREWATCH_REPO_URL = "https://github.com/Hum2a/fire-intelligence-dashboard";

const terminalLines = [
  "booting firewatch stack...",
  "loading wildfire perimeters into postgis...",
  "serving angular ops dashboard on /map",
  "running geodesic proximity query (radius: 1000m)",
  "highlighting at-risk polygons in real time",
  "syncing watch zones and alert rules",
];

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

const FireWatch = () => {
  return (
    <ProjectLayout
      title="FireWatch"
      terminalLines={terminalLines}
      logo={`${process.env.PUBLIC_URL}/logos/firewatch-logo.svg`}
      codeSnippet={projectInfo}
      features={features}
      techStack={techStack}
    >
      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Overview
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
      </section>

      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Links
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
      </section>
    </ProjectLayout>
  );
};

export default FireWatch;
