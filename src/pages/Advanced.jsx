import React from 'react';
import StashStack from '../components/StashStack';
import BisectGame from '../components/BisectGame';
import CodeBlock from '../components/ui/CodeBlock';
import DeepDive from '../components/ui/DeepDive';
import Tabs from '../components/ui/Tabs';
import CommandTable from '../components/ui/CommandTable';
import WarningBox from '../components/ui/WarningBox';

export default function Advanced() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-header-wrap">
          <div className="section-bg-num">08</div>
          <div className="section-label">Mastery</div>
          <h2 className="section-title">Advanced Git Tools</h2>
          <p className="section-desc">
            Powerful utilities for complex state manipulation: managing the stash stack, performing binary searches through history, and blaming lines of code.
          </p>
        </div>

        <Tabs tabs={[
          {
            label: "git stash (The Stack)",
            content: (
              <>
                <p className="body-text">
                  The stash is a Last-In-First-Out (LIFO) stack for temporary work. When you are halfway through a feature and suddenly need to switch branches to fix a critical bug, you don't want to commit broken, half-finished code. Instead, you push it to the stash.
                </p>
                <CommandTable rows={[
                  { flag: 'git stash push -m "wip: login"', effect: 'Takes your uncommitted changes (both staged and unstaged), saves them to the stash stack, and returns your working directory to a clean state matching HEAD.' },
                  { flag: 'git stash list', effect: 'Shows all stashes. e.g., stash@{0}: wip: login, stash@{1}: test config.' },
                  { flag: 'git stash pop', effect: 'Takes the most recent stash (stash@{0}), applies it to your current working directory, AND drops it from the stash stack.' },
                  { flag: 'git stash apply stash@{1}', effect: 'Applies a specific stash to your working directory, but KEEPS it in the stash stack (does not drop it).' },
                  { flag: 'git stash drop stash@{1}', effect: 'Permanently deletes a specific stash.' }
                ]} />
                <p className="body-text">
                  <strong>Advanced Stashing:</strong> By default, <code>git stash</code> does NOT stash newly created, untracked files. If you added a new file <code>utils.js</code>, it will be left behind in the working directory. To stash untracked files, use <code>git stash push -u</code> (include untracked).
                </p>
              </>
            )
          },
          {
            label: "git bisect (Binary Search)",
            content: (
              <>
                <p className="body-text">
                  <code>git bisect</code> is the ultimate debugging tool. Imagine your CI pipeline catches a bug, but the last time the tests were run was 200 commits ago. Finding which of the 200 commits introduced the bug manually would take hours.
                </p>
                <p className="body-text">
                  Bisect performs a binary search. You tell it a "bad" commit (where the bug exists) and a "good" commit (an older commit where the app worked). Git checks out a commit exactly in the middle. You test it, and tell Git if it's "good" or "bad". Git cuts the remaining commits in half. It finds the culprit in <code>log2(N)</code> steps (finding a bug in 1,000 commits takes only ~10 tests).
                </p>
                <DeepDive title="Automated Bisect (The Holy Grail)">
                  <p>Testing manually is slow. If you can write a script (like a unit test) that exits with code 0 (success) or code 1 (failure), Git can run the entire bisect process completely automatically while you get a coffee.</p>
                  <CodeBlock language="bash" code={`git bisect start
git bisect bad HEAD
git bisect good v1.0.0

# Tell Git to run this command on every hop automatically
git bisect run npm run test:auth`} />
                  <p>Git will rapidly hop through history, run the test, process the exit code, and eventually output: <code>a1b2c3d is the first bad commit</code>.</p>
                </DeepDive>
              </>
            )
          },
          {
            label: "git blame",
            content: (
              <>
                <p className="body-text">
                  <code>git blame</code> annotates every line in a file with the hash, author, and timestamp of the commit that last modified that line.
                </p>
                <p className="body-text">
                  It is primarily used for "software archaeology." When you find a bizarre block of code that seems entirely wrong, you don't just delete it. You <code>git blame</code> it, find the commit hash, run <code>git show &lt;hash&gt;</code>, and read the commit message to understand <em>why</em> the original author wrote it that way.
                </p>
                <CommandTable rows={[
                  { flag: 'git blame src/auth.js', effect: 'Basic annotation of every line.' },
                  { flag: 'git blame -w src/auth.js', effect: 'Crucial: Ignores whitespace. If someone ran a code formatter (Prettier) on the file, the basic blame will say they "wrote" the whole file. The -w flag ignores purely whitespace changes, showing you the author of the actual logic.' },
                  { flag: 'git blame -L 10,20 src/auth.js', effect: 'Restrict the blame to lines 10 through 20.' }
                ]} />
              </>
            )
          }
        ]} />

        <div className="divider"></div>

        <h3 className="subsection-title">The Stash Stack Simulator</h3>
        <p className="body-text">
          Visualize the LIFO (Last-In-First-Out) nature of the stash. Add work to your directory, push it to the stash stack, and pop it off.
        </p>

        <StashStack />

        <div className="divider"></div>

        <h3 className="subsection-title">The Bisect Game</h3>
        <p className="body-text">
          A bug was introduced somewhere in the last 16 commits. You have 4 moves to find it using binary search. Git checks out the midpoint commit, and you provide the feedback.
        </p>

        <BisectGame />

      </section>
    </div>
  );
}
