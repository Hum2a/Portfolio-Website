import React from "react";
import ProjectLayout from "../components/projects/ProjectLayout";
import {
  getProjectById,
  getProjectCategories,
  PROJECT_CATEGORY_META,
} from "../data/projects";

const PRODUCTION_URL = "https://docket.baseer.co.uk";
const REPO_URL = "https://github.com/Hum2a/Docket--Baseer";

const docketProject = getProjectById("docket");
const surfaceCategories = getProjectCategories(docketProject);

const terminalLines = [
  "boot docket — personal job pipeline",
  "mount apps/web (React 19 + Vite)",
  "mount apps/api (Hono → Workers)",
  "connect Neon + R2 + Resend",
  "kanban · list · stats · reminders",
  "notify on apply + status change",
  "owner mode: no login (OWNER_ID)",
  "ready → https://docket.baseer.co.uk",
];

const projectInfo = `const project = {
  name: "Docket",
  type: "Personal job application tracker",
  description:
    "Kanban + list + docs + stats for a single-owner search, with Resend alerts when roles are logged or statuses move.",
  stack: [
    "React 19",
    "Vite",
    "Hono",
    "Cloudflare Workers/Pages",
    "Neon Postgres",
    "Drizzle",
    "R2",
    "Resend",
  ],
  features: [
    "Drag-and-drop kanban pipeline",
    "Searchable/filterable application list",
    "Notes, reminders, resume storage",
    "Analytics funnel and charts",
    "Email digests and status notifications",
  ],
};`;

const features = [
  "Five-column kanban with drag-and-drop status updates (@dnd-kit)",
  "List view with multi-field search, industry/position/status filters, and sorting",
  "Full application model: company, role, industry, salary, location, source, job URL",
  "Per-application notes and reminders (due-soon / overdue UX)",
  "Document vault for resumes and cover letters on R2",
  "Stats dashboard: funnel %, status pie, industry/source bars, time series",
  "Resend emails on new application and status change, plus daily reminder digest",
  "Settings for notification email list and send-test-email",
  "JSON bulk import for applications, notes, and reminders",
  "Single-owner, no-login architecture (fixed OWNER_ID) for agent-friendly updates",
  "Motion system with page entrances and stagger (respects prefers-reduced-motion)",
];

const techStack = [
  "TypeScript",
  "React",
  "Vite",
  "TanStack Router",
  "Tailwind CSS",
  "Hono",
  "Cloudflare Workers",
  "Cloudflare Pages",
  "Neon",
  "PostgreSQL",
  "Drizzle ORM",
  "R2",
  "Resend",
  "Zod",
  "Recharts",
  "dnd-kit",
  "Vitest",
  "Playwright",
  "Kanban",
  "CareerTech",
];

const Docket = () => {
  return (
    <ProjectLayout
      title="Docket"
      terminalLines={terminalLines}
      terminalPrompt="$"
      terminalTitle="docket.deploy.sh"
      terminalSpeed={32}
      logo={`${process.env.PUBLIC_URL}/logos/Docket.png`}
      codeSnippet={projectInfo}
      features={features}
      techStack={techStack}
    >
      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Overview
        </h2>
        <p className="section-description">
          Docket replaces spreadsheet chaos for a job search: applications move through wishlist →
          applied → interview → offer → rejected on a drag-and-drop board, with list search/filters,
          notes, reminders, and resume/cover storage. A Hono API on Cloudflare Workers backs a React
          SPA, with Neon Postgres (RLS-ready), R2 for private files, and Resend emails when roles are
          logged or status changes. Built as a single-owner instance for{" "}
          <strong>Baseer</strong> (fixed <code>OWNER_ID</code>) so the pipeline can be updated
          without accounts.
        </p>
        <p className="section-description">
          The live site holds real application data, so this page links out rather than embedding a
          public iframe.
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
          Web app on Cloudflare Pages plus a separate Workers API. Kanban, list, stats, document
          vault, and settings share one TanStack Router SPA; email digests run on a Worker cron.
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
            Open Docket →
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
