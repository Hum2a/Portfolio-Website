import React, { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { applySettled } from './paperStackShuffle.ts';
import './paper-stack-shuffle.css';
import './paper-stack-shuffle-host.css';

const SHEET_CLASS = [
  'paper-stack__sheet--a',
  'paper-stack__sheet--b',
  'paper-stack__sheet--c',
  'paper-stack__sheet--d',
] as const;

export type SheetId = 0 | 1 | 2 | 3;

/** Horizontal travel (px) that counts as a swipe on touch. */
const SWIPE_PX = 40;

export type PaperStackShuffleProps = {
  statusText: string;
  busy?: boolean;
  embed?: boolean;
  /** When true, stack is not aria-hidden (for embedded clickable faces). */
  interactive?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  renderFace: (sheetId: SheetId, isActive: boolean) => React.ReactNode;
  registerSheetRef?: (sheetId: SheetId, el: HTMLElement | null) => void;
  registerDemoRef?: (el: HTMLElement | null) => void;
  /** Initial order for first settle */
  order?: number[];
};

const PaperStackShuffle: React.FC<PaperStackShuffleProps> = ({
  statusText,
  busy = false,
  embed = true,
  interactive = false,
  onPrev,
  onNext,
  renderFace,
  registerSheetRef,
  registerDemoRef,
  order = [0, 1, 2, 3],
}) => {
  const sheetRefs = useRef<(HTMLElement | null)[]>([null, null, null, null]);
  const demoRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const activeSheetId = order[0] ?? 0;

  useEffect(() => {
    registerDemoRef?.(demoRef.current);
  }, [registerDemoRef]);

  useEffect(() => {
    applySettled(sheetRefs.current, order);
  }, [order]);

  useEffect(() => {
    if (statusRef.current) {
      statusRef.current.textContent = statusText;
    }
  }, [statusText]);

  // One stable ref callback (React 19 cleanup form) so refs don't re-fire every render.
  const setSheetRef = useCallback(
    (el: HTMLElement | null) => {
      if (!el) return undefined;
      const id = Number(el.dataset.sheet) as SheetId;
      sheetRefs.current[id] = el;
      registerSheetRef?.(id, el);
      return () => {
        sheetRefs.current[id] = null;
        registerSheetRef?.(id, null);
      };
    },
    [registerSheetRef]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onPrev?.();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNext?.();
      }
    },
    [onPrev, onNext]
  );

  const swipeStart = useRef<{ x: number; y: number; id: number } | null>(null);
  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    if (event.pointerType !== 'touch') return;
    swipeStart.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
  }, []);
  const handlePointerUp = useCallback(
    (event: React.PointerEvent) => {
      const start = swipeStart.current;
      swipeStart.current = null;
      if (!start || start.id !== event.pointerId) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) onNext?.();
      else onPrev?.();
    },
    [onPrev, onNext]
  );

  return (
    <div
      ref={demoRef}
      className={cn('paper-stack-demo', embed && 'paper-stack-demo--embed')}
      data-paper-stack-demo
      onKeyDown={handleKeyDown}
    >
      <div
        className="paper-stack"
        data-paper-stack
        aria-hidden={interactive ? undefined : true}
        aria-busy={busy || undefined}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          swipeStart.current = null;
        }}
      >
        {([0, 1, 2, 3] as SheetId[]).map((id) => (
          <article
            key={id}
            ref={setSheetRef}
            className={cn(
              'paper-stack__sheet',
              SHEET_CLASS[id],
              id === activeSheetId && 'is-active'
            )}
            data-sheet={id}
            data-depth={order.indexOf(id)}
          >
            <div className="paper-stack__backing" aria-hidden="true" />
            <div className="paper-stack__face">
              {renderFace(id, id === activeSheetId)}
            </div>
          </article>
        ))}
      </div>

      <div className="paper-stack__controls">
        <button
          type="button"
          className="paper-stack__btn"
          data-paper-prev
          onClick={onPrev}
        >
          PREVIOUS
        </button>
        <button
          type="button"
          className="paper-stack__btn"
          data-paper-next
          onClick={onNext}
        >
          NEXT
        </button>
      </div>

      <p
        ref={statusRef}
        className="paper-stack__status"
        role="status"
        aria-live="polite"
        data-paper-status
      >
        {statusText}
      </p>
    </div>
  );
};

export default PaperStackShuffle;
