import React, { useCallback, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { FaStar, FaCodeBranch } from 'react-icons/fa';
import {
  PaperStackShuffle,
  finishPaperStack,
  shufflePaperStack,
  type SheetId,
} from '@/components/animations/paper-stack-shuffle';
import type { GitHubRepo } from '@/services/githubService';
import './GitHubRepoPaperStack.css';

type GitHubRepoPaperStackProps = {
  repos: GitHubRepo[];
};

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3776ab',
  Java: '#ed8b00',
  Kotlin: '#7f52ff',
  Swift: '#fa7343',
  'Objective-C': '#438eff',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Dart: '#00b4ab',
  Go: '#00add8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#00599c',
};

function RepoStackCard({
  repo,
  isActive,
}: {
  repo: GitHubRepo;
  isActive: boolean;
}) {
  const content = (
    <>
      <div className="github-stack-card__header">
        <h3 className="github-stack-card__name">{repo.name}</h3>
        {repo.language && (
          <span
            className="github-stack-card__language"
            style={{
              '--lang-color': LANGUAGE_COLORS[repo.language] || '#6b7280',
            } as React.CSSProperties}
          >
            {repo.language}
          </span>
        )}
      </div>
      {repo.description && (
        <p className="github-stack-card__desc">{repo.description}</p>
      )}
      {repo.topics?.length > 0 && (
        <div className="github-stack-card__topics">
          {repo.topics.slice(0, 4).map((topic) => (
            <span key={topic} className="github-stack-card__topic">
              {topic}
            </span>
          ))}
        </div>
      )}
      <div className="github-stack-card__stats">
        <span className="github-stack-card__stat">
          <FaStar aria-hidden="true" /> {repo.stargazers_count}
        </span>
        <span className="github-stack-card__stat">
          <FaCodeBranch aria-hidden="true" /> {repo.forks_count}
        </span>
      </div>
    </>
  );

  const className = 'github-stack-card surface-2';

  if (isActive) {
    return (
      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={`Open ${repo.name} on GitHub`}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={className} aria-hidden="true">
      {content}
    </div>
  );
}

const mod = (n: number, m: number) => ((n % m) + m) % m;

type StackState = { cursor: number; order: number[]; sheetRepo: number[] };

const INITIAL: StackState = { cursor: 0, order: [0, 1, 2, 3], sheetRepo: [0, 1, 2, 3] };

const GitHubRepoPaperStack: React.FC<GitHubRepoPaperStackProps> = ({ repos }) => {
  /** sheetRepo = repo index shown on each sheet. Content follows the sheet, never its depth. */
  const [state, setState] = useState<StackState>(INITIAL);
  const [busy, setBusy] = useState(false);
  const sheetRefs = useRef<(HTMLElement | null)[]>([null, null, null, null]);
  const demoRef = useRef<HTMLElement | null>(null);

  // Source of truth for the async shuffle loop; every write is mirrored into React state.
  const stateRef = useRef<StackState>(INITIAL);
  const runningRef = useRef(false);
  const pendingRef = useRef<'next' | 'prev' | null>(null);

  const commit = useCallback((next: StackState) => {
    stateRef.current = next;
    flushSync(() => setState(next));
  }, []);

  const { cursor, order, sheetRepo } = state;
  const activeRepo = repos[cursor];

  const runShuffle = useCallback(
    async (direction: 'next' | 'prev') => {
      const n = repos.length;
      if (n === 0) return;
      runningRef.current = true;
      let dir: 'next' | 'prev' | null = direction;

      while (dir) {
        const cur = stateRef.current;
        const nextCursor = dir === 'next' ? mod(cur.cursor + 1, n) : mod(cur.cursor - 1, n);

        if (dir === 'prev') {
          // The back sheet rises to the front: give it its repo before it moves.
          const repoBySheet = [...cur.sheetRepo];
          repoBySheet[cur.order[3]] = nextCursor;
          commit({ ...cur, sheetRepo: repoBySheet });
        }

        const newOrder = await shufflePaperStack(dir, {
          sheets: sheetRefs.current,
          order: stateRef.current.order,
          demoEl: demoRef.current,
          setBusy,
        });

        const repoBySheet = [...stateRef.current.sheetRepo];
        if (dir === 'next') {
          // The old front landed at the back, out of sight: load what comes 3 after.
          repoBySheet[newOrder[3]] = mod(nextCursor + 3, n);
        }
        commit({ cursor: nextCursor, order: newOrder, sheetRepo: repoBySheet });

        dir = pendingRef.current;
        pendingRef.current = null;
      }
      runningRef.current = false;
    },
    [repos.length, commit]
  );

  const handleShuffle = useCallback(
    (direction: 'next' | 'prev') => {
      if (runningRef.current) {
        // Keep at most one queued step; fast-forward the current one.
        pendingRef.current = direction;
        finishPaperStack();
        return;
      }
      void runShuffle(direction);
    },
    [runShuffle]
  );

  const registerSheetRef = useCallback((id: SheetId, el: HTMLElement | null) => {
    sheetRefs.current[id] = el;
  }, []);

  const registerDemoRef = useCallback((el: HTMLElement | null) => {
    demoRef.current = el;
  }, []);

  const handlePrev = useCallback(() => handleShuffle('prev'), [handleShuffle]);
  const handleNext = useCallback(() => handleShuffle('next'), [handleShuffle]);

  if (repos.length === 0) return null;

  const statusText = `Selected: ${activeRepo?.name ?? 'Repository'}`;

  return (
    <div className="github-repos-stack">
      <PaperStackShuffle
        statusText={statusText}
        busy={busy}
        interactive
        order={order}
        onPrev={handlePrev}
        onNext={handleNext}
        registerSheetRef={registerSheetRef}
        registerDemoRef={registerDemoRef}
        renderFace={(sheetId: SheetId, isActive: boolean) => {
          const repo = repos[mod(sheetRepo[sheetId], repos.length)];
          if (!repo) return null;

          return <RepoStackCard repo={repo} isActive={isActive} />;
        }}
      />
    </div>
  );
};

export default GitHubRepoPaperStack;
