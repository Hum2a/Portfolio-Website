import React from "react";
import ProjectLayout from "../components/projects/ProjectLayout";
import {
  getProjectById,
  getProjectCategories,
  PROJECT_CATEGORY_META,
} from "../data/projects";

const MARKETING_URL = "https://blitzai.online";
const WEB_WORKSPACE_URL = "https://app.blitzai.online";
const REPO_URL = "https://github.com/Hum2a/blitz-extension";

const blitzProject = getProjectById("blitz");
const surfaceCategories = getProjectCategories(blitzProject);

const terminalLines = [
  "$ npm run setup",
  "Building MV3 extension… popup/dist ready",
  "$ npm run build:check",
  "256 tests passed · manifest validated",
  "$ open chrome://extensions",
  "Load unpacked → tailor CV → review → fill Greenhouse form",
];

const projectInfo = `const blitz = {
  name: "Blitz",
  type: "Chrome Extension (MV3) + SaaS",
  tagline: "Apply faster. Land sooner.",
  description:
    "AI-tailored CVs and cover letters per job listing, with human-in-the-loop review and one-click ATS form fill.",
  stack: [
    "React 18",
    "Vite 6",
    "Tailwind CSS",
    "Chrome MV3",
    "Supabase",
    "Cloudflare Workers",
    "Vitest",
    "Playwright",
  ],
  features: [
    "BYOK AI (Anthropic, OpenAI, Gemini, OpenRouter)",
    "Multi-ATS scrape + fill",
    "E2EE cloud sync",
    "Bulk queue + PDF export",
    "Freemium licensing",
  ],
  live: "https://blitzai.online",
  repo: "https://github.com/Hum2a/blitz-extension",
};`;

const features = [
  "AI-tailored CV, cover letter, and screening answers per job (your API key)",
  "Review UI with match score before any form fill",
  "Auto-fill on Greenhouse, LinkedIn, Indeed, Workday, Lever, Ashby, BambooHR",
  "On-page widget and full-tab dashboard workspace",
  "Bulk job queue with pause, retry, dedupe, and LinkedIn/Indeed list capture",
  "CV HTML template editor and client-side PDF generation",
  "Application history with CSV import/export and follow-up reminders",
  "End-to-end encrypted settings and queue sync via Supabase",
  "Freemium tier plus Pro license validation (Lemon Squeezy)",
  "Companion marketing site, web workspace, and staff admin dashboard",
];

const techStack = [
  "Chrome Extension",
  "React",
  "Vite",
  "Tailwind CSS",
  "Supabase",
  "PostgreSQL",
  "Cloudflare Workers",
  "IndexedDB",
  "Vitest",
  "Playwright",
  "Lemon Squeezy",
  "Manifest V3",
  "JavaScript",
];

const Blitz = () => {
  return (
    <ProjectLayout
      title="Blitz"
      terminalLines={terminalLines}
      terminalPrompt="$"
      terminalTitle="blitz-extension"
      terminalSpeed={32}
      logo={`/logos/blitz.svg`}
      codeSnippet={projectInfo}
      embedUrl={MARKETING_URL}
      embedTitle="Blitz — Apply faster. Land sooner."
      embedNewTabLabel="Open blitzai.online →"
      features={features}
      techStack={techStack}
    >
      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Overview
        </h2>
        <p className="section-description">
          Job seekers waste hours rewriting CVs and wrestling with repetitive application forms.
          Blitz is a Manifest V3 Chrome extension that uses the user&apos;s own AI API key to tailor
          documents for each listing, shows a full review UI with match scoring, and performs
          human-like form fill on Greenhouse, LinkedIn, Indeed, Workday, Lever, Ashby, and BambooHR.
          Optional E2EE cloud sync, a bulk job queue, PDF export, freemium licensing, and companion
          web/admin surfaces round out a full product stack—all with keys and CV content kept
          client-side.
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
          The monorepo ships a Chrome MV3 extension, a marketing site, a web workspace at{" "}
          <code>app.blitzai.online</code> (extension bridge for full features), an admin dashboard,
          and a Cloudflare license worker—deployed separately but sharing Supabase auth and sync.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Links
        </h2>
        <p className="section-description">
          Visit the marketing site for install instructions. The web workspace requires the
          extension for full functionality. Chrome Web Store link will be added when the listing
          is published.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <a
            href={MARKETING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-button"
          >
            Visit blitzai.online →
          </a>
          <a
            href={WEB_WORKSPACE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-button external-link-button--secondary"
          >
            Web workspace →
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-button external-link-button--secondary"
          >
            GitHub →
          </a>
          <a
            href={`${MARKETING_URL}#install`}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-button external-link-button--secondary"
          >
            Install instructions →
          </a>
          <button
            type="button"
            className="external-link-button external-link-button--secondary"
            disabled
            title="Replace with Chrome Web Store URL when published"
            style={{ cursor: "not-allowed", opacity: 0.6 }}
          >
            Chrome Web Store (coming soon)
          </button>
        </div>
      </section>
    </ProjectLayout>
  );
};

export default Blitz;
