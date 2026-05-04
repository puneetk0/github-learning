import React from 'react';
import PullRequestReviewUI from '../components/PullRequestReviewUI';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import DeepDive from '../components/ui/DeepDive';

export default function GithubFeatures() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-header-wrap">
          <div className="section-bg-num">10</div>
          <div className="section-label">Ecosystem</div>
          <h2 className="section-title">GitHub Features</h2>
          <p className="section-desc">
            Git is the local engine. GitHub is the global collaboration platform built on top of it.
          </p>
        </div>

        <h3 className="subsection-title">Pull Requests (PRs)</h3>
        <p className="body-text">
          A Pull Request is not a native Git concept. It is a GitHub feature that says: "I have pushed a branch. Please review it, approve it, and pull it into the main branch."
        </p>
        <p className="body-text">
          Good PRs are small, focused, and have detailed descriptions. They are the primary mechanism for code review in the modern software industry.
        </p>

        <PullRequestReviewUI />

        <div className="divider"></div>

        <h3 className="subsection-title">Forks vs Branches</h3>
        <p className="body-text">
          If you work at a company, you will likely just create a branch in the company repository. If you are contributing to Open Source, you cannot create branches in their repo because you don't have write access.
        </p>
        <ul style={{ paddingLeft: '20px', marginBottom: '24px', lineHeight: 1.6, color: 'var(--text2)' }}>
          <li><strong>Fork:</strong> Creating a complete server-side copy of a repository into your own GitHub account. You have full write access to your fork.</li>
          <li><strong>Cross-repo PR:</strong> You create a branch on your fork, commit your changes, and then open a PR from your fork's branch to the original repository's main branch.</li>
        </ul>

        <div className="divider"></div>

        <h3 className="subsection-title">GitHub Actions (CI/CD)</h3>
        <p className="body-text">
          GitHub Actions allows you to run automated scripts every time an event happens in your repository (like pushing code or opening a PR).
        </p>

        <DeepDive title="Anatomy of a CI/CD Pipeline">
          <p>This file lives in <code>.github/workflows/test.yml</code>. It runs tests automatically every time someone pushes to the main branch or opens a Pull Request.</p>
          <CodeBlock 
            language="yaml"
            code={`name: Node.js CI\n\non:\n  push:\n    branches: [ "main" ]\n  pull_request:\n    branches: [ "main" ]\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v3\n    - name: Use Node.js\n      uses: actions/setup-node@v3\n      with:\n        node-version: '18.x'\n    - run: npm ci\n    - run: npm test`}
          />
        </DeepDive>

        <div className="divider"></div>

        <h3 className="subsection-title">Branch Protection Rules</h3>
        <p className="body-text">
          In a professional setting, you never want someone to accidentally <code>git push --force origin main</code>. Branch protection rules prevent this.
        </p>
        <Callout type="tip">
          <strong>Standard Startup Protection Rules for `main`:</strong>
          <ul>
            <li>Require a pull request before merging</li>
            <li>Require at least 1 approving review</li>
            <li>Require status checks to pass before merging (e.g., CI tests must be green)</li>
            <li>Do not allow bypassing the above settings</li>
            <li>Restrict who can push to matching branches (nobody, only merges allowed)</li>
          </ul>
        </Callout>

      </section>
    </div>
  );
}
