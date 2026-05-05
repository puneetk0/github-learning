import React, { useState, useEffect, useRef } from 'react';
import CodeBlock from '../components/ui/CodeBlock';
import DeepDive from '../components/ui/DeepDive';
import Callout from '../components/ui/Callout';
import WarningBox from '../components/ui/WarningBox';
import Tabs from '../components/ui/Tabs';

// ─── Shared: Section wrapper ──────────────────────────────────────────────────
function RealSection({ num, id, icon, title, subtitle, tag, children }) {
  const tagColors = {
    daily: 'var(--green)', emergency: 'var(--red)', teamwork: 'var(--blue)',
    hygiene: 'var(--accent)', recovery: 'var(--orange)',
  };
  return (
    <div id={id} style={{ marginBottom: '80px', scrollMarginTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '28px' }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '12px', flexShrink: 0,
          background: 'var(--surface)', border: '1px solid var(--border2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
        }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '3px' }}>
              Scenario {num}
            </span>
            {tag && (
              <span style={{
                fontSize: '10px', fontFamily: 'var(--font-mono)', padding: '2px 8px',
                borderRadius: '4px', color: tagColors[tag],
                background: tagColors[tag] + '18', border: `1px solid ${tagColors[tag]}44`,
              }}>{tag}</span>
            )}
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--text)', margin: '0 0 4px', letterSpacing: '-0.5px' }}>{title}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text3)', margin: 0, fontFamily: 'var(--font-mono)' }}>{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── Shared: Commit graph node ────────────────────────────────────────────────
function CommitNode({ x, y, label, sublabel, color = 'var(--blue)', size = 14, faded = false }) {
  return (
    <g style={{ opacity: faded ? 0.3 : 1, transition: 'opacity 0.4s' }}>
      <circle cx={x} cy={y} r={size} fill="var(--bg)" stroke={color} strokeWidth="2.5" />
      <circle cx={x} cy={y} r={size * 0.35} fill={color} />
      {label && <text x={x} y={y - size - 6} textAnchor="middle" fill={color} fontSize="10" fontFamily="var(--font-mono)" fontWeight="700">{label}</text>}
      {sublabel && <text x={x} y={y + size + 14} textAnchor="middle" fill="var(--text3)" fontSize="9" fontFamily="var(--font-mono)">{sublabel}</text>}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color = 'var(--border2)', dashed = false }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2.5"
      strokeDasharray={dashed ? '5,3' : 'none'} strokeLinecap="round" />
  );
}

// ─── 1. PULL BEFORE PUSH SIMULATOR ───────────────────────────────────────────
function PullBeforePushSimulator() {
  const [choice, setChoice] = useState(null); // null | 'merge' | 'rebase' | 'force'

  const info = {
    merge: {
      color: 'var(--yellow)',
      title: 'git pull (merge)',
      verdict: '⚠ Works, but messy',
      desc: 'Git creates a merge commit M that joins your two commits with the remote commit. History is non-linear. Every teammate who pulls sees this ugly bubble. Do this 20 times and git log becomes unreadable.',
      cmd: 'git pull origin main\n# → Creates merge commit automatically',
    },
    rebase: {
      color: 'var(--green)',
      title: 'git pull --rebase',
      verdict: '✓ The right move',
      desc: 'Git fetches the remote commit, temporarily parks your commits, applies the remote commit, then replays your commits on top. History stays perfectly linear. Your commits get new SHAs but the code is identical.',
      cmd: 'git fetch origin\ngit rebase origin/main\n# or: git pull --rebase origin main',
    },
    force: {
      color: 'var(--red)',
      title: 'git push --force',
      verdict: '🚨 Destroys teammates\' work',
      desc: "You overwrote the remote with your version, discarding your teammate's commit. They'll see a mess when they pull next. Never force-push main. This is why --force-with-lease exists — it would have caught this.",
      cmd: 'git push --force\n# NEVER do this on a shared branch',
    },
  };

  const W = 580, H = 200;

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg2)', margin: '24px 0' }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
          The moment: your push got rejected. What now?
        </span>
      </div>

      {/* Starting state */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
          Current state — you and a teammate both branched from C1
        </div>
        <div style={{ overflowX: 'auto' }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
            <defs>
              <marker id="rw-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="var(--border2)" />
              </marker>
              <marker id="rw-arr-r" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="var(--red)" />
              </marker>
            </defs>

            {/* Base commit */}
            <CommitNode x={60} y={100} label="C1" sublabel="shared base" color="var(--text3)" />

            {/* Remote commit */}
            <Arrow x1={74} y1={100} x2={186} y2={60} color="var(--border2)" />
            <CommitNode x={200} y={60} label="C2" sublabel="teammate pushed" color="var(--blue)" />
            <rect x={168} y={20} width={64} height={18} rx="4" fill="rgba(96,165,250,0.15)" stroke="var(--blue)" strokeWidth="1" />
            <text x={200} y={33} textAnchor="middle" fill="var(--blue)" fontSize="9" fontFamily="var(--font-mono)">origin/main</text>

            {/* Your commits */}
            <Arrow x1={74} y1={100} x2={186} y2={140} color="var(--border2)" />
            <CommitNode x={200} y={140} label="A" sublabel="your commit 1" color="var(--accent)" />
            <Arrow x1={214} y1={140} x2={306} y2={140} color="var(--border2)" />
            <CommitNode x={320} y={140} label="B" sublabel="your commit 2" color="var(--accent)" />
            <rect x={288} y={158} width={64} height={18} rx="4" fill="rgba(124,106,247,0.15)" stroke="var(--accent)" strokeWidth="1" />
            <text x={320} y={171} textAnchor="middle" fill="var(--accent)" fontSize="9" fontFamily="var(--font-mono)">HEAD</text>

            {/* Result based on choice */}
            {choice === 'merge' && (
              <g>
                <Arrow x1={214} y1={60} x2={426} y2={100} color="var(--yellow)" />
                <Arrow x1={334} y1={140} x2={426} y2={100} color="var(--yellow)" />
                <CommitNode x={440} y={100} label="M" sublabel="merge commit 😬" color="var(--yellow)" />
                <text x={440} y={75} textAnchor="middle" fill="var(--yellow)" fontSize="9" fontFamily="var(--font-mono)">ugly but works</text>
              </g>
            )}
            {choice === 'rebase' && (
              <g>
                <Arrow x1={214} y1={60} x2={306} y2={60} color="var(--green)" />
                <CommitNode x={320} y={60} label="A'" sublabel="replayed" color="var(--green)" />
                <Arrow x1={334} y1={60} x2={426} y2={60} color="var(--green)" />
                <CommitNode x={440} y={60} label="B'" sublabel="replayed" color="var(--green)" />
                <text x={380} y={35} textAnchor="middle" fill="var(--green)" fontSize="9" fontFamily="var(--font-mono)">linear ✓</text>
                <CommitNode x={200} y={140} label="A" color="var(--accent)" faded={true} />
                <CommitNode x={320} y={140} label="B" color="var(--accent)" faded={true} />
              </g>
            )}
            {choice === 'force' && (
              <g>
                <line x1={180} y1={60} x2={240} y2={60} stroke="var(--red)" strokeWidth="3" strokeLinecap="round" />
                <line x1={180} y1={55} x2={240} y2={65} stroke="var(--red)" strokeWidth="3" strokeLinecap="round" />
                <text x={210} y={44} textAnchor="middle" fill="var(--red)" fontSize="9" fontFamily="var(--font-mono)">C2 GONE 🚨</text>
                <Arrow x1={334} y1={140} x2={426} y2={140} color="var(--red)" />
                <CommitNode x={440} y={140} label="B" sublabel="now on remote" color="var(--red)" />
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Choice buttons */}
      <div style={{ padding: '0 20px 20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {Object.entries(info).map(([key, v]) => (
          <button key={key} onClick={() => setChoice(key)} style={{
            flex: 1, minWidth: '140px', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
            background: choice === key ? v.color + '18' : 'var(--surface)',
            border: `2px solid ${choice === key ? v.color : 'var(--border)'}`,
            color: choice === key ? v.color : 'var(--text2)',
            fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: choice === key ? 700 : 400,
            transition: 'all 0.2s',
          }}>{v.title}</button>
        ))}
      </div>

      {/* Result panel */}
      {choice && (
        <div style={{
          margin: '0 16px 16px', padding: '16px', borderRadius: '8px',
          background: info[choice].color + '0d', border: `1px solid ${info[choice].color}44`,
        }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: info[choice].color, marginBottom: '8px' }}>
            {info[choice].verdict}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text2)', margin: '0 0 12px', lineHeight: 1.7 }}>{info[choice].desc}</p>
          <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: info[choice].color, background: 'var(--bg2)', padding: '10px 14px', borderRadius: '6px', margin: 0, lineHeight: 1.7 }}>{info[choice].cmd}</pre>
        </div>
      )}
    </div>
  );
}

// ─── 2. MORNING SYNC CHECKER ──────────────────────────────────────────────────
function MorningSyncChecker() {
  const [step, setStep] = useState(-1); // -1 = not started

  const steps = [
    {
      cmd: 'git fetch --all --prune',
      output: `Fetching origin
remote: Counting objects: 8, done.
From github.com:team/project
   a3f2c91..d4e5f67  main -> origin/main
 * [new branch]      feature/payments -> origin/feature/payments
 - [deleted]         (none)     -> origin/feature/old-branch (pruned)`,
      explain: 'Downloads all remote changes — touches NOTHING in your working directory. Safe to run anytime. The --prune flag deletes remote-tracking branches that no longer exist on the remote (like origin/feature/old-branch above — someone deleted it).',
      highlights: [
        { text: 'a3f2c91..d4e5f67  main', meaning: 'main moved forward while you were away' },
        { text: 'new branch', meaning: 'a teammate started a new branch' },
        { text: 'pruned', meaning: 'a branch was deleted remotely — cleaned up locally' },
      ],
    },
    {
      cmd: 'git log origin/main..HEAD',
      output: `commit b4d3e92 (HEAD -> feature/auth)
Author: You <you@email.com>
Date:   Yesterday

    feat(auth): add session timeout

commit a1c2d3e
Author: You <you@email.com>
Date:   Yesterday

    fix(auth): null check on login`,
      explain: '"Show me what I have locally that remote does NOT." These are your unpushed commits. If this is empty, you\'re fully pushed. If you see commits here, they need to eventually go up.',
      highlights: [
        { text: 'HEAD -> feature/auth', meaning: 'you\'re on your feature branch' },
        { text: 'feat(auth)', meaning: 'your unpushed work — 2 commits to push' },
      ],
    },
    {
      cmd: 'git log HEAD..origin/main',
      output: `commit d4e5f67 (origin/main)
Author: Teammate <them@email.com>
Date:   This morning

    feat(payments): add stripe webhook handler

commit c3d4e56
Author: Teammate <them@email.com>
Date:   Last night

    chore: update dependencies`,
      explain: '"Show me what remote has that I DON\'T." These are commits you need to pull. If you\'re on a feature branch, you\'ll want to rebase on top of these before you open a PR.',
      highlights: [
        { text: 'origin/main', meaning: 'these commits exist on remote but not locally' },
        { text: 'feat(payments)', meaning: 'teammate shipped while you were away — 2 commits to integrate' },
      ],
    },
    {
      cmd: 'git status',
      output: `On branch feature/auth
Your branch is ahead of 'origin/feature/auth' by 2 commits.
  (use "git push" to publish your local commits)

nothing to commit, working tree clean`,
      explain: 'Now you have the full picture: you\'re on feature/auth, 2 commits ahead of your own remote branch (need to push), and main has moved forward 2 commits (need to rebase before PR). Working tree is clean — safe to rebase.',
      highlights: [
        { text: 'ahead of \'origin/feature/auth\' by 2 commits', meaning: 'your 2 commits aren\'t on remote yet' },
        { text: 'working tree clean', meaning: 'no uncommitted changes — safe to rebase/merge now' },
      ],
    },
  ];

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg2)', margin: '24px 0' }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>🌅 The Morning Ritual — Step by Step</span>
        {step >= 0 && <button className="btn" style={{ fontSize: '11px', padding: '4px 10px' }} onClick={() => setStep(-1)}>Reset</button>}
      </div>

      {step === -1 ? (
        <div style={{ padding: '32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '20px' }}>You just opened your laptop. Before touching any code, run these 4 commands in order.</p>
          <button onClick={() => setStep(0)} style={{
            padding: '12px 28px', background: 'var(--accent)', color: '#fff', border: 'none',
            borderRadius: '8px', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
          }}>Start Morning Sync →</button>
        </div>
      ) : (
        <div>
          {/* Progress */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
            {steps.map((s, i) => (
              <button key={i} onClick={() => setStep(i)} style={{
                flex: 1, padding: '10px', border: 'none', borderBottom: `2px solid ${i === step ? 'var(--accent)' : 'transparent'}`,
                background: i === step ? 'var(--bg2)' : 'var(--surface)',
                color: i <= step ? (i === step ? 'var(--accent)' : 'var(--green)') : 'var(--text3)',
                fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer',
              }}>
                {i < step ? '✓ ' : `${i + 1}. `}{['fetch', 'log ahead', 'log behind', 'status'][i]}
              </button>
            ))}
          </div>

          <div style={{ padding: '20px' }}>
            {/* Command */}
            <div style={{ background: 'var(--bg2)', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              <span style={{ color: 'var(--text3)' }}>$ </span>
              <span style={{ color: 'var(--green)' }}>{steps[step].cmd}</span>
            </div>

            {/* Output */}
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text2)', background: 'var(--surface)', borderRadius: '6px', padding: '12px 16px', margin: '0 0 16px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {steps[step].output}
            </pre>

            {/* Explanation */}
            <div style={{ padding: '14px 16px', background: 'rgba(124,106,247,0.08)', border: '1px solid rgba(124,106,247,0.2)', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>What this tells you</div>
              <p style={{ fontSize: '13px', color: 'var(--text2)', margin: 0, lineHeight: 1.7 }}>{steps[step].explain}</p>
            </div>

            {/* Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
              {steps[step].highlights.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '12px' }}>
                  <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--yellow)', background: 'var(--surface)', padding: '2px 8px', borderRadius: '4px', flexShrink: 0, whiteSpace: 'nowrap' }}>{h.text}</code>
                  <span style={{ color: 'var(--text3)', lineHeight: 1.5 }}>→ {h.meaning}</span>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
              <button className="btn" style={{ fontSize: '12px' }} disabled={step === 0} onClick={() => setStep(s => s - 1)}>← Previous</button>
              {step < steps.length - 1
                ? <button className="btn" style={{ fontSize: '12px', borderColor: 'var(--accent)', color: 'var(--accent)' }} onClick={() => setStep(s => s + 1)}>Next command →</button>
                : <div style={{ fontSize: '12px', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '6px' }}>✓ Full picture. Now you can code safely.</div>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 3. WRONG BRANCH RECOVERY ─────────────────────────────────────────────────
function WrongBranchRecovery() {
  const [pushed, setPushed] = useState(null);
  const [pulled, setPulled] = useState(null);

  const reset = () => { setPushed(null); setPulled(null); };

  const results = {
    'no-na': {
      title: 'Easy fix — no one affected',
      color: 'var(--green)',
      steps: [
        { label: 'Save your work to a proper branch first', cmd: 'git branch feature/what-i-was-doing\n# Your commits now exist on this new branch' },
        { label: 'Reset main back to where it should be', cmd: 'git reset HEAD~1 --mixed\n# --mixed keeps your changes in working dir\n# --hard would delete them (only if already on new branch)' },
        { label: 'Verify you\'re clean', cmd: 'git log --oneline -3\n# main should be back at the right commit\ngit checkout feature/what-i-was-doing\n# Your work is here, safe' },
      ],
    },
    'yes-no': {
      title: 'Pushed but no one pulled — fast fix',
      color: 'var(--yellow)',
      steps: [
        { label: 'Save work to proper branch', cmd: 'git branch feature/what-i-was-doing' },
        { label: 'Reset main locally', cmd: 'git reset HEAD~1 --mixed' },
        { label: 'Force push to fix remote (window: act fast)', cmd: 'git push origin main --force-with-lease\n# --force-with-lease is safer than --force\n# Fails if someone pushed between your push and now' },
        { label: 'Checkout your feature branch', cmd: 'git checkout feature/what-i-was-doing' },
      ],
    },
    'yes-yes': {
      title: 'Teammates already pulled — only revert is safe',
      color: 'var(--red)',
      steps: [
        { label: 'NEVER reset or force-push — they\'ve built on your commit', cmd: '# DO NOT run: git reset\n# DO NOT run: git push --force\n# Their local history diverges from yours if you do' },
        { label: 'Create a revert commit — the safe undo', cmd: 'git revert HEAD\n# Creates a NEW commit that undoes the previous one\n# History is preserved — no force push needed\ngit push origin main' },
        { label: 'Move your real work to a feature branch', cmd: 'git cherry-pick <your-commit-sha>\n# Cherry-pick your actual work onto a new branch\ngit checkout -b feature/what-i-was-doing\ngit cherry-pick <sha>' },
      ],
    },
  };

  const key = pushed === 'no' ? 'no-na' : pushed === 'yes' && pulled === 'no' ? 'yes-no' : pushed === 'yes' && pulled === 'yes' ? 'yes-yes' : null;
  const result = key ? results[key] : null;

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg2)', margin: '24px 0' }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>😱 Wrong Branch Recovery — Decision Tree</span>
        {pushed && <button className="btn" style={{ fontSize: '11px', padding: '4px 10px' }} onClick={reset}>Reset</button>}
      </div>
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px', padding: '12px 16px', background: 'var(--surface)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--orange)' }}>
          $ git log --oneline -2<br />
          <span style={{ color: 'var(--red)' }}>a3f2c91 (HEAD → main) feat: my feature work  ← this should NOT be on main</span><br />
          <span style={{ color: 'var(--text3)' }}>b4d3e92 chore: previous commit</span>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>Was it already pushed to remote?</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['yes', 'no'].map(v => (
              <button key={v} onClick={() => { setPushed(v); setPulled(null); }} style={{
                padding: '8px 20px', fontSize: '13px', fontFamily: 'var(--font-mono)',
                background: pushed === v ? (v === 'yes' ? 'rgba(248,113,113,0.15)' : 'rgba(34,211,160,0.15)') : 'var(--surface)',
                border: `1px solid ${pushed === v ? (v === 'yes' ? 'var(--red)' : 'var(--green)') : 'var(--border)'}`,
                borderRadius: '6px', color: pushed === v ? (v === 'yes' ? 'var(--red)' : 'var(--green)') : 'var(--text2)', cursor: 'pointer',
              }}>{v === 'yes' ? 'Yes — already pushed' : 'No — local only'}</button>
            ))}
          </div>
        </div>

        {pushed === 'yes' && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>Has any teammate pulled from remote since your push?</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['yes', 'no'].map(v => (
                <button key={v} onClick={() => setPulled(v)} style={{
                  padding: '8px 20px', fontSize: '13px', fontFamily: 'var(--font-mono)',
                  background: pulled === v ? (v === 'yes' ? 'rgba(248,113,113,0.15)' : 'rgba(251,191,36,0.15)') : 'var(--surface)',
                  border: `1px solid ${pulled === v ? (v === 'yes' ? 'var(--red)' : 'var(--yellow)') : 'var(--border)'}`,
                  borderRadius: '6px', color: pulled === v ? (v === 'yes' ? 'var(--red)' : 'var(--yellow)') : 'var(--text2)', cursor: 'pointer',
                }}>{v === 'yes' ? 'Yes — teammate pulled it' : 'No — act fast'}</button>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: result.color, marginBottom: '16px' }}>{result.title}</div>
            {result.steps.map((s, i) => (
              <div key={i} style={{ marginBottom: '14px', display: 'flex', gap: '12px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: result.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: '#fff', flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '6px' }}>{s.label}</div>
                  <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: result.color, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '10px 14px', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{s.cmd}</pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 4. DIVERGED BRANCH VISUALIZER ───────────────────────────────────────────
function DivergedBranchVisualizer() {
  const [resolution, setResolution] = useState(null); // null | 'merge' | 'rebase'

  const W = 600, H = 220;

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg2)', margin: '24px 0' }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
          "Your branch and 'origin/main' have diverged" — Decoded
        </span>
      </div>

      <div style={{ padding: '12px 20px', background: 'rgba(248,113,113,0.06)', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--red)' }}>
        $ git status<br />
        <span style={{ color: 'var(--text)' }}>On branch main<br />Your branch and 'origin/main' have diverged,<br />and have <span style={{ color: 'var(--accent)' }}>3</span> and <span style={{ color: 'var(--blue)' }}>2</span> different commits respectively.</span>
      </div>

      <div style={{ padding: '20px 20px 0', overflowX: 'auto' }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
          {/* Base */}
          <CommitNode x={60} y={110} label="C1" sublabel="last shared" color="var(--text3)" />

          {/* Their commits (remote) */}
          <Arrow x1={74} y1={110} x2={156} y2={70} color="var(--border2)" />
          <CommitNode x={170} y={70} label="R1" color="var(--blue)" />
          <Arrow x1={184} y1={70} x2={266} y2={70} color="var(--blue)" />
          <CommitNode x={280} y={70} label="R2" color="var(--blue)" />
          <rect x={230} y={38} width={100} height={18} rx="4" fill="rgba(96,165,250,0.15)" stroke="var(--blue)" strokeWidth="1" />
          <text x={280} y={51} textAnchor="middle" fill="var(--blue)" fontSize="9" fontFamily="var(--font-mono)" fontWeight="700">origin/main (2 commits)</text>

          {/* Your commits (local) */}
          <Arrow x1={74} y1={110} x2={156} y2={150} color="var(--border2)" />
          <CommitNode x={170} y={150} label="A" color="var(--accent)" />
          <Arrow x1={184} y1={150} x2={256} y2={150} color="var(--accent)" />
          <CommitNode x={270} y={150} label="B" color="var(--accent)" />
          <Arrow x1={284} y1={150} x2={356} y2={150} color="var(--accent)" />
          <CommitNode x={370} y={150} label="C" color="var(--accent)" />
          <rect x={290} y={168} width={160} height={18} rx="4" fill="rgba(124,106,247,0.15)" stroke="var(--accent)" strokeWidth="1" />
          <text x={370} y={181} textAnchor="middle" fill="var(--accent)" fontSize="9" fontFamily="var(--font-mono)" fontWeight="700">your local main (3 commits)</text>

          {/* Resolution: merge */}
          {resolution === 'merge' && (
            <g>
              <Arrow x1={294} y1={70} x2={456} y2={110} color="var(--yellow)" />
              <Arrow x1={384} y1={150} x2={456} y2={110} color="var(--yellow)" />
              <CommitNode x={470} y={110} label="M" sublabel="merge commit" color="var(--yellow)" />
              <text x={470} y={85} textAnchor="middle" fill="var(--yellow)" fontSize="9" fontFamily="var(--font-mono)">non-linear</text>
            </g>
          )}
          {resolution === 'rebase' && (
            <g>
              <Arrow x1={294} y1={70} x2={376} y2={70} color="var(--green)" />
              <CommitNode x={390} y={70} label="A'" color="var(--green)" />
              <Arrow x1={404} y1={70} x2={456} y2={70} color="var(--green)" />
              <CommitNode x={470} y={70} label="B'" color="var(--green)" />
              <Arrow x1={484} y1={70} x2={536} y2={70} color="var(--green)" />
              <CommitNode x={550} y={70} label="C'" color="var(--green)" />
              <text x={470} y={44} textAnchor="middle" fill="var(--green)" fontSize="9" fontFamily="var(--font-mono)">linear history ✓</text>
              <CommitNode x={170} y={150} label="A" color="var(--accent)" faded={true} />
              <CommitNode x={270} y={150} label="B" color="var(--accent)" faded={true} />
              <CommitNode x={370} y={150} label="C" color="var(--accent)" faded={true} />
            </g>
          )}
        </svg>
      </div>

      <div style={{ padding: '0 20px 20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {[
          { key: 'merge', label: 'Resolve with merge', color: 'var(--yellow)', cmd: 'git pull origin main\n# or: git merge origin/main' },
          { key: 'rebase', label: 'Resolve with rebase', color: 'var(--green)', cmd: 'git rebase origin/main\n# then: git push --force-with-lease' },
        ].map(opt => (
          <button key={opt.key} onClick={() => setResolution(opt.key)} style={{
            flex: 1, minWidth: '180px', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
            background: resolution === opt.key ? opt.color + '18' : 'var(--surface)',
            border: `2px solid ${resolution === opt.key ? opt.color : 'var(--border)'}`,
            color: resolution === opt.key ? opt.color : 'var(--text2)',
            fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: resolution === opt.key ? 700 : 400,
          }}>{opt.label}</button>
        ))}
      </div>

      {resolution && (
        <div style={{ margin: '0 16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[
            { key: 'merge', color: 'var(--yellow)', pros: ['Conflicts resolved once', 'History preserved as-is', 'Safe for shared branches', 'Reviewers keep "view changes"'], cons: ['Creates a merge commit', 'Non-linear history', 'Noisy git log over time'] },
            { key: 'rebase', color: 'var(--green)', pros: ['Linear, clean history', 'Easier to bisect', 'Cleaner git log'], cons: ['Force push required', 'Conflicts per commit', 'Reviewers lose "view changes since last review"'] },
          ].map(opt => (
            <div key={opt.key} style={{ padding: '14px', background: resolution === opt.key ? opt.color + '0d' : 'var(--surface)', border: `1px solid ${resolution === opt.key ? opt.color + '44' : 'var(--border)'}`, borderRadius: '8px' }}>
              {opt.pros.map(p => <div key={p} style={{ fontSize: '12px', color: 'var(--green)', marginBottom: '4px' }}>✓ {p}</div>)}
              {opt.cons.map(c => <div key={c} style={{ fontSize: '12px', color: 'var(--red)', marginBottom: '4px' }}>✗ {c}</div>)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 5. STASH SAFETY CHECKER ──────────────────────────────────────────────────
function StashSafetyChecker() {
  const [q, setQ] = useState({ untracked: null, keepAfter: null, named: null, partial: null });
  const set = (k, v) => setQ(prev => ({ ...prev, [k]: v }));

  const allAnswered = Object.values(q).every(v => v !== null);

  const buildCmd = () => {
    let flags = 'git stash push';
    const notes = [];

    if (q.named === 'yes') {
      flags += ' -m "half-done login redesign"';
      notes.push('Named stash — you can find it later with git stash list');
    }
    if (q.untracked === 'yes') {
      flags += ' -u';
      notes.push('-u includes untracked files (new files you haven\'t staged yet)');
    }
    if (q.partial === 'yes') {
      flags += ' -p';
      notes.push('-p enters patch mode — choose which changes to stash hunk by hunk');
    }

    const applyCmd = q.keepAfter === 'yes' ? 'git stash apply stash@{0}' : 'git stash pop';
    const applyNote = q.keepAfter === 'yes'
      ? 'apply keeps the stash entry — good if you might need it again'
      : 'pop applies AND removes the stash — good for one-time use';

    return { stashCmd: flags, applyCmd, applyNote, notes };
  };

  const { stashCmd, applyCmd, applyNote, notes } = allAnswered ? buildCmd() : {};

  const Question = ({ qKey, text, opts }) => (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontSize: '13px', color: 'var(--text)', marginBottom: '8px', fontWeight: 500 }}>{text}</div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {opts.map(([val, label]) => (
          <button key={val} onClick={() => set(qKey, val)} style={{
            padding: '6px 16px', fontSize: '12px', fontFamily: 'var(--font-mono)',
            background: q[qKey] === val ? 'var(--accent)' : 'var(--surface)',
            border: `1px solid ${q[qKey] === val ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '6px', color: q[qKey] === val ? '#fff' : 'var(--text2)', cursor: 'pointer',
          }}>{label}</button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg2)', margin: '24px 0' }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>🗃 Stash Safety Checker — Build the Right Command</span>
        <button className="btn" style={{ fontSize: '11px', padding: '4px 10px' }} onClick={() => setQ({ untracked: null, keepAfter: null, named: null, partial: null })}>Reset</button>
      </div>
      <div style={{ padding: '20px' }}>
        <Question qKey="named" text="Do you want to name this stash (so you can find it later)?" opts={[['yes', 'Yes'], ['no', 'No — anonymous is fine']]} />
        <Question qKey="untracked" text="Do you have new untracked files (files you created but never staged)?" opts={[['yes', 'Yes — include them'], ['no', 'No — only tracked changes']]} />
        <Question qKey="partial" text="Do you want to stash only SOME of your changes (not everything)?" opts={[['yes', 'Yes — let me choose'], ['no', 'No — stash everything']]} />
        <Question qKey="keepAfter" text="When you come back, should the stash entry be kept after applying?" opts={[['yes', 'Yes — apply, keep it'], ['no', 'No — apply and delete it']]} />

        {allAnswered && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: '4px' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Your Commands</div>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--green)', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '14px 16px', margin: '0 0 8px', lineHeight: 1.8 }}>
              {`# When interruption hits:\n${stashCmd}\n\n# When you return:\n${applyCmd}`}
            </pre>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
              {notes.map((n, i) => <div key={i} style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>• {n}</div>)}
              <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>• {applyNote}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 6. PR FEEDBACK SIMULATOR ─────────────────────────────────────────────────
function PRFeedbackSimulator() {
  const [strategy, setStrategy] = useState(null);

  const strategies = {
    amend: {
      label: 'Amend + force-with-lease',
      color: 'var(--green)',
      when: 'Best for: Small fix to your last commit (typo, missed import, forgot to delete a line)',
      consequence: 'History stays clean. Reviewer can\'t see what changed in the amended commit — GitHub collapses it. Good for tiny fixes. Bad if the reviewer needs to re-review substantial changes.',
      cmd: `git add src/auth.js\ngit commit --amend --no-edit\ngit push --force-with-lease origin feature/auth`,
      before: ['A — feat: add login form', 'B — feat: add session handling', 'C — feat: add logout   ← HEAD'],
      after:  ['A — feat: add login form', 'B — feat: add session handling', "C' — feat: add logout  ← amended"],
      warning: null,
    },
    newcommit: {
      label: 'New commit for the changes',
      color: 'var(--blue)',
      when: 'Best for: Substantial rework requested by reviewer — new logic, refactored structure',
      consequence: 'Reviewer can clearly see "view changes since last review" on GitHub. History is honest. Slightly messier log, but you can squash before merge.',
      cmd: `git add src/auth.js\ngit commit -m "refactor(auth): address PR feedback — extract validation"\ngit push origin feature/auth`,
      before: ['A — feat: add login form', 'B — feat: add session handling', 'C — feat: add logout'],
      after:  ['A — feat: add login form', 'B — feat: add session handling', 'C — feat: add logout', 'D — refactor(auth): address PR feedback'],
      warning: null,
    },
    rebase: {
      label: 'Rebase + squash before merge',
      color: 'var(--accent)',
      when: 'Best for: PR is approved, you want clean history before merging',
      consequence: 'History looks professional — one or two logical commits, no "address feedback" noise. But force-push means reviewer loses "view changes since last review" on GitHub.',
      cmd: `git rebase -i HEAD~4\n# squash "address feedback" commits into main commits\ngit push --force-with-lease origin feature/auth`,
      before: ['A — feat: add login form', 'B — feat: add session handling', 'C — feat: add logout', 'D — address PR feedback', 'E — fix: typo in auth'],
      after:  ['A — feat: add login form', 'B — feat: add session handling + auth (squashed)'],
      warning: 'Force-pushing mid-review kills "view changes since last review" for your reviewer. Only squash AFTER approval.',
    },
    badcommit: {
      label: 'git commit -m "fix" or "PR feedback"',
      color: 'var(--red)',
      when: 'What most devs do — and why it makes senior devs cringe',
      consequence: 'Six months from now, git log shows a commit called "fix" with no context. git blame points here and no one knows what was fixed. git bisect hits this commit and the message tells you nothing.',
      cmd: `git add src/auth.js\ngit commit -m "fix"\ngit push origin feature/auth`,
      before: ['A — feat: add login form', 'B — feat: add session handling', 'C — feat: add logout'],
      after:  ['A — feat: add login form', 'B — feat: add session handling', 'C — feat: add logout', 'D — fix  ← 🤦 what fix?'],
      warning: 'This is a broken window. Every "fix" or "wip" commit is technical debt in your history.',
    },
  };

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg2)', margin: '24px 0' }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
          👀 PR Feedback Received — What Do You Do?
        </span>
      </div>

      <div style={{ padding: '12px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text2)' }}>
        Reviewer: "Can you extract the validation logic into its own function? Also there's a typo on line 47."
      </div>

      <div style={{ padding: '16px 16px 0', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {Object.entries(strategies).map(([key, s]) => (
          <button key={key} onClick={() => setStrategy(key)} style={{
            flex: 1, minWidth: '140px', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
            background: strategy === key ? s.color + '18' : 'var(--surface)',
            border: `2px solid ${strategy === key ? s.color : 'var(--border)'}`,
            color: strategy === key ? s.color : 'var(--text2)',
            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: strategy === key ? 700 : 400,
            transition: 'all 0.2s',
          }}>{s.label}</button>
        ))}
      </div>

      {strategy && (
        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: strategies[strategy].color, background: strategies[strategy].color + '12', border: `1px solid ${strategies[strategy].color}33`, borderRadius: '6px', padding: '8px 14px', marginBottom: '16px' }}>
            {strategies[strategy].when}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            {['before', 'after'].map(t => (
              <div key={t}>
                <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{t === 'before' ? 'History before' : 'History after'}</div>
                <div style={{ background: 'var(--bg2)', borderRadius: '6px', border: '1px solid var(--border)', padding: '10px 14px' }}>
                  {strategies[strategy][t].map((c, i) => (
                    <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: c.includes('←') || c.includes('fix') || c.includes('wip') || c.includes('feedback') || c.includes("'") ? strategies[strategy].color : 'var(--text2)', lineHeight: 1.9 }}>
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: strategies[strategy].color, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '12px 14px', margin: '0 0 12px', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
            {strategies[strategy].cmd}
          </pre>

          {strategies[strategy].warning && (
            <div style={{ padding: '10px 14px', background: 'rgba(248,113,113,0.1)', border: '1px solid var(--red)', borderRadius: '6px', fontSize: '12px', color: 'var(--red)', marginBottom: '12px' }}>
              ⚠ {strategies[strategy].warning}
            </div>
          )}

          <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7, margin: 0 }}>{strategies[strategy].consequence}</p>
        </div>
      )}
    </div>
  );
}

// ─── 7. BRANCH SYNC STRATEGY ──────────────────────────────────────────────────
function BranchSyncStrategy() {
  const [mode, setMode] = useState(null);
  const W = 580, H = 200;

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg2)', margin: '24px 0' }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
          Keeping your feature branch in sync with main
        </span>
      </div>
      <div style={{ padding: '12px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
        Situation: you've been on feature/auth for 4 days. main has moved forward with 8 commits from teammates.
      </div>

      <div style={{ padding: '20px 20px 0', overflowX: 'auto' }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
          {/* Shared base */}
          <CommitNode x={40} y={100} label="base" color="var(--text3)" size={12} />

          {/* Main commits */}
          {[100, 150, 200, 250].map((x, i) => (
            <g key={x}>
              <Arrow x1={i === 0 ? 52 : x - 36} y1={i === 0 ? 96 : 70} x2={x - 14} y2={70} color="var(--blue)" />
              <CommitNode x={x} y={70} label={`M${i + 1}`} color="var(--blue)" size={11} />
            </g>
          ))}
          <rect x={218} y={40} width={64} height={16} rx="3" fill="rgba(96,165,250,0.15)" stroke="var(--blue)" strokeWidth="1" />
          <text x={250} y={52} textAnchor="middle" fill="var(--blue)" fontSize="9" fontFamily="var(--font-mono)">origin/main</text>

          {/* Your feature commits */}
          {[100, 160, 220].map((x, i) => (
            <g key={x}>
              <Arrow x1={i === 0 ? 52 : x - 46} y1={i === 0 ? 104 : 140} x2={x - 14} y2={140} color="var(--accent)" />
              <CommitNode x={x} y={140} label={`F${i + 1}`} color="var(--accent)" size={11} />
            </g>
          ))}
          <rect x={188} y={156} width={64} height={16} rx="3" fill="rgba(124,106,247,0.15)" stroke="var(--accent)" strokeWidth="1" />
          <text x={220} y={168} textAnchor="middle" fill="var(--accent)" fontSize="9" fontFamily="var(--font-mono)">feature/auth</text>

          {/* Resolution: merge */}
          {mode === 'merge' && (
            <g>
              <Arrow x1={264} y1={70} x2={336} y2={100} color="var(--yellow)" />
              <Arrow x1={234} y1={140} x2={336} y2={100} color="var(--yellow)" />
              <CommitNode x={350} y={100} label="MC" sublabel="merge commit" color="var(--yellow)" size={12} />
              <text x={350} y={72} textAnchor="middle" fill="var(--yellow)" fontSize="9" fontFamily="var(--font-mono)">no SHA change</text>
            </g>
          )}

          {/* Resolution: rebase */}
          {mode === 'rebase' && (
            <g>
              {[290, 350, 410].map((x, i) => (
                <g key={x}>
                  <Arrow x1={i === 0 ? 264 : x - 46} y1={70} x2={x - 14} y2={70} color="var(--green)" />
                  <CommitNode x={x} y={70} label={`F${i + 1}'`} color="var(--green)" size={11} />
                </g>
              ))}
              <text x={350} y={44} textAnchor="middle" fill="var(--green)" fontSize="9" fontFamily="var(--font-mono)">linear — new SHAs</text>
              <CommitNode x={100} y={140} label="F1" color="var(--accent)" faded={true} size={11} />
              <CommitNode x={160} y={140} label="F2" color="var(--accent)" faded={true} size={11} />
              <CommitNode x={220} y={140} label="F3" color="var(--accent)" faded={true} size={11} />
            </g>
          )}
        </svg>
      </div>

      <div style={{ padding: '0 16px 16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {[
          { key: 'merge', label: 'Merge main into feature', color: 'var(--yellow)' },
          { key: 'rebase', label: 'Rebase feature onto main', color: 'var(--green)' },
        ].map(opt => (
          <button key={opt.key} onClick={() => setMode(opt.key)} style={{
            flex: 1, minWidth: '180px', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
            background: mode === opt.key ? opt.color + '18' : 'var(--surface)',
            border: `2px solid ${mode === opt.key ? opt.color : 'var(--border)'}`,
            color: mode === opt.key ? opt.color : 'var(--text2)',
            fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: mode === opt.key ? 700 : 400,
          }}>{opt.label}</button>
        ))}
      </div>

      {mode && (
        <div style={{ margin: '0 16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: mode === 'merge' ? 'var(--yellow)' : 'var(--green)', background: 'var(--bg2)', borderRadius: '6px', border: '1px solid var(--border)', padding: '12px 14px', margin: 0, lineHeight: 1.8 }}>
              {mode === 'merge'
                ? `git fetch origin\ngit merge origin/main\n# resolve conflicts once\ngit push origin feature/auth`
                : `git fetch origin\ngit rebase origin/main\n# resolve conflicts per commit\ngit push --force-with-lease origin feature/auth`
              }
            </pre>
          </div>
          <div style={{ padding: '12px 14px', background: 'var(--surface)', borderRadius: '6px', border: '1px solid var(--border)' }}>
            {(mode === 'merge'
              ? [['✓', 'var(--green)', 'No force push needed'], ['✓', 'var(--green)', 'Conflicts resolved in one go'], ['✓', 'var(--green)', 'Reviewer keeps "view changes"'], ['✗', 'var(--red)', 'Merge commit in feature history'], ['✗', 'var(--red)', 'Non-linear log']]
              : [['✓', 'var(--green)', 'Linear, clean history'], ['✓', 'var(--green)', 'No merge commit noise'], ['✗', 'var(--red)', 'Force push required'], ['✗', 'var(--red)', 'Reviewer loses "view changes"'], ['✗', 'var(--red)', 'Conflicts per commit if many overlap']]
            ).map(([sym, col, txt], i) => (
              <div key={i} style={{ fontSize: '12px', color: col, marginBottom: '6px' }}>{sym} {txt}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 8. GIT STATUS DECODER ────────────────────────────────────────────────────
function GitStatusDecoder() {
  const [active, setActive] = useState(null);

  const lines = [
    { id: 'branch', text: "On branch feature/auth", color: 'var(--text2)', explain: 'Which branch you\'re currently on. If this says "HEAD detached at a3f2c91", you\'re in detached HEAD state — read the Core Concepts chapter.' },
    { id: 'ahead', text: "Your branch is ahead of 'origin/feature/auth' by 2 commits.", color: 'var(--green)', explain: 'You have 2 commits locally that haven\'t been pushed. Nobody else can see your work yet. Run: git push origin feature/auth' },
    { id: 'staged', text: "Changes to be committed:", color: 'var(--green)', explain: 'Files in the Staging Index (git add was already run on these). These WILL be in your next commit. To unstage: git restore --staged <file>' },
    { id: 'staged-file', text: "  modified:   src/auth.js", color: 'var(--green)', explain: 'This specific file is staged. The version in the Index differs from HEAD. It will go into the next commit exactly as it is now in the Index.' },
    { id: 'notstaged', text: "Changes not staged for commit:", color: 'var(--red)', explain: 'Files that are tracked by Git (they\'ve been committed before) but have changes that haven\'t been staged yet. Run git add <file> or git add -p to stage them.' },
    { id: 'notstaged-file', text: "  modified:   src/utils.js", color: 'var(--red)', explain: 'You\'ve edited this file since your last commit, but haven\'t staged the changes. If you commit right now, THIS VERSION of utils.js will NOT be in the commit.' },
    { id: 'untracked', text: "Untracked files:", color: 'var(--red)', explain: 'Files Git has never seen before — they\'ve never been committed. Git is not tracking changes to these. They will NOT be included in git add . unless you use git add -A.' },
    { id: 'untracked-file', text: "  .env.local", color: 'var(--text3)', explain: 'This file is completely new to Git. If it contains secrets, add it to .gitignore immediately. If it\'s real code, git add it.' },
  ];

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg2)', margin: '24px 0' }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
          Reading git status Like a Senior — Click Any Line
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '280px' }}>
        <div style={{ padding: '16px', borderRight: '1px solid var(--border)', background: 'var(--bg2)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 2.2 }}>
            <div style={{ color: 'var(--text3)', marginBottom: '8px' }}>$ git status</div>
            {lines.map(line => (
              <div key={line.id} onClick={() => setActive(active === line.id ? null : line.id)}
                style={{
                  color: line.color, cursor: 'pointer', padding: '0 6px', borderRadius: '4px',
                  background: active === line.id ? line.color + '22' : 'transparent',
                  border: `1px solid ${active === line.id ? line.color + '55' : 'transparent'}`,
                  transition: 'all 0.15s', whiteSpace: 'pre',
                }}
                onMouseEnter={e => { if (active !== line.id) e.currentTarget.style.background = line.color + '0d'; }}
                onMouseLeave={e => { if (active !== line.id) e.currentTarget.style.background = 'transparent'; }}
              >
                {line.text}
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '20px', display: 'flex', alignItems: active ? 'flex-start' : 'center', justifyContent: 'center' }}>
          {active ? (
            <div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>What this means</div>
              <code style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '12px', color: lines.find(l => l.id === active)?.color, background: 'var(--surface)', padding: '6px 10px', borderRadius: '4px', marginBottom: '12px' }}>
                {lines.find(l => l.id === active)?.text.trim()}
              </code>
              <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7, margin: 0 }}>
                {lines.find(l => l.id === active)?.explain}
              </p>
            </div>
          ) : (
            <p style={{ fontSize: '13px', color: 'var(--text3)', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
              ← Click any line in the output to decode it
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 9. PUSH SEQUENCE WALKTHROUGH ────────────────────────────────────────────
function PushSequenceWalkthrough() {
  const [step, setStep] = useState(null);
  const [skipped, setSkipped] = useState(new Set());

  const steps = [
    {
      id: 'diff', label: 'Review changes', cmd: 'git diff\ngit diff --staged',
      output: `diff --git a/src/auth.js b/src/auth.js\n@@ -45,6 +45,14 @@\n+  if (attempts > 5) {\n+    throw new RateLimitError();\n+  }`,
      why: 'Always look at what you\'re about to commit. git diff shows unstaged changes. git diff --staged shows what\'s already in the index. This catches "I accidentally edited the wrong file" moments.',
      canSkip: true, skipRisk: 'You might commit a debug console.log, a commented-out block, or an accidental edit to a config file.',
    },
    {
      id: 'add', label: 'Stage surgically', cmd: 'git add -p src/auth.js',
      output: `@@ -45,6 +45,14 @@ function login(user, pass) {\n+  if (attempts > 5) {\n+    throw new RateLimitError();\n+  }\nStage this hunk [y,n,q,a,d,?]? y`,
      why: 'git add -p (patch mode) lets you choose exactly which changes go into this commit. If you touched two things in one file, you can commit them separately. This creates clean, atomic commits.',
      canSkip: true, skipRisk: 'You\'ll commit everything in the file — including any debug code or unrelated changes. Your commit history becomes harder to understand.',
    },
    {
      id: 'commit', label: 'Commit properly', cmd: 'git commit -m "feat(auth): add rate limiting to login endpoint"',
      output: `[feature/auth a3f2c91] feat(auth): add rate limiting to login endpoint\n 1 file changed, 8 insertions(+)\n`,
      why: 'A good commit message is the only documentation future-you (or your teammate) has when running git blame 6 months from now. type(scope): description. Imperative mood. Under 72 chars.',
      canSkip: false, skipRisk: null,
    },
    {
      id: 'fetch', label: 'Fetch remote state', cmd: 'git fetch origin',
      output: `From github.com:team/project\n   b4d3e92..c5e4f03  main -> origin/main`,
      why: 'See what the remote looks like without touching anything. This tells you if main has moved since you last pulled — without triggering a merge or rebase yet.',
      canSkip: true, skipRisk: 'You push without knowing someone else pushed first. Your push gets rejected with "failed to push: non-fast-forward". Annoying but recoverable.',
    },
    {
      id: 'check', label: 'Verify what you\'re pushing', cmd: 'git log origin/main..HEAD --oneline',
      output: `a3f2c91 feat(auth): add rate limiting to login endpoint`,
      why: 'Confirm exactly which commits you\'re about to push. No surprises. You can see the commit message one more time before it\'s permanent.',
      canSkip: true, skipRisk: 'Low risk, but you might accidentally push more commits than you intended (e.g. old WIP commits you forgot about).',
    },
    {
      id: 'push', label: 'Push safely', cmd: 'git push --force-with-lease origin feature/auth\n# or: git push origin feature/auth',
      output: `Enumerating objects: 5, done.\nCounting objects: 100%\nTo github.com:team/project\n   b4d3e92..a3f2c91  feature/auth -> feature/auth`,
      why: 'Use --force-with-lease instead of --force if you rebased. It checks the remote hasn\'t changed since your last fetch — so you can\'t accidentally overwrite a teammate\'s push.',
      canSkip: false, skipRisk: null,
    },
  ];

  const toggleSkip = (id) => {
    setSkipped(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg2)', margin: '24px 0' }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
          🔁 The Complete Push Loop — Click Steps to Explore
        </span>
        <button className="btn" style={{ fontSize: '11px', padding: '4px 10px' }} onClick={() => { setStep(null); setSkipped(new Set()); }}>Reset</button>
      </div>

      {/* Step list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {steps.map((s, i) => {
          const isSkipped = skipped.has(s.id);
          const isActive = step === s.id;
          return (
            <div key={s.id}
              style={{
                borderBottom: '1px solid var(--border)',
                background: isActive ? 'rgba(124,106,247,0.06)' : isSkipped ? 'rgba(248,113,113,0.04)' : 'transparent',
                opacity: isSkipped ? 0.6 : 1,
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', cursor: 'pointer' }}
                onClick={() => setStep(isActive ? null : s.id)}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: isSkipped ? 'rgba(248,113,113,0.2)' : isActive ? 'var(--accent)' : 'var(--surface)',
                  border: `2px solid ${isSkipped ? 'var(--red)' : isActive ? 'var(--accent)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 800,
                  color: isSkipped ? 'var(--red)' : isActive ? '#fff' : 'var(--text3)',
                }}>{isSkipped ? '✗' : i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: isActive ? 'var(--accent)' : 'var(--text)', marginBottom: '2px' }}>{s.label}</div>
                  <code style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)' }}>{s.cmd.split('\n')[0]}</code>
                </div>
                {s.canSkip && (
                  <button onClick={e => { e.stopPropagation(); toggleSkip(s.id); }} style={{
                    padding: '3px 10px', fontSize: '10px', fontFamily: 'var(--font-mono)',
                    background: isSkipped ? 'rgba(248,113,113,0.15)' : 'var(--surface)',
                    border: `1px solid ${isSkipped ? 'var(--red)' : 'var(--border)'}`,
                    borderRadius: '4px', color: isSkipped ? 'var(--red)' : 'var(--text3)', cursor: 'pointer',
                  }}>{isSkipped ? 'skipped' : 'skip?'}</button>
                )}
              </div>

              {isActive && (
                <div style={{ padding: '0 16px 16px 58px' }}>
                  <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--green)', background: 'var(--bg2)', borderRadius: '6px', border: '1px solid var(--border)', padding: '10px 14px', margin: '0 0 10px', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                    {`$ ${s.cmd}\n\n${s.output}`}
                  </pre>
                  <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7, margin: 0 }}>{s.why}</p>
                  {s.canSkip && s.skipRisk && (
                    <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '6px', fontSize: '12px', color: 'var(--red)' }}>
                      <strong>If you skip this:</strong> {s.skipRisk}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {skipped.size > 0 && (
        <div style={{ padding: '12px 16px', background: 'rgba(248,113,113,0.08)', borderTop: '1px solid var(--border)', fontSize: '12px', color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>
          ⚠ You're skipping {skipped.size} step{skipped.size > 1 ? 's' : ''}. That's fine — but read what breaks.
        </div>
      )}
    </div>
  );
}

// ─── TOC ──────────────────────────────────────────────────────────────────────
function TocBar() {
  const items = [
    { id: 'pull-push',     icon: '⬆', label: 'Pull Before Push' },
    { id: 'morning',       icon: '🌅', label: 'Morning Sync' },
    { id: 'wrong-branch',  icon: '😱', label: 'Wrong Branch' },
    { id: 'diverged',      icon: '⑂', label: 'Diverged Branch' },
    { id: 'stash',         icon: '🗃', label: 'Stashing Right' },
    { id: 'pr-feedback',   icon: '👀', label: 'PR Feedback Loop' },
    { id: 'sync-main',     icon: '🔄', label: 'Syncing with Main' },
    { id: 'undo-push',     icon: '💥', label: 'Undo a Bad Push' },
    { id: 'read-status',   icon: '🔬', label: 'Reading Status' },
    { id: 'push-loop',     icon: '🔁', label: 'The Push Loop' },
  ];
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '0 0 56px', padding: '16px', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', width: '100%', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>10 Real Scenarios — Jump to</span>
      {items.map(item => (
        <a key={item.id} href={`#${item.id}`} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '5px 12px', fontSize: '12px', fontFamily: 'var(--font-mono)',
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: '20px', color: 'var(--text2)', textDecoration: 'none', transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; }}
        >{item.icon} {item.label}</a>
      ))}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function RealWorld() {
  return (
    <div className="page-content">
      <section className="section">

        <div className="section-header-wrap" style={{ marginBottom: '32px' }}>
          <div className="section-bg-num">★</div>
          <div className="section-label">Real World</div>
          <h2 className="section-title">Git in the Real World</h2>
          <p className="section-desc">
            Every tutorial teaches you the commands. None of them teach you what to actually do when
            your push gets rejected, you committed to main by accident, or a teammate force-pushed and
            broke your branch. This page is everything the tutorials skip.
          </p>
        </div>

        <Callout type="info">
          Every scenario on this page starts with <strong>"You're in the middle of work and X happens."</strong>
          Not theory. The exact moments developers freeze up, Google the wrong thing, and make it worse.
        </Callout>

        <TocBar />

        {/* ─── 1. Pull Before Push ─── */}
        <RealSection num="01" id="pull-push" icon="⬆" tag="daily"
          title='"Your push got rejected. Non-fast-forward."'
          subtitle="The most common moment developers reach for the wrong tool">
          <p className="body-text">
            You finished your work. You ran <code>git push</code>. Git said no.
            Someone else pushed to the same branch while you were working.
            Your instinct is to <code>git pull</code> then push. That works — but it creates
            a messy merge commit in shared history that accumulates over time.
            There's a better way, and it depends on which branch you're on.
          </p>
          <PullBeforePushSimulator />
          <Callout type="tip">
            <strong>Set this globally and never think about it again:</strong><br />
            <code>git config --global pull.rebase true</code><br />
            Now every <code>git pull</code> automatically rebases instead of merging.
            Your history stays linear without any extra flags.
          </Callout>
          <DeepDive title="What 'non-fast-forward' actually means">
            <p>A fast-forward push is when the remote's branch is a direct ancestor of your branch — Git can just move the pointer forward. "Non-fast-forward" means the remote has diverged: it has commits your local branch doesn't have. Git refuses to push because doing so would delete those remote commits.</p>
            <CodeBlock language="bash" code={`# See exactly what's on remote that you don't have:
git fetch origin
git log HEAD..origin/main --oneline

# See what you have that remote doesn't:
git log origin/main..HEAD --oneline`} />
          </DeepDive>
        </RealSection>

        {/* ─── 2. Morning Ritual ─── */}
        <RealSection num="02" id="morning" icon="🌅" tag="daily"
          title="The Morning Sync Ritual"
          subtitle="4 commands you run before touching any code">
          <p className="body-text">
            Most developers open their laptop and start coding immediately — then hit confusing
            errors 2 hours in because main moved, a branch was deleted, or they're working off
            stale state. The fix is a 30-second ritual that gives you a complete picture before
            you write a single line.
          </p>
          <MorningSyncChecker />
          <CodeBlock language="bash" code={`# The full ritual in one block — copy it:
git fetch --all --prune          # sync remote state, touch nothing
git log origin/main..HEAD --oneline   # what I have, remote doesn't
git log HEAD..origin/main --oneline   # what remote has, I don't
git status                            # where am I exactly`} />
        </RealSection>

        {/* ─── 3. Wrong Branch ─── */}
        <RealSection num="03" id="wrong-branch" icon="😱" tag="recovery"
          title='"I committed to main by accident"'
          subtitle="The fix is different depending on how far it went">
          <p className="body-text">
            You forgot to branch. You just committed directly to main.
            The recovery depends on three variables: did you push, did anyone pull,
            and do you need the work preserved. The decision tree gives you the exact sequence.
          </p>
          <WrongBranchRecovery />
          <DeepDive title="Why git revert is safer than git reset on shared branches">
            <p><code>git reset</code> moves the branch pointer backward — it rewrites history. Anyone who already pulled your commit will have a branch that diverges from the rewritten version. They'll need to force-pull, losing their own unpushed work potentially.</p>
            <p style={{ marginTop: '12px' }}><code>git revert</code> creates a <em>new</em> commit that undoes the previous one. History is preserved. Teammates just pull the revert commit normally. No divergence, no force push, no drama.</p>
          </DeepDive>
        </RealSection>

        {/* ─── 4. Diverged ─── */}
        <RealSection num="04" id="diverged" icon="⑂" tag="teamwork"
          title='"Your branch and origin/main have diverged"'
          subtitle="The message most developers stare at blankly — decoded visually">
          <p className="body-text">
            This message means you and the remote are in a fork. You have commits it doesn't have,
            and it has commits you don't have. Git can't auto-resolve this — you need to
            consciously choose how to converge the two histories. Pick the strategy based on your situation:
          </p>
          <DivergedBranchVisualizer />
          <Callout type="tip">
            <strong>On a personal feature branch:</strong> rebase is almost always right — clean linear history, easier PR review.<br />
            <strong>On a shared branch (develop, staging):</strong> merge is safer — no force push, no disrupting teammates.
          </Callout>
        </RealSection>

        {/* ─── 5. Stash ─── */}
        <RealSection num="05" id="stash" icon="🗃" tag="daily"
          title="Stashing Properly — Not Just git stash"
          subtitle="git stash has 6 flags most devs never use. One of them will save your work.">
          <p className="body-text">
            <code>git stash</code> alone is deceptively incomplete. By default it doesn't stash
            untracked files — so your new file that you haven't staged yet silently gets left behind.
            And <code>git stash pop</code> deletes the stash after applying, which is wrong if you want
            to apply the same stash to multiple branches. Use the checker below to build the right command:
          </p>
          <StashSafetyChecker />
          <CodeBlock language="bash" code={`# The commands most devs don't know about:

# List all stashes with their context:
git stash list
# stash@{0}: On feature/auth: half-done login redesign
# stash@{1}: WIP on main: 3a4b5c6 chore: update deps

# Create a new branch from a stash (most useful trick):
git stash branch feature/stashed-work stash@{0}
# Creates the branch, checks it out, applies the stash

# Apply a specific stash by index (not just the top):
git stash apply stash@{2}

# Show what's inside a stash before applying:
git stash show -p stash@{0}`} />
          <DeepDive title="What git stash actually creates under the hood">
            <p>A stash is not a magic save slot — it's actually two (or three) commit objects stored in <code>refs/stash</code>. One commit for the index state, one for the working directory state, and optionally one for untracked files. That's why <code>git stash pop</code> can sometimes conflict — it's replaying those commits onto your current state.</p>
          </DeepDive>
        </RealSection>

        {/* ─── 6. PR Feedback ─── */}
        <RealSection num="06" id="pr-feedback" icon="👀" tag="teamwork"
          title="The PR Feedback Loop"
          subtitle="What you do after a reviewer asks for changes matters more than you think">
          <p className="body-text">
            Most junior developers respond to PR feedback with a new commit called "fix" or
            "address PR comments." Senior developers either amend the relevant commit, or
            make a properly-named commit that will survive into the final history.
            The strategy you pick has real consequences for your reviewer and for the codebase history:
          </p>
          <PRFeedbackSimulator />
        </RealSection>

        {/* ─── 7. Sync with main ─── */}
        <RealSection num="07" id="sync-main" icon="🔄" tag="teamwork"
          title="Keeping a Feature Branch In Sync With Main"
          subtitle="Merge or rebase — and why the answer is 'it depends'">
          <p className="body-text">
            You've been on a feature branch for several days. Main has moved forward.
            Before you open a PR, you need to integrate those changes.
            This is one of the most debated decisions in real teams — and both options are valid
            in different contexts. Toggle between them to see the actual tradeoffs:
          </p>
          <BranchSyncStrategy />
          <Callout type="info">
            <strong>Team rule of thumb:</strong> If your team squash-merges PRs (GitHub's "Squash and merge"),
            it doesn't matter whether you used merge or rebase on your feature branch — the final merge
            to main will be one clean commit anyway. Optimize for your own sanity during development.
          </Callout>
        </RealSection>

        {/* ─── 8. Undo a Push ─── */}
        <RealSection num="08" id="undo-push" icon="💥" tag="emergency"
          title='"I just pushed something bad to main"'
          subtitle="The next 90 seconds matter. Here's the exact sequence.">
          <p className="body-text">
            Stay calm. The right move depends on one thing: has anyone pulled since your push?
          </p>
          <Tabs tabs={[
            {
              label: 'Nobody pulled yet',
              content: (
                <>
                  <p className="body-text">You have a window. Act fast — but don't panic-force-push. The safest option first:</p>
                  <CodeBlock language="bash" code={`# Option A: Revert (safest — adds a new commit undoing the bad one)
git revert HEAD
git push origin main
# → One new commit that undoes the bad one. Clean. No drama.

# Option B: Reset + force-with-lease (cleaner history, slightly riskier)
git reset HEAD~1 --soft    # undo commit, keep changes staged
git reset HEAD~1 --mixed   # undo commit, keep changes unstaged
git push --force-with-lease origin main
# --force-with-lease will FAIL if someone pushed between your push and now
# That's the protection. If it fails, use Option A.`} />
                </>
              )
            },
            {
              label: 'Someone already pulled',
              content: (
                <>
                  <p className="body-text">This is the hard case. You cannot rewrite history. <code>git revert</code> is the only safe path:</p>
                  <CodeBlock language="bash" code={`# The ONLY safe option when others have pulled:
git revert HEAD
# Write a clear message: "revert: undo bad deploy of X"
git push origin main

# Notify your team immediately:
# "I just pushed a revert commit to main — please git pull before
# pushing anything else. The bad commit was: <sha>"

# DO NOT use git reset + force push here.
# Their local branches will diverge and they'll have to --force-pull
# potentially losing their own unpushed work.`} />
                  <WarningBox type="warning" title="Never reset shared history">
                    Once a commit is on a branch that others have pulled from, it is shared history.
                    Resetting and force-pushing rewrites the past that their local repos are built on.
                    Git revert adds to history rather than rewriting it — that's always safe.
                  </WarningBox>
                </>
              )
            },
            {
              label: 'CI already deployed it',
              content: (
                <>
                  <p className="body-text">Sequence matters here. Deploy order is as important as Git order:</p>
                  <CodeBlock language="bash" code={`# Step 1: Revert the code first
git revert HEAD
git push origin main

# Step 2: Trigger a deploy of the revert commit
# (Don't wait for someone to notice — trigger manually)
# GitHub Actions: re-run the deploy workflow on the revert commit
# Vercel/Netlify: promote the previous successful deployment

# Step 3: THEN investigate the root cause
# Don't try to fix the bug AND revert at the same time under pressure.
# Revert first. Fix in a separate PR with proper review.

# Step 4: Write an incident note
# What broke, how it got past review, what changes to prevent next time`} />
                </>
              )
            },
          ]} />
        </RealSection>

        {/* ─── 9. Reading Status ─── */}
        <RealSection num="09" id="read-status" icon="🔬" tag="daily"
          title="Reading git status Like a Senior"
          subtitle="Every line in the output means something specific — most devs only read half of it">
          <p className="body-text">
            Everyone runs <code>git status</code>. Almost nobody reads the full output carefully.
            Each line is telling you something precise about the state of your three trees.
            Click any line in the output below to decode exactly what it means and what to do:
          </p>
          <GitStatusDecoder />
        </RealSection>

        {/* ─── 10. The Push Loop ─── */}
        <RealSection num="10" id="push-loop" icon="🔁" tag="hygiene"
          title="The Complete Push Loop"
          subtitle="The full sequence from 'I finished coding' to 'it's safely on the remote'">
          <p className="body-text">
            This is the muscle memory that separates developers who ship clean history from
            developers who ship chaos. Every step has a reason. You can skip most of them —
            but click "skip?" on each one to see exactly what breaks when you do:
          </p>
          <PushSequenceWalkthrough />
          <Callout type="tip">
            <strong>Make this your default alias:</strong> The one config change that enforces good habits automatically.
          </Callout>
          <CodeBlock language="bash" code={`# Add to ~/.gitconfig — the most useful aliases:
[alias]
  # Beautiful log with graph:
  lg = log --oneline --graph --all --decorate

  # What am I about to push?
  upcoming = log origin/main..HEAD --oneline

  # What did I miss while I was away?
  missed = log HEAD..origin/main --oneline

  # Safe push (always use lease on force):
  pushf = push --force-with-lease

  # Morning ritual in one command:
  sync = !git fetch --all --prune && git status`} />
        </RealSection>

      </section>
    </div>
  );
}