import React, { useState } from 'react';
import { GitBranch, GitCommit, GitMerge } from 'lucide-react';
import './BranchPlayground.css';

export default function BranchPlayground() {
  const [commits, setCommits] = useState([
    { id: 'c1', branch: 'main', parent: null, x: 50, y: 50 },
    { id: 'c2', branch: 'main', parent: 'c1', x: 150, y: 50 }
  ]);
  const [activeBranch, setActiveBranch] = useState('main');
  const [branches, setBranches] = useState(['main']);
  
  const addCommit = () => {
    const branchCommits = commits.filter(c => c.branch === activeBranch);
    // Find the latest commit on this branch or the branch point
    let lastCommit = branchCommits[branchCommits.length - 1];
    
    if (!lastCommit) {
      // Find the commit where this branch originated (simplification for UI)
      lastCommit = commits[commits.length - 1]; 
    }

    const newId = `c${commits.length + 1}`;
    
    // Determine Y coordinate based on branch index
    const branchIndex = branches.indexOf(activeBranch);
    const y = 50 + (branchIndex * 80);
    const x = lastCommit.x + 100;

    setCommits([...commits, { id: newId, branch: activeBranch, parent: lastCommit.id, x, y }]);
  };

  const createBranch = () => {
    const newBranch = `feature-${branches.length}`;
    setBranches([...branches, newBranch]);
    setActiveBranch(newBranch);
  };

  const mergeBranch = () => {
    if (activeBranch === 'main') return;
    
    const mainCommits = commits.filter(c => c.branch === 'main');
    const lastMain = mainCommits[mainCommits.length - 1];
    
    const featureCommits = commits.filter(c => c.branch === activeBranch);
    const lastFeature = featureCommits[featureCommits.length - 1];

    if (!lastFeature) return;

    const newId = `c${commits.length + 1}`;
    const x = Math.max(lastMain.x, lastFeature.x) + 100;
    const y = 50; // Merge into main

    setCommits([...commits, { 
      id: newId, 
      branch: 'main', 
      parent: lastMain.id,
      parent2: lastFeature.id,
      x, 
      y 
    }]);
    
    setActiveBranch('main');
  };

  return (
    <div className="branch-playground">
      <div className="bp-controls">
        <div className="bp-branch-selector">
          <span className="bp-label">Current Branch:</span>
          <select value={activeBranch} onChange={(e) => setActiveBranch(e.target.value)}>
            {branches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        
        <button className="bp-btn" onClick={addCommit}>
          <GitCommit size={14} /> Commit
        </button>
        <button className="bp-btn" onClick={createBranch}>
          <GitBranch size={14} /> New Branch
        </button>
        <button className="bp-btn merge" onClick={mergeBranch} disabled={activeBranch === 'main'}>
          <GitMerge size={14} /> Merge into main
        </button>
      </div>

      <div className="bp-canvas-container">
        <svg className="bp-lines">
          {commits.map(c => {
            if (!c.parent) return null;
            const parent = commits.find(p => p.id === c.parent);
            if (!parent) return null;
            return (
              <path 
                key={`${c.id}-path`}
                d={`M ${parent.x + 15} ${parent.y} C ${parent.x + 50} ${parent.y}, ${c.x - 50} ${c.y}, ${c.x - 15} ${c.y}`}
                fill="none"
                stroke={c.branch === 'main' ? 'var(--accent)' : 'var(--blue)'}
                strokeWidth="3"
                className="bp-path-anim"
              />
            );
          })}
          {commits.map(c => {
            if (!c.parent2) return null;
            const parent2 = commits.find(p => p.id === c.parent2);
            if (!parent2) return null;
            return (
              <path 
                key={`${c.id}-merge-path`}
                d={`M ${parent2.x + 15} ${parent2.y} C ${parent2.x + 50} ${parent2.y}, ${c.x - 50} ${c.y}, ${c.x - 15} ${c.y}`}
                fill="none"
                stroke="var(--green)"
                strokeWidth="3"
                strokeDasharray="5,5"
                className="bp-path-anim"
              />
            );
          })}
        </svg>

        <div className="bp-nodes">
          {commits.map(c => (
            <div 
              key={c.id} 
              className={`bp-node ${c.branch === 'main' ? 'main-branch' : 'feature-branch'}`}
              style={{ left: c.x - 15, top: c.y - 15 }}
            >
              {c.id}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
