import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '../..');
export const VERIFY_DIR = path.join(ROOT, 'tmp/verify');
export const BASE_URL = process.env.VERIFY_BASE_URL || 'http://127.0.0.1:4173';

export const LH_PAGES = [
  '/',
  '/projects',
  '/about',
  '/career',
  '/contact',
  '/bgr8',
];

export function ensureVerifyDir() {
  fs.mkdirSync(VERIFY_DIR, { recursive: true });
}

export function writeJson(name, data) {
  ensureVerifyDir();
  const file = path.join(VERIFY_DIR, name);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return file;
}

export function loadProjectsRoutes() {
  const raw = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'src/config/projects.json'), 'utf8')
  );
  const routes = (raw.projects || []).map((p) => p.route);
  routes.push('/breathapplyser-v2');
  return [...new Set(routes)];
}

export function allPublicRoutes() {
  return [
    '/',
    '/projects',
    '/about',
    '/career',
    '/contact',
    '/github',
    '/humza-login',
    '/linkedin',
    '/traffic',
    ...loadProjectsRoutes(),
  ];
}

/** Relative luminance + contrast (sRGB hex or rgb()/rgba()). */
export function parseColor(input) {
  if (!input) return null;
  const s = String(input).trim();
  if (s.startsWith('#')) {
    let h = s.slice(1);
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    if (h.length === 8) h = h.slice(0, 6);
    const n = parseInt(h, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  const m = s.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i
  );
  if (m) {
    return {
      r: Number(m[1]),
      g: Number(m[2]),
      b: Number(m[3]),
      a: m[4] === undefined ? 1 : Number(m[4]),
    };
  }
  const c = s.match(
    /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/i
  );
  if (c) {
    return {
      r: Number(c[1]) * 255,
      g: Number(c[2]) * 255,
      b: Number(c[3]) * 255,
      a: c[4] === undefined ? 1 : Number(c[4]),
    };
  }
  return null;
}

function channel(c) {
  const x = c / 255;
  return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
}

export function luminance(color) {
  const { r, g, b } = color;
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Composite FG over BG when FG has alpha < 1 */
export function composite(fg, bg) {
  const a = fg.a ?? 1;
  if (a >= 1) return { r: fg.r, g: fg.g, b: fg.b, a: 1 };
  return {
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a),
    a: 1,
  };
}

export function contrastRatio(fgInput, bgInput) {
  let fg = parseColor(fgInput);
  let bg = parseColor(bgInput);
  if (!fg || !bg) return null;
  if ((fg.a ?? 1) < 1) fg = composite(fg, bg);
  const L1 = luminance(fg);
  const L2 = luminance(bg);
  const hi = Math.max(L1, L2);
  const lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
}
