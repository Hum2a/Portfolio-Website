import React from "react";
import ProjectLayout from "../components/projects/ProjectLayout";
import {
  getProjectById,
  getProjectCategories,
  PROJECT_CATEGORY_META,
} from "../data/projects";

const PRODUCTION_URL = "https://encore.casa";

const encoreProject = getProjectById("encore");
const surfaceCategories = getProjectCategories(encoreProject);

const terminalLines = [
  "encore init --games stitch,quilt,weave",
  "engine: seeded PRNG · unique solutions only",
  "host: Cloudflare Worker (SPA + /v1 API)",
  "data: Neon Postgres · FORCE RLS",
  "auth: Better Auth + guest sessions",
  "analytics: first-party · no ad trackers",
  "status: live @ encore.casa · v0.1.0",
];

const projectInfo = `const project = {
  name: "Encore",
  type: "Daily grid logic puzzle platform",
  description:
    "Infinite practice and replay-any-day for original grid games, with a deterministic engine and a unified Cloudflare Worker.",
  stack: [
    "TypeScript",
    "React + Vite",
    "Hono",
    "Cloudflare Workers",
    "Neon + Drizzle",
    "Better Auth",
  ],
  features: [
    "Deterministic daily / practice seeds",
    "Stitch · Quilt · Weave (Lattice beta)",
    "Catalogue, archive, soft leaderboards",
    "Account progress sync",
    "First-party analytics",
  ],
};`;

const features = [
  "Three live original genres: Stitch (path fill), Quilt (rectangle tiling), Weave (word path); Lattice in beta",
  "Deterministic daily and practice generation — same (seed, version) yields identical boards everywhere",
  "Curated catalogues with clear progress, plus archive / replay-any-day",
  "Shared pointer pipeline for mouse, touch, and pen with rAF board overlays",
  "Guest play with optional accounts; claim-once guest progress",
  "Cross-device progress sync for signed-in catalogue clears and in-progress boards",
  "Soft leaderboards with opt-in profiles",
  "PWA install surface with manifest and service worker",
  "Staff admin panel with RBAC (user / admin / developer) and audit log",
  "First-party product analytics with privacy-first consent — no ad trackers",
  "Postgres FORCE RLS on every public table, with CI RLS proofs",
];

const techStack = [
  "TypeScript",
  "React",
  "Vite",
  "Tailwind CSS",
  "Hono",
  "Cloudflare Workers",
  "PostgreSQL",
  "Neon",
  "Drizzle",
  "Better Auth",
  "Resend",
  "Turnstile",
  "Vitest",
  "Playwright",
  "Turborepo",
  "PWA",
  "Game",
  "Puzzle",
  "SaaS",
];

const Encore = () => {
  return (
    <ProjectLayout
      title="Encore"
      terminalLines={terminalLines}
      terminalPrompt="$"
      terminalTitle="encore.sh"
      terminalSpeed={35}
      logo={`${process.env.PUBLIC_URL}/logos/Encore.png`}
      codeSnippet={projectInfo}
      features={features}
      techStack={techStack}
    >
      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Overview
        </h2>
        <p className="section-description">
          Encore is a family of original daily grid logic games where the same seed always yields
          the same board. Players get today, practice, catalogue, and archive modes behind a shared
          game-agnostic engine on a single Cloudflare Worker (SPA + API). Accounts, progress sync,
          soft leaderboards, and first-party analytics ship together; Premium (Stripe) is wired but
          currently flagged off in production. First public cut targets <strong>0.1.0</strong>.
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
          One Worker serves the React SPA and REST API (<code>/v1</code>,{" "}
          <code>/api/auth</code>). Play Stitch, Quilt, or Weave on the live site — catalogue and
          archive modes share the same deterministic engine.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
          <a
            href={`${PRODUCTION_URL}/stitch`}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-button external-link-button--secondary"
          >
            Stitch →
          </a>
          <a
            href={`${PRODUCTION_URL}/quilt`}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-button external-link-button--secondary"
          >
            Quilt →
          </a>
          <a
            href={`${PRODUCTION_URL}/weave`}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-button external-link-button--secondary"
          >
            Weave →
          </a>
        </div>
      </section>

      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Engineering
        </h2>
        <p className="section-description">
          A zero-dependency engine package owns seeded PRNG and a <code>GameModule</code> contract
          with uniqueness harnesses. The monorepo (Turborepo + npm workspaces) ships web, API, DB
          (Neon + Drizzle with forced RLS), UI kit, and per-game packages. Auth covers password,
          magic link, optional Google / TOTP / passkeys, plus anonymous play sessions. Analytics are
          first-party into Neon — no third-party trackers.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Links
        </h2>
        <p className="section-description">
          Live at encore.casa. Embedding is blocked by design (<code>frame-ancestors &apos;none&apos;</code>
          ), so open the site directly to play.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <a
            href={PRODUCTION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-button"
          >
            Play on encore.casa →
          </a>
        </div>
      </section>
    </ProjectLayout>
  );
};

export default Encore;
