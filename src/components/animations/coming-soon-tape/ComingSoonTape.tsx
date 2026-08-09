import React from 'react';
import './coming-soon-tape.css';

const MARQUEE_UNIT = 'COMING SOON · 近日公開 · COMING SOON · ';
const MARQUEE_TEXT = MARQUEE_UNIT.repeat(4);

const ComingSoonTape: React.FC = () => (
  <div className="coming-soon-tape" aria-hidden="true">
    <div className="coming-soon-tape__edge coming-soon-tape__edge--top" />
    <div className="coming-soon-tape__band">
      <div className="coming-soon-tape__track">
        <span className="coming-soon-tape__text">{MARQUEE_TEXT}</span>
        <span className="coming-soon-tape__text" aria-hidden="true">
          {MARQUEE_TEXT}
        </span>
      </div>
    </div>
    <div className="coming-soon-tape__edge coming-soon-tape__edge--bottom" />
  </div>
);

export default ComingSoonTape;
