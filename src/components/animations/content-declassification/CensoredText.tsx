import React, { useEffect, useRef } from 'react';
import { getBehaviour } from './constants';
import { prefersReducedMotion, revealCensorElement } from './revealCensor';
import './content-declassification.css';

type Props = {
  children: string;
  variantIndex: number;
  active: boolean;
  delayMs?: number;
  className?: string;
};

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

export function CensoredText({
  children,
  variantIndex,
  active,
  delayMs = 0,
  className = '',
}: Props) {
  const censorRef = useRef<HTMLSpanElement>(null);
  const variant = variantIndex % 5;
  const behaviour = getBehaviour(variantIndex);
  const needsSlash = behaviour === 'strike' || behaviour === 'split';

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
      const { cancel } = revealCensorElement(node, behaviour);
      revealCancel = cancel;
    }, delayMs);

    return () => {
      window.clearTimeout(startId);
      revealCancel?.();
    };
  }, [active, behaviour, delayMs]);

  const initialClear = active && prefersReducedMotion();

  return (
    <span
      ref={censorRef}
      className={`cdc__censor cdc__censor--${variant} ${initialClear ? 'is-clear' : ''} ${className}`.trim()}
      data-cdc-censor
      data-index={variant}
      data-behaviour={behaviour}
    >
      <span className="cdc__value">{children}</span>
      {needsSlash && <span className="cdc__slash" aria-hidden="true" />}
      <span className="cdc__bar" aria-hidden="true">
        {renderBarPieces(behaviour)}
      </span>
    </span>
  );
}
