import React from 'react';
import GitFolderExplorer from '../components/GitFolderExplorer';
import CatFileSimulator from '../components/CatFileSimulator';
import CodeBlock from '../components/ui/CodeBlock';
import DeepDive from '../components/ui/DeepDive';
import Tabs from '../components/ui/Tabs';
import WarningBox from '../components/ui/WarningBox';

export default function Internals() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-header-wrap">
          <div className="section-bg-num">04</div>
          <div className="section-label">Fundamentals</div>
          <h2 className="section-title">Git Internals</h2>
          <p className="section-desc">
            The ultimate masterclass. We open the `.git` folder and look at the raw C-structs, hexadecimal hashes, and compressed blobs that power the entire system.
          </p>
        </div>

        <Tabs tabs={[
          {
            label: "The Object Database",
            content: (
              <>
                <p className="body-text">
                  Git is, at its core, a <strong>content-addressable filesystem</strong>. This means you do not retrieve files by their name or location, but by a cryptographic hash of their contents.
                </p>
                <p className="body-text">
                  Everything Git stores is placed in the <code>.git/objects/</code> directory. Every object is named with a 40-character SHA-1 hash. The first 2 characters are used as a directory name, and the remaining 38 characters are the filename. This is a performance optimization for file systems that struggle with thousands of files in a single directory.
                </p>
                <CodeBlock language="bash" code={`# A look inside .git/objects
.git/objects/
├── 2a/
│   └── f489b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8
├── 5c/
│   └── 39e1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8
└── info/
└── pack/`} />
              </>
            )
          },
          {
            label: "The 4 Object Types",
            content: (
              <>
                <p className="body-text">
                  There are only four types of objects in Git. If you understand these four, you understand 90% of the architecture.
                </p>
                <ul className="body-text" style={{ paddingLeft: '20px' }}>
                  <li><strong>Blob (Binary Large Object):</strong> Stores the raw content of a file. It does <em>not</em> store the filename, permissions, or timestamps. Just the bytes of the file.</li>
                  <li><strong>Tree:</strong> Represents a directory. It contains a list of pointers to Blobs (files) and other Trees (subdirectories), along with their filenames and access permissions.</li>
                  <li><strong>Commit:</strong> Points to a single Tree (the root directory of your project at that moment in time), along with metadata: parent commit hashes, author info, and the commit message.</li>
                  <li><strong>Tag:</strong> An annotated tag is a separate object that points to a commit, carrying its own message, date, and optionally a GPG signature.</li>
                </ul>
              </>
            )
          },
          {
            label: "Compression & Packfiles",
            content: (
              <>
                <p className="body-text">
                  Every loose object in <code>.git/objects</code> is compressed using <strong>zlib</strong>. You cannot simply <code>cat</code> an object file; it will look like binary garbage. You must use Git's plumbing commands (like <code>git cat-file</code>) to read them.
                </p>
                <p className="body-text">
                  <strong>The Packfile Optimization:</strong><br/>
                  If Git stored a full copy of every file for every commit, the repository would become massive. Git solves this through Garbage Collection (<code>git gc</code>).
                </p>
                <p className="body-text">
                  Periodically, Git takes all the loose objects, finds files that are similar (e.g., v1 and v2 of <code>app.js</code>), and calculates the <em>delta</em> (the exact byte differences) between them. It packs them all into a single binary <code>.pack</code> file, storing only the latest version fully, and storing the historical versions as reverse-deltas.
                </p>
              </>
            )
          }
        ]} />

        <div className="divider"></div>

        <h3 className="subsection-title">Exploring the .git Directory</h3>
        <p className="body-text">
          Use the file explorer below to physically navigate a mock <code>.git</code> folder. Pay attention to how branches in <code>refs/heads</code> are just text files containing commit hashes.
        </p>

        <GitFolderExplorer />

        <div className="divider"></div>

        <h3 className="subsection-title">Plumbing Commands</h3>
        <p className="body-text">
          Commands like <code>git status</code> and <code>git commit</code> are called <strong>Porcelain</strong> — they are user-friendly interfaces. Under the hood, they run <strong>Plumbing</strong> commands. Let's act like a machine and run plumbing commands directly.
        </p>

        <DeepDive title="Parsing a Commit Object">
          <p>If we use <code>git cat-file -p HEAD</code> to pretty-print the current commit, we see the raw internal structure:</p>
          <CodeBlock language="bash" code={`$ git cat-file -p HEAD
tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904
parent a3f2c91d4e8b7f1c2d3e4f5a6b7c8d9e0f1a2b3c
author Linus Torvalds <torvalds@linux-foundation.org> 1112911993 -0700
committer Linus Torvalds <torvalds@linux-foundation.org> 1112911993 -0700

Initial revision of "git", the information manager from hell`} />
          <p>
            Notice the <code>tree</code> pointer. That points to a Tree object representing the root directory. If we <code>cat-file</code> that tree hash, we get the directory listing:
          </p>
          <CodeBlock language="bash" code={`$ git cat-file -p 4b825dc
100644 blob e69de29bb2d1d6434b8b29ae775ad8c2e48c5391    README.md
040000 tree 81c4e782e5192135686001a1e4a2c5a089d81d24    src`} />
        </DeepDive>

        <WarningBox type="info" title="Why Commits Can't Be Altered">
          <p>
            Because the commit hash is a SHA-1 generated from the <strong>contents</strong> of the commit object (which includes the Parent hash, the Tree hash, the timestamp, and the message), changing <em>anything</em> in the past changes the commit's hash. 
          </p>
          <p>
            Since the child commit references the parent's hash, changing the parent invalidates the child. You must rewrite the child's hash too. This cascading effect makes Git cryptographically tamper-proof.
          </p>
        </WarningBox>

        <h3 className="subsection-title">Interactive Object Inspector</h3>
        <p className="body-text">
          Simulate the <code>git cat-file</code> plumbing command. Inspect the internal Git objects to see how Trees point to Blobs, and Commits point to Trees.
        </p>

        <CatFileSimulator />

      </section>
    </div>
  );
}
