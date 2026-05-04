import React, { useState, useEffect, useRef } from 'react';
import InteractivePatchStaging from '../components/InteractivePatchStaging';
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
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── Git Index Visualizer ─── */
function GitIndexVisualizer() {
  const [files, setFiles] = useState([
    { name: 'src/auth.js',    modified: true,  staged: false, changes: ['Fixed null session bug', 'Added token expiry check'] },
    { name: 'src/cart.js',    modified: true,  staged: false, changes: ['Updated total calc', 'New discount feature'] },
    { name: 'README.md',      modified: true,  staged: false, changes: ['Fixed a typo'] },
    { name: 'src/db.js',      modified: false, staged: false, changes: [] },
  ]);
  const [log, setLog] = useState([]);
  const [committed, setCommitted] = useState([]);
  const [msg, setMsg] = useState('');
  const [phase, setPhase] = useState('stage'); // stage | commit | done
  const [animFile, setAnimFile] = useState(null);

  const stage = (name) => {
    setAnimFile(name);
    setTimeout(() => {
      setFiles(f => f.map(x => x.name === name ? { ...x, staged: true } : x));
      setLog(l => [`  staged: ${name}`, ...l]);
      setAnimFile(null);
    }, 400);
  };

  const unstage = (name) => {
    setFiles(f => f.map(x => x.name === name ? { ...x, staged: false } : x));
    setLog(l => [`  unstaged: ${name}`, ...l]);
  };

  const stageAll = () => {
    files.filter(f => f.modified && !f.staged).forEach(f => stage(f.name));
  };

  const commit = () => {
    if (!msg.trim()) return;
    const staged = files.filter(f => f.staged);
    setCommitted(c => [...c, { message: msg, files: staged.map(f => f.name), hash: Math.random().toString(36).slice(2, 9) }]);
    setFiles(f => f.map(x => x.staged ? { ...x, staged: false, modified: false } : x));
    setLog(l => [`✔ commit: "${msg}"`, ...l]);
    setMsg('');
    if (files.filter(f => f.modified && !f.staged).length === 0) setPhase('done');
  };

  const reset = () => {
    setFiles([
      { name: 'src/auth.js',    modified: true,  staged: false, changes: ['Fixed null session bug', 'Added token expiry check'] },
      { name: 'src/cart.js',    modified: true,  staged: false, changes: ['Updated total calc', 'New discount feature'] },
      { name: 'README.md',      modified: true,  staged: false, changes: ['Fixed a typo'] },
      { name: 'src/db.js',      modified: false, staged: false, changes: [] },
    ]);
    setLog([]); setCommitted([]); setMsg(''); setPhase('stage');
  };

  const zones = [
    { label: 'Working Directory', key: 'wd',     color: '#ea580c', bg: 'rgba(234,88,12,0.07)'  },
    { label: 'Staging Index',     key: 'index',  color: '#3b82f6', bg: 'rgba(59,130,246,0.07)' },
    { label: 'Repository',        key: 'repo',   color: '#059669', bg: 'rgba(5,150,105,0.07)'  },
  ];

  const wdFiles    = files.filter(f => f.modified && !f.staged);
  const indexFiles = files.filter(f => f.staged);
  const cleanFiles = files.filter(f => !f.modified && !f.staged);

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg2)', marginBottom: 32 }}>
      {/* Header */}
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>⚡ Git Three-Trees Visualizer</span>
        <button className="btn" onClick={reset} style={{ fontSize: 12 }}>Reset</button>
      </div>

      {/* Three zones */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, padding: 20 }}>
        {/* Working Dir */}
        <div style={{ background: zones[0].bg, border: `1px solid ${zones[0].color}33`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: zones[0].color, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
            Working Directory
          </div>
          {wdFiles.length === 0 && <div style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>All changes staged</div>}
          {wdFiles.map(f => (
            <div key={f.name} style={{
              background: 'var(--surface)', border: `1px solid ${zones[0].color}55`, borderRadius: 6,
              padding: '8px 10px', marginBottom: 8, fontSize: 12, fontFamily: 'var(--font-mono)',
              opacity: animFile === f.name ? 0.3 : 1, transition: 'opacity 0.4s'
            }}>
              <div style={{ color: zones[0].color, marginBottom: 4 }}>{f.name}</div>
              {f.changes.map((c, i) => <div key={i} style={{ color: 'var(--text3)', fontSize: 11 }}>+ {c}</div>)}
              <button className="btn" onClick={() => stage(f.name)} style={{ marginTop: 8, fontSize: 11, padding: '3px 8px', background: zones[1].bg, borderColor: zones[1].color + '55', color: zones[1].color }}>
                git add →
              </button>
            </div>
          ))}
          {cleanFiles.map(f => (
            <div key={f.name} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', marginBottom: 8, fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text3)' }}>
              {f.name} <span style={{ fontSize: 10 }}>(unmodified)</span>
            </div>
          ))}
          {wdFiles.length > 1 && (
            <button className="btn" onClick={stageAll} style={{ fontSize: 11, padding: '4px 10px', width: '100%', marginTop: 4 }}>
              git add . (stage all)
            </button>
          )}
        </div>

        {/* Staging Index */}
        <div style={{ background: zones[1].bg, border: `1px solid ${zones[1].color}33`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: zones[1].color, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
            Staging Index
          </div>
          {indexFiles.length === 0 && <div style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>Nothing staged yet</div>}
          {indexFiles.map(f => (
            <div key={f.name} style={{ background: 'var(--surface)', border: `1px solid ${zones[1].color}55`, borderRadius: 6, padding: '8px 10px', marginBottom: 8, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
              <div style={{ color: zones[1].color, marginBottom: 4 }}>{f.name}</div>
              {f.changes.map((c, i) => <div key={i} style={{ color: 'var(--text3)', fontSize: 11 }}>✓ {c}</div>)}
              <button className="btn" onClick={() => unstage(f.name)} style={{ marginTop: 8, fontSize: 11, padding: '3px 8px', color: 'var(--red)', borderColor: 'var(--red)33' }}>
                ← unstage
              </button>
            </div>
          ))}
          {indexFiles.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <input
                value={msg}
                onChange={e => setMsg(e.target.value)}
                placeholder='feat: describe your changes'
                style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border2)', fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--surface)', color: 'var(--text)', marginBottom: 8, boxSizing: 'border-box' }}
              />
              <button className="btn" onClick={commit} style={{ width: '100%', fontSize: 12, background: msg ? zones[1].color : undefined, color: msg ? '#fff' : undefined }}>
                git commit →
              </button>
            </div>
          )}
        </div>

        {/* Repo */}
        <div style={{ background: zones[2].bg, border: `1px solid ${zones[2].color}33`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: zones[2].color, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
            Repository (.git)
          </div>
          {committed.length === 0 && <div style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>No commits yet</div>}
          {committed.map((c, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: `1px solid ${zones[2].color}55`, borderRadius: 6, padding: '8px 10px', marginBottom: 8, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
              <div style={{ color: 'var(--text3)', fontSize: 10 }}>{c.hash}</div>
              <div style={{ color: zones[2].color, margin: '3px 0' }}>{c.message}</div>
              {c.files.map((f, j) => <div key={j} style={{ color: 'var(--text3)', fontSize: 11 }}>• {f}</div>)}
            </div>
          ))}
        </div>
      </div>

      {/* Activity log */}
      {log.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '12px 20px', background: 'var(--surface)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          {log.slice(0, 4).map((l, i) => (
            <div key={i} style={{ color: i === 0 ? 'var(--green)' : 'var(--text3)', marginBottom: 2 }}>
              {i === 0 ? '▶ ' : '  '}{l}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Commit Message Validator ─── */
function CommitMessageValidator() {
  const [input, setInput] = useState('');
  const examples = [
    { msg: 'fix stuff',                           why: 'No type prefix, no scope, vague description. Says nothing about WHAT was fixed or WHY.' },
    { msg: 'WIP',                                 why: '"Work in Progress" should never be pushed. It pollutes history and tells reviewers nothing.' },
    { msg: 'fixed the bug with the login thing',  why: 'No type, lowercase, vague. Six months later no one knows which bug or which login.' },
    { msg: 'feat(auth): add JWT refresh token rotation', why: null },
    { msg: 'fix(cart): correct quantity multiplier in total calc\n\nPreviously, item.price was summed without multiplying by\nitem.quantity, causing wrong totals for qty > 1.\n\nCloses #142', why: null },
  ];

  const validate = (msg) => {
    if (!msg) return null;
    const conventionalRegex = /^(feat|fix|chore|refactor|docs|test|style|perf|ci|build|revert)(\([a-z0-9-]+\))?!?: .{1,72}/;
    const lines = msg.split('\n');
    const subject = lines[0];
    const results = [];

    if (!conventionalRegex.test(subject)) results.push({ ok: false, msg: 'Subject must start with a type: feat|fix|chore|refactor|docs|test|style|perf|ci|build|revert' });
    else results.push({ ok: true, msg: 'Type prefix is valid ✓' });

    if (subject.length > 72) results.push({ ok: false, msg: `Subject too long (${subject.length} chars). Keep under 72.` });
    else if (subject.length > 0) results.push({ ok: true, msg: `Subject length OK (${subject.length} chars) ✓` });

    if (subject.endsWith('.')) results.push({ ok: false, msg: 'Subject line should not end with a period.' });

    if (lines.length > 1 && lines[1].trim() !== '') results.push({ ok: false, msg: 'Second line must be blank (separates subject from body).' });
    else if (lines.length > 1) results.push({ ok: true, msg: 'Blank separator line present ✓' });

    const closesMatch = msg.match(/Closes? #(\d+)/i);
    if (closesMatch) results.push({ ok: true, msg: `Issue reference found: #${closesMatch[1]} will be auto-closed on merge ✓` });

    return results;
  };

  const results = validate(input);

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg2)', marginBottom: 32 }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>📝 Commit Message Validator</span>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>Type a commit message and get real-time feedback against the Conventional Commits spec.</div>
      </div>
      <div style={{ padding: 20 }}>
        {/* Quick load examples */}
        <div style={{ marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', alignSelf: 'center' }}>Load example:</span>
          {examples.map((e, i) => (
            <button key={i} className="btn" onClick={() => setInput(e.msg)} style={{ fontSize: 11, padding: '3px 10px', borderColor: e.why ? 'var(--red)33' : 'var(--green)33', color: e.why ? 'var(--red)' : 'var(--green)' }}>
              {e.why ? '✗' : '✓'} Example {i + 1}
            </button>
          ))}
        </div>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={'feat(scope): short description\n\nOptional longer body explaining WHY\n\nCloses #123'}
          rows={5}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border2)', fontFamily: 'var(--font-mono)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', resize: 'vertical', boxSizing: 'border-box' }}
        />
        {results && (
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {results.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '7px 12px', borderRadius: 6, background: r.ok ? 'rgba(5,150,105,0.07)' : 'rgba(220,38,38,0.07)', border: `1px solid ${r.ok ? 'rgba(5,150,105,0.2)' : 'rgba(220,38,38,0.2)'}` }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>{r.ok ? '✅' : '❌'}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: r.ok ? 'var(--green)' : 'var(--red)' }}>{r.msg}</span>
              </div>
            ))}
          </div>
        )}
        {/* Anatomy diagram */}
        <div style={{ marginTop: 20, padding: 16, background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          <div style={{ color: 'var(--text3)', fontSize: 11, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Anatomy of a conventional commit</div>
          <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap', alignItems: 'center', lineHeight: 2 }}>
            {[
              { text: 'feat', color: '#3b82f6', label: 'type' },
              { text: '(', color: 'var(--text3)', label: '' },
              { text: 'auth', color: '#8b5cf6', label: 'scope' },
              { text: ')', color: 'var(--text3)', label: '' },
              { text: '!', color: '#dc2626', label: 'breaking' },
              { text: ': ', color: 'var(--text3)', label: '' },
              { text: 'add JWT refresh', color: 'var(--text)', label: 'description' },
            ].map((t, i) => (
              <span key={i} style={{ color: t.color, position: 'relative' }}>
                {t.text}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
            {[
              { color: '#3b82f6', label: 'type', desc: 'feat|fix|chore|docs…' },
              { color: '#8b5cf6', label: 'scope', desc: 'optional area of codebase' },
              { color: '#dc2626', label: '!', desc: 'optional BREAKING CHANGE' },
            ].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color, flexShrink: 0 }} />
                <span style={{ color: l.color, fontWeight: 600 }}>{l.label}</span>
                <span style={{ color: 'var(--text3)' }}>— {l.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Force Push Risk Simulator ─── */
function ForcePushSimulator() {
  const [scenario, setScenario] = useState('before');
  const [useFlag, setUseFlag] = useState('force-with-lease');
  const [result, setResult] = useState(null);

  const scenarios = {
    before: {
      remote: [
        { hash: 'a1b2c3', msg: 'feat: initial auth', author: 'You' },
        { hash: 'd4e5f6', msg: 'fix: null check',    author: 'Alice' }, // Alice pushed AFTER you fetched
      ],
      local: [
        { hash: 'a1b2c3', msg: 'feat: initial auth',    author: 'You' },
        { hash: 'g7h8i9', msg: 'refactor: clean auth',  author: 'You' }, // rebased commit
      ]
    }
  };

  const simulate = () => {
    if (useFlag === 'force') {
      setResult({
        type: 'danger',
        title: '💥 Alice\'s commit was destroyed!',
        detail: '--force does not check if the remote has diverged. It blindly overwrites. Alice\'s "fix: null check" commit (d4e5f6) is now permanently gone from the remote. She will have to dig through her local reflog to recover it.',
        cmd: 'git push --force origin feature/auth'
      });
    } else {
      setResult({
        type: 'safe',
        title: '🛡️ Push rejected safely.',
        detail: '--force-with-lease checks: "Has the remote changed since I last fetched?" It detected Alice\'s commit (d4e5f6) was pushed after your fetch. The push was rejected with: [rejected] feature/auth -> feature/auth (stale info). You can now fetch, review Alice\'s commit, and decide how to proceed.',
        cmd: 'git push --force-with-lease origin feature/auth\n! [rejected] feature/auth -> feature/auth (stale info)'
      });
    }
  };

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg2)', marginBottom: 32 }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>🚨 Force Push Risk Simulator</span>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>Understand why <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg3)', padding: '1px 5px', borderRadius: 3 }}>--force-with-lease</code> saves teams.</div>
      </div>
      <div style={{ padding: 20 }}>
        {/* Timeline */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>The scenario</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Remote */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--blue)', marginBottom: 10, fontWeight: 700 }}>REMOTE (origin/feature/auth)</div>
              {scenarios.before.remote.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', background: 'var(--bg3)', padding: '2px 6px', borderRadius: 4, flexShrink: 0 }}>{c.hash}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{c.msg}</div>
                    <div style={{ fontSize: 11, color: c.author === 'Alice' ? '#db2777' : 'var(--accent)' }}>by {c.author}{c.author === 'Alice' ? ' ⚠ pushed after your fetch!' : ''}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Local */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--green)', marginBottom: 10, fontWeight: 700 }}>LOCAL (your machine)</div>
              {scenarios.before.local.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', background: 'var(--bg3)', padding: '2px 6px', borderRadius: 4, flexShrink: 0 }}>{c.hash}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{c.msg}</div>
                    <div style={{ fontSize: 11, color: 'var(--accent)' }}>by {c.author}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 10, padding: '10px 14px', background: 'rgba(234,88,12,0.08)', border: '1px solid rgba(234,88,12,0.2)', borderRadius: 6, fontSize: 12, color: '#ea580c', fontFamily: 'var(--font-mono)' }}>
            ⚠ You rebased locally. Your history has diverged from remote. You need a force push.
          </div>
        </div>

        {/* Choose flag */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>Choose your push command:</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn" onClick={() => { setUseFlag('force'); setResult(null); }} style={{ borderColor: useFlag === 'force' ? 'var(--red)' : undefined, color: useFlag === 'force' ? 'var(--red)' : undefined, fontFamily: 'var(--font-mono)', fontSize: 13 }}>
              --force
            </button>
            <button className="btn" onClick={() => { setUseFlag('force-with-lease'); setResult(null); }} style={{ borderColor: useFlag === 'force-with-lease' ? 'var(--green)' : undefined, color: useFlag === 'force-with-lease' ? 'var(--green)' : undefined, fontFamily: 'var(--font-mono)', fontSize: 13 }}>
              --force-with-lease
            </button>
          </div>
        </div>

        <button className="btn" onClick={simulate} style={{ marginBottom: 16, background: 'var(--accent)', color: '#fff', borderColor: 'transparent' }}>
          Execute Push
        </button>

        {result && (
          <div style={{ padding: 16, borderRadius: 8, background: result.type === 'danger' ? 'rgba(220,38,38,0.07)' : 'rgba(5,150,105,0.07)', border: `1px solid ${result.type === 'danger' ? 'rgba(220,38,38,0.25)' : 'rgba(5,150,105,0.25)'}` }}>
            <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 15 }}>{result.title}</div>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 12, background: '#000', color: result.type === 'danger' ? 'var(--red)' : 'var(--green)', padding: '10px 14px', borderRadius: 6, marginBottom: 10, whiteSpace: 'pre-wrap' }}>{result.cmd}</pre>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{result.detail}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Fetch vs Pull Visualizer ─── */
function FetchVsPullVisualizer() {
  const [mode, setMode] = useState(null); // null | 'fetch' | 'pull-merge' | 'pull-rebase'
  const [step, setStep] = useState(0);

  const flows = {
    fetch: [
      { label: 'Before', desc: 'Remote has 2 commits you don\'t have. Your local branch is at the same old tip.', remote: ['C1','C2','C3','C4'], local: ['C1','C2'], origin: ['C1','C2'] },
      { label: 'git fetch', desc: 'Git contacts origin and downloads objects C3 and C4. It updates origin/main pointer. Your local main branch is UNTOUCHED. Working directory unchanged.', remote: ['C1','C2','C3','C4'], local: ['C1','C2'], origin: ['C1','C2','C3','C4'] },
      { label: 'You Review', desc: 'You can now safely inspect: git log origin/main..main, git diff main origin/main. Zero risk to your work.', remote: ['C1','C2','C3','C4'], local: ['C1','C2'], origin: ['C1','C2','C3','C4'], highlight: 'review' },
    ],
    'pull-merge': [
      { label: 'Before', desc: 'You have local commit L1. Remote has C3, C4 after the shared C2.', remote: ['C1','C2','C3','C4'], local: ['C1','C2','L1'], origin: ['C1','C2'] },
      { label: 'git fetch (part 1)', desc: 'Pull always starts with a fetch. origin/main now points at C4.', remote: ['C1','C2','C3','C4'], local: ['C1','C2','L1'], origin: ['C1','C2','C3','C4'] },
      { label: 'git merge (part 2)', desc: 'Git creates a MERGE COMMIT M1 that ties together C4 and L1. History is non-linear. This is the default git pull behavior.', remote: ['C1','C2','C3','C4'], local: ['C1','C2','L1','M1 (merge)'], origin: ['C1','C2','C3','C4'], mergeCommit: true },
    ],
    'pull-rebase': [
      { label: 'Before', desc: 'Same situation: you have L1, remote has C3, C4.', remote: ['C1','C2','C3','C4'], local: ['C1','C2','L1'], origin: ['C1','C2'] },
      { label: 'git fetch (part 1)', desc: 'Fetch downloads C3 and C4 from remote.', remote: ['C1','C2','C3','C4'], local: ['C1','C2','L1'], origin: ['C1','C2','C3','C4'] },
      { label: 'git rebase (part 2)', desc: 'Git parks L1 aside, fast-forwards local main to C4, then REPLAYS L1 on top as L1\'. History stays linear. This is git pull --rebase behavior.', remote: ['C1','C2','C3','C4'], local: ['C1','C2','C3','C4','L1\''], origin: ['C1','C2','C3','C4'] },
    ],
  };

  const current = mode ? flows[mode][Math.min(step, flows[mode].length - 1)] : null;

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg2)', marginBottom: 32 }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>🔄 fetch vs pull — Step-by-Step</span>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { key: 'fetch', label: 'git fetch', color: 'var(--blue)' },
            { key: 'pull-merge', label: 'git pull (default)', color: 'var(--orange)' },
            { key: 'pull-rebase', label: 'git pull --rebase', color: 'var(--green)' },
          ].map(m => (
            <button key={m.key} className="btn" onClick={() => { setMode(m.key); setStep(0); }} style={{ borderColor: mode === m.key ? m.color : undefined, color: mode === m.key ? m.color : undefined, fontFamily: 'var(--font-mono)', fontSize: 13 }}>
              {m.label}
            </button>
          ))}
        </div>

        {!mode && (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--text3)', fontSize: 14 }}>
            Select a command above to visualize what happens step-by-step.
          </div>
        )}

        {mode && current && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Remote (origin)', commits: current.remote, color: '#3b82f6' },
                { label: 'origin/main (local ref)', commits: current.origin, color: '#8b5cf6' },
                { label: 'local main (your branch)', commits: current.local, color: '#059669' },
              ].map((track, i) => (
                <div key={i} style={{ background: 'var(--surface)', border: `1px solid ${track.color}33`, borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: track.color, fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>{track.label}</div>
                  {track.commits.map((c, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${track.color}22`, border: `2px solid ${track.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontFamily: 'var(--font-mono)', color: track.color, flexShrink: 0 }}>
                        {c.slice(0, 2)}
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: c.includes("'") ? '#059669' : c.includes('M') ? '#ea580c' : c.includes('L') ? '#db2777' : 'var(--text)' }}>{c}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ padding: '12px 16px', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, marginBottom: 6, color: 'var(--accent)' }}>Step {step + 1}/{flows[mode].length}: {current.label}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{current.desc}</div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>← Back</button>
              <button className="btn" onClick={() => setStep(s => Math.min(flows[mode].length - 1, s + 1))} disabled={step === flows[mode].length - 1}
                style={{ background: step < flows[mode].length - 1 ? 'var(--accent)' : undefined, color: step < flows[mode].length - 1 ? '#fff' : undefined, borderColor: step < flows[mode].length - 1 ? 'transparent' : undefined }}>
                Next →
              </button>
              <button className="btn" onClick={() => setStep(0)} style={{ marginLeft: 'auto', fontSize: 12 }}>Reset</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Git Status Decoder ─── */
function GitStatusDecoder() {
  const statuses = [
    { xy: '??', name: 'Untracked', color: 'var(--red)', desc: 'Git has never seen this file. It exists in your working directory but is NOT in the index or any commit. Run git add to start tracking.', file: 'newfile.js' },
    { xy: 'A ', name: 'New file (staged)', color: 'var(--green)', desc: 'Previously untracked, now added to the index with git add. Will be included in your next commit.', file: 'feature.js' },
    { xy: 'M ', name: 'Modified (staged)', color: 'var(--green)', desc: 'The index version differs from the last commit. You\'ve staged the changes. Ready to commit.', file: 'auth.js' },
    { xy: ' M', name: 'Modified (unstaged)', color: 'var(--red)', desc: 'The working directory version differs from the index. Changes exist but have NOT been staged yet.', file: 'cart.js' },
    { xy: 'MM', name: 'Modified (both)', color: 'var(--yellow)', desc: 'Changes in BOTH the index AND working directory. You staged some changes, then made more edits after. Two separate diffs exist.', file: 'utils.js' },
    { xy: 'D ', name: 'Deleted (staged)', color: 'var(--green)', desc: 'File deleted and the deletion is staged. Next commit will remove this file from the repository.', file: 'legacy.js' },
    { xy: 'UU', name: 'Unmerged (conflict)', color: '#db2777', desc: 'Both sides of a merge modified this file and Git cannot auto-resolve. You must manually edit, then git add to mark resolved.', file: 'shared.js' },
  ];

  const [selected, setSelected] = useState(null);

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg2)', marginBottom: 32 }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>🔍 git status --short Decoder</span>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>Click any status code to understand exactly what it means.</div>
      </div>
      <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, background: '#000', borderRadius: 8, padding: 16 }}>
          <div style={{ color: 'var(--green)', marginBottom: 10 }}>$ git status --short</div>
          {statuses.map((s, i) => (
            <div key={i} onClick={() => setSelected(i)} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '5px 8px', borderRadius: 4, cursor: 'pointer', background: selected === i ? 'rgba(255,255,255,0.07)' : 'transparent', border: selected === i ? `1px solid ${s.color}44` : '1px solid transparent', marginBottom: 2 }}>
              <span style={{ color: s.color, fontWeight: 700, minWidth: 20 }}>{s.xy}</span>
              <span style={{ color: 'var(--text3)' }}>{s.file}</span>
            </div>
          ))}
        </div>
        <div>
          {selected === null ? (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--text3)', fontSize: 13, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ← Click a status code to decode it
            </div>
          ) : (
            <div style={{ padding: 16, background: 'var(--surface)', borderRadius: 8, border: `1px solid ${statuses[selected].color}33`, height: '100%', boxSizing: 'border-box' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: statuses[selected].color, marginBottom: 6 }}>{statuses[selected].xy}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{statuses[selected].name}</div>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 16 }}>{statuses[selected].desc}</p>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)', background: 'var(--bg2)', padding: '8px 12px', borderRadius: 6, lineHeight: 1.6 }}>
                <div style={{ color: 'var(--text3)', marginBottom: 4 }}>XY format: index status | working-tree status</div>
                <div><span style={{ color: statuses[selected].color }}>X</span> = index (staged) state</div>
                <div><span style={{ color: statuses[selected].color }}>Y</span> = working tree state</div>
                <div>· = unmodified &nbsp; ? = untracked</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function Essentials() {
  const ref1 = useFadeIn();
  const ref2 = useFadeIn();
  const ref3 = useFadeIn();
  const ref4 = useFadeIn();
  const ref5 = useFadeIn();

  return (
    <div className="page-content">
      <section className="section">
        {/* ── Header ── */}
        <div className="section-header-wrap" ref={ref1}>
          <div className="section-bg-num">05</div>
          <div className="section-label">Core Operations</div>
          <h2 className="section-title">Essential Commands</h2>
          <p className="section-desc">
            The professional daily loop. Moving far beyond <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, background: 'var(--bg2)', padding: '2px 7px', borderRadius: 4, border: '1px solid var(--border)' }}>git add .</code> and <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, background: 'var(--bg2)', padding: '2px 7px', borderRadius: 4, border: '1px solid var(--border)' }}>commit -m "wip"</code> to surgical, intentional operations that tell a story through your history.
          </p>
        </div>

        <Callout type="info" title="Mental model first">
          Git has three "trees" — not tree data structures, but three distinct file collections it manages: the <strong>Working Directory</strong> (your actual files), the <strong>Index / Staging Area</strong> (your next commit draft), and the <strong>Repository / HEAD</strong> (the last committed snapshot). Every essential command moves data between these three places.
        </Callout>

        {/* ── 1. Three Trees Interactive ── */}
        <div className="fade-in-section" ref={ref2}>
          <h3 className="subsection-title">The Three Trees — Live</h3>
          <p className="body-text">
            The staging area (index) is Git's secret weapon. It lets you craft commits like a writer edits a draft — multiple revisions until the message is exactly right — rather than dumping everything in at once. <strong>Interact below:</strong> stage files individually, write a proper commit message, and watch data flow through all three zones.
          </p>
          <GitIndexVisualizer />
        </div>

        <div className="divider" />

        {/* ── 2. git add Tabs ── */}
        <div className="fade-in-section" ref={ref3}>
          <h3 className="subsection-title">git add — Surgical Staging</h3>
          <p className="body-text">
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, background: 'var(--bg2)', padding: '2px 7px', borderRadius: 4, border: '1px solid var(--border)' }}>git add .</code> is training wheels. Production engineers use a spectrum of staging tools depending on intent.
          </p>

          <Tabs tabs={[
            {
              label: 'Flags Reference',
              content: (
                <>
                  <CommandTable rows={[
                    { flag: 'git add .', effect: 'Stages all changes in the CURRENT directory and below recursively. Dangerous at the repo root without a solid .gitignore — will capture build artifacts, secrets, and node_modules if they\'re not excluded.' },
                    { flag: 'git add -A / --all', effect: 'Stages ALL changes in the entire repository regardless of where your terminal is. Includes deletions. The nuclear option.' },
                    { flag: 'git add -u / --update', effect: 'Stages modifications and deletions to already-tracked files ONLY. Ignores brand new untracked files entirely. Useful when you\'ve cleaned up files and want to stage the deletions without touching new work.' },
                    { flag: 'git add -p / --patch', effect: 'Hunk-by-hunk interactive staging. Opens each modified chunk and asks: stage this? (y/n/s to split/e to manually edit). The single most powerful staging workflow.' },
                    { flag: 'git add -N / --intent-to-add', effect: 'Tells Git "I plan to track this new file" without staging its content. Lets git diff include the new file in output before you\'ve staged anything.' },
                  ]} />
                </>
              )
            },
            {
              label: 'git add -p Deep Dive',
              content: (
                <>
                  <p className="body-text">
                    Patch mode is the most important staging skill to develop. It forces you to <strong>read your own diff</strong> before committing — which catches bugs. Each "hunk" (continuous block of changed lines) is presented one at a time.
                  </p>
                  <CodeBlock language="bash" code={`# The hunk decision prompt
Stage this hunk [y,n,q,a,d,s,?]?

y  - yes, stage this hunk
n  - no, skip this hunk
q  - quit; do not stage this or remaining hunks
a  - stage this hunk and ALL remaining hunks in this file
d  - do not stage this hunk or any remaining hunks
s  - split into smaller hunks (when changes are non-contiguous)
e  - manually edit this hunk in your $EDITOR (surgical precision)`} />
                  <p className="body-text">
                    <strong>The real power — split hunks (s):</strong> If two unrelated changes happen to be close together in the file (within 3 lines), Git initially groups them as one hunk. Hit <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg2)', padding: '1px 5px', borderRadius: 3, border: '1px solid var(--border)' }}>s</code> and Git will try to divide the hunk further. If that's not granular enough, hit <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg2)', padding: '1px 5px', borderRadius: 3, border: '1px solid var(--border)' }}>e</code> to open a raw diff editor where you manually delete lines you don't want staged.
                  </p>
                  <DeepDive title="Under the hood: what is a hunk?">
                    <p>Git diff output uses the unified diff format. A hunk header looks like:</p>
                    <CodeBlock language="bash" code={`@@ -45,7 +45,8 @@ function calculateTotal(cart) {
#     ^   ^    ^   ^
#     |   |    |   |
#     old old  new new
#     start len start len`} />
                    <p style={{ marginTop: 12 }}>The <code style={{ fontFamily: 'var(--font-mono)' }}>@@</code> markers define a "context window" — typically 3 unchanged lines above and below the actual change. These context lines let Git apply the patch to the correct location even if line numbers shifted. When you edit a hunk manually (<code style={{ fontFamily: 'var(--font-mono)' }}>e</code>), you're editing this raw unified diff format. Removing a <code style={{ fontFamily: 'var(--font-mono)', color: '#059669' }}>+</code> line means "don't add this line". Removing a <code style={{ fontFamily: 'var(--font-mono)', color: '#dc2626' }}>-</code> line means "keep the original".</p>
                  </DeepDive>
                </>
              )
            },
            {
              label: 'git status Anatomy',
              content: (
                <>
                  <p className="body-text">
                    <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>git status</code> is not just "what's changed." Its two-character XY status codes precisely tell you the state in BOTH the index AND the working tree simultaneously. Most developers never learn this.
                  </p>
                  <GitStatusDecoder />
                </>
              )
            },
          ]} />
        </div>

        <div className="divider" />

        {/* ── 3. Interactive Patch Staging ── */}
        <div className="fade-in-section" ref={ref4}>
          <h3 className="subsection-title">Interactive Patch Staging Simulator</h3>
          <p className="body-text">
            You're working on <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>cart.js</code>. In one session you fixed a critical calculation bug AND started a new discount feature. These are two separate concerns — they should be two separate commits with two separate messages. Use <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>git add -p</code> to stage only what belongs in the first commit.
          </p>
          <InteractivePatchStaging />
        </div>

        <div className="divider" />

        {/* ── 4. Commit Messages ── */}
        <div className="fade-in-section" ref={ref5}>
          <h3 className="subsection-title">git commit — Writing History</h3>
          <p className="body-text">
            A commit message is the only in-code documentation that answers <em>why</em> a change was made. File diffs show <em>what</em> changed — the message explains the <strong>intent</strong>. Six months from now, a colleague (or you) will <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>git log</code> or <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>git blame</code> and encounter your words. Make them count.
          </p>

          <Tabs tabs={[
            {
              label: 'Conventional Commits',
              content: (
                <>
                  <p className="body-text">
                    The <a href="https://www.conventionalcommits.org" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>Conventional Commits</a> specification defines a strict, machine-readable format. Tools like <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg2)', padding: '1px 5px', borderRadius: 3, border: '1px solid var(--border)' }}>semantic-release</code> and <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg2)', padding: '1px 5px', borderRadius: 3, border: '1px solid var(--border)' }}>standard-version</code> parse your commit history and automatically determine whether a release is a patch, minor, or major version bump.
                  </p>
                  <CodeBlock language="bash" code={`# Full conventional commit format
<type>(<scope>)!: <description>    ← subject (max 72 chars)
                                   ← blank line separator (REQUIRED)
[optional body]                    ← explain WHY, not what
[optional body continued]
                                   ← blank line
[optional footer(s)]               ← Closes #123, Co-authored-by: ...

# Real examples:
feat(payments): add Stripe webhook signature verification

Previously, our endpoint accepted any POST request and processed
it as a payment event. An attacker could forge events.

This adds verification using STRIPE_WEBHOOK_SECRET via the
Stripe SDK's constructEvent() to validate the signature header.

Closes #847
BREAKING CHANGE: STRIPE_WEBHOOK_SECRET env var is now required.

---

fix(cart): correct quantity multiplier in total calculation

item.price was summed without multiplying by item.quantity,
causing wrong totals when quantity > 1. Reported by QA in #142.

Closes #142`} />
                  <CommandTable rows={[
                    { flag: 'feat', effect: 'New feature for the user. Triggers MINOR version bump (1.x.0 → 1.x+1.0).' },
                    { flag: 'fix', effect: 'Bug fix for the user. Triggers PATCH version bump (1.0.x → 1.0.x+1).' },
                    { flag: 'chore', effect: 'Maintenance: dependency updates, build tooling, CI changes. No production code change. No version bump.' },
                    { flag: 'refactor', effect: 'Code restructuring without adding features or fixing bugs. No version bump.' },
                    { flag: 'docs', effect: 'Documentation changes only.' },
                    { flag: 'test', effect: 'Adding or updating tests only.' },
                    { flag: 'perf', effect: 'Performance improvement. May trigger PATCH bump.' },
                    { flag: 'feat!: or BREAKING CHANGE:', effect: 'Introduces a breaking API change. Triggers MAJOR version bump (x.0.0 → x+1.0.0).' },
                  ]} />
                </>
              )
            },
            {
              label: 'Live Validator',
              content: (
                <>
                  <p className="body-text">Practice writing commit messages and get instant Conventional Commits validation. Load bad examples to understand what to avoid.</p>
                  <CommitMessageValidator />
                </>
              )
            },
            {
              label: 'git commit flags',
              content: (
                <>
                  <CommandTable rows={[
                    { flag: 'git commit -m "msg"', effect: 'Single-line message. Fine for simple commits, but bypasses your editor and makes multi-line messages awkward.' },
                    { flag: 'git commit', effect: 'Opens $EDITOR (vim, nano, vscode). Recommended — forces you to slow down and write a body. Pre-populates with the diff to review.' },
                    { flag: 'git commit --amend', effect: 'Folds staged changes into the LAST commit and/or edits its message. Creates a new SHA — rewrites history. ONLY safe if not yet pushed.' },
                    { flag: 'git commit --amend --no-edit', effect: 'Folds staged changes into the last commit but keeps the original message unchanged. Useful for "oops forgot a file."' },
                    { flag: 'git commit -C HEAD', effect: 'Creates a new commit using the exact same message (and author) as HEAD. Useful in scripts.' },
                    { flag: 'git commit --allow-empty', effect: 'Creates a commit with no file changes. Used to trigger CI pipelines or create semantic milestone commits.' },
                  ]} />
                  <DeepDive title="What git commit --amend actually does internally">
                    <p><code style={{ fontFamily: 'var(--font-mono)' }}>--amend</code> doesn't edit a commit in place — it creates a brand new commit object with a new SHA. The old commit still exists in the repository (accessible via <code style={{ fontFamily: 'var(--font-mono)' }}>git reflog</code>) but the branch pointer is updated to point at the new one. This is why amending a pushed commit causes a divergence — your remote still points at the old SHA.</p>
                    <CodeBlock language="bash" code={`# Before amend:
# a1b2c3  feat: add login page   ← HEAD, main

git add forgotten-file.js
git commit --amend --no-edit

# After amend:
# f9e8d7  feat: add login page   ← HEAD, main (NEW SHA!)
# a1b2c3  feat: add login page   ← now dangling, only in reflog`} />
                  </DeepDive>
                </>
              )
            },
          ]} />
        </div>

        <div className="divider" />

        {/* ── 5. Push ── */}
        <h3 className="subsection-title">git push — Safe Remote Writes</h3>
        <p className="body-text">
          Pushing is the act of writing your local commits to a remote. It seems simple, but the difference between <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>--force</code> and <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>--force-with-lease</code> is the difference between a smooth team workflow and a catastrophic data loss incident.
        </p>

        <Tabs tabs={[
          {
            label: 'Push Flags',
            content: (
              <CommandTable rows={[
                { flag: 'git push origin main', effect: 'Explicit push. Pushes local main to remote main. Best practice over relying on defaults.' },
                { flag: 'git push -u origin feature/xyz', effect: 'The -u flag (--set-upstream) links your local branch to the remote. After this, plain git push and git pull work without specifying remote/branch.' },
                { flag: 'git push --force', effect: 'DESTRUCTIVE. Replaces remote history with local history. Ignores any commits pushed by teammates since your last fetch. Data loss potential: 100%.' },
                { flag: 'git push --force-with-lease', effect: 'Safe force. Checks that your cached origin/branch ref matches the actual remote. If a teammate pushed anything you haven\'t fetched, the push aborts. Always prefer this.' },
                { flag: 'git push --force-with-lease --force-if-includes', effect: 'Stricter version (Git 2.30+). Also verifies the remote-tracking branch is reachable in your local history. Prevents leasing bypass via git fetch + no-rebase.' },
                { flag: 'git push origin --delete branch-name', effect: 'Deletes a remote branch. Equivalent to pushing an empty ref.' },
                { flag: 'git push --tags', effect: 'Pushes all local tags to the remote. Tags are not pushed by default with git push.' },
              ]} />
            )
          },
          {
            label: 'force-with-lease Simulator',
            content: (
              <>
                <p className="body-text">After rebasing a feature branch, you need to force push. A teammate also pushed a commit you haven't fetched. See the difference in real time.</p>
                <ForcePushSimulator />
              </>
            )
          },
          {
            label: 'push.default explained',
            content: (
              <>
                <p className="body-text">The <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>push.default</code> config controls where <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>git push</code> (without arguments) sends commits. The behavior has changed across Git versions, causing subtle bugs for teams on mixed versions.</p>
                <CommandTable rows={[
                  { flag: 'simple (default since Git 2.0)', effect: 'Pushes to the upstream branch with the same name. Fails if the tracking branch name differs. Safe for most workflows.' },
                  { flag: 'current', effect: 'Pushes to a remote branch with the same name as the local branch. Creates it if absent. More permissive than simple.' },
                  { flag: 'upstream / tracking', effect: 'Pushes to whatever the upstream tracking branch is configured as, even if the name differs.' },
                  { flag: 'matching', effect: 'LEGACY. Pushes ALL local branches that have a matching remote branch. Dangerous — can push unintended branches.' },
                  { flag: 'nothing', effect: 'Refuses to push without explicit destination. The strictest, most explicit option.' },
                ]} />
                <CodeBlock language="bash" code={`# Set the safest default globally
git config --global push.default simple

# Or the most explicit:
git config --global push.default nothing
# Now you must always type: git push origin branch-name`} />
              </>
            )
          },
        ]} />

        <WarningBox type="danger" title="The Golden Rule of Force Pushing">
          <strong>Never use <code style={{ fontFamily: 'var(--font-mono)' }}>--force</code> on a shared branch.</strong> On your personal feature branch, after a rebase, <code style={{ fontFamily: 'var(--font-mono)' }}>--force-with-lease</code> is acceptable. On <code style={{ fontFamily: 'var(--font-mono)' }}>main</code>, <code style={{ fontFamily: 'var(--font-mono)' }}>develop</code>, or any branch shared with teammates — never. Configure branch protection rules on GitHub to make this physically impossible.
        </WarningBox>

        <div className="divider" />

        {/* ── 6. Fetch vs Pull ── */}
        <h3 className="subsection-title">git fetch vs git pull — The Hidden Difference</h3>
        <p className="body-text">
          <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>git pull</code> is exactly <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>git fetch</code> + <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>git merge</code> (or <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>git rebase</code> with config). Understanding this split changes how you work.
        </p>

        <FetchVsPullVisualizer />

        <Tabs tabs={[
          {
            label: 'Why fetch-first matters',
            content: (
              <>
                <p className="body-text">
                  Professional workflow: <strong>always fetch first, then decide how to integrate.</strong> This gives you a chance to inspect what changed before touching your branch.
                </p>
                <CodeBlock language="bash" code={`# Professional fetch-first workflow
git fetch origin

# Now inspect what's new:
git log origin/main..main          # What YOU have that remote doesn't
git log main..origin/main          # What REMOTE has that you don't
git diff main origin/main          # Full diff of divergence

# Now consciously choose your integration strategy:
git merge origin/main              # Creates a merge commit (non-linear)
# OR
git rebase origin/main             # Replays your commits on top (linear)`} />
                <DeepDive title="Remote-tracking branches explained">
                  <p>When you run <code style={{ fontFamily: 'var(--font-mono)' }}>git fetch</code>, Git updates <strong>remote-tracking branches</strong> — references stored locally at <code style={{ fontFamily: 'var(--font-mono)' }}>refs/remotes/origin/</code>. These are read-only snapshots of where each remote branch was last time you synced.</p>
                  <CodeBlock language="bash" code={`# View all remote-tracking branches
git branch -r
#   origin/HEAD -> origin/main
#   origin/feature/payments
#   origin/main

# They live here:
cat .git/refs/remotes/origin/main
# a1b2c3d4e5f6...  ← just a SHA file

# git fetch updates these refs without touching your local branches
# git merge / git rebase then integrates them into your local branch`} />
                </DeepDive>
              </>
            )
          },
          {
            label: 'Configure pull.rebase',
            content: (
              <>
                <p className="body-text">
                  The default <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>git pull</code> creates merge commits whenever your history has diverged. On an active team this produces a tangled commit graph full of noise. Configure rebase-on-pull globally:
                </p>
                <CodeBlock language="bash" code={`# Make all pulls rebase by default
git config --global pull.rebase true

# Or per-repo:
git config pull.rebase true

# Now git pull = git fetch + git rebase
# Result: your local commits are always replayed on top of remote commits.
# Linear history. No merge commit noise.

# If a rebase creates conflicts, resolve them and:
git rebase --continue   # move to next conflicting commit
git rebase --abort      # go back to state before pull`} />
                <WarningBox type="info" title="Rebase vs Merge — when to use which">
                  Use <strong>rebase</strong> for synchronizing a feature branch with main (keeps history linear). Use <strong>merge</strong> for integrating a completed feature branch back into main (preserves the topology that the feature was developed as a unit). Never rebase commits that have already been pushed to a shared branch.
                </WarningBox>
              </>
            )
          },
        ]} />

        <div className="divider" />

        {/* ── Summary cheatsheet ── */}
        <h3 className="subsection-title">Quick Reference</h3>
        <CodeBlock language="bash" code={`# ── STAGING ──────────────────────────────────────
git status --short                 # compact status with XY codes
git add -p                         # interactive hunk-by-hunk staging
git add -u                         # stage modifications + deletions only
git diff --staged                  # diff of what's in the index vs HEAD

# ── COMMITTING ───────────────────────────────────
git commit                         # opens editor (preferred)
git commit -m "type(scope): msg"   # inline message
git commit --amend --no-edit       # fold staged into last commit

# ── PUSHING ──────────────────────────────────────
git push -u origin feature/xyz     # first push + set upstream
git push --force-with-lease        # safe force after rebase

# ── FETCHING / PULLING ───────────────────────────
git fetch origin                   # safe download, no merge
git log origin/main..main          # what you have that remote doesn't
git pull --rebase                  # fetch + rebase (linear history)

# ── GLOBAL CONFIG ────────────────────────────────
git config --global pull.rebase true      # rebase pulls by default
git config --global push.default simple   # explicit push destination`} />

      </section>
    </div>
  );
}