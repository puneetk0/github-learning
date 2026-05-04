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
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ══════════════════════════════════════════
   1. MERGE TOPOLOGY VISUALIZER
   Click-through: FF vs 3-way, animated graph
══════════════════════════════════════════ */
function MergeTopologyVisualizer() {
  const [mode, setMode] = useState('ff');        // 'ff' | '3way' | 'squash' | 'noff'
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => { setStep(s => s + 1); setAnimating(false); }, 320);
  };
  const reset = () => { setStep(0); };

  const scenarios = {
    ff: {
      title: 'Fast-Forward Merge',
      color: '#059669',
      why: 'The target branch (main) has NOT moved since you created feature. main is a direct ancestor of feature. Git simply slides the main pointer forward — no new commit is created.',
      steps: [
        {
          label: 'Before merge',
          desc: 'main points at C. feature branched from C and has added D and E. main has NOT moved.',
          graph: {
            nodes: [
              { id: 'A', x: 60,  y: 80,  label: 'A', branch: null },
              { id: 'B', x: 160, y: 80,  label: 'B', branch: null },
              { id: 'C', x: 260, y: 80,  label: 'C', branch: 'main', branchColor: '#059669' },
              { id: 'D', x: 360, y: 80,  label: 'D', branch: null },
              { id: 'E', x: 460, y: 80,  label: 'E', branch: 'feature', branchColor: '#3b82f6' },
            ],
            edges: [['A','B'],['B','C'],['C','D'],['D','E']],
          }
        },
        {
          label: 'git merge feature',
          desc: 'Git detects the fast-forward opportunity. It moves the main pointer from C to E. Zero new commit objects created.',
          graph: {
            nodes: [
              { id: 'A', x: 60,  y: 80, label: 'A', branch: null },
              { id: 'B', x: 160, y: 80, label: 'B', branch: null },
              { id: 'C', x: 260, y: 80, label: 'C', branch: null },
              { id: 'D', x: 360, y: 80, label: 'D', branch: null },
              { id: 'E', x: 460, y: 80, label: 'E', branch: 'main + feature', branchColor: '#059669', highlight: true },
            ],
            edges: [['A','B'],['B','C'],['C','D'],['D','E']],
          }
        },
      ]
    },
    '3way': {
      title: '3-Way Merge',
      color: '#3b82f6',
      why: 'Both branches diverged from a common ancestor. Git must compare THREE snapshots: the common ancestor (C), the tip of main (F), and the tip of feature (E). It creates a brand new merge commit M with TWO parents.',
      steps: [
        {
          label: 'Before merge',
          desc: 'main has diverged — it has commit F added after the branch point. Both branches have unique work.',
          graph: {
            nodes: [
              { id: 'A', x: 60,  y: 80,  label: 'A' },
              { id: 'B', x: 160, y: 80,  label: 'B' },
              { id: 'C', x: 260, y: 80,  label: 'C', note: 'ancestor' },
              { id: 'F', x: 380, y: 80,  label: 'F', branch: 'main', branchColor: '#059669' },
              { id: 'D', x: 340, y: 170, label: 'D' },
              { id: 'E', x: 460, y: 170, label: 'E', branch: 'feature', branchColor: '#3b82f6' },
            ],
            edges: [['A','B'],['B','C'],['C','F'],['C','D'],['D','E']],
          }
        },
        {
          label: 'Finding the ancestor',
          desc: 'Git\'s merge-base algorithm walks both parent chains to find C — the most recent common ancestor. This is the "base" for the 3-way diff.',
          graph: {
            nodes: [
              { id: 'A', x: 60,  y: 80  },
              { id: 'B', x: 160, y: 80  },
              { id: 'C', x: 260, y: 80,  highlight: true, highlightColor: '#d97706', note: 'merge-base' },
              { id: 'F', x: 380, y: 80,  branch: 'main', branchColor: '#059669' },
              { id: 'D', x: 340, y: 170 },
              { id: 'E', x: 460, y: 170, branch: 'feature', branchColor: '#3b82f6' },
            ],
            edges: [['A','B'],['B','C'],['C','F'],['C','D'],['D','E']],
            highlight: ['C'],
          }
        },
        {
          label: 'Merge commit M created',
          desc: 'Git creates merge commit M. It has exactly two parents: F (from main) and E (from feature). The resulting tree is the union of both change sets.',
          graph: {
            nodes: [
              { id: 'A', x: 60,  y: 80  },
              { id: 'B', x: 160, y: 80  },
              { id: 'C', x: 260, y: 80  },
              { id: 'F', x: 380, y: 80  },
              { id: 'D', x: 340, y: 170 },
              { id: 'E', x: 460, y: 170 },
              { id: 'M', x: 560, y: 80,  branch: 'main', branchColor: '#059669', highlight: true, highlightColor: '#059669', note: 'merge commit' },
            ],
            edges: [['A','B'],['B','C'],['C','F'],['C','D'],['D','E'],['F','M'],['E','M']],
          }
        },
      ]
    },
    squash: {
      title: '--squash Merge',
      color: '#8b5cf6',
      why: 'All commits from feature are condensed into ONE staged change on main. Then you commit it manually with a clean message. The feature branch history is completely discarded — feature is NOT merged, just its net diff.',
      steps: [
        {
          label: 'Before squash',
          desc: 'feature has many "WIP" commits. You want a clean, single entry on main.',
          graph: {
            nodes: [
              { id: 'C', x: 100, y: 80, branch: 'main', branchColor: '#059669' },
              { id: 'D', x: 200, y: 170, label: 'D', note: 'WIP' },
              { id: 'E', x: 310, y: 170, label: 'E', note: 'typo' },
              { id: 'F', x: 420, y: 170, label: 'F', note: 'fix' },
              { id: 'G', x: 530, y: 170, label: 'G', branch: 'feature', branchColor: '#8b5cf6' },
            ],
            edges: [['C','D'],['D','E'],['E','F'],['F','G']],
          }
        },
        {
          label: 'git merge --squash feature',
          desc: 'Git computes the net diff of D+E+F+G and stages it in your index. No commit created yet. The feature branch pointer is NOT updated.',
          graph: {
            nodes: [
              { id: 'C', x: 100, y: 80, branch: 'main', branchColor: '#059669' },
              { id: 'D', x: 200, y: 170, dimmed: true },
              { id: 'E', x: 310, y: 170, dimmed: true },
              { id: 'F', x: 420, y: 170, dimmed: true },
              { id: 'G', x: 530, y: 170, branch: 'feature', branchColor: '#8b5cf6', dimmed: true },
              { id: 'staged', x: 280, y: 80, label: '📦', note: 'staged diff', highlightColor: '#8b5cf6', highlight: true },
            ],
            edges: [['C','staged']],
          }
        },
        {
          label: 'git commit -m "feat: ..."',
          desc: 'You write ONE clean commit message. S is a regular single-parent commit. The feature branch\'s messy history never appears in main\'s log.',
          graph: {
            nodes: [
              { id: 'C', x: 100, y: 80 },
              { id: 'D', x: 200, y: 170, dimmed: true },
              { id: 'E', x: 310, y: 170, dimmed: true },
              { id: 'F', x: 420, y: 170, dimmed: true },
              { id: 'G', x: 530, y: 170, branch: 'feature', branchColor: '#8b5cf6', dimmed: true },
              { id: 'S', x: 280, y: 80, label: 'S', branch: 'main', branchColor: '#059669', highlight: true, highlightColor: '#059669', note: 'squashed' },
            ],
            edges: [['C','S']],
          }
        },
      ]
    },
    noff: {
      title: '--no-ff (Preserve Branch)',
      color: '#db2777',
      why: 'Even when a fast-forward IS possible, --no-ff forces a merge commit. This preserves the fact that a feature was developed as a group of commits. Useful when you want your log to clearly show "this feature was developed here."',
      steps: [
        {
          label: 'Same graph as FF',
          desc: 'main is a direct ancestor of feature. A fast-forward IS possible. But we choose not to.',
          graph: {
            nodes: [
              { id: 'C', x: 200, y: 80, branch: 'main', branchColor: '#059669' },
              { id: 'D', x: 320, y: 80 },
              { id: 'E', x: 440, y: 80, branch: 'feature', branchColor: '#db2777' },
            ],
            edges: [['C','D'],['D','E']],
          }
        },
        {
          label: 'git merge --no-ff feature',
          desc: 'Git creates merge commit M even though it didn\'t need to. M has two parents: C (old main) and E (feature). History now shows the feature "envelope."',
          graph: {
            nodes: [
              { id: 'C', x: 200, y: 80 },
              { id: 'D', x: 320, y: 170 },
              { id: 'E', x: 440, y: 170, branch: 'feature', branchColor: '#db2777' },
              { id: 'M', x: 540, y: 80, branch: 'main', branchColor: '#059669', highlight: true, highlightColor: '#059669', note: 'forced merge' },
            ],
            edges: [['C','D'],['D','E'],['C','M'],['E','M']],
          }
        },
      ]
    }
  };

  const current = scenarios[mode];
  const currentStep = current.steps[Math.min(step, current.steps.length - 1)];
  const { nodes, edges } = currentStep.graph;

  const getNode = id => nodes.find(n => n.id === id);

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg2)', marginBottom: 32 }}>
      {/* Header */}
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>🔀 Merge Topology Explorer</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.entries(scenarios).map(([key, sc]) => (
            <button key={key} className="btn" onClick={() => { setMode(key); setStep(0); }}
              style={{ fontSize: 11, padding: '4px 10px', borderColor: mode === key ? sc.color : undefined, color: mode === key ? sc.color : undefined }}>
              {sc.title}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Graph */}
      <div style={{ padding: '24px 20px 0', overflowX: 'auto' }}>
        <svg width="640" height="240" viewBox="0 0 640 240" style={{ display: 'block', maxWidth: '100%' }}>
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="var(--border2)" />
            </marker>
            <marker id="arrow-highlight" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={current.color} />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map(([from, to], i) => {
            const a = getNode(from);
            const b = getNode(to);
            if (!a || !b) return null;
            const isHighlight = b.highlight;
            return (
              <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={isHighlight ? current.color : 'var(--border2)'}
                strokeWidth={isHighlight ? 2.5 : 1.5}
                strokeDasharray={b.dimmed ? '4 3' : undefined}
                markerEnd={isHighlight ? 'url(#arrow-highlight)' : 'url(#arrow)'}
                style={{ transition: 'all 0.35s ease', opacity: b.dimmed || a.dimmed ? 0.3 : 1 }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((n, i) => {
            const r = 22;
            const col = n.highlight ? (n.highlightColor || current.color) : n.dimmed ? 'var(--border2)' : 'var(--surface)';
            const textCol = n.highlight ? '#fff' : n.dimmed ? 'var(--border2)' : 'var(--text)';
            return (
              <g key={n.id} style={{ transition: 'all 0.35s ease', opacity: n.dimmed ? 0.3 : 1 }}>
                <circle cx={n.x} cy={n.y} r={r}
                  fill={col}
                  stroke={n.branchColor || (n.highlight ? n.highlightColor || current.color : 'var(--border2)')}
                  strokeWidth={n.highlight || n.branchColor ? 2.5 : 1.5}
                />
                <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="13" fontWeight="700"
                  fill={textCol} fontFamily="var(--font-mono)">{n.label || n.id}</text>

                {/* Branch label */}
                {n.branch && (
                  <g>
                    <rect x={n.x - 40} y={n.y - r - 28} width={80} height={20} rx={4}
                      fill={n.branchColor + '22'} stroke={n.branchColor + '55'} />
                    <text x={n.x} y={n.y - r - 14} textAnchor="middle" fontSize="10"
                      fill={n.branchColor} fontFamily="var(--font-mono)" fontWeight="600">
                      {n.branch}
                    </text>
                  </g>
                )}

                {/* Note label */}
                {n.note && (
                  <text x={n.x} y={n.y + r + 16} textAnchor="middle" fontSize="10"
                    fill="var(--text3)" fontFamily="var(--font-mono)" fontStyle="italic">
                    {n.note}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Step info */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ padding: '14px 16px', background: 'var(--surface)', borderRadius: 8, border: `1px solid ${current.color}33`, marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: current.color, marginBottom: 6 }}>
            Step {step + 1}/{current.steps.length}: {currentStep.label}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65 }}>{currentStep.desc}</div>
        </div>

        {step === 0 && (
          <div style={{ padding: '12px 16px', background: `${current.color}11`, border: `1px solid ${current.color}33`, borderRadius: 8, fontSize: 13, color: 'var(--text2)', lineHeight: 1.65, marginBottom: 16 }}>
            <strong style={{ color: current.color }}>Why this strategy?</strong> {current.why}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn" onClick={reset} style={{ fontSize: 12 }}>↺ Reset</button>
          <button className="btn" onClick={next} disabled={step >= current.steps.length - 1}
            style={{ background: step < current.steps.length - 1 ? current.color : undefined, color: step < current.steps.length - 1 ? '#fff' : undefined, borderColor: 'transparent', fontSize: 12 }}>
            Next Step →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   2. REBASE VISUALIZER  (full interactive)
══════════════════════════════════════════ */
function RebaseVisualizer() {
  const [phase, setPhase] = useState('before'); // before | park | move | replay | done
  const [replayIdx, setReplayIdx] = useState(0);

  const phases = ['before', 'park', 'move', 'replay', 'done'];
  const phaseIdx = phases.indexOf(phase);

  const advance = () => {
    if (phase === 'replay' && replayIdx < 1) { setReplayIdx(i => i + 1); return; }
    if (phase === 'replay' && replayIdx >= 1) { setPhase('done'); return; }
    const next = phases[phaseIdx + 1];
    if (next) setPhase(next);
  };

  const reset = () => { setPhase('before'); setReplayIdx(0); };

  const descriptions = {
    before:  { title: 'Before: Diverged history', text: 'You are on feature. main has moved ahead with commit F after the branch point C. Your branch has D and E. Both diverged from common ancestor C.' },
    park:    { title: 'Step 1: Git parks your commits', text: 'Git takes D and E and generates temporary patch files for each. Think of them as diff receipts. The original commits are set aside (they still exist in the repo but will become unreachable).' },
    move:    { title: 'Step 2: Branch pointer moves', text: 'Git repositions the feature branch pointer to sit on top of F — the current tip of main. Your working directory now looks like main.' },
    replay:  { title: `Step 3: Replaying patch ${replayIdx + 1}/2`, text: replayIdx === 0 ? 'Git applies the D patch on top of F. A brand new commit D\' is created. It has a different SHA than D even if the content is identical — because its parent is now F, not C.' : 'Git applies the E patch on top of D\'. New commit E\' is created. feature pointer now points here.' },
    done:    { title: 'Rebase complete — linear history!', text: 'D and E are now unreachable (will be garbage collected). D\' and E\' are new commits on top of F. The history is perfectly linear as if you developed the feature after all main commits.' },
  };

  const d = descriptions[phase === 'replay' ? 'replay' : phase];

  // Commit node definitions per phase
  const baseNodes = [
    { id:'A', x:50,  y:90,  label:'A' },
    { id:'B', x:140, y:90,  label:'B' },
    { id:'C', x:230, y:90,  label:'C', note:'ancestor' },
    { id:'F', x:340, y:90,  label:'F', branch:'main', branchColor:'#059669' },
  ];

  const featureNodes = {
    before: [
      { id:'D', x:310, y:190, label:'D' },
      { id:'E', x:420, y:190, label:'E', branch:'feature', branchColor:'#3b82f6' },
    ],
    park: [
      { id:'D', x:310, y:190, label:'D', dimmed:true, note:'parked' },
      { id:'E', x:420, y:190, label:'E', dimmed:true, branch:'feature (parked)', branchColor:'#3b82f6' },
    ],
    move: [
      { id:'D', x:310, y:190, label:'D', dimmed:true, note:'parked' },
      { id:'E', x:420, y:190, label:'E', dimmed:true },
    ],
    replay: [
      { id:'D',  x:310, y:190, label:'D',  dimmed:true, note:'parked' },
      { id:'E',  x:420, y:190, label:'E',  dimmed:true },
      ...(replayIdx >= 0 ? [{ id:"D'", x:450, y:90, label:"D'", highlight:true, highlightColor:'#3b82f6', note:'new SHA' }] : []),
      ...(replayIdx >= 1 ? [{ id:"E'", x:560, y:90, label:"E'", highlight:true, highlightColor:'#3b82f6', branch:'feature', branchColor:'#3b82f6', note:'new SHA' }] : []),
    ],
    done: [
      { id:'D',  x:310, y:190, label:'D',  dimmed:true, note:'unreachable' },
      { id:'E',  x:420, y:190, label:'E',  dimmed:true },
      { id:"D'", x:450, y:90, label:"D'", note:'new SHA' },
      { id:"E'", x:560, y:90, label:"E'", branch:'feature', branchColor:'#3b82f6', highlight:true, highlightColor:'#059669', note:'HEAD' },
    ],
  };

  const featureEdges = {
    before: [['C','D'],['D','E']],
    park:   [['C','D'],['D','E']],
    move:   [['C','D'],['D','E']],
    replay: [
      ['C','D'],['D','E'],
      ['F',"D'"],
      ...(replayIdx >= 1 ? [["D'","E'"]] : []),
    ],
    done:   [['C','D'],['D','E'],['F',"D'"],["D'","E'"]],
  };

  const allNodes = [...baseNodes, ...(featureNodes[phase] || [])];
  const allEdges = [['A','B'],['B','C'],['C','F'], ...(featureEdges[phase] || [])];
  const getNode = id => allNodes.find(n => n.id === id);

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg2)', marginBottom: 32 }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>⚙️ Rebase Engine — Step by Step</span>
        <button className="btn" onClick={reset} style={{ fontSize: 12 }}>↺ Reset</button>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: 'var(--border)', position: 'relative' }}>
        <div style={{ height: '100%', background: '#3b82f6', width: `${(phaseIdx / (phases.length - 1)) * 100}%`, transition: 'width 0.4s ease' }} />
      </div>

      {/* SVG */}
      <div style={{ padding: '24px 20px 8px', overflowX: 'auto' }}>
        <svg width="640" height="250" viewBox="0 0 640 250" style={{ display: 'block', maxWidth: '100%' }}>
          <defs>
            <marker id="rb-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill="var(--border2)" />
            </marker>
            <marker id="rb-arrow-blue" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill="#3b82f6" />
            </marker>
          </defs>

          {allEdges.map(([from, to], i) => {
            const a = getNode(from);
            const b = getNode(to);
            if (!a || !b) return null;
            const isNew = (from === 'F' || from === "D'") && !['A','B','C'].includes(from);
            return (
              <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={b.dimmed || a.dimmed ? 'var(--border)' : b.highlight ? '#3b82f6' : 'var(--border2)'}
                strokeWidth={b.highlight ? 2.5 : 1.5}
                strokeDasharray={b.dimmed ? '5 4' : undefined}
                markerEnd={b.highlight ? 'url(#rb-arrow-blue)' : 'url(#rb-arrow)'}
                style={{ transition: 'all 0.4s ease' }}
              />
            );
          })}

          {allNodes.map((n) => {
            const r = 22;
            const fill = n.highlight ? (n.highlightColor || '#3b82f6') : n.dimmed ? 'var(--bg2)' : 'var(--surface)';
            const stroke = n.branchColor || (n.highlight ? n.highlightColor || '#3b82f6' : 'var(--border2)');
            return (
              <g key={n.id} style={{ transition: 'all 0.4s ease', opacity: n.dimmed ? 0.28 : 1 }}>
                <circle cx={n.x} cy={n.y} r={r} fill={fill} stroke={stroke} strokeWidth={n.highlight || n.branchColor ? 2.5 : 1.5} />
                <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="12" fontWeight="700"
                  fill={n.highlight ? '#fff' : n.dimmed ? 'var(--text3)' : 'var(--text)'}
                  fontFamily="var(--font-mono)">{n.label || n.id}</text>
                {n.branch && (
                  <g>
                    <rect x={n.x - 44} y={n.y - r - 28} width={88} height={20} rx={4}
                      fill={n.branchColor + '22'} stroke={n.branchColor + '55'} />
                    <text x={n.x} y={n.y - r - 14} textAnchor="middle" fontSize="9"
                      fill={n.branchColor} fontFamily="var(--font-mono)" fontWeight="600">{n.branch}</text>
                  </g>
                )}
                {n.note && (
                  <text x={n.x} y={n.y + r + 16} textAnchor="middle" fontSize="9"
                    fill="var(--text3)" fontFamily="var(--font-mono)" fontStyle="italic">{n.note}</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Description */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ padding: '14px 16px', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: '#3b82f6', marginBottom: 6 }}>{d.title}</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65 }}>{d.text}</div>
        </div>
        <button className="btn" onClick={advance} disabled={phase === 'done'}
          style={{ background: phase !== 'done' ? '#3b82f6' : undefined, color: phase !== 'done' ? '#fff' : undefined, borderColor: 'transparent', fontSize: 13 }}>
          {phase === 'done' ? '✓ Complete' : 'Next Step →'}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   3. INTERACTIVE REBASE PLAYGROUND
   Simulate git rebase -i with draggable ops
══════════════════════════════════════════ */
function InteractiveRebasePlayground() {
  const initialCommits = [
    { id: 1, hash: 'a1b2c3', msg: 'feat: add cart component', op: 'pick' },
    { id: 2, hash: 'd4e5f6', msg: 'WIP', op: 'pick' },
    { id: 3, hash: 'g7h8i9', msg: 'fix typo', op: 'pick' },
    { id: 4, hash: 'j0k1l2', msg: 'fix: null check in cart', op: 'pick' },
    { id: 5, hash: 'm3n4o5', msg: 'more fixes', op: 'pick' },
  ];

  const [commits, setCommits] = useState(initialCommits);
  const [executed, setExecuted] = useState(false);
  const [result, setResult] = useState([]);

  const ops = ['pick', 'squash', 'fixup', 'reword', 'drop'];
  const opColors = { pick: '#059669', squash: '#3b82f6', fixup: '#8b5cf6', reword: '#d97706', drop: '#dc2626' };
  const opDesc = {
    pick:   'Use commit as-is',
    squash: 'Meld into previous, edit message',
    fixup:  'Meld into previous, discard message',
    reword: 'Use commit but edit message',
    drop:   'Remove commit entirely',
  };

  const setOp = (id, op) => setCommits(c => c.map(x => x.id === id ? { ...x, op } : x));

  const execute = () => {
    const out = [];
    let buffer = null;
    commits.forEach(c => {
      if (c.op === 'drop') return;
      if (c.op === 'pick' || c.op === 'reword') {
        if (buffer) out.push(buffer);
        buffer = { ...c, msgs: [c.msg], reworded: c.op === 'reword' };
      } else if (c.op === 'squash' || c.op === 'fixup') {
        if (!buffer) { buffer = { ...c, msgs: [c.msg] }; return; }
        if (c.op === 'squash') buffer.msgs.push(c.msg);
        buffer.hash = buffer.hash.slice(0, 4) + '…';
      }
    });
    if (buffer) out.push(buffer);
    setResult(out);
    setExecuted(true);
  };

  const reset = () => { setCommits(initialCommits); setExecuted(false); setResult([]); };

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg2)', marginBottom: 32 }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>✏️ git rebase -i HEAD~5 Simulator</span>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>Set an operation per commit, then Execute to see the resulting history.</div>
        </div>
        <button className="btn" onClick={reset} style={{ fontSize: 12 }}>↺ Reset</button>
      </div>
      <div style={{ padding: 20 }}>
        {!executed ? (
          <>
            {/* Op legend */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              {ops.map(op => (
                <div key={op} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: opColors[op] }} />
                  <span style={{ color: opColors[op], fontWeight: 700 }}>{op}</span>
                  <span style={{ color: 'var(--text3)' }}>— {opDesc[op]}</span>
                </div>
              ))}
            </div>

            {/* Commit list */}
            {commits.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10, padding: '10px 14px', background: 'var(--surface)', borderRadius: 8, border: `1px solid ${opColors[c.op]}44` }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', background: 'var(--bg3)', padding: '2px 6px', borderRadius: 4, flexShrink: 0 }}>{c.hash}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, flex: 1, color: c.op === 'drop' ? 'var(--text3)' : 'var(--text)', textDecoration: c.op === 'drop' ? 'line-through' : 'none' }}>{c.msg}</span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {ops.map(op => (
                    <button key={op} onClick={() => setOp(c.id, op)}
                      style={{ padding: '3px 9px', borderRadius: 4, border: `1px solid ${c.op === op ? opColors[op] : 'var(--border)'}`, background: c.op === op ? opColors[op] + '22' : 'transparent', color: c.op === op ? opColors[op] : 'var(--text3)', fontSize: 10, fontFamily: 'var(--font-mono)', cursor: 'pointer', transition: 'all 0.15s', fontWeight: c.op === op ? 700 : 400 }}>
                      {op}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button className="btn" onClick={execute} style={{ marginTop: 8, background: '#059669', color: '#fff', borderColor: 'transparent' }}>
              Execute Rebase
            </button>
          </>
        ) : (
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--green)', marginBottom: 16 }}>
              ✔ Rebase complete. Resulting commit history:
            </div>
            {result.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10, padding: '12px 14px', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--green)33' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', background: 'var(--bg3)', padding: '2px 6px', borderRadius: 4, flexShrink: 0, marginTop: 1 }}>{c.hash}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                    {c.msgs[0]}
                    {c.reworded && <span style={{ color: '#d97706', marginLeft: 8, fontSize: 10 }}>[message edited]</span>}
                  </div>
                  {c.msgs.length > 1 && c.msgs.slice(1).map((m, j) => (
                    <div key={j} style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginTop: 3 }}>  + squashed: {m}</div>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(5,150,105,0.07)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: 8, fontSize: 13, color: 'var(--text2)', lineHeight: 1.65 }}>
              <strong>Note:</strong> Every commit shown above has a brand new SHA — even the "pick" ones — because their parent pointer changed during the rebase. This is why you must <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>git push --force-with-lease</code> after an interactive rebase.
            </div>
            <button className="btn" onClick={reset} style={{ marginTop: 16 }}>↺ Try again</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   4. CHERRY-PICK VISUALIZER
══════════════════════════════════════════ */
function CherryPickVisualizer() {
  const [picked, setPicked] = useState(null);
  const [applied, setApplied] = useState(false);

  const devCommits = [
    { id: 'D1', hash: 'aa1', msg: 'feat: new dashboard UI', safe: false },
    { id: 'D2', hash: 'bb2', msg: 'fix(auth): patch CVE-2024-1234', safe: true, note: '← critical hotfix' },
    { id: 'D3', hash: 'cc3', msg: 'WIP: refactor payment', safe: false },
  ];

  const pick = (id) => { setPicked(id); setApplied(false); };
  const apply = () => setApplied(true);
  const reset = () => { setPicked(null); setApplied(false); };

  const pickedCommit = devCommits.find(c => c.id === picked);

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg2)', marginBottom: 32 }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>🍒 git cherry-pick Visualizer</span>
        <button className="btn" onClick={reset} style={{ fontSize: 12 }}>↺ Reset</button>
      </div>
      <div style={{ padding: 20 }}>
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65, marginBottom: 16 }}>
          <strong>Scenario:</strong> A critical security fix was merged into <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--bg3)', padding: '1px 5px', borderRadius: 3 }}>develop</code>. Production <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--bg3)', padding: '1px 5px', borderRadius: 3 }}>main</code> can't wait for the full develop merge. Cherry-pick just that commit.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Develop branch */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#8b5cf6', fontWeight: 700, marginBottom: 12 }}>develop branch</div>
            {devCommits.map(c => (
              <div key={c.id} onClick={() => pick(c.id)} style={{
                padding: '10px 12px', borderRadius: 6, marginBottom: 8, cursor: 'pointer',
                border: `1px solid ${picked === c.id ? (c.safe ? '#059669' : '#dc262655') : 'var(--border)'}`,
                background: picked === c.id ? (c.safe ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.06)') : 'var(--bg2)',
                transition: 'all 0.2s'
              }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', background: 'var(--bg3)', padding: '1px 5px', borderRadius: 3 }}>{c.hash}</span>
                  {c.note && <span style={{ fontSize: 10, color: '#059669', fontFamily: 'var(--font-mono)' }}>{c.note}</span>}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{c.msg}</div>
                {picked !== c.id && <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>Click to select →</div>}
              </div>
            ))}
          </div>

          {/* Main branch */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#059669', fontWeight: 700, marginBottom: 12 }}>main (production)</div>
            <div style={{ padding: '10px 12px', borderRadius: 6, marginBottom: 8, border: '1px solid var(--border)', background: 'var(--bg2)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>e9f0a</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>feat: v2.1.0 release</div>
            </div>

            {applied && pickedCommit && (
              <div style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #05966955', background: 'rgba(5,150,105,0.08)', animation: 'none' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', background: 'var(--bg3)', padding: '1px 5px', borderRadius: 3 }}>f1a2b3</span>
                  <span style={{ fontSize: 10, color: '#059669', fontFamily: 'var(--font-mono)' }}>cherry-picked ✓</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{pickedCommit.msg}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>New SHA — same diff as {pickedCommit.hash} but different parent</div>
              </div>
            )}

            {picked && !applied && (
              <div style={{ marginTop: 8 }}>
                {!pickedCommit?.safe && (
                  <div style={{ padding: '8px 12px', background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 6, fontSize: 12, color: 'var(--red)', marginBottom: 10, lineHeight: 1.5 }}>
                    ⚠ This commit includes unfinished WIP. Cherry-picking it to production is risky.
                  </div>
                )}
                <button className="btn" onClick={apply}
                  style={{ background: '#059669', color: '#fff', borderColor: 'transparent', fontSize: 12 }}>
                  git cherry-pick {pickedCommit?.hash} →
                </button>
              </div>
            )}
          </div>
        </div>

        {applied && (
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            <div style={{ color: 'var(--green)', marginBottom: 6 }}>$ git cherry-pick {pickedCommit?.hash}</div>
            <div style={{ color: 'var(--text2)' }}>[main f1a2b3] {pickedCommit?.msg}</div>
            <div style={{ color: 'var(--text3)', marginTop: 6, fontSize: 11 }}>
              Note: cherry-pick copies the DIFF, not the commit itself. The new commit (f1a2b3) has main's previous commit as its parent — not {pickedCommit?.hash}'s parent. Conflicts can occur if the surrounding code differs between branches.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   5. WORKTREE EXPLAINER (visual)
══════════════════════════════════════════ */
function WorktreeVisualizer() {
  const [showWorktree, setShowWorktree] = useState(false);

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg2)', marginBottom: 32 }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>📂 git worktree — Multiple Checkouts</span>
        <button className="btn" onClick={() => setShowWorktree(v => !v)} style={{ fontSize: 12 }}>
          {showWorktree ? 'Show Problem' : 'Add Worktree →'}
        </button>
      </div>
      <div style={{ padding: 20 }}>
        {!showWorktree ? (
          <>
            <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--text2)', lineHeight: 1.65 }}>
              <strong>The problem:</strong> You're deep in a feature. A P0 bug just came in on <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--bg3)', padding: '1px 5px', borderRadius: 3 }}>main</code>. The old workflow is painful:
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, background: '#000', borderRadius: 8, padding: 16, color: '#aaa', lineHeight: 2 }}>
              <div><span style={{ color: '#dc2626' }}>$ git stash</span>  <span style={{ color: '#555' }}># hope you don't forget</span></div>
              <div><span style={{ color: '#dc2626' }}>$ git checkout main</span></div>
              <div><span style={{ color: '#dc2626' }}>$ # fix bug, commit, push</span></div>
              <div><span style={{ color: '#dc2626' }}>$ git checkout feature/payments</span></div>
              <div><span style={{ color: '#dc2626' }}>$ git stash pop</span>  <span style={{ color: '#555' }}># pray for no conflicts</span></div>
            </div>
            <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 6, fontSize: 12, color: 'var(--red)' }}>
              Also: your build tools are reconfiguring on every branch switch. Node modules re-linking. Build caches invalidated.
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--text2)', lineHeight: 1.65 }}>
              <strong>The solution:</strong> <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--bg3)', padding: '1px 5px', borderRadius: 3 }}>git worktree add</code> gives you a second folder on disk, sharing the same <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--bg3)', padding: '1px 5px', borderRadius: 3 }}>.git</code> database, with a different branch checked out simultaneously.
            </div>
            <CodeBlock language="bash" code={`git worktree add ../my-project-hotfix main
# Creates a new folder at ../my-project-hotfix
# Has main checked out. Shares .git with your original folder.
# Open it in a SECOND VS Code window → fix bug → commit → done.
# Your feature branch in the original window: completely untouched.

git worktree list
# /home/dev/my-project          abc1234 [feature/payments]
# /home/dev/my-project-hotfix   def5678 [main]

git worktree remove ../my-project-hotfix   # cleanup when done`} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
              {[
                { label: '/my-project', branch: 'feature/payments', color: '#3b82f6', desc: 'Deep in your feature work. Untouched.' },
                { label: '/my-project-hotfix', branch: 'main', color: '#059669', desc: 'Separate folder. Fix the bug here. Same .git database.' },
              ].map((w, i) => (
                <div key={i} style={{ background: 'var(--surface)', border: `1px solid ${w.color}44`, borderRadius: 8, padding: 14 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>{w.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: w.color, fontWeight: 700, marginBottom: 8 }}>[ {w.branch} ]</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{w.desc}</div>
                  <div style={{ marginTop: 10, fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', padding: '6px 10px', background: 'var(--bg2)', borderRadius: 4 }}>
                    shared: .git/objects • .git/refs • .git/config
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function Branching() {
  const r1 = useFadeIn(), r2 = useFadeIn(), r3 = useFadeIn();
  const r4 = useFadeIn(), r5 = useFadeIn(), r6 = useFadeIn();

  return (
    <div className="page-content">
      <section className="section">

        {/* ── Header ── */}
        <div className="section-header-wrap" ref={r1}>
          <div className="section-bg-num">06</div>
          <div className="section-label">Collaboration</div>
          <h2 id="git-branch" className="section-title">Branching, Merging & Rebasing</h2>
          <p className="section-desc">
            The mathematics of combining divergent timelines. A commit graph is a Directed Acyclic Graph — every merge and rebase is a precise graph operation. Understanding the topology determines which algorithm Git uses.
          </p>
        </div>

        <Callout type="info" title="Branches are just pointers">
          A branch in Git is nothing more than a 41-byte file in <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>.git/refs/heads/</code> containing a single commit SHA. Creating a branch is instantaneous and costs almost zero disk space. The entire complexity of "branching" is just pointer arithmetic on the commit graph.
        </Callout>

        {/* ── 1. Merge Topologies ── */}
        <div className="fade-in-section" ref={r2}>
          <h3 id="git-merge" className="subsection-title">Merge Topologies — Click to Explore</h3>
          <p className="body-text">
            Git doesn't have a single merge algorithm. The one it picks depends entirely on the shape of the commit graph. Click each strategy below and step through the graph transformation.
          </p>
          <MergeTopologyVisualizer />

          <Tabs tabs={[
            {
              label: 'Merge Flags Reference',
              content: (
                <CommandTable rows={[
                  { flag: 'git merge <branch>', effect: 'Auto-detects: fast-forward if possible, otherwise 3-way merge with a merge commit.' },
                  { flag: 'git merge --no-ff <branch>', effect: 'Always create a merge commit even when FF is possible. Preserves the grouping of feature commits in history.' },
                  { flag: 'git merge --ff-only <branch>', effect: 'Refuse to merge if a fast-forward is NOT possible. Safe on CI pipelines to enforce linear history.' },
                  { flag: 'git merge --squash <branch>', effect: 'Condense all branch commits into one staged change. You commit it manually. Does NOT link branches — no merge commit, no parent reference.' },
                  { flag: 'git merge --abort', effect: 'Mid-conflict panic button. Restores working directory to pre-merge state.' },
                  { flag: 'git merge --strategy=ours', effect: 'Accepts all incoming changes from a merge but keeps our version of any conflicting files. Rarely used but useful for deprecating branches.' },
                ]} />
              )
            },
            {
              label: 'When to use which',
              content: (
                <>
                  <p className="body-text">The choice of merge strategy is a <strong>team convention</strong>, not a Git decision. Pick one and enforce it.</p>
                  <CommandTable rows={[
                    { flag: 'Fast-forward (default)', effect: 'Use when integrating short-lived, single-developer feature branches where linear history is more important than branch visibility.' },
                    { flag: '--no-ff', effect: 'Use when you want the git log graph to clearly show "this was a feature" — a bubble in the history. Common in GitFlow.' },
                    { flag: '--squash', effect: 'Use when a feature branch has many "WIP/fix typo" commits that add noise. Produces one clean commit per feature. GitHub\'s "Squash and merge" button does this.' },
                    { flag: 'Rebase then FF', effect: 'The cleanest strategy. Rebase the feature onto main first (linear history), then merge with FF. Every commit on main is meaningful and standalone. Common in trunk-based dev.' },
                  ]} />
                </>
              )
            },
            {
              label: 'The 3-way diff algorithm',
              content: (
                <>
                  <p className="body-text">
                    When Git does a 3-way merge, it doesn't compare the two branch tips directly. It compares three files per changed file: the <strong>ancestor version</strong>, the <strong>ours version</strong> (your branch), and the <strong>theirs version</strong> (incoming branch).
                  </p>
                  <CodeBlock language="bash" code={`# For a given file, git asks:
# 1. What was it at the common ancestor (merge-base)?
# 2. What did OUR branch change it to?
# 3. What did THEIR branch change it to?

# Decision table:
# ancestor=X, ours=X, theirs=Y  →  take Y (they changed it, we didn't)
# ancestor=X, ours=Y, theirs=X  →  take Y (we changed it, they didn't)
# ancestor=X, ours=Y, theirs=Y  →  take Y (both made same change, no conflict)
# ancestor=X, ours=Y, theirs=Z  →  CONFLICT (both changed differently)`} />
                  <DeepDive title="How git finds the merge-base (common ancestor)">
                    <p>Git uses the <strong>Lowest Common Ancestor (LCA)</strong> algorithm on the DAG. Specifically it uses a variant called the "recursive" strategy (default) or "ort" (default since Git 2.34) which handles criss-cross merge scenarios by creating virtual merge bases.</p>
                    <CodeBlock language="bash" code={`# Find the merge-base manually:
git merge-base main feature/auth
# Returns: a1b2c3d4e5f6...  (the SHA of the common ancestor)

# Compare ancestor vs each branch tip:
git diff $(git merge-base main feature/auth) main
git diff $(git merge-base main feature/auth) feature/auth`} />
                  </DeepDive>
                </>
              )
            },
          ]} />
        </div>

        <div className="divider" />

        {/* ── 2. Rebase Engine ── */}
        <div className="fade-in-section" ref={r3}>
          <h3 id="git-rebase" className="subsection-title">The Rebase Engine — Animated</h3>
          <p className="body-text">
            Rebasing rewrites history by replaying commits onto a new base. Every replayed commit gets a <strong>brand new SHA</strong> — even if the file content is identical — because the parent pointer is different, and the SHA includes the parent hash. Step through exactly what happens internally:
          </p>
          <RebaseVisualizer />

          <WarningBox type="danger" title="The Golden Rule of Rebase">
            <strong>Never rebase commits that have already been pushed to a shared branch.</strong> Because rebase creates new SHAs, teammates who fetched the old SHAs now have a divergent history. Their next pull will attempt to merge the "original" and "rebased" versions, producing doubled commits and cascading conflicts. The only safe exception: force-pushing your own personal feature branch with <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>--force-with-lease</code> immediately after a local rebase, before anyone else has pulled.
          </WarningBox>

          <Tabs tabs={[
            {
              label: 'Rebase vs Merge comparison',
              content: (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    {[
                      { title: 'git merge', color: '#3b82f6', pros: ['Preserves exact history', 'Non-destructive', 'Safe on shared branches', 'Merge commit acts as a record'], cons: ['Pollutes log with merge commits', 'Non-linear history', 'git bisect harder on noisy history'] },
                      { title: 'git rebase', color: '#8b5cf6', pros: ['Linear, readable history', 'Cleaner git log', 'Easier git bisect', 'No merge commit noise'], cons: ['Rewrites history (new SHAs)', 'Dangerous on shared branches', 'Conflicts must be resolved commit-by-commit', 'Obscures true development timeline'] },
                    ].map((s, i) => (
                      <div key={i} style={{ background: 'var(--surface)', border: `1px solid ${s.color}33`, borderRadius: 8, padding: 14 }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: s.color, marginBottom: 12 }}>{s.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--green)', marginBottom: 8 }}>
                          {s.pros.map((p, j) => <div key={j} style={{ marginBottom: 4 }}>✓ {p}</div>)}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--red)' }}>
                          {s.cons.map((c, j) => <div key={j} style={{ marginBottom: 4 }}>✗ {c}</div>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )
            },
            {
              label: 'Rebase flags',
              content: (
                <CommandTable rows={[
                  { flag: 'git rebase main', effect: 'Replays your current branch\'s commits on top of main\'s latest commit.' },
                  { flag: 'git rebase -i HEAD~N', effect: 'Interactive rebase of the last N commits. Opens an editor to pick, squash, fixup, reword, drop, or reorder commits.' },
                  { flag: 'git rebase --onto <newbase> <upstream> <branch>', effect: 'Advanced: transplant a branch section onto a completely different base. Useful for splitting a branch or moving commits between unrelated branches.' },
                  { flag: 'git rebase --continue', effect: 'After resolving a conflict mid-rebase, stage the resolved files and run this to replay the next commit.' },
                  { flag: 'git rebase --skip', effect: 'Skip the current conflicting commit entirely and continue with the next one.' },
                  { flag: 'git rebase --abort', effect: 'Cancel the entire rebase and restore the branch to its pre-rebase state.' },
                ]} />
              )
            },
            {
              label: 'git rebase --onto',
              content: (
                <>
                  <p className="body-text">
                    The three-argument form of rebase is one of Git's most powerful and least-understood commands. It lets you surgically transplant a range of commits onto any base.
                  </p>
                  <CodeBlock language="bash" code={`# Scenario: You accidentally branched off 'feature-A' instead of 'main'
# You want to move your commits to be based on 'main' instead.

#       A---B---C  main
#            \\
#             D---E  feature-A
#                  \\
#                   F---G  feature-B  ← you want these on main

git rebase --onto main feature-A feature-B
#              ^newbase ^upstream   ^branch

# Result:
#       A---B---C  main
#            \\   \\
#             D---E  feature-A    F'--G'  feature-B
#             (unchanged)        (replayed onto main!)`} />
                </>
              )
            },
          ]} />
        </div>

        <div className="divider" />

        {/* ── 3. Interactive Rebase -i ── */}
        <div className="fade-in-section" ref={r4}>
          <h3 className="subsection-title">git rebase -i — History Surgery</h3>
          <p className="body-text">
            Interactive rebase is Git's most powerful history editing tool. Before pushing a feature branch, you can rewrite your local commits to tell a clean story. Combine WIP commits, fix typos in messages, remove debug commits — all before anyone else sees them.
          </p>
          <InteractiveRebasePlayground />

          <DeepDive title="How git rebase -i works internally">
            <p>When you run <code style={{ fontFamily: 'var(--font-mono)' }}>git rebase -i HEAD~5</code>, Git writes a "todo" file to <code style={{ fontFamily: 'var(--font-mono)' }}>.git/rebase-merge/git-rebase-todo</code>, then opens it in your <code style={{ fontFamily: 'var(--font-mono)' }}>$EDITOR</code>. Each line is an instruction. When you save and close, Git executes them top-to-bottom, creating new commit objects. The "exec" command (not shown above) even lets you run arbitrary shell commands between commits — useful for running tests at each step.</p>
            <CodeBlock language="bash" code={`# The raw todo file format:
pick a1b2c3 feat: add cart component
squash d4e5f6 WIP
fixup g7h8i9 fix typo
pick j0k1l2 fix: null check in cart
exec npm test          # run tests after this commit
drop m3n4o5 more fixes

# All todo file commands:
# p pick   = use commit
# r reword = use commit, edit the message
# e edit   = use commit, stop for amending
# s squash = combine with previous, edit message
# f fixup  = combine with previous, discard this message
# x exec   = run shell command
# b break  = stop here, allow manual intervention
# d drop   = remove commit
# l label  = label this point (for merge operations)`} />
          </DeepDive>
        </div>

        <div className="divider" />

        {/* ── 4. Cherry-pick ── */}
        <div className="fade-in-section" ref={r5}>
          <h3 id="git-cherry-pick" className="subsection-title">git cherry-pick — Surgical Commit Copying</h3>
          <p className="body-text">
            Cherry-pick applies the diff of a specific commit to your current branch. It creates a new commit object with the same change but a different SHA (different parent). It's the equivalent of: "I don't want the whole branch, just that one thing."
          </p>
          <CherryPickVisualizer />

          <Tabs tabs={[
            {
              label: 'Cherry-pick flags',
              content: (
                <CommandTable rows={[
                  { flag: 'git cherry-pick <sha>', effect: 'Apply the diff of a single commit to the current branch.' },
                  { flag: 'git cherry-pick A..B', effect: 'Apply a range of commits (exclusive of A, inclusive of B).' },
                  { flag: 'git cherry-pick A^..B', effect: 'Apply a range inclusive of A.' },
                  { flag: 'git cherry-pick -n / --no-commit', effect: 'Stage the changes but do NOT create a commit. Lets you combine multiple cherry-picks into one commit manually.' },
                  { flag: 'git cherry-pick -x', effect: 'Appends "(cherry picked from commit <sha>)" to the commit message. Useful for tracking provenance across branches.' },
                  { flag: 'git cherry-pick --abort', effect: 'Cancel a cherry-pick that hit conflicts and restore the branch.' },
                ]} />
              )
            },
            {
              label: 'When to use (and avoid)',
              content: (
                <>
                  <p className="body-text"><strong>Good uses:</strong></p>
                  <ul style={{ paddingLeft: 20, marginBottom: 16 }} className="body-text">
                    <li>Backporting a security fix to an older release branch</li>
                    <li>Hotfixing production without waiting for a full develop merge</li>
                    <li>Pulling a single completed feature out of a stalled mega-branch</li>
                  </ul>
                  <p className="body-text"><strong>When NOT to use:</strong></p>
                  <ul style={{ paddingLeft: 20 }} className="body-text">
                    <li>If you find yourself cherry-picking the same commit repeatedly, <em>your branching strategy is wrong</em>. Fix the workflow instead.</li>
                    <li>Cherry-pick creates duplicate commit content with different SHAs. If those branches ever merge, Git will try to apply the diff twice — usually resulting in conflicts or unexpected behavior.</li>
                    <li>Don't use it as a substitute for proper merge/rebase when you need multiple commits from another branch.</li>
                  </ul>
                </>
              )
            },
          ]} />
        </div>

        <div className="divider" />

        {/* ── 5. Worktrees ── */}
        <div className="fade-in-section" ref={r6}>
          <h3 id="git-worktree" className="subsection-title">git worktree — Multiple Checkouts</h3>
          <p className="body-text">
            A worktree lets you have multiple branches checked out simultaneously in separate directories on disk, all sharing the same <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>.git</code> database. No more stash-switch-fix-switch-unstash cycles when an urgent bug arrives mid-feature.
          </p>
          <WorktreeVisualizer />

          <DeepDive title="How worktree shares the .git database">
            <p>Each linked worktree gets its own <code style={{ fontFamily: 'var(--font-mono)' }}>.git</code> file (not a directory — a plain text file) pointing at the main repo's <code style={{ fontFamily: 'var(--font-mono)' }}>.git</code> folder. Inside the main <code style={{ fontFamily: 'var(--font-mono)' }}>.git</code>, a <code style={{ fontFamily: 'var(--font-mono)' }}>worktrees/</code> subdirectory stores the per-worktree HEAD, index, and lock files separately. The object store (<code style={{ fontFamily: 'var(--font-mono)' }}>.git/objects/</code>) and refs (<code style={{ fontFamily: 'var(--font-mono)' }}>.git/refs/</code>) are fully shared.</p>
            <CodeBlock language="bash" code={`# The linked worktree folder contains:
cat /my-project-hotfix/.git
# gitdir: /my-project/.git/worktrees/my-project-hotfix

# Inside main .git:
ls .git/worktrees/my-project-hotfix/
# HEAD    ← this worktree's checked-out branch
# index   ← this worktree's staging area
# locked  ← prevents gc from pruning while checked out
# gitdir  ← back-reference to the worktree folder`} />
          </DeepDive>
        </div>

        <div className="divider" />

        {/* ── Quick Reference ── */}
        <h3 className="subsection-title">Quick Reference</h3>
        <CodeBlock language="bash" code={`# ── BRANCHING ─────────────────────────────────────────
git branch                          # list local branches
git branch -a                       # list local + remote-tracking
git branch feature/xyz              # create branch (don't switch)
git switch -c feature/xyz           # create + switch (modern syntax)
git switch main                     # switch branches (no -c)
git branch -d feature/xyz           # delete merged branch
git branch -D feature/xyz           # force delete (unmerged)

# ── MERGING ───────────────────────────────────────────
git merge feature/xyz               # auto FF or 3-way merge
git merge --no-ff feature/xyz       # always create merge commit
git merge --squash feature/xyz      # condense to one staged diff
git merge --ff-only feature/xyz     # abort if FF not possible

# ── REBASING ──────────────────────────────────────────
git rebase main                     # rebase current branch onto main
git rebase -i HEAD~5                # interactive rebase last 5 commits
git rebase --onto main A feature    # transplant feature onto main
git rebase --continue               # after resolving conflict
git rebase --abort                  # cancel entire rebase

# ── CHERRY-PICK ───────────────────────────────────────
git cherry-pick a1b2c3              # apply one commit's diff
git cherry-pick A^..B               # apply range (inclusive)
git cherry-pick -n a1b2c3           # stage only, no commit

# ── WORKTREES ─────────────────────────────────────────
git worktree add ../project-fix main  # new folder, main checked out
git worktree list                     # see all active worktrees
git worktree remove ../project-fix    # remove when done`} />

      </section>
    </div>
  );
}