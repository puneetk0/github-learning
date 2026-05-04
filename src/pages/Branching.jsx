import React from 'react';
import RebaseVisualizer from '../components/RebaseVisualizer';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import DeepDive from '../components/ui/DeepDive';
import Tabs from '../components/ui/Tabs';
import CommandTable from '../components/ui/CommandTable';
import WarningBox from '../components/ui/WarningBox';

export default function Branching() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-header-wrap">
          <div className="section-bg-num">06</div>
          <div className="section-label">Collaboration</div>
          <h2 className="section-title">Branching, Merging & Rebasing</h2>
          <p className="section-desc">
            The mathematics of combining divergent timelines. Understanding the exact difference between a fast-forward, a 3-way merge, and a rebase.
          </p>
        </div>

        <Tabs tabs={[
          {
            label: "Merge Topologies",
            content: (
              <>
                <p className="body-text">
                  When you tell Git to merge two branches, the algorithm it chooses depends entirely on the shape of the graph.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                  <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <h4 style={{ color: 'var(--green)', margin: '0 0 12px 0' }}>Fast-Forward Merge</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.5, marginBottom: '16px' }}>If the target branch hasn't moved since you branched off, Git simply moves the target pointer forward. No merge commit is created. The history remains perfectly linear.</p>
                    <CodeBlock language="plaintext" code={`A---B---C (main)
         \\
          D---E (feature)

# git checkout main
# git merge feature

A---B---C---D---E (main, feature)`} />
                  </div>
                  <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <h4 style={{ color: 'var(--blue)', margin: '0 0 12px 0' }}>Three-Way Merge</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.5, marginBottom: '16px' }}>If both branches have new commits, Git finds the common ancestor (C), and creates a NEW "Merge Commit" (M) with two parents, tying the histories together.</p>
                    <CodeBlock language="plaintext" code={`A---B---C---F (main)
         \\
          D---E (feature)

# git merge feature

A---B---C---F---M (main)
         \\     /
          D---E (feature)`} />
                  </div>
                </div>
                <CommandTable rows={[
                  { flag: 'git merge --no-ff', effect: 'Forces Git to create a merge commit EVEN IF a fast-forward is possible. Useful for keeping the visual grouping of a feature branch in history.' },
                  { flag: 'git merge --squash', effect: 'Takes all commits from the feature branch, condenses them into a single blob of changes, and stages them on main. Does NOT create a merge commit. Does NOT preserve the feature branch history.' },
                  { flag: 'git merge --abort', effect: 'If you hit a nasty merge conflict and panic, this resets your working directory to exactly how it was before you typed git merge.' }
                ]} />
              </>
            )
          },
          {
            label: "The Rebase Engine",
            content: (
              <>
                <p className="body-text">
                  Rebasing is the act of picking up a series of commits and mathematically "replaying" them on top of a different base commit. It rewrites history to create a perfectly linear timeline.
                </p>
                <p className="body-text">
                  <strong>How it actually works internally:</strong>
                </p>
                <ol className="body-text" style={{ paddingLeft: '20px' }}>
                  <li>Git finds the common ancestor of your branch and the target branch.</li>
                  <li>It takes every commit you made since that ancestor and generates a temporary patch file for it.</li>
                  <li>It forcefully moves your branch pointer to the target branch's latest commit.</li>
                  <li>It applies those patches one by one, creating entirely NEW commits with entirely NEW hashes.</li>
                </ol>
                <WarningBox type="warning" title="The Golden Rule of Rebase">
                  <p><strong>Never rebase commits that have already been pushed to a shared remote.</strong></p>
                  <p>Because rebase creates new commit hashes, if a teammate has already pulled the old hashes, and you force-push the new hashes, Git will view them as two completely divergent timelines. The next time they pull, Git will attempt to merge the duplicate histories, resulting in catastrophic conflicts and doubled commits.</p>
                </WarningBox>
              </>
            )
          },
          {
            label: "Cherry-pick & Worktrees",
            content: (
              <>
                <h4 style={{ color: 'var(--text)', marginBottom: '8px' }}>git cherry-pick</h4>
                <p className="body-text">
                  Allows you to grab a specific commit from anywhere in the repository and apply its exact diff to your current branch.
                </p>
                <CodeBlock language="bash" code={`# Apply a single commit
git cherry-pick a1b2c3d

# Apply a range of commits
git cherry-pick a1b2c3d..e4f5g6h`} />
                <p className="body-text">
                  <em>Use case:</em> A critical hotfix was merged into <code>develop</code>, but production needs it right now. You check out the <code>main</code> branch, cherry-pick that specific fix commit from <code>develop</code>, and deploy.
                </p>

                <div className="divider" style={{ margin: '24px 0' }}></div>

                <h4 style={{ color: 'var(--text)', marginBottom: '8px' }}>git worktree (Advanced)</h4>
                <p className="body-text">
                  Normally, a Git repo has one Working Directory. If you are halfway through a feature and need to fix a bug on main, you must <code>git stash</code> your work, switch branches, fix the bug, switch back, and pop the stash.
                </p>
                <p className="body-text">
                  <code>git worktree</code> allows you to attach a second physical folder on your hard drive to the exact same <code>.git</code> database, but with a different branch checked out.
                </p>
                <CodeBlock language="bash" code={`# Inside your project folder
git worktree add ../project-hotfix main

# Now you have a completely separate folder on your computer
# where 'main' is checked out. You can open it in a new VS Code window,
# fix the bug, and commit. Your feature branch in the original folder is untouched.`} />
              </>
            )
          }
        ]} />

        <div className="divider"></div>

        <h3 className="subsection-title">Visualizing a Rebase</h3>
        <p className="body-text">
          Watch exactly what happens to the commit hashes when a rebase occurs. The original commits are abandoned (eventually garbage collected), and new commits are stamped on top of main.
        </p>

        <RebaseVisualizer />

      </section>
    </div>
  );
}
