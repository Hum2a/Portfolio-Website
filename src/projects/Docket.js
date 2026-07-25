import React from "react";
import { Link } from "react-router-dom";
import ProjectLayout from "../components/projects/ProjectLayout";
import {
  getProjectById,
  getProjectCategories,
  PROJECT_CATEGORY_META,
} from "../data/projects";

const PRODUCTION_URL = "https://jobtracker.humza-butt.space";
const REPO_URL = "https://github.com/Hum2a/jobtracker";

const docketProject = getProjectById("docket");
const surfaceCategories = getProjectCategories(docketProject);

const terminalLines = [
  "boot Docket — personal job pipeline",
  "mount Worker + Neon + R2",
  "stages: wishlist → applied → interview → offer → rejected",
  "board: drag status · list: filter & sort",
  "notify: Resend on create / status change",
  "digest: cron reminders due within 3 days",
  "auth: API key writes · no multi-user login",
  "ready on jobtracker.humza-butt.space",
];

const projectInfo = `const project = {
  name: "Docket",
  type: "Full-stack WebApp",
  description:
    "Single-owner job application tracker with Kanban, docs, and email alerts.",
  stack: [
    "React",
    "Vite",
    "Hono",
    "Cloudflare Workers",
    "Neon",
    "R2",
    "Resend",
    "Zod",
  ],
  features: [
    "Kanban board with drag-and-drop",
    "List, detail, stats, settings",
    "Reminders & due-soon digests",
    "R2 document storage",
    "Resend event emails",
  ],
};`;

const features = [
  "Five-column Kanban board with drag-and-drop status updates",
  "Quick create (company / position / industry required)",
  "Sortable, filterable application list with inline status select",
  "Application detail: fields, notes thread, reminders, per-app documents",
  "Stats dashboard: tiles, funnel %, Recharts (status, industry, source, time)",
  "Settings: global resume/cover templates, JSON bulk import, notify recipients",
  "Due-soon reminders (within 3 days) on board, detail, and digests",
  "Private R2 storage with short-lived HMAC download URLs",
  "Resend alerts on create + status change; daily reminder digest",
  "Shared Zod domain model between Worker and SPA",
  "Single-owner model: API-key writes, no accounts or multi-user CRM",
];

const techStack = [
  "React",
  "TypeScript",
  "Vite",
  "Hono",
  "Cloudflare Workers",
  "Neon",
  "PostgreSQL",
  "R2",
  "Resend",
  "Zod",
  "Recharts",
  "React Router",
  "dnd-kit",
  "Kanban",
  "SPA",
  "WebApp",
];

const Docket = () => {
  return (
    <ProjectLayout
      title="Docket"
      terminalLines={terminalLines}
      terminalPrompt="$"
      terminalTitle="docket.sh"
      terminalSpeed={32}
      logo={`${process.env.PUBLIC_URL}/logos/Docket.svg`}
      codeSnippet={projectInfo}
      embedUrl={PRODUCTION_URL}
      embedTitle="Docket"
      embedSandbox
      embedNewTabLabel="Open Docket →"
      features={features}
      techStack={techStack}
    >
      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Overview
        </h2>
        <p className="section-description">
          Docket replaces spreadsheet-style job hunting with a focused pipeline: wishlist → applied
          → interview → offer → rejected. A React SPA (Board, List, Detail, Stats, Settings) talks
          to a Hono API on Cloudflare Workers, backed by Neon Postgres and R2 for resumes/cover
          letters. Status changes and new applications can trigger Resend emails; a daily cron
          digests due-soon reminders. Writes are gated by a browser-stored API key rather than
          multi-user auth.
        </p>
        <p className="section-description">
          This is Humza&apos;s personal instance. A related build for Baseer lives at{" "}
          <Link to="/docket-baseer">/docket-baseer</Link>.
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
          Single Worker serves the SPA assets and <code>/api</code> on one origin (
          <code>jobtracker.humza-butt.space</code>). Public UI is readable without login; writes
          prompt for an API key.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Links
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <a
            href={PRODUCTION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-button"
          >
            Visit Docket →
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

export default Docket;
