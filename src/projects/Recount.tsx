import React from "react";
import ProjectLayout from "../components/projects/ProjectLayout";

const RECOUNT_WEB_URL = "https://recount.world";

const terminalLines = [
  "const recount = {",
  "  name: 'Recount',",
  "  type: 'Extension + Next.js + API',",
  "  data: 'Supabase + Stripe + OpenAI + Resend',",
  "};",
];

const projectInfo = `const recount = {
  name: "Recount",
  type: "Productivity (extension + web + API)",
  url: "https://recount.world",
  description:
    "Passive time tracking by domain, dashboard & billing, staff admin",
  stack: [
    "Chrome MV3 extension (esbuild, Tailwind)",
    "Next.js 14 App Router + Supabase SSR",
    "Express API + Cloudflare Worker (Hono) parity",
    "Supabase Auth + Postgres (RLS + service role)",
    "Stripe, OpenAI reports, Resend email",
  ],
  packages: ["extension", "web", "api", "api-worker", "shared"],
};`;

const techStack = [
  "Next.js 14 (App Router), React, TypeScript, Tailwind CSS",
  "Chrome Extension MV3, esbuild, Zustand, Recharts, Framer Motion",
  "Express 4 (ESM), Hono on Cloudflare Workers",
  "Supabase (Auth, Postgres, RLS); Zod, Pino",
  "Stripe (checkout + webhooks), OpenAI, Resend",
  "Vitest, Supertest, GitHub Actions CI",
  "npm workspaces monorepo",
];

const features = [
  "Extension passively aggregates active tab time by domain and batches events to the API",
  "Web app: marketing site plus authenticated dashboard (intentions, history, reports, settings)",
  "Elevated staff roles for admin analytics and operations",
  "REST API owns mutations and privileged reads; browser uses anon JWT + RLS where appropriate",
  "Stripe licensing with idempotent webhook processing",
  "Optional AI-generated daily reports and email digests (Resend)",
  "Shared package for domain classification and app roles",
];

const Recount = () => {
  return (
    <ProjectLayout
      title="Recount"
      terminalLines={terminalLines}
      logo={`/logos/Recount.svg`}
      codeSnippet={projectInfo}
      embedUrl={RECOUNT_WEB_URL}
      embedTitle="Recount web app"
      features={features}
      techStack={techStack}
    >
      <div>
        <a
          href={RECOUNT_WEB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="external-link-button"
        >
          Visit recount.world →
        </a>
      </div>

      <section className="project-section" aria-labelledby="recount-links-heading">
        <h2 className="section-title" id="recount-links-heading">
          <span className="code-comment">{'//'}</span> Links
        </h2>
        <p className="section-description">
          Web app and dashboard live at recount.world. Chrome Web Store link will be added when
          the listing is published.
        </p>
        <div className="recount-links-row">
          <a
            href={RECOUNT_WEB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-button"
          >
            Open recount.world →
          </a>
          <button
            type="button"
            className="recount-store-soon"
            disabled
            title="Replace with Chrome Web Store URL when ready"
          >
            Chrome Web Store (coming soon)
          </button>
        </div>
      </section>

      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Overview
        </h2>
        <p className="section-description">
          Recount is a productivity product built as an npm workspaces monorepo: a Chrome
          Manifest V3 extension passively tracks time by domain and sends batched events to a
          backend; a Next.js web app serves the marketing site and authenticated experience
          (intentions, history, reports, settings, and staff admin); and a REST API handles
          mutations and privileged reads against Supabase (Postgres and Auth), with Stripe for
          licensing, optional OpenAI for report generation, and Resend for transactional and
          digest email.
        </p>
      </section>
    </ProjectLayout>
  );
};

export default Recount;
