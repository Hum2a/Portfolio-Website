import { chromium } from 'playwright';
import {
  BASE_URL,
  contrastRatio,
  composite,
  parseColor,
  ensureVerifyDir,
  writeJson,
} from './lib.mjs';

async function main() {
  ensureVerifyDir();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(BASE_URL, { waitUntil: 'load', timeout: 45000 });
  await page.waitForTimeout(500);

  const measured = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const get = (name) => root.getPropertyValue(name).trim();

    const probe = document.createElement('div');
    probe.style.cssText =
      'position:fixed;left:-9999px;top:0;padding:8px;font-size:14px;';
    document.body.appendChild(probe);

    const readPair = (fgVar, bgClassOrColor) => {
      probe.className = '';
      probe.style.color = `var(${fgVar})`;
      if (bgClassOrColor.startsWith('.')) {
        probe.className = bgClassOrColor.slice(1);
        probe.style.background = '';
      } else if (bgClassOrColor.startsWith('var(')) {
        probe.style.background = bgClassOrColor;
      } else {
        probe.style.background = bgClassOrColor;
      }
      const cs = getComputedStyle(probe);
      return {
        color: cs.color,
        backgroundColor: cs.backgroundColor,
      };
    };

    const surface = document.createElement('div');
    surface.className = 'surface-2';
    surface.style.cssText =
      'position:fixed;left:-9999px;top:40px;padding:12px;color:var(--text-tertiary);font-size:14px;';
    surface.textContent = 'tertiary';
    document.body.appendChild(surface);
    const surfaceCs = getComputedStyle(surface);

    // Composite translucent backgrounds over the page canvas for true contrast.
    const pageBg = getComputedStyle(document.body).backgroundColor;

    const cta = document.createElement('button');
    cta.setAttribute('data-slot', 'button');
    cta.className = 'inline-flex items-center justify-center rounded-lg bg-primary text-on-accent px-4 py-2';
    cta.style.cssText =
      'position:fixed;left:-9999px;top:80px;background:var(--accent);color:var(--text-on-accent);';
    cta.textContent = 'CTA';
    document.body.appendChild(cta);
    const ctaCs = getComputedStyle(cta);

    const tertiaryOnPrimary = readPair('--text-tertiary', 'var(--bg-primary)');

    return {
      pageBg,
      tokens: {
        '--bg-primary': get('--bg-primary'),
        '--bg-elevated-2': get('--bg-elevated-2'),
        '--text-tertiary': get('--text-tertiary'),
        '--text-on-accent': get('--text-on-accent'),
        '--accent': get('--accent'),
      },
      tertiaryOnPrimary,
      tertiaryOnSurface2: {
        color: surfaceCs.color,
        backgroundColor: surfaceCs.backgroundColor,
      },
      ctaOnAccent: {
        color: ctaCs.color,
        backgroundColor: ctaCs.backgroundColor,
      },
    };
  });

  await browser.close();

  const pageBg = measured.pageBg || measured.tokens['--bg-primary'];
  const pairs = [
    {
      id: 'text-tertiary on bg-primary',
      before: 3.93,
      target: 4.5,
      fg: measured.tertiaryOnPrimary.color,
      bg: measured.tertiaryOnPrimary.backgroundColor,
    },
    {
      id: 'text-tertiary on surface-2 / card',
      before: 3.34,
      target: 4.5,
      fg: measured.tertiaryOnSurface2.color,
      bg: measured.tertiaryOnSurface2.backgroundColor,
      pageBg,
    },
    {
      id: 'CTA text-on-accent on accent',
      before: 3.07,
      target: 4.5,
      fg: measured.ctaOnAccent.color,
      bg: measured.ctaOnAccent.backgroundColor,
    },
  ].map((p) => {
    let bg = p.bg;
    const parsedBg = parseColor(bg);
    if (parsedBg && (parsedBg.a ?? 1) < 1 && p.pageBg) {
      const base = parseColor(p.pageBg) || parseColor(measured.tokens['--bg-primary']);
      if (base) {
        const comp = composite(parsedBg, base);
        bg = `rgb(${Math.round(comp.r)}, ${Math.round(comp.g)}, ${Math.round(comp.b)})`;
      }
    }
    const ratio = contrastRatio(p.fg, bg);
    return {
      id: p.id,
      before: p.before,
      target: p.target,
      fg: p.fg,
      bg,
      ratio: ratio ? Number(ratio.toFixed(2)) : null,
      pass: ratio != null && ratio >= p.target,
    };
  });

  const summary = { baseUrl: BASE_URL, measured, pairs };
  writeJson('contrast-summary.json', summary);
  console.log(JSON.stringify(summary, null, 2));
  if (pairs.some((p) => !p.pass)) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
