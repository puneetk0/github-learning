import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchableCheatsheet() {
  const [query, setQuery] = useState('');
  
  const commands = [
    { cmd: 'git init', desc: 'Initialize a new repository in the current directory.', category: 'Setup' },
    { cmd: 'git clone <url>', desc: 'Download a repository and its entire history.', category: 'Setup' },
    { cmd: 'git config --global user.name "Name"', desc: 'Set global username.', category: 'Config' },
    { cmd: 'git status', desc: 'Show working tree status.', category: 'Daily' },
    { cmd: 'git add .', desc: 'Stage all current changes.', category: 'Daily' },
    { cmd: 'git add -p', desc: 'Interactively stage changes chunk by chunk.', category: 'Daily' },
    { cmd: 'git commit -m "msg"', desc: 'Commit staged changes with a message.', category: 'Daily' },
    { cmd: 'git commit --amend', desc: 'Add staged changes to the previous commit / edit message.', category: 'Advanced' },
    { cmd: 'git push', desc: 'Upload local repository content to a remote repository.', category: 'Sync' },
    { cmd: 'git pull', desc: 'Fetch from and integrate with another repository or a local branch.', category: 'Sync' },
    { cmd: 'git fetch', desc: 'Download objects and refs from another repository (safe).', category: 'Sync' },
    { cmd: 'git branch', desc: 'List local branches.', category: 'Branching' },
    { cmd: 'git switch -c <name>', desc: 'Create and switch to a new branch.', category: 'Branching' },
    { cmd: 'git branch -d <name>', desc: 'Delete a branch (safely).', category: 'Branching' },
    { cmd: 'git merge <branch>', desc: 'Merge another branch into the current branch.', category: 'Branching' },
    { cmd: 'git rebase main', desc: 'Reapply commits on top of another base tip.', category: 'Advanced' },
    { cmd: 'git log --oneline', desc: 'Show commit history in a compact format.', category: 'Inspection' },
    { cmd: 'git show <hash>', desc: 'Show various types of objects (usually commits).', category: 'Inspection' },
    { cmd: 'git stash', desc: 'Temporarily store modified, tracked files.', category: 'Advanced' },
    { cmd: 'git stash pop', desc: 'Restore the most recently stashed files.', category: 'Advanced' },
    { cmd: 'git revert <hash>', desc: 'Create a new commit that undoes the changes from a previous commit.', category: 'Undo' },
    { cmd: 'git reset --soft HEAD~1', desc: 'Undo the last commit, keep changes staged.', category: 'Undo' },
    { cmd: 'git reset HEAD~1', desc: 'Undo the last commit, keep changes in working directory.', category: 'Undo' },
    { cmd: 'git reset --hard HEAD~1', desc: 'Undo the last commit, completely discard all changes.', category: 'Undo' },
    { cmd: 'git restore <file>', desc: 'Discard changes in working directory.', category: 'Undo' },
    { cmd: 'git restore --staged <file>', desc: 'Remove file from the staging area.', category: 'Undo' },
    { cmd: 'git reflog', desc: 'Show a log of where HEAD has been.', category: 'Advanced' },
    { cmd: 'git bisect start', desc: 'Start a binary search to find a bug.', category: 'Advanced' }
  ];

  const filtered = commands.filter(c => 
    c.cmd.toLowerCase().includes(query.toLowerCase()) || 
    c.desc.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="cr-container" style={{ margin: '32px 0' }}>
      <div className="cr-header" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div className="cr-title" style={{ flex: 1 }}>Interactive Cheatsheet</div>
        <div style={{ position: 'relative', width: '250px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text2)' }} />
          <input 
            type="text" 
            placeholder="Search commands (e.g. undo, branch)..." 
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ 
              width: '100%', 
              background: 'var(--surface)', 
              border: '1px solid var(--border)', 
              borderRadius: '4px', 
              padding: '8px 12px 8px 34px',
              color: 'var(--text)',
              fontSize: '13px'
            }}
          />
        </div>
      </div>
      
      <div style={{ padding: '0', background: 'var(--surface)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
              <th style={{ padding: '12px 16px', width: '100px', color: 'var(--text2)' }}>Category</th>
              <th style={{ padding: '12px 16px', width: '250px', color: 'var(--text2)' }}>Command</th>
              <th style={{ padding: '12px 16px', color: 'var(--text2)' }}>What it does</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((c, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', color: 'var(--blue)', fontSize: '12px' }}>{c.category}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: 'var(--green)', fontSize: '13px' }}>{c.cmd}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text)' }}>{c.desc}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ padding: '32px', textAlign: 'center', color: 'var(--text2)' }}>No commands found for "{query}"</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
