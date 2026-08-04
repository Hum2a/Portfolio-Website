#!/usr/bin/env node
/**
 * Optimize public/images: emit WebP + AVIF siblings, 16px blur placeholders,
 * and a manifest.json. Idempotent — skips outputs newer than their source.
 *
 * Usage: node scripts/optimize-images.mjs
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const IMAGES_DIR = join(ROOT, 'public', 'images');
const BLUR_DIR = join(IMAGES_DIR, '_blur');
const MANIFEST_PATH = join(IMAGES_DIR, 'manifest.json');
/** Bundler-importable copy — Vite cannot import from public/ */
const SRC_MANIFEST_PATH = join(ROOT, 'src', 'data', 'imageManifest.json');

const MAX_WIDTH = 1280;
const WEBP_QUALITY = 62;
const AVIF_QUALITY = 48;
const BLUR_WIDTH = 16;
const SOURCE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.tif', '.tiff', '.webp']);

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '_blur') continue;
      walk(full, files);
    } else if (entry.isFile()) {
      files.push(full);
    }
  }
  return files;
}

function isSourceImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (!SOURCE_EXTS.has(ext)) return false;
  // Skip already-generated siblings sitting next to sources
  if (filePath.endsWith('.blur.webp')) return false;
  const base = filePath.slice(0, -ext.length);
  // Don't treat generated .webp/.avif next to a .png as sources when
  // they were produced by this script (same stem as a png/jpg).
  if (ext === '.webp' || ext === '.avif') {
    for (const srcExt of ['.png', '.jpg', '.jpeg', '.gif']) {
      if (existsSync(base + srcExt)) return false;
    }
  }
  return true;
}

function toPosix(p) {
  return p.split(sep).join('/');
}

function publicPath(absPath) {
  const rel = toPosix(relative(join(ROOT, 'public'), absPath));
  return `/${rel}`;
}

function needsRebuild(sourcePath, outputPath) {
  if (!existsSync(outputPath)) return true;
  return statSync(sourcePath).mtimeMs > statSync(outputPath).mtimeMs;
}

function ensureDir(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
}

function rgbToHex({ r, g, b }) {
  const h = (n) => n.toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}

async function processImage(sourcePath) {
  const ext = extname(sourcePath);
  const stem = sourcePath.slice(0, -ext.length);
  const webpPath = `${stem}.webp`;
  const avifPath = `${stem}.avif`;
  const relFromImages = relative(IMAGES_DIR, sourcePath);
  const blurPath = join(
    BLUR_DIR,
    `${relFromImages.slice(0, -ext.length)}.blur.webp`
  );

  const image = sharp(sourcePath, { failOn: 'none' });
  const meta = await image.metadata();
  const width = meta.width || 0;
  const height = meta.height || 0;

  let wrote = { webp: false, avif: false, blur: false };

  if (needsRebuild(sourcePath, webpPath)) {
    ensureDir(webpPath);
    await sharp(sourcePath, { failOn: 'none' })
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpPath);
    wrote.webp = true;
  }

  if (needsRebuild(sourcePath, avifPath)) {
    ensureDir(avifPath);
    await sharp(sourcePath, { failOn: 'none' })
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .avif({ quality: AVIF_QUALITY })
      .toFile(avifPath);
    wrote.avif = true;
  }

  if (needsRebuild(sourcePath, blurPath)) {
    ensureDir(blurPath);
    await sharp(sourcePath, { failOn: 'none' })
      .rotate()
      .resize({ width: BLUR_WIDTH, withoutEnlargement: true })
      .webp({ quality: 40 })
      .toFile(blurPath);
    wrote.blur = true;
  }

  // Dominant colour from a tiny resample
  const { dominant } = await sharp(sourcePath, { failOn: 'none' })
    .rotate()
    .resize(32, 32, { fit: 'inside' })
    .stats();

  const outMeta = await sharp(webpPath).metadata();

  return {
    entry: {
      src: publicPath(sourcePath),
      webp: publicPath(webpPath),
      avif: publicPath(avifPath),
      blur: publicPath(blurPath),
      width: outMeta.width || width,
      height: outMeta.height || height,
      dominantColor: rgbToHex(dominant),
    },
    sourceBytes: statSync(sourcePath).size,
    webpBytes: existsSync(webpPath) ? statSync(webpPath).size : 0,
    avifBytes: existsSync(avifPath) ? statSync(avifPath).size : 0,
    blurBytes: existsSync(blurPath) ? statSync(blurPath).size : 0,
    wrote,
  };
}

async function main() {
  if (!existsSync(IMAGES_DIR)) {
    console.error(`Missing ${IMAGES_DIR}`);
    process.exit(1);
  }

  const allFiles = walk(IMAGES_DIR);
  const sources = allFiles.filter(isSourceImage);

  console.log(`Optimizing ${sources.length} images in public/images…`);

  const manifest = {};
  let sourceTotal = 0;
  let webpTotal = 0;
  let avifTotal = 0;
  let blurTotal = 0;
  let created = 0;
  let skipped = 0;

  for (const sourcePath of sources) {
    try {
      const result = await processImage(sourcePath);
      manifest[result.entry.src] = result.entry;
      sourceTotal += result.sourceBytes;
      webpTotal += result.webpBytes;
      avifTotal += result.avifBytes;
      blurTotal += result.blurBytes;
      const anyWrote = result.wrote.webp || result.wrote.avif || result.wrote.blur;
      if (anyWrote) created += 1;
      else skipped += 1;
      const label = relative(IMAGES_DIR, sourcePath);
      process.stdout.write(
        `  ${anyWrote ? '✓' : '·'} ${label}\n`
      );
    } catch (err) {
      console.error(`  ✗ ${relative(IMAGES_DIR, sourcePath)}: ${err.message}`);
    }
  }

  // Stable key order
  const sorted = Object.fromEntries(
    Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b))
  );
  const json = JSON.stringify(sorted, null, 2) + '\n';
  writeFileSync(MANIFEST_PATH, json, 'utf8');
  ensureDir(SRC_MANIFEST_PATH);
  writeFileSync(SRC_MANIFEST_PATH, json, 'utf8');

  console.log('\nDone.');
  console.log(`  Sources processed: ${sources.length} (${created} updated, ${skipped} up-to-date)`);
  console.log(`  Source PNG/JPEG total: ${(sourceTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  WebP total:            ${(webpTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  AVIF total:            ${(avifTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Blur placeholders:     ${(blurTotal / 1024).toFixed(1)} KB`);
  console.log(`  Manifest:              ${publicPath(MANIFEST_PATH)} (${Object.keys(sorted).length} entries)`);
  console.log(`  Src manifest:          src/data/imageManifest.json`);
  console.log(
    `  Typical transfer (AVIF preferred): ${(avifTotal / 1024 / 1024).toFixed(2)} MB` +
      (avifTotal < 5 * 1024 * 1024 ? ' (under 5 MB target)' : ' (OVER 5 MB target)')
  );
  console.log(
    `  WebP fallback set:                 ${(webpTotal / 1024 / 1024).toFixed(2)} MB` +
      (webpTotal < 5 * 1024 * 1024 ? ' (under 5 MB)' : ' (over 5 MB)')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
