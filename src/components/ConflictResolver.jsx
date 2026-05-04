import React, { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import './ConflictResolver.css';

const INITIAL_CODE = [
  { id: 1, text: 'function calculateTotal(price, tax) {', type: 'normal' },
  { id: 2, text: '<<<<<<< HEAD', type: 'marker-head', isMarker: true },
  { id: 3, text: '  const total = price + (price * tax);', type: 'current', isCode: true },
  { id: 4, text: '  return total.toFixed(2);', type: 'current', isCode: true },
  { id: 5, text: '=======', type: 'marker-divider', isMarker: true },
  { id: 6, text: '  return Math.round((price + tax) * 100) / 100;', type: 'incoming', isCode: true },
  { id: 7, text: '>>>>>>> feature-tax-update', type: 'marker-incoming', isMarker: true },
  { id: 8, text: '}', type: 'normal' }
];

export default function ConflictResolver() {
  const [lines, setLines] = useState(INITIAL_CODE);
  const [isResolved, setIsResolved] = useState(false);
  const [error, setError] = useState('');

  const toggleLine = (id) => {
    if (isResolved) return;
    setLines(lines.filter(line => line.id !== id));
  };

  const checkResolution = () => {
    const hasMarkers = lines.some(l => l.isMarker);
    if (hasMarkers) {
      setError('You must remove all conflict markers (<<<<<<<, =======, >>>>>>>)');
      return;
    }

    const hasCurrent = lines.some(l => l.type === 'current');
    const hasIncoming = lines.some(l => l.type === 'incoming');

    if (!hasCurrent && !hasIncoming) {
      setError('You deleted all the code! Keep one of the implementations.');
      return;
    }
    
    // In a real game we might check if they kept the "right" one, 
    // but resolving simply means removing markers and making a choice.
    setError('');
    setIsResolved(true);
  };

  const reset = () => {
    setLines(INITIAL_CODE);
    setIsResolved(false);
    setError('');
  };

  return (
    <div className="conflict-resolver">
      <div className="cr-header">
        <div className="cr-title">app/utils.js - Merge Conflict</div>
        <div className="cr-actions">
          <button className="cr-btn reset" onClick={reset} disabled={isResolved && lines.length === INITIAL_CODE.length}>
            Reset
          </button>
          <button 
            className={`cr-btn resolve ${isResolved ? 'success' : ''}`} 
            onClick={checkResolution}
            disabled={isResolved}
          >
            {isResolved ? <><CheckCircle2 size={16} /> Resolved</> : 'Mark as Resolved'}
          </button>
        </div>
      </div>

      {error && (
        <div className="cr-error">
          <XCircle size={16} /> {error}
        </div>
      )}

      <div className={`cr-editor ${isResolved ? 'resolved-state' : ''}`}>
        <div className="cr-line-numbers">
          {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <div className="cr-code">
          {lines.map((line) => (
            <div 
              key={line.id} 
              className={`cr-line ${line.type}`}
              onClick={() => toggleLine(line.id)}
              title={!isResolved && line.type !== 'normal' ? "Click to delete this line" : ""}
            >
              {line.text}
            </div>
          ))}
        </div>
      </div>

      <div className="cr-instructions">
        <strong>Goal:</strong> Fix the conflict by clicking lines to delete them. Keep the code you want, remove the Git markers, then mark as resolved.
      </div>
    </div>
  );
}
