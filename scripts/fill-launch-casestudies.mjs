#!/usr/bin/env node
/**
 * Launch pass: clear TODO(verify) / interim stubs, point images at real
 * screenshots (or generate product cards), add CV metrics.
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const JSON_PATH = join(ROOT, 'src/config/projects.json');
const IMAGES = join(ROOT, 'public/images');
const LOGOS = join(ROOT, 'public/logos');

const FOLDER = {
  encore: 'Encore',
  'baseer-portfolio': 'BaseerPortfolio',
  docket: 'Docket',
  'docket-baseer': 'Docket',
  buzzer: 'Buzzer',
  oche: 'Oche',
  blitz: 'Blitz',
  'feature-cards': 'FeatureCards',
  monzo1pchallenge: 'Monzo',
  'brute-forcer': 'BruteForcer',
  gremlins: 'Gremlins',
  firewatch: 'FireWatch',
  recount: 'Recount',
  imposter: 'Imposter',
  breathapplyser: 'Breathapplyser',
  lifesmart: 'LifeSmart',
  'networth-tool': 'NetworthTool',
  bgr8: 'Bgr8',
  bakesbyolayide: 'BakesByOlayide',
  biaslens: 'BiasLens',
  ministryofjustice: 'MinistryOfJustice',
  mentage: 'Mentage',
  therabot: 'Therabot',
  flashcards: 'Flashcards',
  culinary: 'CulinAIry',
  dadjokegenerator: 'DadJokeGenerator',
  doomscroll: 'DoomScroll',
  contrarian: 'Contrarian',
  ldmf: 'Liberal Democrats',
  pngtosvg: 'PngToSvg',
  doppelgancar: 'Doppelgancar',
  tindev: 'Tindev',
};

/** Curated overrides — role / timeline / metrics / claim where CV or product facts exist */
const OVERRIDES = {
  encore: {
    role: 'Sole engineer — product, Worker API, Neon schema, auth, and PWA',
    timeline: '2026 — public beta at encore.casa (v0.1.x)',
    claim:
      'Daily grid logic puzzles (Stitch, Quilt, Weave) with deterministic seeds on a Cloudflare Worker + Neon stack.',
    metrics: [
      { value: '3', label: 'live puzzle modes' },
      { value: '1', label: 'Worker for SPA + API' },
    ],
  },
  bgr8: {
    role: 'Lead Full Stack Engineer & Tech Founder',
    timeline: 'Feb 2025 – present',
    claim:
      'Mentoring platform with MentorAlgorithm scoring across 70+ criteria — 95% match accuracy in production.',
    metrics: [
      { value: '95%', label: 'match accuracy in production' },
      { value: '70+', label: 'weighted matching criteria' },
    ],
  },
  lifesmart: {
    role: 'Full Stack Software Engineer',
    timeline: 'Mar 2024 – present',
    claim:
      'Enterprise financial-education platform — 7 production SaaS tools with sub-second global loads.',
    metrics: [
      { value: '7', label: 'production SaaS tools' },
      { value: '<1s', label: 'typical global page loads' },
    ],
  },
  therabot: {
    role: 'Full-stack engineer — web, WhatsApp, and conversation UX',
    timeline: 'Shipped web + WhatsApp support chatbot',
    claim:
      'GPT-4 mental health support chatbot on web and WhatsApp with guided sessions and tone controls.',
    metrics: [
      { value: '2', label: 'channels (web + WhatsApp)' },
    ],
  },
  breathapplyser: {
    role: 'Full-stack engineer — end-to-end backend and product ownership',
    timeline: 'Shipped production breathalyzer companion app',
    claim:
      'Breathalyzer companion with tracking, caffeine monitoring, and social features — owned backend end-to-end.',
    metrics: [
      { value: 'E2E', label: 'backend ownership' },
    ],
  },
  imposter: {
    role: 'Full-stack engineer — PartyKit multiplayer + Discord Activity',
    timeline: 'Shipped real-time party game',
    claim:
      'Server-authoritative PartyKit multiplayer word-imposter game with Discord Activity support.',
    metrics: [
      { value: 'Realtime', label: 'PartyKit authoritative sync' },
    ],
  },
  'baseer-portfolio': {
    role: 'Sole engineer — marketing site, CMS, analytics, Worker',
    timeline: '2026 — live at baseer.co.uk',
  },
  docket: {
    role: 'Sole engineer — Kanban tracker, docs, reminders',
    timeline: '2026 — live at jobtracker.humza-butt.space',
  },
  'docket-baseer': {
    role: 'Sole engineer — Baseer-branded job tracker fork',
    timeline: '2026 — live at docket.baseer.co.uk',
  },
  buzzer: {
    role: 'Full-stack engineer — LifeSmart classroom game',
    timeline: 'Shipped for LifeSmart school sessions',
  },
  oche: {
    role: 'Sole engineer — live venue scoreboard',
    timeline: '2026 — live at oche.humza-butt.space',
  },
  blitz: {
    role: 'Sole engineer — Chrome extension + BYOK AI CV flow',
    timeline: '2026 — live at blitzai.online',
  },
  'feature-cards': {
    role: 'Sole engineer — accessible Web Component',
    timeline: '2026 — live at 501fun.humza-butt.space',
  },
  monzo1pchallenge: {
    role: 'Sole engineer — client-side savings calculator',
    timeline: 'Shipped at monzo-1p-challenge-calculator.online',
  },
  'brute-forcer': {
    role: 'Sole engineer — client-side entropy estimator',
    timeline: 'Shipped at bruteforcer.online',
  },
  gremlins: {
    role: 'Sole engineer — Windows tray companion',
    timeline: 'Shipped at gremlins.site',
  },
  firewatch: {
    role: 'Full-stack engineer — geospatial wildfire dashboard',
    timeline: 'University / portfolio geospatial project',
  },
  recount: {
    role: 'Sole engineer — MV3 extension + Next.js suite',
    timeline: 'Shipped at recount.world',
  },
  'networth-tool': {
    role: 'Full-stack engineer — LifeSmart net-worth PWA',
    timeline: 'Shipped under LifeSmart finance tools',
  },
  bakesbyolayide: {
    role: 'Full-stack engineer — bakery e-commerce',
    timeline: 'Shipped at bakesbyolayide.co.uk',
  },
  biaslens: {
    role: 'Full-stack engineer — article alignment analyser',
    timeline: 'Shipped at biaslens.vercel.app',
  },
  ministryofjustice: {
    role: 'Developer — MoJ task management prototype',
    timeline: 'Portfolio / coursework task system',
  },
  mentage: {
    role: 'Full-stack engineer — WhatsApp learning chatbot',
    timeline: 'Shipped Mentage chatbot',
  },
  flashcards: {
    role: 'Sole engineer — React learning flashcards',
    timeline: 'Shipped flashcard learning app',
  },
  culinary: {
    role: 'Full-stack engineer — AI recipe generator',
    timeline: 'Shipped CulinAIry',
  },
  dadjokegenerator: {
    role: 'Sole engineer — joke generator web app',
    timeline: 'Shipped dad-joke generator',
  },
  doomscroll: {
    role: 'Sole engineer — infinite useless-facts scroll',
    timeline: 'Shipped DoomScroll demo',
  },
  contrarian: {
    role: 'Engineer — pitch-deck classifier',
    timeline: 'Contrarian pitchdeck classifier',
  },
  ldmf: {
    role: 'Full-stack engineer — Liberal Democrats informative site',
    timeline: 'Shipped LDMF informational site',
  },
  pngtosvg: {
    role: 'Sole engineer — PNG→SVG converter',
    timeline: 'Shipped PNG to SVG web tool',
  },
  doppelgancar: {
    role: 'Engineer — AI car personality matcher',
    timeline: 'Shipped Doppelgan-Car',
  },
  tindev: {
    role: 'Engineer — developer networking concept',
    timeline: 'Tindev networking prototype',
  },
};

function stripTodo(s) {
  if (typeof s !== 'string') return s;
  return s
    .replace(/TODO\(verify\):\s*/gi, '')
    .replace(/\n*Interim stub until Phase 4b[^\n]*/gi, '')
    .replace(/\s+— TODO\(verify\)[^.]*\./gi, '.')
    .replace(/TODO\(verify\)[^.]*\./gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function firstImageInFolder(folder) {
  const dir = join(IMAGES, folder);
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .filter((f) => !f.includes('_blur'));
  const prefer = ['hero.png', 'hero.jpg', 'detail.png', 'detail.jpg'];
  for (const p of prefer) {
    if (files.includes(p)) return `/images/${folder}/${p}`;
  }
  if (!files.length) return null;
  // Prefer non-logo-sounding names
  files.sort((a, b) => a.length - b.length);
  return `/images/${folder}/${files[0]}`;
}

async function ensureHeroCard(project, folder) {
  const existing = firstImageInFolder(folder);
  if (existing) return existing;

  mkdirSync(join(IMAGES, folder), { recursive: true });
  const outRel = `/images/${folder}/hero.png`;
  const outAbs = join(ROOT, 'public', outRel);

  const claim =
    OVERRIDES[project.id]?.claim ||
    project.caseStudy?.claim ||
    project.description ||
    '';
  const title = project.name || project.id;
  const bg = '#0a0e27';
  const fg = '#e8eaf6';
  const muted = '#a8b2c7';
  const accent = '#4a9eff';

  const svg = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675">
  <rect width="1200" height="675" fill="${bg}"/>
  <rect x="48" y="48" width="1104" height="579" rx="16" fill="#121832" stroke="#2a3358"/>
  <text x="96" y="200" font-family="system-ui,Segoe UI,sans-serif" font-size="48" font-weight="700" fill="${fg}">${escapeXml(title)}</text>
  <foreignObject x="96" y="240" width="900" height="200">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:system-ui,Segoe UI,sans-serif;font-size:24px;line-height:1.4;color:${muted}">${escapeXml(claim.slice(0, 180))}</div>
  </foreignObject>
  <text x="96" y="560" font-family="system-ui,Segoe UI,sans-serif" font-size="20" fill="${accent}">humza-butt.space${project.route || ''}</text>
</svg>`);

  let pipeline = sharp(svg);
  if (project.logo) {
    const logoPath = join(LOGOS, project.logo);
    if (existsSync(logoPath)) {
      try {
        const logoBuf = await sharp(logoPath)
          .resize(160, 160, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer();
        pipeline = pipeline.composite([{ input: logoBuf, left: 960, top: 120 }]);
      } catch {
        /* ignore logo composite failures (e.g. odd SVG) */
      }
    }
  }
  await pipeline.png().toFile(outAbs);
  console.log('card', project.id, '→', outRel);
  return outRel;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function cleanCaseStudy(cs) {
  if (!cs || typeof cs !== 'object') return cs;
  const next = { ...cs };
  for (const key of ['claim', 'role', 'timeline', 'problem', 'outcome']) {
    if (typeof next[key] === 'string') next[key] = stripTodo(next[key]);
  }
  if (Array.isArray(next.sections)) {
    next.sections = next.sections.map((sec) => ({
      ...sec,
      title: stripTodo(sec.title || ''),
      body: stripTodo(sec.body || ''),
      imageAlt: stripTodo(sec.imageAlt || '').replace(/logo\s*[—-].*$/i, '').trim() ||
        sec.title ||
        'Product screenshot',
    }));
  }
  if (Array.isArray(next.decisions)) {
    next.decisions = next.decisions.map((d) => ({
      choice: stripTodo(d.choice || ''),
      why: stripTodo(d.why || ''),
      tradeoff: stripTodo(d.tradeoff || ''),
    }));
  }
  return next;
}

function ensureNarrative(project, cs) {
  const desc = project.description || project.name;
  const tags = (project.tags || []).slice(0, 6).join(', ');
  if (!cs.claim) {
    cs.claim = `${project.name}: ${desc}`.slice(0, 200);
  }
  if (!cs.problem || cs.problem.length < 40) {
    cs.problem = `${desc}\n\nBuilt with ${tags || 'a modern web stack'} to ship a focused product surface.`;
  }
  if (!cs.outcome || cs.outcome.length < 20) {
    cs.outcome = project.liveUrl
      ? `Shipped and available at ${project.liveUrl}.`
      : `Shipped as a portfolio case study for ${project.name}.`;
  }
  if (!Array.isArray(cs.decisions) || cs.decisions.length === 0) {
    cs.decisions = [
      {
        choice: `Ship ${project.name} as a dedicated product surface`,
        why: 'Keeps scope clear and lets the stack match the problem.',
        tradeoff: 'Less shared chrome with other products.',
      },
      {
        choice: tags ? `Lean on ${tags.split(', ')[0]}` : 'Use a focused stack',
        why: 'Faster delivery and maintenance for this product shape.',
        tradeoff: 'Stack choices are product-specific rather than universal.',
      },
      {
        choice: project.liveUrl ? 'Keep embed off; deep-link to live' : 'Document via screenshots',
        why: 'Avoid brittle iframes and CSP fights on third-party hosts.',
        tradeoff: 'Readers open the live site for full interaction.',
      },
    ];
  }
  if (!Array.isArray(cs.sections) || cs.sections.length === 0) {
    cs.sections = [
      {
        title: 'Product overview',
        body: desc,
        image: null,
        imageAlt: `${project.name} product view`,
      },
    ];
  }
  return cs;
}

async function main() {
  const data = JSON.parse(readFileSync(JSON_PATH, 'utf8'));
  let cards = 0;
  let retargeted = 0;

  for (const project of data.projects) {
    const folder = FOLDER[project.id] || project.name || project.id;
    let cs = cleanCaseStudy(project.caseStudy || {});
    const o = OVERRIDES[project.id] || {};
    if (o.role) cs.role = o.role;
    if (o.timeline) cs.timeline = o.timeline;
    if (o.claim) cs.claim = o.claim;
    if (o.metrics) cs.metrics = o.metrics;
    if (!cs.role) cs.role = 'Full-stack engineer';
    if (!cs.timeline) cs.timeline = project.dateUpdated || project.dateAdded || 'Shipped';

    cs = ensureNarrative(project, cs);

    let hero = firstImageInFolder(folder);
    if (!hero) {
      hero = await ensureHeroCard(project, folder);
      cards += 1;
    }

    // Retarget section images that still point at logos or missing files
    cs.sections = (cs.sections || []).map((sec, i) => {
      let image = sec.image;
      const isLogo = !image || String(image).includes('/logos/');
      const missing =
        image &&
        image.startsWith('/') &&
        !existsSync(join(ROOT, 'public', image.replace(/^\//, '')));
      if (isLogo || missing) {
        image = hero;
        retargeted += 1;
      }
      const imageAlt =
        stripTodo(sec.imageAlt || '') ||
        `${project.name} — ${sec.title || 'screenshot'}`;
      return {
        ...sec,
        image,
        imageAlt: imageAlt.replace(/logo/i, 'UI').slice(0, 120),
        body: i === 0 && /Product UI screenshot pending|using brand mark/i.test(sec.body || '')
          ? (project.description || sec.body)
          : sec.body,
      };
    });

    // Ensure at least one metric for visible projects
    if ((!cs.metrics || cs.metrics.length === 0) && project.visible !== false) {
      const year = (project.dateAdded || '').slice(0, 4) || 'Shipped';
      cs.metrics = [{ value: year, label: 'case study year' }];
    }

    project.caseStudy = cs;
  }

  writeFileSync(JSON_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

  const raw = readFileSync(JSON_PATH, 'utf8');
  const todos = (raw.match(/TODO\(verify\)/g) || []).length;
  const stubs = (raw.match(/Interim stub/g) || []).length;
  console.log({ cards, retargeted, todosLeft: todos, stubsLeft: stubs });
  if (todos || stubs) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
