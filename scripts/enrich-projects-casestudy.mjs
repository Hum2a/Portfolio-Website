/**
 * One-shot enricher: adds liveUrl / repoUrl / embeddable / caseStudy to projects.json.
 * Run: node scripts/enrich-projects-casestudy.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const jsonPath = path.join(root, 'src/config/projects.json');
const manifestPath = path.join(root, 'src/data/imageManifest.json');

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const manifestKeys = Object.keys(manifest);

function firstImage(...candidates) {
  for (const c of candidates) {
    if (manifest[c]) return c;
  }
  const hit = manifestKeys.find((k) =>
    candidates.some((c) => k.includes(c.replace('/images/', '')))
  );
  return hit || candidates[0];
}

const LIVE = {
  encore: { liveUrl: 'https://encore.casa', embeddable: false },
  'baseer-portfolio': {
    liveUrl: 'https://baseer.co.uk',
    repoUrl: 'https://github.com/Hum2a/Baseer-Portfolio',
    embeddable: false,
  },
  docket: {
    liveUrl: 'https://jobtracker.humza-butt.space',
    repoUrl: 'https://github.com/Hum2a/jobtracker',
    embeddable: false,
  },
  'docket-baseer': {
    liveUrl: 'https://docket.baseer.co.uk',
    repoUrl: 'https://github.com/Hum2a/Docket--Baseer',
    embeddable: false,
  },
  buzzer: {
    liveUrl: 'https://buzzer.lifesmartfinance.com',
    repoUrl: 'https://github.com/lifesmart-financial-literacy/Buzzer',
    embeddable: false,
  },
  oche: {
    liveUrl: 'https://oche.humza-butt.space',
    repoUrl: 'https://github.com/Hum2a/oche',
    embeddable: false,
  },
  blitz: {
    liveUrl: 'https://blitzai.online',
    repoUrl: 'https://github.com/Hum2a/blitz-extension',
    embeddable: false,
  },
  'feature-cards': {
    liveUrl: 'https://501fun.humza-butt.space',
    repoUrl: 'https://github.com/Hum2a/feature-cards',
    embeddable: false,
  },
  monzo1pchallenge: {
    liveUrl: 'https://monzo-1p-challenge-calculator.online',
    embeddable: false,
  },
  'brute-forcer': { liveUrl: 'https://bruteforcer.online', embeddable: false },
  gremlins: { liveUrl: 'https://gremlins.site', embeddable: false },
  firewatch: {
    repoUrl: 'https://github.com/Hum2a/fire-intelligence-dashboard',
    embeddable: false,
  },
  recount: { liveUrl: 'https://recount.world', embeddable: false },
  imposter: { liveUrl: 'https://imposter-game.site', embeddable: false },
  breathapplyser: {
    liveUrl: 'https://breathapplyser.online',
    repoUrl: 'https://github.com/Breathapplyser',
    embeddable: false,
  },
  lifesmart: {
    liveUrl: 'https://home.lifesmartfinance.com',
    embeddable: false,
  },
  'networth-tool': {
    liveUrl: 'https://networthtool.lifesmartfinance.com',
    embeddable: false,
  },
  bgr8: { liveUrl: 'https://bgr8.com', embeddable: false },
  bakesbyolayide: { liveUrl: 'https://bakesbyolayide.co.uk', embeddable: false },
  biaslens: { liveUrl: 'https://biaslens.vercel.app', embeddable: false },
  mentage: { liveUrl: 'https://mentage.onrender.com', embeddable: false },
  therabot: {
    liveUrl: 'https://therabot-site.onrender.com',
    embeddable: false,
  },
  flashcards: {
    liveUrl: 'https://flashcards-pj01.onrender.com',
    embeddable: false,
  },
  culinary: { liveUrl: 'https://culinairy-239n.onrender.com', embeddable: false },
  dadjokegenerator: {
    liveUrl: 'https://dad-joke-generator-68xz.onrender.com',
    embeddable: false,
  },
  doomscroll: {
    liveUrl: 'https://infinite-useless-scroll.onrender.com',
    embeddable: false,
  },
  ldmf: { liveUrl: 'https://ldmf.onrender.com', embeddable: false },
  pngtosvg: {
    liveUrl: 'https://pngtosvg-ulmg.onrender.com',
    embeddable: false,
  },
  doppelgancar: {
    liveUrl: 'https://doppelgang-car.vercel.app',
    embeddable: false,
  },
};

const FLAGSHIPS = {
  bgr8: {
    claim:
      'Mentoring platform with a proprietary MentorAlgorithm scoring across 70+ criteria for mentor–mentee pairing.',
    role: 'TODO(verify): Architect and full-stack developer',
    timeline: 'TODO(verify): Ongoing production platform',
    metrics: [{ value: '70+', label: 'matching criteria in MentorAlgorithm' }],
    problem:
      'Matching mentors and mentees by hand does not scale, and shallow filters miss compatibility.\n\nBgr8 needed a weighted scoring system, real-time booking, and admin tools that operators could trust.',
    sections: [
      {
        title: 'Weighted matching algorithm',
        body: 'The MentorAlgorithm applies weighted scoring across skills, experience, availability, location, and compatibility factors.\n\nBuilt in TypeScript with real-time data processing so recommendations stay current as profiles change.',
        image: '/images/Bgr8/Matching Algorithm.png',
        imageAlt: 'Bgr8 matching algorithm visualisation',
      },
      {
        title: 'Mentee dashboard',
        body: 'Personalized dashboard with mentor recommendations and progress tracking.\n\nFirebase Firestore keeps recommendations and status in sync without full page reloads.',
        image: '/images/Bgr8/Mentee Dashboard.png',
        imageAlt: 'Bgr8 mentee dashboard',
      },
      {
        title: 'Live messaging',
        body: 'Real-time messaging between mentors and mentees with delivery and presence cues.\n\nFirebase-backed so conversations stay available across sessions.',
        image: '/images/Bgr8/Live Messaging between mentor and mentee.png',
        imageAlt: 'Live messaging between mentor and mentee',
      },
      {
        title: 'Admin analytics',
        body: 'Admin analytics for engagement, matching outcomes, and platform growth.\n\nOperators get live Firestore listeners and exportable reporting.',
        image: '/images/Bgr8/Admin Panel Analytics.png',
        imageAlt: 'Bgr8 admin analytics dashboard',
      },
    ],
    decisions: [
      {
        choice: 'Custom MentorAlgorithm instead of simple tag filters',
        why: 'Mentoring quality depends on many soft signals that OR-filters cannot express.',
        tradeoff: 'Higher implementation and tuning cost versus a simpler search UI.',
      },
      {
        choice: 'Firebase for realtime data and auth',
        why: 'Needed live dashboards, messaging, and rapid iteration without running a custom socket fleet.',
        tradeoff: 'Vendor coupling and careful rules for admin query surfaces.',
      },
      {
        choice: 'Cal.com for availability and booking',
        why: 'Avoid rebuilding calendar conflict resolution and booking UX.',
        tradeoff: 'External dependency for a core user journey.',
      },
    ],
    outcome:
      'Shipped a production mentoring platform with matching, Cal.com booking, RBAC admin tools, and multi-layered security (CSP, XSS protections, rate limiting).',
  },

  therabot: {
    claim:
      'Mental health support chatbot on web and WhatsApp, with guided sessions, tone controls, and conversation history.',
    role: 'TODO(verify): Full-stack developer',
    timeline: 'TODO(verify): Shipped web + WhatsApp surfaces',
    metrics: [],
    problem:
      'People need low-friction mental health support outside clinic hours, without a heavy app install.\n\nTherabot had to feel safe, configurable, and available on channels people already use.',
    sections: [
      {
        title: 'Dashboard',
        body: 'Central dashboard for session status and quick access into chat.\n\nDesigned for calm, readable scanning rather than dense admin chrome.',
        image: '/images/Therabot/Dashboard.png',
        imageAlt: 'Therabot dashboard',
      },
      {
        title: 'Role and tone settings',
        body: 'Operators can tune role and tone so responses stay appropriate for the support context.\n\nSettings screens keep those controls explicit instead of buried prompts.',
        image: '/images/Therabot/Role settings.png',
        imageAlt: 'Therabot role settings',
      },
      {
        title: 'Active web chat',
        body: 'Web chat for anonymous or signed-in sessions with conversation continuity.\n\nHistory views let users revisit earlier guidance.',
        image: '/images/Therabot/ACtive webchat.png',
        imageAlt: 'Therabot active web chat',
      },
      {
        title: 'WhatsApp surface',
        body: 'WhatsApp integration meets users in a familiar messenger.\n\nSame support model, different entry point.',
        image: '/images/Therabot/Whatsapp chat.png',
        imageAlt: 'Therabot WhatsApp chat',
      },
    ],
    decisions: [
      {
        choice: 'OpenAI-backed conversational flows',
        why: 'Needed flexible natural-language support rather than a rigid decision tree alone.',
        tradeoff: 'Must constrain tone/role carefully for a mental-health context.',
      },
      {
        choice: 'Dual web + WhatsApp delivery',
        why: 'Reach users where they already communicate.',
        tradeoff: 'Two clients to keep behaviour consistent.',
      },
      {
        choice: 'Firebase + Render hosting stack',
        why: 'Fast path to auth, persistence, and a deployable Node/React app.',
        tradeoff: 'Operational split across services to monitor.',
      },
    ],
    outcome:
      'Shipped guided meditations, personalized tips, anonymous chat, conversation history, and a WhatsApp channel alongside the web app.',
  },

  lifesmart: {
    claim:
      'Suite of financial literacy tools — education modules, calculators, quizzes, and budgeting — under one LifeSmart hub.',
    role: 'TODO(verify): Full-stack engineer across multiple LifeSmart products',
    timeline: 'TODO(verify): Multi-product suite in production',
    metrics: [],
    problem:
      'Financial literacy content is scattered, and calculators rarely connect to a coherent learning journey.\n\nLifeSmart needed modular tools that still feel like one brand.',
    sections: [
      {
        title: 'SpZero learning platform',
        body: 'Module-based financial education with video/slide content, quizzes, and progress saving.\n\nAdmin analytics track engagement across modules and users.',
        image: '/images/LifeSmart/SpZero/Home Page - Overview.png',
        imageAlt: 'SpZero homepage overview',
      },
      {
        title: 'Interactive learning path',
        body: 'Visual module progression across foundations, personal finance, credit, and investing.\n\nKeeps learners oriented without a flat content dump.',
        image: '/images/LifeSmart/SpZero/Module Road Layout.png',
        imageAlt: 'SpZero module road layout',
      },
      {
        title: 'Budget tool flow',
        body: 'LifeBalance-style budgeting steps that walk users through income and spending decisions.\n\nDesigned as a guided multi-step tool rather than a blank spreadsheet.',
        image: '/images/LifeSmart/Budget Tool/Step1.png',
        imageAlt: 'LifeSmart budget tool step 1',
      },
      {
        title: 'Asset simulation results',
        body: 'Asset market simulation with results visualisation for teaching investment concepts.\n\nCharts make outcomes tangible after learners run a scenario.',
        image: '/images/LifeSmart/Asset Simulation/Results.png',
        imageAlt: 'Asset simulation results',
      },
    ],
    decisions: [
      {
        choice: 'Product suite with shared hub, separate tool deploys',
        why: 'Different tools have different stacks and release cadences.',
        tradeoff: 'More surfaces to keep branded and linked from the hub.',
      },
      {
        choice: 'Cloudflare Workers + Postgres for SpZero-class apps',
        why: 'Edge performance with durable relational data for progress and admin.',
        tradeoff: 'More moving parts than a single Firebase app.',
      },
      {
        choice: 'SSO with SPZeroFinance where needed',
        why: 'Learners should not create yet another account for partner content.',
        tradeoff: 'Auth complexity across org boundaries.',
      },
    ],
    outcome:
      'Delivered a hub plus specialized tools (education, calculators, quiz, budget, simulation, buzzer) used in production financial-literacy contexts.',
  },

  breathapplyser: {
    claim:
      'Mobile breathalyzer companion (2026 redesign) with BAC and caffeine tracking, graphs, social features, and PDF reports.',
    role: 'TODO(verify): Product engineer / full-stack for app and web surfaces',
    timeline: 'Legacy 2024 · Modern redesign 2026',
    metrics: [],
    problem:
      'Drink tracking apps are often either too simplistic or too clinical to use in social settings.\n\nBreathapplyser needed clear BAC/caffeine graphs, fast logging, and optional social accountability.',
    sections: [
      {
        title: 'Home',
        body: 'Modern home screen for current levels and quick actions.\n\nEntry point for drinks, graphs, and history.',
        image: '/images/BreathapplyserV2/Home.png',
        imageAlt: 'Breathapplyser V2 home screen',
      },
      {
        title: 'BAC over time',
        body: 'Interactive BAC graph so users see how levels change over time.\n\nPaired with drink history for context.',
        image: '/images/BreathapplyserV2/BAC Over time Graph.png',
        imageAlt: 'BAC over time graph',
      },
      {
        title: 'Drink presets',
        body: 'Presets speed up logging common drinks without re-entering details every time.',
        image: '/images/BreathapplyserV2/Drink Presets.png',
        imageAlt: 'Drink presets screen',
      },
      {
        title: 'PDF report generation',
        body: 'PDF reports for personal tracking and health insights from logged history.',
        image: '/images/BreathapplyserV2/Report Generation pdf.png',
        imageAlt: 'PDF report generation',
      },
    ],
    decisions: [
      {
        choice: 'Dual alcohol + caffeine tracking',
        why: 'Users often manage both stimulants and depressants in the same night.',
        tradeoff: 'Richer data model and more graph surfaces to maintain.',
      },
      {
        choice: 'Full V2 redesign rather than incremental UI polish',
        why: 'Legacy UX could not carry social features and reporting cleanly.',
        tradeoff: 'Temporary dual narrative (legacy vs modern) on the case study.',
      },
      {
        choice: 'Web app + store download surfaces',
        why: 'Reach users on both installable and browser entry points.',
        tradeoff: 'Two distribution channels to keep aligned.',
      },
    ],
    outcome:
      'Shipped V2 with BAC/caffeine graphs, presets, friend codes/leaderboards, and PDF reports, plus web and download.breathapplyser.online surfaces.',
  },

  encore: {
    claim:
      'Daily grid logic puzzles (Stitch, Quilt, Weave) with deterministic seeds on a Cloudflare Worker + Neon stack.',
    role: 'TODO(verify): Sole / lead engineer',
    timeline: 'TODO(verify): Public cut targeting v0.1.0',
    metrics: [],
    problem:
      'Most daily games hide their generators; players cannot trust practice boards or replay a past day fairly.\n\nEncore needed a deterministic engine and one Worker for SPA + API.',
    sections: [
      {
        title: 'Deterministic puzzle engine',
        body: 'TODO(verify): Product UI screenshot pending — using brand mark until a live capture is added under public/images/Encore/.\n\nSame (seed, version) yields identical boards for daily, practice, catalogue, and archive modes.',
        image: '/logos/Encore.png',
        imageAlt: 'Encore logo — TODO(verify) replace with product screenshot',
      },
      {
        title: 'Shared Cloudflare Worker',
        body: 'SPA and /v1 API share one Worker with Neon Postgres (FORCE RLS), Better Auth, and first-party analytics.\n\nKeeps game surfaces and account sync on one deploy unit.',
        image: '/logos/Encore.png',
        imageAlt: 'Encore logo — TODO(verify) replace with architecture or UI shot',
      },
    ],
    decisions: [
      {
        choice: 'Deterministic seeded generation',
        why: 'Fair daily + replayable practice without storing every board bitmap.',
        tradeoff: 'Engine versioning must stay explicit when generators change.',
      },
      {
        choice: 'Postgres FORCE RLS with CI proofs',
        why: 'Guest and account data must not leak across tenants.',
        tradeoff: 'More migration and policy discipline.',
      },
      {
        choice: 'No iframe embed of encore.casa',
        why: 'Production CSP uses frame-ancestors none.',
        tradeoff: 'Case study uses screenshot/CTA overlay instead of live embed.',
      },
    ],
    outcome:
      'Live at encore.casa with Stitch, Quilt, Weave (Lattice beta), catalogues, guest/account progress, soft leaderboards, and PWA install — Premium Stripe path wired but flagged off.',
  },
};

function stubCaseStudy(project) {
  const logo = project.logo
    ? project.logo.startsWith('/')
      ? project.logo
      : `/logos/${project.logo}`
    : '/images/portfolio-preview.jpg';

  const folderHint = project.id.replace(/-/g, '');
  const img =
    manifestKeys.find((k) =>
      k.toLowerCase().includes(project.id.replace(/-/g, '').toLowerCase())
    ) ||
    manifestKeys.find((k) =>
      k.toLowerCase().includes(project.name.split(' ')[0].toLowerCase())
    ) ||
    logo;

  return {
    claim: project.description || `${project.name} — shipped project.`,
    role: 'TODO(verify): Role to confirm',
    timeline: 'TODO(verify): Timeline to confirm',
    metrics: [],
    problem: `TODO(verify): Problem statement for ${project.name}.\n\nInterim stub until Phase 4b case-study pass.`,
    sections: [
      {
        title: project.name,
        body: project.description || `Overview of ${project.name}.`,
        image: img,
        imageAlt: `${project.name} preview`,
      },
    ],
    decisions: [
      {
        choice: 'TODO(verify): Key technical choice',
        why: 'TODO(verify): Why this approach',
        tradeoff: 'TODO(verify): Trade-off',
      },
    ],
    outcome: `TODO(verify): Outcome for ${project.name}.`,
  };
}

for (const project of data.projects) {
  const meta = LIVE[project.id] || { embeddable: false };
  project.embeddable = meta.embeddable ?? false;
  if (meta.liveUrl) project.liveUrl = meta.liveUrl;
  if (meta.repoUrl) project.repoUrl = meta.repoUrl;

  if (FLAGSHIPS[project.id]) {
    project.caseStudy = FLAGSHIPS[project.id];
  } else {
    project.caseStudy = stubCaseStudy(project);
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n');
console.log(
  'Updated',
  data.projects.length,
  'projects; flagships:',
  Object.keys(FLAGSHIPS).join(', ')
);
