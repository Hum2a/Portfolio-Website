import React from "react";
import ProjectLayout from "../components/projects/ProjectLayout";
import "./Monzo1pChallenge.css";

const MONZO_APP_URL = "https://monzo-1p-challenge-calculator.online";

const terminalLines = [
  "const monzo1pChallenge = {",
  "  name: 'Monzo 1p Challenge Calculator',",
  "  type: 'Web Application',",
  "  stack: 'Next.js 16 + React 19 + TypeScript',",
  "  features: ['3 calculator modes', 'PWA', 'Magic link auth']",
  "};",
];

const projectInfo = `const monzo1pChallenge = {
  name: "Monzo 1p Challenge Calculator",
  type: "Web Application",
  description: "Savings calculator inspired by the Monzo 1p challenge",
  stack: [
    "Next.js 16 (App Router)",
    "React 19",
    "TypeScript",
    "Tailwind CSS",
    "Radix UI / shadcn",
    "Prisma + Neon PostgreSQL",
    "Auth.js (NextAuth v5)",
    "Cloudflare Workers (OpenNext)"
  ],
  features: [
    "3 calculator modes: Next N days, Month, Custom range",
    "Anonymous use with localStorage",
    "Magic link sign-in (no password)",
    "Save/load up to 10 states per user",
    "PWA (installable on mobile)",
    "Monzo-inspired UI"
  ]
};`;

const techStack = [
  "Next.js 16 (App Router)",
  "React 19",
  "TypeScript",
  "Tailwind CSS",
  "Radix UI / shadcn",
  "Prisma + Neon PostgreSQL",
  "Auth.js (NextAuth v5) – magic link via Resend",
  "Zod",
  "Cloudflare Workers (OpenNext)",
  "Vitest",
  "Playwright",
];

const features = [
  "3 calculator modes: Next N days, Month, Custom range",
  "Anonymous use with localStorage",
  "Account sign-in via magic link (no password)",
  "Save/load up to 10 states per user",
  "PWA (installable on mobile)",
  "Monzo-inspired UI",
  "Rate limiting and Zod validation on API routes",
  "CI/CD with GitHub Actions",
  "Deploy to Cloudflare Workers (3 MiB bundle limit)",
];

const Monzo1pChallenge = () => {
  return (
    <ProjectLayout
      title="Monzo 1p Challenge Calculator"
      terminalLines={terminalLines}
      logo={`${process.env.PUBLIC_URL}/logos/Monzo.png`}
      codeSnippet={projectInfo}
      embedUrl={MONZO_APP_URL}
      embedTitle="Monzo 1p Challenge Calculator"
      embedSandbox
      features={features}
      techStack={techStack}
    >
      <div>
        <a
          href={MONZO_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="external-link-button"
        >
          Visit the Website →
        </a>
      </div>
    </ProjectLayout>
  );
};

export default Monzo1pChallenge;
