import React, { useState } from 'react';

export default function WorkflowCompare() {
  const [activeWorkflow, setActiveWorkflow] = useState('trunk'); // trunk, gitflow

  return (
    <div className="cr-container" style={{ margin: '32px 0' }}>
      <div className="cr-header">
        <div className="cr-title">Compare: Trunk-Based vs Git Flow</div>
        <div className="cr-controls" style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn" 
            style={{ background: activeWorkflow === 'trunk' ? 'var(--blue)' : 'var(--surface)', color: activeWorkflow === 'trunk' ? '#fff' : 'var(--text)' }}
            onClick={() => setActiveWorkflow('trunk')}
          >
            Trunk-Based (Modern)
          </button>
          <button 
            className="btn" 
            style={{ background: activeWorkflow === 'gitflow' ? 'var(--yellow)' : 'var(--surface)', color: activeWorkflow === 'gitflow' ? '#000' : 'var(--text)' }}
            onClick={() => setActiveWorkflow('gitflow')}
          >
            Git Flow (Legacy)
          </button>
        </div>
      </div>
      
      <div style={{ padding: '24px', background: 'var(--bg2)', overflowX: 'auto' }}>
        
        {activeWorkflow === 'trunk' ? (
          <div style={{ minWidth: '600px' }}>
            <p style={{ color: 'var(--text2)', marginBottom: '24px', fontSize: '14px' }}>
              <strong>Trunk-Based Development:</strong> Everyone merges small, frequent updates into the `main` branch (the trunk) multiple times a day. Feature branches exist but are very short-lived (hours, not days). Releases are made directly from `main` using tags. This is the industry standard for agile, CI/CD-driven teams.
            </p>
            
            <svg width="600" height="200" viewBox="0 0 600 200">
              {/* Main Line */}
              <line x1="50" y1="100" x2="550" y2="100" stroke="var(--blue)" strokeWidth="4" />
              <text x="30" y="105" fill="var(--blue)" fontWeight="bold" fontSize="14">main</text>
              
              {/* Feature 1 */}
              <path d="M 100 100 C 120 100, 130 50, 150 50 L 180 50 C 200 50, 210 100, 230 100" stroke="var(--green)" fill="none" strokeWidth="2" />
              <circle cx="165" cy="50" r="6" fill="var(--green)" />
              <text x="165" y="35" fill="var(--text2)" fontSize="10" textAnchor="middle">feat/ui</text>
              
              {/* Feature 2 */}
              <path d="M 200 100 C 220 100, 230 150, 250 150 L 290 150 C 310 150, 320 100, 340 100" stroke="var(--yellow)" fill="none" strokeWidth="2" />
              <circle cx="270" cy="150" r="6" fill="var(--yellow)" />
              <text x="270" y="175" fill="var(--text2)" fontSize="10" textAnchor="middle">feat/api</text>
              
              {/* Feature 3 */}
              <path d="M 310 100 C 330 100, 340 50, 360 50 L 400 50 C 420 50, 430 100, 450 100" stroke="var(--green)" fill="none" strokeWidth="2" />
              <circle cx="380" cy="50" r="6" fill="var(--green)" />
              <text x="380" y="35" fill="var(--text2)" fontSize="10" textAnchor="middle">feat/db</text>
              
              {/* Main Commits */}
              <circle cx="100" cy="100" r="8" fill="var(--blue)" />
              <circle cx="230" cy="100" r="8" fill="var(--blue)" />
              <circle cx="340" cy="100" r="8" fill="var(--blue)" />
              <circle cx="450" cy="100" r="8" fill="var(--blue)" />
              
              {/* Release Tags */}
              <rect x="215" y="115" width="30" height="16" rx="2" fill="var(--surface)" stroke="var(--text2)" />
              <text x="230" y="127" fill="var(--text)" fontSize="10" textAnchor="middle">v1.1</text>
              
              <rect x="435" y="115" width="30" height="16" rx="2" fill="var(--surface)" stroke="var(--text2)" />
              <text x="450" y="127" fill="var(--text)" fontSize="10" textAnchor="middle">v1.2</text>
            </svg>
          </div>
        ) : (
          <div style={{ minWidth: '600px' }}>
            <p style={{ color: 'var(--text2)', marginBottom: '24px', fontSize: '14px' }}>
              <strong>Git Flow:</strong> Uses two long-lived branches: `main` (only holds production releases) and `develop` (integration branch). Feature branches branch off `develop`. When `develop` is ready for release, a `release` branch is created, tested, and finally merged into BOTH `main` and `develop`. Good for boxed software with scheduled release cycles, but considered overly complex for modern web development.
            </p>

            <svg width="600" height="240" viewBox="0 0 600 240">
              {/* Main Line */}
              <line x1="50" y1="40" x2="550" y2="40" stroke="var(--blue)" strokeWidth="4" />
              <text x="30" y="45" fill="var(--blue)" fontWeight="bold" fontSize="14">main</text>
              
              {/* Develop Line */}
              <line x1="50" y1="120" x2="550" y2="120" stroke="var(--yellow)" strokeWidth="4" />
              <text x="25" y="125" fill="var(--yellow)" fontWeight="bold" fontSize="14">dev</text>
              
              {/* Initial diverge */}
              <path d="M 100 40 L 150 120" stroke="var(--border)" fill="none" strokeWidth="2" strokeDasharray="4 4" />
              
              {/* Feature Branches off Develop */}
              <path d="M 170 120 C 190 120, 200 200, 220 200 L 280 200 C 300 200, 310 120, 330 120" stroke="var(--green)" fill="none" strokeWidth="2" />
              <circle cx="250" cy="200" r="6" fill="var(--green)" />
              <text x="250" y="220" fill="var(--text2)" fontSize="10" textAnchor="middle">feature/login</text>

              <path d="M 210 120 C 230 120, 240 170, 260 170 L 360 170 C 380 170, 390 120, 410 120" stroke="var(--green)" fill="none" strokeWidth="2" />
              <circle cx="310" cy="170" r="6" fill="var(--green)" />
              <text x="310" y="190" fill="var(--text2)" fontSize="10" textAnchor="middle">feature/cart</text>

              {/* Release Branch */}
              <path d="M 420 120 C 440 120, 450 80, 470 80 L 510 80 C 530 80, 530 40, 530 40" stroke="var(--red)" fill="none" strokeWidth="2" />
              {/* Merge Release back to Develop */}
              <path d="M 490 80 C 500 80, 510 120, 520 120" stroke="var(--red)" fill="none" strokeWidth="2" />
              <circle cx="480" cy="80" r="6" fill="var(--red)" />
              <text x="480" y="70" fill="var(--text2)" fontSize="10" textAnchor="middle">release/1.0</text>

              {/* Commits */}
              <circle cx="100" cy="40" r="8" fill="var(--blue)" />
              <circle cx="530" cy="40" r="8" fill="var(--blue)" />
              
              <circle cx="150" cy="120" r="8" fill="var(--yellow)" />
              <circle cx="330" cy="120" r="8" fill="var(--yellow)" />
              <circle cx="410" cy="120" r="8" fill="var(--yellow)" />
              <circle cx="520" cy="120" r="8" fill="var(--yellow)" />
              
              {/* Tags */}
              <rect x="515" y="15" width="30" height="16" rx="2" fill="var(--surface)" stroke="var(--text2)" />
              <text x="530" y="27" fill="var(--text)" fontSize="10" textAnchor="middle">v1.0</text>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
