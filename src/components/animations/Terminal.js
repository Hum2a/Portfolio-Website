import React, { useState, useEffect } from 'react';
import Typewriter from './Typewriter';
import './Terminal.css';

/**
 * Terminal component that displays terminal-style output
 * @param {Array} lines - Array of lines to display
 * @param {string} prompt - Prompt character (default: '$')
 * @param {number} typingSpeed - Speed of typing animation
 * @param {boolean} showPrompt - Whether to show prompt
 * @param {boolean} autoStart - Whether to start typing automatically
 */
const Terminal = ({
  lines = [],
  prompt = '$',
  typingSpeed = 50,
  showPrompt = true,
  autoStart = true,
  className = '',
  title = 'Terminal',
  onComplete,
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [completedLines, setCompletedLines] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!autoStart || lines.length === 0) {
      setCompletedLines(lines);
      setIsComplete(true);
      if (onComplete) onComplete();
      return;
    }

    if (currentLineIndex < lines.length) {
      const currentLine = lines[currentLineIndex] || '';
      const delay = typingSpeed * currentLine.length + 120;
      
      const timer = setTimeout(() => {
        setCompletedLines([...lines.slice(0, currentLineIndex + 1)]);
        setCurrentLineIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [currentLineIndex, lines, typingSpeed, autoStart, onComplete]);

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
        {completedLines.map((line, index) => (
          <div key={index} className="terminal-line">
            {showPrompt && (
              <span className="terminal-prompt">{prompt} </span>
            )}
            {autoStart && index === currentLineIndex - 1 ? (
              <Typewriter
                text={line}
                speed={typingSpeed}
                showCursor={index === currentLineIndex - 1 && !isComplete}
                codeStyle={true}
              />
            ) : (
              <span className="terminal-text">{line}</span>
            )}
          </div>
        ))}
        {!isComplete && currentLineIndex < lines.length && lines[currentLineIndex] && (
          <div className="terminal-line">
            {showPrompt && (
              <span className="terminal-prompt">{prompt} </span>
            )}
            <Typewriter
              text={lines[currentLineIndex]}
              speed={typingSpeed}
              showCursor={true}
              codeStyle={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
