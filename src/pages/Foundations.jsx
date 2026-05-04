import React from 'react';
import Card from '../components/ui/Card';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import DeepDive from '../components/ui/DeepDive';
import ScenarioGames from '../components/ScenarioGames';
import { Shield, Zap, GitBranch, Key, Settings } from 'lucide-react';

export default function Foundations() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-header-wrap">
          <div className="section-bg-num">01</div>
          <div className="section-label">Foundation</div>
          <h2 className="section-title">Setup & Theory</h2>
          <p className="section-desc">Before we touch the terminal, let's understand the core philosophy of Git and how to configure it properly for professional use.</p>
        </div>
        
        <h3 className="subsection-title">The Philosophy of Git</h3>
        <p className="body-text">
          Most version control systems (like Subversion or Perforce) store information as a list of file-based changes. They keep a base file and a list of <em>deltas</em> (differences) over time. Git doesn't do this. 
          <br /><br />
          Instead, Git thinks of its data more like a series of <strong>snapshots of a miniature filesystem</strong>. Every time you commit, Git essentially takes a picture of what all your files look like at that moment and stores a reference to that snapshot. If files haven't changed, Git doesn't store the file again—just a link to the previous identical file it has already stored. This makes Git incredibly fast and branch-friendly.
        </p>

        <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', margin: '32px 0' }}>
          <Card icon={<Shield />} title="Absolute Safety">
            Because Git takes full snapshots, nearly everything you do adds data to the Git database. It is notoriously difficult to get the system to do something that is undoable. If you break it, you can always jump back.
          </Card>
          <Card icon={<Zap />} title="Distributed Workflow">
            You don't need a network connection to work. Because you have a full local copy of the repository, you can view history, branch, and commit entirely offline. 
          </Card>
          <Card icon={<GitBranch />} title="Frictionless Branching">
            Unlike older systems where creating a branch meant copying an entire directory, a branch in Git is simply a lightweight, 40-character file pointer. Branching is instantaneous.
          </Card>
        </div>

        <Callout type="info">
          <strong>Git vs GitHub:</strong> Git is the underlying command-line tool running on your local machine. GitHub is a remote hosting service (owned by Microsoft) that holds a copy of your Git repositories in the cloud, adding social and collaborative features like Pull Requests.
        </Callout>

        <div className="divider"></div>

        <h3 className="subsection-title">Professional Setup</h3>
        <p className="body-text">
          Before you start committing, you need to configure your identity. Git uses this information to stamp every commit you make.
        </p>

        <CodeBlock 
          language="bash" 
          code={`git config --global user.name "Jane Doe"\ngit config --global user.email "jane@example.com"\n\n# Configure your default branch name to 'main'\ngit config --global init.defaultBranch main\n\n# Set your preferred editor (e.g., VS Code)\ngit config --global core.editor "code --wait"`} 
        />

        <DeepDive title="The Three Levels of Configuration">
          <p>Git looks for configuration values in three distinct files, in this order:</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li><strong>System Level:</strong> <code>/etc/gitconfig</code> - Applies to every user on the system. (Use <code>--system</code>)</li>
            <li><strong>Global Level:</strong> <code>~/.gitconfig</code> - Applies to you as a user. This is where your name and email live. (Use <code>--global</code>)</li>
            <li><strong>Local Level:</strong> <code>.git/config</code> - Applies only to the specific repository you are currently in. This overrides the Global and System levels. (Use <code>--local</code>)</li>
          </ul>
          <p>If you have a personal GitHub account and a work GitLab account, use the Global config for your main identity, and the Local config inside your work repositories to override your email address.</p>
        </DeepDive>

        <div className="divider"></div>

        <h3 className="subsection-title">Knowledge Check</h3>
        <ScenarioGames />
      </section>
    </div>
  );
}
