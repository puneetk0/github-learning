import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, Terminal } from 'lucide-react';
import './CommandSearch.css';

const COMMAND_REGISTRY = [
  { cmd: 'git add', route: '/essentials#git-add', desc: 'Stage file changes' },
  { cmd: 'git commit', route: '/essentials#git-commit', desc: 'Save snapshot to local repository' },
  { cmd: 'git push', route: '/essentials#git-push', desc: 'Upload local commits to remote' },
  { cmd: 'git fetch', route: '/essentials#git-fetch-pull', desc: 'Download remote objects and refs' },
  { cmd: 'git pull', route: '/essentials#git-fetch-pull', desc: 'Fetch from and integrate with another repository' },
  { cmd: 'git status', route: '/essentials#git-status', desc: 'Show the working tree status' },
  { cmd: 'git rebase', route: '/branching#git-rebase', desc: 'Reapply commits on top of another base tip' },
  { cmd: 'git cherry-pick', route: '/branching#git-cherry-pick', desc: 'Apply the changes introduced by some existing commits' },
  { cmd: 'git worktree', route: '/branching#git-worktree', desc: 'Manage multiple working trees' },
  { cmd: 'git revert', route: '/undo#git-revert', desc: 'Revert some existing commits' },
  { cmd: 'git reset', route: '/undo#git-reset', desc: 'Reset current HEAD to the specified state' },
  { cmd: 'git restore', route: '/undo#git-restore', desc: 'Restore working tree files' },
  { cmd: 'git reflog', route: '/undo#git-reflog', desc: 'Manage reflog information' },
  { cmd: 'git stash', route: '/advanced#git-stash', desc: 'Stash the changes in a dirty working directory away' },
  { cmd: 'git bisect', route: '/advanced#git-bisect', desc: 'Use binary search to find the commit that introduced a bug' },
  { cmd: 'git blame', route: '/advanced#git-blame', desc: 'Show what revision and author last modified each line of a file' },
  { cmd: 'git clone', route: '/setup#git-clone', desc: 'Clone a repository into a new directory' },
  { cmd: 'git branch', route: '/branching#git-branch', desc: 'List, create, or delete branches' },
  { cmd: 'git merge', route: '/branching#git-merge', desc: 'Join two or more development histories together' },
  { cmd: 'git config', route: '/setup#git-config', desc: 'Get and set repository or global options' },
];

export default function CommandSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Filter commands
  const filtered = COMMAND_REGISTRY.filter(c => 
    c.cmd.toLowerCase().includes(query.toLowerCase()) || 
    c.desc.toLowerCase().includes(query.toLowerCase())
  );

  // Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(open => !open);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Navigate keyboard logic
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % filtered.length);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + filtered.length) % filtered.length);
    }
    if (e.key === 'Enter' && filtered.length > 0) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  };

  const handleSelect = (item) => {
    navigate(item.route);
    setIsOpen(false);
    // Add a slight delay to allow navigation to complete before scrolling to hash
    setTimeout(() => {
      const hash = item.route.split('#')[1];
      if (hash) {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (!isOpen) {
    return (
      <button className="global-search-trigger" onClick={() => setIsOpen(true)}>
        <Search size={16} />
        <span>Search commands...</span>
        <div className="kbd-wrap">
          <kbd>⌘</kbd><kbd>K</kbd>
        </div>
      </button>
    );
  }

  return (
    <div className="cmd-overlay" onClick={() => setIsOpen(false)}>
      <div className="cmd-modal" onClick={e => e.stopPropagation()}>
        <div className="cmd-input-wrap">
          <Terminal size={18} className="cmd-icon" />
          <input
            ref={inputRef}
            className="cmd-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a git command (e.g., 'git push')..."
          />
        </div>
        <div className="cmd-results">
          {filtered.length === 0 ? (
            <div className="cmd-empty">No matching commands found.</div>
          ) : (
            filtered.map((item, i) => (
              <div 
                key={item.cmd}
                className={`cmd-item ${i === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <div className="cmd-item-title">
                  <Command size={14} />
                  {item.cmd}
                </div>
                <div className="cmd-item-desc">{item.desc}</div>
              </div>
            ))
          )}
        </div>
        <div className="cmd-footer">
          Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate, <kbd>Enter</kbd> to select, <kbd>Esc</kbd> to close
        </div>
      </div>
    </div>
  );
}
