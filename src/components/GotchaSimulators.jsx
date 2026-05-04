import React, { useState } from 'react';
import { AlertTriangle, Key, ArrowUpCircle } from 'lucide-react';

export default function GotchaSimulators() {
  const [activeGotcha, setActiveGotcha] = useState(0);

  const gotchas = [
    {
      id: 0,
      title: 'The Accidental Secret Push',
      icon: <Key size={24} color="var(--yellow)" />,
      scenario: 'You accidentally hardcoded an AWS Secret Key in `config.js`, committed it, and pushed it to GitHub. You immediately realized your mistake.',
      wrong: 'Add config.js to .gitignore and push again. (The secret is still in the history!)',
      right: 'Immediately revoke/rotate the key in AWS. Then use `git filter-repo` to scrub it from history if required, or just consider the key compromised and move on with the new key.',
    },
    {
      id: 1,
      title: 'Detached HEAD Panic',
      icon: <AlertTriangle size={24} color="var(--red)" />,
      scenario: 'You checked out an old commit `git checkout a1b2c3d`, wrote 3 hours of code, and made two commits. Then you typed `git checkout main`. Your commits are gone.',
      wrong: 'Rewrite the code from memory.',
      right: 'Run `git reflog` to find the hash of the last detached commit. Then run `git branch rescue-branch <hash>`. Your commits are instantly recovered.',
    },
    {
      id: 2,
      title: 'The Failed Push',
      icon: <ArrowUpCircle size={24} color="var(--blue)" />,
      scenario: 'You try to `git push` but Git says: "error: failed to push some refs... updates were rejected because the remote contains work that you do not have locally."',
      wrong: 'Run `git push --force`. (You just overwrote your coworker\'s code!)',
      right: 'Run `git pull --rebase` to fetch their changes and put your new commits on top. Then `git push`.',
    }
  ];

  return (
    <div className="cr-container" style={{ margin: '32px 0' }}>
      <div className="cr-header">
        <div className="cr-title">Common Gotchas & How to Fix Them</div>
      </div>
      
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        {gotchas.map((g, i) => (
          <button 
            key={g.id}
            style={{ 
              flex: 1, 
              padding: '16px', 
              background: activeGotcha === i ? 'rgba(255,255,255,0.05)' : 'transparent',
              border: 'none',
              borderRight: i < gotchas.length - 1 ? '1px solid var(--border)' : 'none',
              borderBottom: activeGotcha === i ? '2px solid var(--blue)' : '2px solid transparent',
              color: activeGotcha === i ? '#fff' : 'var(--text2)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
            onClick={() => setActiveGotcha(i)}
          >
            {g.icon}
            <span style={{ fontSize: '13px', fontWeight: activeGotcha === i ? 'bold' : 'normal' }}>{g.title}</span>
          </button>
        ))}
      </div>
      
      <div style={{ padding: '24px', background: 'var(--surface)' }}>
        <h4 style={{ color: 'var(--text)', marginBottom: '16px', fontSize: '16px' }}>Scenario</h4>
        <p style={{ color: 'var(--text2)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          {gotchas[activeGotcha].scenario}
        </p>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px', background: 'rgba(248, 81, 73, 0.1)', border: '1px solid var(--red)', borderRadius: '8px', padding: '16px' }}>
            <h4 style={{ color: 'var(--red)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <XCircle size={16} /> The Instinct (WRONG)
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.5, margin: 0 }}>
              {gotchas[activeGotcha].wrong}
            </p>
          </div>
          
          <div style={{ flex: 1, minWidth: '250px', background: 'rgba(46, 160, 67, 0.1)', border: '1px solid var(--green)', borderRadius: '8px', padding: '16px' }}>
            <h4 style={{ color: 'var(--green)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> The Fix (RIGHT)
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.5, margin: 0 }}>
              {gotchas[activeGotcha].right}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mini helper components for icons
function XCircle({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  );
}

function CheckCircle2({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle><polyline points="9 11 12 14 22 4"></polyline>
    </svg>
  );
}
