import React from 'react';
import ConflictResolver from '../components/ConflictResolver';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import DeepDive from '../components/ui/DeepDive';
import Tabs from '../components/ui/Tabs';
import WarningBox from '../components/ui/WarningBox';

export default function Conflicts() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-header-wrap">
          <div className="section-bg-num">07</div>
          <div className="section-label">Collaboration</div>
          <h2 className="section-title">Merge Conflicts</h2>
          <p className="section-desc">
            Conflicts are not errors. They are Git safely halting an operation because human intuition is required to combine diverging code.
          </p>
        </div>

        <Tabs tabs={[
          {
            label: "The Mechanics",
            content: (
              <>
                <p className="body-text">
                  Git is exceptionally smart at auto-merging files. If Developer A edits the top of `utils.js` and Developer B edits the bottom of `utils.js`, Git will auto-merge them seamlessly.
                </p>
                <p className="body-text">
                  A conflict ONLY occurs when:
                </p>
                <ul className="body-text" style={{ paddingLeft: '20px' }}>
                  <li>Both developers edited the exact same lines in the same file.</li>
                  <li>Developer A deleted a file, while Developer B modified that same file.</li>
                </ul>
                <p className="body-text">
                  When this happens, Git pauses the merge, marks the file as "Unmerged" in the index, and injects <strong>Conflict Markers</strong> directly into the source code of the file on disk.
                </p>
                <CodeBlock language="javascript" code={`function fetchUser(id) {
<<<<<<< HEAD
  // Your current branch (where you are merging INTO)
  return db.query('SELECT * FROM users WHERE id = ?', id);
=======
  // The incoming branch (what you are merging)
  return await orm.user.findById(id);
>>>>>>> feature/async-orm
}`} />
                <p className="body-text">
                  The application is entirely broken at this state. The JavaScript engine cannot parse <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code>. You must open the file, manually delete the markers, and construct a block of code that satisfies both requirements.
                </p>
              </>
            )
          },
          {
            label: "Diff3 Style (Advanced)",
            content: (
              <>
                <p className="body-text">
                  By default, Git shows you "Your Code" vs "Their Code". But sometimes that isn't enough context. Why did they write "Their Code"? What was the original code before either of you touched it?
                </p>
                <p className="body-text">
                  You can configure Git to use the <code>diff3</code> conflict style, which injects a third section: the common ancestor.
                </p>
                <CodeBlock language="bash" code={`git config --global merge.conflictstyle diff3`} />
                <p className="body-text">Now your conflicts look like this:</p>
                <CodeBlock language="javascript" code={`<<<<<<< HEAD
  return db.query('SELECT * FROM users WHERE id = ?', id);
||||||| merged common ancestors
  return db.query(id);
=======
  return await orm.user.findById(id);
>>>>>>> feature/async-orm`} />
                <p className="body-text">
                  With `diff3`, you can clearly see that the original code was <code>db.query(id)</code>. You added the SQL string, and they migrated to an ORM. Now you know the correct resolution is to ensure the ORM query uses the correct ID mapping.
                </p>
              </>
            )
          },
          {
            label: "git rerere",
            content: (
              <>
                <h4 style={{ color: 'var(--blue)', marginBottom: '8px' }}>Reuse Recorded Resolution</h4>
                <p className="body-text">
                  If you maintain a long-running feature branch that frequently rebases against a heavily active `main` branch, you might find yourself solving the exact same merge conflict over and over again.
                </p>
                <p className="body-text">
                  <code>git rerere</code> is a hidden Git feature that remembers how you solved a conflict. If it ever sees that exact same conflict again, it solves it for you automatically.
                </p>
                <CodeBlock language="bash" code={`# Enable it globally
git config --global rerere.enabled true`} />
                <p className="body-text">
                  Once enabled, during a conflict you will see Git output: <code>Recorded preimage for 'src/utils.js'</code>. Once you fix it and commit, it outputs: <code>Recorded resolution for 'src/utils.js'</code>. The next time you rebase, Git will say: <code>Resolved 'src/utils.js' using previous resolution.</code>
                </p>
              </>
            )
          }
        ]} />

        <div className="divider"></div>

        <h3 className="subsection-title">Resolution Sandbox</h3>
        <p className="body-text">
          Below is a raw conflict marker output. Your task is to resolve it into valid, runnable JavaScript without losing the intent of either branch.
        </p>

        <ConflictResolver />

      </section>
    </div>
  );
}
