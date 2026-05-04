import React, { useState, useRef } from 'react';
import CodeBlock from '../components/ui/CodeBlock';
import DeepDive from '../components/ui/DeepDive';
import Callout from '../components/ui/Callout';
import WarningBox from '../components/ui/WarningBox';
import Tabs from '../components/ui/Tabs';

// ─── Section wrapper with dark-arts aesthetic ─────────────────────────────────
function DarkSection({ num, id, icon, title, subtitle, children }) {
  return (
    <div id={id} style={{ marginBottom: '72px', scrollMarginTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '10px', flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(124,106,247,0.2), rgba(168,85,247,0.1))',
          border: '1px solid rgba(124,106,247,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px',
        }}>{icon}</div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '4px' }}>
            Dark Art #{num}
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'var(--text)', margin: '0 0 4px', letterSpacing: '-0.5px' }}>{title}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text3)', margin: 0, fontFamily: 'var(--font-mono)' }}>{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── 1. COMMIT DATE REWRITER ──────────────────────────────────────────────────
function CommitDateRewriter() {
  const [target, setTarget]       = useState('last');   // last | nth | sha
  const [nthNum, setNthNum]       = useState(5);
  const [sha, setSha]             = useState('a3f2c91');
  const [authorDate, setAuthorDate] = useState('2025-01-15T09:00:00');
  const [committerDate, setCommitterDate] = useState('2025-01-15T09:00:00');
  const [linkDates, setLinkDates] = useState(true);
  const [os, setOs]               = useState('unix');   // unix | windows
  const [approxMode, setApproxMode] = useState(false);
  const [approxText, setApproxText] = useState('last tuesday noon');

  const dateVal = approxMode ? approxText : authorDate;
  const cdVal   = approxMode ? approxText : (linkDates ? authorDate : committerDate);

  const unixCmd = target === 'last'
    ? `export GIT_AUTHOR_DATE="${dateVal}"\nexport GIT_COMMITTER_DATE="${cdVal}"\ngit commit --amend --no-edit --date "$GIT_AUTHOR_DATE"`
    : target === 'nth'
    ? `# Step 1: Start interactive rebase for last ${nthNum} commits\ngit rebase -i HEAD~${nthNum}\n# In the editor: change 'pick' → 'edit' on the target commit\n\n# Step 2: When Git pauses at that commit:\nexport GIT_AUTHOR_DATE="${dateVal}"\nexport GIT_COMMITTER_DATE="${cdVal}"\ngit commit --amend --no-edit --date "$GIT_AUTHOR_DATE"\n\n# Step 3: Continue rebase\ngit rebase --continue`
    : `# Step 1: Find the commit's position relative to HEAD\ngit log --oneline | grep ${sha}\n\n# Step 2: Interactive rebase to that commit\ngit rebase -i ${sha}^\n# Mark that commit as 'edit'\n\n# Step 3: Amend with new date\nexport GIT_AUTHOR_DATE="${dateVal}"\nexport GIT_COMMITTER_DATE="${cdVal}"\ngit commit --amend --no-edit --date "$GIT_AUTHOR_DATE"\n\ngit rebase --continue`;

  const winCmd = target === 'last'
    ? `$env:GIT_AUTHOR_DATE = "${dateVal}"\n$env:GIT_COMMITTER_DATE = "${cdVal}"\ngit commit --amend --no-edit --date $env:GIT_AUTHOR_DATE`
    : `# PowerShell — same rebase flow, different env syntax\ngit rebase -i HEAD~${target === 'nth' ? nthNum : sha + '^'}\n# Mark as 'edit'...\n\n$env:GIT_AUTHOR_DATE = "${dateVal}"\n$env:GIT_COMMITTER_DATE = "${cdVal}"\ngit commit --amend --no-edit --date $env:GIT_AUTHOR_DATE\ngit rebase --continue`;

  const finalCmd = os === 'unix' ? unixCmd : winCmd;

  const approxExamples = [
    'last tuesday noon', 'yesterday 11:59pm', '3 weeks ago', '6 months ago',
    'Jan 15 2025 9am', 'tea time', 'noon', 'midnight',
  ];

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg2)', marginBottom: '24px' }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>⏱ Commit Date Rewriter</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['unix', 'windows'].map(o => (
            <button key={o} onClick={() => setOs(o)} style={{
              padding: '4px 12px', fontSize: '11px', fontFamily: 'var(--font-mono)',
              background: os === o ? 'var(--accent)' : 'var(--surface2)',
              border: `1px solid ${os === o ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '4px', color: os === o ? '#fff' : 'var(--text2)', cursor: 'pointer',
            }}>{o === 'unix' ? 'macOS / Linux' : 'Windows (PowerShell)'}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left: config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Target commit */}
          <div>
            <label style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Which commit?</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { val: 'last', label: 'Last commit (HEAD)' },
                { val: 'nth',  label: `Go back N commits` },
                { val: 'sha',  label: 'Specific SHA' },
              ].map(opt => (
                <label key={opt.val} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: target === opt.val ? 'var(--text)' : 'var(--text2)' }}>
                  <input type="radio" checked={target === opt.val} onChange={() => setTarget(opt.val)}
                    style={{ accentColor: 'var(--accent)' }} />
                  {opt.label}
                  {opt.val === 'nth' && target === 'nth' && (
                    <input type="number" min={2} max={100} value={nthNum} onChange={e => setNthNum(e.target.value)}
                      style={{ width: '56px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 8px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '13px', outline: 'none' }} />
                  )}
                  {opt.val === 'sha' && target === 'sha' && (
                    <input value={sha} onChange={e => setSha(e.target.value)}
                      style={{ width: '100px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 8px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '12px', outline: 'none' }} />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Date mode */}
          <div>
            <label style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
              Date format
              <label style={{ marginLeft: '12px', fontWeight: 400, textTransform: 'none', letterSpacing: 0, cursor: 'pointer', color: approxMode ? 'var(--accent)' : 'var(--text3)' }}>
                <input type="checkbox" checked={approxMode} onChange={e => setApproxMode(e.target.checked)} style={{ accentColor: 'var(--accent)', marginRight: '4px' }} />
                use approxidate (human-readable)
              </label>
            </label>

            {approxMode ? (
              <div>
                <input value={approxText} onChange={e => setApproxText(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--accent)', borderRadius: '4px', padding: '8px 12px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '13px', outline: 'none' }} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {approxExamples.map(ex => (
                    <button key={ex} onClick={() => setApproxText(ex)} style={{
                      padding: '2px 8px', fontSize: '10px', fontFamily: 'var(--font-mono)',
                      background: approxText === ex ? 'var(--accent)' : 'var(--surface)',
                      border: `1px solid ${approxText === ex ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: '4px', color: approxText === ex ? '#fff' : 'var(--text3)', cursor: 'pointer',
                    }}>{ex}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--blue)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>GIT_AUTHOR_DATE (when you wrote it)</div>
                  <input type="datetime-local" value={authorDate}
                    onChange={e => { setAuthorDate(e.target.value); if (linkDates) setCommitterDate(e.target.value); }}
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '4px', padding: '6px 10px', color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '12px', outline: 'none', colorScheme: 'dark' }} />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text3)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={linkDates} onChange={e => setLinkDates(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
                  Link author + committer date (recommended)
                </label>
                {!linkDates && (
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--green)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>GIT_COMMITTER_DATE (when applied)</div>
                    <input type="datetime-local" value={committerDate} onChange={e => setCommitterDate(e.target.value)}
                      style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '4px', padding: '6px 10px', color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '12px', outline: 'none', colorScheme: 'dark' }} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: generated command */}
        <div>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Generated Command</div>
          <pre style={{
            fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.8,
            background: '#050508', border: '1px solid var(--border)', borderRadius: '6px',
            padding: '14px 16px', color: 'var(--green)', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            minHeight: '180px',
          }}>{finalCmd}</pre>
          <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
            ⚠ This rewrites the commit SHA. Use <span style={{ color: 'var(--red)' }}>--force-with-lease</span> if already pushed.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 3. SECRET REMOVAL DECISION TREE ─────────────────────────────────────────
function SecretRemovalFlow() {
  const [answers, setAnswers] = useState({});

  const answer = (q, a) => setAnswers(prev => {
    // Clear downstream answers when changing an earlier one
    const keys = Object.keys(prev);
    const newAnswers = { ...prev, [q]: a };
    return newAnswers;
  });
  const reset = () => setAnswers({});

  const Q = ({ id, question, opts }) => {
    if (Object.keys(answers).includes(id) === false && !shouldShow(id)) return null;
    if (!shouldShow(id)) return null;
    return (
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text)', marginBottom: '10px', fontWeight: 600 }}>{question}</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {opts.map(opt => (
            <button key={opt} onClick={() => answer(id, opt)} style={{
              padding: '6px 16px', fontSize: '12px', fontFamily: 'var(--font-mono)',
              background: answers[id] === opt ? 'var(--accent)' : 'var(--surface)',
              border: `1px solid ${answers[id] === opt ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '6px', color: answers[id] === opt ? '#fff' : 'var(--text2)', cursor: 'pointer',
            }}>{opt}</button>
          ))}
        </div>
      </div>
    );
  };

  const shouldShow = (id) => {
    if (id === 'q1') return true;
    if (id === 'q2') return !!answers.q1;
    if (id === 'q3') return !!answers.q2;
    return false;
  };

  const showResult = answers.q1 && answers.q2 && answers.q3;

  const getResult = () => {
    const { q1, q2, q3 } = answers;
    if (q1 === 'Yes — already pushed') {
      return {
        urgency: 'critical',
        steps: [
          { icon: '🚨', title: 'FIRST: Revoke the secret NOW', cmd: '# Before touching Git, go to your provider and:\n# GitHub: Settings → Developer Settings → Regenerate token\n# AWS: IAM → Security Credentials → Delete key\n# Stripe: Dashboard → API Keys → Roll key\n# The old credential is compromised regardless of what you do next.' },
          { icon: '🧹', title: q3 === 'Single file' ? 'Remove file from all history' : 'Replace text in all commits', cmd: q3 === 'Single file'
            ? `pip install git-filter-repo\ngit filter-repo --path .env --invert-paths\n# or: git filter-repo --path secrets/config.json --invert-paths`
            : `# Create a file listing the secrets to replace:\necho "ghp_actualToken123abc" > secrets-to-remove.txt\necho "AKIAIOSFODNN7EXAMPLE" >> secrets-to-remove.txt\n\ngit filter-repo --replace-text secrets-to-remove.txt\n# Replaces each match with "***REMOVED***" in every commit`
          },
          { icon: '🗑', title: 'Purge all local references', cmd: `git reflog expire --expire=now --all\ngit gc --prune=now --aggressive` },
          { icon: '⬆', title: 'Force push + notify team', cmd: `git push --force-with-lease\n\n# Team members MUST re-clone:\n# git clone <repo>  ← fresh clone, not pull` },
        ],
      };
    }
    if (q1 === 'No — not pushed yet') {
      return {
        urgency: 'safe',
        steps: [
          { icon: '↩', title: q2 === 'Last commit' ? 'Unstage and amend' : 'Reset to before the commit', cmd: q2 === 'Last commit'
            ? `# Remove the file from staging and amend:\ngit rm --cached .env\necho ".env" >> .gitignore\ngit add .gitignore\ngit commit --amend --no-edit`
            : `# Find the commit just before the secret was added:\ngit log --oneline\n\n# Reset to that commit (keeps your changes as unstaged)\ngit reset HEAD~${q3 === 'Multiple commits ago' ? 'N' : '1'}\n\n# Now add .gitignore, recommit cleanly\necho ".env" >> .gitignore\ngit add .gitignore\ngit commit -m "chore: add .env to gitignore"`
          },
          { icon: '✅', title: 'Verify it\'s gone', cmd: `# Make sure the secret is not in the new history:\ngit log -p --all | grep -i "your_secret_here"` },
        ],
      };
    }
    return null;
  };

  const result = showResult ? getResult() : null;

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg2)', marginBottom: '24px' }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>🚨 Secret Removal Decision Tree</span>
        {Object.keys(answers).length > 0 && (
          <button className="btn" style={{ fontSize: '11px', padding: '4px 10px' }} onClick={reset}>Start over</button>
        )}
      </div>
      <div style={{ padding: '20px' }}>
        <Q id="q1" question="Was the commit with the secret already pushed to a remote?" opts={['Yes — already pushed', 'No — not pushed yet']} />
        {answers.q1 && <Q id="q2" question={answers.q1 === 'Yes — already pushed' ? 'How sensitive is the secret?' : 'How far back is the commit?'} opts={answers.q1 === 'Yes — already pushed' ? ['Mildly sensitive (can rotate)', 'Highly sensitive (prod credentials)'] : ['Last commit', 'A few commits ago', 'Multiple commits ago']} />}
        {answers.q2 && <Q id="q3" question="What kind of secret?" opts={['Single file (.env, config)', 'Text pattern (token in source code)']} />}

        {result && (
          <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <div style={{
              padding: '8px 14px', marginBottom: '16px', borderRadius: '6px', fontSize: '12px', fontFamily: 'var(--font-mono)',
              background: result.urgency === 'critical' ? 'rgba(248,113,113,0.1)' : 'rgba(34,211,160,0.1)',
              border: `1px solid ${result.urgency === 'critical' ? 'var(--red)' : 'var(--green)'}`,
              color: result.urgency === 'critical' ? 'var(--red)' : 'var(--green)',
            }}>
              {result.urgency === 'critical' ? '⚠ CRITICAL PATH — follow these steps in exact order' : '✓ SAFE PATH — not pushed, easier to fix'}
            </div>
            {result.steps.map((s, i) => (
              <div key={i} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>{i + 1}</div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>{s.icon} {s.title}</span>
                </div>
                <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.7, background: '#050508', border: '1px solid var(--border)', borderRadius: '6px', padding: '12px 14px', color: 'var(--green)', margin: '0 0 0 34px', whiteSpace: 'pre-wrap' }}>{s.cmd}</pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 5. WORKTREE VISUALIZER ───────────────────────────────────────────────────
function WorktreeVisualizer() {
  const [phase, setPhase] = useState(0); // 0=normal, 1=hotfix added, 2=hotfix done

  const phases = [
    { label: 'Normal state', desc: 'One repo, one working directory. You\'re mid-feature. A hotfix drops.' },
    { label: 'Worktree added', desc: 'git worktree add creates a second folder linked to the same .git/. Both work simultaneously.' },
    { label: 'Hotfix done', desc: 'Hotfix merged, worktree removed. Your feature directory is unchanged.' },
  ];

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg2)', marginBottom: '24px' }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>🌲 Worktree Filesystem Diagram</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {phases.map((p, i) => (
            <button key={i} onClick={() => setPhase(i)} style={{
              padding: '4px 12px', fontSize: '11px', fontFamily: 'var(--font-mono)',
              background: phase === i ? 'var(--accent)' : 'var(--surface2)',
              border: `1px solid ${phase === i ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '4px', color: phase === i ? '#fff' : 'var(--text2)', cursor: 'pointer',
            }}>{p.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Filesystem tree */}
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Filesystem</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 2, background: '#050508', borderRadius: '6px', border: '1px solid var(--border)', padding: '14px 16px' }}>
            <div style={{ color: 'var(--text2)' }}>~/projects/</div>
            <div style={{ color: phase === 2 ? 'var(--text2)' : 'var(--blue)', marginLeft: '16px', fontWeight: phase <= 1 ? 700 : 400 }}>
              {phase === 2 ? '└─' : '├─'} my-app/  {phase === 0 && <span style={{ color: 'var(--accent)', fontSize: '10px' }}>← your only working dir</span>}
              {phase === 1 && <span style={{ color: 'var(--blue)', fontSize: '10px' }}>← feature branch, untouched</span>}
              {phase === 2 && <span style={{ color: 'var(--green)', fontSize: '10px' }}>← still exactly as you left it</span>}
            </div>
            <div style={{ color: 'var(--text3)', marginLeft: '32px' }}>├─ .git/  <span style={{ color: 'var(--text3)', fontSize: '10px' }}>← shared between ALL worktrees</span></div>
            <div style={{ color: 'var(--text3)', marginLeft: '32px' }}>├─ src/</div>
            <div style={{ color: 'var(--text3)', marginLeft: '32px' }}>└─ package.json</div>

            {phase === 1 && (
              <>
                <div style={{ color: 'var(--green)', marginLeft: '16px', fontWeight: 700 }}>└─ .worktrees/  <span style={{ color: 'var(--green)', fontSize: '10px' }}>← git worktree add created this</span></div>
                <div style={{ color: 'var(--green)', marginLeft: '32px' }}>└─ hotfix/  <span style={{ color: 'var(--green)', fontSize: '10px' }}>← checked out: fix/critical-bug</span></div>
                <div style={{ color: 'var(--text3)', marginLeft: '48px' }}>├─ .git  <span style={{ color: 'var(--text3)', fontSize: '10px' }}>← file (not folder) → points to shared .git</span></div>
                <div style={{ color: 'var(--text3)', marginLeft: '48px' }}>├─ src/</div>
                <div style={{ color: 'var(--text3)', marginLeft: '48px' }}>└─ package.json</div>
              </>
            )}
            {phase === 2 && (
              <div style={{ color: 'var(--text3)', marginLeft: '16px', textDecoration: 'line-through', opacity: 0.4 }}>└─ .worktrees/  ← removed</div>
            )}
          </div>
        </div>

        {/* Commands for this phase */}
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Commands</div>
          <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.8, background: '#050508', borderRadius: '6px', border: '1px solid var(--border)', padding: '14px 16px', color: 'var(--green)', margin: 0, whiteSpace: 'pre-wrap', minHeight: '180px' }}>
            {phase === 0 && `# You're here, mid-feature:\ngit status\n# On branch feature/new-dashboard\n# Changes not staged for commit...\n\n# Hotfix drops. Old you would:\n# git stash → checkout main → fix\n# → checkout feature → git stash pop\n# → pray nothing conflicts`}
            {phase === 1 && `# Create the worktree:\ngit worktree add \\\n  .worktrees/hotfix \\\n  -b fix/critical-bug \\\n  origin/main\n\n# cd in and fix the bug:\ncd .worktrees/hotfix\nvim src/payment.js\ngit add -A\ngit commit -m "fix: prevent double charge"\ngit push origin fix/critical-bug\n\n# Your feature dir? Untouched.`}
            {phase === 2 && `# Hotfix merged. Clean up:\ngit worktree remove .worktrees/hotfix\n\n# Back to your feature:\ncd ~/projects/my-app\ngit status\n# Exactly where you left off.\n# No stash pop. No conflicts.\n# No lost work.\n\n# List remaining worktrees:\ngit worktree list`}
          </pre>
        </div>
      </div>

      <div style={{ padding: '12px 20px', background: 'var(--surface)', borderTop: '1px solid var(--border)', fontSize: '12px', color: 'var(--text2)' }}>
        {phases[phase].desc}
      </div>
    </div>
  );
}

// ─── 10. ENV VAR TABLE ────────────────────────────────────────────────────────
function EnvVarTable() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const vars = [
    { name: 'GIT_AUTHOR_DATE',        cat: 'identity', color: 'var(--blue)',   desc: 'When the code was originally written. Displayed in git log as "Date:". Affects commit SHA.' },
    { name: 'GIT_COMMITTER_DATE',     cat: 'identity', color: 'var(--blue)',   desc: 'When the commit was applied to the repo. Used by --since/--until filters. Usually same as AUTHOR_DATE.' },
    { name: 'GIT_AUTHOR_NAME',        cat: 'identity', color: 'var(--blue)',   desc: 'Override the committer name for one commit. Does not affect git config permanently.' },
    { name: 'GIT_AUTHOR_EMAIL',       cat: 'identity', color: 'var(--blue)',   desc: 'Override the author email. Useful when committing from CI or a different machine.' },
    { name: 'GIT_COMMITTER_NAME',     cat: 'identity', color: 'var(--blue)',   desc: 'Override who applied the commit (can differ from author in patch workflows).' },
    { name: 'GIT_COMMITTER_EMAIL',    cat: 'identity', color: 'var(--blue)',   desc: 'Override committer email independently of author email.' },
    { name: 'GIT_SSH_COMMAND',        cat: 'transport', color: 'var(--green)', desc: 'Override the SSH binary and flags. e.g. GIT_SSH_COMMAND="ssh -i ~/.ssh/deploy_key" git clone ...' },
    { name: 'GIT_TRACE',              cat: 'debug',    color: 'var(--yellow)', desc: 'Set to 1 or a file path. Prints every git command and subcommand executed internally. Essential for debugging.' },
    { name: 'GIT_TRACE_PACK_ACCESS',  cat: 'debug',    color: 'var(--yellow)', desc: 'Logs every packfile access — useful when debugging slow clone or fetch performance.' },
    { name: 'GIT_CURL_VERBOSE',       cat: 'debug',    color: 'var(--yellow)', desc: 'Set to 1 to log all HTTP transport. Shows headers, redirects, auth challenges.' },
    { name: 'GIT_EDITOR',             cat: 'ui',       color: 'var(--accent)', desc: 'Override $EDITOR for this Git session only. e.g. GIT_EDITOR=nano git commit' },
    { name: 'GIT_PAGER',              cat: 'ui',       color: 'var(--accent)', desc: 'Override $PAGER. Set to cat to disable paging: GIT_PAGER=cat git log' },
    { name: 'GIT_DIR',                cat: 'paths',    color: 'var(--orange)', desc: 'Override the .git folder location. Useful for bare repos or non-standard layouts.' },
    { name: 'GIT_WORK_TREE',          cat: 'paths',    color: 'var(--orange)', desc: 'Override the working directory. Can point Git at a different folder than the one containing .git.' },
    { name: 'GIT_CEILING_DIRECTORIES', cat: 'paths',   color: 'var(--orange)', desc: 'Colon-separated list of paths Git should not walk above. Stops "not a git repo" errors in shared filesystems.' },
    { name: 'GIT_TERMINAL_PROMPT',    cat: 'ui',       color: 'var(--accent)', desc: 'Set to 0 to prevent Git from prompting for credentials. Essential in CI environments.' },
    { name: 'GIT_ASKPASS',            cat: 'transport', color: 'var(--green)', desc: 'Program Git calls to ask for passwords. Used by GUI tools to intercept credential prompts.' },
    { name: 'GIT_MERGE_VERBOSITY',    cat: 'debug',    color: 'var(--yellow)', desc: '0-5. Controls how verbose the merge output is. 5 shows every file considered.' },
  ];

  const cats = ['all', 'identity', 'transport', 'debug', 'ui', 'paths'];
  const catColors = { identity: 'var(--blue)', transport: 'var(--green)', debug: 'var(--yellow)', ui: 'var(--accent)', paths: 'var(--orange)' };

  const filtered = vars.filter(v =>
    (filter === 'all' || v.cat === filter) &&
    (v.name.toLowerCase().includes(search.toLowerCase()) || v.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg2)', marginBottom: '24px' }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search env vars..."
          style={{ flex: 1, minWidth: '160px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 12px', color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '13px', outline: 'none' }} />
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: '4px 10px', fontSize: '11px', fontFamily: 'var(--font-mono)',
              background: filter === c ? (catColors[c] || 'var(--accent)') : 'var(--surface2)',
              border: `1px solid ${filter === c ? (catColors[c] || 'var(--accent)') : 'var(--border)'}`,
              borderRadius: '4px', color: filter === c ? '#fff' : 'var(--text2)', cursor: 'pointer',
            }}>{c}</button>
          ))}
        </div>
      </div>
      <div>
        {filtered.map((v, i) => (
          <div key={v.name} style={{
            display: 'grid', gridTemplateColumns: '280px 1fr',
            borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
            background: 'var(--bg2)',
          }}>
            <div style={{ padding: '12px 16px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px' }}>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: v.color }}>{v.name}</code>
              <span style={{ fontSize: '10px', color: catColors[v.cat], background: catColors[v.cat] + '18', padding: '1px 6px', borderRadius: '3px', width: 'fit-content', fontFamily: 'var(--font-mono)' }}>{v.cat}</span>
            </div>
            <div style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text2)', lineHeight: 1.6, display: 'flex', alignItems: 'center' }}>{v.desc}</div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>No matches</div>
        )}
      </div>
    </div>
  );
}

// ─── Table of contents (sticky sidebar alternative) ───────────────────────────
function TocBar() {
  const items = [
    { id: 'time-travel',   icon: '⏱', label: 'Commit Dates' },
    { id: 'identity',      icon: '👤', label: 'Author/Email' },
    { id: 'secrets',       icon: '🚨', label: 'Nuke Secrets' },
    { id: 'assume',        icon: '👁', label: 'Invisible Files' },
    { id: 'worktree',      icon: '🌲', label: 'Worktrees' },
    { id: 'fixup',         icon: '🔧', label: 'Fixup & Autosquash' },
    { id: 'forensics',     icon: '🔍', label: 'Log Forensics' },
    { id: 'bundle',        icon: '📦', label: 'Git Bundle' },
    { id: 'notes',         icon: '📝', label: 'Git Notes' },
    { id: 'env',           icon: '⚙', label: 'Env Vars' },
  ];
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '0 0 48px', padding: '16px', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', width: '100%', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Jump to</span>
      {items.map(item => (
        <a key={item.id} href={`#${item.id}`} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '5px 12px', fontSize: '12px', fontFamily: 'var(--font-mono)',
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: '20px', color: 'var(--text2)', textDecoration: 'none',
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; }}
        >
          {item.icon} {item.label}
        </a>
      ))}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function GitDarkArts() {
  return (
    <div className="page-content">
      <section className="section">

        {/* Hero */}
        <div className="section-header-wrap" style={{ marginBottom: '32px' }}>
          <div className="section-bg-num">⚗</div>
          <div className="section-label">Power Commands</div>
          <h2 className="section-title">Git Dark Arts</h2>
          <p className="section-desc">
            The commands most developers never discover. Time travel, identity rewrites,
            secret purging, parallel branches, forensic log mining — Git can do all of it.
            This page is a reference you'll come back to.
          </p>
        </div>

        <WarningBox type="warning" title="History rewriting changes commit SHAs">
          Every technique on this page that rewrites history produces new commit objects with new SHA hashes.
          If commits were already pushed to a shared branch, teammates' local branches will diverge.
          Always coordinate with your team before rewriting pushed history.
          On personal/solo repos: do whatever you want.
        </WarningBox>

        <TocBar />

        {/* ─── Section 1: Time Travel ─── */}
        <DarkSection num="01" id="time-travel" icon="⏱" title="Time Travel: Rewriting Commit Dates"
          subtitle="GIT_AUTHOR_DATE · GIT_COMMITTER_DATE · git commit --amend --date">
          <p className="body-text">
            Every Git commit stores <strong>two independent timestamps</strong>.
            Most developers don't know they're different things:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            {[
              { name: 'GIT_AUTHOR_DATE', color: 'var(--blue)', icon: '✏', desc: 'When the code was originally written. This is what git log shows as "Date:". It\'s the human-meaningful timestamp — when the work happened.' },
              { name: 'GIT_COMMITTER_DATE', color: 'var(--green)', icon: '✅', desc: 'When the commit was applied to the repository. Usually identical to author date, but differs during cherry-pick, rebase, or patch application.' },
            ].map(t => (
              <div key={t.name} style={{ padding: '14px 16px', background: 'var(--surface)', borderLeft: `3px solid ${t.color}`, borderRadius: '0 6px 6px 0' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: t.color, marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>{t.icon} {t.name}</div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text2)', lineHeight: 1.6 }}>{t.desc}</p>
              </div>
            ))}
          </div>
          <p className="body-text">
            Git's date parser (<code>approxidate</code>) is remarkably human-friendly —
            it understands natural language like <code>"last tuesday noon"</code>, <code>"3 weeks ago"</code>, and <code>"tea time"</code>.
            Use the builder below to generate the exact command for your scenario:
          </p>
          <CommitDateRewriter />
          <DeepDive title="Why amending a date changes the SHA">
            <p>A commit's SHA-1 is computed from its content — which includes the author date, committer date, parent SHA, tree SHA, and message. Change any of these fields and you get a completely new commit object with a new SHA. This is why rebasing (which replays commits) produces new SHAs even for commits whose code didn't change.</p>
            <CodeBlock language="bash" code={`# Inspect both timestamps on any commit:
git show --format="%ai (author)%n%ci (committer)" HEAD

# Verify the dates changed after amend:
git log --format="%h %ai %s" -5`} />
          </DeepDive>
        </DarkSection>

        {/* ─── Section 2: Identity ─── */}
        <DarkSection num="02" id="identity" icon="👤" title="Identity Rewriting: Author & Email"
          subtitle="git commit --amend --author · git filter-repo · .mailmap">
          <p className="body-text">
            The most common trigger: you committed to a personal repo from your work laptop,
            and now your work email is in the history. There are three tools — pick based on scope:
          </p>
          <Tabs tabs={[
            {
              label: 'Last commit only',
              content: (
                <>
                  <p className="body-text">The simplest case — just amend the most recent commit's author metadata:</p>
                  <CodeBlock language="bash" code={`# Override name + email in one go:
git commit --amend --no-edit \\
  --author="Puneet Singh <puneet@personal.com>"

# Or set via env vars (affects committer too):
GIT_AUTHOR_NAME="Puneet Singh" \\
GIT_AUTHOR_EMAIL="puneet@personal.com" \\
git commit --amend --no-edit`} />
                </>
              )
            },
            {
              label: 'Entire repo history',
              content: (
                <>
                  <p className="body-text"><code>git filter-repo</code> is the modern, Git-team-endorsed replacement for the deprecated <code>filter-branch</code>. Install it once, use it forever:</p>
                  <CodeBlock language="bash" code={`pip install git-filter-repo

# Change all commits from old email to new email:
git filter-repo --email-callback '
  return email if email != b"work@company.com" \\
         else b"puneet@personal.com"
'

# Change both name AND email:
git filter-repo --commit-callback '
  if commit.author_email == b"work@company.com":
      commit.author_name  = b"Puneet Singh"
      commit.author_email = b"puneet@personal.com"
      commit.committer_name  = b"Puneet Singh"
      commit.committer_email = b"puneet@personal.com"
'

# After: force push required
git push --force-with-lease`} />
                </>
              )
            },
            {
              label: '.mailmap (no rewrite)',
              content: (
                <>
                  <p className="body-text">If you want to fix display names without rewriting any history, <code>.mailmap</code> tells Git (and GitHub) to show a different name/email in logs and contributor lists:</p>
                  <CodeBlock language="bash" code={`# .mailmap file in repo root:
# Format: Correct Name <correct@email.com> <old@email.com>

Puneet Singh <puneet@personal.com> <work@company.com>
Puneet Singh <puneet@personal.com> Puneet <oldnick@gmail.com>

# Commit this file:
git add .mailmap
git commit -m "chore: add mailmap for author correction"

# Now git log shows corrected names:
git log --use-mailmap --format="%an <%ae>"`} />
                  <Callout type="warn">
                    <strong>.mailmap changes display only.</strong> GitHub's contribution graph reads the real email in commit objects — not mailmap. To change ownership of commits for contribution purposes, you must use filter-repo.
                  </Callout>
                </>
              )
            },
          ]} />
        </DarkSection>

        {/* ─── Section 3: Secrets ─── */}
        <DarkSection num="03" id="secrets" icon="🚨" title="Nuking Secrets From History"
          subtitle="git filter-repo --replace-text · BFG Repo Cleaner · reflog expire">
          <p className="body-text">
            You committed an API key. Maybe 6 commits ago. Maybe a month ago. Maybe already pushed.
            The decision tree below gives you the exact steps based on your situation —
            but read this first:
          </p>
          <WarningBox type="warning" title="Revoke before you rewrite">
            Rewriting history does not invalidate the secret. Anyone who cloned or forked your repo
            before the rewrite may still have it. The moment you discover an exposed secret,
            your first action is to <strong>revoke and rotate it</strong> with the provider —
            not to fix Git. Fix Git second.
          </WarningBox>
          <SecretRemovalFlow />
          <DeepDive title="Why 'just deleting the file' doesn't work">
            <p>Git stores every commit as a permanent, content-addressed snapshot. Adding a new commit that deletes <code>.env</code> removes the file from the working directory — but it remains fully readable in the history. Anyone can run:</p>
            <CodeBlock language="bash" code={`git show HEAD~3:.env     # prints the old .env
git log -p -- .env       # shows every version of .env ever committed`} />
            <p style={{ marginTop: '12px' }}>This is why filter-repo (or BFG) must rewrite every commit object in the chain. After the rewrite, all the old object SHAs no longer exist — but only after you also expire the reflog and run gc to actually delete them from disk.</p>
          </DeepDive>
        </DarkSection>

        {/* ─── Section 4: Invisible Files ─── */}
        <DarkSection num="04" id="assume" icon="👁" title="The Invisible File Trick"
          subtitle="git update-index --assume-unchanged · --skip-worktree">
          <p className="body-text">
            You need a local config file that Git must never commit — but you also can't put it in
            <code>.gitignore</code> because the file is already tracked. This is where
            <code>update-index</code> saves you.
          </p>
          <CodeBlock language="bash" code={`# Tell Git: "stop watching this file for changes"
git update-index --assume-unchanged config/local.json

# Now git status won't show it as modified, even if you edit it
# Commit it? Nope. Git ignores your changes entirely.

# Undo when you actually want to stage a real change:
git update-index --no-assume-unchanged config/local.json

# See which files are currently assume-unchanged:
git ls-files -v | grep '^h'
# 'h' prefix = assume-unchanged, 'H' = normal`} />

          <DeepDive title="--assume-unchanged vs --skip-worktree: the actual difference">
            <p>They look identical but behave differently in one critical scenario:</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '16px 0' }}>
              {[
                { flag: '--assume-unchanged', color: 'var(--yellow)', desc: 'Hint to Git: "I promise this won\'t change." Git may still overwrite your local file during git reset --hard, git checkout, or git pull. Use for performance optimization on large files you don\'t edit.' },
                { flag: '--skip-worktree',    color: 'var(--green)',  desc: 'Tells Git: "Keep this out of commits but don\'t touch my local version." Survives git reset --hard. This is the right flag for local config overrides. Git will not overwrite your local file.' },
              ].map(f => (
                <div key={f.flag} style={{ padding: '14px', background: 'var(--surface)', borderLeft: `3px solid ${f.color}`, borderRadius: '0 6px 6px 0' }}>
                  <code style={{ fontSize: '12px', color: f.color, fontFamily: 'var(--font-mono)' }}>{f.flag}</code>
                  <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--text2)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
            <CodeBlock language="bash" code={`# For local config files → use skip-worktree:
git update-index --skip-worktree .env.local
git update-index --skip-worktree config/database.yml

# List skip-worktree files:
git ls-files -v | grep '^S'`} />
          </DeepDive>
        </DarkSection>

        {/* ─── Section 5: Worktrees ─── */}
        <DarkSection num="05" id="worktree" icon="🌲" title="Worktrees: Two Branches Simultaneously"
          subtitle="git worktree add · list · remove · bare repo pattern">
          <p className="body-text">
            <code>git stash → checkout → fix → checkout → stash pop</code> is fragile.
            Worktrees give you a completely separate working directory for a second branch —
            no stashing, no context loss, same <code>.git/</code> database shared between both.
          </p>
          <WorktreeVisualizer />
          <CodeBlock language="bash" code={`# Full worktree workflow:
# 1. Create the worktree:
git worktree add .worktrees/hotfix -b fix/critical-bug origin/main

# 2. Work in it independently:
cd .worktrees/hotfix && vim src/payment.js
git commit -am "fix: prevent double charge"
git push origin fix/critical-bug

# 3. List all active worktrees:
git worktree list
# /home/you/project        abc1234 [feature/dashboard]
# /home/you/.worktrees/hotfix  def5678 [fix/critical-bug]

# 4. Clean up:
git worktree remove .worktrees/hotfix`} />
          <DeepDive title="Pro pattern: bare repo + worktrees only">
            <p>The most ergonomic setup for heavy worktree users: clone bare so there's no "main" working directory taking up a branch slot.</p>
            <CodeBlock language="bash" code={`# Clone as bare (no working tree):
git clone --bare git@github.com:you/repo.git .bare
cd .bare

# Add worktrees for each branch you're working on:
git worktree add ../main main
git worktree add ../feature/auth feature/auth
git worktree add ../hotfix/payment -b fix/payment origin/main

# Structure:
# .bare/          ← the git database (no working files)
# main/           ← worktree for main branch
# feature/auth/   ← worktree for auth branch
# hotfix/payment/ ← worktree for hotfix`} />
          </DeepDive>
        </DarkSection>

        {/* ─── Section 6: Fixup & Autosquash ─── */}
        <DarkSection num="06" id="fixup" icon="🔧" title="--fixup & --autosquash: Rebase on Autopilot"
          subtitle="git commit --fixup · git commit --squash · git rebase --autosquash">
          <p className="body-text">
            You made a commit, then realised you forgot something that belongs in it.
            The manual way: interactive rebase, find the commit, mark it <code>edit</code>,
            amend, continue. The smart way: <code>--fixup</code>.
          </p>
          <CodeBlock language="bash" code={`# You have this history:
# a3f2c91 feat: add user authentication
# b4d3e92 fix: null check in session
# c5e4f03 feat: add dashboard   ← HEAD

# You forgot to add rate limiting to 'feat: add user authentication'
# Edit the file...
git add src/auth/rateLimit.js

# Tag it as a fixup for that specific commit:
git commit --fixup a3f2c91
# Creates: "fixup! feat: add user authentication"

# Now clean up — Git pre-sorts and marks everything automatically:
git rebase -i --autosquash HEAD~4
# The fixup commit appears directly below its target
# and is already marked 'fixup' — just save and quit`} />
          <Callout type="tip">
            <strong>Make autosquash the default:</strong> Add <code>rebase.autosquash = true</code> to your global gitconfig and you never need the flag again.
          </Callout>
          <CodeBlock language="bash" code={`# Set it globally:
git config --global rebase.autosquash true

# --squash is like --fixup but keeps the commit message
# for editing (instead of silently dropping it):
git commit --squash a3f2c91

# Auto-generate a fixup for the last commit:
git commit --fixup HEAD`} />
        </DarkSection>

        {/* ─── Section 7: Forensics ─── */}
        <DarkSection num="07" id="forensics" icon="🔍" title="git log Forensics Mode"
          subtitle="git log -S · -L · --all --full-history · git blame -C -C">
          <p className="body-text">
            <code>git log --oneline</code> is for beginners. These flags turn git log into
            a crime scene investigation tool. The pickaxe flag alone is worth the price of this section.
          </p>
          <Tabs tabs={[
            {
              label: '-S (The Pickaxe)',
              content: (
                <>
                  <p className="body-text">Find every commit that added or removed a specific string from the codebase. Indispensable for "when was this API key introduced?" or "who deleted that function?"</p>
                  <CodeBlock language="bash" code={`# Find when a string was introduced or removed:
git log -S "STRIPE_SECRET_KEY" --all --source --oneline

# Use a regex instead of literal string:
git log -G "api_key.*prod" --all --oneline

# Show the actual diff for each match:
git log -S "calculateTotal" -p

# Narrow to a specific file:
git log -S "calculateTotal" -- src/cart.js`} />
                </>
              )
            },
            {
              label: '-L (Function History)',
              content: (
                <>
                  <p className="body-text">Track the complete history of a specific function or line range — across renames, refactors, and moves. This is the "how did this function get here?" command:</p>
                  <CodeBlock language="bash" code={`# Full history of a function by name:
git log -L :calculateTotal:src/cart.js

# By line range:
git log -L 45,72:src/cart.js

# Works across renames too — add --follow:
git log -L :authenticate:src/auth.js --follow

# Combine with -p to see the diff at each change:
git log -L :calculateTotal:src/cart.js -p`} />
                </>
              )
            },
            {
              label: 'Find Deleted Files',
              content: (
                <>
                  <p className="body-text">Someone deleted a file and you need it back — or just need to know who deleted it and when:</p>
                  <CodeBlock language="bash" code={`# Find the commit that deleted a file:
git log --all --full-history -- "src/utils/oldHelper.js"

# Restore the file from just before deletion:
git checkout <deleting-commit>^ -- src/utils/oldHelper.js

# Find a file you don't remember the exact path of:
git log --all --full-history -- "**/oldHelper*"

# See what was in a deleted file at a specific commit:
git show <commit>:src/utils/oldHelper.js`} />
                </>
              )
            },
            {
              label: 'blame -C (Copy Detection)',
              content: (
                <>
                  <p className="body-text">Standard <code>git blame</code> shows who last touched each line. But what if the code was <em>copied</em> from another file? <code>-C</code> detects that:</p>
                  <CodeBlock language="bash" code={`# Standard blame:
git blame src/auth.js

# Detect code moved/copied within the same commit:
git blame -C src/auth.js

# Detect across commits too:
git blame -C -C src/auth.js

# Detect across any commit in history (slow but thorough):
git blame -C -C -C src/auth.js

# Custom output format:
git blame --format="%h %an %ad %s" src/auth.js`} />
                </>
              )
            },
            {
              label: 'Pretty Formats',
              content: (
                <>
                  <p className="body-text">Stop reading raw log output. Build the exact view you need:</p>
                  <CodeBlock language="bash" code={`# Human-readable, colorized one-liner:
git log --format="%C(yellow)%h%Creset %C(blue)%an%Creset %s %C(green)(%cr)%Creset"

# Add this as an alias:
git config --global alias.lg "log --format='%C(yellow)%h%Creset %C(blue)%an%Creset %s %C(green)(%cr)%Creset'"

# Show commits by a specific author in date range:
git log --author="Puneet" --since="2 weeks ago" --oneline

# Show commits that touched BOTH files:
git log -- src/auth.js src/session.js

# Show the actual files changed per commit:
git log --stat --oneline

# Log with graph and all branches:
git log --oneline --graph --all --decorate`} />
                </>
              )
            },
          ]} />
        </DarkSection>

        {/* ─── Section 8: Bundle ─── */}
        <DarkSection num="08" id="bundle" icon="📦" title="git bundle: Git Without a Server"
          subtitle="Transfer a complete repo as a single binary file — email, USB, air-gap">
          <p className="body-text">
            A bundle is a single binary file that contains some or all of a Git repository.
            You can email it, put it on a USB drive, or transfer it over any channel.
            No server, no internet, no GitHub required.
          </p>
          <CodeBlock language="bash" code={`# Bundle the entire repo (all branches, all tags):
git bundle create repo.bundle --all

# Bundle just the last 10 commits on main (smaller file):
git bundle create patch.bundle main~10..main

# Bundle everything since a specific tag:
git bundle create since-v1.bundle v1.0.0..HEAD

# ─── On the receiving end: ───────────────────────────────────

# Clone directly from a bundle:
git clone repo.bundle my-project -b main

# Or add it as a remote and fetch:
git remote add offline ./repo.bundle
git fetch offline
git merge offline/main

# Verify a bundle's contents before cloning:
git bundle verify repo.bundle
git bundle list-heads repo.bundle`} />
          <Callout type="tip">
            <strong>Perfect for:</strong> Distributing repos to clients without GitHub access,
            working in air-gapped environments, sending a repo snapshot via Slack/email,
            or onboarding someone on a plane.
          </Callout>
        </DarkSection>

        {/* ─── Section 9: Notes ─── */}
        <DarkSection num="09" id="notes" icon="📝" title="git notes: Metadata Without Rewriting"
          subtitle="Attach deployment records, review notes, and CI results to commits without changing their SHA">
          <p className="body-text">
            <code>git notes</code> lets you attach arbitrary text to any commit without
            altering the commit object itself. The SHA stays the same.
            Notes are stored in a separate ref (<code>refs/notes/commits</code>) and are
            not pushed or fetched by default.
          </p>
          <CodeBlock language="bash" code={`# Add a note to the last commit:
git notes add -m "Deployed to prod: 2025-01-15 09:32 UTC — passed smoke tests"

# Add to a specific commit:
git notes add -m "Reviewed by: Sarah. Approved." a3f2c91

# View notes in log:
git log --show-notes

# Edit an existing note:
git notes edit HEAD

# ─── Notes are NOT pushed by default ──────────────────────
# Push notes explicitly:
git push origin refs/notes/commits

# Fetch notes from remote:
git fetch origin refs/notes/commits:refs/notes/commits

# ─── Use cases in CI/CD ───────────────────────────────────
# In your CI pipeline, attach the build result to the commit:
git notes add -m "CI: passed. Build #1234. Coverage: 87%" $GITHUB_SHA
git push origin refs/notes/commits`} />
          <DeepDive title="Custom note namespaces">
            <p>Notes are namespaced. By default they go to <code>refs/notes/commits</code>, but you can have separate namespaces for different tools:</p>
            <CodeBlock language="bash" code={`# Write to a custom namespace:
git notes --ref=deployments add -m "prod deploy: v1.2.3" HEAD
git notes --ref=reviews add -m "LGTM — @sarah" HEAD

# Fetch a specific namespace:
git fetch origin refs/notes/deployments:refs/notes/deployments

# Show notes from a specific namespace:
git log --show-notes=deployments`} />
          </DeepDive>
        </DarkSection>

        {/* ─── Section 10: Env Vars ─── */}
        <DarkSection num="10" id="env" icon="⚙" title="GIT_* Environment Variables"
          subtitle="The complete reference — identity, transport, debug, paths, UI">
          <p className="body-text">
            Git reads environment variables before any config file.
            Most developers know 2 or 3. Here's the full list that matters:
          </p>
          <EnvVarTable />
          <CodeBlock language="bash" code={`# Practical examples:

# Disable all prompts in CI (avoid hanging):
GIT_TERMINAL_PROMPT=0 git clone $REPO_URL

# Use a specific SSH key for one command:
GIT_SSH_COMMAND="ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no" \\
  git push origin main

# Debug why a git operation is slow:
GIT_TRACE=1 GIT_TRACE_PACK_ACCESS=1 git fetch origin

# Run git log without paging (pipe-friendly):
GIT_PAGER=cat git log --oneline -20

# Commit as a different person for one commit:
GIT_AUTHOR_NAME="Bot" GIT_AUTHOR_EMAIL="bot@ci.com" \\
  git commit -m "chore: auto-format"`} />
        </DarkSection>

      </section>
    </div>
  );
}