import React, { useCallback, useEffect, useRef, useState } from 'react';
import Typewriter from './Typewriter';
import './Terminal.css';

type TerminalProps = {
  /** Lines to display */
  lines?: string[];
  /** Prompt character (default: '$') */
  prompt?: string;
  /** Milliseconds per character */
  typingSpeed?: number;
  /** Whether to show prompt */
  showPrompt?: boolean;
  /** Whether to start typing automatically */
  autoStart?: boolean;
  className?: string;
  title?: string;
  onComplete?: () => void;
};

/** Pause between one line finishing and the next starting. */
const LINE_GAP_MS = 80;

/**
 * Terminal component that displays terminal-style output.
 * Finished lines render as static text; only the current line types.
 */
const Terminal: React.FC<TerminalProps> = ({
  lines = [],
  prompt = '$',
  typingSpeed = 30,
  showPrompt = true,
  autoStart = true,
  className = '',
  title = 'Terminal',
  onComplete,
}) => {
  // Without autoStart every line is shown immediately.
  const [currentLineIndex, setCurrentLineIndex] = useState(() => (autoStart ? 0 : lines.length));
  const isComplete = currentLineIndex >= lines.length;

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (isComplete) onCompleteRef.current?.();
  }, [isComplete]);

  const gapRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (gapRef.current) clearTimeout(gapRef.current);
  }, []);

  const handleLineDone = useCallback(() => {
    gapRef.current = setTimeout(() => setCurrentLineIndex((i) => i + 1), LINE_GAP_MS);
  }, []);

  const finished = lines.slice(0, currentLineIndex);
  const current = isComplete ? null : lines[currentLineIndex];

  return (
    <div className={`terminal ${className}`}>
      <div className="terminal-header">
        <div className="terminal-controls">
          <span className="terminal-control terminal-close"></span>
          <span className="terminal-control terminal-minimize"></span>
          <span className="terminal-control terminal-maximize"></span>
        </div>
        <div className="terminal-title">{title}</div>
      </div>
      <div className="terminal-body">
        {finished.map((line, index) => (
          <div key={index} className="terminal-line">
            {showPrompt && (
              <span className="terminal-prompt">{prompt} </span>
            )}
            <span className="terminal-text">{line}</span>
          </div>
        ))}
        {current != null && (
          <div key={currentLineIndex} className="terminal-line">
            {showPrompt && (
              <span className="terminal-prompt">{prompt} </span>
            )}
            <Typewriter
              text={current}
              speed={typingSpeed}
              showCursor={true}
              codeStyle={true}
              onComplete={handleLineDone}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
