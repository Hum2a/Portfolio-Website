import fs from 'node:fs';
import path from 'node:path';
import { ROOT, VERIFY_DIR, ensureVerifyDir, writeJson } from './lib.mjs';

function main() {
  ensureVerifyDir();
  const htmlPath = path.join(ROOT, 'build/index.html');
  if (!fs.existsSync(htmlPath)) {
    console.error('build/index.html missing — run vite build first');
    process.exit(1);
  }
  const html = fs.readFileSync(htmlPath, 'utf8');
  const mainMatch = html.match(/\/assets\/(index-[^"]+\.js)/);
  if (!mainMatch) {
    console.error('Could not find main entry script in index.html');
    process.exit(1);
  }
  const mainName = mainMatch[1];
  const mainPath = path.join(ROOT, 'build/assets', mainName);
  const main = fs.readFileSync(mainPath, 'utf8');

  const assetsDir = path.join(ROOT, 'build/assets');
  const files = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.js'));

  const findChunk = (predicate) =>
    files.find((f) => predicate(fs.readFileSync(path.join(assetsDir, f), 'utf8'), f));

  const trafficChunk = findChunk((s) => s.includes('Traffic Analytics'));
  const loginChunk = findChunk(
    (s, f) => f.includes('HumzaLogin') || s.includes('humza-login') || s.includes('Humza Login')
  );
  const caseStudyChunk = findChunk(
    (s, f) =>
      f.includes('ProjectCaseStudy') ||
      (s.includes('case study') && s.includes('caseStudy') && !f.startsWith('index-'))
  );

  const mainImportsRecharts = /from"\.\/recharts-/.test(main);
  const mainHasTraffic = main.includes('Traffic Analytics');
  const mainHasHumzaLogin =
    main.includes('HumzaLogin') && !main.includes(`HumzaLogin-`); // weak
  // Preload map may mention lazy chunk names — check static import only
  const mainStaticLoginImport = /from"\.\/HumzaLogin-/.test(main);

  const statsHtml = path.join(VERIFY_DIR, 'stats.html');
  const statsJson = path.join(VERIFY_DIR, 'stats.json');

  const summary = {
    mainEntry: mainName,
    mainImportsRecharts,
    mainHasTrafficAnalyticsString: mainHasTraffic,
    mainStaticLoginImport,
    trafficChunk: trafficChunk || null,
    loginChunk: loginChunk || null,
    caseStudyChunk: caseStudyChunk || null,
    visualizerHtmlExists: fs.existsSync(statsHtml),
    visualizerJsonExists: fs.existsSync(statsJson),
    pass:
      !mainImportsRecharts &&
      !mainHasTraffic &&
      !mainStaticLoginImport &&
      !!trafficChunk,
  };

  writeJson('bundle-summary.json', summary);
  console.log(JSON.stringify(summary, null, 2));
  if (!summary.pass) process.exitCode = 1;
}

main();
