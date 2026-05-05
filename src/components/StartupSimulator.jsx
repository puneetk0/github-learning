import React, { useState, useRef, useEffect } from 'react';

export default function StartupSimulator() {
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState([
    { type: 'info', text: 'Welcome to Velocity HQ. You just got assigned Jira Ticket: PROJ-89 (Forgot Password Flow).' },
    { type: 'info', text: 'Step 1: Clone the repository to your machine.' },
    { type: 'info', text: 'Expected command: git clone git@github.com:velocity-hq/api.git' }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const stages = [
    {
      expected: 'git clone git@github.com:velocity-hq/api.git',
      successText: 'Cloning into \'api\'...\nReceiving objects: 100% (4532/4532), 2.1 MiB | 4.2 MiB/s, done.',
      nextInstructions: 'Great! Now enter the directory: cd api'
    },
    {
      expected: 'cd api',
      successText: '',
      nextInstructions: 'You are on `main`. Create and switch to a new feature branch for your ticket.\nExpected: git checkout -b feature/PROJ-89'
    },
    {
      expected: 'git checkout -b feature/PROJ-89',
      successText: 'Switched to a new branch \'feature/PROJ-89\'',
      nextInstructions: '[Simulating 4 hours of coding...]\nYou created `src/auth.js`. Stage it for commit.\nExpected: git add src/auth.js'
    },
    {
      expected: 'git add src/auth.js',
      successText: '',
      nextInstructions: 'Now commit it with a good message.\nExpected: git commit -m "feat(auth): add forgot password flow"'
    },
    {
      expected: 'git commit -m "feat(auth): add forgot password flow"',
      successText: '[feature/PROJ-89 a3f2c91] feat(auth): add forgot password flow\n 1 file changed, 45 insertions(+)',
      nextInstructions: 'Time to push your branch to GitHub. Because it\'s a new branch, set the upstream.\nExpected: git push -u origin feature/PROJ-89'
    },
    {
      expected: 'git push -u origin feature/PROJ-89',
      successText: 'Enumerating objects: 5, done.\nWriting objects: 100% (3/3), 450 bytes, done.\nTo github.com:velocity-hq/api.git\n * [new branch] feature/PROJ-89 -> feature/PROJ-89\nBranch \'feature/PROJ-89\' set up to track remote branch \'feature/PROJ-89\' from \'origin\'.',
      nextInstructions: '🎉 PR Merged! Your tech lead approved it. Go back to main.\nExpected: git checkout main'
    },
    {
      expected: 'git checkout main',
      successText: 'Switched to branch \'main\'\nYour branch is up to date with \'origin/main\'.',
      nextInstructions: 'Pull the latest changes from GitHub (which now includes your merged PR).\nExpected: git pull'
    },
    {
      expected: 'git pull',
      successText: 'Updating 9d8e7f6..a3f2c91\nFast-forward\n src/auth.js | 45 +++++++++++++++++++++++++++++++++++++++++++++\n 1 file changed, 45 insertions(+)',
      nextInstructions: 'Finally, delete your local feature branch since it\'s merged.\nExpected: git branch -d feature/PROJ-89'
    },
    {
      expected: 'git branch -d feature/PROJ-89',
      successText: 'Deleted branch feature/PROJ-89 (was a3f2c91).',
      nextInstructions: '✨ SIMULATION COMPLETE. You have mastered the startup PR workflow! ✨'
    }
  ];

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      if (!cmd) return;
      
      let newHistory = [...history, { type: 'cmd', text: `$ ${cmd}` }];
      
      if (step < stages.length) {
        const currentStage = stages[step];
        // simple check, could be improved with regex for quotes etc
        if (cmd === currentStage.expected || 
           (currentStage.expected.includes('commit') && cmd.startsWith('git commit -m')) ||
           (currentStage.expected === 'git checkout -b feature/PROJ-89' && cmd === 'git switch -c feature/PROJ-89')
        ) {
          if (currentStage.successText) {
            newHistory.push({ type: 'output', text: currentStage.successText });
          }
          newHistory.push({ type: 'success', text: currentStage.nextInstructions });
          setStep(step + 1);
        } else {
          newHistory.push({ type: 'error', text: `Command not recognized for this step. Try: ${currentStage.expected}` });
        }
      } else {
        newHistory.push({ type: 'info', text: 'Simulation complete. Reload page to restart.' });
      }
      
      setHistory(newHistory);
      setInput('');
    }
  };

  return (
    <div className="cr-container" style={{ margin: '32px 0' }}>
      <div className="cr-header">
        <div className="cr-title">Simulation: End-to-End Startup PR</div>
        <div style={{ fontSize: '12px', color: 'var(--text2)' }}>Progress: {step}/{stages.length}</div>
      </div>
      
      <div style={{ background: 'var(--bg2)', padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '13px', display: 'flex', flexDirection: 'column', height: '400px', color: 'var(--text)' }}>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {history.map((h, i) => (
            <div key={i} style={{ 
              color: h.type === 'cmd' ? '#fff' : 
                     h.type === 'error' ? 'var(--red)' : 
                     h.type === 'success' ? 'var(--green)' : 
                     h.type === 'output' ? 'var(--text2)' : 'var(--blue)',
              whiteSpace: 'pre-wrap'
            }}>
              {h.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        
        {step < stages.length && (
          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text)', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
            <span style={{ color: 'var(--green)', marginRight: '8px' }}>~/workspace $</span>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              style={{ background: 'transparent', border: 'none', color: 'var(--text)', outline: 'none', flex: 1, fontFamily: 'inherit', fontSize: 'inherit' }}
              placeholder={stages[step].expected}
              spellCheck="false"
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
}
