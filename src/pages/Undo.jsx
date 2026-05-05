import React, { useState, useEffect, useRef } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import DeepDive from '../components/ui/DeepDive';
import Tabs from '../components/ui/Tabs';
import CommandTable from '../components/ui/CommandTable';
import WarningBox from '../components/ui/WarningBox';

/* ─── Fade-in hook ─── */
function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('is-visible'); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ══════════════════════════════════════════════════
   1. RESET MODE VISUALIZER
   Animated three-trees diff for --soft/--mixed/--hard
══════════════════════════════════════════════════ */
function ResetModeVisualizer() {
  const [mode, setMode] = useState(null);   // null | 'soft' | 'mixed' | 'hard'
  const [step, setStep] = useState(0);

  const COMMITS = [
    { hash: 'a1b2c3', msg: 'feat: add login page',      short: 'C1' },
    { hash: 'd4e5f6', msg: 'fix: null check in auth',   short: 'C2' },
    { hash: 'g7h8i9', msg: 'WIP: half-done feature',    short: 'C3' }, // ← HEAD before reset
  ];

  const TARGET = COMMITS[1]; // reset to C2

  const zoneColor = { repo: '#059669', index: '#3b82f6', wd: '#ea580c' };

  const scenarios = {
    soft: {
      label: '--soft',
      color: '#3b82f6',
      tagline: 'Undo the commit. Keep changes staged.',
      steps: [
        {
          title: 'Before reset',
          desc: 'HEAD → C3. C3\'s changes exist in the repository, the index (staged), and working directory. All three trees are in sync.',
          repo: 'C3 (HEAD)',  index: 'C3 snapshot',  wd: 'C3 files',
          repoHi: false, indexHi: false, wdHi: false,
        },
        {
          title: 'git reset --soft d4e5f6 (C2)',
          desc: 'The branch pointer moves back to C2. The INDEX and WORKING DIRECTORY are untouched. C3\'s changes are still fully staged — ready to be re-committed with a better message.',
          repo: 'C2 (HEAD)',  index: 'C3 snapshot',  wd: 'C3 files',
          repoHi: true, indexHi: false, wdHi: false,
          moved: 'repo',
        },
      ],
      useCase: 'You committed too early, or the message was wrong. --soft lets you "uncommit" and rewrite the commit without losing any work.',
    },
    mixed: {
      label: '--mixed',
      color: '#d97706',
      tagline: 'Undo the commit AND the staging. Keep files.',
      steps: [
        {
          title: 'Before reset',
          desc: 'HEAD → C3. All three trees in sync.',
          repo: 'C3 (HEAD)', index: 'C3 snapshot', wd: 'C3 files',
          repoHi: false, indexHi: false, wdHi: false,
        },
        {
          title: 'git reset --mixed d4e5f6 (default)',
          desc: 'Branch pointer moves to C2. INDEX is reset to C2\'s snapshot — C3\'s staged changes are unstaged. Working directory is untouched. Your file edits still exist, just no longer staged.',
          repo: 'C2 (HEAD)', index: 'C2 snapshot', wd: 'C3 files',
          repoHi: true, indexHi: true, wdHi: false,
          moved: 'repo+index',
        },
      ],
      useCase: 'The default reset. You want to keep your file edits but start the staging process over. Use git add -p to re-stage surgically.',
    },
    hard: {
      label: '--hard',
      color: '#dc2626',
      tagline: 'Undo everything. All three trees reset.',
      steps: [
        {
          title: 'Before reset',
          desc: 'HEAD → C3. All three trees in sync.',
          repo: 'C3 (HEAD)', index: 'C3 snapshot', wd: 'C3 files',
          repoHi: false, indexHi: false, wdHi: false,
        },
        {
          title: 'git reset --hard d4e5f6',
          desc: 'All three trees are reset to C2. C3\'s changes in the repo, index, AND working directory are gone. Your file edits are permanently deleted from disk.',
          repo: 'C2 (HEAD)', index: 'C2 snapshot', wd: 'C2 files',
          repoHi: true, indexHi: true, wdHi: true,
          moved: 'all',
          danger: true,
        },
      ],
      useCase: 'Nuclear option. Use when you genuinely want to throw away everything since that commit. Can be recovered via git reflog within 30–90 days.',
    },
  };

  const sc = mode ? scenarios[mode] : null;
  const currentStep = sc ? sc.steps[Math.min(step, sc.steps.length - 1)] : null;

  const reset = () => setStep(0);

  const Zone = ({ label, content, highlight, danger, colorKey }) => (
    <div style={{
      flex: 1, background: 'var(--surface)', border: `2px solid ${highlight ? (danger ? '#dc2626' : zoneColor[colorKey]) : 'var(--border)'}`,
      borderRadius: 10, padding: '14px 16px', transition: 'all 0.4s ease',
      boxShadow: highlight ? `0 0 16px ${danger ? 'rgba(220,38,38,0.18)' : zoneColor[colorKey] + '33'}` : 'none',
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: highlight ? (danger ? '#dc2626' : zoneColor[colorKey]) : 'var(--text3)', marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: highlight ? (danger ? '#dc2626' : zoneColor[colorKey]) : 'var(--text2)', transition: 'all 0.4s' }}>
        {content}
      </div>
      {highlight && (
        <div style={{ marginTop: 8, fontSize: 10, color: danger ? '#dc2626' : zoneColor[colorKey], fontFamily: 'var(--font-mono)' }}>
          {danger ? '⚠ modified' : '← moved to C2'}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg2)', marginBottom: 32 }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>🌳 git reset — Three Trees Visualizer</span>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>See exactly which of Git's three trees each mode touches.</div>
      </div>

      {/* Mode selector */}
      <div style={{ padding: '16px 20px 0', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {Object.entries(scenarios).map(([key, sc]) => (
          <button key={key} className="btn" onClick={() => { setMode(key); reset(); }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 13, borderColor: mode === key ? sc.color : undefined, color: mode === key ? sc.color : undefined, background: mode === key ? sc.color + '11' : undefined }}>
            {sc.label}
            <span style={{ fontSize: 11, color: mode === key ? sc.color : 'var(--text3)', marginLeft: 6 }}>{sc.tagline}</span>
          </button>
        ))}
      </div>

      {!mode && (
        <div style={{ padding: 32, textAlign: 'center', color: 'var(--text3)', fontSize: 14 }}>
          Select a reset mode above to see how it moves through Git's three trees.
        </div>
      )}

      {mode && currentStep && (
        <div style={{ padding: 20 }}>
          {/* Commit timeline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 20, overflowX: 'auto' }}>
            {COMMITS.map((c, i) => (
              <React.Fragment key={c.hash}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  opacity: i > 1 && step > 0 ? 0.3 : 1, transition: 'opacity 0.4s'
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: i === 1 && step > 0 ? sc.color + '22' : i === 2 && step > 0 ? 'var(--bg3)' : 'var(--surface)',
                    border: `2px solid ${i === 1 && step > 0 ? sc.color : i === 2 ? 'var(--border)' : 'var(--border2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                    color: i === 1 && step > 0 ? sc.color : 'var(--text)',
                    transition: 'all 0.4s'
                  }}>
                    {c.short}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text3)', textAlign: 'center', maxWidth: 80 }}>{c.msg.slice(0, 18)}…</div>
                  {i === 2 && step === 0 && <div style={{ fontSize: 9, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>HEAD</div>}
                  {i === 1 && step > 0 && <div style={{ fontSize: 9, color: sc.color, fontFamily: 'var(--font-mono)' }}>HEAD</div>}
                </div>
                {i < COMMITS.length - 1 && (
                  <div style={{ width: 40, height: 2, background: 'var(--border2)', margin: '0 4px', flexShrink: 0, marginBottom: 28 }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Three trees */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <Zone label="Repository (.git)" content={currentStep.repo} colorKey="repo" highlight={currentStep.repoHi} danger={sc.label === '--hard'} />
            <Zone label="Index (staging)" content={currentStep.index} colorKey="index" highlight={currentStep.indexHi} danger={sc.label === '--hard'} />
            <Zone label="Working Directory" content={currentStep.wd} colorKey="wd" highlight={currentStep.wdHi} danger={sc.label === '--hard'} />
          </div>

          {/* Step desc */}
          <div style={{ padding: '12px 16px', background: 'var(--surface)', borderRadius: 8, border: `1px solid ${sc.color}33`, marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: sc.color, marginBottom: 5 }}>{currentStep.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65 }}>{currentStep.desc}</div>
          </div>

          {step === sc.steps.length - 1 && (
            <div style={{ padding: '12px 16px', background: sc.label === '--hard' ? 'rgba(220,38,38,0.06)' : 'rgba(5,150,105,0.06)', border: `1px solid ${sc.label === '--hard' ? 'rgba(220,38,38,0.2)' : 'rgba(5,150,105,0.2)'}`, borderRadius: 8, marginBottom: 16, fontSize: 13, color: 'var(--text2)', lineHeight: 1.65 }}>
              <strong>When to use:</strong> {sc.useCase}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn" onClick={reset} style={{ fontSize: 12 }}>↺ Reset</button>
            <button className="btn" onClick={() => setStep(s => Math.min(sc.steps.length - 1, s + 1))}
              disabled={step >= sc.steps.length - 1}
              style={{ background: step < sc.steps.length - 1 ? sc.color : undefined, color: step < sc.steps.length - 1 ? '#fff' : undefined, borderColor: 'transparent', fontSize: 12 }}>
              Execute Reset →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   2. REVERT vs RESET SIDE-BY-SIDE
   Shows graph divergence for shared vs local history
══════════════════════════════════════════════════ */
function RevertVsResetVisualizer() {
  const [choice, setChoice] = useState(null); // 'revert' | 'reset'
  const [applied, setApplied] = useState(false);

  const commits = [
    { id: 'C1', x: 60,  y: 100, label: 'C1', msg: 'feat: login' },
    { id: 'C2', x: 180, y: 100, label: 'C2', msg: '🐛 bad commit', bad: true },
    { id: 'C3', x: 300, y: 100, label: 'C3', msg: 'fix: styles' },
    { id: 'C4', x: 420, y: 100, label: 'C4', msg: 'docs: readme', current: true },
  ];

  const revertResult = [
    ...commits,
    { id: 'R2', x: 540, y: 100, label: 'R2', msg: 'Revert "C2"', revert: true },
  ];

  const resetResult = [
    { id: 'C1', x: 60,  y: 100, label: 'C1', msg: 'feat: login' },
    { id: 'C2', x: 180, y: 100, label: 'C2', msg: '🐛 bad commit', bad: true, dimmed: true },
    { id: 'C3', x: 300, y: 100, label: 'C3', msg: 'fix: styles', dimmed: true },
    { id: 'C4', x: 420, y: 100, label: 'C4', msg: 'docs: readme', dimmed: true },
    { id: 'C1h', x: 180, y: 100, label: 'C1', msg: 'feat: login', current: true, reset: true },
  ];

  const displayNodes = !applied ? commits : choice === 'revert' ? revertResult : resetResult;

  const NodeRow = ({ nodes }) => {
    const edges = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const a = nodes[i], b = nodes[i + 1];
      if (!b.reset) edges.push([a, b]);
    }

    return (
      <svg width="620" height="180" viewBox="0 0 620 180" style={{ display: 'block', maxWidth: '100%', overflowX: 'auto' }}>
        <defs>
          <marker id="rv-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill="var(--border2)" />
          </marker>
          <marker id="rv-arrow-green" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill="#059669" />
          </marker>
        </defs>
        {edges.map(([a, b], i) => (
          <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={b.revert ? '#059669' : 'var(--border2)'}
            strokeWidth={b.revert ? 2 : 1.5}
            strokeDasharray={b.dimmed ? '5 4' : undefined}
            markerEnd={b.revert ? 'url(#rv-arrow-green)' : 'url(#rv-arrow)'}
          />
        ))}
        {nodes.map((n, i) => {
          const fill = n.revert ? '#059669' : n.bad ? 'rgba(220,38,38,0.15)' : n.current ? 'var(--accent)' : 'var(--surface)';
          const stroke = n.revert ? '#059669' : n.bad ? '#dc2626' : n.current ? 'var(--accent)' : 'var(--border2)';
          return (
            <g key={n.id + i} style={{ opacity: n.dimmed ? 0.2 : 1, transition: 'opacity 0.4s' }}>
              <circle cx={n.x} cy={n.y} r={22} fill={fill} stroke={stroke} strokeWidth={n.bad || n.revert || n.current ? 2.5 : 1.5} />
              <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="11" fontWeight="700"
                fill={n.revert || n.current ? '#fff' : n.bad ? '#dc2626' : 'var(--text)'}
                fontFamily="var(--font-mono)">{n.label}</text>
              <text x={n.x} y={n.y + 40} textAnchor="middle" fontSize="9"
                fill={n.revert ? '#059669' : n.bad ? '#dc2626' : 'var(--text3)'}
                fontFamily="var(--font-mono)">{n.msg}</text>
              {n.revert && (
                <text x={n.x} y={n.y - 34} textAnchor="middle" fontSize="9"
                  fill="#059669" fontFamily="var(--font-mono)" fontWeight="700">new commit ✓</text>
              )}
              {n.current && !n.reset && (
                <text x={n.x} y={n.y - 34} textAnchor="middle" fontSize="9"
                  fill="var(--accent)" fontFamily="var(--font-mono)" fontWeight="700">HEAD</text>
              )}
              {n.reset && (
                <text x={n.x} y={n.y - 34} textAnchor="middle" fontSize="9"
                  fill="var(--red)" fontFamily="var(--font-mono)" fontWeight="700">HEAD (force-pushed)</text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg2)', marginBottom: 32 }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>↩ revert vs reset on shared history</span>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>C2 was a bad commit. It's already pushed to main. Choose your weapon:</div>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ overflowX: 'auto', marginBottom: 16 }}>
          <NodeRow nodes={displayNodes} />
        </div>

        {!applied ? (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => { setChoice('revert'); setApplied(true); }}
              style={{ background: '#059669', color: '#fff', borderColor: 'transparent', fontSize: 13 }}>
              git revert C2 (safe)
            </button>
            <button className="btn" onClick={() => { setChoice('reset'); setApplied(true); }}
              style={{ background: '#dc2626', color: '#fff', borderColor: 'transparent', fontSize: 13 }}>
              git reset --hard C1 (dangerous)
            </button>
          </div>
        ) : (
          <>
            <div style={{ padding: '14px 16px', background: choice === 'revert' ? 'rgba(5,150,105,0.07)' : 'rgba(220,38,38,0.07)', border: `1px solid ${choice === 'revert' ? 'rgba(5,150,105,0.2)' : 'rgba(220,38,38,0.2)'}`, borderRadius: 8, marginBottom: 16, fontSize: 13, color: 'var(--text2)', lineHeight: 1.65 }}>
              {choice === 'revert' ? (
                <>
                  <strong style={{ color: '#059669' }}>✓ git revert C2</strong> — Created a new commit R2 that is the exact inverse of C2's diff. C3 and C4 are still in history. Teammates who already pulled can simply pull again — no force push needed. The bad commit's effect is undone but its existence is preserved for audit purposes.
                </>
              ) : (
                <>
                  <strong style={{ color: '#dc2626' }}>⚠ git reset --hard + force push</strong> — C2, C3, and C4 are gone from your local history. But every teammate who pulled them now has a divergent history. Their next <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>git pull</code> will try to merge the deleted commits back in. You'll need to coordinate with every contributor to reset their branches too. This is a team emergency, not a fix.
                </>
              )}
            </div>
            <button className="btn" onClick={() => { setChoice(null); setApplied(false); }} style={{ fontSize: 12 }}>↺ Reset</button>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   3. REFLOG EXPLORER
   Simulated git reflog with recovery walkthrough
══════════════════════════════════════════════════ */
function ReflogExplorer() {
  const entries = [
    { idx: 0, ref: 'HEAD@{0}', hash: 'f3a9b2c', action: 'reset: moving to HEAD~2',   msg: '← you are here (after bad reset)' },
    { idx: 1, ref: 'HEAD@{1}', hash: 'g7h8i9d', action: 'commit: feat: add payments', msg: 'feat: add payments' },
    { idx: 2, ref: 'HEAD@{2}', hash: 'k1l2m3n', action: 'commit: fix: cart total',   msg: 'fix: cart total' },
    { idx: 3, ref: 'HEAD@{3}', hash: 'p4q5r6s', action: 'rebase -i (finish)',         msg: 'rebased onto main' },
    { idx: 4, ref: 'HEAD@{4}', hash: 'a1b2c3d', action: 'checkout: moving from main', msg: 'switched from main' },
  ];

  const [selected, setSelected] = useState(null);
  const [recovered, setRecovered] = useState(false);

  const sel = entries.find(e => e.idx === selected);

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg2)', marginBottom: 32 }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>🔦 git reflog — The Safety Net</span>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>You ran <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, background: 'var(--bg3)', padding: '1px 4px', borderRadius: 3 }}>git reset --hard HEAD~2</code> and lost two commits. They're not gone. Click a reflog entry to recover.</div>
      </div>
      <div style={{ padding: 20 }}>
        {/* Reflog terminal */}
        <div style={{ background: 'var(--bg2)', borderRadius: 8, padding: 16, marginBottom: 16, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          <div style={{ color: '#39d353', marginBottom: 10 }}>$ git reflog</div>
          {entries.map(e => (
            <div key={e.idx} onClick={() => { setSelected(e.idx); setRecovered(false); }}
              style={{ display: 'flex', gap: 12, padding: '6px 8px', borderRadius: 5, cursor: 'pointer', marginBottom: 3, border: `1px solid ${selected === e.idx ? '#3b82f655' : 'transparent'}`, background: selected === e.idx ? 'rgba(59,130,246,0.08)' : e.idx === 0 ? 'rgba(220,38,38,0.06)' : 'transparent', transition: 'all 0.15s' }}>
              <span style={{ color: '#f0a500', flexShrink: 0 }}>{e.hash}</span>
              <span style={{ color: '#8b949e', flexShrink: 0, minWidth: 100 }}>{e.ref}</span>
              <span style={{ color: e.idx === 0 ? '#dc2626' : '#c9d1d9' }}>{e.action}</span>
              {e.idx === 0 && <span style={{ color: '#dc2626', marginLeft: 'auto', fontSize: 10 }}>← HERE</span>}
            </div>
          ))}
        </div>

        {selected === null && (
          <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, padding: 12 }}>
            Click an entry above to inspect and recover it.
          </div>
        )}

        {selected !== null && sel && (
          <div style={{ padding: '14px 16px', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)', marginBottom: 8 }}>Selected: {sel.ref} — {sel.hash}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)', marginBottom: 12 }}>{sel.action}</div>
            {!recovered ? (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="btn" onClick={() => setRecovered('reset')}
                  style={{ fontSize: 12, background: '#059669', color: '#fff', borderColor: 'transparent' }}>
                  git reset --hard {sel.hash}
                </button>
                <button className="btn" onClick={() => setRecovered('branch')}
                  style={{ fontSize: 12 }}>
                  git branch recovered-{sel.hash.slice(0,4)} {sel.hash}
                </button>
                <button className="btn" onClick={() => setRecovered('cherry')}
                  style={{ fontSize: 12 }}>
                  git cherry-pick {sel.hash}
                </button>
              </div>
            ) : (
              <div style={{ padding: '12px 14px', background: 'rgba(5,150,105,0.07)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: 6, fontSize: 13, color: 'var(--text2)', lineHeight: 1.65 }}>
                {recovered === 'reset' && <>✓ <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>git reset --hard {sel.hash}</code> — Your branch pointer jumps back to this exact state. All three trees restored. Best if you want to return your entire branch to this point.</>}
                {recovered === 'branch' && <>✓ <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>git branch recovered-{sel.hash.slice(0,4)} {sel.hash}</code> — Creates a new branch pointing at this commit. Safe way to inspect without touching your current branch. You can merge or cherry-pick selectively.</>}
                {recovered === 'cherry' && <>✓ <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>git cherry-pick {sel.hash}</code> — Applies just this commit's diff onto your current branch. Useful when you only want one specific commit back, not the whole history.</>}
              </div>
            )}
          </div>
        )}

        <div style={{ padding: '12px 16px', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
          <div style={{ color: 'var(--text2)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: 8, fontSize: 13 }}>How long does reflog keep entries?</div>
          <div>git config gc.reflogExpire &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; → default: 90 days</div>
          <div>git config gc.reflogExpireUnreachable → default: 30 days</div>
          <div style={{ marginTop: 8, color: 'var(--text3)', fontSize: 11 }}>Reflog is LOCAL only. It's never pushed to a remote. It exists only in your .git/logs/ directory.</div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   4. GIT RESTORE SANDBOX
   Interactive file-state manipulator
══════════════════════════════════════════════════ */
function RestoreSandbox() {
  const initial = {
    committed: 'function login(user) {\n  return db.find(user);\n}',
    staged:    'function login(user, pass) {\n  return db.find(user, pass);\n}',
    wd:        'function login(user, pass) {\n  console.log("DEBUG");\n  return db.find(user, pass);\n}',
  };

  const [state, setState] = useState({ ...initial });
  const [log, setLog] = useState([]);
  const [file] = useState('src/auth.js');

  const addLog = (cmd, result) => setLog(l => [{ cmd, result }, ...l].slice(0, 5));

  const unstage = () => {
    setState(s => ({ ...s, staged: s.committed }));
    addLog(`git restore --staged ${file}`, 'Index reset to last commit. Working directory unchanged.');
  };

  const discardWD = () => {
    setState(s => ({ ...s, wd: s.staged }));
    addLog(`git restore ${file}`, '⚠ Working directory changes discarded. Cannot be undone!');
  };

  const discardAll = () => {
    setState(s => ({ ...s, staged: s.committed, wd: s.committed }));
    addLog(`git restore --staged ${file} && git restore ${file}`, 'Both staged and working directory changes discarded.');
  };

  const resetAll = () => { setState({ ...initial }); setLog([]); };

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg2)', marginBottom: 32 }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>📄 git restore Sandbox</span>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>See how restore moves changes between the three states of a file.</div>
        </div>
        <button className="btn" onClick={resetAll} style={{ fontSize: 12 }}>↺ Reset</button>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'Last Commit (HEAD)', key: 'committed', color: '#059669', desc: 'What\'s in .git — permanent' },
            { label: 'Index (Staged)',     key: 'staged',    color: '#3b82f6', desc: 'What git add put here' },
            { label: 'Working Directory', key: 'wd',        color: '#ea580c', desc: 'Your actual file on disk' },
          ].map(z => (
            <div key={z.key} style={{ background: 'var(--surface)', border: `1px solid ${z.color}33`, borderRadius: 8, padding: 12 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: z.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{z.label}</div>
              <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 10 }}>{z.desc}</div>
              <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text2)', background: 'var(--bg2)', borderRadius: 4, padding: '8px 10px', overflowX: 'auto', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {state[z.key]}
              </pre>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <button className="btn" onClick={unstage} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, borderColor: '#3b82f655', color: '#3b82f6' }}>
            git restore --staged {file}
          </button>
          <button className="btn" onClick={discardWD} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, borderColor: '#ea580c55', color: '#ea580c' }}>
            git restore {file}
          </button>
          <button className="btn" onClick={discardAll} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, borderColor: '#dc262655', color: '#dc2626' }}>
            discard all changes
          </button>
        </div>

        {/* Activity log */}
        {log.length > 0 && (
          <div style={{ background: 'var(--bg2)', borderRadius: 8, padding: 12, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            {log.map((l, i) => (
              <div key={i} style={{ marginBottom: i < log.length - 1 ? 10 : 0, opacity: i === 0 ? 1 : 0.5 }}>
                <div style={{ color: '#39d353' }}>$ {l.cmd}</div>
                <div style={{ color: l.result.startsWith('⚠') ? '#dc2626' : '#8b949e', marginTop: 2 }}>{l.result}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   5. UNDO DECISION TREE
   Interactive flowchart — answers the question
   "which command do I actually need right now?"
══════════════════════════════════════════════════ */
function UndoDecisionTree() {
  const nodes = {
    start: {
      q: 'Where do your changes currently live?',
      opts: [
        { label: 'Uncommitted working directory / staging', next: 'uncommitted' },
        { label: 'In a local commit (not yet pushed)',       next: 'local_commit' },
        { label: 'Already pushed to a shared branch',       next: 'pushed' },
        { label: 'I lost commits after a reset/checkout',   next: 'lost' },
      ]
    },
    uncommitted: {
      q: 'What do you want to discard?',
      opts: [
        { label: 'Unstage a file (keep edits on disk)',    next: 'ans_restore_staged' },
        { label: 'Discard working directory edits',        next: 'ans_restore_wd' },
        { label: 'Discard ALL uncommitted changes',        next: 'ans_restore_all' },
        { label: 'Stash changes temporarily',             next: 'ans_stash' },
      ]
    },
    local_commit: {
      q: 'What do you want to do?',
      opts: [
        { label: 'Fix the commit message or add a file',  next: 'ans_amend' },
        { label: 'Undo commit, keep changes staged',      next: 'ans_soft' },
        { label: 'Undo commit, keep changes unstaged',    next: 'ans_mixed' },
        { label: 'Undo commit AND discard all changes',   next: 'ans_hard' },
        { label: 'Rewrite / reorder multiple commits',    next: 'ans_rebase_i' },
      ]
    },
    pushed: {
      q: 'Has anyone else pulled these commits?',
      opts: [
        { label: 'Yes (or I don\'t know)',                next: 'ans_revert' },
        { label: 'No — only I have pulled them',          next: 'ans_reset_force' },
      ]
    },
    lost: {
      q: 'How did you lose the commits?',
      opts: [
        { label: 'git reset --hard',                      next: 'ans_reflog_reset' },
        { label: 'Deleted a branch',                      next: 'ans_reflog_branch' },
        { label: 'Bad rebase / merge --abort',            next: 'ans_reflog_orig' },
      ]
    },
    // Answers
    ans_restore_staged:   { answer: true, cmd: 'git restore --staged <file>', why: 'Moves the file from the index back to the working directory. Equivalent to the old `git reset HEAD <file>`. Your edits on disk are preserved.', safe: true },
    ans_restore_wd:       { answer: true, cmd: 'git restore <file>', why: 'Discards working directory changes and restores the file to the index version. PERMANENT — no undo.', safe: false },
    ans_restore_all:      { answer: true, cmd: 'git restore --staged . && git restore .', why: 'First unstages everything, then discards all working directory changes. Equivalent to git reset --hard HEAD but without moving the branch pointer.', safe: false },
    ans_stash:            { answer: true, cmd: 'git stash push -m "description"', why: 'Saves all uncommitted changes (staged + unstaged) to a temporary stack. Working directory becomes clean. Restore later with `git stash pop`.', safe: true },
    ans_amend:            { answer: true, cmd: 'git commit --amend', why: 'Folds staged changes into the last commit and/or opens editor to fix the message. Creates a new SHA — only safe if not yet pushed.', safe: true },
    ans_soft:             { answer: true, cmd: 'git reset --soft HEAD~1', why: 'Moves HEAD back one commit. Index retains the changes staged. Working directory untouched. You can immediately re-commit with a corrected message.', safe: true },
    ans_mixed:            { answer: true, cmd: 'git reset HEAD~1', why: 'Default mode. Moves HEAD back, clears the index. Working directory is untouched — changes appear as unstaged modifications. Use `git add -p` to re-stage surgically.', safe: true },
    ans_hard:             { answer: true, cmd: 'git reset --hard HEAD~1', why: 'Moves HEAD back AND wipes working directory + index. Changes are gone from disk. Recoverable via `git reflog` within 30 days.', safe: false },
    ans_rebase_i:         { answer: true, cmd: 'git rebase -i HEAD~N', why: 'Opens interactive rebase for the last N commits. Lets you reorder, squash, fixup, reword, or drop commits. Creates new SHAs — force-push required after.', safe: true },
    ans_revert:           { answer: true, cmd: 'git revert <bad-commit-sha>', why: 'Creates a new commit that is the exact inverse of the bad commit. Safe for shared branches — history is preserved, no force-push needed. Teammates just pull normally.', safe: true },
    ans_reset_force:      { answer: true, cmd: 'git reset --hard <target> && git push --force-with-lease', why: 'Rewrite local history and force-push. Only safe if you\'re certain no one else has pulled. Coordinate with your team first. Use --force-with-lease never --force.', safe: false },
    ans_reflog_reset:     { answer: true, cmd: 'git reflog\ngit reset --hard HEAD@{N}', why: 'git reflog shows every position HEAD has been in. Find the entry BEFORE your bad reset (it will say "reset: moving to..."). Reset --hard to that ref.', safe: true },
    ans_reflog_branch:    { answer: true, cmd: 'git reflog\ngit branch recovered-branch HEAD@{N}', why: 'Find the last checkout or commit on the deleted branch in reflog. Create a new branch pointing at that SHA to recover the commits.', safe: true },
    ans_reflog_orig:      { answer: true, cmd: 'git reflog\ngit reset --hard ORIG_HEAD', why: 'Git saves the pre-operation HEAD as ORIG_HEAD during merges and rebases. If it\'s still there: git reset --hard ORIG_HEAD. Otherwise use git reflog to find the right SHA.', safe: true },
  };

  const [path, setPath] = useState(['start']);
  const current = nodes[path[path.length - 1]];

  const go = (next) => setPath(p => [...p, next]);
  const back = () => setPath(p => p.slice(0, -1));
  const restart = () => setPath(['start']);

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg2)', marginBottom: 32 }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>🌲 Undo Decision Tree</span>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>Answer the questions to find exactly the right command for your situation.</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {path.length > 1 && <button className="btn" onClick={back} style={{ fontSize: 12 }}>← Back</button>}
          <button className="btn" onClick={restart} style={{ fontSize: 12 }}>↺ Start over</button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ padding: '10px 20px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        {path.map((p, i) => (
          <React.Fragment key={p + i}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: i === path.length - 1 ? 'var(--accent)' : 'var(--text3)', cursor: i < path.length - 1 ? 'pointer' : 'default' }}
              onClick={() => i < path.length - 1 && setPath(path.slice(0, i + 1))}>
              {p.replace('ans_', '').replace(/_/g, ' ')}
            </span>
            {i < path.length - 1 && <span style={{ color: 'var(--border2)', fontSize: 10 }}>›</span>}
          </React.Fragment>
        ))}
      </div>

      <div style={{ padding: 24 }}>
        {!current.answer ? (
          <>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20, color: 'var(--text)' }}>
              {current.q}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {current.opts.map((opt, i) => (
                <button key={i} onClick={() => go(opt.next)}
                  style={{ padding: '14px 18px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'rgba(59,130,246,0.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}>
                  {opt.label}
                  <span style={{ color: 'var(--accent)', fontSize: 16, flexShrink: 0 }}>›</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 24 }}>{current.safe ? '✅' : '⚠️'}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: current.safe ? '#059669' : '#dc2626' }}>
                {current.safe ? 'Safe command found' : 'Destructive — use with care'}
              </span>
            </div>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 14, background: 'var(--bg2)', color: '#39d353', borderRadius: 8, padding: '16px 20px', marginBottom: 16, whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
              $ {current.cmd}
            </pre>
            <div style={{ padding: '14px 16px', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>
              {current.why}
            </div>
            {!current.safe && (
              <div style={{ marginTop: 12, padding: '12px 16px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, fontSize: 12, color: '#dc2626', lineHeight: 1.6 }}>
                <strong>Recovery path if this goes wrong:</strong> <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>git reflog</code> → find the SHA from before the operation → <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>git reset --hard &lt;sha&gt;</code>. Available for 30 days.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════ */
export default function Undo() {
  const r1 = useFadeIn(), r2 = useFadeIn(), r3 = useFadeIn();
  const r4 = useFadeIn(), r5 = useFadeIn(), r6 = useFadeIn();

  return (
    <div className="page-content">
      <section className="section">

        {/* ── Header ── */}
        <div className="section-header-wrap" ref={r1}>
          <div className="section-bg-num">09</div>
          <div className="section-label">Mastery</div>
          <h2 className="section-title">Undoing Things</h2>
          <p className="section-desc">
            "How do I fix this?" is the most common Git question. Choosing the wrong undo command either loses work permanently or breaks your team's shared history. There are exactly the right tools for each situation — knowing which one to reach for is what separates juniors from seniors.
          </p>
        </div>

        <Callout type="info" title="The core question before any undo">
          Ask exactly one question first: <strong>Have these commits been pushed to a shared branch?</strong> If yes — your only safe option is <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>git revert</code>. Everything else rewrites history and will cause problems for teammates who already pulled.
        </Callout>

        {/* ── 1. Decision Tree ── */}
        <div className="fade-in-section" ref={r2}>
          <h3 className="subsection-title">The Undo Decision Tree — Find Your Command</h3>
          <p className="body-text">
            Don't memorize commands in isolation. Answer these questions in order and arrive at exactly the right command for your exact situation.
          </p>
          <UndoDecisionTree />
        </div>

        <div className="divider" />

        {/* ── 2. git revert ── */}
        <div className="fade-in-section" ref={r3}>
          <h3 id="git-revert" className="subsection-title">git revert — The Only Safe Undo for Shared History</h3>
          <p className="body-text">
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>git revert</code> creates a <strong>new commit</strong> whose diff is the exact mathematical inverse of the target commit. The original bad commit stays in history — it's not deleted. The new revert commit cancels out its effect going forward.
          </p>
          <RevertVsResetVisualizer />

          <Tabs tabs={[
            {
              label: 'revert flags',
              content: (
                <CommandTable rows={[
                  { flag: 'git revert HEAD', effect: 'Revert the most recent commit. Opens editor for the revert message.' },
                  { flag: 'git revert <sha>', effect: 'Revert any specific commit by hash. The commit does not need to be recent.' },
                  { flag: 'git revert HEAD~3..HEAD', effect: 'Revert a range of commits. Creates one revert commit per original commit — in reverse order.' },
                  { flag: 'git revert -n / --no-commit', effect: 'Stages the inverse diff but does NOT create a commit. Lets you combine multiple reverts into a single cleanup commit.' },
                  { flag: 'git revert -m 1 <merge-sha>', effect: 'Revert a merge commit. The -m flag specifies the "mainline" parent (1 = the branch you merged into). Required for merge commits because Git needs to know which side is "ours".' },
                ]} />
              )
            },
            {
              label: 'Reverting a merge commit',
              content: (
                <>
                  <p className="body-text">
                    Merge commits have two parents. To revert one, you must tell Git which parent represents the "mainline" — the branch that should remain intact.
                  </p>
                  <CodeBlock language="bash" code={`# Your merge commit has two parents:
# Parent 1: main (the branch you were on)
# Parent 2: feature/payments (the branch you merged in)

git revert -m 1 <merge-commit-sha>
# -m 1 = "keep parent 1 (main) as the base, undo everything from parent 2"

# ⚠ IMPORTANT: If you later want to re-merge the feature branch,
# you must FIRST revert the revert commit. Otherwise Git sees the
# feature commits as "already merged" and ignores them:

git revert <revert-commit-sha>   # undo the revert
git merge feature/payments       # now re-merge works correctly`} />
                  <DeepDive title="Why reverting a merge doesn't 'unmerge' the branch">
                    <p>When you revert a merge commit, Git creates a new commit that undoes the file changes from the merge. But Git's merge tracking is based on commit ancestry, not file contents. The feature branch's commits are still reachable ancestors of main. If you try to merge the feature branch again, Git sees that all its commits are already ancestors of main and reports "Already up to date" — even though the files were reverted. This is why you must revert the revert first.</p>
                  </DeepDive>
                </>
              )
            },
          ]} />
        </div>

        <div className="divider" />

        {/* ── 3. git reset ── */}
        <div className="fade-in-section" ref={r4}>
          <h3 id="git-reset" className="subsection-title">git reset — Rewriting Local History</h3>
          <p className="body-text">
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>git reset</code> moves the current branch pointer to a different commit. The three modes control how far the reset "cascades" through Git's three trees: the repository (commit history), the index (staging area), and the working directory.
          </p>
          <ResetModeVisualizer />

          <Tabs tabs={[
            {
              label: 'reset flags',
              content: (
                <CommandTable rows={[
                  { flag: 'git reset --soft HEAD~1', effect: 'Move HEAD back one commit. Index + working directory unchanged. Changes from the undone commit are now staged.' },
                  { flag: 'git reset HEAD~1', effect: 'Default (--mixed). Move HEAD back, clear the index. Working directory untouched. Changes appear as unstaged modifications.' },
                  { flag: 'git reset --hard HEAD~1', effect: 'Move HEAD back, clear index, clear working directory. Changes are deleted from disk. Recoverable via reflog for ~30 days.' },
                  { flag: 'git reset HEAD~N', effect: 'Go back N commits. All commits between HEAD and the target are "undone" according to the mode.' },
                  { flag: 'git reset <sha>', effect: 'Reset to a specific commit hash instead of a relative ref.' },
                  { flag: 'git reset HEAD <file>', effect: 'Unstage a specific file only (mixed reset on a single file path). Does not move the branch pointer.' },
                ]} />
              )
            },
            {
              label: 'reset on a file path',
              content: (
                <>
                  <p className="body-text">
                    When you pass a file path to <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>git reset</code>, it does NOT move the branch pointer. Instead it only resets that file in the index to the version from the specified commit.
                  </p>
                  <CodeBlock language="bash" code={`# Unstage one specific file (reset just that file's index entry)
git reset HEAD src/auth.js
# Equivalent modern syntax:
git restore --staged src/auth.js

# Reset a specific file to 3 commits ago
git reset HEAD~3 src/auth.js
# Now src/auth.js in the index matches its version 3 commits ago
# Working directory is still your current edits
# You can commit to "revert" just that file without affecting others`} />
                  <DeepDive title="What git reset actually writes to disk">
                    <p><code style={{ fontFamily: 'var(--font-mono)' }}>git reset</code> without a file path writes a new SHA to <code style={{ fontFamily: 'var(--font-mono)' }}>.git/refs/heads/&lt;branch&gt;</code> (or <code style={{ fontFamily: 'var(--font-mono)' }}>.git/HEAD</code> if detached). With <code style={{ fontFamily: 'var(--font-mono)' }}>--hard</code> it additionally overwrites the index file at <code style={{ fontFamily: 'var(--font-mono)' }}>.git/index</code> and checks out files to the working directory. With <code style={{ fontFamily: 'var(--font-mono)' }}>--mixed</code> it rewrites the index but skips the working directory. With <code style={{ fontFamily: 'var(--font-mono)' }}>--soft</code> it only moves the pointer — index and working directory files are not touched at all.</p>
                  </DeepDive>
                </>
              )
            },
          ]} />
        </div>

        <div className="divider" />

        {/* ── 4. git restore ── */}
        <div className="fade-in-section" ref={r5}>
          <h3 id="git-restore" className="subsection-title">git restore — Discard Without Moving Pointers</h3>
          <p className="body-text">
            Introduced in Git 2.23, <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>git restore</code> was split from <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>git reset</code> and <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>git checkout</code> to give file-level undo its own clear command. It manipulates files in the working directory and index without touching the branch pointer.
          </p>

          <RestoreSandbox />

          <Tabs tabs={[
            {
              label: 'restore flags',
              content: (
                <CommandTable rows={[
                  { flag: 'git restore <file>', effect: 'Restore working directory file from the index (staged) version. Discards unstaged edits. PERMANENT.' },
                  { flag: 'git restore --staged <file>', effect: 'Restore index (staged) version from HEAD. Effectively "unstages" the file. Working directory untouched.' },
                  { flag: 'git restore --staged --worktree <file>', effect: 'Restore BOTH index and working directory from HEAD. Discard all changes to the file.' },
                  { flag: 'git restore --source=<sha> <file>', effect: 'Restore a file to the version from a specific commit. Does NOT create a commit. Useful to "bring back" a deleted file.' },
                  { flag: 'git restore .', effect: 'Restore all files in the working directory. Discards all unstaged changes throughout the project.' },
                ]} />
              )
            },
            {
              label: 'Recovering a deleted file',
              content: (
                <>
                  <p className="body-text">
                    One of the most useful but under-known uses of <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>git restore --source</code> is recovering a file that was deleted in a past commit.
                  </p>
                  <CodeBlock language="bash" code={`# File was deleted 3 commits ago. Find when:
git log --diff-filter=D --summary -- src/legacy.js
# Shows: deleted in commit a3f9c12

# Restore it from one commit before the deletion:
git restore --source=a3f9c12~1 src/legacy.js
# The file is now back in your working directory, unstaged.
# git add + git commit to officially restore it.

# Alternative using git checkout (older syntax):
git checkout a3f9c12~1 -- src/legacy.js`} />
                </>
              )
            },
          ]} />

          <WarningBox type="danger" title="git restore (without --staged) has no undo">
            Unlike almost everything else in Git, <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>git restore &lt;file&gt;</code> (without <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>--staged</code>) overwrites your working directory file from the index. The previous working directory content is never written to the Git object store — there is no reflog for uncommitted file changes. It is truly gone. Always double-check with <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>git diff</code> before running it.
          </WarningBox>
        </div>

        <div className="divider" />

        {/* ── 5. reflog ── */}
        <div className="fade-in-section" ref={r6}>
          <h3 id="git-reflog" className="subsection-title">git reflog — The Ultimate Safety Net</h3>
          <p className="body-text">
            The reflog is Git's flight recorder. Every time HEAD moves — from a commit, reset, rebase, merge, checkout, or cherry-pick — Git writes an entry to <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>.git/logs/HEAD</code>. Even after a <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>git reset --hard</code>, the "lost" commits are still in the object store — just unreachable. The reflog is how you find them.
          </p>

          <ReflogExplorer />

          <Tabs tabs={[
            {
              label: 'reflog commands',
              content: (
                <CommandTable rows={[
                  { flag: 'git reflog', effect: 'Show the full HEAD reflog. Every position HEAD has been in, newest first.' },
                  { flag: 'git reflog show <branch>', effect: 'Show the reflog for a specific branch ref, not HEAD.' },
                  { flag: 'git reflog --all', effect: 'Show reflogs for all refs (all branches, stashes, etc.).' },
                  { flag: 'git reflog expire --expire=30.days', effect: 'Manually expire reflog entries older than 30 days.' },
                  { flag: 'git reset --hard HEAD@{N}', effect: 'Jump back to the Nth reflog entry. Useful after an accidental reset.' },
                  { flag: 'git branch recovered HEAD@{N}', effect: 'Create a branch at a specific reflog position without moving HEAD.' },
                ]} />
              )
            },
            {
              label: 'reflog internals',
              content: (
                <>
                  <p className="body-text">The reflog is stored as simple append-only log files in <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>.git/logs/</code>. It is entirely local — never pushed, never fetched.</p>
                  <CodeBlock language="bash" code={`# Reflog files on disk:
ls .git/logs/
# HEAD                         ← every HEAD movement
# refs/heads/main              ← movements of the main branch pointer
# refs/heads/feature/payments  ← per-branch log

# Raw format of a reflog entry:
cat .git/logs/HEAD
# <old-sha> <new-sha> <author> <timestamp> <timezone> <message>
# a1b2c3d4 f9e8d7c6 Jane <j@co.io> 1734500000 +0000 reset: moving to HEAD~2

# The @{N} syntax references entries by index:
# HEAD@{0}  = current HEAD
# HEAD@{1}  = one action ago
# HEAD@{yesterday} = where HEAD was yesterday
# HEAD@{2025-01-01} = where HEAD was on a specific date`} />
                  <DeepDive title="Garbage collection and reflog expiry">
                    <p>Git's garbage collector (<code style={{ fontFamily: 'var(--font-mono)' }}>git gc</code>) will eventually prune unreachable objects — the ones orphaned by resets and rebases. But it won't touch objects still referenced by the reflog. Default expiry is 90 days for reachable commits and 30 days for unreachable ones (configurable via <code style={{ fontFamily: 'var(--font-mono)' }}>gc.reflogExpire</code> and <code style={{ fontFamily: 'var(--font-mono)' }}>gc.reflogExpireUnreachable</code>). Within those windows, your "lost" commits are always recoverable. After expiry, they're gone forever.</p>
                  </DeepDive>
                </>
              )
            },
          ]} />
        </div>

        <div className="divider" />

        {/* ── Quick Reference ── */}
        <h3 className="subsection-title">Quick Reference</h3>
        <CodeBlock language="bash" code={`# ── REVERT (safe for shared history) ─────────────────
git revert HEAD                    # undo last commit with a new commit
git revert <sha>                   # undo any past commit
git revert -n HEAD~3..HEAD         # revert range, stage only (no commit)
git revert -m 1 <merge-sha>        # revert a merge commit

# ── RESET (local history only) ────────────────────────
git reset --soft HEAD~1            # undo commit, keep changes staged
git reset HEAD~1                   # undo commit, keep changes unstaged
git reset --hard HEAD~1            # undo commit + discard all changes
git reset HEAD <file>              # unstage a specific file

# ── RESTORE (file-level, no pointer movement) ─────────
git restore --staged <file>        # unstage (index → working dir)
git restore <file>                 # discard working dir changes (!)
git restore --source=<sha> <file>  # restore file from specific commit

# ── REFLOG (the safety net) ───────────────────────────
git reflog                         # show all HEAD movements
git reset --hard HEAD@{N}          # jump to Nth reflog entry
git branch recovered HEAD@{N}      # rescue lost commits as a branch
git stash list                     # stashes also appear here

# ── AMEND (last commit only, not pushed) ──────────────
git commit --amend                 # edit message + add staged files
git commit --amend --no-edit       # fold staged into last commit silently`} />

      </section>
    </div>
  );
}