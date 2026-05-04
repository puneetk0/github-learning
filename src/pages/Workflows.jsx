import React from 'react';
import WorkflowCompare from '../components/WorkflowCompare';
import Callout from '../components/ui/Callout';

export default function Workflows() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-header-wrap">
          <div className="section-bg-num">11</div>
          <div className="section-label">Ecosystem</div>
          <h2 className="section-title">Real-World Workflows</h2>
          <p className="section-desc">
            How teams actually use Git in production. The commands are the same, but the rules of engagement change entirely.
          </p>
        </div>

        <h3 className="subsection-title">1. The Solo Developer</h3>
        <p className="body-text">
          Working alone? You can do whatever you want. Commit directly to <code>main</code>, rewrite history, force push. No one is affected but you.
        </p>

        <div className="divider"></div>

        <h3 className="subsection-title">2. Trunk-Based Development (Modern Standard)</h3>
        <p className="body-text">
          This is what most high-performing tech companies (Google, Meta, modern startups) use today.
        </p>
        <ul style={{ paddingLeft: '20px', marginBottom: '24px', lineHeight: 1.6, color: 'var(--text2)' }}>
          <li>One long-lived branch: <code>main</code>.</li>
          <li>Developers create short-lived feature branches (lasting hours, max 1-2 days).</li>
          <li>Merge to <code>main</code> constantly.</li>
          <li>Never break the build on <code>main</code> (requires heavy automated testing).</li>
          <li>Use "Feature Flags" to hide unfinished code in production.</li>
        </ul>

        <WorkflowCompare />

        <div className="divider"></div>

        <h3 className="subsection-title">3. Monorepo vs Polyrepo</h3>
        <p className="body-text">
          How should you organize your codebase if you have a Frontend, Backend, and Mobile app?
        </p>

        <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', margin: '24px 0' }}>
          <div style={{ padding: '20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--blue)', marginBottom: '8px' }}>Monorepo</h4>
            <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.6 }}>All projects live in a single Git repository. Easy to share code, easy to make atomic changes across frontend and backend simultaneously. Used by Google, Meta, and many modern startups (via tools like Turborepo).</p>
          </div>
          <div style={{ padding: '20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--yellow)', marginBottom: '8px' }}>Polyrepo</h4>
            <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.6 }}>Each project has its own separate Git repository (<code>frontend-repo</code>, <code>backend-repo</code>). Better security boundaries, smaller repo sizes, but harder to manage cross-project dependencies.</p>
          </div>
        </div>

        <Callout type="tip">
          <strong>The Open Source Workflow (Fork & Pull)</strong><br />
          Because you can't push branches to someone else's repository:
          <ol style={{ paddingLeft: '20px', marginTop: '8px', marginBottom: 0 }}>
            <li>Fork the repo to your account</li>
            <li>Clone your fork</li>
            <li>Create a branch, commit, push to your fork</li>
            <li>Open a Pull Request across repositories</li>
          </ol>
        </Callout>

      </section>
    </div>
  );
}
