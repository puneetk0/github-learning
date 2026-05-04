import React, { useState } from 'react';
import ConflictResolver from '../components/ConflictResolver';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import DeepDive from '../components/ui/DeepDive';
import Tabs from '../components/ui/Tabs';
import WarningBox from '../components/ui/WarningBox';
import CommandTable from '../components/ui/CommandTable';

// ─── "Why Conflicts Happen" visual timeline ───────────────────────────────────
function ConflictTimeline() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      label: 'Shared base',
      desc: 'Both Alice and Bob start from the same commit. utils.js has one function: return price + tax.',
      aliceLog: ['(same as Bob)'],
      bobLog:   ['(same as Alice)'],
      file: ['function calculateTotal(price, tax) {', '  return price + tax;', '}'],
      conflict: false,
    },
    {
      label: 'Alice edits',
      desc: 'Alice rewrites the function to apply a percentage tax rate and round the result.',
      aliceLog: ['✏ Modified utils.js', 'git commit -m "fix: tax as rate"'],
      bobLog:   ['(no changes yet)'],
      file: ['function calculateTotal(price, tax) {', '  const total = price + (price * tax);', '  return total.toFixed(2);', '}'],
      conflict: false,
    },
    {
      label: 'Bob edits',
      desc: 'Bob, on his own branch, also rewrites the same function — treating tax as a flat amount.',
      aliceLog: ['✏ Modified utils.js', 'git commit -m "fix: tax as rate"'],
      bobLog:   ['✏ Modified utils.js', 'git commit -m "refactor: cleaner rounding"'],
      file: ['function calculateTotal(price, tax) {', '  return Math.round((price + tax) * 100) / 100;', '}'],
      conflict: false,
    },
    {
      label: 'Merge → CONFLICT',
      desc: "Git tries to merge Bob's branch into Alice's. Both changed the same lines. Git can't auto-resolve — it needs a human.",
      aliceLog: ['git merge bob/feature', '⚠ CONFLICT in utils.js', 'Automatic merge failed.'],
      bobLog:   ['(merged into Alice\'s branch)'],
      file: [
        'function calculateTotal(price, tax) {',
        '<<<<<<< HEAD',
        '  const total = price + (price * tax);',
        '  return total.toFixed(2);',
        '=======',
        '  return Math.round((price + tax) * 100) / 100;',
        '>>>>>>> bob/feature',
        '}',
      ],
      conflict: true,
    },
  ];

  const s = steps[step];

  return (
    <div style={{ margin: '32px 0', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg2)' }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>How Conflicts Actually Happen</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {steps.map((st, i) => (
            <button key={i} onClick={() => setStep(i)} style={{
              width: '28px', height: '28px', borderRadius: '50%',
              border: `2px solid ${i === step ? 'var(--accent)' : 'var(--border)'}`,
              background: i === step ? 'var(--accent)' : i < step ? 'rgba(124,106,247,0.2)' : 'transparent',
              color: i === step ? '#fff' : 'var(--text3)',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer',
            }}>{i + 1}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Alice */}
        <div style={{ background: 'var(--surface)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(96,165,250,0.3)' }}>
          <div style={{ padding: '8px 14px', background: 'rgba(96,165,250,0.1)', borderBottom: '1px solid rgba(96,165,250,0.2)', fontSize: '12px', fontWeight: 700, color: 'var(--blue)', fontFamily: 'var(--font-mono)' }}>
            👩‍💻 Alice — main branch
          </div>
          <div style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.8 }}>
            {s.aliceLog.map((l, i) => (
              <div key={i} style={{ color: l.startsWith('⚠') ? 'var(--red)' : l.startsWith('git') ? 'var(--green)' : 'var(--text2)' }}>{l}</div>
            ))}
          </div>
        </div>

        {/* Bob */}
        <div style={{ background: 'var(--surface)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(34,211,160,0.3)' }}>
          <div style={{ padding: '8px 14px', background: 'rgba(34,211,160,0.1)', borderBottom: '1px solid rgba(34,211,160,0.2)', fontSize: '12px', fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>
            👨‍💻 Bob — feature branch
          </div>
          <div style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.8 }}>
            {s.bobLog.map((l, i) => (
              <div key={i} style={{ color: l.startsWith('git') ? 'var(--green)' : 'var(--text2)' }}>{l}</div>
            ))}
          </div>
        </div>
      </div>

      {/* utils.js state */}
      <div style={{ margin: '0 20px 20px', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${s.conflict ? 'var(--red)' : 'var(--border)'}` }}>
        <div style={{ padding: '8px 14px', background: s.conflict ? 'rgba(248,113,113,0.1)' : 'var(--surface)', borderBottom: `1px solid ${s.conflict ? 'var(--red)' : 'var(--border)'}`, fontSize: '12px', fontFamily: 'var(--font-mono)', color: s.conflict ? 'var(--red)' : 'var(--text3)' }}>
          📄 utils.js {s.conflict && '— CONFLICTED'}
        </div>
        <div style={{ padding: '12px 16px', background: '#050508', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.7 }}>
          {s.file.map((line, i) => {
            const isMarker = line.startsWith('<<<<') || line.startsWith('====') || line.startsWith('>>>>');
            const isOurs   = !isMarker && i > 0 && s.file.slice(0, i).some(l => l.startsWith('<<<<')) && !s.file.slice(0, i).some(l => l.startsWith('===='));
            const isTheirs = !isMarker && i > 0 && s.file.slice(0, i).some(l => l.startsWith('====')) && !s.file.slice(0, i).some(l => l.startsWith('>>>>'));
            return (
              <div key={i} style={{
                whiteSpace: 'pre',
                color: isMarker ? 'var(--red)' : isOurs ? 'var(--blue)' : isTheirs ? 'var(--green)' : 'var(--text)',
                background: isMarker ? 'rgba(248,113,113,0.1)' : isOurs ? 'rgba(96,165,250,0.08)' : isTheirs ? 'rgba(34,211,160,0.08)' : 'transparent',
                padding: '0 4px',
              }}>{line}</div>
            );
          })}
        </div>
      </div>

      {/* Step description */}
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>Step {step + 1}: </span>
          <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{s.desc}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button className="btn" style={{ fontSize: '12px', padding: '4px 12px' }} disabled={step === 0} onClick={() => setStep(s => s - 1)}>← Prev</button>
          <button className="btn" style={{ fontSize: '12px', padding: '4px 12px' }} disabled={step === steps.length - 1} onClick={() => setStep(s => s + 1)}>Next →</button>
        </div>
      </div>
    </div>
  );
}

// ─── Rerere Flow visualizer ───────────────────────────────────────────────────
function RerereFlow() {
  const [activeStep, setActiveStep] = useState(null);

  const steps = [
    { id: 0, label: 'First conflict', icon: '⚠', color: 'var(--red)',    desc: 'You hit the same conflict for the first time during a rebase. rerere records the "preimage" — the exact state of the conflicted file.', cmd: '# Auto-logged by Git:\nRecorded preimage for "src/utils.js"' },
    { id: 1, label: 'You resolve it', icon: '✏', color: 'var(--yellow)', desc: 'You manually fix the conflict the usual way — edit the file, remove markers. When you stage it, rerere records the mapping: conflicted state → your resolution.', cmd: '# After git add:\nRecorded resolution for "src/utils.js"' },
    { id: 2, label: 'Same conflict again', icon: '🔁', color: 'var(--blue)',   desc: 'Next rebase, the exact same conflict appears — maybe main changed again. rerere detects the matching preimage pattern.', cmd: 'git rebase main\n# Conflict detected...' },
    { id: 3, label: 'Auto-resolved', icon: '✓', color: 'var(--green)',  desc: 'rerere looks up its resolution database, finds the match, and applies your previous fix automatically. You just review and continue.', cmd: 'Resolved "src/utils.js" using\nprevious resolution.\n# Just run: git rebase --continue' },
  ];

  return (
    <div style={{ margin: '24px 0' }}>
      <div style={{ display: 'flex', gap: '0', position: 'relative', marginBottom: '16px' }}>
        {/* Connector line */}
        <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', height: '2px', background: 'var(--border)', zIndex: 0 }} />

        {steps.map((s, i) => (
          <div key={s.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 1, cursor: 'pointer' }}
            onClick={() => setActiveStep(activeStep === i ? null : i)}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: activeStep === i ? s.color : 'var(--surface)',
              border: `2px solid ${s.color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', transition: 'all 0.2s',
              boxShadow: activeStep === i ? `0 0 12px ${s.color}55` : 'none',
            }}>{s.icon}</div>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: activeStep === i ? s.color : 'var(--text3)', textAlign: 'center', lineHeight: 1.4 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {activeStep !== null && (
        <div style={{
          padding: '16px', borderRadius: '8px',
          border: `1px solid ${steps[activeStep].color}44`,
          background: steps[activeStep].color + '0d',
          transition: 'all 0.2s',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--text2)', margin: '0 0 12px', lineHeight: 1.6 }}>{steps[activeStep].desc}</p>
          <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: steps[activeStep].color, margin: 0, background: 'var(--bg)', padding: '10px 14px', borderRadius: '4px', lineHeight: 1.7 }}>{steps[activeStep].cmd}</pre>
        </div>
      )}
      {activeStep === null && (
        <p style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>Click a step to expand</p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Conflicts() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-header-wrap">
          <div className="section-bg-num">07</div>
          <div className="section-label">Collaboration</div>
          <h2 className="section-title">Merge Conflicts</h2>
          <p className="section-desc">
            Conflicts are not errors. They are Git safely halting because two humans made
            incompatible decisions about the same code — and only a human can decide which intent wins.
          </p>
        </div>

        {/* Visual scenario first — before any text */}
        <h3 className="subsection-title">Why Conflicts Happen</h3>
        <p className="body-text">
          Git auto-merges most changes with zero issues. A conflict only occurs when two branches
          edit the exact same lines of the same file. Walk through the scenario below to see
          how a conflict is born:
        </p>
        <ConflictTimeline />

        <Callout type="info">
          Git can always auto-merge if the changes are on <strong>different lines</strong>.
          "Developer A edited line 5, Developer B edited line 42" → Git handles it instantly.
          Conflicts only happen on <strong>same-line collisions</strong>.
        </Callout>

        <div className="divider" />

        <Tabs tabs={[
          {
            label: 'Conflict Markers',
            content: (
              <>
                <p className="body-text">
                  When Git can't auto-resolve, it pauses the merge and injects conflict markers
                  directly into the source file on disk. The file is now broken — the JS engine
                  cannot parse <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code>.
                </p>
                <CodeBlock language="javascript" code={`function fetchUser(id) {
<<<<<<< HEAD
  // Your branch — what's currently in HEAD
  return db.query('SELECT * FROM users WHERE id = ?', id);
=======
  // The incoming branch you're merging in
  return await orm.user.findById(id);
>>>>>>> feature/async-orm
}`} />
                <p className="body-text">
                  The three sections are:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '16px 0' }}>
                  {[
                    { marker: '<<<<<<< HEAD', color: 'var(--blue)',  desc: 'Everything below this until ======= is YOUR code (the branch you\'re merging INTO).' },
                    { marker: '=======',       color: 'var(--yellow)', desc: 'The divider. Code above = yours. Code below = theirs.' },
                    { marker: '>>>>>>> branch', color: 'var(--green)', desc: 'Everything between ======= and this is the INCOMING code (the branch being merged in).' },
                  ].map(m => (
                    <div key={m.marker} style={{ display: 'flex', gap: '14px', padding: '10px 14px', background: 'var(--surface)', borderRadius: '6px', alignItems: 'flex-start' }}>
                      <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: m.color, minWidth: '160px', flexShrink: 0 }}>{m.marker}</code>
                      <span style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.5 }}>{m.desc}</span>
                    </div>
                  ))}
                </div>
                <p className="body-text">
                  Your job: delete the markers AND write the code that satisfies both intents.
                  Sometimes that means picking one side. Sometimes it means writing a third option
                  that combines both approaches.
                </p>
              </>
            )
          },
          {
            label: 'diff3 Style',
            content: (
              <>
                <p className="body-text">
                  The default conflict markers show you "Your Code" vs "Their Code" — but sometimes
                  that's not enough context. <em>Why</em> did they write "Their Code"?
                  What was the original before either of you touched it?
                </p>
                <p className="body-text">
                  The <code>diff3</code> conflict style injects a third section — the common ancestor —
                  so you can see exactly what both sides diverged from:
                </p>
                <CodeBlock language="bash" code={`# Enable globally (do this now — it's strictly better)
git config --global merge.conflictstyle diff3

# Or the even newer zdiff3 (Git 2.35+):
git config --global merge.conflictstyle zdiff3`} />
                <CodeBlock language="javascript" code={`function fetchUser(id) {
<<<<<<< HEAD
  return db.query('SELECT * FROM users WHERE id = ?', id);
||||||| common ancestor
  return db.query(id);             ← the original
=======
  return await orm.user.findById(id);
>>>>>>> feature/async-orm
}`} />
                <p className="body-text">
                  With <code>diff3</code> you now know: the ancestor was <code>db.query(id)</code>.
                  Your branch added a parameterized SQL string. Their branch migrated to an ORM.
                  The correct resolution is obvious — use the ORM but ensure ID mapping is correct.
                  Without the ancestor, you'd be guessing.
                </p>
                <Callout type="tip">
                  <strong>zdiff3</strong> is the improved version — it reduces the visual noise by
                  omitting unchanged lines from the ancestor section. Use it if you're on Git 2.35+.
                </Callout>
              </>
            )
          },
          {
            label: 'git rerere',
            content: (
              <>
                <h4 style={{ color: 'var(--blue)', marginBottom: '12px', fontSize: '16px' }}>Reuse Recorded Resolution</h4>
                <p className="body-text">
                  If you maintain a long-running feature branch that frequently rebases against an
                  active <code>main</code>, you may solve the exact same conflict over and over.
                  <code>git rerere</code> eliminates this.
                </p>
                <CodeBlock language="bash" code={`# Enable once, globally
git config --global rerere.enabled true`} />
                <p className="body-text">
                  Once enabled, rerere runs silently in the background. Click each step below
                  to see how it saves you:
                </p>
                <RerereFlow />
                <DeepDive title="Where rerere stores resolutions">
                  <p>Rerere keeps a database in <code>.git/rr-cache/</code>. Each entry is keyed by
                  a hash of the conflicted hunk's "preimage" — the exact state of the conflict markers.
                  If two conflicts have identical preimages, they get the same resolution.</p>
                  <CodeBlock language="bash" code={`ls .git/rr-cache/
# a3f2c91d.../
#   preimage   ← the recorded conflict state
#   postimage  ← your resolution

# Forget a bad recorded resolution:
git rerere forget src/utils.js`} />
                </DeepDive>
              </>
            )
          },
          {
            label: 'Merge Strategies',
            content: (
              <>
                <p className="body-text">
                  Git's merge machinery is pluggable. You can pass a <code>-s</code> strategy flag
                  to <code>git merge</code> to change how it resolves (or refuses to resolve) conflicts:
                </p>
                <CommandTable rows={[
                  { flag: 'git merge -s ort',       effect: 'Default since Git 2.34. Improved version of recursive. Handles criss-cross merges correctly and is faster.' },
                  { flag: 'git merge -s recursive',  effect: 'Old default. Uses 3-way merge, handles renames. Superseded by ort.' },
                  { flag: 'git merge -s ours',       effect: 'Always picks YOUR version for every conflict. Theirs is discarded completely. Useful for marking a branch as "merged" without integrating any of its changes.' },
                  { flag: 'git merge -s theirs',     effect: 'Not a built-in strategy — use -X theirs (the extended option). Always picks the incoming side for conflicts.' },
                  { flag: 'git merge -X patience',   effect: 'Uses the "patience" diff algorithm for the 3-way merge. Produces cleaner diffs for files with lots of repetitive lines (e.g. closing braces in Java).' },
                ]} />
                <WarningBox type="warning" title="-s ours vs -X ours">
                  <code>-s ours</code> (strategy) completely ignores the incoming branch — it doesn't
                  even look at the diff. <code>-X ours</code> (extended option) still does a normal
                  3-way merge but auto-picks your side whenever there's a conflict. These are
                  completely different.
                </WarningBox>
              </>
            )
          }
        ]} />

        <div className="divider" />

        <h3 className="subsection-title">Resolution Sandbox</h3>
        <p className="body-text">
          Two real conflict scenarios. Use the 3-panel view to compare versions,
          accept a side as a starting point, then edit the output to construct your resolution.
          Toggle <strong>diff3 mode</strong> to reveal the common ancestor.
        </p>

        <ConflictResolver />

        <div className="divider" />

        <h3 className="subsection-title">The Resolution Workflow</h3>
        <p className="body-text">
          After fixing all conflicts in all files, here's the exact sequence to complete the merge:
        </p>
        <CodeBlock language="bash" code={`# 1. Fix all conflict markers in the files
#    (use your editor, or the sandbox above)

# 2. Stage each resolved file
git add src/utils.js
git add src/auth.js

# 3. Verify no conflicts remain
git status
# All conflicts fixed but you are still merging.

# 4. Complete the merge
git commit
# Git pre-fills the message: "Merge branch 'feature/x'"

# OR — if you want to abandon the entire merge:
git merge --abort    # rewinds everything to before the merge started`} />

        <DeepDive title="How Git's 3-Way Diff Algorithm Works">
          <p>
            Git doesn't just compare your file to theirs. It finds the <strong>merge base</strong>
            — the most recent common ancestor commit — and performs a 3-way comparison:
          </p>
          <CodeBlock language="bash" code={`# Git internally runs something like:
git merge-base HEAD feature/async-orm
# → a3f2c91 (the last commit both branches share)

# Then diffs:
# 1. merge-base → HEAD    (what you changed)
# 2. merge-base → feature (what they changed)

# If line X was changed by only ONE side → auto-accept that change
# If line X was changed by BOTH sides → CONFLICT`} />
          <p style={{ marginTop: '12px' }}>
            This is why the common ancestor matters so much — it's the reference point for
            determining "who changed what." Without it, there's no way to distinguish
            "both people wrote the same new thing" (no conflict) from
            "both people independently changed the original" (conflict).
          </p>
        </DeepDive>

      </section>
    </div>
  );
}