import React, { useState, useEffect, useRef } from 'react';
import Callout from '../components/ui/Callout';
import DeepDive from '../components/ui/DeepDive';
import Tabs from '../components/ui/Tabs';
import WarningBox from '../components/ui/WarningBox';
import CodeBlock from '../components/ui/CodeBlock';

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
   1. TIMELINE — VCS History
   Click through the history of version control
══════════════════════════════════════════════════ */
function VCSTimeline() {
  const events = [
    { year: '1972', name: 'SCCS', type: 'cvcs', desc: 'Source Code Control System. First VCS ever. Files locked while one developer edited — teammates literally could not touch the file.', pain: 'One developer blocks everyone else on every file.' },
    { year: '1986', name: 'CVS',  type: 'cvcs', desc: 'Concurrent Versions System. Allowed multiple checkouts but merging was a manual, error-prone nightmare. Repository corruption was common.', pain: 'Merge conflicts often required expert intervention. Renaming a file was catastrophic.' },
    { year: '2000', name: 'SVN',  type: 'cvcs', desc: 'Subversion. Fixed CVS\'s worst bugs. Atomic commits. But still centralized — one server, one truth. Branching = copying the entire directory on the server.', pain: 'No server = no commits. Branching so slow it was culturally discouraged.' },
    { year: '2000', name: 'BitKeeper', type: 'dvcs', desc: 'First mainstream DVCS. Used by the Linux kernel team. Every developer had a full repository copy. Linux Torvalds loved it — until the free license was revoked.', pain: 'Proprietary. License revocation in 2005 triggered creation of Git.' },
    { year: '2005', name: 'Git',  type: 'git',  desc: 'Linus Torvalds built Git in 10 days after BitKeeper drama. Goals: speed, distributed, cryptographic integrity, support for non-linear development (thousands of parallel branches).', pain: null },
    { year: '2008', name: 'GitHub', type: 'github', desc: 'Git hosting + social layer. Pull Requests, Issues, fork model. Transformed open-source collaboration. Acquired by Microsoft in 2018 for $7.5B.', pain: null },
  ];

  const [selected, setSelected] = useState(4);

  const typeColor = { cvcs: '#dc2626', dvcs: '#d97706', git: '#059669', github: '#3b82f6' };
  const typeLabel = { cvcs: 'Centralized', dvcs: 'Distributed', git: 'Git', github: 'Platform' };

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg2)', marginBottom: 32 }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>📅 Version Control History — Click to Explore</span>
      </div>
      <div style={{ padding: 20 }}>
        {/* Timeline strip */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
          {events.map((e, i) => (
            <div key={i} onClick={() => setSelected(i)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', flex: 1, minWidth: 80 }}>
              {/* Connector line */}
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <div style={{ flex: 1, height: 2, background: i === 0 ? 'transparent' : 'var(--border2)' }} />
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: selected === i ? typeColor[e.type] : typeColor[e.type] + '22',
                  border: `2px solid ${typeColor[e.type]}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
                  color: selected === i ? '#fff' : typeColor[e.type],
                  transition: 'all 0.2s', zIndex: 1,
                }}>
                  {e.year.slice(2)}
                </div>
                <div style={{ flex: 1, height: 2, background: i === events.length - 1 ? 'transparent' : 'var(--border2)' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: selected === i ? typeColor[e.type] : 'var(--text3)', marginTop: 6, fontWeight: selected === i ? 700 : 400, textAlign: 'center' }}>{e.name}</div>
              <div style={{ fontSize: 9, color: typeColor[e.type] + 'aa', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>{e.year}</div>
            </div>
          ))}
        </div>

        {/* Detail card */}
        {selected !== null && (
          <div style={{ padding: '16px 20px', background: 'var(--surface)', borderRadius: 10, border: `1px solid ${typeColor[events[selected].type]}44` }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ padding: '3px 10px', borderRadius: 20, background: typeColor[events[selected].type] + '22', border: `1px solid ${typeColor[events[selected].type]}44`, fontFamily: 'var(--font-mono)', fontSize: 10, color: typeColor[events[selected].type], fontWeight: 700, flexShrink: 0 }}>
                {typeLabel[events[selected].type]}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: typeColor[events[selected].type] }}>{events[selected].name} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{events[selected].year}</span></div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, marginBottom: events[selected].pain ? 12 : 0 }}>{events[selected].desc}</p>
            {events[selected].pain && (
              <div style={{ padding: '10px 14px', background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.18)', borderRadius: 6, fontSize: 12, color: '#dc2626', lineHeight: 1.6 }}>
                <strong>Core pain:</strong> {events[selected].pain}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   2. NETWORK TOPOLOGY VISUALIZER
   SVN (centralized) vs Git (distributed)
   Simulate server failure — watch what breaks
══════════════════════════════════════════════════ */
function NetworkTopologyVisualizer() {
  const [mode, setMode] = useState('svn');         // 'svn' | 'git'
  const [serverDown, setServerDown] = useState(false);
  const [activeOp, setActiveOp] = useState(null);  // { from, to, cmd, ok }
  const [log, setLog] = useState([]);

  const ops = {
    svn: [
      { label: 'svn commit', from: 'dev1', to: 'server', cmd: 'svn commit -m "fix"', needsServer: true },
      { label: 'svn log',    from: 'dev2', to: 'server', cmd: 'svn log',             needsServer: true },
      { label: 'svn update', from: 'dev3', to: 'server', cmd: 'svn update',          needsServer: true },
      { label: 'svn diff',   from: 'dev1', to: 'server', cmd: 'svn diff',            needsServer: true },
    ],
    git: [
      { label: 'git commit', from: 'dev1', to: 'dev1',   cmd: 'git commit -m "fix"', needsServer: false },
      { label: 'git log',    from: 'dev2', to: 'dev2',   cmd: 'git log --oneline',   needsServer: false },
      { label: 'git diff',   from: 'dev3', to: 'dev3',   cmd: 'git diff HEAD~1',     needsServer: false },
      { label: 'git push',   from: 'dev1', to: 'server', cmd: 'git push origin main', needsServer: true },
    ],
  };

  const runOp = (op) => {
    const ok = !op.needsServer || !serverDown;
    setActiveOp({ ...op, ok });
    const entry = { cmd: op.cmd, ok, msg: ok ? '✓ success' : `✗ error: ${mode === 'svn' ? 'Could not connect to repository' : 'fatal: unable to access remote'}` };
    setLog(l => [entry, ...l].slice(0, 5));
    setTimeout(() => setActiveOp(null), 1500);
  };

  const toggleServer = () => { setServerDown(v => !v); setLog([]); setActiveOp(null); };

  // Positions
  const devs = [
    { id: 'dev1', label: 'Dev 1', x: 80,  y: 200, color: '#3b82f6' },
    { id: 'dev2', label: 'Dev 2', x: 80,  y: 330, color: '#8b5cf6' },
    { id: 'dev3', label: 'Dev 3', x: 80,  y: 460, color: '#db2777' },
  ];
  const server = { id: 'server', label: mode === 'svn' ? 'SVN Server\n(Full History)' : 'GitHub\n(Remote)', x: 400, y: 330, color: serverDown ? '#dc2626' : '#059669' };

  // For git mode, each dev has their own repo
  const devRepos = [
    { id: 'repo1', label: 'Full Repo', x: 220, y: 200, color: '#3b82f666' },
    { id: 'repo2', label: 'Full Repo', x: 220, y: 330, color: '#8b5cf666' },
    { id: 'repo3', label: 'Full Repo', x: 220, y: 460, color: '#db277766' },
  ];

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg2)', marginBottom: 32 }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>🌐 Network Topology Simulator</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn" onClick={() => { setMode('svn'); setServerDown(false); setLog([]); }} style={{ fontSize: 12, borderColor: mode === 'svn' ? '#dc2626' : undefined, color: mode === 'svn' ? '#dc2626' : undefined }}>SVN (Centralized)</button>
          <button className="btn" onClick={() => { setMode('git'); setServerDown(false); setLog([]); }} style={{ fontSize: 12, borderColor: mode === 'git' ? '#059669' : undefined, color: mode === 'git' ? '#059669' : undefined }}>Git (Distributed)</button>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {/* Legend + server toggle */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontSize: 12, color: 'var(--text2)' }}>
            <strong>{mode === 'svn' ? 'SVN Model:' : 'Git Model:'}</strong> {mode === 'svn' ? 'Every operation requires the central server.' : 'Commit, log, diff — all local. Only push/fetch need the remote.'}
          </div>
          <button className="btn" onClick={toggleServer}
            style={{ marginLeft: 'auto', fontSize: 12, borderColor: serverDown ? '#dc2626' : '#059669', color: serverDown ? '#dc2626' : '#059669', background: serverDown ? 'rgba(220,38,38,0.07)' : 'rgba(5,150,105,0.07)' }}>
            {serverDown ? '🔴 Server is DOWN — click to restore' : '🟢 Server is UP — click to kill it'}
          </button>
        </div>

        {/* SVG topology */}
        <div style={{ overflowX: 'auto' }}>
          <svg width="560" height="560" viewBox="0 0 560 560" style={{ display: 'block', maxWidth: '100%' }}>
            {/* Connections */}
            {mode === 'svn' ? (
              devs.map(d => (
                <line key={d.id} x1={d.x + 36} y1={d.y} x2={server.x - 44} y2={server.y}
                  stroke={serverDown ? '#dc262644' : activeOp?.from === d.id ? '#3b82f6' : 'var(--border2)'}
                  strokeWidth={activeOp?.from === d.id ? 2.5 : 1.5}
                  strokeDasharray={serverDown ? '6 4' : activeOp?.from === d.id ? undefined : undefined}
                  style={{ transition: 'all 0.3s' }} />
              ))
            ) : (
              <>
                {devs.map((d, i) => (
                  <React.Fragment key={d.id}>
                    {/* dev to local repo */}
                    <line x1={d.x + 36} y1={d.y} x2={devRepos[i].x - 30} y2={devRepos[i].y}
                      stroke={activeOp?.from === d.id && !activeOp?.needsServer ? '#059669' : 'var(--border2)'}
                      strokeWidth={activeOp?.from === d.id && !activeOp?.needsServer ? 2.5 : 1.5}
                      style={{ transition: 'all 0.3s' }} />
                    {/* local repo to server */}
                    <line x1={devRepos[i].x + 30} y1={devRepos[i].y} x2={server.x - 44} y2={server.y}
                      stroke={serverDown ? '#dc262633' : activeOp?.from === d.id && activeOp?.needsServer ? '#3b82f6' : 'var(--border2)'}
                      strokeWidth={activeOp?.from === d.id && activeOp?.needsServer ? 2.5 : 1}
                      strokeDasharray={serverDown ? '6 4' : undefined}
                      style={{ transition: 'all 0.3s' }} />
                  </React.Fragment>
                ))}
              </>
            )}

            {/* Server */}
            <g>
              <rect x={server.x - 44} y={server.y - 36} width={88} height={72} rx={10}
                fill={serverDown ? 'rgba(220,38,38,0.1)' : 'rgba(5,150,105,0.1)'}
                stroke={serverDown ? '#dc2626' : '#059669'} strokeWidth={2}
                style={{ transition: 'all 0.4s' }} />
              <text x={server.x} y={server.y - 10} textAnchor="middle" fontSize="10" fontWeight="700"
                fill={serverDown ? '#dc2626' : '#059669'} fontFamily="var(--font-mono)">
                {mode === 'svn' ? 'SVN Server' : 'GitHub'}
              </text>
              <text x={server.x} y={server.y + 6} textAnchor="middle" fontSize="9"
                fill="var(--text3)" fontFamily="var(--font-mono)">
                {mode === 'svn' ? 'Full History' : 'Remote'}
              </text>
              {serverDown && (
                <text x={server.x} y={server.y + 22} textAnchor="middle" fontSize="12" fill="#dc2626">💥 DOWN</text>
              )}
            </g>

            {/* Dev nodes + local repos */}
            {devs.map((d, i) => (
              <g key={d.id}>
                {/* Dev circle */}
                <circle cx={d.x} cy={d.y} r={36} fill={d.color + '18'} stroke={d.color} strokeWidth={2} />
                <text x={d.x} y={d.y - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill={d.color} fontFamily="var(--font-mono)">{d.label}</text>
                <text x={d.x} y={d.y + 10} textAnchor="middle" fontSize="9" fill="var(--text3)" fontFamily="var(--font-mono)">
                  {mode === 'svn' ? 'working copy' : 'local copy'}
                </text>

                {/* Git: local full repo */}
                {mode === 'git' && (
                  <g>
                    <rect x={devRepos[i].x - 30} y={devRepos[i].y - 22} width={60} height={44} rx={6}
                      fill={d.color + '11'} stroke={d.color + '55'} strokeWidth={1.5}
                      style={{ filter: activeOp?.from === d.id && !activeOp?.needsServer ? `drop-shadow(0 0 6px ${d.color}88)` : 'none', transition: 'all 0.3s' }} />
                    <text x={devRepos[i].x} y={devRepos[i].y - 6} textAnchor="middle" fontSize="9" fontWeight="700" fill={d.color} fontFamily="var(--font-mono)">Full</text>
                    <text x={devRepos[i].x} y={devRepos[i].y + 8} textAnchor="middle" fontSize="9" fill={d.color} fontFamily="var(--font-mono)">Repo</text>
                  </g>
                )}
              </g>
            ))}

            {/* "No server needed" banner in git mode */}
            {mode === 'git' && serverDown && (
              <g>
                <rect x={10} y={10} width={220} height={36} rx={6} fill="rgba(5,150,105,0.1)" stroke="#05966966" />
                <text x={20} y={28} fontSize="11" fill="#059669" fontFamily="var(--font-mono)" fontWeight="700">
                  ✓ Local ops still work!
                </text>
                <text x={140} y={28} fontSize="9" fill="var(--text3)" fontFamily="var(--font-mono)">push only fails</text>
              </g>
            )}
          </svg>
        </div>

        {/* Operation buttons */}
        <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {ops[mode].map((op, i) => (
            <button key={i} className="btn" onClick={() => runOp(op)}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 12, borderColor: op.needsServer && serverDown ? '#dc262655' : undefined, color: op.needsServer && serverDown ? '#dc2626' : undefined }}>
              {op.label} {op.needsServer && serverDown ? '⚠' : ''}
            </button>
          ))}
        </div>

        {/* Terminal log */}
        {log.length > 0 && (
          <div style={{ background: 'var(--bg2)', borderRadius: 8, padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            {log.map((l, i) => (
              <div key={i} style={{ marginBottom: i < log.length - 1 ? 8 : 0, opacity: i === 0 ? 1 : 0.45 }}>
                <div style={{ color: '#f0a500' }}>$ {l.cmd}</div>
                <div style={{ color: l.ok ? '#39d353' : '#dc2626', marginTop: 2 }}>{l.msg}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   3. CAP THEOREM VISUALIZER
   Interactive triangle — drag to see Git's tradeoff
══════════════════════════════════════════════════ */
function CAPVisualizer() {
  const [selected, setSelected] = useState('AP');

  const systems = {
    AP: { label: 'Git / CouchDB', color: '#059669', desc: 'Git chooses Availability and Partition Tolerance. If the network goes down, you keep working locally. Consistency is deferred — resolved later through merging.', git: 'This is exactly why git push, git fetch, and git pull exist. 95% of Git operations (commit, log, diff, branch) are local and always available. The sync step is intentionally decoupled.' },
    CP: { label: 'MongoDB (strict), HBase', color: '#3b82f6', desc: 'Consistency + Partition Tolerance. If a network partition occurs, the system refuses writes to avoid inconsistency. Available only when the cluster is healthy.', git: 'SVN chose this model. During a network partition, SVN refuses commits to stay consistent. The price: if the server is down, you cannot commit.' },
    CA: { label: 'Traditional SQL (single node)', color: '#d97706', desc: 'Consistency + Availability. Works perfectly — until a network partition occurs, which it cannot handle. Requires a reliable single-node setup. Not partition tolerant.', git: 'This was the pre-VCS model: a shared network drive. Works great until the network fails, at which point all work stops.' },
  };

  const corners = { AP: [280, 40], CP: [60, 420], CA: [500, 420] };
  const labels  = { AP: [280, 18], CP: [36, 450], CA: [524, 450] };
  const dotLabels = { AP: 'Availability\n+\nPartition', CP: 'Consistency\n+\nPartition', CA: 'Consistency\n+\nAvailability' };

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg2)', marginBottom: 32 }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>📐 CAP Theorem — Where Git Sits</span>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>Click each corner to understand the tradeoff.</div>
      </div>
      <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* SVG Triangle */}
        <div style={{ overflowX: 'auto' }}>
          <svg width="560" height="480" viewBox="0 0 560 480" style={{ display: 'block', maxWidth: '100%' }}>
            {/* Triangle edges */}
            {[['AP','CP'],['CP','CA'],['CA','AP']].map(([a, b], i) => (
              <line key={i}
                x1={corners[a][0]} y1={corners[a][1]}
                x2={corners[b][0]} y2={corners[b][1]}
                stroke="var(--border2)" strokeWidth={1.5} />
            ))}

            {/* Corner dots + labels */}
            {Object.entries(corners).map(([key, [cx, cy]]) => (
              <g key={key} onClick={() => setSelected(key)} style={{ cursor: 'pointer' }}>
                <circle cx={cx} cy={cy} r={20}
                  fill={selected === key ? systems[key].color : systems[key].color + '22'}
                  stroke={systems[key].color} strokeWidth={2}
                  style={{ transition: 'all 0.2s' }} />
                <text x={cx} y={cy + 5} textAnchor="middle" fontSize="10" fontWeight="700"
                  fill={selected === key ? '#fff' : systems[key].color} fontFamily="var(--font-mono)">{key}</text>

                {/* Axis labels */}
                {dotLabels[key].split('\n').map((line, li) => (
                  <text key={li} x={labels[key][0]} y={labels[key][1] + li * 13} textAnchor="middle"
                    fontSize="10" fill={selected === key ? systems[key].color : 'var(--text3)'}
                    fontFamily="var(--font-mono)" fontWeight={selected === key ? 700 : 400} style={{ transition: 'all 0.2s' }}>
                    {line}
                  </text>
                ))}
              </g>
            ))}

            {/* Center label */}
            <text x={280} y={230} textAnchor="middle" fontSize="11" fill="var(--text3)" fontFamily="var(--font-mono)">Pick any two</text>
            <text x={280} y={248} textAnchor="middle" fontSize="10" fill="var(--text3)" fontFamily="var(--font-mono)">(CAP theorem)</text>

            {/* Highlighted triangle section */}
            {selected && (
              <polygon
                points={`${corners[selected][0]},${corners[selected][1]} 280,240 ${corners[selected][0]},${corners[selected][1]}`}
                fill={systems[selected].color + '11'}
                stroke={systems[selected].color + '44'} strokeWidth={1}
              />
            )}
          </svg>
        </div>

        {/* Detail pane */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.entries(systems).map(([key, sc]) => (
            <div key={key} onClick={() => setSelected(key)}
              style={{ padding: '14px 16px', background: 'var(--surface)', borderRadius: 8, border: `2px solid ${selected === key ? sc.color : 'var(--border)'}`, cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: selected === key ? 10 : 0 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: sc.color }}>{key}</span>
                <span style={{ fontSize: 12, color: 'var(--text3)' }}>{sc.label}</span>
              </div>
              {selected === key && (
                <>
                  <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.65, marginBottom: 10 }}>{sc.desc}</p>
                  <div style={{ padding: '10px 12px', background: sc.color + '11', border: `1px solid ${sc.color}33`, borderRadius: 6, fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
                    <strong style={{ color: sc.color }}>In Git:</strong> {sc.git}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   4. GIT vs GITHUB INTERACTIVE COMPARISON
   Click each row to expand what it means
══════════════════════════════════════════════════ */
function GitVsGithubTable() {
  const [expanded, setExpanded] = useState(null);

  const rows = [
    {
      attr: 'What it is',
      git: 'A CLI software program installed on your machine',
      github: 'A SaaS web platform hosted by Microsoft',
      detail: 'Git is a ~5MB binary installed via brew/apt/winget. It runs entirely locally. GitHub is a web application you access at github.com — it does not modify your Git installation. You could use Git your entire career without ever touching GitHub (using GitLab, Bitbucket, or a self-hosted Gitea instead).',
    },
    {
      attr: 'Creator & Year',
      git: 'Linus Torvalds, 2005 (10 days)',
      github: 'Tom Preston-Werner, Chris Wanstrath, 2008',
      detail: 'Git was born from necessity: BitKeeper revoked their free license for Linux kernel development. Torvalds\'s requirements: speed (commit in < 1s on 25,000-file repo), correctness (SHA-1 integrity), and non-linear development support. GitHub was separately founded 3 years later as a hosting layer, acquired by Microsoft in 2018 for $7.5 billion.',
    },
    {
      attr: 'Where it lives',
      git: 'Inside your .git/ folder — local disk only',
      github: 'Microsoft Azure datacenters (global)',
      detail: 'Every git command that doesn\'t involve push/fetch/pull is entirely local — reading and writing to .git/. GitHub\'s infrastructure involves multiple redundant data centers. When you push, Git objects are replicated across geographic regions for durability. The github.com you see is a Ruby on Rails application that queries internal services (like Gitaly) to read Git data from disk.',
    },
    {
      attr: 'Primary job',
      git: 'Version control: tracking changes, branching, history',
      github: 'Collaboration: PRs, Issues, Actions, Packages',
      detail: 'Git\'s job ends at "track and merge code history." GitHub builds an entire collaboration workflow on top: Pull Requests (code review), Issues (bug tracking), Actions (CI/CD pipelines), GitHub Pages (static hosting), Packages (artifact registry), Codespaces (cloud dev environments), and Copilot (AI assistance). None of these are Git — they\'re GitHub products.',
    },
    {
      attr: 'Network required?',
      git: '95% of commands work fully offline',
      github: 'Always requires internet (it\'s a web app)',
      detail: 'git commit, git log, git diff, git branch, git merge, git rebase, git stash, git cherry-pick — all 100% local. Only git push, git fetch, and git pull require network access to communicate with a remote. This offline-first design is deliberate — you can work on a plane, in a bunker, with no connection, and your full workflow is uninterrupted.',
    },
    {
      attr: 'Alternatives',
      git: 'Mercurial (hg), SVN, Perforce, Fossil',
      github: 'GitLab (self-host), Bitbucket, Gitea, Forgejo',
      detail: 'Git won the VCS wars — it has ~95% market share. Mercurial (used by Facebook until 2014, still used internally) is the closest competitor. For the hosting layer, GitLab is the most popular alternative, especially for self-hosted enterprise setups. Gitea/Forgejo are lightweight open-source options for teams who want full control.',
    },
  ];

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg2)', marginBottom: 32 }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>⚡ Git vs GitHub — Click any row to expand</span>
      </div>
      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Attribute</div>
        <div style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#059669', fontWeight: 700, borderLeft: '1px solid var(--border)' }}>Git</div>
        <div style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#3b82f6', fontWeight: 700, borderLeft: '1px solid var(--border)' }}>GitHub</div>
      </div>
      {rows.map((row, i) => (
        <div key={i} onClick={() => setExpanded(expanded === i ? null : i)}
          style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : undefined, cursor: 'pointer', background: expanded === i ? 'var(--surface)' : 'var(--bg2)', transition: 'background 0.15s' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr', alignItems: 'start' }}>
            <div style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}>
              {row.attr}
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>{expanded === i ? '▲' : '▼'}</span>
            </div>
            <div style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text2)', borderLeft: '1px solid var(--border)' }}>{row.git}</div>
            <div style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text2)', borderLeft: '1px solid var(--border)' }}>{row.github}</div>
          </div>
          {expanded === i && (
            <div style={{ padding: '0 16px 16px 16px', gridColumn: '1/-1' }}>
              <div style={{ padding: '12px 16px', background: 'var(--bg2)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>
                {row.detail}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   5. SHA-1 INTEGRITY DEMO
   Type text, watch the hash change, understand why
   rewriting history changes all downstream hashes
══════════════════════════════════════════════════ */
function SHAIntegrityDemo() {
  const [msg, setMsg] = useState('feat: add login page');
  const [parent, setParent] = useState('a1b2c3d4e5f6');

  // Deterministic fake hash — changes visibly when input changes
  const fakeHash = (input) => {
    let h = 0;
    for (let i = 0; i < input.length; i++) { h = (Math.imul(31, h) + input.charCodeAt(i)) | 0; }
    const hex = (Math.abs(h) + input.length * 7919).toString(16).padStart(8, '0');
    return (hex + hex.split('').reverse().join('') + hex).slice(0, 40);
  };

  const commitData = `tree 4b825dc6...\nauthor Dev <dev@co.io> 1734500000 +0000\ncommitter Dev <dev@co.io> 1734500000 +0000\nparent ${parent}\n\n${msg}`;
  const hash = fakeHash(commitData);

  // Child commit depends on this commit's hash as its parent
  const childData = `tree 9c3f71a2...\nauthor Dev <dev@co.io> 1734500100 +0000\nparent ${hash}\n\nfix: correct typo`;
  const childHash = fakeHash(childData);

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg2)', marginBottom: 32 }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>🔐 Cryptographic Integrity — Edit & Watch Hashes Cascade</span>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>Change the commit message or parent hash. Every downstream commit SHA changes too.</div>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Inputs */}
          <div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Commit message</label>
              <input value={msg} onChange={e => setMsg(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border2)', fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--surface)', color: 'var(--text)', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Parent commit SHA (simulated)</label>
              <input value={parent} onChange={e => setParent(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border2)', fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--surface)', color: 'var(--text)', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, color: 'var(--text3)', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--text2)' }}>What Git actually hashes:</strong>
              <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 10, marginTop: 8, color: 'var(--text3)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{commitData}</pre>
            </div>
          </div>

          {/* Hash chain */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Commit chain</div>

            {/* This commit */}
            <div style={{ padding: '12px 14px', background: 'var(--surface)', border: '1px solid #3b82f655', borderRadius: 8, marginBottom: 4 }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>Your commit SHA:</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#3b82f6', wordBreak: 'break-all', transition: 'color 0.2s' }}>{hash}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 6 }}>{msg}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              <div style={{ width: 2, height: 20, background: 'var(--border2)' }} />
            </div>

            {/* Child commit */}
            <div style={{ padding: '12px 14px', background: 'var(--surface)', border: '1px solid #8b5cf655', borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>Child commit SHA (also changes!):</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#8b5cf6', wordBreak: 'break-all', transition: 'color 0.2s' }}>{childHash}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 6 }}>fix: correct typo</div>
            </div>

            <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(5,150,105,0.07)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: 6, fontSize: 12, color: 'var(--text2)', lineHeight: 1.65 }}>
              ✓ Change any byte in any commit and its SHA changes. All descendant commits inherit the new SHA as their parent — every one of them gets a new SHA too. This makes it <strong>cryptographically impossible</strong> to secretly alter history.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   6. GITHUB ARCHITECTURE EXPLAINER
   Spokes / Gitaly animated diagram
══════════════════════════════════════════════════ */
function GitHubArchitectureDiagram() {
  const [step, setStep] = useState(0);

  const steps = [
    { label: 'You push', desc: 'You run git push. Your Git client opens a TCP connection to github.com and begins the receive-pack protocol — transferring pack objects over the wire.' },
    { label: 'Load balancer', desc: 'GitHub\'s edge load balancer (HAProxy / nginx) receives the TCP connection and routes it to a Spokes node based on the repository\'s shard.' },
    { label: 'Spokes replication', desc: 'The Spokes service receives the objects and immediately replicates them to 3 geographically separated "replicas." The push is not acknowledged until all 3 confirm receipt.' },
    { label: 'Gitaly write', desc: 'Gitaly (the Git RPC server) receives the objects from Spokes and runs git receive-pack on the actual .git directory on disk, updating the refs.' },
    { label: 'Rails webhook', desc: 'Gitaly signals the GitHub Rails monolith (github.com). Rails processes web hooks, updates the database (MySQL), sends push notifications, and triggers GitHub Actions if configured.' },
    { label: 'Your push returns', desc: 'The push completes. git push returns "Branch \'main\' set up to track remote." The entire process — replication across 3 DCs + DB update — typically takes < 500ms.' },
  ];

  const nodes = [
    { id: 'client',  label: 'Your\nMachine', x: 50,  y: 160, color: '#3b82f6' },
    { id: 'lb',      label: 'Load\nBalancer', x: 200, y: 160, color: '#d97706' },
    { id: 'spokes',  label: 'Spokes', x: 360, y: 160, color: '#8b5cf6' },
    { id: 'r1',      label: 'Replica\nUS-East', x: 310, y: 300, color: '#8b5cf644' },
    { id: 'r2',      label: 'Replica\nEU-West', x: 410, y: 300, color: '#8b5cf644' },
    { id: 'r3',      label: 'Replica\nAP-SE', x: 510, y: 300, color: '#8b5cf644' },
    { id: 'gitaly',  label: 'Gitaly\n(RPC)', x: 510, y: 160, color: '#059669' },
    { id: 'rails',   label: 'Rails\n(github.com)', x: 650, y: 160, color: '#dc2626' },
  ];

  const edges = [
    [0,1],[1,2],[2,3],[2,4],[2,5],[2,6],[6,7]
  ];

  const activeEdge = step; // which edge lights up

  const getNode = id => nodes.find(n => n.id === id);

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg2)', marginBottom: 32 }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>🏗 GitHub Architecture — What happens on git push?</span>
        <button className="btn" onClick={() => setStep(0)} style={{ fontSize: 12 }}>↺ Reset</button>
      </div>
      <div style={{ padding: 20 }}>
        {/* Progress */}
        <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, marginBottom: 16 }}>
          <div style={{ height: '100%', background: '#3b82f6', borderRadius: 2, width: `${(step / (steps.length - 1)) * 100}%`, transition: 'width 0.4s ease' }} />
        </div>

        {/* SVG */}
        <div style={{ overflowX: 'auto', marginBottom: 16 }}>
          <svg width="760" height="380" viewBox="0 0 760 380" style={{ display: 'block', maxWidth: '100%' }}>
            <defs>
              <marker id="arch-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L7,3 z" fill="var(--border2)" />
              </marker>
              <marker id="arch-arrow-active" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L7,3 z" fill="#3b82f6" />
              </marker>
            </defs>

            {edges.map(([ai, bi], i) => {
              const a = nodes[ai], b = nodes[bi];
              const isActive = i < step;
              const isCurrent = i === step - 1;
              return (
                <line key={i} x1={a.x + 36} y1={a.y} x2={b.x - 36} y2={b.y}
                  stroke={isActive ? '#3b82f6' : 'var(--border2)'}
                  strokeWidth={isCurrent ? 3 : isActive ? 2 : 1.5}
                  markerEnd={isActive ? 'url(#arch-arrow-active)' : 'url(#arch-arrow)'}
                  style={{ transition: 'all 0.4s' }} />
              );
            })}

            {nodes.map((n, i) => {
              const isActive = step > i;
              const col = typeof n.color === 'string' && n.color.length === 9 ? n.color.slice(0, 7) : n.color;
              return (
                <g key={n.id}>
                  <rect x={n.x - 36} y={n.y - 24} width={72} height={48} rx={8}
                    fill={isActive ? col + '22' : 'var(--surface)'}
                    stroke={isActive ? col : 'var(--border2)'}
                    strokeWidth={isActive ? 2 : 1}
                    style={{ transition: 'all 0.4s', filter: isActive ? `drop-shadow(0 0 8px ${col}55)` : 'none' }} />
                  {n.label.split('\n').map((line, li) => (
                    <text key={li} x={n.x} y={n.y - 6 + li * 14} textAnchor="middle" fontSize="9" fontWeight="700"
                      fill={isActive ? col : 'var(--text3)'} fontFamily="var(--font-mono)" style={{ transition: 'all 0.4s' }}>
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}

            {/* Replica group label */}
            <text x={410} y={270} textAnchor="middle" fontSize="9" fill="var(--text3)" fontFamily="var(--font-mono)">
              3× geographic replicas (replication quorum)
            </text>
          </svg>
        </div>

        {/* Step info */}
        <div style={{ padding: '14px 16px', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: '#3b82f6', marginBottom: 5 }}>
            Step {step + 1}/{steps.length}: {steps[step].label}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65 }}>{steps[step].desc}</div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn" onClick={() => setStep(0)} style={{ fontSize: 12 }}>↺</button>
          <button className="btn" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} style={{ fontSize: 12 }}>← Back</button>
          <button className="btn" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1}
            style={{ background: step < steps.length - 1 ? '#3b82f6' : undefined, color: step < steps.length - 1 ? '#fff' : undefined, borderColor: 'transparent', fontSize: 12 }}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════ */
export default function Intro() {
  const r1 = useFadeIn(), r2 = useFadeIn(), r3 = useFadeIn();
  const r4 = useFadeIn(), r5 = useFadeIn(), r6 = useFadeIn();

  return (
    <div className="page-content">
      <section className="section">

        {/* ── Hero Header ── */}
        <div className="section-header-wrap" ref={r1}>
          <div className="section-bg-num">01</div>
          <div className="section-label">Introduction</div>
          <h2 className="section-title">Why Git & GitHub?</h2>
          <p className="section-desc">
            The fundamental architecture of distributed version control — why it was invented, how it works mathematically, and why it took over the entire software industry in under a decade.
          </p>
        </div>

        <Callout type="info" title="Start here — even if you already know Git">
          Most developers learn Git commands before understanding why it was designed the way it was. That missing context is why force-push disasters happen, why rebase feels mysterious, and why "detached HEAD" is terrifying. This section builds the mental foundation everything else rests on.
        </Callout>

        {/* ── 1. VCS History Timeline ── */}
        <div className="fade-in-section" ref={r2}>
          <h3 className="subsection-title">50 Years of Version Control — The Problem Git Solved</h3>
          <p className="body-text">
            Git didn't appear in a vacuum. It was the culmination of 30+ years of painful lessons about how teams collaborate on code. Click through the timeline to understand what was broken before 2005.
          </p>
          <VCSTimeline />

          <Tabs tabs={[
            {
              label: 'The Problem (CVCS)',
              content: (
                <>
                  <p className="body-text">
                    Centralized Version Control Systems (CVCS) like SVN placed the entire repository on a single server. Every meaningful operation — commit, view history, create a branch — required a round-trip to that server.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                    {[
                      { icon: '🔴', title: 'Single Point of Failure', desc: 'Server goes down → entire team stops. No commits, no history, no branching. Everyone stares at each other.' },
                      { icon: '🐌', title: 'Painful Branching', desc: 'SVN branches were physical directory copies on the server. Slow to create, slow to merge, culturally discouraged. One branch per release was the norm.' },
                      { icon: '🌐', title: 'Network Dependency', desc: 'Working on a plane was impossible. Slow VPN = slow Git. Rural office with bad connectivity = unproductive team.' },
                    ].map((p, i) => (
                      <div key={i} style={{ padding: '14px 16px', background: 'var(--surface)', borderRadius: 8, border: '1px solid rgba(220,38,38,0.2)' }}>
                        <div style={{ fontSize: 20, marginBottom: 8 }}>{p.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6, color: 'var(--text)' }}>{p.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>{p.desc}</div>
                      </div>
                    ))}
                  </div>
                  <DeepDive title="Why Linus built Git in 10 days (not 10 months)">
                    <p>In 2002, the Linux kernel project started using BitKeeper (a proprietary DVCS) for free. In April 2005, the free license was revoked after a developer tried to reverse-engineer the BitKeeper protocol. Linus evaluated Monotone and Subversion, rejected both as too slow, and wrote Git from scratch.</p>
                    <p style={{ marginTop: 10 }}>His benchmarks: Git needed to be able to apply the Mozilla patch set (a 25,000-file repository) in 30 seconds. SVN took 30 minutes for the same operation. He hit his target on day 10.</p>
                    <p style={{ marginTop: 10 }}>The Linux kernel project has been on Git since June 16, 2005 — one of the first production users.</p>
                  </DeepDive>
                </>
              )
            },
            {
              label: 'The Solution (DVCS)',
              content: (
                <>
                  <p className="body-text">
                    Git is a <strong>Distributed Version Control System</strong>. "Distributed" means every clone is a full, self-contained replica of the entire repository — including every commit, every branch, every tag, all the way back to the first commit.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                    {[
                      { icon: '✈️', title: 'Offline First', desc: 'git commit, log, diff, branch, merge, rebase — all 100% local. Only push/fetch/pull need a network. Work on a plane indefinitely.' },
                      { icon: '⚡', title: 'Instant Branching', desc: 'A branch is a 41-byte text file pointing to a commit SHA. Creating one takes zero milliseconds. Thousands of branches are trivial.' },
                      { icon: '🔐', title: 'Cryptographic Integrity', desc: 'Every object is SHA-1 hashed. Altering any file in history changes that commit\'s hash and every descendant hash. Tampering is mathematically detectable.' },
                    ].map((p, i) => (
                      <div key={i} style={{ padding: '14px 16px', background: 'var(--surface)', borderRadius: 8, border: '1px solid rgba(5,150,105,0.2)' }}>
                        <div style={{ fontSize: 20, marginBottom: 8 }}>{p.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6, color: 'var(--text)' }}>{p.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>{p.desc}</div>
                      </div>
                    ))}
                  </div>
                  <CodeBlock language="bash" code={`# Every command that works 100% offline:
git status          # compare working dir vs index vs HEAD
git add -p          # stage hunks interactively
git commit          # write a commit object to .git/objects/
git log --graph     # traverse the DAG locally
git branch feature  # write 41 bytes to .git/refs/heads/feature
git merge           # compute 3-way diff from local objects
git rebase -i       # rewrite local history
git stash           # save uncommitted work

# Commands that REQUIRE network:
git push            # upload local objects to remote
git fetch           # download remote objects locally
git pull            # fetch + merge/rebase`} />
                </>
              )
            },
          ]} />
        </div>

        <div className="divider" />

        {/* ── 2. Network Topology ── */}
        <div className="fade-in-section" ref={r3}>
          <h3 className="subsection-title">Centralized vs Distributed — Simulate a Server Failure</h3>
          <p className="body-text">
            The architectural difference isn't just philosophical — it has immediate practical consequences. Kill the server below and see which operations survive.
          </p>
          <NetworkTopologyVisualizer />
        </div>

        <div className="divider" />

        {/* ── 3. CAP Theorem ── */}
        <div className="fade-in-section" ref={r4}>
          <h3 className="subsection-title">CAP Theorem — Git's Deliberate Tradeoff</h3>
          <p className="body-text">
            The CAP Theorem (Brewer, 2000) proves that any distributed data store can guarantee at most two of three properties: <strong>Consistency</strong> (all nodes see the same data), <strong>Availability</strong> (every request gets a response), and <strong>Partition Tolerance</strong> (the system works despite network splits). Git's designers made a deliberate choice.
          </p>
          <CAPVisualizer />

          <DeepDive title="How Git resolves eventual consistency">
            <p>Git is an AP system with eventual consistency. When two developers work independently (a "partition"), they each have their own diverging history. Consistency is resolved when they merge or rebase. Git's merge algorithms (recursive, ORT, diff3) are the mathematical machinery of this eventual consistency resolution.</p>
            <p style={{ marginTop: 10 }}>The <code style={{ fontFamily: 'var(--font-mono)' }}>diff3</code> algorithm Git uses for conflict resolution is a direct implementation of 3-way merge: ancestor + ours + theirs. If both parties modified the same region differently, Git surfaces a conflict — the human resolves it, restoring consistency manually. This is fundamentally the same problem distributed databases solve with CRDTs and vector clocks, just in a human-readable domain.</p>
          </DeepDive>
        </div>

        <div className="divider" />

        {/* ── 4. Cryptographic Integrity ── */}
        <div className="fade-in-section" ref={r5}>
          <h3 className="subsection-title">Cryptographic Integrity — Why You Can't Secretly Alter History</h3>
          <p className="body-text">
            Every Git object (blob, tree, commit, tag) is identified by the SHA-1 hash of its content. A commit's SHA includes its message, author, timestamp, and — critically — its parent's SHA. Change any commit and every subsequent SHA changes too. Edit the demo below to see it live.
          </p>
          <SHAIntegrityDemo />
        </div>

        <div className="divider" />

        {/* ── 5. Git vs GitHub Table ── */}
        <div className="fade-in-section" ref={r6}>
          <h3 className="subsection-title">Git vs GitHub — Unmixing the Concepts</h3>
          <p className="body-text">
            The most persistent misconception in software development: treating Git and GitHub as the same thing. They are separate products, built by different people, for different purposes, three years apart. You can use Git without GitHub forever — and millions of engineers do.
          </p>
          <GitVsGithubTable />

          <WarningBox type="info" title="The 'Source of Truth' Fallacy">
            Because GitHub is so dominant, developers assume it holds the "real" version of the code. To Git, GitHub is just another peer node — a remote named <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>origin</code>. There is no architectural difference between your laptop's repo and GitHub's repo. The entire industry socially agreed to treat GitHub as authoritative. If GitHub's servers disappeared tomorrow, every team that has cloned their repo has a complete copy and could reconstruct the entire history.
          </WarningBox>

          <DeepDive title="GitHub's actual architecture — what happens on git push">
            <p>When you push, you are not uploading files. You are sending <strong>pack objects</strong> — a binary format containing compressed Git objects (blobs, trees, commits) that the remote doesn't have yet.</p>
            <p style={{ marginTop: 10 }}>GitHub's routing layer is called <strong>Spokes</strong>. It receives your push and replicates the objects to three geographically separate replica servers before acknowledging success. This is a synchronous quorum write — your push blocks until 3 replicas confirm.</p>
            <p style={{ marginTop: 10 }}>The actual Git operations on disk are handled by <strong>Gitaly</strong> — a gRPC service written in Go that wraps raw Git operations. The github.com Rails monolith never directly runs Git — it calls Gitaly RPCs, which then read C-level Git object structures from disk with microsecond latency.</p>
          </DeepDive>
        </div>

        <div className="divider" />

        {/* ── 6. GitHub Architecture ── */}
        <h3 className="subsection-title">What Happens on git push — GitHub's Architecture</h3>
        <p className="body-text">
          A push is not just "upload files." It traverses multiple systems with geographic replication before your terminal returns. Step through what actually happens:
        </p>
        <GitHubArchitectureDiagram />

        <div className="divider" />

        {/* ── Quick Reference ── */}
        <h3 className="subsection-title">Key Facts to Remember</h3>
        <CodeBlock language="bash" code={`# Git is a local tool — GitHub is an optional remote
git init             # creates .git/ — no GitHub needed
git remote -v        # GitHub is just a named URL, nothing special
git remote add origin git@github.com:user/repo.git

# "origin" is just a convention — you could name it anything
git remote add github  git@github.com:user/repo.git
git remote add gitlab  git@gitlab.com:user/repo.git
git remote add backup  git@backup-server.internal:repo.git

# Offline-capable operations (the vast majority)
git commit           # local only
git log --all        # reads .git/objects locally
git diff HEAD~5      # local object comparison

# Network-required operations (the minority)
git push origin main       # upload objects
git fetch --all            # download new objects
git clone <url>            # initial full download`} />

      </section>
    </div>
  );
}