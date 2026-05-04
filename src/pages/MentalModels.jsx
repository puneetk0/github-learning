import React from 'react';
import DetachedHeadExplorer from '../components/DetachedHeadExplorer';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import DeepDive from '../components/ui/DeepDive';
import Tabs from '../components/ui/Tabs';
import WarningBox from '../components/ui/WarningBox';

export default function MentalModels() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-header-wrap">
          <div className="section-bg-num">03</div>
          <div className="section-label">Fundamentals</div>
          <h2 className="section-title">Core Mental Models</h2>
          <p className="section-desc">
            Stop trying to memorize commands. Once you understand the Directed Acyclic Graph (DAG) and the Three Trees, every command becomes mathematically predictable.
          </p>
        </div>

        <Tabs tabs={[
          {
            label: "The Three Trees",
            content: (
              <>
                <p className="body-text">
                  Git operates by orchestrating data between three distinct state areas (often called "trees", though they aren't all technically trees). Understanding how data moves between them is the secret to mastering Git.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ padding: '16px', background: 'var(--surface)', borderLeft: '4px solid var(--orange)' }}>
                    <h4 style={{ color: 'var(--orange)', marginBottom: '8px' }}>1. The Working Directory</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--text2)' }}>The actual files on your hard drive right now. This is the sandbox. Files here are "untracked" or "modified." Git knows about changes here but has not recorded them anywhere.</p>
                  </div>
                  <div style={{ padding: '16px', background: 'var(--surface)', borderLeft: '4px solid var(--blue)' }}>
                    <h4 style={{ color: 'var(--blue)', marginBottom: '8px' }}>2. The Index (Staging Area)</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--text2)' }}>A binary file (`.git/index`) representing the exact state of what your <em>next</em> commit will look like. When you run <code>git add</code>, you are copying data from the Working Directory into the Index.</p>
                  </div>
                  <div style={{ padding: '16px', background: 'var(--surface)', borderLeft: '4px solid var(--green)' }}>
                    <h4 style={{ color: 'var(--green)', marginBottom: '8px' }}>3. The HEAD (Local Repository)</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--text2)' }}>The immutable database of history (`.git/objects/`). When you run <code>git commit</code>, Git takes exactly what is in the Index, compresses it into a permanent snapshot, and advances the HEAD pointer to it.</p>
                  </div>
                </div>
              </>
            )
          },
          {
            label: "Snapshots, Not Diffs",
            content: (
              <>
                <p className="body-text">
                  <strong>The most dangerous misconception in Git:</strong> Developers think Git stores "diffs" (e.g., "Commit B is Commit A plus these 5 lines").
                </p>
                <p className="body-text">
                  <strong>Git does NOT store diffs. Git stores full snapshots.</strong>
                </p>
                <p className="body-text">
                  Every single commit is a complete, 100% snapshot of your entire project directory at that exact microsecond. If your project has 10,000 files and you modify 1 file, the new commit points to the 1 new file, and maintains pointers to the 9,999 exact same files from the previous commit.
                </p>
                <p className="body-text">
                  Because files are identified by their SHA-1 hash, if a file hasn't changed, its hash hasn't changed, and Git simply reuses the existing object in the database. This deduplication is why Git is incredibly fast and space-efficient despite storing "full snapshots."
                </p>
              </>
            )
          },
          {
            label: "The DAG",
            content: (
              <>
                <p className="body-text">
                  Git history is a <strong>Directed Acyclic Graph (DAG)</strong>.
                </p>
                <ul className="body-text" style={{ paddingLeft: '20px' }}>
                  <li><strong>Graph:</strong> A network of nodes (commits) connected by edges (parent pointers).</li>
                  <li><strong>Directed:</strong> Pointers only go one way — backwards in time. A commit knows its parent, but a parent does not know its children (because the parent was created first and is immutable).</li>
                  <li><strong>Acyclic:</strong> It is impossible to create a loop. You cannot have a commit that is an ancestor of itself.</li>
                </ul>
                <p className="body-text">
                  Because it is a DAG, calculating history, finding common ancestors for merges, and doing binary searches (bisect) are mathematically trivial and lightning fast.
                </p>
              </>
            )
          }
        ]} />

        <div className="divider"></div>

        <h3 className="subsection-title">Branches Are Just Pointers</h3>
        <p className="body-text">
          In older systems (like SVN), creating a branch meant physically duplicating the codebase on the server. It was a heavyweight operation.
        </p>
        <p className="body-text">
          In Git, a branch is literally just a 41-byte text file containing a commit hash. Creating a branch is free. It happens instantly. It consumes zero memory.
        </p>

        <CodeBlock language="bash" code={`# Let's look at the actual branch file on disk:
cat .git/refs/heads/main

# Output:
# a3f2c91d4e8b7f1c2d3e4f5a6b7c8d9e0f1a2b3c`} />

        <p className="body-text">
          When you make a new commit on <code>main</code>, Git creates the commit object, and then simply overwrites the text in <code>.git/refs/heads/main</code> with the new hash. That's it. That's a branch moving forward.
        </p>

        <div className="divider"></div>

        <h3 className="subsection-title">The HEAD Pointer</h3>
        <p className="body-text">
          If branches are pointers to commits, what points to the branches? <strong>HEAD</strong>.
        </p>
        <p className="body-text">
          HEAD is a special file that tells Git where you are right now. It is a pointer to a pointer.
        </p>

        <DeepDive title="Reading the HEAD">
          <CodeBlock language="bash" code={`cat .git/HEAD
# Output: ref: refs/heads/main`} />
          <p>
            When you run <code>git commit</code>, Git looks at HEAD to know which branch to update. It sees <code>main</code>, creates the commit, updates <code>main</code> to the new hash, and HEAD remains pointing to <code>main</code>.
          </p>
        </DeepDive>

        <WarningBox type="warning" title="Detached HEAD State">
          <p>
            If you run <code>git checkout a3f2c91</code> (checking out a raw commit hash instead of a branch name), Git updates the HEAD file to contain the raw hash, rather than a branch reference.
          </p>
          <CodeBlock language="bash" code={`cat .git/HEAD
# Output: a3f2c91d4e8b7f1c2d3e4f5a6b7c8d9e0f1a2b3c`} />
          <p>
            You are now in <strong>Detached HEAD</strong>. You can look around, run code, and even make new commits. However, because HEAD is not pointing to a branch, when you eventually switch back to <code>main</code>, nothing will be pointing to your new commits. They will be orphaned and eventually garbage collected.
          </p>
        </WarningBox>

        <DetachedHeadExplorer />

      </section>
    </div>
  );
}
