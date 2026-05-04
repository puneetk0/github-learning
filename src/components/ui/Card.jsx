import React, { useState } from 'react';
import './Card.css';

export default function Card({ icon, title, children, className = '' }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div 
      className={`card ${className}`} 
      onMouseMove={handleMouseMove}
      style={{
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`
      }}
    >
      <div className="card-glow" />
      <div className="card-content">
        {icon && <div className="card-icon">{icon}</div>}
        {title && <h3 className="card-title">{title}</h3>}
        <div className="card-text">{children}</div>
      </div>
    </div>
  );
}
