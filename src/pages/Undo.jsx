import React from 'react';
import UndoDecisionTree from '../components/UndoDecisionTree';
import ResetModeVisualizer from '../components/ResetModeVisualizer';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import DeepDive from '../components/ui/DeepDive';

export default function Undo() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-header-wrap">
          <div className="section-bg-num">09</div>
          <div className="section-label">Mastery</div>
          <h2 className="section-title">Undoing Things</h2>
          <p className="section-desc">
            "I messed up, how do I fix this?" is the most common Git question. Choose the wrong command and you either lose work or break your team's history.
          </p>
        </div>

        <h3 className="subsection-title">The Undo Decision Framework</h3>
        <p className="body-text">
          Ask yourself these questions in order before typing any command:
        </p>

        <ul style={{ paddingLeft: '20px', marginBottom: '24px', lineHeight: 1.6, color: 'var(--text2)' }}>
          <li><strong>Have these commits been pushed to a shared branch?</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
              <li>YES → Use <code>git revert</code> (safe for shared history)</li>
              <li>NO → You can use <code>reset</code>, <code>amend</code>, or <code>rebase -i</code></li>
            </ul>
          </li>
          <li style={{ marginTop: '12px' }}><strong>Do you want to keep the changes as files?</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
              <li>Keep changes staged → <code>git reset --soft</code></li>
              <li>Keep changes unstaged → <code>git reset --mixed</code> (default)</li>
              <li>Discard changes entirely → <code>git reset --hard</code> (⚠️ destructive)</li>
            </ul>
          </li>
        </ul>

        <div className="divider"></div>

        <h3 className="subsection-title">git revert: The Safe Undo</h3>
        <p className="body-text">
          Creates a <em>new commit</em> that is the exact inverse of the target commit. The original commit stays in history. The new revert commit cancels out its effect.
        </p>
        <CodeBlock language="bash" code="# Revert the most recent commit\ngit revert HEAD\n\n# Revert a specific past commit\ngit revert a3f2c91" />

        <div className="divider"></div>

        <h3 className="subsection-title">git reset: Rewrite Local History</h3>
        <p className="body-text">
          Moves the current branch pointer to a different commit. Depending on the mode, it also affects the staging area and working directory.
        </p>

        <ResetModeVisualizer />

        <div className="divider"></div>

        <h3 className="subsection-title">git restore: Discard Uncommitted Changes</h3>
        <p className="body-text">
          Introduced in Git 2.23, <code>git restore</code> is specifically for manipulating files in your working directory and staging area, without moving the branch pointer.
        </p>

        <CodeBlock language="bash" code="# Discard unstaged changes in a file (revert to last committed state)\ngit restore src/auth.js\n\n# Unstage a file (move from staging back to working directory)\ngit restore --staged src/auth.js" />

        <Callout type="warn">
          <code>git restore src/file.js</code> (without --staged) permanently discards your working directory changes. There is NO undo for this.
        </Callout>

        <div className="divider"></div>

        <h3 className="subsection-title">The Undo Decision Tree</h3>
        <p className="body-text">
          Follow the flowchart below based on what state your files are in to find the exact command you need to bail yourself out.
        </p>

        <UndoDecisionTree />

      </section>
    </div>
  );
}
