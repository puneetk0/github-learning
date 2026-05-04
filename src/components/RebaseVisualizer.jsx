import React, { useState } from 'react';

export default function RebaseVisualizer() {
  const [step, setStep] = useState(0); // 0: initial, 1: rebasing, 2: done

  const advance = () => {
    if (step < 2) setStep(step + 1);
  };
  
  const reset = () => {
    setStep(0);
  };

  return (
    <div className="cr-container" style={{ margin: '32px 0' }}>
      <div className="cr-header">
        <div className="cr-title">Visualizing: git rebase main</div>
        <div className="cr-controls">
          {step < 2 && <button className="btn" style={{ background: 'var(--blue)', border: 'none', color: '#fff' }} onClick={advance}>Next Step</button>}
          {step === 2 && <button className="btn" onClick={reset}>Reset Animation</button>}
        </div>
      </div>
      
      <div style={{ padding: '40px 20px', background: '#0a0a0f', position: 'relative', overflowX: 'auto', height: '250px' }}>
        <svg width="700" height="200" viewBox="0 0 700 200">
          {/* Main Branch Line */}
          <line x1="50" y1="150" x2="600" y2="150" stroke="var(--border)" strokeWidth="4" />
          
          {/* Main Commits */}
          <circle cx="100" cy="150" r="16" fill="var(--surface)" stroke="var(--blue)" strokeWidth="3" />
          <text x="100" y="180" textAnchor="middle" fill="var(--text2)" fontSize="10">A</text>
          
          <circle cx="200" cy="150" r="16" fill="var(--surface)" stroke="var(--blue)" strokeWidth="3" />
          <text x="200" y="180" textAnchor="middle" fill="var(--text2)" fontSize="10">B</text>
          
          <circle cx="300" cy="150" r="16" fill="var(--surface)" stroke="var(--blue)" strokeWidth="3" />
          <text x="300" y="180" textAnchor="middle" fill="var(--text2)" fontSize="10">C</text>
          
          <rect x="330" y="138" width="50" height="24" rx="4" fill="var(--blue)" />
          <text x="355" y="155" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">main</text>

          {/* Feature Branch Initial Path */}
          <path 
            d="M 200 150 C 220 150, 230 60, 250 60 L 350 60" 
            stroke="var(--border)" strokeWidth="4" fill="none" 
            style={{ opacity: step === 0 ? 1 : 0.2, transition: 'opacity 0.5s' }}
          />

          {/* Feature Commits Initial Position */}
          <g style={{ 
            opacity: step === 0 ? 1 : 0, 
            transform: step === 1 ? 'translate(0, -20px)' : 'translate(0,0)', 
            transition: 'all 0.5s' 
          }}>
            <circle cx="280" cy="60" r="16" fill="var(--surface)" stroke="var(--green)" strokeWidth="3" />
            <text x="280" y="40" textAnchor="middle" fill="var(--green)" fontSize="10">D</text>

            <circle cx="350" cy="60" r="16" fill="var(--surface)" stroke="var(--green)" strokeWidth="3" />
            <text x="350" y="40" textAnchor="middle" fill="var(--green)" fontSize="10">E</text>
            
            <rect x="380" y="48" width="60" height="24" rx="4" fill="var(--green)" />
            <text x="410" y="65" textAnchor="middle" fill="#000" fontSize="12" fontWeight="bold">feature</text>
          </g>

          {/* Rebase Path */}
          <path 
            d="M 300 150 C 320 150, 330 60, 350 60 L 450 60" 
            stroke="var(--border)" strokeWidth="4" fill="none" 
            style={{ opacity: step === 2 ? 1 : 0, transition: 'opacity 0.5s' }}
          />

          {/* Rebased Feature Commits */}
          <g style={{ 
            opacity: step === 2 ? 1 : 0, 
            transform: step === 1 ? 'translate(-80px, -20px)' : 'translate(0,0)',
            transition: 'all 0.5s' 
          }}>
            <circle cx="380" cy="60" r="16" fill="var(--surface)" stroke="var(--green)" strokeWidth="3" strokeDasharray="4 2" />
            <text x="380" y="40" textAnchor="middle" fill="var(--green)" fontSize="10">D'</text>

            <circle cx="450" cy="60" r="16" fill="var(--surface)" stroke="var(--green)" strokeWidth="3" strokeDasharray="4 2" />
            <text x="450" y="40" textAnchor="middle" fill="var(--green)" fontSize="10">E'</text>
            
            <rect x="480" y="48" width="60" height="24" rx="4" fill="var(--green)" />
            <text x="510" y="65" textAnchor="middle" fill="#000" fontSize="12" fontWeight="bold">feature</text>
          </g>
        </svg>
      </div>
      
      <div style={{ padding: '16px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        {step === 0 && (
          <p style={{ fontSize: '14px', color: 'var(--text2)', margin: 0 }}>
            <strong>Step 1:</strong> You branched off at commit B. While you were working on D and E, someone else merged commit C into main. Your branch is now out of date.
          </p>
        )}
        {step === 1 && (
          <p style={{ fontSize: '14px', color: 'var(--text2)', margin: 0 }}>
            <strong>Step 2:</strong> <code>git rebase main</code> temporarily sets your commits aside.
          </p>
        )}
        {step === 2 && (
          <p style={{ fontSize: '14px', color: 'var(--text2)', margin: 0 }}>
            <strong>Step 3:</strong> Git "replays" your commits one-by-one on top of the new main commit (C). Notice they are now D' and E' — they have new hashes because their parent changed. The history is now completely linear!
          </p>
        )}
      </div>
    </div>
  );
}
