import { chromium } from 'playwright';
import { BASE_URL, ensureVerifyDir, writeJson } from './lib.mjs';

async function scrollPage(page, path) {
  const url = `${BASE_URL}${path === '/' ? '' : path}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(1000);

  const metrics = await page.evaluate(async () => {
    const longTasks = [];
    let observer;
    try {
      observer = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (e.duration > 50) longTasks.push({ name: e.name, duration: e.duration });
        }
      });
      observer.observe({ type: 'longtask', buffered: true });
    } catch {
      // longtask may be unavailable
    }

    const start = performance.now();
    const heights = [];
    const step = Math.max(200, Math.floor(window.innerHeight * 0.8));
    const maxY = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    for (let y = 0; y < maxY; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      heights.push(y);
    }
    window.scrollTo(0, maxY);
    await new Promise((r) => setTimeout(r, 300));
    const elapsed = performance.now() - start;
    observer?.disconnect();

    const blurNodes = [...document.querySelectorAll('*')].filter((el) => {
      const bf = getComputedStyle(el).backdropFilter || getComputedStyle(el).webkitBackdropFilter;
      return bf && bf !== 'none';
    }).length;

    const headerBf = (() => {
      const el = document.querySelector('.site-header-pill--scrolled, .site-header-pill, .site-header');
      if (!el) return null;
      const cs = getComputedStyle(el);
      return cs.backdropFilter || cs.webkitBackdropFilter;
    })();

    return {
      elapsedMs: Math.round(elapsed),
      scrollSteps: heights.length,
      longTaskCount: longTasks.length,
      longTaskMax: longTasks.reduce((m, t) => Math.max(m, t.duration), 0),
      blurNodeCount: blurNodes,
      headerBackdropFilter: headerBf,
    };
  });

  return { path, ...metrics };
}

async function main() {
  ensureVerifyDir();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const client = await context.newCDPSession(page);

  // Fast 3G-ish + 4x CPU
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 562.5,
    downloadThroughput: ((1.6 * 1024 * 1024) / 8) * 0.9,
    uploadThroughput: ((750 * 1024) / 8) * 0.9,
    connectionType: 'cellular3g',
  });
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  const home = await scrollPage(page, '/');
  const caseStudy = await scrollPage(page, '/bgr8');

  await browser.close();

  // Heuristic: jank if many long tasks during scroll or header still blurring
  const headerBlurActive =
    home.headerBackdropFilter &&
    home.headerBackdropFilter !== 'none' &&
    home.headerBackdropFilter !== '';
  const janky =
    home.longTaskMax > 200 ||
    caseStudy.longTaskMax > 200 ||
    home.longTaskCount > 15 ||
    caseStudy.longTaskCount > 15;

  const summary = {
    baseUrl: BASE_URL,
    throttle: { cpu: 4, network: 'Fast 3G' },
    home,
    caseStudy,
    headerBlurActive,
    jankSuspected: janky,
    recommendation: headerBlurActive
      ? 'Drop header backdrop-filter to solid translucent fill'
      : janky && (home.blurNodeCount > 0 || caseStudy.blurNodeCount > 0)
        ? 'Consider removing backdrop-filter from .surface-3 / modals'
        : 'No blur-related jank signal under heuristic',
  };
  writeJson('throttle-summary.json', summary);
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
