import React from 'react';
import StartupSimulator from '../components/StartupSimulator';

export default function StartupPR() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-header-wrap">
          <div className="section-bg-num">13</div>
          <div className="section-label">Reference</div>
          <h2 className="section-title">Your First Startup PR</h2>
          <p className="section-desc">
            A complete end-to-end walkthrough of a professional feature workflow. Putting it all together.
          </p>
        </div>

        <h3 className="subsection-title">The Scenario</h3>
        <p className="body-text">
          You work at <strong>Velocity HQ</strong>. You've been assigned a Jira ticket: <strong>PROJ-89 (Forgot Password Flow)</strong>. You need to write the backend code, test it, and open a Pull Request.
        </p>

        <p className="body-text">
          This is exactly how you will spend 80% of your time as a software engineer. Use the interactive simulator below to type through the entire workflow, from `clone` to `branch -d`.
        </p>

        <StartupSimulator />

        <div className="divider"></div>

        <h3 className="subsection-title">The Steps Explained</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--blue)', marginBottom: '8px' }}>1. Clone & Branch</h4>
            <p style={{ fontSize: '14px', color: 'var(--text2)', margin: 0 }}>Never work directly on <code>main</code>. Creating a branch immediately isolates your work. Naming convention: <code>feature/PROJ-89-forgot-password</code> connects your code directly to the Jira ticket.</p>
          </div>

          <div style={{ padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--green)', marginBottom: '8px' }}>2. Code & Commit</h4>
            <p style={{ fontSize: '14px', color: 'var(--text2)', margin: 0 }}>Write code, use <code>git status</code> frequently, stage with <code>git add</code>, and commit with meaningful messages. E.g., <code>feat(auth): add email template</code>.</p>
          </div>

          <div style={{ padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--yellow)', marginBottom: '8px' }}>3. Push & PR</h4>
            <p style={{ fontSize: '14px', color: 'var(--text2)', margin: 0 }}>Push your branch to the remote. Open a Pull Request on GitHub. Write a clear description of what you did and how to test it.</p>
          </div>

          <div style={{ padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--purple)', marginBottom: '8px' }}>4. Review & Merge</h4>
            <p style={{ fontSize: '14px', color: 'var(--text2)', margin: 0 }}>Respond to team feedback. Push new commits to address comments. Once approved, merge it (often "Squash and Merge" to keep main clean).</p>
          </div>

          <div style={{ padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--red)', marginBottom: '8px' }}>5. Sync & Clean</h4>
            <p style={{ fontSize: '14px', color: 'var(--text2)', margin: 0 }}>Go back to <code>main</code>, run <code>git pull</code> to get your merged code, and delete your local feature branch. You are ready for the next ticket!</p>
          </div>

        </div>

      </section>
    </div>
  );
}
