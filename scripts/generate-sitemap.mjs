#!/usr/bin/env node
/**
 * Generate public/sitemap.xml from static routes + visible projects.
 */

import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ORIGIN = 'https://humza-butt.space';
const OUT = join(ROOT, 'public', 'sitemap.xml');
const PROJECTS = join(ROOT, 'src', 'config', 'projects.json');

const STATIC = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/projects', priority: '0.9', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/career', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/github', priority: '0.7', changefreq: 'weekly' },
];

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function main() {
  const data = JSON.parse(readFileSync(PROJECTS, 'utf8'));
  const today = new Date().toISOString().slice(0, 10);

  const urls = [...STATIC];
  for (const project of data.projects || []) {
    if (!project.visible || !project.route) continue;
    urls.push({
      path: project.route,
      priority: project.featured ? '0.8' : '0.6',
      changefreq: 'monthly',
      lastmod: project.dateUpdated || project.dateAdded || today,
    });
  }

  const body = urls
    .map((u) => {
      const loc = `${ORIGIN}${u.path === '/' ? '/' : u.path}`;
      const lastmod = u.lastmod || today;
      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

  writeFileSync(OUT, xml, 'utf8');

  for (const stale of ['sitemap-projects.xml', 'sitemap-index.xml']) {
    const p = join(ROOT, 'public', stale);
    if (existsSync(p)) unlinkSync(p);
  }

  console.log(`Wrote ${OUT} (${urls.length} URLs)`);
}

main();
