#!/usr/bin/env node
/**
 * Build 1200x675 product cards for projects with no reachable live site to
 * screenshot. Output: public/images/<Folder>/hero.png.
 *
 * Copy is pulled from src/config/projects.json so cards never drift from the
 * case study they illustrate.
 *
 * Usage: node scripts/generate-project-cards.mjs
 */

import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const IMAGES_DIR = join(ROOT, 'public', 'images');
const LOGOS_DIR = join(ROOT, 'public', 'logos');

const WIDTH = 1200;
const HEIGHT = 675;
const BG = '#0a0e27';

/** Projects with no live URL (or an unreachable one) that need a synthetic card. */
const CARDS = [
  {
    id: 'firewatch',
    folder: 'FireWatch',
    logo: 'firewatch-logo.svg',
    accent: '#ff4500',
    title: 'FireWatch',
  },
  { id: 'pngtosvg', folder: 'PNGtoSVG', logo: 'PNGtoSVG.png', accent: '#22d3ee' },
  { id: 'ministryofjustice', folder: 'MinistryofJustice', logo: 'MinistryofJustice.png', accent: '#60a5fa' },
  { id: 'tindev', folder: 'Tindev', logo: 'Tindev.png', accent: '#f472b6' },
];

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Greedy wrap using an average-glyph-width estimate — good enough for card copy. */
function wrap(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function buildSvg({ name, claim, tags, accent }) {
  const claimLines = wrap(claim, 52).slice(0, 4);
  const claimTspans = claimLines
    .map(
      (line, i) =>
        `<text x="88" y="${330 + i * 46}" class="claim">${escapeXml(line)}</text>`
    )
    .join('');

  let tagX = 88;
  const tagPills = tags
    .slice(0, 5)
    .map((tag) => {
      const w = tag.length * 12 + 34;
      const pill = `<g><rect x="${tagX}" y="530" rx="19" ry="19" width="${w}" height="38" fill="#141a3d" stroke="#252c56"/><text x="${tagX + 17}" y="555" class="tag">${escapeXml(tag)}</text></g>`;
      tagX += w + 12;
      return pill;
    })
    .join('');

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.30"/>
      <stop offset="60%" stop-color="${accent}" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="${BG}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
    <style>
      .name { font-family: "Segoe UI", Inter, system-ui, sans-serif; font-size: 68px; font-weight: 700; fill: #f4f6ff; }
      .claim { font-family: "Segoe UI", Inter, system-ui, sans-serif; font-size: 30px; font-weight: 400; fill: #a9b2d6; }
      .tag { font-family: "Segoe UI", Inter, system-ui, sans-serif; font-size: 19px; font-weight: 500; fill: #cbd3f2; }
      .kicker { font-family: "Segoe UI", Inter, system-ui, sans-serif; font-size: 20px; font-weight: 600; fill: ${accent}; letter-spacing: 3px; }
    </style>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
  <rect x="0" y="0" width="${WIDTH}" height="6" fill="url(#rule)"/>
  <text x="88" y="150" class="kicker">CASE STUDY</text>
  <text x="88" y="240" class="name">${escapeXml(name)}</text>
  <rect x="88" y="268" width="120" height="4" rx="2" fill="${accent}"/>
  ${claimTspans}
  ${tagPills}
</svg>`);
}

async function logoLayer(logoFile) {
  if (!logoFile) return null;
  const src = join(LOGOS_DIR, logoFile);
  if (!existsSync(src)) return null;
  const buf = await sharp(src, { density: 400 })
    .resize(220, 220, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const meta = await sharp(buf).metadata();
  return {
    input: buf,
    left: WIDTH - 88 - (meta.width || 220),
    top: 96,
  };
}

async function main() {
  const projects = JSON.parse(
    readFileSync(join(ROOT, 'src', 'config', 'projects.json'), 'utf8')
  ).projects;

  for (const card of CARDS) {
    const project = projects.find((p) => p.id === card.id);
    if (!project) {
      console.error(`  ✗ ${card.id}: not found in projects.json`);
      continue;
    }
    const svg = buildSvg({
      name: card.title || project.name,
      claim: project.caseStudy?.claim || project.description,
      tags: project.tags || [],
      accent: card.accent,
    });

    const layers = [{ input: svg, top: 0, left: 0 }];
    const logo = await logoLayer(card.logo);
    if (logo) layers.push(logo);

    const out = join(IMAGES_DIR, card.folder, 'hero.png');
    mkdirSync(dirname(out), { recursive: true });
    await sharp({
      create: {
        width: WIDTH,
        height: HEIGHT,
        channels: 4,
        background: BG,
      },
    })
      .composite(layers)
      .png()
      .toFile(out);
    console.log(`  ✓ ${card.folder}/hero.png`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
