#!/usr/bin/env node
/**
 * Upsert every non-empty .env value onto the Cloudflare Worker as secrets.
 * Never deletes secrets that aren't in the upload set.
 *
 * Also ensures Worker runtime keys exist:
 *   NOTIFY_SECRET  ← NOTIFY_SECRET || REACT_APP_TRAFFIC_NOTIFY_SECRET
 *   RESEND_API_KEY ← RESEND_API_KEY
 *
 * REACT_APP_* still must be present at `npm run build` to appear in the client bundle.
 * Uploading them to the Worker is a backup / dashboard mirror only.
 *
 * Usage:
 *   npm run secrets:sync
 *   npm run secrets:sync -- --dry-run
 *   npm run secrets:sync -- --deploy
 *   npm run secrets:sync -- --dev-vars
 *   npm run secrets:sync -- --worker-only   # only NOTIFY_SECRET + RESEND_API_KEY
 */

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const ENV_FILES = ['.env.local', '.env.production.local', '.env.production', '.env'];
const REQUIRED_WORKER_KEYS = ['NOTIFY_SECRET', 'RESEND_API_KEY'];

/** Build/tooling keys — never upload these as Worker secrets. */
const SKIP_KEYS = new Set([
  'DISABLE_ESLINT_PLUGIN',
  'ESLINT_NO_DEV_ERRORS',
  'TSC_COMPILE_ON_ERROR',
  'GENERATE_SOURCEMAP',
  'INLINE_RUNTIME_CHUNK',
  'IMAGE_INLINE_SIZE_LIMIT',
  'CI',
  'PUBLIC_URL',
  'NODE_ENV',
  'BABEL_ENV',
  'BROWSER',
  'HOST',
  'PORT',
  'HTTPS',
  'SSL_CRT_FILE',
  'SSL_KEY_FILE',
  'FAST_REFRESH',
  'WDS_SOCKET_HOST',
  'WDS_SOCKET_PATH',
  'WDS_SOCKET_PORT',
]);

/** Skip empty / obvious placeholder values from .env.example-style files. */
const PLACEHOLDER_VALUES = new Set([
  'your_firebase_api_key',
  'your_project_id.firebaseapp.com',
  'your_project_id',
  'your_project_id.firebasestorage.app',
  'your_messaging_sender_id',
  'your_app_id',
  'your_ipinfo_token',
  'YOUR_IPINFO_TOKEN',
  'changeme',
  'replace_me',
  'todo',
  'xxx',
]);

function parseArgs(argv) {
  return {
    dryRun: argv.includes('--dry-run'),
    deploy: argv.includes('--deploy'),
    writeDevVars: argv.includes('--dev-vars'),
    workerOnly: argv.includes('--worker-only'),
    help: argv.includes('--help') || argv.includes('-h'),
  };
}

function parseEnvFile(filePath) {
  const out = {};
  const text = readFileSync(filePath, 'utf8');
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const cleaned = line.startsWith('export ') ? line.slice(7).trim() : line;
    const eq = cleaned.indexOf('=');
    if (eq <= 0) continue;
    const key = cleaned.slice(0, eq).trim();
    let value = cleaned.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

function loadEnv() {
  const merged = {};
  const loaded = [];
  for (const name of [...ENV_FILES].reverse()) {
    const path = join(ROOT, name);
    if (!existsSync(path)) continue;
    Object.assign(merged, parseEnvFile(path));
    loaded.push(name);
  }
  return { env: merged, loaded };
}

function isUsableSecretValue(value) {
  const trimmed = (value || '').trim();
  if (!trimmed) return false;
  if (PLACEHOLDER_VALUES.has(trimmed)) return false;
  if (/^your[_-]/i.test(trimmed)) return false;
  return true;
}

/**
 * Build the full upsert map from .env.
 * - Default: every non-empty, non-placeholder key
 * - --worker-only: NOTIFY_SECRET + RESEND_API_KEY only
 * Always mirrors notify token into NOTIFY_SECRET when possible.
 */
function resolveSecretsToSync(env, { workerOnly }) {
  const secrets = {};

  if (workerOnly) {
    const notify =
      (env.NOTIFY_SECRET || '').trim() ||
      (env.REACT_APP_TRAFFIC_NOTIFY_SECRET || '').trim();
    const resend = (env.RESEND_API_KEY || '').trim();
    if (isUsableSecretValue(notify)) secrets.NOTIFY_SECRET = notify;
    if (isUsableSecretValue(resend)) secrets.RESEND_API_KEY = resend;
    return secrets;
  }

  for (const [key, raw] of Object.entries(env)) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
    if (SKIP_KEYS.has(key)) continue;
    if (!isUsableSecretValue(raw)) continue;
    secrets[key] = raw.trim();
  }

  // Worker auth token fallback if only the CRA-prefixed copy is set
  if (!secrets.NOTIFY_SECRET && isUsableSecretValue(env.REACT_APP_TRAFFIC_NOTIFY_SECRET)) {
    secrets.NOTIFY_SECRET = env.REACT_APP_TRAFFIC_NOTIFY_SECRET.trim();
  }

  return secrets;
}

function mask(value) {
  if (!value) return '(empty)';
  if (value.length <= 8) return '*'.repeat(value.length);
  return `${value.slice(0, 3)}…${value.slice(-3)} (${value.length} chars)`;
}

function printHelp() {
  console.log(`Upsert .env values to Cloudflare Worker secrets (never deletes others).

Reads: ${ENV_FILES.join(', ')}
Default: uploads every non-empty, non-placeholder key from .env
Required for email notify: ${REQUIRED_WORKER_KEYS.join(', ')}

Options:
  --dry-run       Show what would be uploaded (values masked)
  --deploy        After sync, run npm run deploy (bakes REACT_APP_* into the bundle)
  --dev-vars      Also write .dev.vars for local wrangler dev
  --worker-only   Only upload NOTIFY_SECRET + RESEND_API_KEY
  --help          Show this help

Security:
  NOTIFY_SECRET must NOT be your Resend API key. Use a separate random string for
  NOTIFY_SECRET / REACT_APP_TRAFFIC_NOTIFY_SECRET, and keep RESEND_API_KEY Worker-only.
`);
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    shell: true,
    stdio: 'inherit',
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    const detail = result.stderr || result.stdout || `exit ${result.status}`;
    throw new Error(`Command failed: ${command} ${args.join(' ')}\n${detail}`);
  }
  return result;
}

function listRemoteSecretNames() {
  const result = spawnSync('npx', ['wrangler', 'secret', 'list', '--format', 'json'], {
    cwd: ROOT,
    shell: true,
    encoding: 'utf8',
  });
  if (result.status !== 0) return null;
  try {
    const parsed = JSON.parse(result.stdout || '[]');
    if (!Array.isArray(parsed)) return null;
    return parsed
      .map((item) => item?.name || item?.binding || item)
      .filter((name) => typeof name === 'string');
  } catch {
    return null;
  }
}

function putSecret(name, value) {
  // Feed the value via stdin — avoids fragile Windows cmd file redirection.
  // shell:true helps resolve npx.cmd on Windows PATH.
  const result = spawnSync('npx', ['wrangler', 'secret', 'put', name], {
    cwd: ROOT,
    shell: true,
    stdio: ['pipe', 'inherit', 'inherit'],
    encoding: 'utf8',
    input: `${value}\n`,
  });

  if (result.status !== 0) {
    throw new Error(`Failed to put secret ${name}`);
  }
}

function writeDevVars(secrets) {
  const path = join(ROOT, '.dev.vars');
  const lines = [
    '# Generated by scripts/sync-cloudflare-secrets.mjs — do not commit',
    ...Object.entries(secrets)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`),
    '',
  ];
  writeFileSync(path, lines.join('\n'), 'utf8');
  console.log('Wrote .dev.vars');
}

function warnSecurity(secrets, env) {
  const notify = (secrets.NOTIFY_SECRET || '').trim();
  const resend = (secrets.RESEND_API_KEY || '').trim();
  const clientNotify = (env.REACT_APP_TRAFFIC_NOTIFY_SECRET || '').trim();

  if (notify && resend && notify === resend) {
    console.warn(
      '\nSECURITY: NOTIFY_SECRET is identical to RESEND_API_KEY.\n' +
        '  REACT_APP_TRAFFIC_NOTIFY_SECRET is shipped in the browser bundle, so this\n' +
        '  exposes your Resend API key publicly. Generate a separate random notify token:\n' +
        '    NOTIFY_SECRET=<random>\n' +
        '    REACT_APP_TRAFFIC_NOTIFY_SECRET=<same random>\n' +
        '    RESEND_API_KEY=<resend key, Worker only>\n' +
        '  Then rotate the Resend key in the Resend dashboard.'
    );
  }

  if (clientNotify && resend && clientNotify === resend) {
    console.warn(
      '\nSECURITY: REACT_APP_TRAFFIC_NOTIFY_SECRET matches RESEND_API_KEY — same leak risk.'
    );
  }
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    printHelp();
    return;
  }

  const { env, loaded } = loadEnv();
  if (!loaded.length) {
    console.error('No .env files found. Copy .env.example to .env and fill secrets first.');
    process.exit(1);
  }

  console.log(`Loaded env from: ${loaded.join(', ')}`);

  const secrets = resolveSecretsToSync(env, { workerOnly: opts.workerOnly });
  const keys = Object.keys(secrets).sort();
  const missingRequired = REQUIRED_WORKER_KEYS.filter((k) => !secrets[k]);
  const clientSecret = (env.REACT_APP_TRAFFIC_NOTIFY_SECRET || '').trim();

  console.log(
    `\nSecrets to upsert (${keys.length}${opts.workerOnly ? ', worker-only mode' : ''}):`
  );
  for (const key of keys) {
    const tag = key.startsWith('REACT_APP_') ? ' [CRA / backup]' : '';
    console.log(`  ${key}: ${mask(secrets[key])}${tag}`);
  }

  const skipped = Object.entries(env)
    .filter(([key, value]) => {
      if (secrets[key]) return false;
      if (SKIP_KEYS.has(key)) return true;
      const trimmed = (value || '').trim();
      return !trimmed || PLACEHOLDER_VALUES.has(trimmed) || /^your[_-]/i.test(trimmed);
    })
    .map(([key]) => key);
  if (skipped.length) {
    console.log(`\nSkipped empty/placeholder/build keys: ${skipped.join(', ')}`);
  }

  const remoteNames = listRemoteSecretNames();
  if (remoteNames) {
    console.log(
      `\nExisting Worker secrets (${remoteNames.length}): ${remoteNames.join(', ') || '(none)'}`
    );
    const remoteOnly = remoteNames.filter((name) => !secrets[name]);
    if (remoteOnly.length) {
      console.log(
        `Remote-only secrets (left untouched): ${remoteOnly.join(', ')}`
      );
    }
  }

  if (missingRequired.length) {
    console.error(
      `\nMissing required Worker secrets: ${missingRequired.join(', ')}\n` +
        'Add them to .env (see .env.example), then re-run.'
    );
    process.exit(1);
  }

  if (!isUsableSecretValue(clientSecret)) {
    console.warn(
      '\nWarning: REACT_APP_TRAFFIC_NOTIFY_SECRET is empty/placeholder.\n' +
        '  Production notify/test emails need it at build time. Set it to the same\n' +
        '  value as NOTIFY_SECRET, then: npm run secrets:sync -- --deploy'
    );
  } else if (secrets.NOTIFY_SECRET && secrets.NOTIFY_SECRET !== clientSecret.trim()) {
    console.warn(
      '\nWarning: NOTIFY_SECRET and REACT_APP_TRAFFIC_NOTIFY_SECRET differ.\n' +
        '  They must match or the Worker will reject notify requests with 401.'
    );
  }

  warnSecurity(secrets, env);

  if (opts.dryRun) {
    console.log('\nDry run — nothing uploaded.');
    return;
  }

  console.log('\nUpserting with wrangler secret put (other remote secrets are left alone)…');
  for (const key of keys) {
    console.log(`  → ${key}`);
    putSecret(key, secrets[key]);
  }
  console.log(`Done. Upserted ${keys.length} secret(s).`);

  if (opts.writeDevVars) {
    writeDevVars(secrets);
  }

  if (opts.deploy) {
    if (!isUsableSecretValue(clientSecret)) {
      console.error(
        '\nCannot --deploy: REACT_APP_TRAFFIC_NOTIFY_SECRET is missing from .env.'
      );
      process.exit(1);
    }
    console.log('\nBuilding and deploying so REACT_APP_* values are baked into production…');
    run('npm', ['run', 'deploy']);
    console.log('Deploy complete.');
  } else if (isUsableSecretValue(clientSecret)) {
    console.log(
      '\nNext: rebuild production so the client picks up REACT_APP_* values:\n' +
        '  npm run deploy\n' +
        'or:\n' +
        '  npm run secrets:sync -- --deploy'
    );
  }
}

try {
  main();
} catch (err) {
  console.error(err?.message || err);
  process.exit(1);
}
