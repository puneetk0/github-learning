import React from 'react';
import GotchaSimulators from '../components/GotchaSimulators';
import Callout from '../components/ui/Callout';

export default function BestPractices() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-header-wrap">
          <div className="section-bg-num">12</div>
          <div className="section-label">Reference</div>
          <h2 className="section-title">Tips & Best Practices</h2>
          <p className="section-desc">
            The difference between knowing Git commands and being a senior engineer who uses Git effectively.
          </p>
        </div>

        <h3 className="subsection-title">The 5 Golden Rules</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          <div style={{ padding: '16px', background: 'var(--surface)', borderLeft: '4px solid var(--blue)', borderRadius: '0 8px 8px 0' }}>
            <h4 style={{ color: 'var(--text)', marginBottom: '8px' }}>1. Commit Small, Commit Often</h4>
            <p style={{ color: 'var(--text2)', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>A commit should do exactly ONE thing. If your commit message has the word "and" in it (e.g., "Fix login bug and add new dashboard"), you should probably split it into two commits.</p>
          </div>
          
          <div style={{ padding: '16px', background: 'var(--surface)', borderLeft: '4px solid var(--green)', borderRadius: '0 8px 8px 0' }}>
            <h4 style={{ color: 'var(--text)', marginBottom: '8px' }}>2. Never Commit Secrets</h4>
            <p style={{ color: 'var(--text2)', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>Never put API keys, passwords, or tokens in your code. Use <code>.env</code> files and ensure they are in your <code>.gitignore</code> BEFORE your first commit.</p>
          </div>

          <div style={{ padding: '16px', background: 'var(--surface)', borderLeft: '4px solid var(--yellow)', borderRadius: '0 8px 8px 0' }}>
            <h4 style={{ color: 'var(--text)', marginBottom: '8px' }}>3. Write Meaningful Commit Messages</h4>
            <p style={{ color: 'var(--text2)', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>"Fixed bug" is useless to your team 6 months from now. "fix(auth): handle null token on session resume" is excellent. Explain the WHY, not just the WHAT.</p>
          </div>

          <div style={{ padding: '16px', background: 'var(--surface)', borderLeft: '4px solid var(--red)', borderRadius: '0 8px 8px 0' }}>
            <h4 style={{ color: 'var(--text)', marginBottom: '8px' }}>4. Pull Before You Push</h4>
            <p style={{ color: 'var(--text2)', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>Always sync your local repository with the remote before trying to push your changes. Set <code>git config --global pull.rebase true</code> to keep history clean.</p>
          </div>

          <div style={{ padding: '16px', background: 'var(--surface)', borderLeft: '4px solid var(--purple)', borderRadius: '0 8px 8px 0' }}>
            <h4 style={{ color: 'var(--text)', marginBottom: '8px' }}>5. Don't Panic</h4>
            <p style={{ color: 'var(--text2)', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>Git is designed to not lose data. If you mess up a rebase, a reset, or a merge, <code>git reflog</code> is there to save you. Stop typing, look at the reflog, and undo.</p>
          </div>
        </div>

        <div className="divider"></div>

        <GotchaSimulators />

        <Callout type="tip">
          <strong>Level Up Your Terminal:</strong> Don't use raw bash. Install <strong>Oh My Zsh</strong> with the <code>git</code> plugin, or <strong>Starship prompt</strong>. These tools show you what branch you are on and whether you have uncommitted changes directly in your terminal prompt. It will save you from making mistakes!
        </Callout>

      </section>
    </div>
  );
}
