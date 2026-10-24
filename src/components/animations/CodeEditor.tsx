import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';
import './CodeEditor.css';
import { useReducedMotion } from '@/lib/motion';

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

type TokenizedLine = { start: number; tokens: Token[] };

/** Tokenise once per file; typing only slices. Each line records its char offset in the source. */
function tokenizeSource(source: string): TokenizedLine[] {
  let offset = 0;
  return source.split('\n').map((line) => {
    const start = offset;
    offset += line.length + 1;
    return { start, tokens: tokenizeLine(line) };
  });
}

const TOKENIZED = new Map(FILES.map((f) => [f.id, tokenizeSource(f.source)]));

function sliceTokens(tokens: Token[], chars: number): Token[] {
  const out: Token[] = [];
  let left = chars;
  for (const t of tokens) {
    if (left <= 0) break;
    if (t.text.length <= left) {
      out.push(t);
      left -= t.text.length;
    } else {
      out.push({ kind: t.kind, text: t.text.slice(0, left) });
      break;
    }
  }
  return out;
}

function renderTokens(lines: TokenizedLine[], typedLength: number): React.ReactNode {
  const visible = lines.filter((l) => l.start <= typedLength);
  return visible.map((line, lineIdx) => {
    const isActive = lineIdx === visible.length - 1;
    const tokens = isActive ? sliceTokens(line.tokens, typedLength - line.start) : line.tokens;
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
              {t.text.length ? t.text : ' '}
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

const usePrefersReducedMotion = useReducedMotion;

const CYCLE_PAUSE_MS = 2800;
const USER_PAUSE_MS = 8000;
const TARGET_FILE_MS = 1200;
/** Time constant (ms) for tilt damping — frame-rate independent. */
const TILT_TAU_MS = 70;
const BACKDROP_BLUR = '/images/_blur/Bgr8/Matching Algorithm.blur.webp';

function canHoverFine(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
}

const CodeEditor: React.FC<{ className?: string }> = ({ className }) => {
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  /** Has ever been on screen (starts typing). */
  const [started, setStarted] = useState(false);
  /** On screen right now; typing, cycling and the cursor blink pause otherwise. */
  const [onScreen, setOnScreen] = useState(false);
  const [pageVisible, setPageVisible] = useState(
    () => typeof document === 'undefined' || !document.hidden
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const [typedLen, setTypedLen] = useState(0);
  const [complete, setComplete] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const rafRef = useRef<number | null>(null);
  const typedRef = useRef(0);
  const tiltRafRef = useRef<number | null>(null);
  const tiltLastRef = useRef<number | null>(null);
  const tiltTarget = useRef({ x: 0, y: 0 });
  const tiltCurrent = useRef({ x: 0, y: 0 });
  const rectRef = useRef<DOMRect | null>(null);
  const cycleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeFile = FILES[activeIdx];
  const fullLen = activeFile.source.length;
  const running = onScreen && pageVisible;

  const applyTiltFrame = useCallback((now: number) => {
    const el = editorRef.current;
    const cur = tiltCurrent.current;
    const tgt = tiltTarget.current;
    const dt = tiltLastRef.current == null ? 16 : Math.min(64, now - tiltLastRef.current);
    tiltLastRef.current = now;
    const k = 1 - Math.exp(-dt / TILT_TAU_MS);
    cur.x += (tgt.x - cur.x) * k;
    cur.y += (tgt.y - cur.y) * k;
    if (el) {
      el.style.transform = `perspective(900px) rotateX(${cur.x.toFixed(2)}deg) rotateY(${cur.y.toFixed(2)}deg)`;
    }
    if (Math.abs(tgt.x - cur.x) > 0.02 || Math.abs(tgt.y - cur.y) > 0.02) {
      tiltRafRef.current = requestAnimationFrame(applyTiltFrame);
    } else {
      cur.x = tgt.x;
      cur.y = tgt.y;
      if (el) {
        el.style.transform = `perspective(900px) rotateX(${cur.x}deg) rotateY(${cur.y}deg)`;
      }
      tiltRafRef.current = null;
      tiltLastRef.current = null;
    }
  }, []);

  const queueTilt = useCallback(() => {
    if (tiltRafRef.current == null) {
      tiltRafRef.current = requestAnimationFrame(applyTiltFrame);
    }
  }, [applyTiltFrame]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setOnScreen(entry.isIntersecting);
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    const onVis = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    // Tilt rect cache: refresh on layout changes instead of every pointermove.
    const invalidate = () => {
      rectRef.current = null;
    };
    window.addEventListener('resize', invalidate, { passive: true });
    window.addEventListener('scroll', invalidate, { passive: true });
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', invalidate);
      window.removeEventListener('scroll', invalidate);
    };
  }, []);

  // Typing — pauses (without resetting) while off-screen or the tab is hidden.
  useEffect(() => {
    if (reducedMotion || !started || !running) return undefined;
    if (typedRef.current >= fullLen) return undefined;

    // Resume from where we left off, keeping the original pace.
    const start = performance.now() - (typedRef.current / fullLen) * TARGET_FILE_MS;
    let lastShown = typedRef.current;
    let frame = 0;

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
      typedRef.current = next;
      frame += 1;
      // Commit at most every other frame (always commit the final state).
      if (next >= fullLen || frame % 2 === 0) setTypedLen(next);
      if (next >= fullLen) {
        setComplete(true);
        rafRef.current = null;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [activeIdx, started, running, reducedMotion, fullLen]);

  // Auto-cycle after file completes
  useEffect(() => {
    if (reducedMotion || userPaused || !running || !complete) return;

    cycleTimerRef.current = setTimeout(() => {
      goToFile((activeIdx + 1) % FILES.length);
    }, CYCLE_PAUSE_MS);

    return () => {
      if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
    };
  });

  /** Switch file and restart typing from zero. */
  function goToFile(idx: number) {
    typedRef.current = 0;
    setTypedLen(0);
    setComplete(false);
    setActiveIdx(idx);
  }

  const selectTab = (idx: number) => {
    goToFile(idx);
    setUserPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setUserPaused(false);
    }, USER_PAUSE_MS);
  };

  // ARIA tabs pattern: ←/→/Home/End move selection and focus (roving tabindex).
  const onTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const n = FILES.length;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = (activeIdx + 1) % n;
    else if (e.key === 'ArrowLeft') next = (activeIdx - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next == null) return;
    e.preventDefault();
    selectTab(next);
    tabRefs.current[next]?.focus();
  };

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      if (tiltRafRef.current != null) cancelAnimationFrame(tiltRafRef.current);
    };
  }, []);

  const onPointerEnter = useCallback(() => {
    rectRef.current = rootRef.current?.getBoundingClientRect() ?? null;
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (reducedMotion) return;
      if (e.pointerType === 'touch' || !canHoverFine()) return;
      const el = rootRef.current;
      if (!el) return;
      const rect = rectRef.current ?? (rectRef.current = el.getBoundingClientRect());
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      tiltTarget.current = { x: py * -9, y: px * 11 };
      queueTilt();
    },
    [reducedMotion, queueTilt]
  );

  const onPointerLeave = useCallback(() => {
    tiltTarget.current = { x: 0, y: 0 };
    queueTilt();
  }, [queueTilt]);

  const displayLen = reducedMotion ? fullLen : typedLen;
  const lines = useMemo(
    () => renderTokens(TOKENIZED.get(activeFile.id) ?? [], displayLen),
    [activeFile.id, displayLen]
  );

  const minimapHeight = Math.max(
    12,
    fullLen === 0 ? 12 : (displayLen / fullLen) * 100
  );

  const panelId = 'code-editor-panel';

  return (
    <div
      ref={rootRef}
      className={cn('code-editor-wrap', !running && 'code-editor-wrap--paused', className)}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div
        className="code-editor-backdrop"
        aria-hidden="true"
        style={{ backgroundImage: `url("${BACKDROP_BLUR}")` }}
      />
      <div ref={editorRef} className="code-editor surface-3">
        <div
          className="code-editor-tabs"
          role="tablist"
          aria-label="Editor files"
          onKeyDown={onTabKeyDown}
        >
          {FILES.map((file, idx) => (
            <button
              key={file.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              type="button"
              role="tab"
              id={`code-editor-tab-${idx}`}
              aria-selected={idx === activeIdx}
              aria-controls={panelId}
              tabIndex={idx === activeIdx ? 0 : -1}
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
            key={activeIdx}
            id={panelId}
            role="tabpanel"
            aria-labelledby={`code-editor-tab-${activeIdx}`}
            className="code-editor-scroll code-editor-scroll--enter"
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
