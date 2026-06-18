import React from "react";
import ProjectLayout from "../components/projects/ProjectLayout";

const WEB_APP_URL = "https://imposter-game.site";

const terminalLines = [
  "const imposter = {",
  "  name: 'Imposter',",
  "  surfaces: ['Discord Activity', 'Web / PWA'],",
  "  realtime: 'PartyKit authoritative rooms',",
  "};",
];

const projectInfo = `const imposter = {
  name: "Imposter",
  tagline: "Who do you trust?",
  type: "Discord Activity + Web / PWA",
  description:
    "Word imposter party game: clues, votes, reveal — one client, PartyKit authority",
  stack: [
    "React 19, Vite 8, TypeScript, Tailwind v4, Radix / shadcn-style UI",
    "PartyKit WebSocket rooms (authoritative state machine)",
    "Cloudflare Pages + Worker (Discord OAuth; client secret never in browser)",
    "Optional Supabase: profiles, history, stats, saved word lists (RLS)",
  ],
  surfaces: ["Discord Activity iframe", "Open web / PWA"],
};`;

const techStack = [
  "React 19, Vite 8, TypeScript 5.9, Tailwind CSS v4, partysocket",
  "PartyKit server (TypeScript): phases, timers, clue validation, voting",
  "@discord/embedded-app-sdk, Cloudflare Worker token exchange",
  "i18next / react-i18next (EN + ES pattern)",
  "Optional Supabase Auth + Postgres + RLS",
  "ESLint, Playwright e2e, GitHub Actions CI",
  "Deploy: Wrangler Pages, Worker, PartyKit CLI (`npm run deploy`)",
];

const features = [
  "Lobby with word packs, custom pairs, timers, host options (rotate host, new words per round)",
  "Timed one-word clue rounds with server-enforced format (Unicode letter-aware)",
  "Clue reveal, suspicion marks, host-driven flow into voting",
  "Timed voting (skip vs accuse); server resolves outcomes",
  "Same React app in Discord’s iframe and in the browser; shared PartyKit host",
  "Join hardening: optional Discord verification, party JWT, rate limits (documented threat model)",
  "Guest play on web; optional cloud profiles with RLS-protected tables",
];

const Imposter = () => {
  return (
    <ProjectLayout
      title="Imposter"
      terminalLines={terminalLines}
      logo={`${process.env.PUBLIC_URL}/logos/Imposter.svg`}
      codeSnippet={projectInfo}
      embedUrl={WEB_APP_URL}
      embedTitle="Imposter — word party game"
      features={features}
      techStack={techStack}
    >
      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Overview
        </h2>
        <p className="section-description">
          Imposter is a real-time multiplayer &ldquo;word imposter&rdquo; party game. Players receive
          a secret word—or a different word when they are the imposter—then submit one-word clues
          across timed rounds and vote. The experience ships as a Discord Activity embedded in
          voice channels and as a standalone web app / PWA, sharing one React client and one
          authoritative PartyKit game server that validates every phase transition, clue, and vote.
        </p>
        <p className="section-description">
          A Cloudflare Worker proxies Discord OAuth so the client secret never ships to the
          browser; optional Supabase adds accounts, round history, stats, and synced word lists
          behind RLS, while guests can still play with session-local identity.
        </p>
      </section>
      <div>
        <a
          href={WEB_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="external-link-button"
        >
          Play on web →
        </a>
      </div>
    </ProjectLayout>
  );
};

export default Imposter;
