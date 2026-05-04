import React, { useState } from 'react';
import WorkflowCompare from '../components/WorkflowCompare';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import DeepDive from '../components/ui/DeepDive';
import WarningBox from '../components/ui/WarningBox';
import CommandTable from '../components/ui/CommandTable';
import Tabs from '../components/ui/Tabs';

// ─── Fork & Pull Request visual ───────────────────────────────────────────────
function ForkPRFlow() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      label: 'Fork',
      icon: '🍴',
      color: 'var(--blue)',
      cmd: '# On GitHub: click "Fork"\n# This creates: github.com/you/project',
      desc: "You can't push to someone else's repo. Forking creates your own server-side copy. You have full write access to your fork.",
    },
    {
      label: 'Clone your fork',
      icon: '⬇',
      color: 'var(--accent)',
      cmd: 'git clone git@github.com:you/project.git\ncd project\n\n# Add the original as "upstream"\ngit remote add upstream git@github.com:original/project.git',
      desc: 'Clone your fork locally. Add the original repo as a second remote called "upstream" so you can pull in future changes from the source.',
    },
    {
      label: 'Branch & commit',
      icon: '✏',
      color: 'var(--green)',
      cmd: 'git checkout -b fix/typo-in-readme\n\n# Make your changes...\ngit add -p\ngit commit -m "docs: fix typo in README"',
      desc: 'Never commit directly to main in your fork. Create a branch — this keeps your fork clean and lets you have multiple PRs open at once.',
    },
    {
      label: 'Push to your fork',
      icon: '⬆',
      color: 'var(--yellow)',
      cmd: 'git push origin fix/typo-in-readme',
      desc: 'Push to YOUR fork (origin), not the upstream. GitHub will now prompt you to open a Pull Request.',
    },
    {
      label: 'Open PR',
      icon: '📬',
      color: 'var(--orange)',
      cmd: '# On GitHub:\n# base: original/project  main\n# compare: you/project  fix/typo-in-readme\n# → "Create pull request"',
      desc: "This is a cross-repository PR. The maintainer reviews your changes in their repo's interface. They can comment, request changes, or merge.",
    },
    {
      label: 'Stay in sync',
      icon: '🔄',
      color: 'var(--pink)',
      cmd: '# Pull upstream changes into your fork:\ngit fetch upstream\ngit checkout main\ngit merge upstream/main\ngit push origin main',
      desc: "The original repo keeps moving. Regularly sync your fork's main with upstream/main so your branches don't fall too far behind.",
    },
  ];

  return (
    <div style={{ margin: '32px 0', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg2)' }}>
      <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
          Open Source Workflow — Fork & Pull Request
        </span>
      </div>

      {/* Step pills */}
      <div style={{ padding: '16px 20px', display: 'flex', gap: '6px', flexWrap: 'wrap', borderBottom: '1px solid var(--border)' }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => setActiveStep(i)} style={{
            padding: '6px 12px', borderRadius: '20px', fontSize: '12px',
            background: activeStep === i ? s.color + '22' : 'var(--surface)',
            border: `1px solid ${activeStep === i ? s.color : 'var(--border)'}`,
            color: activeStep === i ? s.color : 'var(--text3)',
            fontFamily: 'var(--font-mono)', fontWeight: activeStep === i ? 700 : 400,
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* Active step detail */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
        <div style={{ padding: '20px', borderRight: '1px solid var(--border)' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
            Step {activeStep + 1} of {steps.length} — {steps[activeStep].label}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7, margin: 0 }}>
            {steps[activeStep].desc}
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button className="btn" style={{ fontSize: '11px', padding: '4px 12px' }}
              disabled={activeStep === 0} onClick={() => setActiveStep(s => s - 1)}>← Back</button>
            <button className="btn" style={{ fontSize: '11px', padding: '4px 12px' }}
              disabled={activeStep === steps.length - 1} onClick={() => setActiveStep(s => s + 1)}>Next →</button>
          </div>
        </div>
        <div style={{ padding: '20px', background: '#050508' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', marginBottom: '10px' }}>Terminal</div>
          <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: steps[activeStep].color, lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>
            {steps[activeStep].cmd}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ─── Monorepo vs Polyrepo comparison ─────────────────────────────────────────
function MonoPolyCompare() {
  const [selected, setSelected] = useState(null);

  const rows = [
    { metric: 'Code sharing',         mono: '✓ Trivial — just import across packages',      poly: '✗ Needs published npm packages or git submodules' },
    { metric: 'Atomic changes',       mono: '✓ One PR can update frontend + backend + docs', poly: '✗ Requires multiple coordinated PRs across repos' },
    { metric: 'CI/CD complexity',     mono: '✗ Needs smart build caching (Turborepo/Nx)',    poly: '✓ Each repo has independent, simple pipelines' },
    { metric: 'Repo size over time',  mono: '✗ Grows large — requires Git LFS for assets',  poly: '✓ Each repo stays focused and small' },
    { metric: 'Security boundaries',  mono: '✗ All engineers see all code',                  poly: '✓ Access controls per repo' },
    { metric: 'Onboarding',          mono: '✓ One clone, one setup',                        poly: '✗ Engineers must find and clone multiple repos' },
    { metric: 'Used by',             mono: 'Google, Meta, Vercel (Turborepo), Microsoft',   poly: 'Amazon, smaller orgs, microservice-heavy teams' },
  ];

  return (
    <div style={{ margin: '24px 0', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ padding: '12px 16px', borderRight: '1px solid var(--border)', fontWeight: 700, fontSize: '13px', color: 'var(--blue)', fontFamily: 'var(--font-mono)' }}>
          📦 Monorepo
        </div>
        <div style={{ padding: '12px 16px', fontWeight: 700, fontSize: '13px', color: 'var(--yellow)', fontFamily: 'var(--font-mono)' }}>
          🗂 Polyrepo
        </div>
      </div>
      {rows.map((row, i) => (
        <div key={i}
          onClick={() => setSelected(selected === i ? null : i)}
          style={{
            display: 'grid', gridTemplateColumns: '140px 1fr 1fr',
            borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
            background: selected === i ? 'rgba(124,106,247,0.06)' : 'var(--bg2)',
            cursor: 'pointer', transition: 'background 0.2s',
          }}>
          <div style={{ padding: '10px 14px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', borderRight: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
            {row.metric}
          </div>
          <div style={{ padding: '10px 14px', fontSize: '12px', color: row.mono.startsWith('✓') ? 'var(--green)' : row.mono.startsWith('✗') ? 'var(--red)' : 'var(--text2)', borderRight: '1px solid var(--border)', lineHeight: 1.5 }}>
            {row.mono}
          </div>
          <div style={{ padding: '10px 14px', fontSize: '12px', color: row.poly.startsWith('✓') ? 'var(--green)' : row.poly.startsWith('✗') ? 'var(--red)' : 'var(--text2)', lineHeight: 1.5 }}>
            {row.poly}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Workflows() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-header-wrap">
          <div className="section-bg-num">11</div>
          <div className="section-label">Ecosystem</div>
          <h2 className="section-title">Real-World Workflows</h2>
          <p className="section-desc">
            The commands are the same across every team. What changes is the <em>rules of engagement</em> —
            which branches exist, who can push where, and how code gets to production.
          </p>
        </div>

        <p className="body-text">
          There is no universally correct Git workflow. The right choice depends on your team size,
          release cadence, and how much process overhead you can afford. But there are clear
          winners for modern web development — and one strategy that research shows consistently
          outperforms the others.
        </p>

        <Callout type="info">
          <strong>The DORA Research Finding:</strong> The DevOps Research and Assessment (DORA) program
          studied 33,000+ engineering teams over 7 years. Their consistent finding: elite-performing teams
          deploy multiple times per day from a single trunk branch. GitFlow-style branching
          correlates with <em>lower</em> deployment frequency and <em>longer</em> lead times. The data
          points toward Trunk-Based Development.
        </Callout>

        <div className="divider" />

        {/* Interactive simulator first */}
        <h3 className="subsection-title">Workflow Simulator</h3>
        <p className="body-text">
          Pick a workflow and a scenario — a new feature, a hotfix, or a release.
          Watch how each strategy handles the same situation differently.
          The step-by-step animation shows you the branch graph building in real time.
        </p>

        <WorkflowCompare />

        <div className="divider" />

        <Tabs tabs={[
          {
            label: 'Trunk-Based',
            content: (
              <>
                <p className="body-text">
                  The modern standard. One long-lived branch (<code>main</code>),
                  short-lived feature branches that merge within 1–2 days maximum,
                  and continuous deployment. Main is <em>always</em> production-ready.
                </p>
                <h4 style={{ color: 'var(--text)', marginBottom: '12px', fontSize: '15px' }}>The rules:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  {[
                    { rule: 'main is always deployable',        why: 'Broken builds on main block the entire team. CI must enforce this.' },
                    { rule: 'Branches live for hours, not days', why: 'Long-lived branches cause merge conflicts and drift. The longer a branch lives, the more painful the merge.' },
                    { rule: 'Commit to main at least daily',    why: 'If you haven\'t merged in 24h, your branch is already a risk. Break the work smaller.' },
                    { rule: 'Feature flags for incomplete work', why: 'Ship the code, hide the UI. Decouple deployment from release.' },
                  ].map((r, i) => (
                    <div key={i} style={{ padding: '12px 16px', background: 'var(--surface)', borderRadius: '6px', borderLeft: '3px solid var(--blue)' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>✓ {r.rule}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{r.why}</div>
                    </div>
                  ))}
                </div>

                <h4 style={{ color: 'var(--text)', marginBottom: '12px', fontSize: '15px' }}>Feature flags in practice:</h4>
                <p className="body-text">
                  Feature flags let you merge incomplete code to main without exposing it to users.
                  The code ships, but the UI stays hidden behind a flag:
                </p>
                <CodeBlock language="javascript" code={`// Simple environment-based flag
const FEATURES = {
  newCheckoutFlow: process.env.ENABLE_NEW_CHECKOUT === 'true',
  aiSearch:        process.env.ENABLE_AI_SEARCH === 'true',
};

// In your component:
function Navbar() {
  return (
    <nav>
      <SearchBar />
      {FEATURES.aiSearch && <AISearchBar />}   {/* hidden until flag is on */}
    </nav>
  );
}

// More sophisticated: user-segment flags (LaunchDarkly, etc.)
const showNewFeature = await flags.variation('new-checkout', user, false);`} />
                <Callout type="tip">
                  Feature flags decouple <strong>deployment</strong> (putting code on servers)
                  from <strong>release</strong> (making it visible to users). This is the
                  key unlock that makes Trunk-Based Development work at scale.
                </Callout>
              </>
            )
          },
          {
            label: 'GitHub Flow',
            content: (
              <>
                <p className="body-text">
                  The middle ground. Simpler than GitFlow, slightly more structured than
                  pure trunk. The entire model fits in 4 steps:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                  {[
                    { n: '1', step: 'Branch off main',    detail: 'git checkout -b feat/search-v2', color: 'var(--green)' },
                    { n: '2', step: 'Commit & push',      detail: 'Work, commit. Push early to trigger CI.', color: 'var(--blue)' },
                    { n: '3', step: 'Open a Pull Request',detail: 'PR = code review + CI gate + discussion thread', color: 'var(--accent)' },
                    { n: '4', step: 'Merge → deploy',     detail: 'Merge to main. main deploys automatically.', color: 'var(--yellow)' },
                  ].map((s, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      padding: '14px 16px',
                      borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                      background: 'var(--bg2)',
                    }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: s.color + '22', border: `2px solid ${s.color}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '13px', fontWeight: 800, color: s.color, flexShrink: 0,
                      }}>{s.n}</div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '2px' }}>{s.step}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{s.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="body-text">
                  GitHub Flow works best when: you deploy continuously, your team is small-to-medium,
                  and you want PRs to be the quality gate. The main limitation is there's no
                  explicit "release stabilization" phase — which is fine for web apps, but
                  harder for mobile apps that go through an App Store review cycle.
                </p>
              </>
            )
          },
          {
            label: 'Git Flow',
            content: (
              <>
                <p className="body-text">
                  Introduced by Vincent Driessen in 2010 for versioned software with scheduled releases.
                  It has a specific answer for every scenario — which is both its strength and its complexity.
                </p>
                <CommandTable rows={[
                  { flag: 'main',        effect: 'Only holds tagged production releases. You never commit here directly.' },
                  { flag: 'develop',     effect: 'Integration branch. All features merge here. This is your "next release" staging area.' },
                  { flag: 'feature/*',   effect: 'Branch off develop. Merge back into develop. Never touches main.' },
                  { flag: 'release/*',   effect: 'Branch off develop when ready to ship. Only bug fixes go here. Merges into BOTH main AND develop.' },
                  { flag: 'hotfix/*',    effect: 'Branch off main for production emergencies. Merges into BOTH main AND develop.' },
                ]} />
                <WarningBox type="warning" title="The develop → develop merge trap">
                  After a hotfix or release merge, you <strong>must</strong> merge back into <code>develop</code>
                  or the fix will be missing from the next release. This is easy to forget and is one of
                  the most common GitFlow mistakes. Some teams automate this check in CI.
                </WarningBox>
                <p className="body-text">
                  GitFlow genuinely makes sense for: mobile apps (can't instantly redeploy), versioned
                  desktop software, open source libraries with major/minor/patch releases,
                  and regulated industries where releases require formal approval cycles.
                  For a web app with continuous deployment, it's almost always overkill.
                </p>
                <DeepDive title="git-flow CLI tool">
                  <p>There's an official CLI that automates GitFlow's branch naming and merge patterns:</p>
                  <CodeBlock language="bash" code={`# Initialize GitFlow in a repo
git flow init

# Start a feature
git flow feature start search-v2
# → creates feature/search-v2 off develop

# Finish a feature (merges back to develop, deletes branch)
git flow feature finish search-v2

# Start a release
git flow release start 2.0.0

# Finish a release (merges into main AND develop, tags main)
git flow release finish 2.0.0`} />
                </DeepDive>
              </>
            )
          },
        ]} />

        <div className="divider" />

        <h3 className="subsection-title">Monorepo vs Polyrepo</h3>
        <p className="body-text">
          This is an organizational question, not a Git question — but Git workflow changes
          significantly depending on your answer. Click rows to explore each tradeoff:
        </p>
        <MonoPolyCompare />
        <p className="body-text">
          The modern answer for most teams: <strong>monorepo with smart tooling</strong>.
          Tools like <a href="https://turbo.build" style={{ color: 'var(--accent)' }}>Turborepo</a> and
          Nx solve the CI performance problem with build caching —
          only rebuilding the packages that actually changed.
        </p>
        <CodeBlock language="bash" code={`# Turborepo only runs tests for changed packages:
turbo run test
# → cache hit for api (nothing changed)
# → MISS for web (package.json changed) — running...
# → cache hit for shared-ui (nothing changed)
# Total: 12s instead of 4min`} />

        <div className="divider" />

        <h3 className="subsection-title">The Open Source Workflow</h3>
        <p className="body-text">
          Contributing to a repo you don't own requires a different model — you can't push
          branches directly. The Fork & Pull Request pattern solves this.
        </p>
        <ForkPRFlow />

      </section>
    </div>
  );
}