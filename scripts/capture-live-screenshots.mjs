#!/usr/bin/env node
/**
 * Capture 1280x720 hero screenshots of live project sites into
 * public/images/<Folder>/hero.png. Failures are reported, never fatal —
 * projects that cannot be captured fall back to generated cards.
 *
 * Pass --detail to also capture a scrolled `detail.png` for a second, visually
 * distinct section image.
 *
 * Usage: node scripts/capture-live-screenshots.mjs [--only=Encore,Docket] [--detail]
 */

import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const IMAGES_DIR = join(ROOT, 'public', 'images');

/** folder -> live URL. Folder names follow the existing public/images convention. */
const TARGETS = [
  ['Encore', 'https://encore.casa'],
  ['BaseerPortfolio', 'https://baseer.co.uk'],
  ['Docket', 'https://jobtracker.humza-butt.space'],
  ['DocketBaseer', 'https://docket.baseer.co.uk'],
  ['Buzzer', 'https://buzzer.lifesmartfinance.com'],
  ['Oche', 'https://oche.humza-butt.space'],
  ['Blitz', 'https://blitzai.online'],
  ['FeatureCards', 'https://501fun.humza-butt.space'],
  ['Monzo', 'https://monzo-1p-challenge-calculator.online'],
  ['BruteForcer', 'https://bruteforcer.online'],
  ['Recount', 'https://recount.world'],
  ['Imposter', 'https://imposter-game.site'],
  ['NetworthTool', 'https://networthtool.lifesmartfinance.com'],
  ['BakesByOlayide', 'https://bakesbyolayide.co.uk'],
  ['Flashcards', 'https://flashcards-pj01.onrender.com'],
  ['DadJokeGenerator', 'https://dad-joke-generator-68xz.onrender.com'],
  ['DoomScroll', 'https://infinite-useless-scroll.onrender.com'],
  ['PNGtoSVG', 'https://pngtosvg-ulmg.onrender.com'],
  ['Doppelgancar', 'https://doppelgang-car.vercel.app'],
  ['LifeSmartHub', 'https://home.lifesmartfinance.com'],
  ['Breathapplyser', 'https://breathapplyser.online'],
  ['Gremlins', 'https://gremlins.site'],
  ['Mentage', 'https://mentage.onrender.com'],
  ['Therabot', 'https://therabot-site.onrender.com'],
  ['CulinAIry', 'https://culinairy-239n.onrender.com'],
  ['BiasLens', 'https://biaslens.vercel.app'],
  ['LiberalDemocrats', 'https://ldmf.onrender.com'],
  ['Bgr8', 'https://bgr8.com'],
];

const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const only = onlyArg
  ? new Set(onlyArg.slice('--only='.length).split(',').map((s) => s.trim()))
  : null;

const DETAIL = process.argv.includes('--detail');

const NAV_TIMEOUT = 45_000;
/** Hard ceiling per target: busy render loops can wedge evaluate/screenshot. */
const TARGET_TIMEOUT = 90_000;

function withTimeout(promise, ms, label) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} exceeded ${ms}ms`)), ms);
    }),
  ]).finally(() => clearTimeout(timer));
}

async function capture(context, folder, url, detail = false) {
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
    try {
      await page.waitForLoadState('networkidle', { timeout: 15_000 });
    } catch {
      // Sites with long-polling or analytics beacons never go idle; proceed.
    }
    await page.waitForTimeout(2500);
    const status = await withTimeout(
      page.evaluate(() => ({
        title: document.title,
        text: document.body ? document.body.innerText.trim().slice(0, 200) : '',
      })),
      15_000,
      'readiness probe'
    ).catch(() => ({ title: '', text: '', probed: false }));
    const out = join(IMAGES_DIR, folder, detail ? 'detail.png' : 'hero.png');
    mkdirSync(dirname(out), { recursive: true });
    if (detail) {
      await page.evaluate(() => window.scrollBy(0, Math.round(window.innerHeight * 1.15)));
      await page.waitForTimeout(1800);
    }
    await withTimeout(
      page.screenshot({ path: out, fullPage: false, timeout: 20_000 }),
      25_000,
      'screenshot'
    );
    return { folder, url, ok: true, title: status.title };
  } catch (err) {
    return { folder, url, ok: false, error: err.message.split('\n')[0] };
  } finally {
    await page.close().catch(() => {});
  }
}

async function main() {
  const list = TARGETS.filter(([folder]) => !only || only.has(folder));
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 2,
    // PWA service workers can wedge the renderer and stall screenshots.
    serviceWorkers: 'block',
    reducedMotion: 'reduce',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  });

  const results = [];
  const QUEUE = [...list];
  const workers = Array.from({ length: 4 }, async () => {
    for (;;) {
      const next = QUEUE.shift();
      if (!next) return;
      const res = await withTimeout(
        capture(context, next[0], next[1], DETAIL),
        TARGET_TIMEOUT,
        'capture'
      ).catch((err) => ({
        folder: next[0],
        url: next[1],
        ok: false,
        error: err.message,
      }));
      results.push(res);
      console.log(
        `${res.ok ? '✓' : '✗'} ${res.folder.padEnd(18)} ${res.url}${
          res.ok ? '' : ` — ${res.error}`
        }`
      );
    }
  });
  await Promise.all(workers);

  await context.close();
  await browser.close();

  const ok = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok);
  console.log(`\nCaptured ${ok.length}/${results.length}. Failed: ${failed.length}`);
  for (const f of failed) console.log(`  ✗ ${f.folder} (${f.url}): ${f.error}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
