#!/usr/bin/env node
/**
 * Generate per-project Open Graph images into public/og/{id}.png (1200×630).
 * Uses project name + description; composites a screenshot when available.
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PROJECTS = join(ROOT, 'src', 'config', 'projects.json');
const IMAGES_DIR = join(ROOT, 'public', 'images');
const OG_DIR = join(ROOT, 'public', 'og');
const WIDTH = 1200;
const HEIGHT = 630;
const BG = '#0a0e27';
const ACCENT = '#4a9eff';
const TEXT = '#e8eaf6';
const MUTED = '#a8b0c4';

const FOLDER_ALIASES = {
  bgr8: ['Bgr8', 'B8'],
  therabot: ['Therabot'],
  lifesmart: ['LifeSmart'],
  breathapplyser: ['Breathapplyser', 'BreathapplyserV2'],
  encore: ['Encore'],
  mentage: ['Mentage'],
  biaslens: ['BiasLens'],
  culinary: ['CulinAIry'],
  contrarian: ['Contrarian'],
  ldmf: ['Liberal Democrats'],
  gremlins: ['Gremlins'],
  pnggancar: ['DoppelganCar'],
};

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapText(text, maxChars) {
  const words = String(text || '').split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function findScreenshot(projectId, projectName) {
  const candidates = [
    ...(FOLDER_ALIASES[projectId] || []),
    projectName,
    projectId,
  ];

  for (const folder of candidates) {
    const dir = join(IMAGES_DIR, folder);
    if (!existsSync(dir)) continue;
    const files = readdirSync(dir)
      .filter((f) => /\.(png|jpe?g|webp)$/i.test(f) && !f.endsWith('.avif'))
      .filter((f) => !f.endsWith('.webp') || !existsSync(join(dir, f.replace(/\.webp$/i, '.png'))))
      .map((f) => join(dir, f))
      .filter((f) => {
        const ext = extname(f).toLowerCase();
        // Prefer original PNG/JPEG over generated siblings
        return ['.png', '.jpg', '.jpeg'].includes(ext);
      });
    if (files.length) {
      // Prefer files with Homepage / Dashboard / Matching in the name
      files.sort((a, b) => {
        const score = (p) => {
          const n = p.toLowerCase();
          if (n.includes('homepage')) return 0;
          if (n.includes('matching')) return 1;
          if (n.includes('dashboard')) return 2;
          return 3;
        };
        return score(a) - score(b);
      });
      return files[0];
    }
  }
  return null;
}

function needsRebuild(sourceMtime, outPath) {
  if (!existsSync(outPath)) return true;
  return sourceMtime > statSync(outPath).mtimeMs;
}

async function renderOg(project) {
  const outPath = join(OG_DIR, `${project.id}.png`);
  const screenshot = findScreenshot(project.id, project.name);
  const sourceMtime = Math.max(
    statSync(PROJECTS).mtimeMs,
    screenshot && existsSync(screenshot) ? statSync(screenshot).mtimeMs : 0
  );
  if (!needsRebuild(sourceMtime, outPath)) {
    return { skipped: true, outPath };
  }

  const titleLines = wrapText(project.name, 22);
  const descLines = wrapText(project.description || '', 42);

  let titleY = 160;
  const titleSvg = titleLines
    .map((line, i) => {
      const y = titleY + i * 56;
      return `<text x="64" y="${y}" fill="${TEXT}" font-size="48" font-family="system-ui,Segoe UI,sans-serif" font-weight="700">${escapeXml(line)}</text>`;
    })
    .join('');

  const descStart = titleY + titleLines.length * 56 + 28;
  const descSvg = descLines
    .map((line, i) => {
      const y = descStart + i * 32;
      return `<text x="64" y="${y}" fill="${MUTED}" font-size="22" font-family="system-ui,Segoe UI,sans-serif">${escapeXml(line)}</text>`;
    })
    .join('');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${BG}"/>
  <rect x="0" y="0" width="8" height="100%" fill="${ACCENT}"/>
  <text x="64" y="72" fill="${ACCENT}" font-size="18" font-family="system-ui,Segoe UI,sans-serif" letter-spacing="2">HUMZA BUTT</text>
  ${titleSvg}
  ${descSvg}
  <text x="64" y="580" fill="${MUTED}" font-size="18" font-family="system-ui,Segoe UI,sans-serif">humza-butt.space</text>
</svg>`;

  const base = sharp(Buffer.from(svg)).png();

  if (screenshot) {
    const shot = await sharp(screenshot)
      .rotate()
      .resize(520, 480, { fit: 'cover', position: 'centre' })
      .png()
      .toBuffer();

    await sharp({
      create: {
        width: WIDTH,
        height: HEIGHT,
        channels: 3,
        background: BG,
      },
    })
      .composite([
        { input: await base.toBuffer(), top: 0, left: 0 },
        {
          input: await sharp(shot)
            .composite([
              {
                input: Buffer.from(
                  `<svg width="520" height="480"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${BG}" stop-opacity="1"/><stop offset="35%" stop-color="${BG}" stop-opacity="0"/></linearGradient></defs><rect width="520" height="480" fill="url(#g)"/></svg>`
                ),
                top: 0,
                left: 0,
              },
            ])
            .png()
            .toBuffer(),
          top: 75,
          left: 640,
        },
      ])
      .png()
      .toFile(outPath);
  } else {
    await base.toFile(outPath);
  }

  return { skipped: false, outPath };
}

async function main() {
  mkdirSync(OG_DIR, { recursive: true });
  const data = JSON.parse(readFileSync(PROJECTS, 'utf8'));
  const visible = (data.projects || []).filter((p) => p.visible && p.id);

  let created = 0;
  let skipped = 0;
  for (const project of visible) {
    const result = await renderOg(project);
    if (result.skipped) skipped += 1;
    else created += 1;
    process.stdout.write(`  ${result.skipped ? '·' : '✓'} ${project.id}\n`);
  }

  console.log(`OG images: ${created} written, ${skipped} up-to-date → ${OG_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
