import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getBehaviour, LINE_STAGGER_MS } from './constants';
import { prefersReducedMotion, revealCensorElement } from './revealCensor';
import './content-declassification.css';

type Props = {
  children: string;
  variantIndex: number;
  active: boolean;
  delayMs?: number;
  className?: string;
};

/** One rect per rendered line box of the value, relative to the censor wrapper. */
type LineRect = { left: number; top: number; width: number; height: number };

function renderBarPieces(behaviour: ReturnType<typeof getBehaviour>) {
  if (behaviour === 'split') {
    return (
      <>
        <span className="cdc__piece cdc__piece--l" />
        <span className="cdc__piece cdc__piece--r" />
      </>
    );
  }
  return <span className="cdc__piece cdc__piece--full" />;
}

function measureLines(wrapper: HTMLElement, value: HTMLElement): LineRect[] {
  const origin = wrapper.getBoundingClientRect();
  return Array.from(value.getClientRects())
    .filter((r) => r.width > 0 && r.height > 0)
    .map((r) => ({
      left: r.left - origin.left,
      top: r.top - origin.top,
      width: r.width,
      height: r.height,
    }));
}

function sameLines(a: LineRect[], b: LineRect[]) {
  return (
    a.length === b.length &&
    a.every(
      (r, i) =>
        Math.abs(r.left - b[i].left) < 0.5 &&
        Math.abs(r.top - b[i].top) < 0.5 &&
        Math.abs(r.width - b[i].width) < 0.5 &&
        Math.abs(r.height - b[i].height) < 0.5
    )
  );
}

export function CensoredText({
  children,
  variantIndex,
  active,
  delayMs = 0,
  className = '',
}: Props) {
  const censorRef = useRef<HTMLSpanElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<LineRect[]>([]);
  const variant = variantIndex % 5;
  const behaviour = getBehaviour(variantIndex);
  const needsSlash = behaviour === 'strike' || behaviour === 'split';

  // Size bars from the text itself: one bar per line box, re-measured on resize / font load.
  useLayoutEffect(() => {
    const wrapper = censorRef.current;
    const value = valueRef.current;
    if (!wrapper || !value) return undefined;

    let cancelled = false;
    const update = () => {
      if (cancelled) return;
      const next = measureLines(wrapper, value);
      setLines((prev) => (sameLines(prev, next) ? prev : next));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrapper);
    if (wrapper.parentElement) ro.observe(wrapper.parentElement);
    void document.fonts?.ready.then(update);

    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [children]);

  const tailMs = Math.max(0, lines.length - 1) * LINE_STAGGER_MS;

  useEffect(() => {
    const node = censorRef.current;
    if (!node || !active) return undefined;

    if (prefersReducedMotion()) {
      node.classList.remove('is-striking', 'is-removing');
      node.classList.add('is-clear');
      return undefined;
    }

    let revealCancel: (() => void) | undefined;
    const startId = window.setTimeout(() => {
      const { cancel } = revealCensorElement(node, behaviour, tailMs);
      revealCancel = cancel;
    }, delayMs);

    return () => {
      window.clearTimeout(startId);
      revealCancel?.();
    };
  }, [active, behaviour, delayMs, tailMs]);

  const initialClear = active && prefersReducedMotion();

  return (
    <span
      ref={censorRef}
      className={`cdc__censor cdc__censor--${variant} ${initialClear ? 'is-clear' : ''} ${className}`.trim()}
      data-cdc-censor
      data-index={variant}
      data-behaviour={behaviour}
    >
      <span ref={valueRef} className="cdc__value">
        {children}
      </span>
      {lines.length === 0 ? (
        // Pre-measure fallback: cover the whole wrapper so nothing leaks on first paint.
        <span className={`cdc__bar cdc__bar--${variant} cdc__bar--fallback`} aria-hidden="true">
          {renderBarPieces(behaviour)}
        </span>
      ) : (
        lines.map((r, i) => {
          // Shallow slash angle on long lines so it stays inside its own line box.
          const slashRot = -Math.min(18, (Math.atan((r.height * 0.8) / r.width) * 180) / Math.PI);
          const style = {
            '--l': `${r.left}px`,
            '--t': `${r.top}px`,
            '--w': `${r.width}px`,
            '--h': `${r.height}px`,
            '--cdc-line-delay': `${i * LINE_STAGGER_MS}ms`,
            '--cdc-slash-rot': `${slashRot.toFixed(2)}deg`,
          } as React.CSSProperties;
          return (
            <React.Fragment key={i}>
              <span
                className={`cdc__bar cdc__bar--${(variant + i) % 5}`}
                style={style}
                aria-hidden="true"
              >
                {renderBarPieces(behaviour)}
              </span>
              {needsSlash && <span className="cdc__slash" style={style} aria-hidden="true" />}
            </React.Fragment>
          );
        })
      )}
    </span>
  );
}
