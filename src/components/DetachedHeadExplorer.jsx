import React, { useState } from 'react';

export default function DetachedHeadExplorer() {
  const [headTarget, setHeadTarget] = useState('main');

  const commits = [
    { id: 'a1b2c3d', label: 'feat: add login', x: 100 },
    { id: 'e4f5g6h', label: 'fix: null check', x: 250 },
    { id: 'i7j8k9l', label: 'feat: add dashboard', x: 400 },
    { id: 'm1n2o3p', label: 'Update README', x: 550 },
  ];

  return (
    <div className="cr-container" style={{ margin: '32px 0' }}>
      <div className="cr-header">
        <div className="cr-title">The HEAD Pointer & Detached HEAD State</div>
        <div className="cr-controls" style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn"
            style={{ 
              background: headTarget === 'main' ? 'var(--blue)' : 'var(--surface)', 
              color: headTarget === 'main' ? '#fff' : 'var(--text)',
              border: '1px solid var(--border)' 
            }}
            onClick={() => setHeadTarget('main')}
          >
            git checkout main
          </button>
          <button 
            className="btn"
            style={{ 
              background: headTarget === 'e4f5g6h' ? 'var(--red)' : 'var(--surface)', 
              color: headTarget === 'e4f5g6h' ? '#fff' : 'var(--text)',
              border: '1px solid var(--border)' 
            }}
            onClick={() => setHeadTarget('e4f5g6h')}
          >
            git checkout e4f5g6h
          </button>
        </div>
      </div>

      <div style={{ padding: '40px 20px', background: 'var(--bg2)', position: 'relative', overflowX: 'auto' }}>
        <svg width="700" height="200" viewBox="0 0 700 200">
          {/* Commit Line */}
          <line x1="50" y1="100" x2="600" y2="100" stroke="var(--border)" strokeWidth="4" />

          {/* Commits */}
          {commits.map((c, i) => (
            <g key={c.id}>
              {i < commits.length - 1 && (
                <path d={`M ${c.x + 20} 100 L ${commits[i+1].x - 20} 100`} stroke="var(--border)" strokeWidth="4" />
              )}
              <circle cx={c.x} cy="100" r="16" fill="var(--surface)" stroke="var(--blue)" strokeWidth="3" />
              <text x={c.x} y="130" textAnchor="middle" fill="var(--text)" fontSize="12" fontFamily="var(--font-mono)">{c.id}</text>
              <text x={c.x} y="145" textAnchor="middle" fill="var(--text2)" fontSize="10">{c.label}</text>
            </g>
          ))}

          {/* Branch Pointer (main) */}
          <g style={{ transition: 'all 0.3s ease' }} transform={`translate(${commits[3].x}, 50)`}>
            <rect x="-30" y="-15" width="60" height="24" rx="4" fill="var(--green)" />
            <text x="0" y="2" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">main</text>
            <path d="M 0 9 L 0 30" stroke="var(--green)" strokeWidth="2" markerEnd="url(#arrow-green)" />
          </g>

          {/* HEAD Pointer */}
          <g 
            style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }} 
            transform={
              headTarget === 'main' 
                ? `translate(${commits[3].x}, 10)` // Points to branch
                : `translate(${commits[1].x}, 50)` // Points directly to commit e4f5g6h
            }
          >
            <rect x="-30" y="-15" width="60" height="24" rx="4" fill="var(--blue)" />
            <text x="0" y="2" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">HEAD</text>
            <path 
              d={headTarget === 'main' ? "M 0 9 L 0 25" : "M 0 9 L 0 30"} 
              stroke="var(--blue)" strokeWidth="2" markerEnd="url(#arrow-blue)" 
            />
          </g>

          {/* SVG Definitions for arrows */}
          <defs>
            <marker id="arrow-green" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="var(--green)" />
            </marker>
            <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="var(--blue)" />
            </marker>
          </defs>
        </svg>
      </div>

      <div style={{ padding: '16px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        {headTarget === 'main' ? (
          <div>
            <h4 style={{ color: 'var(--green)', marginBottom: '8px' }}>Normal State (Attached HEAD)</h4>
            <p style={{ fontSize: '14px', color: 'var(--text2)', margin: 0 }}>
              <code>HEAD</code> points to the <code>main</code> branch pointer. The <code>main</code> branch points to the latest commit. If you make a new commit right now, <code>main</code> will move forward, and <code>HEAD</code> will follow it.
            </p>
          </div>
        ) : (
          <div>
            <h4 style={{ color: 'var(--red)', marginBottom: '8px' }}>Detached HEAD State</h4>
            <p style={{ fontSize: '14px', color: 'var(--text2)', margin: 0 }}>
              <code>HEAD</code> points directly to a commit hash (<code>e4f5g6h</code>), not a branch name. If you make a new commit right now, no branch pointer will move. If you check out another branch later, those new commits will be left behind as orphans.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
