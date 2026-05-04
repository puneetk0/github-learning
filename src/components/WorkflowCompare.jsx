import React, { useState, useEffect } from 'react';

// ─── Data ─────────────────────────────────────────────────────────────────────
const WORKFLOWS = {
  trunk: {
    label: 'Trunk-Based',
    color: 'var(--blue)',
    tagline: 'Everyone merges to main daily. Short-lived branches only.',
    usedBy: 'Google, Meta, Netflix, most modern SaaS',
    scores: { complexity: 1, releaseSpeed: 5, cicdFit: 5, teamSize: 'Any' },
  },
  github: {
    label: 'GitHub Flow',
    color: 'var(--green)',
    tagline: 'Feature branches + PRs. Deploy from main after merge.',
    usedBy: 'GitHub, most open-source projects, small-to-mid teams',
    scores: { complexity: 2, releaseSpeed: 4, cicdFit: 4, teamSize: 'Small–Mid' },
  },
  gitflow: {
    label: 'Git Flow',
    color: 'var(--yellow)',
    tagline: 'main + develop + feature/* + release/* + hotfix/*',
    usedBy: 'Enterprise, versioned desktop/mobile software, scheduled releases',
    scores: { complexity: 5, releaseSpeed: 2, cicdFit: 2, teamSize: 'Large (legacy)' },
  },
};

const SCENARIOS = {
  feature: {
    label: '🚀 New Feature',
    desc: 'Adding a new user-facing feature to the codebase.',
    steps: {
      trunk: [
        { label: 'Cut short-lived branch off main', branch: 'feat/search', color: 'var(--green)', offset: -50 },
        { label: 'Commit early & often (1–2 days max)', branch: 'feat/search', color: 'var(--green)', offset: -50 },
        { label: 'Open PR → CI passes → merge to main', branch: 'main', color: 'var(--blue)', offset: 0 },
        { label: 'Deploy from main (feature flag if incomplete)', branch: 'main', color: 'var(--blue)', offset: 0 },
      ],
      github: [
        { label: 'Create feature branch from main', branch: 'feat/search', color: 'var(--green)', offset: -50 },
        { label: 'Commit, push, open PR', branch: 'feat/search', color: 'var(--green)', offset: -50 },
        { label: 'Code review + CI checks', branch: 'feat/search', color: 'var(--green)', offset: -50 },
        { label: 'Merge PR → deploy main', branch: 'main', color: 'var(--blue)', offset: 0 },
      ],
      gitflow: [
        { label: 'Branch off develop: feature/search', branch: 'feature/search', color: 'var(--green)', offset: -80 },
        { label: 'Work on feature (could take weeks)', branch: 'feature/search', color: 'var(--green)', offset: -80 },
        { label: 'Merge back into develop', branch: 'develop', color: 'var(--yellow)', offset: -40 },
        { label: 'Wait for release branch cycle', branch: 'release/2.1', color: 'var(--orange)', offset: 40 },
        { label: 'Release merges into main + tag', branch: 'main', color: 'var(--blue)', offset: 0 },
      ],
    },
  },
  hotfix: {
    label: '🔥 Hotfix',
    desc: 'Critical bug in production needs an immediate fix.',
    steps: {
      trunk: [
        { label: 'Branch off main: hotfix/crash', branch: 'hotfix/crash', color: 'var(--red)', offset: 50 },
        { label: 'Fix, test, PR → merge to main', branch: 'main', color: 'var(--blue)', offset: 0 },
        { label: 'Deploy immediately from main', branch: 'main', color: 'var(--blue)', offset: 0 },
      ],
      github: [
        { label: 'Branch off main: hotfix/crash', branch: 'hotfix/crash', color: 'var(--red)', offset: 50 },
        { label: 'Fix, push, emergency PR', branch: 'hotfix/crash', color: 'var(--red)', offset: 50 },
        { label: 'Merge to main → deploy', branch: 'main', color: 'var(--blue)', offset: 0 },
      ],
      gitflow: [
        { label: 'Branch off main: hotfix/crash', branch: 'hotfix/crash', color: 'var(--red)', offset: 50 },
        { label: 'Fix the bug', branch: 'hotfix/crash', color: 'var(--red)', offset: 50 },
        { label: 'Merge into main → tag v1.0.1', branch: 'main', color: 'var(--blue)', offset: 0 },
        { label: 'Also merge into develop (easy to forget!)', branch: 'develop', color: 'var(--yellow)', offset: -40 },
      ],
    },
  },
  release: {
    label: '📦 Release',
    desc: 'Shipping a new version to production.',
    steps: {
      trunk: [
        { label: 'main is always release-ready', branch: 'main', color: 'var(--blue)', offset: 0 },
        { label: 'Run release pipeline (CI/CD)', branch: 'main', color: 'var(--blue)', offset: 0 },
        { label: 'Tag: git tag v2.0.0', branch: 'main', color: 'var(--blue)', offset: 0 },
        { label: 'Done. No branch gymnastics.', branch: 'main', color: 'var(--blue)', offset: 0 },
      ],
      github: [
        { label: 'All features merged to main', branch: 'main', color: 'var(--blue)', offset: 0 },
        { label: 'Tag + GitHub Release created', branch: 'main', color: 'var(--blue)', offset: 0 },
        { label: 'Deploy from tag', branch: 'main', color: 'var(--blue)', offset: 0 },
      ],
      gitflow: [
        { label: 'Cut release/2.0 off develop', branch: 'release/2.0', color: 'var(--orange)', offset: 40 },
        { label: 'QA, bug fixes on release branch', branch: 'release/2.0', color: 'var(--orange)', offset: 40 },
        { label: 'Merge release/2.0 → main', branch: 'main', color: 'var(--blue)', offset: 0 },
        { label: 'Tag: v2.0.0', branch: 'main', color: 'var(--blue)', offset: 0 },
        { label: 'Merge release/2.0 → develop', branch: 'develop', color: 'var(--yellow)', offset: -40 },
        { label: 'Delete release branch', branch: '—', color: 'var(--text3)', offset: 0 },
      ],
    },
  },
};

// ─── Animated branch graph ────────────────────────────────────────────────────
function BranchGraph({ workflowKey, scenarioKey }) {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const steps = SCENARIOS[scenarioKey].steps[workflowKey];
  const wf = WORKFLOWS[workflowKey];

  useEffect(() => {
    setVisibleSteps(0);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setVisibleSteps(i);
      if (i >= steps.length) clearInterval(timer);
    }, 480);
    return () => clearInterval(timer);
  }, [workflowKey, scenarioKey]);

  const SVG_W = 560;
  const SVG_H = 160;
  const MAIN_Y = 100;
  const STEP_X = 60;
  const STEP_GAP = Math.min(90, (SVG_W - STEP_X * 2) / Math.max(steps.length, 1));

  // Collect unique branches in order of appearance
  const branchYMap = {};
  steps.forEach(s => {
    if (!(s.branch in branchYMap)) {
      branchYMap[s.branch] = MAIN_Y + (s.offset ?? 0);
    }
  });

  // Draw lines per branch
  const branchLines = {};
  steps.forEach((s, i) => {
    if (!branchLines[s.branch]) branchLines[s.branch] = { color: s.color, points: [] };
    branchLines[s.branch].points.push({ x: STEP_X + i * STEP_GAP, y: branchYMap[s.branch] });
  });

  return (
    <div style={{ overflowX: 'auto', padding: '8px 0' }}>
      <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ overflow: 'visible' }}>
        {/* Branch lines */}
        {Object.entries(branchLines).map(([branch, { color, points }]) => {
          if (points.length < 2) return null;
          const visPoints = points.slice(0, visibleSteps);
          if (visPoints.length < 2) return null;
          const d = visPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
          return (
            <path key={branch} d={d} stroke={color} strokeWidth="3"
              fill="none" strokeLinecap="round" strokeLinejoin="round"
              style={{ transition: 'stroke-dashoffset 0.3s' }}
            />
          );
        })}

        {/* Connectors between branches at merge points */}
        {steps.slice(0, visibleSteps).map((s, i) => {
          if (i === 0) return null;
          const prev = steps[i - 1];
          const prevY = branchYMap[prev.branch];
          const curY  = branchYMap[s.branch];
          if (prevY === curY) return null;
          const x = STEP_X + i * STEP_GAP;
          return (
            <line key={`conn-${i}`}
              x1={x} y1={prevY} x2={x} y2={curY}
              stroke="var(--border2)" strokeWidth="2" strokeDasharray="4,3"
            />
          );
        })}

        {/* Step dots + labels */}
        {steps.map((s, i) => {
          const x = STEP_X + i * STEP_GAP;
          const y = branchYMap[s.branch];
          const visible = i < visibleSteps;
          return (
            <g key={i} style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }}>
              <circle cx={x} cy={y} r={8} fill="var(--bg)"
                stroke={s.color} strokeWidth="2.5" />
              <circle cx={x} cy={y} r={3.5} fill={s.color} />
              {/* Branch name pill (first occurrence only) */}
              {(i === 0 || steps[i - 1].branch !== s.branch) && (
                <g>
                  <rect
                    x={x - 28} y={y - (s.offset >= 0 ? 28 : -12) - 14}
                    width="56" height="16" rx="4"
                    fill={s.color + '22'} stroke={s.color + '66'}
                  />
                  <text x={x} y={y - (s.offset >= 0 ? 28 : -12) - 2}
                    textAnchor="middle" fill={s.color}
                    fontSize="9" fontFamily="var(--font-mono)" fontWeight="700">
                    {s.branch.length > 12 ? s.branch.slice(0, 11) + '…' : s.branch}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Step list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            opacity: i < visibleSteps ? 1 : 0.2,
            transition: `opacity 0.3s ${i * 0.1}s`,
            fontSize: '12px',
          }}>
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%',
              background: i < visibleSteps ? s.color + '22' : 'var(--surface)',
              border: `2px solid ${i < visibleSteps ? s.color : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: 700,
              color: i < visibleSteps ? s.color : 'var(--text3)',
              flexShrink: 0,
            }}>{i + 1}</div>
            <span style={{ color: i < visibleSteps ? 'var(--text)' : 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Score bar ────────────────────────────────────────────────────────────────
function ScoreBar({ value, max = 5, color }) {
  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} style={{
          width: '16px', height: '8px', borderRadius: '2px',
          background: i < value ? color : 'var(--border)',
          transition: 'background 0.3s',
        }} />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function WorkflowCompare() {
  const [activeWorkflow, setActiveWorkflow] = useState('trunk');
  const [activeScenario, setActiveScenario] = useState('feature');

  const wf = WORKFLOWS[activeWorkflow];

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: '10px',
      overflow: 'hidden',
      margin: '32px 0',
      background: 'var(--bg2)',
    }}>

      {/* ── Header ── */}
      <div style={{
        padding: '14px 20px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '10px',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
          Workflow Simulator
        </span>

        {/* Workflow selector */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {Object.entries(WORKFLOWS).map(([key, w]) => (
            <button key={key} onClick={() => setActiveWorkflow(key)} style={{
              padding: '5px 12px', fontSize: '12px',
              background: activeWorkflow === key ? w.color + '22' : 'transparent',
              border: `1px solid ${activeWorkflow === key ? w.color : 'var(--border)'}`,
              borderRadius: '6px',
              color: activeWorkflow === key ? w.color : 'var(--text2)',
              fontFamily: 'var(--font-mono)', fontWeight: activeWorkflow === key ? 700 : 400,
              cursor: 'pointer', transition: 'all 0.2s',
            }}>{w.label}</button>
          ))}
        </div>
      </div>

      {/* ── Tagline + used by ── */}
      <div style={{
        padding: '12px 20px',
        background: wf.color + '0a',
        borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '8px',
      }}>
        <span style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.5 }}>{wf.tagline}</span>
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: wf.color }}>
          Used by: {wf.usedBy}
        </span>
      </div>

      {/* ── Scenario selector ── */}
      <div style={{
        padding: '12px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Scenario:
        </span>
        {Object.entries(SCENARIOS).map(([key, s]) => (
          <button key={key} onClick={() => setActiveScenario(key)} style={{
            padding: '5px 12px', fontSize: '12px',
            background: activeScenario === key ? 'var(--accent)' : 'var(--surface)',
            border: `1px solid ${activeScenario === key ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '6px',
            color: activeScenario === key ? '#fff' : 'var(--text2)',
            fontFamily: 'var(--font-body)', fontWeight: activeScenario === key ? 600 : 400,
            cursor: 'pointer', transition: 'all 0.2s',
          }}>{s.label}</button>
        ))}
      </div>

      {/* ── Scenario desc ── */}
      <div style={{ padding: '10px 20px', fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-mono)', borderBottom: '1px solid var(--border)' }}>
        {SCENARIOS[activeScenario].desc}
      </div>

      {/* ── Branch graph ── */}
      <div style={{ padding: '20px' }}>
        <BranchGraph workflowKey={activeWorkflow} scenarioKey={activeScenario} />
      </div>

      {/* ── Comparison table ── */}
      <div style={{ margin: '0 16px 16px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div style={{ padding: '10px 16px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Workflow Comparison
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', background: 'var(--bg2)' }}>
            <thead>
              <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--text2)', fontWeight: 600, width: '160px' }}>Metric</th>
                {Object.entries(WORKFLOWS).map(([key, w]) => (
                  <th key={key} style={{
                    padding: '10px 16px', textAlign: 'center',
                    color: activeWorkflow === key ? w.color : 'var(--text2)',
                    fontWeight: activeWorkflow === key ? 700 : 600,
                    borderLeft: activeWorkflow === key ? `2px solid ${w.color}` : '1px solid var(--border)',
                    background: activeWorkflow === key ? w.color + '0a' : 'transparent',
                  }}>{w.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: 'Branch Complexity',
                  render: (key) => <ScoreBar value={WORKFLOWS[key].scores.complexity} color={WORKFLOWS[key].color} />,
                  note: '← lower is simpler',
                },
                {
                  label: 'Release Speed',
                  render: (key) => <ScoreBar value={WORKFLOWS[key].scores.releaseSpeed} color={WORKFLOWS[key].color} />,
                },
                {
                  label: 'CI/CD Fit',
                  render: (key) => <ScoreBar value={WORKFLOWS[key].scores.cicdFit} color={WORKFLOWS[key].color} />,
                },
                {
                  label: 'Team Size Fit',
                  render: (key) => <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: WORKFLOWS[key].color }}>{WORKFLOWS[key].scores.teamSize}</span>,
                },
              ].map((row, ri) => (
                <tr key={ri} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', color: 'var(--text2)', fontSize: '12px' }}>
                    {row.label}
                    {row.note && <span style={{ display: 'block', fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{row.note}</span>}
                  </td>
                  {Object.keys(WORKFLOWS).map(key => (
                    <td key={key} style={{
                      padding: '12px 16px', textAlign: 'center',
                      borderLeft: activeWorkflow === key ? `2px solid ${WORKFLOWS[key].color}` : '1px solid var(--border)',
                      background: activeWorkflow === key ? WORKFLOWS[key].color + '06' : 'transparent',
                    }}>
                      {row.render(key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}