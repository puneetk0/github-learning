import React from 'react';
import NetworkTopologyVisualizer from '../components/NetworkTopologyVisualizer';
import Callout from '../components/ui/Callout';
import DeepDive from '../components/ui/DeepDive';
import Tabs from '../components/ui/Tabs';
import WarningBox from '../components/ui/WarningBox';

export default function Intro() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-header-wrap">
          <div className="section-bg-num">01</div>
          <div className="section-label">Introduction</div>
          <h2 className="section-title">Why Git & GitHub?</h2>
          <p className="section-desc">
            The fundamental architecture of distributed version control, and why it took over the entire software industry.
          </p>
        </div>

        <Tabs tabs={[
          {
            label: "The Problem",
            content: (
              <>
                <p className="body-text">
                  Before Git, the software industry relied on **Centralized Version Control Systems (CVCS)** like CVS, Subversion (SVN), and Perforce. In a centralized model, there is a single "master" server holding the entire history of the code. 
                </p>
                <ul className="body-text" style={{ paddingLeft: '20px' }}>
                  <li><strong>Single Point of Failure:</strong> If the central server went down, nobody could commit, branch, or view history. You could only edit your local files.</li>
                  <li><strong>Painful Branching:</strong> In SVN, branching meant physically copying the entire directory structure on the server. It was incredibly slow, heavily discouraged, and merging was a manual nightmare.</li>
                  <li><strong>Network Dependency:</strong> You could not work offline. Every operation required a round-trip to the server.</li>
                </ul>
                <p className="body-text">
                  In 2005, Linus Torvalds (creator of Linux) was managing the Linux kernel using a proprietary VCS called BitKeeper. When BitKeeper revoked their free license, Linus evaluated SVN and hated it. He needed a system that was insanely fast, completely distributed, and mathematically guaranteed against data corruption. <strong>He built Git in just 10 days.</strong>
                </p>
              </>
            )
          },
          {
            label: "The Solution (Git)",
            content: (
              <>
                <p className="body-text">
                  Git is a <strong>Distributed Version Control System (DVCS)</strong>. 
                </p>
                <p className="body-text">
                  "Distributed" means that when you clone a repository, you do not just get the latest files. You download a full, exact replica of the entire repository database. Every developer's laptop is essentially a complete backup of the server. 
                </p>
                <ul className="body-text" style={{ paddingLeft: '20px' }}>
                  <li><strong>Offline First:</strong> You can commit, branch, view history, and merge entirely offline. The only commands that require internet are <code>git push</code>, <code>git fetch</code>, and <code>git pull</code>.</li>
                  <li><strong>Instant Branching:</strong> In Git, a branch is just a 41-byte text file pointing to a commit hash. Creating a branch takes zero seconds and costs zero disk space.</li>
                  <li><strong>Cryptographic Integrity:</strong> Every file, directory, commit, and tag is hashed using SHA-1. It is mathematically impossible to change a file in the past without changing the commit hash and every hash that comes after it.</li>
                </ul>
              </>
            )
          },
          {
            label: "CAP Theorem & Git",
            content: (
              <>
                <p className="body-text">
                  The CAP Theorem states that a distributed data store can only provide two of the following: Consistency, Availability, and Partition tolerance.
                </p>
                <p className="body-text">
                  Git leans heavily into <strong>Availability and Partition tolerance (AP)</strong>. If the network goes down (Partition), Git is still 100% available on your local machine. You can keep working indefinitely. 
                </p>
                <p className="body-text">
                  Consistency is resolved <em>later</em> through Merging. When the network returns, Git provides complex mathematical algorithms (Diff3, Recursive, ORT) to resolve the diverging histories of all the distributed nodes into a single consistent state.
                </p>
              </>
            )
          }
        ]} />

        <div className="divider"></div>

        <h3 className="subsection-title">Centralized vs. Distributed Systems</h3>
        <p className="body-text">
          Interact with the topology simulation below to physically understand the difference between Subversion (Centralized) and Git (Distributed). Try taking the central server offline.
        </p>

        <NetworkTopologyVisualizer />

        <div className="divider"></div>

        <h3 className="subsection-title">Git vs. GitHub: Un-merging the Concepts</h3>
        <p className="body-text">
          The most common misconception for juniors is treating "Git" and "GitHub" as the same entity. They are entirely separate.
        </p>

        <div style={{ overflowX: 'auto', marginBottom: '24px', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px 16px', color: 'var(--text2)', fontWeight: 600 }}>Attribute</th>
                <th style={{ padding: '12px 16px', color: 'var(--text2)', fontWeight: 600 }}>Git</th>
                <th style={{ padding: '12px 16px', color: 'var(--text2)', fontWeight: 600 }}>GitHub</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text)', borderRight: '1px solid var(--border)' }}>What it is</td>
                <td style={{ padding: '12px 16px', color: 'var(--text)' }}>A command-line software program</td>
                <td style={{ padding: '12px 16px', color: 'var(--text)' }}>A cloud hosting platform (SaaS)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text)', borderRight: '1px solid var(--border)' }}>Creator</td>
                <td style={{ padding: '12px 16px', color: 'var(--text)' }}>Linus Torvalds (2005)</td>
                <td style={{ padding: '12px 16px', color: 'var(--text)' }}>Tom Preston-Werner (2008), acquired by Microsoft</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text)', borderRight: '1px solid var(--border)' }}>Location</td>
                <td style={{ padding: '12px 16px', color: 'var(--text)' }}>Locally on your laptop</td>
                <td style={{ padding: '12px 16px', color: 'var(--text)' }}>In the cloud (Microsoft datacenters)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text)', borderRight: '1px solid var(--border)' }}>Primary Function</td>
                <td style={{ padding: '12px 16px', color: 'var(--text)' }}>Version control, branching, history</td>
                <td style={{ padding: '12px 16px', color: 'var(--text)' }}>Collaboration, Pull Requests, CI/CD, Issue tracking</td>
              </tr>
              <tr style={{ background: 'var(--bg2)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text)', borderRight: '1px solid var(--border)' }}>Alternatives</td>
                <td style={{ padding: '12px 16px', color: 'var(--text)' }}>Mercurial, SVN, Bazaar</td>
                <td style={{ padding: '12px 16px', color: 'var(--text)' }}>GitLab, Bitbucket, AWS CodeCommit</td>
              </tr>
            </tbody>
          </table>
        </div>

        <DeepDive title="How GitHub Actually Works (Architecture)">
          <p>
            When you run <code>git push</code>, you are sending raw Git objects to GitHub. GitHub stores these in a highly customized, heavily distributed file system.
          </p>
          <p>
            GitHub's core routing layer is called <strong>Spokes</strong>. When you push, Spokes routes the Git objects to three separate, geographically distant servers simultaneously to ensure immediate redundancy. 
          </p>
          <p>
            The website you see (github.com) is a massive Ruby on Rails monolith. It does not run raw `git` commands on the servers (which would be catastrophically slow). Instead, it talks to a specialized RPC service called <strong>Gitaly</strong> (used by GitLab) or GitHub's internal equivalents, which directly read the C-structs of Git objects from disk.
          </p>
        </DeepDive>

        <WarningBox type="info" title="The Remote Server Fallacy">
          <p>
            Because GitHub is so popular, developers assume it holds the "true" copy of the code. To Git, GitHub is just another peer node in the network. There is technically no "master" server in Git. GitHub is simply the node that humans socially agreed to treat as the source of truth.
          </p>
        </WarningBox>

      </section>
    </div>
  );
}
