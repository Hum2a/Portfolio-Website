import React, { useState, useEffect } from 'react';
import './Typewriter.css';

/**
 * Typewriter component that displays text character by character
 * @param {string} text - Text to type
 * @param {number} speed - Typing speed in milliseconds per character
 * @param {boolean} showCursor - Whether to show blinking cursor
 * @param {string} cursorChar - Character to use as cursor
 * @param {function} onComplete - Callback when typing is complete
 * @param {boolean} startTyping - Whether to start typing immediately
 * @param {number} delay - Delay before starting to type
 */
const Typewriter = ({
  text = '',
  speed = 50,
  showCursor = true,
  cursorChar = '|',
  onComplete,
  startTyping = true,
  delay = 0,
  className = '',
  codeStyle = false
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!startTyping || !text) return;

    const timer = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [startTyping, text, delay]);

  useEffect(() => {
    if (!isTyping || currentIndex >= text.length) {
      if (currentIndex >= text.length && !isComplete) {
        setIsComplete(true);
        setIsTyping(false);
        if (onComplete) {
          onComplete();
        }
      }
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, currentIndex + 1));
      setCurrentIndex(currentIndex + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [isTyping, currentIndex, text, speed, isComplete, onComplete]);

  return (
    <span className={`typewriter ${codeStyle ? 'code-style' : ''} ${className}`}>
      {displayedText}
      {showCursor && !isComplete && <span className="typewriter-cursor">{cursorChar}</span>}
    </span>
  );
};

export default Typewriter;
