import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {
  BASE_URL,
  allPublicRoutes,
  ensureVerifyDir,
  writeJson,
} from './lib.mjs';

async function analyzeRoute(page, route) {
  const url = `${BASE_URL}${route === '/' ? '' : route}`;
  await page.goto(url, { waitUntil: 'load', timeout: 45000 });
  // Allow client redirect + framer-motion settle (even under reduced-motion)
  await page.waitForTimeout(1500);
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  return {
    route,
    finalUrl: page.url(),
    violations: results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.length,
      helpUrl: v.helpUrl,
      targets: v.nodes.slice(0, 5).map((n) => n.target),
    })),
  };
}

async function checkMobileNavFocusTrap(page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE_URL, { waitUntil: 'load', timeout: 45000 });
  const menuBtn = page.getByRole('button', { name: /menu|open navigation|navigation/i }).first();
  const hasMenu = await menuBtn.count();
  if (!hasMenu) {
    // Try common selectors
    const alt = page.locator('[aria-controls], button.site-header-menu, button[aria-expanded]').first();
    if ((await alt.count()) === 0) {
      return { ok: false, reason: 'No mobile menu control found' };
    }
    await alt.click();
  } else {
    await menuBtn.click();
  }
  await page.waitForTimeout(300);
  const dialog = page.locator('[role="dialog"], nav[aria-modal="true"], .site-header-mobile, [data-mobile-nav]').first();
  // Tab a few times and ensure focus stays within document body (basic trap signal)
  const focusedOutside = [];
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      const inNav =
        !!el?.closest('[role="dialog"]') ||
        !!el?.closest('[aria-modal="true"]') ||
        !!el?.closest('.site-header-mobile') ||
        !!el?.closest('[data-mobile-nav]') ||
        el?.getAttribute('aria-expanded') === 'true';
      return {
        tag: el?.tagName,
        inNav,
        text: (el?.textContent || '').slice(0, 40),
      };
    });
    focusedOutside.push(info);
  }
  const anyInNav = focusedOutside.some((f) => f.inNav);
  return { ok: anyInNav, samples: focusedOutside.slice(0, 6) };
}

async function checkCaseStudyLightbox(page) {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${BASE_URL}/bgr8`, { waitUntil: 'load', timeout: 45000 });
  const openers = page.getByRole('button', { name: /open image lightbox/i });
  if ((await openers.count()) === 0) {
    return { ok: true, skipped: true, reason: 'No lightbox opener on /bgr8' };
  }
  await openers.first().scrollIntoViewIfNeeded();
  await openers.first().click();
  await page.waitForTimeout(400);
  const axe = await new AxeBuilder({ page }).analyze();
  const dialogViolations = axe.violations.filter((v) =>
    v.nodes.some((n) =>
      JSON.stringify(n.target).includes('dialog') ||
      JSON.stringify(n.target).includes('lightbox')
    )
  );
  await page.keyboard.press('Escape');
  return {
    ok: dialogViolations.length === 0,
    violations: dialogViolations.map((v) => v.id),
    totalPageViolations: axe.violations.length,
  };
}

async function main() {
  ensureVerifyDir();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  const routes = allPublicRoutes();
  const results = [];
  let totalViolations = 0;

  for (const route of routes) {
    process.stderr.write(`axe ${route}\n`);
    try {
      const row = await analyzeRoute(page, route);
      totalViolations += row.violations.length;
      results.push(row);
    } catch (err) {
      results.push({
        route,
        error: String(err?.message || err),
        violations: [{ id: 'navigation-error', description: String(err) }],
      });
      totalViolations += 1;
    }
  }

  const mobileNav = await checkMobileNavFocusTrap(page).catch((e) => ({
    ok: false,
    error: String(e),
  }));
  const lightbox = await checkCaseStudyLightbox(page).catch((e) => ({
    ok: false,
    error: String(e),
  }));

  await browser.close();

  const summary = {
    baseUrl: BASE_URL,
    routeCount: routes.length,
    totalViolations,
    mobileNav,
    lightbox,
    results: results.filter((r) => r.violations?.length || r.error),
    allClear: totalViolations === 0,
  };
  writeJson('axe-summary.json', summary);
  console.log(JSON.stringify(summary, null, 2));
  if (totalViolations > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
