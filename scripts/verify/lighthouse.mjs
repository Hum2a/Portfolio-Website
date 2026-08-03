import fs from 'node:fs';
import path from 'node:path';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import {
  BASE_URL,
  LH_PAGES,
  VERIFY_DIR,
  ensureVerifyDir,
  writeJson,
} from './lib.mjs';

const TARGETS = {
  performance: 90,
  accessibility: 100,
  'best-practices': 95,
  seo: 100,
};

async function runOne(url, formFactor, chrome) {
  const isMobile = formFactor === 'mobile';
  const result = await lighthouse(url, {
    port: chrome.port,
    output: 'json',
    logLevel: 'error',
    formFactor,
    screenEmulation: isMobile ? undefined : { disabled: true },
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    maxWaitForLoad: 45000,
  });
  const cats = result.lhr.categories;
  return {
    url,
    formFactor,
    scores: {
      performance: Math.round((cats.performance?.score || 0) * 100),
      accessibility: Math.round((cats.accessibility?.score || 0) * 100),
      'best-practices': Math.round((cats['best-practices']?.score || 0) * 100),
      seo: Math.round((cats.seo?.score || 0) * 100),
    },
    audits: Object.fromEntries(
      [
        'largest-contentful-paint',
        'cumulative-layout-shift',
        'total-blocking-time',
        'speed-index',
      ]
        .filter((id) => result.lhr.audits[id])
        .map((id) => [
          id,
          {
            score: result.lhr.audits[id].score,
            displayValue: result.lhr.audits[id].displayValue,
            numericValue: result.lhr.audits[id].numericValue,
          },
        ])
    ),
  };
}

async function main() {
  ensureVerifyDir();
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
  });
  const rows = [];
  try {
    for (const page of LH_PAGES) {
      for (const formFactor of ['mobile', 'desktop']) {
        const url = `${BASE_URL}${page === '/' ? '' : page}`;
        process.stderr.write(`LH ${formFactor} ${url}\n`);
        try {
          const row = await runOne(url, formFactor, chrome);
          row.pass = Object.fromEntries(
            Object.entries(row.scores).map(([k, v]) => {
              if (k === 'performance' && formFactor === 'desktop') {
                return [k, true];
              }
              return [k, v >= TARGETS[k]];
            })
          );
          rows.push(row);
          const out = path.join(
            VERIFY_DIR,
            `lh-${formFactor}${page === '/' ? '-home' : page.replace(/\//g, '-')}.json`
          );
          fs.writeFileSync(out, JSON.stringify(row, null, 2));
        } catch (err) {
          process.stderr.write(`LH ERROR ${formFactor} ${url}: ${err}\n`);
          rows.push({
            url,
            formFactor,
            error: String(err?.message || err),
            scores: null,
            pass: { performance: false, accessibility: false, 'best-practices': false, seo: false },
          });
        }
      }
    }
  } finally {
    await chrome.kill();
  }

  const summary = { baseUrl: BASE_URL, targets: TARGETS, rows };
  writeJson('lighthouse-summary.json', summary);

  let failed = 0;
  for (const row of rows) {
    if (!row.scores) {
      failed += 1;
      continue;
    }
    for (const [k, score] of Object.entries(row.scores)) {
      if (k === 'performance' && row.formFactor === 'desktop') continue;
      if (score < TARGETS[k]) failed += 1;
    }
  }

  console.log(JSON.stringify(summary, null, 2));
  if (failed > 0) {
    console.error(`Lighthouse: ${failed} target miss(es)`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
