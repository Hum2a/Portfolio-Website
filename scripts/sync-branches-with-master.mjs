#!/usr/bin/env node
/**
 * Sync every local branch (and optionally remote-tracking branches) with master.
 *
 * Default:
 *   1. Abort if the working tree is dirty
 *   2. git fetch --prune --all
 *   3. Fast-forward master to origin/master
 *   4. Merge master into every other local branch
 *   5. Restore the branch you started on
 *
 * Flags:
 *   --dry-run     Print actions only
 *   --push        After each successful merge, push the branch to origin
 *   --include-remote-only
 *                 Also checkout remote-only origin/* branches (except HEAD),
 *                 merge master, and (with --push) update the remote
 *   --base NAME   Base branch (default: master)
 *
 * Usage:
 *   npm run sync:branches
 *   npm run sync:branches -- --dry-run
 *   npm run sync:branches -- --push
 *   npm run sync:branches -- --push --include-remote-only
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs(argv) {
  const baseIdx = argv.findIndex((a) => a === '--base');
  return {
    dryRun: argv.includes('--dry-run'),
    push: argv.includes('--push'),
    includeRemoteOnly: argv.includes('--include-remote-only'),
    base:
      baseIdx >= 0 && argv[baseIdx + 1] && !argv[baseIdx + 1].startsWith('-')
        ? argv[baseIdx + 1]
        : 'master',
    help: argv.includes('--help') || argv.includes('-h'),
  };
}

function git(args, { allowFail = false, input } = {}) {
  const result = spawnSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: false,
    input,
  });
  if (!allowFail && result.status !== 0) {
    const err = (result.stderr || result.stdout || '').trim();
    throw new Error(`git ${args.join(' ')} failed${err ? `\n${err}` : ''}`);
  }
  return {
    status: result.status ?? 1,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim(),
  };
}

function lines(stdout) {
  return stdout
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function printHelp() {
  console.log(`Sync local/remote branches with master.

  npm run sync:branches
  npm run sync:branches -- --dry-run
  npm run sync:branches -- --push
  npm run sync:branches -- --push --include-remote-only
  npm run sync:branches -- --base main
`);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    printHelp();
    return;
  }

  const base = opts.base;
  const start = git(['rev-parse', '--abbrev-ref', 'HEAD']).stdout;
  console.log(`Starting on ${start}; base=${base}`);

  const dirty = git(['status', '--porcelain']).stdout;
  if (dirty && !opts.dryRun) {
    console.error(
      'Working tree is dirty. Commit/stash changes before syncing branches.\n' +
        dirty
    );
    process.exit(1);
  }
  if (dirty && opts.dryRun) {
    console.warn('Working tree is dirty (ignored for --dry-run).\n');
  }

  const run = (args, label) => {
    if (opts.dryRun) {
      console.log(`[dry-run] git ${args.join(' ')}${label ? `  # ${label}` : ''}`);
      return { status: 0, stdout: '', stderr: '' };
    }
    return git(args);
  };

  run(['fetch', '--prune', '--all'], 'refresh remotes');

  // Ensure base exists locally and matches origin when possible
  const hasOriginBase =
    git(['show-ref', '--verify', '--quiet', `refs/remotes/origin/${base}`], {
      allowFail: true,
    }).status === 0;

  if (!opts.dryRun) {
    git(['checkout', base]);
  } else {
    console.log(`[dry-run] git checkout ${base}`);
  }

  if (hasOriginBase) {
    run(
      ['merge', '--ff-only', `origin/${base}`],
      `fast-forward ${base}`
    );
  } else {
    console.warn(`No origin/${base} — skipping fast-forward of ${base}`);
  }

  const localBranches = lines(
    git(['for-each-ref', '--format=%(refname:short)', 'refs/heads/']).stdout
  ).filter((b) => b !== base);

  const remoteOnly = opts.includeRemoteOnly
    ? lines(
        git([
          'for-each-ref',
          '--format=%(refname:short)',
          'refs/remotes/origin/',
        ]).stdout
      )
        .map((r) => r.replace(/^origin\//, ''))
        .filter((b) => {
          if (!b || b === 'HEAD' || b === base || b === 'origin') return false;
          if (localBranches.includes(b)) return false;
          // Ensure a real remote branch exists (skip symbolic HEAD aliases)
          return (
            git(
              ['show-ref', '--verify', '--quiet', `refs/remotes/origin/${b}`],
              { allowFail: true }
            ).status === 0
          );
        })
    : [];

  const flatTargets = [
    ...localBranches.map((name) => ({ name, remoteOnly: false })),
    ...remoteOnly.map((name) => ({ name, remoteOnly: true })),
  ];

  const summary = { ok: [], skipped: [], failed: [] };

  for (const { name, remoteOnly: isRemoteOnly } of flatTargets) {
    try {
      console.log(`\n→ ${name}${isRemoteOnly ? ' (from origin)' : ''}`);
      if (isRemoteOnly) {
        run(
          ['checkout', '-B', name, `origin/${name}`],
          `track origin/${name}`
        );
      } else if (!opts.dryRun) {
        git(['checkout', name]);
      } else {
        console.log(`[dry-run] git checkout ${name}`);
      }

      // Already contains base?
      const tip = opts.dryRun ? name : 'HEAD';
      const contains = git(
        ['merge-base', '--is-ancestor', base, tip],
        { allowFail: true }
      );
      const aheadOfBase =
        git(['rev-list', '--count', `${base}..${tip}`], { allowFail: true })
          .stdout || '0';
      const behindBase =
        git(['rev-list', '--count', `${tip}..${base}`], { allowFail: true })
          .stdout || '0';

      if (contains.status === 0 && behindBase === '0') {
        console.log(`  already up to date with ${base} (ahead ${aheadOfBase})`);
        summary.skipped.push(name);
      } else {
        run(['merge', '--no-edit', base], `merge ${base} into ${name}`);
        if (!opts.dryRun) console.log(`  merged ${base}`);
        summary.ok.push(name);
      }

      if (opts.push) {
        run(['push', '-u', 'origin', name], `push ${name}`);
        if (!opts.dryRun) console.log(`  pushed origin/${name}`);
      }
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
      summary.failed.push(name);
      // Abort merge if stuck
      if (!opts.dryRun) {
        git(['merge', '--abort'], { allowFail: true });
      }
    }
  }

  // Restore starting branch
  if (!opts.dryRun) {
    git(['checkout', start], { allowFail: true });
  } else {
    console.log(`\n[dry-run] git checkout ${start}`);
  }

  console.log('\nSummary');
  console.log(`  merged:  ${summary.ok.join(', ') || '(none)'}`);
  console.log(`  skipped: ${summary.skipped.join(', ') || '(none)'}`);
  console.log(`  failed:  ${summary.failed.join(', ') || '(none)'}`);
  if (flatTargets.length === 0) {
    console.log('  (no other branches to sync)');
  }

  if (summary.failed.length) process.exitCode = 1;
}

try {
  main();
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
