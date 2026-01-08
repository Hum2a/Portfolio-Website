import React, { useState } from 'react';
import './CodeBlock.css';

/**
 * CodeBlock component for displaying code with syntax highlighting
 * @param {string} code - Code to display
 * @param {string} language - Programming language
 * @param {boolean} showLineNumbers - Whether to show line numbers
 * @param {boolean} copyable - Whether to show copy button
 */
const CodeBlock = ({
  code = '',
  language = 'javascript',
  showLineNumbers = true,
  copyable = true,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const lines = code.split('\n');

  return (
    <div className={`code-block ${className}`}>
      {copyable && (
        <div className="code-block-header">
          <span className="code-block-language">{language}</span>
          <button
            className="code-block-copy"
            onClick={handleCopy}
            aria-label="Copy code"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      <pre className="code-block-content">
        <code className={`language-${language}`}>
          {showLineNumbers ? (
            lines.map((line, index) => (
              <React.Fragment key={index}>
                <span className="code-line-number">{index + 1}</span>
                <span className="code-line">{line || ' '}</span>
                {index < lines.length - 1 && '\n'}
              </React.Fragment>
            ))
          ) : (
            code
          )}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
