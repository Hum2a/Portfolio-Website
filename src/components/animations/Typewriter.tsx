import React, { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';
import './Typewriter.css';

type TypewriterProps = {
  /** Text to type */
  text?: string;
  /** Typing speed in milliseconds per character */
  speed?: number;
  /** Whether to show blinking cursor */
  showCursor?: boolean;
  /** Character to use as cursor */
  cursorChar?: string;
  /** Callback when typing is complete */
  onComplete?: () => void;
  /** Whether to start typing immediately */
  startTyping?: boolean;
  /** Delay before starting to type */
  delay?: number;
  className?: string;
  codeStyle?: boolean;
};

/**
 * Typewriter component that displays text character by character.
 * One rAF loop driven by elapsed time; screen readers get the full text up front.
 */
const Typewriter: React.FC<TypewriterProps> = ({
  text = '',
  speed = 50,
  showCursor = true,
  cursorChar = '|',
  onComplete,
  startTyping = true,
  delay = 0,
  className = '',
  codeStyle = false,
}) => {
  const [count, setCount] = useState(0);
  // Latest callback without restarting the loop when the parent passes an inline function.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!startTyping) return undefined;
    if (!text) {
      // Nothing to type (e.g. a blank terminal line): report done on the next frame.
      const id = requestAnimationFrame(() => onCompleteRef.current?.());
      return () => cancelAnimationFrame(id);
    }

    if (prefersReducedMotion()) {
      const id = requestAnimationFrame(() => {
        setCount(text.length);
        onCompleteRef.current?.();
      });
      return () => cancelAnimationFrame(id);
    }

    let raf = 0;
    let start: number | null = null;
    let shown = 0;
    const tick = (now: number) => {
      start ??= now + delay;
      const next = Math.max(0, Math.min(text.length, Math.floor((now - start) / speed)));
      if (next !== shown) {
        shown = next;
        setCount(next);
      }
      if (next >= text.length) {
        onCompleteRef.current?.();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame((now) => {
      setCount(0);
      tick(now);
    });
    return () => cancelAnimationFrame(raf);
  }, [startTyping, text, speed, delay]);

  const isComplete = count >= text.length;

  return (
    <span
      className={`typewriter ${codeStyle ? 'code-style' : ''} ${className}`}
      aria-label={text}
      role="text"
    >
      <span aria-hidden="true">{text.slice(0, count)}</span>
      {showCursor && !isComplete && (
        <span className="typewriter-cursor" aria-hidden="true">
          {cursorChar}
        </span>
      )}
    </span>
  );
};

export default Typewriter;
