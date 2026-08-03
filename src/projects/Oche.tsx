import React from "react";
import ProjectLayout from "../components/projects/ProjectLayout";
import {
  getProjectById,
  getProjectCategories,
  PROJECT_CATEGORY_META,
} from "../data/projects";

const APP_URL = "https://oche.humza-butt.space";
const API_DOCS_URL = "https://oche.humza-butt.space/docs/";
const REPO_URL = "https://github.com/Hum2a/oche";

const ocheProject = getProjectById("oche");
const surfaceCategories = getProjectCategories(ocheProject);

const terminalLines = [
  "boot venue scoreboard…",
  "stack: React 19 · Hono · Neon RLS · Workers",
  "realtime: Durable Object WebSockets",
  "media: R2 signed URLs · byte-range MP4",
  "envs: staging + production isolated",
  "deploy: oche.humza-butt.space",
  "ready · edit a score · watch the board sync",
];

const projectInfo = `const project = {
  name: "Oche",
  type: "Game Session Dashboard",
  description:
    "Venue live scores, match history, and session video for competitive-socialising games.",
  stack: [
    "React 19 + Vite",
    "Hono on Cloudflare Workers",
    "Neon Postgres + RLS",
    "Durable Object WebSockets",
    "R2 media",
  ],
  features: [
    "Live score editing",
    "Realtime multi-device sync",
    "Match history + video",
    "Multi-venue RLS isolation",
  ],
};`;

const features = [
  "Live session overview with player photos, scores, and active/completed status",
  "Editable scores with optimistic UI and rollback on error",
  "Real-time sync via Durable Object WebSockets (polling fallback)",
  "Match history with cursor pagination, virtualised list, filters, and search",
  "Session detail with MP4 playback (byte-range seek), optional HLS, timeline seek",
  "Export scorecard preview modal for print/PDF",
  "Create session and end-session lifecycle with completion analytics",
  "Multi-venue demo switcher (Venue A/B) with owner-scoped data isolation",
  "Share board link for second-device live viewing",
  "R2 media upload with mime/size validation and signed URLs",
  "Postgres row-level security on every table",
  "OpenAPI 3.1 docs at /docs",
  "PWA service worker caching for flaky venue Wi‑Fi",
  "Isolated staging and production environments",
];

const techStack = [
  "React",
  "TypeScript",
  "Vite",
  "Tailwind CSS",
  "TanStack Query",
  "Hono",
  "Cloudflare Workers",
  "Cloudflare Pages",
  "Durable Objects",
  "WebSockets",
  "Neon",
  "PostgreSQL",
  "Drizzle ORM",
  "Row-Level Security",
  "R2",
  "Zod",
  "PWA",
  "Playwright",
];

const Oche = () => {
  return (
    <ProjectLayout
      title="Oche"
      terminalLines={terminalLines}
      terminalPrompt="$"
      terminalTitle="oche.sh"
      logo={`/logos/Oche.png`}
      codeSnippet={projectInfo}
      embedUrl={APP_URL}
      embedTitle="Oche live demo"
      embedSandbox
      embedNewTabLabel="Open live app →"
      features={features}
      techStack={techStack}
    >
      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Overview
        </h2>
        <p className="section-description">
          Venue operators need a fast, multi-tenant dashboard for live games (darts, golf, and
          similar): see players and scores update in real time, edit scores, browse past matches,
          and play back session video. Oche is a React SPA plus Hono API on Cloudflare Workers,
          with Neon Postgres (RLS on every table), Durable Object WebSockets, and R2 media.
          Isolated staging and production environments; built as a 501 Entertainment Cloud
          Developer take-home that maps cleanly to a Hub-style live-games product.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Surfaces
        </h2>
        <div className="project-surfaces" aria-label="Project surface types">
          {surfaceCategories.map((categoryId) => {
            const meta = PROJECT_CATEGORY_META[categoryId];
            return (
              <span
                key={categoryId}
                className={`surface-pill surface-pill--${categoryId}`}
                title={meta.hint}
              >
                {meta.label}
              </span>
            );
          })}
        </div>
        <p className="section-description">
          Oche ships as a venue-facing web app and a realtime game dashboard. The live scoreboard
          is the primary surface; match history, session video, and multi-venue isolation sit on
          the same SPA with edge APIs and WebSocket sync behind the scenes.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Links
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-button"
          >
            Live app →
          </a>
          <a
            href={API_DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-button external-link-button--secondary"
          >
            OpenAPI docs →
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-button external-link-button--secondary"
          >
            GitHub →
          </a>
        </div>
      </section>
    </ProjectLayout>
  );
};

export default Oche;
