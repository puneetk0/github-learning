import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Eye, EyeOff, ChevronRight } from 'lucide-react';

// ─── Conflict scenario data ───────────────────────────────────────────────────
const SCENARIOS = [
  {
    id: 'tax',
    label: 'Tax Calculation',
    file: 'utils/cart.js',
    description: 'Two devs rewrote the same tax function differently.',
    ancestor: [
      'function calculateTotal(price, tax) {',
      '  return price + tax;',
      '}',
    ],
    ours: [
      'function calculateTotal(price, tax) {',
      '  const total = price + (price * tax);',
      '  return total.toFixed(2);',
      '}',
    ],
    theirs: [
      'function calculateTotal(price, tax) {',
      '  return Math.round((price + tax) * 100) / 100;',
      '}',
    ],
    // The "correct" resolution for validation (flexible: just checks no markers)
    hint: 'The original just added price + tax. Your branch treats tax as a rate (%), theirs treats it as a flat amount. The right resolution uses the rate approach AND rounds correctly.',
    bestResolution: [
      'function calculateTotal(price, tax) {',
      '  const total = price + (price * tax);',
      '  return Math.round(total * 100) / 100;',
      '}',
    ],
  },
  {
    id: 'auth',
    label: 'Auth Middleware',
    file: 'middleware/auth.js',
    description: 'One branch added JWT, another added session-based auth.',
    ancestor: [
      'function authenticate(req, res, next) {',
      '  if (!req.user) return res.status(401).json({ error: "Unauthorized" });',
      '  next();',
      '}',
    ],
    ours: [
      'function authenticate(req, res, next) {',
      '  const token = req.headers.authorization?.split(" ")[1];',
      '  if (!token) return res.status(401).json({ error: "No token" });',
      '  req.user = verifyJWT(token);',
      '  next();',
      '}',
    ],
    theirs: [
      'function authenticate(req, res, next) {',
      '  if (!req.session?.userId) {',
      '    return res.status(401).json({ error: "Session expired" });',
      '  }',
      '  req.user = { id: req.session.userId };',
      '  next();',
      '}',
    ],
    hint: 'Both are valid but incompatible auth strategies. In real life, pick one — or create a strategy pattern. For this exercise, choose the JWT approach (more modern).',
    bestResolution: [
      'function authenticate(req, res, next) {',
      '  const token = req.headers.authorization?.split(" ")[1];',
      '  if (!token) return res.status(401).json({ error: "No token" });',
      '  req.user = verifyJWT(token);',
      '  next();',
      '}',
    ],
  },
];

// ─── Conflict marker builder ──────────────────────────────────────────────────
function buildConflictText(scenario, diff3Mode) {
  const { ours, ancestor, theirs } = scenario;
  // Find diverging range (simplified: show full function body as conflict)
  const lines = [];
  lines.push(...ours.slice(0, 1)); // shared opening line
  lines.push('<<<<<<< HEAD');
  lines.push(...ours.slice(1, -1));
  if (diff3Mode) {
    lines.push('||||||| common ancestor');
    lines.push(...ancestor.slice(1, -1));
  }
  lines.push('=======');
  lines.push(...theirs.slice(1, -1));
  lines.push('>>>>>>> feature-branch');
  lines.push(...ours.slice(-1)); // shared closing line
  return lines.join('\n');
}

// ─── Line classifier ─────────────────────────────────────────────────────────
function classifyLine(line) {
  if (line.startsWith('<<<<<<<')) return 'marker-head';
  if (line.startsWith('|||||||')) return 'marker-ancestor';
  if (line === '=======') return 'marker-divider';
  if (line.startsWith('>>>>>>>')) return 'marker-incoming';
  return null;
}

function getLineSection(lines, idx) {
  let section = 'normal';
  for (let i = 0; i <= idx; i++) {
    const t = classifyLine(lines[i]);
    if (t === 'marker-head') section = 'ours';
    else if (t === 'marker-ancestor') section = 'ancestor';
    else if (t === 'marker-divider') section = 'theirs';
    else if (t === 'marker-incoming') section = 'normal';
  }
  return section;
}

// ─── Three-panel diff view ────────────────────────────────────────────────────
function DiffPanel({ title, color, lines, onAccept, accepted }) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      border: `1px solid ${color}44`,
      borderTop: `3px solid ${color}`,
      borderRadius: '8px',
      overflow: 'hidden',
      background: 'var(--bg2)',
    }}>
      <div style={{
        padding: '10px 14px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color }}>{title}</span>
        {onAccept && (
          <button
            onClick={onAccept}
            style={{
              padding: '4px 10px', fontSize: '11px',
              background: accepted ? color + '33' : 'transparent',
              border: `1px solid ${color}`,
              borderRadius: '4px', color,
              fontFamily: 'var(--font-mono)', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {accepted ? '✓ accepted' : 'Accept'}
          </button>
        )}
      </div>
      <div style={{
        padding: '12px',
        fontFamily: 'var(--font-mono)', fontSize: '12px',
        lineHeight: 1.7, color: 'var(--text2)',
        minHeight: '100px',
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{
            whiteSpace: 'pre',
            padding: '1px 4px',
            borderRadius: '2px',
            background: line !== lines[0] && line !== lines[lines.length - 1]
              ? color + '14' : 'transparent',
            color: line !== lines[0] && line !== lines[lines.length - 1]
              ? color : 'var(--text2)',
          }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ConflictResolver() {
  const [scenarioIdx, setScenarioIdx]   = useState(0);
  const [diff3Mode, setDiff3Mode]       = useState(false);
  const [outputText, setOutputText]     = useState('');
  const [accepted, setAccepted]         = useState(null); // 'ours' | 'theirs' | null
  const [status, setStatus]             = useState('idle'); // idle | resolved | error | perfect
  const [errorMsg, setErrorMsg]         = useState('');
  const [showHint, setShowHint]         = useState(false);
  const [showBest, setShowBest]         = useState(false);
  const textareaRef                     = useRef(null);

  const scenario = SCENARIOS[scenarioIdx];

  // Init output when scenario changes
  useEffect(() => {
    setOutputText(buildConflictText(scenario, diff3Mode));
    setAccepted(null);
    setStatus('idle');
    setErrorMsg('');
    setShowHint(false);
    setShowBest(false);
  }, [scenarioIdx]);

  // Rebuild conflict text when diff3 toggled (only if still in conflict state)
  useEffect(() => {
    const hasMarkers = outputText.includes('<<<<<<<');
    if (hasMarkers) {
      setOutputText(buildConflictText(scenario, diff3Mode));
    }
  }, [diff3Mode]);

  const acceptOurs = () => {
    setOutputText(scenario.ours.join('\n'));
    setAccepted('ours');
    setStatus('idle');
  };

  const acceptTheirs = () => {
    setOutputText(scenario.theirs.join('\n'));
    setAccepted('theirs');
    setStatus('idle');
  };

  const validate = () => {
    const text = outputText.trim();
    if (text.includes('<<<<<<<') || text.includes('=======') || text.includes('>>>>>>>') || text.includes('|||||||')) {
      setStatus('error');
      setErrorMsg('Conflict markers still present. Remove all <<<<<<, ======, >>>>>>> (and ||||||| in diff3 mode) before resolving.');
      return;
    }
    if (!text.length) {
      setStatus('error');
      setErrorMsg('The file is empty. You need to keep some code.');
      return;
    }

    // Check if matches best resolution
    const best = scenario.bestResolution.join('\n').trim();
    if (text === best) {
      setStatus('perfect');
    } else {
      setStatus('resolved');
    }
    setErrorMsg('');
  };

  const reset = () => {
    setOutputText(buildConflictText(scenario, diff3Mode));
    setAccepted(null);
    setStatus('idle');
    setErrorMsg('');
    setShowHint(false);
    setShowBest(false);
  };

  // Syntax highlight the output textarea overlay (line coloring)
  const outputLines = outputText.split('\n');

  const lineColor = (line) => {
    const t = classifyLine(line);
    if (t === 'marker-head' || t === 'marker-divider' || t === 'marker-incoming') return 'var(--red)';
    if (t === 'marker-ancestor') return 'var(--yellow)';
    return null;
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text)', fontWeight: 700 }}>
            📄 {scenario.file}
          </span>
          <span style={{
            fontSize: '10px', fontFamily: 'var(--font-mono)',
            color: 'var(--red)', background: 'rgba(248,113,113,0.1)',
            border: '1px solid var(--red)', padding: '2px 8px', borderRadius: '4px',
          }}>CONFLICT</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Scenario selector */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {SCENARIOS.map((s, i) => (
              <button key={s.id}
                onClick={() => setScenarioIdx(i)}
                style={{
                  padding: '4px 10px', fontSize: '11px',
                  background: scenarioIdx === i ? 'var(--accent)' : 'var(--surface2)',
                  border: `1px solid ${scenarioIdx === i ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '4px', color: scenarioIdx === i ? '#fff' : 'var(--text2)',
                  fontFamily: 'var(--font-mono)', cursor: 'pointer',
                }}
              >{s.label}</button>
            ))}
          </div>
          {/* diff3 toggle */}
          <button
            onClick={() => setDiff3Mode(m => !m)}
            style={{
              padding: '4px 10px', fontSize: '11px',
              background: diff3Mode ? 'rgba(251,191,36,0.15)' : 'var(--surface2)',
              border: `1px solid ${diff3Mode ? 'var(--yellow)' : 'var(--border)'}`,
              borderRadius: '4px', color: diff3Mode ? 'var(--yellow)' : 'var(--text2)',
              fontFamily: 'var(--font-mono)', cursor: 'pointer',
            }}
          >{diff3Mode ? '⚗ diff3 ON' : '⚗ diff3'}</button>
          <button className="btn" style={{ fontSize: '11px', padding: '4px 10px' }} onClick={reset}>
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* ── Scenario description ── */}
      <div style={{ padding: '10px 20px', background: 'rgba(124,106,247,0.06)', borderBottom: '1px solid var(--border)', fontSize: '12px', color: 'var(--text2)' }}>
        <strong style={{ color: 'var(--accent)' }}>Scenario:</strong> {scenario.description}
      </div>

      {/* ── 3-Panel comparison ── */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Compare versions — accept one, or write your own resolution below
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <DiffPanel
            title="◀ Ours (HEAD)"
            color="var(--blue)"
            lines={scenario.ours}
            onAccept={acceptOurs}
            accepted={accepted === 'ours'}
          />
          {diff3Mode && (
            <DiffPanel
              title="⬤ Common Ancestor"
              color="var(--yellow)"
              lines={scenario.ancestor}
              onAccept={null}
              accepted={false}
            />
          )}
          <DiffPanel
            title="Theirs (incoming) ▶"
            color="var(--green)"
            lines={scenario.theirs}
            onAccept={acceptTheirs}
            accepted={accepted === 'theirs'}
          />
        </div>
      </div>

      {/* ── Output editor ── */}
      <div style={{ padding: '16px' }}>
        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Resolution editor — edit directly or accept a version above
        </div>

        {/* Line-colored overlay + textarea */}
        <div style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg2)' }}>
          {/* Colored line backgrounds */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', padding: '12px 12px 12px 44px', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: '22px' }}>
            {outputLines.map((line, i) => {
              const c = lineColor(line);
              return (
                <div key={i} style={{
                  height: '22px',
                  background: c ? c + '18' : 'transparent',
                  marginLeft: '-44px', paddingLeft: '44px',
                  color: 'transparent', whiteSpace: 'pre',
                }}>{line || ' '}</div>
              );
            })}
          </div>
          {/* Line numbers */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '36px',
            padding: '12px 0',
            fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: '22px',
            color: 'var(--text3)', textAlign: 'right',
            borderRight: '1px solid var(--border)', background: '#0a0a0f',
            userSelect: 'none', pointerEvents: 'none',
          }}>
            {outputLines.map((_, i) => (
              <div key={i} style={{ paddingRight: '6px' }}>{i + 1}</div>
            ))}
          </div>
          {/* Actual textarea */}
          <textarea
            ref={textareaRef}
            value={outputText}
            onChange={e => { setOutputText(e.target.value); setStatus('idle'); }}
            spellCheck={false}
            style={{
              width: '100%',
              minHeight: '160px',
              padding: '12px 12px 12px 50px',
              background: 'transparent',
              border: 'none', outline: 'none',
              fontFamily: 'var(--font-mono)', fontSize: '13px',
              lineHeight: '22px', color: 'var(--text)',
              resize: 'vertical', caretColor: 'var(--accent)',
              position: 'relative', zIndex: 1,
            }}
          />
        </div>

        {/* Marker warning inline */}
        {outputText.includes('<<<<<<<') && status !== 'error' && (
          <div style={{ marginTop: '8px', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--red)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <XCircle size={12} /> Conflict markers detected — file will not compile
          </div>
        )}
      </div>

      {/* ── Status / error ── */}
      {status === 'error' && (
        <div style={{ margin: '0 16px 16px', padding: '12px 16px', background: 'rgba(248,113,113,0.1)', border: '1px solid var(--red)', borderRadius: '6px', fontSize: '13px', color: 'var(--red)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <XCircle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
          {errorMsg}
        </div>
      )}

      {status === 'resolved' && (
        <div style={{ margin: '0 16px 16px', padding: '12px 16px', background: 'rgba(34,211,160,0.08)', border: '1px solid var(--green)', borderRadius: '6px', fontSize: '13px', color: 'var(--green)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <CheckCircle2 size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Conflict resolved.</strong> No markers remain. You can now run <code style={{ background: 'var(--bg)', padding: '1px 6px', borderRadius: '3px' }}>git add {scenario.file} && git commit</code> to complete the merge.
            <button onClick={() => setShowBest(b => !b)} style={{ marginLeft: '12px', background: 'none', border: '1px solid var(--green)', borderRadius: '4px', color: 'var(--green)', fontSize: '11px', padding: '2px 8px', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>
              {showBest ? 'Hide' : 'Show'} ideal resolution
            </button>
          </div>
        </div>
      )}

      {status === 'perfect' && (
        <div style={{ margin: '0 16px 16px', padding: '12px 16px', background: 'rgba(124,106,247,0.1)', border: '1px solid var(--accent)', borderRadius: '6px', fontSize: '13px', color: 'var(--accent)', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <CheckCircle2 size={14} />
          <strong>Perfect resolution.</strong> You combined the best of both approaches. That's exactly what senior engineers do.
        </div>
      )}

      {showBest && (
        <div style={{ margin: '0 16px 16px', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', marginBottom: '8px' }}>IDEAL RESOLUTION</div>
          <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--green)', margin: 0, lineHeight: 1.7 }}>
            {scenario.bestResolution.join('\n')}
          </pre>
        </div>
      )}

      {/* ── Footer actions ── */}
      <div style={{
        padding: '12px 16px',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px',
      }}>
        <button
          onClick={() => setShowHint(h => !h)}
          style={{
            background: 'none', border: '1px solid var(--border)',
            borderRadius: '4px', color: 'var(--text3)',
            fontSize: '12px', padding: '6px 12px', cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}
        >
          {showHint ? <EyeOff size={12} /> : <Eye size={12} />}
          {showHint ? 'Hide hint' : 'Show hint'}
        </button>

        <button
          onClick={validate}
          disabled={status === 'perfect'}
          style={{
            padding: '8px 20px', fontSize: '13px', fontWeight: 700,
            background: status === 'perfect' ? 'var(--green)' : 'var(--accent)',
            color: '#fff', border: 'none', borderRadius: '6px',
            cursor: status === 'perfect' ? 'default' : 'pointer',
            fontFamily: 'var(--font-body)',
            display: 'flex', alignItems: 'center', gap: '8px',
            opacity: status === 'perfect' ? 0.7 : 1,
          }}
        >
          {status === 'perfect'
            ? <><CheckCircle2 size={14} /> Perfect</>
            : <>Mark as Resolved <ChevronRight size={14} /></>
          }
        </button>
      </div>

      {/* Hint */}
      {showHint && (
        <div style={{
          margin: '0 16px 16px', padding: '12px 16px',
          background: 'rgba(96,165,250,0.08)', border: '1px solid var(--blue)',
          borderRadius: '6px', fontSize: '13px', color: 'var(--blue)', lineHeight: 1.6,
        }}>
          💡 {scenario.hint}
        </div>
      )}
    </div>
  );
}