/**
 * Animation verification harness (Playwright + Chromium).
 *
 *   npm run verify:anim                         # against VERIFY_BASE_URL (default: vite preview on :4173)
 *   VERIFY_BASE_URL=http://localhost:3000 npm run verify:anim
 *   HEADED=1 npm run verify:anim                # headed window (more reliable frame timings)
 *
 * Covers: wipe coverage, scroll reset/restore, censor coverage, paper-stack content swaps,
 * peel clip-path continuity, long tasks under 4x CPU throttle, reduced motion, off-screen idle.
 * Writes tmp/verify/animations.json; exits 1 on any failure.
 */
import { chromium } from 'playwright';
import { BASE_URL, writeJson } from './lib.mjs';

const results = [];
const record = (name, pass, detail = {}) => {
  results.push({ name, pass, ...detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${pass ? '' : `  ${JSON.stringify(detail)}`}`);
};
const url = (p) => `${BASE_URL}${p}`;

async function newPage(browser, opts = {}) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, ...opts });
  const page = await context.newPage();
  page.on('pageerror', (e) => record(`page error (${page.url()})`, false, { message: e.message }));
  return { context, page };
}

const settle = (page, ms = 400) => page.waitForTimeout(ms);

/** Arms an in-page probe that checks wipe coverage the moment `.comic-wipe--covered` lands. */
async function armWipeProbe(page) {
  await page.evaluate(() => {
    window.__wipeProbe = null;
    const root = document.querySelector('[data-comic-wipe]');
    if (!root) return;
    const mo = new MutationObserver(() => {
      if (!root.classList.contains('comic-wipe--covered') || window.__wipeProbe) return;
      const anims = root.getAnimations({ subtree: true });
      const panels = [...root.querySelectorAll('.comic-wipe__panel')].map((p) => p.getBoundingClientRect());
      const w = innerWidth;
      const h = innerHeight;
      const points = [0.05, 0.5, 0.95].flatMap((fx) => [0.05, 0.5, 0.95].map((fy) => [fx * w, fy * h]));
      const uncovered = points.filter(
        ([x, y]) => !panels.some((r) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom)
      );
      window.__wipeProbe = {
        unfinished: anims.filter((a) => a.playState !== 'finished').length,
        uncovered: uncovered.length,
        position: getComputedStyle(root).position,
      };
      mo.disconnect();
    });
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });
  });
}

async function testWipeAndScroll(browser, label, opts) {
  const { context, page } = await newPage(browser, opts);
  const reduced = opts.reducedMotion === 'reduce';
  await page.goto(url('/'), { waitUntil: 'load' });
  await settle(page, 800);

  // Header link from deep scroll.
  // Overshoot then scroll up so the hide-on-scroll header is showing.
  await page.evaluate(() => window.scrollTo(0, 2800));
  await settle(page, 200);
  await page.evaluate(() => window.scrollTo(0, 2700));
  await settle(page);
  const before = await page.evaluate(() => window.scrollY);
  await armWipeProbe(page);
  await page.locator('.site-header a[href="/about"]').first().click();
  await page.waitForURL('**/about');
  await settle(page, 1400);
  const probe = await page.evaluate(() => window.__wipeProbe);
  if (!reduced) {
    record(
      `${label}: wipe covers viewport at covered`,
      !!probe && probe.uncovered === 0 && probe.unfinished === 0 && probe.position === 'fixed',
      { probe }
    );
  }
  record(`${label}: header nav lands at top`, (await page.evaluate(() => window.scrollY)) === 0);

  await page.goBack();
  await page.waitForURL(url('/'));
  await settle(page, 1600);
  const restored = await page.evaluate(() => window.scrollY);
  record(`${label}: back restores scroll`, Math.abs(restored - before) < 40, { before, restored });

  // Peel tile (homepage featured projects).
  const tile = page.locator('[data-calling-card-peel] a').first();
  if (await tile.count()) {
    await tile.scrollIntoViewIfNeeded();
    await settle(page);
    await tile.click();
    await page.waitForFunction(() => location.pathname !== '/', null, { timeout: 5000 });
    await settle(page, 800);
    record(`${label}: peel tile lands at top`, (await page.evaluate(() => window.scrollY)) === 0, {
      path: new URL(page.url()).pathname,
    });
  }

  // Footer link.
  await page.goto(url('/'), { waitUntil: 'load' });
  const footerLink = page.locator('.site-footer a[href^="/"]:not([href="/"])').first();
  if (await footerLink.count()) {
    await footerLink.scrollIntoViewIfNeeded();
    await footerLink.click();
    await page.waitForFunction(() => location.pathname !== '/', null, { timeout: 5000 });
    await settle(page, 1400);
    record(`${label}: footer link lands at top`, (await page.evaluate(() => window.scrollY)) === 0);
  }
  await context.close();
}

async function testCensor(browser, label, opts) {
  const reduced = opts.reducedMotion === 'reduce';
  for (const width of [375, 768, 1280]) {
    const { context, page } = await newPage(browser, { ...opts, viewport: { width, height: 800 } });
    await page.goto(url('/career'), { waitUntil: 'load' });
    await settle(page, 600);
    if (reduced) {
      // In-view items reveal instantly; nothing should be mid-animation.
      const midway = await page.evaluate(
        () => document.querySelectorAll('[data-cdc-censor].is-striking, [data-cdc-censor].is-removing').length
      );
      record(`${label}: censor has no animated phases @${width}`, midway === 0, { midway });
    } else {
      const r = await page.evaluate(() => {
        let bad = 0;
        let checked = 0;
        document.querySelectorAll('[data-cdc-censor]:not(.is-clear)').forEach((c) => {
          const bars = [...c.querySelectorAll('.cdc__bar')].map((b) => b.getBoundingClientRect());
          for (const v of c.querySelector('.cdc__value').getClientRects()) {
            checked += 1;
            const ok = bars.some(
              (b) => b.left <= v.left + 1 && b.right >= v.right - 1 && b.top <= v.top + 1 && b.bottom >= v.bottom - 1
            );
            if (!ok) bad += 1;
          }
        });
        return { bad, checked };
      });
      record(`${label}: censor bars cover text @${width}`, r.bad === 0, r);
    }
    await context.close();
  }
}

async function testPaperStack(browser, label, opts) {
  const { context, page } = await newPage(browser, opts);
  await page.goto(url('/github'), { waitUntil: 'load' });
  const present = await page
    .waitForSelector('.paper-stack h3', { timeout: 20000 })
    .then(() => true)
    .catch(() => false);
  if (!present) {
    record(`${label}: paper stack present`, false, { note: 'no repos rendered (GitHub API?)' });
    await context.close();
    return;
  }
  await page.evaluate(() => {
    const sheets = [...document.querySelectorAll('.paper-stack__sheet')];
    const name = (s) => s.querySelector('h3')?.textContent;
    let prev = sheets.map(name);
    window.__stackLog = [];
    (function f() {
      const cur = sheets.map(name);
      cur.forEach((n, i) => {
        if (n !== prev[i]) window.__stackLog.push({ i, z: +getComputedStyle(sheets[i]).zIndex });
      });
      prev = cur;
      requestAnimationFrame(f);
    })();
  });
  const front = () =>
    page.evaluate(() => document.querySelector('.paper-stack [data-depth="0"] h3').textContent);

  for (let i = 0; i < 6; i++) {
    await page.click(i % 2 ? '[data-paper-next]' : '[data-paper-prev]');
    await page.waitForTimeout(40);
  }
  await settle(page, 2500);
  const log = await page.evaluate(() => window.__stackLog);
  // Content may only change on a sheet sitting at the back of the stack (z <= 10).
  const visibleSwaps = log.filter((e) => e.z > 10);
  // Under reduced motion the swap and the re-stack land in the same frame, so only check animated runs.
  if (opts.reducedMotion !== 'reduce') {
    record(`${label}: no content change on visible sheets`, visibleSwaps.length === 0, { visibleSwaps });
  }

  const names = await page.evaluate(() =>
    [...document.querySelectorAll('.paper-stack__sheet')]
      .sort((a, b) => a.dataset.depth - b.dataset.depth)
      .map((s) => s.querySelector('h3').textContent)
  );
  await page.click('[data-paper-next]');
  await page.waitForTimeout(60);
  await page.click('[data-paper-next]');
  await settle(page, 2500);
  const afterDouble = await front();
  record(`${label}: rapid double-click advances twice`, afterDouble === names[2], { expected: names[2], afterDouble });
  await context.close();
}

async function testPeel(browser) {
  const { context, page } = await newPage(browser);
  await page.goto(url('/projects'), { waitUntil: 'load' });
  await settle(page, 800);
  const target = page.locator('.project-tile [data-calling-card-peel] a').first();
  await target.scrollIntoViewIfNeeded();
  await settle(page);
  await page.evaluate(() => {
    const surface = document.querySelector('.project-tile [data-calling-card-peel] .ccp__surface');
    window.__peel = { counts: new Set(), jumps: [] };
    let last = null;
    (function f() {
      if (!surface.isConnected) return;
      const cp = getComputedStyle(surface).clipPath;
      if (cp.startsWith('polygon')) window.__peel.counts.add(cp.split(',').length);
      const r = surface.getBoundingClientRect();
      if (last) window.__peel.jumps.push(Math.hypot(r.left - last.left, r.top - last.top));
      last = r;
      requestAnimationFrame(f);
    })();
  });
  await target.click();
  await settle(page, 1200);
  const peel = await page.evaluate(() => ({
    counts: [...window.__peel.counts],
    maxJump: Math.round(Math.max(0, ...window.__peel.jumps)),
  }));
  record('peel: clip-path keeps one vertex count', peel.counts.length <= 1, peel);
  record('peel: no surface jump > 140px/frame', peel.maxJump <= 140, peel);
  record('peel: destination starts at top', (await page.evaluate(() => window.scrollY)) === 0);
  await context.close();
}

async function testJank(browser) {
  const { context, page } = await newPage(browser);
  const cdp = await context.newCDPSession(page);
  await page.goto(url('/'), { waitUntil: 'load' });
  await settle(page, 1000);
  // Warm the destination chunk so this measures the animation, not first-load parse.
  await page.evaluate(() => fetch(location.origin + '/about').catch(() => {}));
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.evaluate(() => {
    window.__long = [];
    window.__phases = [];
    const root = document.querySelector('[data-comic-wipe]');
    new MutationObserver(() => window.__phases.push([performance.now(), root.className])).observe(root, {
      attributes: true,
    });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__long.push([e.startTime, e.duration]);
    }).observe({ type: 'longtask' });
  });
  await page.locator('.site-header a[href="/about"]').first().click();
  await page.waitForURL('**/about');
  await settle(page, 2500);
  const { long, inMotion } = await page.evaluate(() => {
    // Visible motion = attack (active → covered) and tear-away (exit → done).
    // Work during the covered hold is hidden behind the panels by design.
    const at = (pred) => window.__phases.find(([, c]) => pred(c))?.[0];
    const start = at((c) => c.includes('--active'));
    const covered = at((c) => c.includes('--covered'));
    const exit = at((c) => c.includes('--exit'));
    const done = window.__phases.filter(([, c]) => !c.includes('--active')).pop()?.[0] ?? Infinity;
    const windows = [
      [start, covered],
      [exit, done],
    ].filter(([a, b]) => a != null && b != null);
    const overlaps = ([t, d]) => windows.some(([a, b]) => t < b && t + d > a);
    return {
      long: window.__long.map(([t, d]) => Math.round(d)),
      inMotion: window.__long.filter(overlaps).map(([, d]) => Math.round(d)),
    };
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  record('jank: no long task > 50ms during visible wipe motion (4x throttle)', inMotion.every((d) => d <= 50), {
    inMotion,
    allLongTasks: long,
  });
  await context.close();
}

async function testOffscreenIdle(browser) {
  const { context, page } = await newPage(browser);
  await page.goto(url('/projects'), { waitUntil: 'load' });
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await settle(page, 800);
  const offscreen = await page.evaluate(() =>
    document
      .getAnimations()
      .filter((a) => a.playState === 'running' && a.effect?.getTiming().iterations === Infinity)
      .map((a) => a.effect.target)
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.bottom < -64 || r.top > innerHeight + 64;
      })
      .map((el) => String(el.className))
  );
  record('idle: no infinite animations running off-screen', offscreen.length === 0, {
    count: offscreen.length,
    sample: offscreen.slice(0, 5),
  });
  await context.close();
}

const browser = await chromium.launch({ headless: !process.env.HEADED });
try {
  await testWipeAndScroll(browser, 'motion', {});
  await testCensor(browser, 'motion', {});
  await testPaperStack(browser, 'motion', {});
  await testPeel(browser);
  await testJank(browser);
  await testOffscreenIdle(browser);

  const rm = { reducedMotion: 'reduce' };
  await testWipeAndScroll(browser, 'reduced', rm);
  await testCensor(browser, 'reduced', rm);
  await testPaperStack(browser, 'reduced', rm);
} finally {
  await browser.close();
}

const file = writeJson('animations.json', results);
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed → ${file}`);
process.exit(failed.length ? 1 : 0);
