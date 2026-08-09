import React, { useCallback, useRef, useState } from 'react';
import { FaStar, FaCodeBranch } from 'react-icons/fa';
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
        interactive
        order={order}
        onPrev={() => void handleShuffle('prev')}
        onNext={() => void handleShuffle('next')}
        registerSheetRef={(id, el) => {
          sheetRefs.current[id] = el;
        }}
        registerDemoRef={(el) => {
          demoRef.current = el;
        }}
        renderFace={(sheetId: SheetId, isActive: boolean) => {
          const depth = order.indexOf(sheetId);
          const repo = repoAtDepth(depth);
          if (!repo) return null;

          return <RepoStackCard repo={repo} isActive={isActive} />;
        }}
      />
    </div>
  );
};

export default GitHubRepoPaperStack;
