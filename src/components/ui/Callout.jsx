import React from 'react';
import { Info, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import './Callout.css';

const ICONS = {
  info: <Info size={16} />,
  tip: <CheckCircle2 size={16} />,
  warn: <AlertTriangle size={16} />,
  danger: <AlertCircle size={16} />
};

export default function Callout({ type = 'info', children }) {
  const icon = ICONS[type] || ICONS.info;

  return (
    <div className={`callout ${type}`}>
      <div className="callout-icon">{icon}</div>
      <div className="callout-content">{children}</div>
    </div>
  );
}
