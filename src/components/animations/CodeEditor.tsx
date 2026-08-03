import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';
import './CodeEditor.css';

export type EditorFileId = 'humza.ts' | 'work.ts' | 'contact.ts';

type EditorFile = {
  id: EditorFileId;
  source: string;
};

const FILES: EditorFile[] = [
  {
    id: 'humza.ts',
    source: `const humza = {
  role:     "Software Engineer, Full Stack & Platform Configuration",
  based:    "Sutton, London",
  building: ["Bgr8 - mentoring platform, 95% match accuracy",
             "LifeSmart - 7 SaaS tools, sub-second global loads",
             "TheraBot - GPT-4 mental health chatbot"],
  clients:  ["Shell", "BBC", "NHS", "Home Office"],
  stack:    ["TypeScript", "React", "Node", "Hono", "Cloudflare Workers"],
  shipped:  29,
} as const;`,
  },
  {
    id: 'work.ts',
    source: `const flagships = [
  { name: "Bgr8",           surface: "web" },
  { name: "LifeSmart",      surface: "web + PWA" },
  { name: "TheraBot",       surface: "web + WhatsApp" },
  { name: "Encore",         surface: "web" },
  { name: "Breathapplyser", surface: "iOS + Android" },
] as const;

export const shipped = 29;
export const surfaces = 6;`,
  },
  {
    id: 'contact.ts',
    source: `const contact = {
  status: "Available for contract",
  path:   "/contact",
  email:  "hello@humza-butt.space",
  prefer: "Get in touch via the site form",
} as const;

export default contact;`,
  },
];

type TokenKind =
  | 'keyword'
  | 'string'
  | 'number'
  | 'comment'
  | 'punct'
  | 'plain';

type Token = { kind: TokenKind; text: string };

const KEYWORDS = new Set([
  'const',
  'export',
  'default',
  'as',
  'from',
  'import',
  'true',
  'false',
  'null',
]);

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < line.length) {
    const rest = line.slice(i);

    if (rest.startsWith('//')) {
      tokens.push({ kind: 'comment', text: rest });
      break;
    }

    if (rest[0] === '"' || rest[0] === "'") {
      const quote = rest[0];
      let j = 1;
      while (j < rest.length && rest[j] !== quote) {
        if (rest[j] === '\\') j += 2;
        else j += 1;
      }
      j = Math.min(j + 1, rest.length);
      tokens.push({ kind: 'string', text: rest.slice(0, j) });
      i += j;
      continue;
    }

    const num = rest.match(/^\d+/);
    if (num) {
      tokens.push({ kind: 'number', text: num[0] });
      i += num[0].length;
      continue;
    }

    const word = rest.match(/^[A-Za-z_$][\w$]*/);
    if (word) {
      tokens.push({
        kind: KEYWORDS.has(word[0]) ? 'keyword' : 'plain',
        text: word[0],
      });
      i += word[0].length;
      continue;
    }

    const punct = rest.match(/^[{}[\](),.:;=<>!&|+\-*/%]+/);
    if (punct) {
      tokens.push({ kind: 'punct', text: punct[0] });
      i += punct[0].length;
      continue;
    }

    tokens.push({ kind: 'plain', text: rest[0] });
    i += 1;
  }
  return tokens;
}

function renderTokens(source: string, typedLength: number): React.ReactNode {
  const visible = source.slice(0, typedLength);
  const lines = visible.split('\n');
  return lines.map((line, lineIdx) => {
    const tokens = tokenizeLine(line);
    const isActive = lineIdx === lines.length - 1;
    return (
      <div
        key={lineIdx}
        className={cn('code-editor-line', isActive && 'code-editor-line--active')}
      >
        <span className="code-editor-gutter" aria-hidden="true">
          {lineIdx + 1}
        </span>
        <span className="code-editor-code">
          {tokens.map((t, ti) => (
            <span key={ti} className={`tok tok-${t.kind}`}>
              {t.text.length ? t.text : '\u00a0'}
            </span>
          ))}
          {isActive && (
            <span className="code-editor-cursor" aria-hidden="true" />
          )}
        </span>
      </div>
    );
  });
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

const CYCLE_PAUSE_MS = 2800;
const USER_PAUSE_MS = 8000;
const TARGET_FILE_MS = 1200;
const BACKDROP_BLUR = '/images/_blur/Bgr8/Matching Algorithm.blur.webp';

const CodeEditor: React.FC<{ className?: string }> = ({ className }) => {
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [typedLen, setTypedLen] = useState(0);
  const [complete, setComplete] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const cycleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeFile = FILES[activeIdx];
  const fullLen = activeFile.source.length;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Typing / reduced-motion fill
  useEffect(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (reducedMotion) {
      setTypedLen(fullLen);
      setComplete(true);
      return;
    }

    if (!inView) {
      setTypedLen(0);
      setComplete(false);
      return;
    }

    setTypedLen(0);
    setComplete(false);
    const start = performance.now();
    let lastShown = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / TARGET_FILE_MS);
      let next = Math.floor(fullLen * progress);
      // 2–3 character bursts ahead of pure linear progress
      if (next > lastShown) {
        next = Math.min(fullLen, Math.max(next, lastShown + 2));
      } else if (progress < 1) {
        next = Math.min(fullLen, lastShown + 2);
      }
      lastShown = next;
      setTypedLen(next);
      if (next >= fullLen) {
        setComplete(true);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [activeIdx, inView, reducedMotion, fullLen]);

  // Auto-cycle after file completes
  useEffect(() => {
    if (reducedMotion || userPaused || !inView || !complete) return;

    cycleTimerRef.current = setTimeout(() => {
      setActiveIdx((i) => (i + 1) % FILES.length);
    }, CYCLE_PAUSE_MS);

    return () => {
      if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
    };
  }, [complete, reducedMotion, userPaused, inView, activeIdx]);

  const selectTab = useCallback((idx: number) => {
    setActiveIdx(idx);
    setUserPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setUserPaused(false);
    }, USER_PAUSE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (reducedMotion) return;
      if (e.pointerType === 'touch') return;
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: py * -6, y: px * 8 });
    },
    [reducedMotion]
  );

  const onPointerLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  const displayLen = reducedMotion ? fullLen : typedLen;
  const lines = useMemo(
    () => renderTokens(activeFile.source, displayLen),
    [activeFile.source, displayLen]
  );

  const minimapHeight = Math.max(
    12,
    fullLen === 0 ? 12 : (displayLen / fullLen) * 100
  );

  return (
    <div
      ref={rootRef}
      className={cn('code-editor-wrap', className)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div
        className="code-editor-backdrop"
        aria-hidden="true"
        style={{ backgroundImage: `url("${BACKDROP_BLUR}")` }}
      />
      <div
        className="code-editor surface-3"
        style={
          reducedMotion
            ? undefined
            : {
                transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }
        }
      >
        <div
          className="code-editor-tabs"
          role="tablist"
          aria-label="Editor files"
        >
          {FILES.map((file, idx) => (
            <button
              key={file.id}
              type="button"
              role="tab"
              aria-selected={idx === activeIdx}
              className={cn(
                'code-editor-tab',
                idx === activeIdx && 'code-editor-tab--active'
              )}
              onClick={() => selectTab(idx)}
            >
              {file.id}
            </button>
          ))}
        </div>
        <div className="code-editor-body">
          <div
            className="code-editor-scroll"
            aria-label={`${activeFile.id} source`}
          >
            {lines}
          </div>
          <div className="code-editor-minimap" aria-hidden="true">
            <div
              className="code-editor-minimap-fill"
              style={{ height: `${minimapHeight}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
