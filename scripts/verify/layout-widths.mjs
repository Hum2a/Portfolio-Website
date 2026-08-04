/**
 * Smoke-check layout tokens render and shells don't overflow at key widths.
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.VERIFY_BASE || 'http://127.0.0.1:4173';
const WIDTHS = [375, 768, 1280, 1440, 1920];
const PATHS = ['/', '/projects', '/bgr8'];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const width of WIDTHS) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
    });
    for (const path of PATHS) {
      await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(400);
      const metrics = await page.evaluate(() => {
        const root = getComputedStyle(document.documentElement);
        const scrollW = document.documentElement.scrollWidth;
        const clientW = document.documentElement.clientWidth;
        const pill = document.querySelector('.site-header-pill');
        const hero = document.querySelector('.homepage-hero, .projects-shell, .case-study');
        return {
          pageMax: root.getPropertyValue('--page-max').trim(),
          pageMaxWide: root.getPropertyValue('--page-max-wide').trim(),
          pageGutter: root.getPropertyValue('--page-gutter').trim(),
          overflowX: scrollW > clientW + 1,
          scrollW,
          clientW,
          pillMax: pill ? getComputedStyle(pill).maxWidth : null,
          shellMax: hero ? getComputedStyle(hero).maxWidth : null,
        };
      });
      results.push({ width, path, ...metrics });
    }
    await page.close();
  }

  await browser.close();
  mkdirSync('tmp/verify', { recursive: true });
  writeFileSync('tmp/verify/layout-widths.json', JSON.stringify(results, null, 2));
  const fails = results.filter((r) => r.overflowX || !r.pageMax);
  console.log(JSON.stringify({ count: results.length, fails: fails.length, sample: results.filter((r) => r.path === '/'), failsDetail: fails }, null, 2));
  if (fails.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
