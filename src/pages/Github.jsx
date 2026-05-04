import React from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import DeepDive from '../components/ui/DeepDive';
import { GitPullRequest, GitFork, PlayCircle } from 'lucide-react';
import Card from '../components/ui/Card';

export default function Github() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-header-wrap">
          <div className="section-bg-num">08</div>
          <div className="section-label">Ecosystem</div>
          <h2 className="section-title">Beyond Hosting</h2>
          <p className="section-desc">
            Git is the engine; GitHub is the factory. It provides the social and automation layers necessary to build software as a team.
          </p>
        </div>

        <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', margin: '32px 0' }}>
          <Card icon={<GitPullRequest />} title="Pull Requests (PRs)">
            A PR is a request to merge your feature branch into the main codebase. It creates a dedicated forum where team members can review your code line-by-line, run automated tests, and discuss architecture before the code is merged.
          </Card>
          <Card icon={<GitFork />} title="Forks">
            A fork is a personal copy of someone else's repository. In Open Source, you don't have write access to the main repo. You fork it, make changes to your copy, and then submit a Pull Request back to the original author.
          </Card>
          <Card icon={<PlayCircle />} title="GitHub Actions">
            A built-in CI/CD (Continuous Integration / Continuous Deployment) server. It allows you to run scripts automatically every time a specific event happens in your repository.
          </Card>
        </div>

        <div className="divider"></div>

        <h3 className="subsection-title">Anatomy of a GitHub Action</h3>
        <p className="body-text">
          GitHub Actions are defined using YAML files stored in a special directory: <code>.github/workflows/</code>. Let's look at a simple Action that runs automated tests every time someone pushes code or creates a Pull Request.
        </p>

        <CodeBlock 
          language="yaml"
          code={`name: Run Tests

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - name: Check out repository code
      uses: actions/checkout@v4
      
    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        
    - name: Install dependencies
      run: npm install
      
    - name: Run test suite
      run: npm test`}
        />

        <DeepDive title="Breaking down the YAML">
          <p><strong>on:</strong> The trigger. When should this action run? (On pushes and PRs targeting the main branch).</p>
          <p><strong>jobs:</strong> A workflow is made of one or more jobs. Our job is called <code>test</code>.</p>
          <p><strong>runs-on:</strong> The virtual machine environment GitHub spins up to run your code (in this case, an Ubuntu Linux server).</p>
          <p><strong>steps:</strong> The sequential tasks to execute. Notice that we use pre-built actions like <code>actions/checkout</code> to handle boilerplate like cloning the repo, before running our custom <code>npm test</code> script.</p>
        </DeepDive>

        <Callout type="tip">
          <strong>Branch Protections:</strong> You can configure GitHub so that code <em>cannot</em> be merged into <code>main</code> unless the GitHub Action tests pass and at least one other human approves the Pull Request. This prevents broken code from ever reaching production.
        </Callout>

      </section>
    </div>
  );
}
