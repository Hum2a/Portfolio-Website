import React from "react";
import ProjectLayout from "../components/projects/ProjectLayout";
import {
  getProjectById,
  getProjectCategories,
  PROJECT_CATEGORY_META,
} from "../data/projects";

const PRODUCTION_URL = "https://baseer.co.uk";
const REPO_URL = "https://github.com/Hum2a/Baseer-Portfolio";

const baseerProject = getProjectById("baseer-portfolio");
const surfaceCategories = getProjectCategories(baseerProject);

const terminalLines = [
  "boot marketing CV — baseer.co.uk",
  "mount Worker: static assets + /api",
  "connect Neon via Hyperdrive + RLS",
  "auth: Better Auth (single admin)",
  "studio: freeform document CMS",
  "analytics: first-party beacons",
  "publish draft → live document tree",
  "ready.",
];

const projectInfo = `const project = {
  name: "Baseer Portfolio",
  type: "Marketing CV + visual CMS",
  description:
    "Personal brand site with a Figma-like Studio, Neon/RLS backend, and one Cloudflare Worker for SPA + API.",
  stack: [
    "React 19",
    "Vite",
    "Hono",
    "Neon + Drizzle RLS",
    "Better Auth",
    "Cloudflare Workers",
    "R2",
    "Tailwind CSS 4",
  ],
  features: [
    "Freeform Studio CMS",
    "Document draft/publish",
    "First-party analytics",
    "Theme system",
    "Same-origin /api",
  ],
};`;

const features = [
  "Public marketing CV with sector case studies (automotive, charity, education)",
  "Freeform Studio visual CMS — document tree, layers, inspector, breakpoints",
  "Draft / publish / preview with document revisions",
  "Shared header and footer as editable documents",
  "Design-token themes via data-theme (fog / steel / amber light default)",
  "Motion-led public UI with reveal, stagger, and page transitions",
  "Better Auth admin login — session-gated CMS and media, no public signup",
  "Neon + Drizzle with RLS on content tables (owner_id)",
  "Cloudflare R2 media library (presigned / Worker-proxied)",
  "First-party analytics dashboard — paths and counts, no GA",
  "SEO / head meta injection from published documents",
  "Single-Worker deploy: static assets + /api on one origin",
];

const techStack = [
  "React",
  "TypeScript",
  "Vite",
  "Tailwind CSS",
  "Hono",
  "Cloudflare Workers",
  "Neon",
  "PostgreSQL",
  "Drizzle ORM",
  "Better Auth",
  "R2",
  "Turborepo",
  "Vitest",
  "Playwright",
  "Motion",
  "CMS",
  "Analytics",
  "WebApp",
];

const BaseerPortfolio = () => {
  return (
    <ProjectLayout
      title="Baseer Portfolio"
      terminalLines={terminalLines}
      terminalPrompt="$"
      terminalTitle="deploy.sh"
      terminalSpeed={35}
      logo={`${process.env.PUBLIC_URL}/logos/BaseerPortfolio.svg`}
      codeSnippet={projectInfo}
      embedUrl={PRODUCTION_URL}
      embedTitle="Baseer Portfolio"
      embedSandbox
      embedNewTabLabel="Open baseer.co.uk →"
      features={features}
      techStack={techStack}
    >
      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Overview
        </h2>
        <p className="section-description">
          Baseer needed a living marketing CV—not a static brochure—so the site ships as a React SPA
          plus same-origin Hono API on one Cloudflare Worker. Content is authored in a Figma-like
          Studio (document tree, breakpoints, design tokens) backed by Neon Postgres with Drizzle
          RLS, Better Auth for a single admin, and R2 for media. The outcome is a production
          personal brand site at <strong>baseer.co.uk</strong> with staging, deploy pipelines, and
          an admin surface for pages, analytics, and publishing without a third-party CMS.
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
          Public marketing pages and case studies live on the SPA. The Studio and analytics
          dashboard sit behind admin auth at <code>/admin/*</code> — not embedded below. One Worker
          serves static assets and <code>/api</code> on the same origin via Hyperdrive → Neon.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Visual CMS
        </h2>
        <p className="section-description">
          The Studio is a freeform document editor: layers, inspector, breakpoints, and flow or
          absolute layout. Shared header and footer are documents too. Drafts publish into a live
          document tree with SEO meta, custom routes, and optional forms (Resend when configured).
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
            Visit baseer.co.uk →
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

export default BaseerPortfolio;
