import React from 'react';
import InteractivePatchStaging from '../components/InteractivePatchStaging';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import DeepDive from '../components/ui/DeepDive';
import Tabs from '../components/ui/Tabs';
import CommandTable from '../components/ui/CommandTable';
import WarningBox from '../components/ui/WarningBox';

export default function Essentials() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-header-wrap">
          <div className="section-bg-num">05</div>
          <div className="section-label">Operations</div>
          <h2 className="section-title">Essential Commands</h2>
          <p className="section-desc">
            The core daily loop. Moving beyond `add .` and `commit -m "wip"` to professional, surgical Git operations.
          </p>
        </div>

        <Tabs tabs={[
          {
            label: "git add (Staging)",
            content: (
              <>
                <p className="body-text">
                  Staging is the act of composing your next commit. A professional engineer does not simply stage all modified files at once. They curate the index.
                </p>
                <CommandTable rows={[
                  { flag: 'git add .', effect: 'Stages all changes in the CURRENT directory and below. Dangerous if run at the root without a good .gitignore.' },
                  { flag: 'git add -A', effect: 'Stages ALL changes in the entire repository, regardless of your current directory.' },
                  { flag: 'git add -u', effect: 'Update only. Stages modifications to tracked files and deletions. Completely ignores newly created, untracked files.' },
                  { flag: 'git add -p', effect: 'Patch mode. The most powerful staging tool. Asks you chunk-by-chunk (hunk) if you want to stage a specific line of code.' }
                ]} />
                <p className="body-text">
                  <strong>Why patch mode?</strong> Imagine you are fixing a login bug, and while reading the code, you notice a typo in a completely unrelated comment and fix it. You should not commit the bug fix and the typo fix together. You run <code>git add -p</code>, say "no" to the bug fix lines, say "yes" to the typo line, and commit: <code>docs: fix typo in auth</code>. Then you stage the rest and commit: <code>fix(auth): handle null session</code>.
                </p>
              </>
            )
          },
          {
            label: "git commit",
            content: (
              <>
                <p className="body-text">
                  A commit is a permanent snapshot. The message attached to it is the only documentation your team has 6 months from now when trying to figure out why a line of code exists.
                </p>
                <p className="body-text">
                  Most modern engineering teams enforce <strong>Conventional Commits</strong>, a strict formatting standard that allows tools to auto-generate changelogs and semver bumps.
                </p>
                <CodeBlock language="bash" code={`# The Conventional Commits standard:
<type>(<optional scope>): <short description>

[optional body explaining WHY]

[optional footer: Closes #123]`} />
                <CommandTable rows={[
                  { flag: 'feat', effect: 'A new feature. Correlates to a MINOR release in SemVer.' },
                  { flag: 'fix', effect: 'A bug fix. Correlates to a PATCH release in SemVer.' },
                  { flag: 'chore', effect: 'Updating dependencies, tooling, build scripts. No production code changed.' },
                  { flag: 'refactor', effect: 'Changing code structure without adding features or fixing bugs.' },
                  { flag: 'git commit --amend', effect: 'Folds the currently staged changes into the PREVIOUS commit, and allows you to edit the message. ONLY use this if the commit has not been pushed.' }
                ]} />
              </>
            )
          },
          {
            label: "git push",
            content: (
              <>
                <p className="body-text">
                  Uploads local commits to a remote repository. The default behavior depends on the <code>push.default</code> config, but typically pushes the current branch to its tracking branch.
                </p>
                <CommandTable rows={[
                  { flag: 'git push -u origin main', effect: 'The -u (upstream) flag links your local branch to the remote branch. Required on the very first push of a new branch.' },
                  { flag: 'git push --force', effect: 'DESTRUCTIVE. Overwrites the remote history with your local history. If a teammate pushed code, it is deleted instantly.' },
                  { flag: 'git push --force-with-lease', effect: 'SAFE FORCE. Checks if the remote branch has changed since you last fetched. If a teammate pushed code, the push fails safely instead of destroying their work.' }
                ]} />
                <WarningBox type="warning" title="The Golden Rule of Pushing">
                  Never, ever use <code>--force</code> on a shared branch (like main or develop). If you must rewrite history on your own personal feature branch after a rebase, ALWAYS use <code>--force-with-lease</code>.
                </WarningBox>
              </>
            )
          },
          {
            label: "fetch vs pull",
            content: (
              <>
                <p className="body-text">
                  <code>git pull</code> is literally just two commands chained together: <code>git fetch</code> followed by <code>git merge</code>.
                </p>
                <ul className="body-text" style={{ paddingLeft: '20px' }}>
                  <li><strong>Fetch:</strong> Downloads the actual objects and updates your remote-tracking branches (e.g., <code>origin/main</code>). It touches nothing in your working directory. It is 100% safe to run at any time.</li>
                  <li><strong>Merge:</strong> Takes the fetched commits and attempts to integrate them into your current local branch. This can cause merge conflicts and alters your files.</li>
                </ul>
                <DeepDive title="The Rebase Pull">
                  <p>By default, <code>git pull</code> creates a messy "merge commit" every time someone else pushed to main before you did. To keep history linear, configure Git to rebase on pull:</p>
                  <CodeBlock language="bash" code={`git config --global pull.rebase true`} />
                  <p>Now, when you pull, Git fetches the remote commits, parks your local commits to the side, applies the remote commits to your branch, and then neatly replays your local commits on top.</p>
                </DeepDive>
              </>
            )
          }
        ]} />

        <div className="divider"></div>

        <h3 className="subsection-title">Interactive Staging Simulator</h3>
        <p className="body-text">
          Master the power of <code>git add -p</code>. Below is a simulation of the patch staging interface. You have a file with two distinct changes. Choose exactly what goes into the index.
        </p>

        <InteractivePatchStaging />

      </section>
    </div>
  );
}
