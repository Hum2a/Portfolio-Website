import React, { useEffect, useRef } from 'react';
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

export type PaperStackShuffleProps = {
  statusText: string;
  busy?: boolean;
  embed?: boolean;
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

  const setSheetRef = (id: SheetId) => (el: HTMLElement | null) => {
    sheetRefs.current[id] = el;
    registerSheetRef?.(id, el);
  };

  return (
    <div
      ref={demoRef}
      className={cn('paper-stack-demo', embed && 'paper-stack-demo--embed')}
      data-paper-stack-demo
    >
      <div className="paper-stack" data-paper-stack aria-hidden="true">
        {([0, 1, 2, 3] as SheetId[]).map((id) => (
          <article
            key={id}
            ref={setSheetRef(id)}
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
          disabled={busy}
          onClick={onPrev}
        >
          PREVIOUS
        </button>
        <button
          type="button"
          className="paper-stack__btn"
          data-paper-next
          disabled={busy}
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
