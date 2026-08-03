import { chromium } from 'playwright';
import { BASE_URL, ensureVerifyDir, writeJson } from './lib.mjs';

async function checkReducedMotion(browser) {
  const context = await browser.newContext({
    reducedMotion: 'reduce',
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();
  await page.goto(BASE_URL, { waitUntil: 'load', timeout: 45000 });
  await page.waitForTimeout(1500);
  const home = await page.evaluate(() => {
    const animating = document
      .getAnimations({ subtree: true })
      .filter((a) => a.playState === 'running' && a.effect?.getComputedTiming()?.duration > 50);
    const editor = document.querySelector('.code-editor, [data-code-editor]');
    return {
      runningAnimations: animating.length,
      animationNames: animating.slice(0, 10).map((a) => a.animationName || a.effect?.constructor?.name),
      editorTextLen: editor?.textContent?.length || 0,
      mainExists: !!document.querySelector('#main-content, main, .app-main'),
    };
  });
  await page.goto(`${BASE_URL}/bgr8`, { waitUntil: 'load', timeout: 45000 });
  await page.waitForTimeout(800);
  const caseStudy = await page.evaluate(() => {
    const animating = document
      .getAnimations({ subtree: true })
      .filter((a) => a.playState === 'running' && a.effect?.getComputedTiming()?.duration > 50);
    return {
      runningAnimations: animating.length,
      mainExists: !!document.querySelector('#main-content, main, .app-main'),
    };
  });
  await context.close();
  return {
    ok:
      home.runningAnimations === 0 &&
      caseStudy.runningAnimations === 0 &&
      home.mainExists &&
      caseStudy.mainExists,
    home,
    caseStudy,
  };
}

async function checkReducedTransparency(browser) {
  const context = await browser.newContext({
    // Playwright uses colorScheme / forcedColors; transparency via CDP
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();
  const client = await page.context().newCDPSession(page);
  await client.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }],
  });
  await page.goto(BASE_URL, { waitUntil: 'load', timeout: 45000 });
  await page.waitForTimeout(400);

  const styles = await page.evaluate(() => {
    const sample = document.createElement('div');
    sample.className = 'surface-3';
    sample.style.cssText = 'position:fixed;left:-9999px;padding:20px;';
    document.body.appendChild(sample);
    const cs = getComputedStyle(sample);
    const header = document.querySelector('.site-header-pill, .site-header');
    const hcs = header ? getComputedStyle(header) : null;
    return {
      surface3: {
        backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter,
        backgroundColor: cs.backgroundColor,
      },
      header: hcs
        ? {
            backdropFilter: hcs.backdropFilter || hcs.webkitBackdropFilter,
            backgroundColor: hcs.backgroundColor,
          }
        : null,
    };
  });
  await context.close();
  const bf = (styles.surface3.backdropFilter || '').toLowerCase();
  const ok = bf === 'none' || bf === '';
  return { ok, styles };
}

async function main() {
  ensureVerifyDir();
  const browser = await chromium.launch({ headless: true });
  const reducedMotion = await checkReducedMotion(browser);
  const reducedTransparency = await checkReducedTransparency(browser);
  await browser.close();
  const summary = { baseUrl: BASE_URL, reducedMotion, reducedTransparency };
  writeJson('prefs-summary.json', summary);
  console.log(JSON.stringify(summary, null, 2));
  if (!reducedMotion.ok || !reducedTransparency.ok) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
