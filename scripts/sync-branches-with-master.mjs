#!/usr/bin/env node
/**
 * Sync every local + origin branch with master, then push each to origin.
 *
 * Default:
 *   1. Abort if the working tree is dirty
 *   2. git fetch --prune --all
 *   3. Fast-forward master to origin/master and push master
 *   4. For every other local branch AND every origin-only branch:
 *        checkout → merge master → push -u origin <branch>
 *   5. Restore the branch you started on
 *
 * Flags:
 *   --dry-run     Print actions only
 *   --no-push     Skip pushing to origin (local merges only)
 *   --local-only  Skip remote-only origin/* branches
 *   --base NAME   Base branch (default: master)
 *
 * Usage:
 *   npm run sync:branches
 *   npm run sync:branches -- --dry-run
 *   npm run sync:branches -- --no-push
 *   npm run sync:branches -- --local-only
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs(argv) {
  const baseIdx = argv.findIndex((a) => a === '--base');
  return {
    dryRun: argv.includes('--dry-run'),
    noPush: argv.includes('--no-push'),
    localOnly: argv.includes('--local-only'),
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
  console.log(`Sync local + origin branches with master, then push each to origin.

  npm run sync:branches
  npm run sync:branches -- --dry-run
  npm run sync:branches -- --no-push
  npm run sync:branches -- --local-only
  npm run sync:branches -- --base main
`);
}

function pushOrigin(run, opts, name) {
  if (opts.noPush) return;
  run(['push', '-u', 'origin', name], `push origin/${name}`);
  if (!opts.dryRun) console.log(`  pushed origin/${name}`);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    printHelp();
    return;
  }

  const base = opts.base;
  const start = git(['rev-parse', '--abbrev-ref', 'HEAD']).stdout;
  console.log(
    `Starting on ${start}; base=${base}; push=${opts.noPush ? 'off' : 'on'}; remote-only=${opts.localOnly ? 'off' : 'on'}`
  );

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
    run(['merge', '--ff-only', `origin/${base}`], `fast-forward ${base}`);
  } else {
    console.warn(`No origin/${base} — skipping fast-forward of ${base}`);
  }

  // Always keep origin/master (base) current too
  pushOrigin(run, opts, base);

  const localBranches = lines(
    git(['for-each-ref', '--format=%(refname:short)', 'refs/heads/']).stdout
  ).filter((b) => b !== base);

  const remoteOnly = opts.localOnly
    ? []
    : lines(
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
          return (
            git(
              ['show-ref', '--verify', '--quiet', `refs/remotes/origin/${b}`],
              { allowFail: true }
            ).status === 0
          );
        });

  const flatTargets = [
    ...localBranches.map((name) => ({ name, remoteOnly: false })),
    ...remoteOnly.map((name) => ({ name, remoteOnly: true })),
  ];

  const summary = { ok: [], skipped: [], pushed: [], failed: [] };

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

      const tip = opts.dryRun ? name : 'HEAD';
      const contains = git(['merge-base', '--is-ancestor', base, tip], {
        allowFail: true,
      });
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

      pushOrigin(run, opts, name);
      if (!opts.noPush) summary.pushed.push(name);
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
      summary.failed.push(name);
      if (!opts.dryRun) {
        git(['merge', '--abort'], { allowFail: true });
      }
    }
  }

  if (!opts.dryRun) {
    git(['checkout', start], { allowFail: true });
  } else {
    console.log(`\n[dry-run] git checkout ${start}`);
  }

  console.log('\nSummary');
  console.log(`  merged:  ${summary.ok.join(', ') || '(none)'}`);
  console.log(`  skipped: ${summary.skipped.join(', ') || '(none)'}`);
  console.log(`  pushed:  ${summary.pushed.join(', ') || '(none)'}`);
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
