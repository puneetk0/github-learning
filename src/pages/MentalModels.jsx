import React, { useState, useEffect, useRef } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import DeepDive from '../components/ui/DeepDive';
import Tabs from '../components/ui/Tabs';
import WarningBox from '../components/ui/WarningBox';

// ─────────────────────────────────────────────
// THREE TREE VISUALIZER (inline)
// ─────────────────────────────────────────────
function ThreeTreeVisualizer() {
  const initialFiles = [
    { id: 'app.js',     label: 'app.js',     state: 'committed' },
    { id: 'auth.js',    label: 'auth.js',    state: 'committed' },
    { id: 'styles.css', label: 'styles.css', state: 'committed' },
  ];

  const [files, setFiles]           = useState(initialFiles);
  const [newFile, setNewFile]       = useState('');
  const [log, setLog]               = useState([]);
  const [animating, setAnimating]   = useState(null); // { id, direction }
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const addLog = (msg, color = 'var(--text2)') =>
    setLog(prev => [...prev, { msg, color, ts: Date.now() + Math.random() }]);

  const workingFiles  = files.filter(f => f.state === 'working' || f.state === 'modified');
  const stagedFiles   = files.filter(f => f.state === 'staged');
  const committedFiles= files.filter(f => f.state === 'committed');

  const modifyFile = (id) => {
    setFiles(prev => prev.map(f => f.id === id && f.state === 'committed'
      ? { ...f, state: 'modified' } : f));
    addLog(`Modified ${id} — now in Working Directory`, 'var(--yellow)');
  };

  const gitAdd = (id) => {
    setAnimating({ id, direction: 'add' });
    setTimeout(() => {
      setFiles(prev => prev.map(f => f.id === id && (f.state === 'working' || f.state === 'modified')
        ? { ...f, state: 'staged' } : f));
      setAnimating(null);
      addLog(`git add ${id} — moved to Staging Index`, 'var(--blue)');
    }, 500);
  };

  const gitAddAll = () => {
    const targets = files.filter(f => f.state === 'working' || f.state === 'modified');
    if (!targets.length) { addLog('Nothing to stage.', 'var(--text3)'); return; }
    targets.forEach(f => gitAdd(f.id));
    addLog(`git add . — staged ${targets.length} file(s)`, 'var(--blue)');
  };

  const gitCommit = () => {
    if (!stagedFiles.length) { addLog('Nothing staged. Run git add first.', 'var(--red)'); return; }
    setFiles(prev => prev.map(f => f.state === 'staged' ? { ...f, state: 'committed' } : f));
    addLog(`git commit — snapshot saved to HEAD ✓`, 'var(--green)');
  };

  const gitUnstage = (id) => {
    setFiles(prev => prev.map(f => f.id === id && f.state === 'staged'
      ? { ...f, state: 'modified' } : f));
    addLog(`git restore --staged ${id} — back to Working Directory`, 'var(--orange)');
  };

  const addNewFile = () => {
    const name = newFile.trim();
    if (!name) return;
    const id = name.includes('.') ? name : name + '.js';
    if (files.find(f => f.id === id)) { addLog(`${id} already exists.`, 'var(--red)'); return; }
    setFiles(prev => [...prev, { id, label: id, state: 'working' }]);
    addLog(`Created ${id} — untracked in Working Directory`, 'var(--yellow)');
    setNewFile('');
  };

  const reset = () => {
    setFiles(initialFiles);
    setLog([]);
    addLog('Repository reset to initial state.', 'var(--text3)');
  };

  const stateColor = { working: 'var(--yellow)', modified: 'var(--orange)', staged: 'var(--blue)', committed: 'var(--green)' };
  const stateLabel = { working: 'untracked', modified: 'modified', staged: 'staged', committed: 'committed' };

  const FileCard = ({ file, zone }) => {
    const isAnimating = animating?.id === file.id;
    return (
      <div style={{
        padding: '10px 12px',
        background: 'var(--bg)',
        border: `1px solid ${stateColor[file.state]}44`,
        borderLeft: `3px solid ${stateColor[file.state]}`,
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        fontSize: '13px',
        fontFamily: 'var(--font-mono)',
        opacity: isAnimating ? 0.4 : 1,
        transition: 'opacity 0.4s ease',
      }}>
        <div>
          <span style={{ color: 'var(--text)' }}>{file.label}</span>
          <span style={{
            marginLeft: '8px', fontSize: '10px',
            color: stateColor[file.state],
            background: stateColor[file.state] + '18',
            padding: '2px 6px', borderRadius: '4px'
          }}>{stateLabel[file.state]}</span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {zone === 'committed' && (
            <button className="btn" style={{ padding: '3px 8px', fontSize: '11px' }}
              onClick={() => modifyFile(file.id)}>edit</button>
          )}
          {zone === 'working' && (
            <button className="btn" style={{ padding: '3px 8px', fontSize: '11px', borderColor: 'var(--blue)' }}
              onClick={() => gitAdd(file.id)}>git add</button>
          )}
          {zone === 'staged' && (
            <button className="btn" style={{ padding: '3px 8px', fontSize: '11px', borderColor: 'var(--orange)' }}
              onClick={() => gitUnstage(file.id)}>unstage</button>
          )}
        </div>
      </div>
    );
  };

  const Zone = ({ title, subtitle, color, files: zoneFiles, zone, action }) => (
    <div style={{
      flex: 1, minWidth: 0,
      border: `1px solid ${color}33`,
      borderTop: `3px solid ${color}`,
      borderRadius: '8px',
      background: 'var(--bg2)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color, marginBottom: '2px' }}>{title}</div>
        <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{subtitle}</div>
      </div>
      <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '160px' }}>
        {zoneFiles.length === 0
          ? <div style={{ color: 'var(--text3)', fontSize: '12px', fontFamily: 'var(--font-mono)', margin: 'auto', textAlign: 'center' }}>empty</div>
          : zoneFiles.map(f => <FileCard key={f.id} file={f} zone={zone} />)
        }
      </div>
      {action && (
        <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
          {action}
        </div>
      )}
    </div>
  );

  return (
    <div className="cr-container" style={{ margin: '40px 0' }}>
      <div className="cr-header">
        <div className="cr-title">The Three Trees — Interactive Sandbox</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button className="btn" style={{ fontSize: '12px', padding: '4px 10px' }} onClick={gitAddAll}>git add .</button>
          <button className="btn" style={{ fontSize: '12px', padding: '4px 10px', borderColor: 'var(--green)' }} onClick={gitCommit}>git commit</button>
          <button className="btn" style={{ fontSize: '12px', padding: '4px 10px' }} onClick={reset}>reset</button>
        </div>
      </div>

      {/* Arrow labels between zones */}
      <div style={{ padding: '20px 16px 0', background: 'var(--bg2)' }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: '0' }}>

          <Zone
            title="Working Directory"
            subtitle="Your actual files on disk"
            color="var(--orange)"
            files={workingFiles}
            zone="working"
            action={
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  value={newFile}
                  onChange={e => setNewFile(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addNewFile()}
                  placeholder="new-file.js"
                  style={{
                    flex: 1, background: 'var(--bg)', border: '1px solid var(--border)',
                    borderRadius: '4px', padding: '6px 10px', color: 'var(--text)',
                    fontFamily: 'var(--font-mono)', fontSize: '12px', outline: 'none'
                  }}
                />
                <button className="btn" style={{ fontSize: '11px', padding: '4px 10px' }} onClick={addNewFile}>create</button>
              </div>
            }
          />

          {/* Arrow 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 8px', minWidth: '80px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--blue)', textAlign: 'center', marginBottom: '4px' }}>git add</div>
            <div style={{ fontSize: '20px', color: 'var(--blue)' }}>→</div>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--orange)', textAlign: 'center', marginTop: '4px' }}>git restore<br/>--staged</div>
            <div style={{ fontSize: '14px', color: 'var(--orange)' }}>←</div>
          </div>

          <Zone
            title="Staging Index"
            subtitle=".git/index (binary)"
            color="var(--blue)"
            files={stagedFiles}
            zone="staged"
          />

          {/* Arrow 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 8px', minWidth: '80px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--green)', textAlign: 'center', marginBottom: '4px' }}>git commit</div>
            <div style={{ fontSize: '20px', color: 'var(--green)' }}>→</div>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', textAlign: 'center', marginTop: '4px' }}>git reset<br/>HEAD~1</div>
            <div style={{ fontSize: '14px', color: 'var(--text3)' }}>←</div>
          </div>

          <Zone
            title="HEAD (Repository)"
            subtitle=".git/objects/ — immutable"
            color="var(--green)"
            files={committedFiles}
            zone="committed"
          />
        </div>
      </div>

      {/* Terminal log */}
      <div ref={logRef} style={{
        margin: '16px 16px 16px', padding: '12px 16px',
        background: '#050508', borderRadius: '6px',
        border: '1px solid var(--border)',
        fontFamily: 'var(--font-mono)', fontSize: '12px',
        maxHeight: '120px', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: '4px',
      }}>
        {log.length === 0
          ? <span style={{ color: 'var(--text3)' }}>Try clicking "edit" on a committed file to modify it, then stage and commit it.</span>
          : log.map(l => <div key={l.ts} style={{ color: l.color }}>$ {l.msg}</div>)
        }
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DETACHED HEAD EXPLORER (upgraded)
// ─────────────────────────────────────────────
function DetachedHeadExplorer() {
  const commits = [
    { id: 'a1b2c3d', label: 'feat: add login',      x: 80 },
    { id: 'e4f5g6h', label: 'fix: null check',       x: 220 },
    { id: 'i7j8k9l', label: 'feat: dashboard',       x: 360 },
    { id: 'm1n2o3p', label: 'chore: update deps',    x: 500 },
  ];

  // states: 'attached' | 'detached' | 'orphan' | 'recovered'
  const [phase, setPhase]               = useState('attached');
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [orphanCommit]                  = useState({ id: 'z9y8x7w', label: 'experiment: new auth', x: 220 });
  const [branchName, setBranchName]     = useState('');
  const [showBranchInput, setShowBranchInput]= useState(false);

  const headX = phase === 'attached'   ? commits[3].x
              : phase === 'detached'   ? (selectedCommit?.x ?? commits[1].x)
              : phase === 'orphan'     ? orphanCommit.x
              :                          commits[3].x; // recovered

  const headY = phase === 'attached' ? 30 : 50;

  const phaseInfo = {
    attached: {
      color: 'var(--green)',
      title: 'Normal State — Attached HEAD',
      body: 'HEAD points to the main branch pointer. When you commit, main moves forward and HEAD follows. This is the safe, normal state.',
      cmd: 'cat .git/HEAD  →  ref: refs/heads/main',
    },
    detached: {
      color: 'var(--yellow)',
      title: 'Detached HEAD — Looking at old commit',
      body: `HEAD points directly to commit ${selectedCommit?.id ?? 'e4f5g6h'} — not a branch. You can look around, run tests, even make commits. But if you switch branches, new commits will be unreachable.`,
      cmd: `cat .git/HEAD  →  ${selectedCommit?.id ?? 'e4f5g6h'}...`,
    },
    orphan: {
      color: 'var(--red)',
      title: 'Orphan Commits — Danger Zone',
      body: `You committed in detached HEAD. Commit ${orphanCommit.id} exists but nothing points to it. Switch branches now and git gc will eventually delete it. You have ~30 days via reflog.`,
      cmd: `git reflog  →  ${orphanCommit.id} HEAD@{0}: commit: experiment: new auth`,
    },
    recovered: {
      color: 'var(--green)',
      title: 'Recovered — Branch Created',
      body: `You ran "git checkout -b ${branchName || 'save-experiment'}". A new branch now points to the orphan commit, making it permanent. Crisis averted.`,
      cmd: `git checkout -b ${branchName || 'save-experiment'}  →  branch saved ✓`,
    },
  };

  const info = phaseInfo[phase];

  const handleCommitClick = (commit) => {
    if (phase !== 'attached') return;
    setSelectedCommit(commit);
    setPhase('detached');
  };

  const handleCommitInDetached = () => setPhase('orphan');
  const handleRecover = () => {
    if (!branchName.trim()) return;
    setPhase('recovered');
    setShowBranchInput(false);
  };
  const handleReset = () => {
    setPhase('attached');
    setSelectedCommit(null);
    setBranchName('');
    setShowBranchInput(false);
  };

  const SVG_W = 640;
  const SVG_H = 200;

  return (
    <div className="cr-container" style={{ margin: '32px 0' }}>
      <div className="cr-header">
        <div className="cr-title">Detached HEAD Explorer</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {phase === 'attached' && (
            <span style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
              Click any old commit to detach HEAD
            </span>
          )}
          {phase === 'detached' && (
            <button className="btn" style={{ fontSize: '12px', borderColor: 'var(--red)' }}
              onClick={handleCommitInDetached}>
              git commit (in detached state)
            </button>
          )}
          {phase === 'orphan' && !showBranchInput && (
            <button className="btn" style={{ fontSize: '12px', borderColor: 'var(--green)' }}
              onClick={() => setShowBranchInput(true)}>
              git checkout -b &lt;name&gt;
            </button>
          )}
          {phase === 'orphan' && showBranchInput && (
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                autoFocus
                value={branchName}
                onChange={e => setBranchName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRecover()}
                placeholder="branch-name"
                style={{
                  background: 'var(--bg)', border: '1px solid var(--green)',
                  borderRadius: '4px', padding: '4px 8px', color: 'var(--text)',
                  fontFamily: 'var(--font-mono)', fontSize: '12px', outline: 'none', width: '140px'
                }}
              />
              <button className="btn" style={{ fontSize: '12px', borderColor: 'var(--green)' }} onClick={handleRecover}>create</button>
            </div>
          )}
          <button className="btn" style={{ fontSize: '12px' }} onClick={handleReset}>reset</button>
        </div>
      </div>

      {/* SVG diagram */}
      <div style={{ padding: '24px 20px 8px', background: 'var(--bg2)', overflowX: 'auto' }}>
        <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ overflow: 'visible' }}>
          <defs>
            {['green','blue','yellow','red','orange'].map(c => (
              <marker key={c} id={`arr-${c}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill={`var(--${c})`} />
              </marker>
            ))}
          </defs>

          {/* Commit chain line */}
          <line x1={commits[0].x} y1={120} x2={commits[3].x} y2={120}
            stroke="var(--border2)" strokeWidth="3" />

          {/* Orphan branch line (when orphan phase) */}
          {(phase === 'orphan' || phase === 'recovered') && (
            <>
              <line x1={commits[1].x} y1={120} x2={orphanCommit.x} y2={165}
                stroke="var(--red)" strokeWidth="2" strokeDasharray="6,3" />
              <circle cx={orphanCommit.x} cy={165} r={14}
                fill="var(--surface)" stroke={phase === 'recovered' ? 'var(--green)' : 'var(--red)'} strokeWidth="2.5" />
              <text x={orphanCommit.x} y={169} textAnchor="middle"
                fill={phase === 'recovered' ? 'var(--green)' : 'var(--red)'}
                fontSize="9" fontFamily="var(--font-mono)">{orphanCommit.id}</text>
              <text x={orphanCommit.x} y={185} textAnchor="middle"
                fill="var(--text3)" fontSize="9">{orphanCommit.label}</text>
            </>
          )}

          {/* Recovered branch tag */}
          {phase === 'recovered' && (
            <g>
              <rect x={orphanCommit.x - 40} y={135} width="80" height="18" rx="4" fill="var(--green)" opacity="0.9"/>
              <text x={orphanCommit.x} y={148} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
                {branchName || 'save-experiment'}
              </text>
              <line x1={orphanCommit.x} y1={153} x2={orphanCommit.x} y2={151}
                stroke="var(--green)" strokeWidth="1.5" markerEnd="url(#arr-green)" />
            </g>
          )}

          {/* Commits */}
          {commits.map((c, i) => {
            const isDetachTarget = selectedCommit?.id === c.id && (phase === 'detached' || phase === 'orphan');
            const isClickable = phase === 'attached' && i < commits.length - 1;
            return (
              <g key={c.id}
                style={{ cursor: isClickable ? 'pointer' : 'default' }}
                onClick={() => isClickable && handleCommitClick(c)}
              >
                <circle cx={c.x} cy={120} r={isClickable ? 16 : 14}
                  fill="var(--surface)"
                  stroke={isDetachTarget ? 'var(--yellow)' : 'var(--blue)'}
                  strokeWidth={isDetachTarget ? 3 : 2}
                />
                {isClickable && (
                  <circle cx={c.x} cy={120} r={18}
                    fill="none" stroke="var(--blue)" strokeWidth="1" opacity="0.3" strokeDasharray="4,3" />
                )}
                <text x={c.x} y={124} textAnchor="middle"
                  fill={isClickable ? 'var(--blue)' : 'var(--text2)'}
                  fontSize="9" fontFamily="var(--font-mono)">{c.id}</text>
                <text x={c.x} y={145} textAnchor="middle" fill="var(--text3)" fontSize="9">{c.label}</text>
              </g>
            );
          })}

          {/* main branch tag */}
          <g>
            <rect x={commits[3].x - 26} y={85} width="52" height="18" rx="4"
              fill={phase === 'recovered' ? 'var(--green)' : 'rgba(34,211,160,0.85)'} />
            <text x={commits[3].x} y={98} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">main</text>
            <line x1={commits[3].x} y1={103} x2={commits[3].x} y2={104}
              stroke="var(--green)" strokeWidth="2" markerEnd="url(#arr-green)" />
          </g>

          {/* HEAD tag — smoothly animated via CSS transition on transform */}
          <g style={{ transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)' }}
            transform={
              phase === 'attached'   ? `translate(${commits[3].x}, ${headY})` :
              phase === 'detached'   ? `translate(${selectedCommit?.x ?? commits[1].x}, 50)` :
              phase === 'orphan'     ? `translate(${orphanCommit.x}, 100)` :
                                       `translate(${commits[3].x}, ${headY})`
            }
          >
            <rect x="-26" y="-14" width="52" height="20" rx="4"
              fill={phase === 'detached' ? 'var(--yellow)' : phase === 'orphan' ? 'var(--red)' : 'var(--blue)'} />
            <text x="0" y="1" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">HEAD</text>
            <line x1="0" y1="6" x2="0" y2={phase === 'attached' ? 14 : 26}
              stroke={phase === 'detached' ? 'var(--yellow)' : phase === 'orphan' ? 'var(--red)' : 'var(--blue)'}
              strokeWidth="2"
              markerEnd={`url(#arr-${phase === 'detached' ? 'yellow' : phase === 'orphan' ? 'red' : 'blue'})`}
            />
          </g>
        </svg>
      </div>

      {/* Info panel */}
      <div style={{
        padding: '16px 20px',
        background: 'var(--surface)',
        borderTop: `2px solid ${info.color}`,
        transition: 'border-color 0.3s ease',
      }}>
        <h4 style={{ color: info.color, marginBottom: '6px', fontSize: '14px', fontWeight: 700 }}>{info.title}</h4>
        <p style={{ fontSize: '13px', color: 'var(--text2)', margin: '0 0 10px', lineHeight: 1.6 }}>{info.body}</p>
        <code style={{
          display: 'block', fontSize: '11px', fontFamily: 'var(--font-mono)',
          color: info.color, background: 'var(--bg2)',
          padding: '6px 10px', borderRadius: '4px', opacity: 0.9
        }}>{info.cmd}</code>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SNAPSHOT VS DELTA TOGGLE (inline)
// ─────────────────────────────────────────────
function SnapshotVsDelta() {
  const [mode, setMode] = useState('snapshot');

  const commits = ['C1', 'C2', 'C3', 'C4'];
  const files   = ['index.js', 'auth.js', 'styles.css'];

  // Which files changed per commit
  const changes = {
    C1: ['index.js', 'auth.js', 'styles.css'],
    C2: ['auth.js'],
    C3: ['index.js', 'styles.css'],
    C4: ['auth.js'],
  };

  // In snapshot mode: every commit points to ALL files (reused if unchanged)
  // In delta mode: commits only store the diff
  const snapshotColor = (commit, file) =>
    changes[commit].includes(file) ? 'var(--accent)' : 'var(--surface2)';
  const snapshotBorder = (commit, file) =>
    changes[commit].includes(file) ? 'var(--accent)' : 'var(--border)';
  const snapshotText = (commit, file) =>
    changes[commit].includes(file) ? 'new blob' : 'reused →';

  return (
    <div style={{ margin: '32px 0' }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: 'var(--text2)' }}>Storage model:</span>
        {['snapshot', 'delta'].map(m => (
          <button key={m} className="btn"
            style={{
              background: mode === m ? 'var(--accent)' : 'var(--surface)',
              color: mode === m ? '#fff' : 'var(--text2)',
              borderColor: mode === m ? 'var(--accent)' : 'var(--border)',
              fontFamily: 'var(--font-mono)', fontSize: '12px'
            }}
            onClick={() => setMode(m)}>
            {m === 'snapshot' ? '📸 Git (Snapshots)' : '📝 SVN/Diffs'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
        {/* Header */}
        <div style={{ color: 'var(--text3)' }}></div>
        {commits.map(c => (
          <div key={c} style={{ textAlign: 'center', color: 'var(--text)', fontWeight: 700, padding: '6px', background: 'var(--surface)', borderRadius: '4px' }}>{c}</div>
        ))}

        {/* Rows */}
        {files.map(file => (
          <React.Fragment key={file}>
            <div style={{ color: 'var(--text2)', padding: '6px 12px 6px 0', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>{file}</div>
            {commits.map(c => {
              const changed = changes[c].includes(file);
              if (mode === 'snapshot') {
                return (
                  <div key={c} style={{
                    padding: '8px 6px', textAlign: 'center', borderRadius: '4px',
                    background: snapshotColor(c, file) + (changed ? '22' : ''),
                    border: `1px solid ${snapshotBorder(c, file)}`,
                    color: changed ? 'var(--accent)' : 'var(--text3)',
                    fontSize: '10px',
                  }}>
                    {snapshotText(c, file)}
                  </div>
                );
              } else {
                return (
                  <div key={c} style={{
                    padding: '8px 6px', textAlign: 'center', borderRadius: '4px',
                    background: changed ? 'rgba(248,113,113,0.1)' : 'transparent',
                    border: `1px solid ${changed ? 'var(--red)' : 'var(--border)'}`,
                    color: changed ? 'var(--red)' : 'var(--text3)',
                    fontSize: '10px',
                  }}>
                    {changed ? 'Δ diff' : '—'}
                  </div>
                );
              }
            })}
          </React.Fragment>
        ))}
      </div>

      <div style={{ marginTop: '14px', padding: '12px 16px', background: 'var(--surface)', borderRadius: '6px', fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6 }}>
        {mode === 'snapshot'
          ? <><strong style={{ color: 'var(--accent)' }}>Git:</strong> Every commit is a full snapshot. Unchanged files are not re-stored — Git reuses the same blob object (same content = same SHA hash). C2 only changed auth.js, so index.js and styles.css point to the C1 blobs.</>
          : <><strong style={{ color: 'var(--red)' }}>Delta/Diff systems:</strong> Only store what changed. To reconstruct C4, you replay C1 → C2 → C3 → C4. The further back you go, the more diffs you chain. Git avoids this cost entirely.</>
        }
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
export default function MentalModels() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-header-wrap">
          <div className="section-bg-num">03</div>
          <div className="section-label">Fundamentals</div>
          <h2 className="section-title">Core Mental Models</h2>
          <p className="section-desc">
            Stop memorizing commands. Once you understand the DAG and the Three Trees,
            every Git command becomes mathematically predictable — not magic.
          </p>
        </div>

        <Tabs tabs={[
          {
            label: 'The Three Trees',
            content: (
              <>
                <p className="body-text">
                  Git manages data by orchestrating it between three distinct areas. Most Git confusion
                  comes from not knowing <em>which tree</em> a command operates on.
                  Every single Git command does exactly one thing: move data between these trees.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {[
                    { num: '1', name: 'Working Directory', color: 'var(--orange)', file: 'your actual files on disk', desc: 'The sandbox. Files here are untracked or modified. Git sees changes but hasn\'t recorded them anywhere. This is where you write code.' },
                    { num: '2', name: 'Staging Index',     color: 'var(--blue)',   file: '.git/index (binary file)', desc: 'A snapshot of what your NEXT commit will look like. git add copies from Working Dir into here. This is your commit composer — curate it intentionally.' },
                    { num: '3', name: 'HEAD / Repository', color: 'var(--green)',  file: '.git/objects/ (immutable)', desc: 'The permanent history database. git commit takes the exact Index state, compresses it into a content-addressed object, and advances the HEAD pointer.' },
                  ].map(t => (
                    <div key={t.num} style={{ padding: '16px', background: 'var(--surface)', borderLeft: `4px solid ${t.color}`, borderRadius: '0 6px 6px 0', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: t.color + '22', border: `2px solid ${t.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '13px', fontWeight: 800, color: t.color }}>{t.num}</div>
                      <div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '6px' }}>
                          <h4 style={{ color: t.color, margin: 0, fontSize: '15px' }}>{t.name}</h4>
                          <code style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{t.file}</code>
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6 }}>{t.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Callout type="tip">
                  <strong>The key insight:</strong> <code>git status</code> is literally just a diff between these three trees.
                  "Changes not staged" = Working Dir vs Index. "Changes to be committed" = Index vs HEAD.
                </Callout>
              </>
            )
          },
          {
            label: 'Snapshots, Not Diffs',
            content: (
              <>
                <p className="body-text">
                  <strong>The most dangerous misconception about Git:</strong> most developers assume Git stores diffs —
                  that Commit B is "Commit A plus these 5 changed lines."
                </p>
                <p className="body-text">
                  <strong>Git does not store diffs. Git stores full snapshots.</strong> Every commit is a complete photograph
                  of your entire project at that microsecond. If you have 10,000 files and change 1,
                  the new commit points to 1 new blob and 9,999 reused blobs from before.
                </p>
                <p className="body-text">
                  This works efficiently because Git identifies every file by the <strong>SHA-1 hash of its content</strong>.
                  Same content = same hash = stored exactly once across the entire repository. This is called
                  content-addressed storage. Toggle below to see the difference:
                </p>
                <SnapshotVsDelta />
                <DeepDive title="Why Snapshots Make Git Fast">
                  <p>Delta systems (SVN, CVS) must replay a chain of diffs to reconstruct any historical file.
                  The older the version, the longer the chain. Git always has O(1) access to any file at any commit —
                  it just looks up the hash in <code>.git/objects/</code>.</p>
                  <p style={{ marginTop: '12px' }}>Git does use delta compression internally in <strong>packfiles</strong> (created by <code>git gc</code>),
                  but this is a storage optimization invisible to the user. The logical model is always snapshots.</p>
                </DeepDive>
              </>
            )
          },
          {
            label: 'The DAG',
            content: (
              <>
                <p className="body-text">
                  Git history is a <strong>Directed Acyclic Graph (DAG)</strong>. Each word is load-bearing:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
                  {[
                    { word: 'Graph',    color: 'var(--accent)', def: 'Nodes (commits) connected by edges (parent pointers). Each commit stores the SHA of its parent.' },
                    { word: 'Directed', color: 'var(--blue)',   def: 'Edges only point backward in time. A commit knows its parent, but the parent does not know its children — it was created first and is immutable.' },
                    { word: 'Acyclic',  color: 'var(--green)',  def: 'No loops possible. A commit cannot be its own ancestor. This is a mathematical guarantee enforced by content-addressing.' },
                  ].map(d => (
                    <div key={d.word} style={{ display: 'flex', gap: '14px', padding: '12px 16px', background: 'var(--surface)', borderRadius: '6px' }}>
                      <span style={{ color: d.color, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', minWidth: '80px' }}>{d.word}</span>
                      <span style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6 }}>{d.def}</span>
                    </div>
                  ))}
                </div>
                <p className="body-text">
                  Because it is a DAG, operations like finding merge bases, computing history, and binary searching
                  for regressions (<code>git bisect</code>) are provably efficient — no ambiguity, no loops to chase.
                </p>
                <CodeBlock language="bash" code={`# You can see the DAG directly:
git log --oneline --graph --all

# Output looks like:
* 3f2c91d (HEAD -> main) feat: add auth
* e4f5g6h fix: null check
| * a1b2c3d (feature/payments) feat: add stripe
|/
* i7j8k9l feat: initial setup`} />
              </>
            )
          }
        ]} />

        <div className="divider" />

        {/* Three Tree Visualizer — standalone below tabs */}
        <h3 className="subsection-title">Manipulate the Three Trees</h3>
        <p className="body-text">
          This is the actual mental model in motion. <strong>Click "edit"</strong> on a committed file to modify it,
          use <code>git add</code> to move it to the Index, and <code>git commit</code> to snapshot it into HEAD.
          Create new files. Unstage things. Watch the terminal log on every operation.
        </p>
        <ThreeTreeVisualizer />

        <div className="divider" />

        <h3 className="subsection-title">Branches Are Just Pointers</h3>
        <p className="body-text">
          In SVN, creating a branch meant physically duplicating the entire codebase on the server —
          a slow, expensive operation. In Git, a branch is literally a <strong>41-byte text file</strong>
          containing one commit hash. Creating a branch is free and instantaneous.
        </p>
        <CodeBlock language="bash" code={`# A branch is just a file:
cat .git/refs/heads/main
# a3f2c91d4e8b7f1c2d3e4f5a6b7c8d9e0f1a2b3c

# When you commit, Git:
# 1. Creates the commit object in .git/objects/
# 2. Overwrites this 41-byte file with the new hash
# That's it. That's how branches "move forward."`} />
        <p className="body-text">
          This is why branching in Git is encouraged and cheap. Creating 20 feature branches costs you
          20 tiny text files and nothing else. Compare to SVN where each branch was a full copy.
        </p>

        <h3 className="subsection-title">The HEAD Pointer</h3>
        <p className="body-text">
          If branches are pointers to commits, what points to the current branch? <strong>HEAD</strong>.
          HEAD is a special file that tells Git: "you are here." It is a pointer to a pointer.
        </p>
        <CodeBlock language="bash" code={`cat .git/HEAD
# ref: refs/heads/main   ← normal (attached HEAD)

# After: git checkout a3f2c91
cat .git/HEAD
# a3f2c91d4e8b7f1c2d3e4f5a6b7c8d9e0f1a2b3c  ← detached!`} />

        <WarningBox type="warning" title="Detached HEAD State">
          When HEAD points directly to a commit hash instead of a branch name, you are in
          Detached HEAD. You can explore and even commit — but if you switch branches without
          saving your work to a new branch, those commits become <strong>orphans</strong> with
          nothing pointing to them. Git's garbage collector will eventually delete them.
          Use <code>git checkout -b &lt;name&gt;</code> to rescue them.
        </WarningBox>

        <DetachedHeadExplorer />

        <div className="divider" />

        <DeepDive title="SHA-1 Content Addressing & Deduplication">
          <p>Every object in Git's database is named by the SHA-1 hash of its content.
          This has profound consequences:</p>
          <CodeBlock language="bash" code={`# You can manually hash any content:
echo "hello world" | git hash-object --stdin
# b7e23ec29af22b0b4e41da31e868d57226121c84

# Same content ALWAYS produces the same hash.
# This means identical files across 100 branches
# are stored in .git/objects/ EXACTLY ONCE.

# You can also inspect any object:
git cat-file -t b7e23ec  # → blob
git cat-file -p b7e23ec  # → hello world`} />
          <p style={{ marginTop: '12px' }}>The hash is both the <strong>name</strong> and the <strong>integrity check</strong>.
          If a single byte of an object is corrupted on disk, its hash won't match its filename,
          and <code>git fsck</code> will detect it instantly.</p>
        </DeepDive>

      </section>
    </div>
  );
}