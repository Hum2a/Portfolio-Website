import React from "react";
import ProjectLayout from "../components/projects/ProjectLayout";
import "./NetworthTool.css";

const NETWORTH_PROD_URL = "https://networthtool.lifesmartfinance.com";
const NETWORTH_STAGING_URL = "https://networthtool-staging.lifesmartfinance.com";
const API_PROD_URL = "https://api-networthtool.lifesmartfinance.com";
const API_STAGING_URL = "https://api-networthtool-staging.lifesmartfinance.com";

const terminalLines = [
  "git clone lifesmartfinance/networth-tool",
  "npm ci && npm run check",
  "> typecheck · lint · vitest (@networth/api + workspaces)",
  "npm run dev",
  "  web → :5173   api → wrangler dev",
  "open https://networthtool.lifesmartfinance.com",
];

const projectInfo = `const networthTool = {
  name: "Networth Tool",
  type: "full-stack-pwa",
  description:
    "LifeSmart Finance consumer PWA for net worth tracking, onboarding, learning paths, and phased monetization—React SPA plus Hono API on Cloudflare Workers with Neon Postgres and strict RLS.",
  stack: [
    "React 19",
    "TypeScript",
    "Vite 8",
    "Tailwind CSS v4",
    "Hono",
    "Cloudflare Workers",
    "Neon PostgreSQL",
    "Better Auth",
    "Stripe",
    "Vitest",
    "Playwright",
  ],
  features: [
    "PWA install + offline-friendly static caching",
    "Better Auth sessions + Google OAuth option",
    "Onboarding and home net-worth experience",
    "Learn tab with lessons and lesson player routes",
    "Analytics tab + server ingest endpoints",
    "Access codes and Stripe checkout flows",
    "Admin dashboard (users, content, codes, query terminal)",
    "RLS-scoped Postgres with encryption helpers for app PII",
  ],
};`;

const techStack = [
  "React 19 + Vite 8 + TypeScript 5.7",
  "Tailwind CSS v4 + Radix + shadcn-style tokens + Lucide + Recharts",
  "PWA (vite-plugin-pwa, Workbox)",
  "Hono on Cloudflare Workers (API, nodejs_compat)",
  "Neon Postgres + Drizzle ORM + RLS",
  "Better Auth (email/password, Google OAuth, Resend reset)",
  "Stripe + Resend + AWS SDK (R2-style presigns)",
  "Vitest + Playwright + GitHub Actions CI",
  "npm workspaces monorepo (apps/web, apps/api, packages/db)",
];

const features = [
  "Installable PWA with manifest and Workbox-driven caching",
  "Mobile-first shell: Home, Learn, Analytics, Me, Badges",
  "Guided onboarding and session-protected app shell",
  "Net worth domain: assets, debts, snapshots, goals, dashboard APIs",
  "Learning paths + admin content tooling",
  "Access codes, upgrades, Stripe checkout and webhooks",
  "Admin surfaces for users, progress, codes, revenue, analytics",
  "Dual staging/production Workers + hostnames for web and API",
];

const NetworthTool = () => {
  return (
    <ProjectLayout
      title="Networth Tool"
      terminalLines={terminalLines}
      terminalPrompt="$"
      terminalSpeed={28}
      terminalTitle="networth-tool.sh"
      logo={`/logos/networth-tool.svg`}
      codeSnippet={projectInfo}
      features={features}
      techStack={techStack}
    >
      <p className="section-description" style={{ maxWidth: "42rem", margin: "0 auto 1rem" }}>
        Mobile-first PWA for LifeSmart Finance: net worth, onboarding, learning paths,
        analytics, and access upgrades—built for consumers tracking wealth and financial literacy.
      </p>

      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Live product
        </h2>
        <p className="section-description">
          Production and staging frontends are public hostnames; the app is session-oriented
          (Better Auth) with allowlisted CORS—open in a new tab rather than expecting a
          third-party iframe to work reliably.
        </p>
        <div className="networth-live-note" role="note">
          No embedded preview here: framing/CSP is not guaranteed on Workers, and cookie-based
          auth typically breaks or degrades inside cross-site iframes. Visit the site directly
          to sign in and explore.
        </div>
        <div className="networth-link-row">
          <a
            href={NETWORTH_PROD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-button"
          >
            Visit production →
          </a>
          <a
            href={NETWORTH_STAGING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-button external-link-button--secondary"
          >
            Open staging (reviewers) →
          </a>
        </div>
      </section>

      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Deployment endpoints
        </h2>
        <p className="section-description">
          Web and API use separate Cloudflare Worker routes (from Wrangler configs). API hosts
          serve Better Auth and REST for the SPA—they are not casual public APIs for third
          parties.
        </p>
        <dl className="networth-deploy-grid">
          <div>
            <dt>Web (production)</dt>
            <dd>
              <a href={NETWORTH_PROD_URL} target="_blank" rel="noopener noreferrer">
                {NETWORTH_PROD_URL}
              </a>
            </dd>
          </div>
          <div>
            <dt>Web (staging)</dt>
            <dd>
              <a href={NETWORTH_STAGING_URL} target="_blank" rel="noopener noreferrer">
                {NETWORTH_STAGING_URL}
              </a>
            </dd>
          </div>
          <div>
            <dt>API (production)</dt>
            <dd>{API_PROD_URL}</dd>
          </div>
          <div>
            <dt>API (staging)</dt>
            <dd>{API_STAGING_URL}</dd>
          </div>
        </dl>
      </section>

      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Overview
        </h2>
        <p className="section-description">
          Delivered as an npm monorepo so the Vite/React client, Hono API, and shared Drizzle
          migrations stay aligned across staging and production. Features ship in phases (auth,
          onboarding, Learn, payments, admin); Neon Postgres uses row-level security with an
          app-layer encryption helper for selected PII columns where documented.
        </p>
      </section>
    </ProjectLayout>
  );
};

export default NetworthTool;
