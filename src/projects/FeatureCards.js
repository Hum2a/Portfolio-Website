import React from "react";
import ProjectLayout from "../components/projects/ProjectLayout";
import {
  getProjectById,
  getProjectCategories,
  PROJECT_CATEGORY_META,
} from "../data/projects";

const DEMO_URL = "https://501fun.humza-butt.space";
const REPO_URL = "https://github.com/Hum2a/feature-cards";
const NPM_URL = "https://www.npmjs.com/package/@techystuff/feature-cards";
const NPM_PACKAGE = "@techystuff/feature-cards";
const CMS_API_URL = "https://cms.501fun.humza-butt.space/api/cards";

const featureCardsProject = getProjectById("feature-cards");
const surfaceCategories = getProjectCategories(featureCardsProject);

const terminalLines = [
  "npm install @techystuff/feature-cards",
  "import '@techystuff/feature-cards'",
  "layout: stat → eyebrow + figure + label + media",
  "Shadow DOM · container queries · Zod schema",
  "CMS adapters: WordPress · Contentful · Sanity",
  "axe zero violations · ~25 KiB gzip ESM",
  "live demo → 501fun.humza-butt.space",
];

const projectInfo = `{
  name: "501 Feature Cards",
  type: "Accessible Web Component Library",
  description:
    "CMS-agnostic <feature-cards> element replacing static landing-page stat card images with live, editable JSON data.",
  stack: [
    "TypeScript",
    "Vanilla Web Components",
    "Shadow DOM",
    "Zod",
    "Vite",
    "Cloudflare Pages",
    "Cloudflare Workers",
    "Vitest",
    "Playwright"
  ],
  features: [
    "501 stat layout (eyebrow / figure / label / icon)",
    "Live card editor with JSON sync",
    "WordPress · Contentful · Sanity adapters",
    "Progressive enhancement (no-JS links)",
    "Container-query responsive grid",
    "axe-core CI gate (zero violations)",
    "Optional React wrapper",
    "npm + CDN + IIFE embed paths"
  ]
}`;

const features = [
  "501 stat layout mapped to four editable fields",
  "Interactive live card editor on the demo site",
  "CMS adapters for WordPress, Contentful, Sanity, and generic JSON",
  "Shadow DOM style encapsulation with public CSS tokens",
  "Container-query grid — responsive to host width, not viewport",
  "Progressive enhancement with plain-link fallback",
  "Zod-validated schema; errors emit events, never throw",
  "WCAG-focused: keyboard, focus rings, reduced motion, axe CI",
  "~25 KiB gzip ESM bundle with enforced size budget",
  "Script tag, ESM, imperative API, and optional React wrapper",
  "Mock headless CMS on Cloudflare Workers with OpenAPI",
  "Published on npm as @techystuff/feature-cards (AGPL-3.0-only)",
];

const techStack = [
  "Web Components",
  "TypeScript",
  "Vanilla JS",
  "Shadow DOM",
  "Zod",
  "Vite",
  "Cloudflare Pages",
  "Cloudflare Workers",
  "Vitest",
  "Playwright",
  "axe-core",
  "React",
  "npm",
  "AGPL-3.0",
  "Accessibility",
  "CMS",
  "Container Queries",
];

const FeatureCards = () => {
  return (
    <ProjectLayout
      title="501 Feature Cards"
      terminalLines={terminalLines}
      terminalPrompt="$"
      terminalTitle="feature-cards.sh"
      logo={`${process.env.PUBLIC_URL}/logos/feature-cards.svg`}
      codeSnippet={projectInfo}
      embedUrl={DEMO_URL}
      embedTitle="501 Feature Cards — live demo"
      embedNewTabLabel="Open full demo →"
      features={features}
      techStack={techStack}
    >
      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Overview
        </h2>
        <p className="section-description">
          The 501 marketing site relied on three static PNG stat cards that required a designer
          for every copy or colour change. This project delivers a reusable{" "}
          <code>&lt;feature-cards&gt;</code> Custom Element with a canonical JSON schema, CMS
          adapters (WordPress, Contentful, Sanity), and a 501 stat layout mapped to eyebrow /
          figure / label / icon fields. The shipped bundle uses native browser APIs only (~25 KiB
          gzip ESM), degrades to plain links without JavaScript, and passes an axe-core CI gate
          at zero violations.
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
          This project spans two surfaces: a published npm library and a live demo website. The
          primary deliverable is the npm package{" "}
          <code>{NPM_PACKAGE}</code> (AGPL-3.0-only)—a vanilla Web Component you can embed via
          ESM import, IIFE script tag, jsDelivr CDN, or an optional React wrapper. The demo site
          showcases the live card editor, CMS adapter wiring, and multiple themed instances.
        </p>
        <p className="section-description">
          Install with{" "}
          <code>npm install {NPM_PACKAGE}</code>, or open the{" "}
          <a href={NPM_URL} target="_blank" rel="noopener noreferrer">
            npm registry page
          </a>{" "}
          for version history and bundle stats.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Links
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-button"
          >
            Live demo →
          </a>
          <a
            href={NPM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-button external-link-button--secondary"
          >
            npm package →
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
            href={CMS_API_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-button external-link-button--secondary"
          >
            Mock CMS API →
          </a>
        </div>
      </section>
    </ProjectLayout>
  );
};

export default FeatureCards;
