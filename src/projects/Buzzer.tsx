import React from "react";
import ProjectLayout from "../components/projects/ProjectLayout";
import {
  getProjectById,
  getProjectCategories,
  PROJECT_CATEGORY_META,
} from "../data/projects";

const PRODUCTION_URL = "https://buzzer.lifesmartfinance.com";
const REPO_URL = "https://github.com/lifesmart-financial-literacy/Buzzer";

const buzzerProject = getProjectById("buzzer");
const surfaceCategories = getProjectCategories(buzzerProject);

const terminalLines = [
  "boot classroom session",
  "join code minted — pupils stay anonymous",
  "sync via Durable Object + WebSockets",
  "individual round → team round → captain rotate",
  "score present seats only — no dead-device stall",
  "teacher force-advance always available",
  "neon rls: teacher-scoped data",
  "deploy: single cloudflare worker",
];

const projectInfo = `const project = {
  name: "Buzzer",
  client: "LifeSmart",
  type: "EdTech / live classroom game",
  status: "Live production — early / pilot",
  description:
    "Teacher-led financial literacy lessons for schools. Pupils join anonymously by code; teams have names, never pupil names.",
  stack: [
    "React 19",
    "Hono",
    "Cloudflare Workers",
    "Durable Objects",
    "Neon Postgres",
    "Better Auth",
  ],
  features: [
    "Live front screen + pupil devices",
    "WebSocket classroom sync",
    "Safeguarding-first anonymity",
    "Teacher + staff consoles",
  ],
};`;

const features = [
  "Teacher dashboard: classes, start/resume live sessions, lesson preview",
  "Projected front screen for the classroom with scores, timers, and podium",
  "Pupil join by short code — no pupil accounts or names",
  "Live multiplayer sync via Durable Objects and WebSockets",
  "Individual rounds and team rounds with rotating captaincy",
  "Classroom resilience: reconnect with seat token, auto captain pass, teacher force-advance",
  "Anonymous team names with profanity filter",
  "Teacher auth: sign-up, email verification, password reset, magic link",
  "Staff admin console for ops, emails, analytics, and submissions review",
  "Product analytics without storing pupil identity",
  "Row Level Security for teacher-scoped data on Neon",
];

const techStack = [
  "React 19",
  "TypeScript",
  "Vite",
  "Tailwind CSS",
  "Hono",
  "Cloudflare Workers",
  "Durable Objects",
  "Neon",
  "Drizzle ORM",
  "Better Auth",
  "Resend",
  "Vitest",
  "Playwright",
  "Game",
];

const Buzzer = () => {
  return (
    <ProjectLayout
      title="Buzzer"
      terminalLines={terminalLines}
      terminalPrompt="$"
      terminalTitle="buzzer.sh"
      terminalSpeed={32}
      logo={`/logos/Buzzer.png`}
      codeSnippet={projectInfo}
      features={features}
      techStack={techStack}
    >
      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Overview
        </h2>
        <p className="section-description">
          <strong>Built for LifeSmart.</strong> Schools needed a classroom game that teaches money
          skills without collecting pupil identity. Buzzer lets a teacher run a lesson from a front
          screen while pupil teams join on their own devices with a short code. Play alternates
          individual and team rounds with rotating captains; teams have names, never pupil names.
          The product ships as a single Cloudflare Worker (SPA + API + Durable Objects) with Neon
          Postgres, teacher-only auth, and safeguarding-first design.
        </p>
        <p className="section-description">
          Status: <strong>Live production — early / pilot</strong> (in early classroom rollout).
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
          One Worker serves the React SPA, REST API, and realtime classroom sessions. Teachers use
          the dashboard and projected <code>/screen</code> route; pupils play at <code>/play</code>{" "}
          with a join code. Staff operations live behind <code>/staff</code>.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Safeguarding
        </h2>
        <p className="section-description">
          Pupils never create accounts or enter their names. Teams are identified by anonymous
          labels only; product analytics use HMAC continuity keys with no pupil PII. Teacher data
          is scoped with Postgres row-level security.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Links
        </h2>
        <p className="section-description">
          Visit the production site for the public landing. Full classroom play requires a teacher
          account and real devices — not suitable for iframe demos.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <a
            href={PRODUCTION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-button"
          >
            Open Buzzer →
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-button external-link-button--secondary"
          >
            GitHub (LifeSmart) →
          </a>
        </div>
      </section>
    </ProjectLayout>
  );
};

export default Buzzer;
