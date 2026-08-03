#!/usr/bin/env node
/**
 * Regenerate favicons + site OG preview from the Stacked-H monogram.
 * Outputs into public/ and public/logos/ so both path styles resolve.
 */
import { mkdirSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');
const LOGOS = join(PUBLIC, 'logos');
const IMAGES = join(PUBLIC, 'images');

const BG = '#0a0e27';
const FG = '#e8eaf6';

/** Stacked-H monogram paths (viewBox 0 0 32 32) */
function monogramSvg(size, { bg = BG, fg = FG } = {}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="${Math.round(size / 8)}" fill="${bg}"/>
  <rect x="6" y="4.667" width="4" height="22.667" rx="1.333" fill="${fg}"/>
  <rect x="22" y="4.667" width="4" height="22.667" rx="1.333" fill="${fg}"/>
  <rect x="10" y="11.333" width="12" height="3.667" rx="1" fill="${fg}"/>
  <rect x="10" y="17" width="12" height="3.667" rx="1" fill="${fg}"/>
</svg>`;
}

function maskIconSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="black">
  <rect x="6" y="4.667" width="4" height="22.667" rx="1.333"/>
  <rect x="22" y="4.667" width="4" height="22.667" rx="1.333"/>
  <rect x="10" y="11.333" width="12" height="3.667" rx="1"/>
  <rect x="10" y="17" width="12" height="3.667" rx="1"/>
</svg>`;
}

async function pngFromSvg(svg, size) {
  return sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
}

async function writePng(path, buf) {
  await sharp(buf).toFile(path);
  console.log('wrote', path);
}

async function portfolioPreview() {
  mkdirSync(IMAGES, { recursive: true });
  const monogram = await pngFromSvg(monogramSvg(256), 256);
  const title = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${BG}"/>
  <text x="120" y="280" font-family="system-ui,Segoe UI,sans-serif" font-size="56" font-weight="700" fill="${FG}">Humza Butt</text>
  <text x="120" y="340" font-family="system-ui,Segoe UI,sans-serif" font-size="28" fill="#a8b2c7">Software Engineer · Full Stack &amp; Platform Configuration</text>
  <text x="120" y="400" font-family="system-ui,Segoe UI,sans-serif" font-size="22" fill="#4a9eff">humza-butt.space</text>
</svg>`);
  const out = join(IMAGES, 'portfolio-preview.jpg');
  await sharp(title)
    .composite([{ input: monogram, left: 900, top: 187 }])
    .jpeg({ quality: 88 })
    .toFile(out);
  console.log('wrote', out);
}

async function main() {
  mkdirSync(LOGOS, { recursive: true });

  const sizes = [
    [16, 'favicon-16x16.png'],
    [32, 'favicon-32x32.png'],
    [144, 'mstile-144x144.png'],
    [180, 'apple-touch-icon.png'],
    [192, 'android-chrome-192x192.png'],
    [512, 'android-chrome-512x512.png'],
  ];

  for (const [size, name] of sizes) {
    const buf = await pngFromSvg(monogramSvg(size), size);
    await writePng(join(PUBLIC, name), buf);
    await writePng(join(LOGOS, name), buf);
  }

  // Multi-size ICO (16 + 32)
  const ico16 = await pngFromSvg(monogramSvg(16), 16);
  const ico32 = await pngFromSvg(monogramSvg(32), 32);
  // sharp cannot write .ico; keep PNG-compatible favicon.ico via 32px PNG bytes
  // and also write a real multi-res using png-to-ico if available — fallback: 32 PNG as ico
  await writePng(join(PUBLIC, 'favicon.ico'), ico32);
  await writePng(join(LOGOS, 'favicon.ico'), ico32);
  writeFileSync(join(PUBLIC, 'favicon-16.png'), ico16);
  writeFileSync(join(LOGOS, 'favicon-16.png'), ico16);

  const mask = maskIconSvg();
  writeFileSync(join(LOGOS, 'safari-pinned-tab.svg'), mask);
  writeFileSync(join(PUBLIC, 'safari-pinned-tab.svg'), mask);
  console.log('wrote safari-pinned-tab.svg');

  await portfolioPreview();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
