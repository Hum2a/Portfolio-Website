import React, { useCallback, useRef, useState } from 'react';
import { FaGithub, FaStar, FaCodeBranch } from 'react-icons/fa';
import {
  PaperStackShuffle,
  shufflePaperStack,
  type SheetId,
} from '@/components/animations/paper-stack-shuffle';
import type { GitHubRepo } from '@/services/githubService';
import './GitHubRepoPaperStack.css';

type GitHubRepoPaperStackProps = {
  repos: GitHubRepo[];
};

const GitHubRepoPaperStack: React.FC<GitHubRepoPaperStackProps> = ({ repos }) => {
  const [cursor, setCursor] = useState(0);
  const [order, setOrder] = useState<number[]>([0, 1, 2, 3]);
  const [busy, setBusy] = useState(false);
  const sheetRefs = useRef<(HTMLElement | null)[]>([null, null, null, null]);
  const demoRef = useRef<HTMLElement | null>(null);

  const activeRepo = repos[cursor];

  const repoAtDepth = useCallback(
    (depth: number): GitHubRepo | null => {
      if (repos.length === 0) return null;
      return repos[(cursor + depth) % repos.length];
    },
    [cursor, repos]
  );

  const handleShuffle = async (direction: 'next' | 'prev') => {
    if (busy || repos.length === 0) return;

    const nextCursor =
      direction === 'next'
        ? (cursor + 1) % repos.length
        : (cursor - 1 + repos.length) % repos.length;

    const newOrder = await shufflePaperStack(direction, {
      sheets: sheetRefs.current,
      order,
      demoEl: demoRef.current,
      setBusy,
      setStatus: () => {},
      statusLabel: () => repos[nextCursor]?.name ?? '',
    });

    setCursor(nextCursor);
    setOrder(newOrder);
  };

  if (repos.length === 0) return null;

  const statusText = `Selected: ${activeRepo?.name ?? 'Repository'}`;

  return (
    <div className="github-repos-stack">
      <PaperStackShuffle
        statusText={statusText}
        busy={busy}
        order={order}
        onPrev={() => void handleShuffle('prev')}
        onNext={() => void handleShuffle('next')}
        registerSheetRef={(id, el) => {
          sheetRefs.current[id] = el;
        }}
        registerDemoRef={(el) => {
          demoRef.current = el;
        }}
        renderFace={(sheetId: SheetId) => {
          const depth = order.indexOf(sheetId);
          const repo = repoAtDepth(depth);
          if (!repo) return null;

          const indexLabel = `${String(depth + 1).padStart(2, '0')} // ${(
            repo.language || 'REPO'
          ).toUpperCase()}`;

          const bodyText = repo.description
            ? `${repo.name} — ${repo.description}`
            : repo.name;

          return (
            <>
              <p className="paper-stack__index">{indexLabel}</p>
              <p className="paper-stack__body">{bodyText}</p>
              <p className="github-repo-stack__stats" aria-hidden="true">
                <span>
                  <FaStar /> {repo.stargazers_count}
                </span>
                <span>
                  <FaCodeBranch /> {repo.forks_count}
                </span>
              </p>
            </>
          );
        }}
      />

      {activeRepo && (
        <a
          href={activeRepo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="github-repo-stack__open"
        >
          <FaGithub aria-hidden="true" />
          Open {activeRepo.name} on GitHub
        </a>
      )}
    </div>
  );
};

export default GitHubRepoPaperStack;
