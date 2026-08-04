#!/usr/bin/env node
/**
 * After vite build, write per-route HTML shells with correct meta tags so
 * crawlers/LH see description/canonical in the first HTML response.
 * SPA assets still hydrate via the same JS bundle.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BUILD = join(ROOT, 'build');
const PROJECTS = join(ROOT, 'src', 'config', 'projects.json');
const ORIGIN = 'https://humza-butt.space';

const DEFAULT_DESC =
  'Humza Butt - Software Engineer, Full Stack & Platform Configuration. Sutton, UK. Enterprise platform work for Shell, the BBC, the NHS and the Home Office. 29 shipped projects across web, mobile, desktop and extensions.';

const STATIC_ROUTES = [
  {
    path: '/projects',
    title: 'Projects | Humza Butt',
    description:
      '29 shipped projects across web, mobile, desktop and extensions — case studies by Humza Butt.',
  },
  {
    path: '/about',
    title: 'About | Humza Butt',
    description:
      'About Humza Butt — Software Engineer, Full Stack & Platform Configuration based in Sutton, UK.',
  },
  {
    path: '/career',
    title: 'Career | Humza Butt',
    description:
      'Career timeline for Humza Butt — CoreStream GRC (Shell, BBC, NHS, Home Office), LifeSmart, Bgr8 and education.',
  },
  {
    path: '/contact',
    title: 'Contact | Humza Butt',
    description:
      'Contact Humza Butt — available for contract work. Sutton, UK.',
  },
  {
    path: '/github',
    title: 'GitHub | Humza Butt',
    description: 'GitHub activity and repositories for Humza Butt.',
  },
];

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function patchHtml(html, { path, title, description, image }) {
  const url = path === '/' ? `${ORIGIN}/` : `${ORIGIN}${path}`;
  const ogImage = image || `${ORIGIN}/images/portfolio-preview.jpg`;
  let out = html;

  out = out.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeAttr(title)}</title>`
  );
  out = out.replace(
    /<meta name="title" content="[^"]*" \/>/,
    `<meta name="title" content="${escapeAttr(title)}" />`
  );
  out = out.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escapeAttr(description)}" />`
  );
  out = out.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${url}" />`
  );
  out = out.replace(
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${url}" />`
  );
  out = out.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${escapeAttr(title)}" />`
  );
  out = out.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${escapeAttr(description)}" />`
  );
  out = out.replace(
    /<meta property="og:image" content="[^"]*" \/>/,
    `<meta property="og:image" content="${ogImage}" />`
  );
  out = out.replace(
    /<meta property="twitter:url" content="[^"]*" \/>/,
    `<meta property="twitter:url" content="${url}" />`
  );
  out = out.replace(
    /<meta property="twitter:title" content="[^"]*" \/>/,
    `<meta property="twitter:title" content="${escapeAttr(title)}" />`
  );
  out = out.replace(
    /<meta property="twitter:description" content="[^"]*" \/>/,
    `<meta property="twitter:description" content="${escapeAttr(description)}" />`
  );
  out = out.replace(
    /<meta property="twitter:image" content="[^"]*" \/>/,
    `<meta property="twitter:image" content="${ogImage}" />`
  );
  out = out.replace(
    /<link rel="alternate" hreflang="en" href="[^"]*" \/>/,
    `<link rel="alternate" hreflang="en" href="${url}" />`
  );

  return out;
}

function writeRoute(template, route) {
  const dir =
    route.path === '/'
      ? BUILD
      : join(BUILD, route.path.replace(/^\//, ''));
  mkdirSync(dir, { recursive: true });
  const file = join(dir, 'index.html');
  writeFileSync(file, patchHtml(template, route), 'utf8');
  console.log('shell', route.path, '→', file);
}

function main() {
  const indexPath = join(BUILD, 'index.html');
  if (!existsSync(indexPath)) {
    console.error('build/index.html missing — run vite build first');
    process.exit(1);
  }
  const template = readFileSync(indexPath, 'utf8');

  for (const route of STATIC_ROUTES) {
    writeRoute(template, route);
  }

  if (existsSync(PROJECTS)) {
    const { projects } = JSON.parse(readFileSync(PROJECTS, 'utf8'));
    for (const p of projects) {
      if (!p.route) continue;
      const desc =
        p.caseStudy?.claim ||
        p.description ||
        DEFAULT_DESC;
      const image = existsSync(join(ROOT, 'public', 'og', `${p.id}.png`))
        ? `${ORIGIN}/og/${p.id}.png`
        : undefined;
      writeRoute(template, {
        path: p.route,
        title: `${p.name} | Humza Butt`,
        description: desc.slice(0, 300),
        image,
      });
    }
  }
}

main();
