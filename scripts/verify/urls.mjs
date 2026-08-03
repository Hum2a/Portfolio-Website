import { chromium } from 'playwright';
import {
  BASE_URL,
  allPublicRoutes,
  ensureVerifyDir,
  writeJson,
} from './lib.mjs';

async function main() {
  ensureVerifyDir();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];

  for (const route of allPublicRoutes()) {
    const url = `${BASE_URL}${route === '/' ? '' : route}`;
    process.stderr.write(`url ${route}\n`);
    try {
      const res = await page.goto(url, {
        waitUntil: 'load',
        timeout: 45000,
      });
      await page.waitForTimeout(600);
      const finalUrl = page.url();
      const status = res?.status() ?? 0;
      const body = await page.evaluate(() => {
        const text = document.body?.innerText || '';
        return {
          title: document.title,
          hasMain: !!document.querySelector('#main-content, main'),
          isNotFound: /page not found|404|does not exist/i.test(text.slice(0, 500)),
        };
      });
      const ok =
        status < 400 &&
        !body.isNotFound &&
        (route === '/traffic' || route === '/humza-login' || body.hasMain || finalUrl.includes(route.replace(/^\//, '')) || route === '/linkedin');

      results.push({
        route,
        status,
        finalUrl,
        ok:
          route === '/linkedin'
            ? finalUrl.includes('/career')
            : route === '/traffic'
              ? status < 400 // may show login/access denied
              : ok && !body.isNotFound,
        ...body,
      });
    } catch (err) {
      results.push({ route, ok: false, error: String(err?.message || err) });
    }
  }

  await browser.close();
  const failed = results.filter((r) => !r.ok);
  const summary = {
    baseUrl: BASE_URL,
    total: results.length,
    failed: failed.length,
    linkedinRedirect: results.find((r) => r.route === '/linkedin'),
    failures: failed,
    results,
  };
  writeJson('urls-summary.json', summary);
  console.log(JSON.stringify({ total: summary.total, failed: summary.failed, failures: failed }, null, 2));
  if (failed.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
