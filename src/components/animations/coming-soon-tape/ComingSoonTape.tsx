import React, { useEffect, useRef } from 'react';
import './coming-soon-tape.css';

const MARQUEE_UNIT = 'COMING SOON · 近日公開 · COMING SOON · ';
const MARQUEE_TEXT = MARQUEE_UNIT.repeat(4);

/** One observer for every tape on the page; toggles `.is-offscreen` to pause the marquee. */
let sharedObserver: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null;
  sharedObserver ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle('is-offscreen', !entry.isIntersecting);
      }
    },
    { rootMargin: '64px' }
  );
  return sharedObserver;
}

const ComingSoonTape: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const io = getObserver();
    if (!el || !io) return undefined;
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return (
    <div ref={ref} className="coming-soon-tape is-offscreen" aria-hidden="true">
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
};

export default ComingSoonTape;
