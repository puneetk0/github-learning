import React from 'react';
import SearchableCheatsheet from '../components/SearchableCheatsheet';
import CodeBlock from '../components/ui/CodeBlock';

export default function Cheatsheet() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-header-wrap">
          <div className="section-bg-num">14</div>
          <div className="section-label">Reference</div>
          <h2 className="section-title">Quick Reference Cheatsheet</h2>
          <p className="section-desc">
            Everything you need to know, searchable and filterable. Bookmark this page.
          </p>
        </div>

        <SearchableCheatsheet />

        <div className="divider"></div>

        <h3 className="subsection-title">Must-Have Git Aliases</h3>
        <p className="body-text">
          Add these to your <code>~/.gitconfig</code> file. They will save you thousands of keystrokes over your career.
        </p>

        <CodeBlock 
          language="ini"
          code={`[alias]\n    st = status -s\n    co = checkout\n    br = branch\n    # The best git log alias ever created:\n    lg = log --oneline --graph --decorate --all\n    # Quick undo:\n    undo = reset --soft HEAD~1\n    # Show last commit:\n    last = log -1 HEAD --stat\n    # Emergency WIP save:\n    wip = !git add -A && git commit -m 'WIP: checkpoint'`}
        />

        <div style={{ marginTop: '40px', padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--blue)', marginBottom: '8px' }}>You have completed the guide!</h3>
          <p style={{ color: 'var(--text2)', fontSize: '14px', margin: 0, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            If you've read everything and played with the interactive tools, you now know more about Git than 90% of developers. 
            The only way to truly master it is to use it every day. Go build something amazing!
          </p>
        </div>

      </section>
    </div>
  );
}
