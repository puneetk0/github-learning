import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import './CodeBlock.css';

export default function CodeBlock({ code, language = 'bash', showLineNumbers = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="cb-lang">{language}</span>
        <button className="cb-copy-btn" onClick={handleCopy} title="Copy code">
          {copied ? <Check size={14} color="var(--green)" /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="code-block-content">
        {showLineNumbers && (
          <div className="code-block-lines">
            {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
          </div>
        )}
        <pre className="code-block-pre">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="code-line">
                {line || ' '}
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
