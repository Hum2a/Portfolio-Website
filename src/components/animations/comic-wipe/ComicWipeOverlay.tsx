import React from 'react';
import './comic-wipe.css';

const ComicWipeOverlay: React.FC = () => (
  <div className="comic-wipe" aria-hidden="true" data-comic-wipe>
    <div className="comic-wipe__panel comic-wipe__panel--1" />
    <div className="comic-wipe__panel comic-wipe__panel--2" />
    <div className="comic-wipe__panel comic-wipe__panel--3" />
    <div className="comic-wipe__panel comic-wipe__panel--4">
      <p className="comic-wipe__microtype">
        NEXT → NEXT → 次へ → NEXT → NEXT → 次へ → NEXT → NEXT → 次へ →
      </p>
    </div>
    <div className="comic-wipe__panel comic-wipe__panel--5">
      <p className="comic-wipe__impact">NEXT!</p>
    </div>
  </div>
);

export default ComicWipeOverlay;
