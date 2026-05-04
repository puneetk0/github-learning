import React, { useState } from 'react';
import { ChevronDown, Beaker } from 'lucide-react';
import './DeepDive.css';

export default function DeepDive({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`deep-dive ${isOpen ? 'open' : ''}`}>
      <button className="dd-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="dd-title-wrap">
          <Beaker size={16} color="var(--accent2)" />
          <span className="dd-title">Under the Hood: {title}</span>
        </div>
        <ChevronDown size={16} className={`dd-chevron ${isOpen ? 'open' : ''}`} />
      </button>
      <div className="dd-content-wrapper" style={{ height: isOpen ? 'auto' : 0 }}>
        <div className="dd-content">
          {children}
        </div>
      </div>
    </div>
  );
}
