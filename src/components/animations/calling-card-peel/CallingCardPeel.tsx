import React from 'react';
import './calling-card-peel.css';

type PeelObstructionProps = {
  label: string;
};

export function PeelObstruction({ label }: PeelObstructionProps) {
  return (
    <div
      className="ccp__obstruction"
      data-calling-card-peel-sheet
      aria-hidden="true"
    >
      <div className="ccp__backing" />
      <div className="ccp__paper">
        <div className="ccp__surface">
          <p className="ccp__eyebrow">NOTICE // ARCHIVE</p>
          <p className="ccp__message">{label}</p>
          <p className="ccp__secondary">REMOVE TO REVEAL</p>
          <p className="ccp__microtype">
            RESTRICTED · RESTRICTED · RESTRICTED ·
          </p>
        </div>
        <div className="ccp__fold">
          <span className="ccp__fold-under" />
          <span className="ccp__fold-face" />
        </div>
      </div>
    </div>
  );
}

type CallingCardPeelProps = {
  className?: string;
  obstructionLabel: string;
  rootRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
};

export function CallingCardPeel({
  className = '',
  obstructionLabel,
  rootRef,
  children,
}: CallingCardPeelProps) {
  return (
    <div
      ref={rootRef}
      className={`ccp ${className}`.trim()}
      data-calling-card-peel
    >
      <div className="ccp__host">{children}</div>
      <PeelObstruction label={obstructionLabel} />
      <div
        className="ccp__status"
        role="status"
        aria-live="polite"
        data-calling-card-peel-status
      >
        Restricted notice covering material.
      </div>
    </div>
  );
}
