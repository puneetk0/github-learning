import React, { useState, useEffect, useRef } from 'react';

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = `
  .bp-page { padding: 48px 0 100px; }

  /* ── Hero ── */
  .bp-hero {
    padding: 80px 10% 60px; border-bottom: 1px solid var(--border);
    text-align: center; position: relative; overflow: hidden;
  }
  .bp-hero-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 40px 40px; opacity: 0.25;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent);
    pointer-events: none;
  }
  .bp-hero-content { position: relative; z-index: 1; }
  .bp-badge {
    display: inline-flex; align-items: center; gap: 6px; padding: 4px 14px;
    background: rgba(5,150,105,0.08); border: 1px solid rgba(5,150,105,0.25);
    border-radius: 20px; font-size: 11px; font-family: var(--font-mono);
    color: var(--green); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 20px;
  }
  .bp-badge span { width: 6px; height: 6px; border-radius: 50%; background: var(--green); display: inline-block; }
  .bp-hero-title {
    font-family: var(--font-display); font-size: clamp(36px, 5vw, 60px);
    font-weight: 800; line-height: 1.05; letter-spacing: -2px; margin-bottom: 16px;
  }
  .bp-hero-title em {
    font-style: normal;
    background: linear-gradient(135deg, var(--green) 0%, var(--accent) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .bp-hero-sub { font-size: 16px; color: var(--text2); line-height: 1.7; max-width: 560px; margin: 0 auto 32px; }
  .bp-hero-stats { display: flex; gap: 40px; justify-content: center; flex-wrap: wrap; }
  .bp-hstat { text-align: center; }
  .bp-hstat-num { font-family: var(--font-display); font-size: 26px; font-weight: 800; color: var(--green); }
  .bp-hstat-label { font-size: 11px; color: var(--text3); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.5px; }

  /* ── Section shell ── */
  .bp-section { width: 80%; margin: 0 10%; padding: 64px 0; border-bottom: 1px solid var(--border); }
  .bp-label { font-family: var(--font-mono); font-size: 11px; color: var(--green); text-transform: uppercase; letter-spacing: 3px; margin-bottom: 10px; }
  .bp-title { font-family: var(--font-display); font-size: clamp(28px, 3.5vw, 40px); font-weight: 800; letter-spacing: -1px; line-height: 1.1; margin-bottom: 12px; }
  .bp-desc { font-size: 15px; color: var(--text2); line-height: 1.7; margin-bottom: 32px; }
  .bp-body { font-size: 15px; color: var(--text2); line-height: 1.7; margin-bottom: 20px; }
  .bp-body strong { color: var(--text); }
  .bp-sub { font-family: var(--font-display); font-size: 22px; font-weight: 700; margin: 40px 0 12px; }
  .bp-divider { height: 1px; background: var(--border); margin: 48px 0; }

  /* ── Code block ── */
  .bp-code { background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin: 20px 0; font-family: var(--font-mono); font-size: 13px; line-height: 1.7; }
  .bp-code-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 10px 16px; display: flex; align-items: center; gap: 8px; }
  .bp-code-dot { width: 10px; height: 10px; border-radius: 50%; }
  .bp-code-lang { margin-left: auto; font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; }
  .bp-code pre { margin: 0; padding: 16px; overflow-x: auto; color: var(--text2); }

  /* ── Callout ── */
  .bp-callout { border-radius: 10px; padding: 16px 20px; margin: 20px 0; border: 1px solid; }
  .bp-callout.info { background: rgba(59,130,246,0.05); border-color: rgba(59,130,246,0.2); }
  .bp-callout.warn { background: rgba(217,119,6,0.05); border-color: rgba(217,119,6,0.2); }
  .bp-callout.danger { background: rgba(220,38,38,0.05); border-color: rgba(220,38,38,0.2); }
  .bp-callout.success { background: rgba(5,150,105,0.05); border-color: rgba(5,150,105,0.2); }
  .bp-callout-title { font-weight: 700; font-size: 13px; margin-bottom: 6px; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.5px; }
  .bp-callout.info .bp-callout-title { color: var(--accent); }
  .bp-callout.warn .bp-callout-title { color: var(--yellow); }
  .bp-callout.danger .bp-callout-title { color: var(--red); }
  .bp-callout.success .bp-callout-title { color: var(--green); }
  .bp-callout p { font-size: 14px; color: var(--text2); line-height: 1.6; margin: 0; }

  /* ── DeepDive ── */
  .bp-deepdive { border: 1px solid var(--border); border-radius: 10px; margin: 20px 0; overflow: hidden; }
  .bp-deepdive-header { padding: 14px 18px; background: var(--surface); display: flex; align-items: center; gap: 10px; cursor: pointer; transition: background 0.15s; user-select: none; }
  .bp-deepdive-header:hover { background: var(--bg2); }
  .bp-deepdive-title { font-size: 14px; font-weight: 600; color: var(--text); flex: 1; }
  .bp-deepdive-badge { font-family: var(--font-mono); font-size: 10px; padding: 2px 8px; background: rgba(5,150,105,0.1); border: 1px solid rgba(5,150,105,0.2); color: var(--green); border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  .bp-deepdive-chevron { color: var(--text3); font-size: 12px; transition: transform 0.2s; }
  .bp-deepdive-chevron.open { transform: rotate(180deg); }
  .bp-deepdive-body { padding: 20px; background: var(--bg2); border-top: 1px solid var(--border); font-size: 14px; color: var(--text2); line-height: 1.7; }
  .bp-deepdive-body p { margin-bottom: 12px; }
  .bp-deepdive-body p:last-child { margin-bottom: 0; }

  @keyframes fadeSlide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }

  /* ═══════════════════════════════════════════
     GOLDEN RULES — interactive cards
  ═══════════════════════════════════════════ */
  .rules-grid { display: flex; flex-direction: column; gap: 2px; margin: 24px 0; }
  .rule-card {
    border-radius: 10px; overflow: hidden;
    border: 1px solid var(--border); background: var(--surface);
    transition: all 0.2s;
  }
  .rule-card-header {
    display: flex; align-items: center; gap: 14px;
    padding: 16px 20px; cursor: pointer; user-select: none;
    transition: background 0.15s;
  }
  .rule-card-header:hover { background: var(--bg2); }
  .rule-card-num {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-size: 14px; font-weight: 800;
    flex-shrink: 0;
  }
  .rule-card-title { flex: 1; font-size: 15px; font-weight: 700; color: var(--text); }
  .rule-card-chevron { color: var(--text3); font-size: 12px; transition: transform 0.2s; }
  .rule-card-chevron.open { transform: rotate(180deg); }
  .rule-card-body { padding: 0 20px 20px 66px; animation: fadeSlide 0.2s ease; }
  .rule-card-body p { font-size: 14px; color: var(--text2); line-height: 1.7; margin-bottom: 12px; }
  .rule-card-body p:last-child { margin-bottom: 0; }
  .rule-verdict {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 12px; border-radius: 6px; font-family: var(--font-mono); font-size: 11px; font-weight: 700;
    margin-bottom: 10px;
  }
  .rule-verdict.bad { background: rgba(220,38,38,0.08); color: var(--red); border: 1px solid rgba(220,38,38,0.2); }
  .rule-verdict.good { background: rgba(5,150,105,0.08); color: var(--green); border: 1px solid rgba(5,150,105,0.2); }
  .rule-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 12px 0; }
  @media (max-width: 560px) { .rule-compare { grid-template-columns: 1fr; } }
  .rule-compare-card { border-radius: 8px; padding: 12px; font-family: var(--font-mono); font-size: 12px; line-height: 1.7; }
  .rule-compare-card.bad { background: rgba(220,38,38,0.05); border: 1px solid rgba(220,38,38,0.15); }
  .rule-compare-card.good { background: rgba(5,150,105,0.05); border: 1px solid rgba(5,150,105,0.15); }
  .rule-compare-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; font-weight: 700; }
  .rule-compare-card.bad .rule-compare-label { color: var(--red); }
  .rule-compare-card.good .rule-compare-label { color: var(--green); }

  /* ═══════════════════════════════════════════
     COMMIT MESSAGE LINTER
  ═══════════════════════════════════════════ */
  .linter-wrap { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin: 24px 0; }
  .linter-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 14px 20px; }
  .linter-header-title { font-family: var(--font-mono); font-size: 13px; font-weight: 600; }
  .linter-header-sub { font-size: 12px; color: var(--text3); margin-top: 2px; }
  .linter-body { padding: 20px; }
  .linter-input-row { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 16px; }
  .linter-input {
    flex: 1; padding: 12px 14px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--bg2);
    font-family: var(--font-mono); font-size: 13px; color: var(--text);
    outline: none; transition: border-color 0.2s;
  }
  .linter-input:focus { border-color: var(--green); }
  .linter-input.invalid { border-color: var(--red); animation: shake 0.4s ease; }
  .linter-input.valid { border-color: var(--green); }
  .linter-results { display: flex; flex-direction: column; gap: 8px; }
  .linter-rule {
    display: flex; align-items: flex-start; gap: 10px; padding: 10px 14px;
    border-radius: 8px; border: 1px solid var(--border); background: var(--surface);
    font-size: 13px; transition: all 0.2s;
  }
  .linter-rule.pass { border-color: rgba(5,150,105,0.25); background: rgba(5,150,105,0.04); }
  .linter-rule.fail { border-color: rgba(220,38,38,0.25); background: rgba(220,38,38,0.04); }
  .linter-rule.neutral { border-color: var(--border); }
  .linter-rule-icon { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
  .linter-rule-content { flex: 1; }
  .linter-rule-name { font-weight: 600; color: var(--text); margin-bottom: 2px; }
  .linter-rule-detail { font-size: 12px; color: var(--text3); line-height: 1.5; }
  .linter-rule.pass .linter-rule-name { color: var(--green); }
  .linter-rule.fail .linter-rule-name { color: var(--red); }
  .linter-score { display: flex; align-items: center; gap: 12px; margin-top: 16px; padding: 12px 16px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); }
  .linter-score-bar { flex: 1; height: 6px; background: var(--bg3); border-radius: 3px; overflow: hidden; }
  .linter-score-fill { height: 100%; border-radius: 3px; transition: width 0.4s, background 0.4s; }
  .linter-score-label { font-family: var(--font-mono); font-size: 12px; color: var(--text2); min-width: 80px; }
  .linter-examples { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
  .linter-example-btn { padding: 5px 12px; border-radius: 6px; border: 1px solid var(--border); background: var(--surface2); font-family: var(--font-mono); font-size: 11px; cursor: pointer; color: var(--text2); transition: all 0.15s; white-space: nowrap; }
  .linter-example-btn:hover { background: var(--bg2); color: var(--text); }

  /* ═══════════════════════════════════════════
     SECRET SCANNER
  ═══════════════════════════════════════════ */
  .secret-wrap { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin: 24px 0; }
  .secret-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  .secret-header-title { font-family: var(--font-mono); font-size: 13px; font-weight: 600; }
  .secret-body { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
  @media (max-width: 680px) { .secret-body { grid-template-columns: 1fr; } }
  .secret-editor { border-right: 1px solid var(--border); }
  .secret-editor-label { padding: 10px 16px; background: var(--surface); border-bottom: 1px solid var(--border); font-family: var(--font-mono); font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; }
  .secret-textarea { width: 100%; min-height: 220px; padding: 14px 16px; background: var(--bg2); font-family: var(--font-mono); font-size: 12px; color: #e2e8f0; border: none; outline: none; resize: vertical; line-height: 1.8; }
  .secret-results { padding: 16px; }
  .secret-results-label { font-family: var(--font-mono); font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
  .secret-finding {
    padding: 10px 12px; border-radius: 8px; margin-bottom: 8px;
    border: 1px solid rgba(220,38,38,0.25); background: rgba(220,38,38,0.05);
    animation: fadeSlide 0.2s ease;
  }
  .secret-finding-type { font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--red); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  .secret-finding-match { font-family: var(--font-mono); font-size: 11px; color: var(--text2); background: var(--bg2); padding: 2px 6px; border-radius: 4px; word-break: break-all; }
  .secret-finding-advice { font-size: 12px; color: var(--text3); margin-top: 4px; }
  .secret-clean { text-align: center; padding: 24px; color: var(--green); font-family: var(--font-mono); font-size: 13px; }
  .secret-footer { padding: 12px 16px; border-top: 1px solid var(--border); background: var(--bg2); font-size: 12px; color: var(--text3); display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .secret-footer strong { color: var(--text); }

  /* ═══════════════════════════════════════════
     .GITIGNORE BUILDER
  ═══════════════════════════════════════════ */
  .gi-wrap { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin: 24px 0; }
  .gi-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  .gi-header-title { font-family: var(--font-mono); font-size: 13px; font-weight: 600; }
  .gi-body { display: grid; grid-template-columns: 220px 1fr; gap: 0; }
  @media (max-width: 600px) { .gi-body { grid-template-columns: 1fr; } }
  .gi-sidebar { border-right: 1px solid var(--border); padding: 12px; }
  .gi-category { margin-bottom: 16px; }
  .gi-cat-title { font-family: var(--font-mono); font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .gi-item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 6px; cursor: pointer; transition: background 0.15s; }
  .gi-item:hover { background: var(--bg2); }
  .gi-item-check { width: 14px; height: 14px; border-radius: 3px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 10px; transition: all 0.15s; }
  .gi-item-check.on { background: var(--green); border-color: var(--green); color: white; }
  .gi-item-label { font-size: 13px; color: var(--text2); }
  .gi-preview { padding: 0; overflow: hidden; }
  .gi-preview-bar { padding: 10px 16px; background: var(--surface); border-bottom: 1px solid var(--border); font-family: var(--font-mono); font-size: 11px; color: var(--text3); display: flex; align-items: center; justify-content: space-between; }
  .gi-preview-content { background: var(--bg2); min-height: 280px; padding: 16px; font-family: var(--font-mono); font-size: 12px; line-height: 1.8; overflow-y: auto; max-height: 360px; }
  .gi-line-comment { color: #6e7681; font-style: italic; }
  .gi-line-pattern { color: #a8ff78; }
  .gi-line-blank { height: 16px; }
  .gi-copy-btn { padding: 4px 12px; border-radius: 5px; border: 1px solid #30363d; background: #161b22; color: #58a6ff; font-family: var(--font-mono); font-size: 11px; cursor: pointer; transition: all 0.15s; }
  .gi-copy-btn:hover { background: #1f2937; }

  /* ═══════════════════════════════════════════
     GOTCHA SIMULATOR
  ═══════════════════════════════════════════ */
  .gotcha-wrap { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin: 24px 0; }
  .gotcha-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  .gotcha-header-title { font-family: var(--font-mono); font-size: 13px; font-weight: 600; }
  .gotcha-nav { display: flex; gap: 8px; }
  .gotcha-nav-btn { padding: 5px 14px; border-radius: 6px; border: 1px solid var(--border); background: var(--surface2); font-family: var(--font-mono); font-size: 11px; cursor: pointer; color: var(--text2); transition: all 0.15s; }
  .gotcha-nav-btn:hover { background: var(--bg2); }
  .gotcha-nav-btn.active { background: rgba(220,38,38,0.08); border-color: rgba(220,38,38,0.3); color: var(--red); }
  .gotcha-body { padding: 24px; }
  .gotcha-scenario { animation: fadeSlide 0.25s ease; }
  .gotcha-scenario-label { font-family: var(--font-mono); font-size: 11px; color: var(--red); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .gotcha-scenario-title { font-family: var(--font-display); font-size: 22px; font-weight: 800; margin-bottom: 8px; }
  .gotcha-scenario-desc { font-size: 14px; color: var(--text2); line-height: 1.6; margin-bottom: 20px; }
  /* Terminal */
  .gotcha-terminal { background: var(--bg2); border-radius: 10px; overflow: hidden; margin-bottom: 20px; }
  .gotcha-terminal-bar { background: #161b22; padding: 10px 14px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #30363d; }
  .gotcha-terminal-dot { width: 10px; height: 10px; border-radius: 50%; }
  .gotcha-terminal-title { margin-left: auto; font-family: var(--font-mono); font-size: 11px; color: #6e7681; }
  .gotcha-terminal-body { padding: 16px; font-family: var(--font-mono); font-size: 12px; line-height: 1.9; min-height: 120px; }
  .gt-prompt { color: #58a6ff; }
  .gt-cmd { color: #e2e8f0; }
  .gt-out { color: #7dcf85; }
  .gt-err { color: #f87171; }
  .gt-warn { color: #f2cc60; }
  .gt-comment { color: #6e7681; font-style: italic; }
  /* Step controls */
  .gotcha-steps { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
  .gotcha-step-item { display: flex; align-items: flex-start; gap: 12px; }
  .gotcha-step-dot { width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0; margin-top: 2px; transition: all 0.2s; }
  .gotcha-step-dot.done { background: var(--green); border-color: var(--green); color: white; }
  .gotcha-step-dot.current { background: var(--yellow); border-color: var(--yellow); color: #1a1a2e; }
  .gotcha-step-dot.todo { background: var(--surface); color: var(--text3); }
  .gotcha-step-text { font-size: 13px; color: var(--text2); line-height: 1.5; padding-top: 2px; }
  .gotcha-step-text.done { color: var(--green); }
  .gotcha-step-text.current { color: var(--text); font-weight: 600; }
  .gotcha-controls { display: flex; gap: 10px; flex-wrap: wrap; }
  .gotcha-btn { padding: 9px 20px; border-radius: 8px; border: 1px solid var(--border); font-family: var(--font-body); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .gotcha-btn-next { background: rgba(5,150,105,0.1); border-color: rgba(5,150,105,0.3); color: var(--green); }
  .gotcha-btn-next:hover { background: rgba(5,150,105,0.2); }
  .gotcha-btn-reset { background: none; color: var(--text3); }
  .gotcha-btn-reset:hover { background: var(--bg2); }
  .gotcha-fix { padding: 14px 16px; border-radius: 10px; background: rgba(5,150,105,0.06); border: 1px solid rgba(5,150,105,0.2); margin-top: 12px; animation: fadeSlide 0.3s ease; }
  .gotcha-fix-title { font-family: var(--font-mono); font-size: 11px; color: var(--green); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; font-weight: 700; }
  .gotcha-fix-body { font-size: 13px; color: var(--text2); line-height: 1.6; }

  /* ═══════════════════════════════════════════
     HOOKS BUILDER
  ═══════════════════════════════════════════ */
  .hooks-wrap { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin: 24px 0; }
  .hooks-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 14px 20px; }
  .hooks-header-title { font-family: var(--font-mono); font-size: 13px; font-weight: 600; }
  .hooks-header-sub { font-size: 12px; color: var(--text3); margin-top: 2px; }
  .hooks-body { display: grid; grid-template-columns: 220px 1fr; gap: 0; }
  @media (max-width: 600px) { .hooks-body { grid-template-columns: 1fr; } }
  .hooks-list { border-right: 1px solid var(--border); }
  .hooks-hook { padding: 12px 16px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.15s; }
  .hooks-hook:last-child { border-bottom: none; }
  .hooks-hook:hover { background: var(--bg2); }
  .hooks-hook.active { background: rgba(5,150,105,0.06); border-right: 2px solid var(--green); }
  .hooks-hook-name { font-family: var(--font-mono); font-size: 12px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
  .hooks-hook.active .hooks-hook-name { color: var(--green); }
  .hooks-hook-when { font-size: 11px; color: var(--text3); }
  .hooks-detail { padding: 20px; }
  .hooks-detail-name { font-family: var(--font-mono); font-size: 14px; font-weight: 700; color: var(--green); margin-bottom: 4px; }
  .hooks-detail-when { font-size: 13px; color: var(--text2); margin-bottom: 14px; }
  .hooks-detail-abort { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 5px; font-family: var(--font-mono); font-size: 11px; margin-bottom: 14px; }
  .hooks-detail-abort.yes { background: rgba(220,38,38,0.08); color: var(--red); border: 1px solid rgba(220,38,38,0.2); }
  .hooks-detail-abort.no { background: rgba(107,114,128,0.08); color: var(--text3); border: 1px solid var(--border); }
  .hooks-use-cases { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .hooks-use-case { padding: 8px 12px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg2); font-size: 13px; color: var(--text2); display: flex; align-items: center; gap: 8px; }
  .hooks-run-btn { padding: 8px 18px; border-radius: 8px; background: rgba(5,150,105,0.1); border: 1px solid rgba(5,150,105,0.3); color: var(--green); font-family: var(--font-mono); font-size: 12px; cursor: pointer; transition: all 0.15s; }
  .hooks-run-btn:hover { background: rgba(5,150,105,0.2); }
  .hooks-sim { margin-top: 12px; background: var(--bg2); border-radius: 8px; padding: 12px 14px; font-family: var(--font-mono); font-size: 12px; line-height: 1.8; animation: fadeSlide 0.2s ease; }
`;

// ─── SMALL REUSABLES ──────────────────────────────────────────────────────────
function CodeBlock({ title, lang, children }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="bp-code">
      <div className="bp-code-header">
        <span className="bp-code-dot" style={{ background: '#ff5f57' }} />
        <span className="bp-code-dot" style={{ background: '#ffbd2e' }} />
        <span className="bp-code-dot" style={{ background: '#28c840' }} />
        {title && <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text3)' }}>{title}</span>}
        <span className="bp-code-lang">{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(typeof children === 'string' ? children : '').catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: copied ? 'var(--green)' : 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>
      <pre>{children}</pre>
    </div>
  );
}

function Callout({ type = 'info', title, children }) {
  return (
    <div className={`bp-callout ${type}`}>
      {title && <div className="bp-callout-title">{{ info: 'ⓘ', warn: '⚠', danger: '⛔', success: '✓' }[type]} {title}</div>}
      <p>{children}</p>
    </div>
  );
}

function DeepDive({ title, badge = 'advanced', children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bp-deepdive">
      <div className="bp-deepdive-header" onClick={() => setOpen(o => !o)}>
        <span style={{ fontSize: 14, color: 'var(--green)' }}>⬡</span>
        <span className="bp-deepdive-title">{title}</span>
        <span className="bp-deepdive-badge">{badge}</span>
        <span className={`bp-deepdive-chevron ${open ? 'open' : ''}`}>▼</span>
      </div>
      {open && <div className="bp-deepdive-body">{children}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOLDEN RULES — expandable cards with real comparisons
// ═══════════════════════════════════════════════════════════════════════════════
const RULES = [
  {
    num: '01', title: 'Commit small, commit often', color: 'var(--accent)',
    tldr: 'One commit = one logical change. If your message has "and" in it, split the commit.',
    body: `A commit should answer: "What is the smallest meaningful unit of change that leaves the codebase in a working state?" Huge commits are a code review nightmare — the reviewer can't tell which change caused which effect. They're also harder to revert when something breaks.`,
    bad: { label: '✗ Too big', code: `git commit -m "Add user auth, fix login page CSS, \nupdate tests, refactor db connection pool, \nand bump dependencies"` },
    good: { label: '✓ Just right', code: `git commit -m "feat(auth): add JWT token generation"\ngit commit -m "fix(login): correct button alignment on mobile"\ngit commit -m "test(auth): add token expiry test cases"` },
    deepdive: 'The rule of thumb for atomic commits: you should be able to `git revert` any single commit without breaking unrelated functionality. If reverting a commit causes cascading failures in unrelated features, the commit was doing too many things.',
  },
  {
    num: '02', title: 'Write meaningful commit messages', color: 'var(--green)',
    tldr: 'Messages are documentation. Your team reads them 6 months from now during a bug hunt.',
    body: `"Fixed bug" tells nobody anything. When debugging production at 2am, your team reads the git log to understand what changed and why. A good message has a subject line that is imperative ("add" not "added"), under 72 chars, followed by a blank line and a body that explains the WHY — the context that the diff itself can't show.`,
    bad: { label: '✗ Useless messages', code: `wip\nfix\naaaa\nfinally works\nchanges\nlast one I promise` },
    good: { label: '✓ Conventional Commits', code: `feat(auth): add JWT refresh token rotation\n\nPreviously tokens were single-use with a 15min expiry\nwhich caused session drops on slow connections.\nNow issues a new refresh token on each use.\n\nCloses #234` },
    deepdive: 'The Conventional Commits spec (feat:, fix:, chore:, docs:, refactor:, test:) is now the industry standard. It enables automated changelog generation, semantic versioning bumps (feat → minor, fix → patch, BREAKING CHANGE → major), and filtering with `git log --grep="^feat"`. Many teams enforce it with commitlint running as a git hook.',
  },
  {
    num: '03', title: 'Never commit secrets', color: 'var(--red)',
    tldr: 'Once a secret is in git history, it is compromised — even if you delete it in the next commit.',
    body: `API keys, database passwords, private keys, and tokens committed to a repository are a critical security incident waiting to happen. Even if you immediately delete them in the next commit, the secret is still in git history and can be recovered by anyone with access to the repo — including GitHub bots that constantly scan for exposed credentials.`,
    bad: { label: '✗ Exposed in code', code: `const DB_URL = "postgres://admin:s3cr3tP4ss@prod.db.io/myapp"\nconst API_KEY = "sk-proj-abc123def456..."` },
    good: { label: '✓ Environment variables', code: `# .env (in .gitignore — never committed)\nDB_URL=postgres://admin:s3cr3tP4ss@prod.db.io/myapp\nAPI_KEY=sk-proj-abc123def456...\n\n# In code:\nconst DB_URL = process.env.DB_URL` },
    deepdive: 'If a secret is committed, the correct response is: (1) revoke/rotate the credential IMMEDIATELY before doing anything else — assume it is already compromised, (2) use `git filter-repo` (not filter-branch — it\'s deprecated) to remove it from history, (3) force-push to all remotes, (4) notify any affected users. GitHub Secret Scanning and tools like truffleHog can detect secrets in commit history automatically.',
  },
  {
    num: '04', title: 'Pull before you push — use rebase', color: 'var(--yellow)',
    tldr: 'Keep your local branch current. Use rebase to stay linear, not merge.',
    body: `Every time you're about to push, there's a chance someone else pushed first. Without pulling, you get a rejection. If you pull with merge (the default), you pollute history with countless "Merge branch 'main'" commits that carry zero information. Set pull.rebase=true globally so every pull is a rebase instead.`,
    bad: { label: '✗ Creates merge noise', code: `$ git pull   # creates merge commit\n$ git log --oneline\na1b2c3 Merge branch 'main' into feat/login\nf4e5d6 My actual change\ne7f8a9 Merge branch 'main' into feat/login\n... 40 more merge commits` },
    good: { label: '✓ Linear history', code: `$ git config --global pull.rebase true\n$ git pull   # rebases instead\n$ git log --oneline\na1b2c3 My actual change (replayed on top)\nf4e5d6 Alice's change\ne7f8a9 Bob's change` },
    deepdive: 'The difference between `git pull --merge` and `git pull --rebase` is the shape of history they produce. Merge creates a DAG with parallel timelines that converge — honest but visually complex. Rebase creates a linear sequence — cleaner but it rewrites your local commits (gives them new hashes). The golden rule: only rebase commits that haven\'t been pushed yet. Once shared, rebasing causes problems for others.',
  },
  {
    num: '05', title: "Don't panic — git reflog is your safety net", color: 'var(--accent2)',
    tldr: 'Git almost never deletes data. If something looks lost, the reflog has it.',
    body: `Every time HEAD moves — every commit, every checkout, every reset, every rebase — Git appends a line to the reflog. This log is local-only and persists for 90 days by default. It's your personal time machine. Accidentally reset --hard? Dropped a stash? Rebased wrong? The reflog contains the hash of what was there before.`,
    bad: { label: '✗ Panic response', code: `# Oh no, wrong branch!\n$ git reset --hard HEAD~5\n\n# Now frantically googling\n# "git how to undo reset"` },
    good: { label: '✓ Use the reflog', code: `$ git reflog\na1b2c3 HEAD@{0}: reset: moving to HEAD~5\nf4e5d6 HEAD@{1}: commit: feat: my 5 commits\n...\n\n# Just go back:\n$ git reset --hard HEAD@{1}\n# All 5 commits are back.` },
    deepdive: 'The reflog is stored in `.git/logs/`. Every branch has its own reflog at `.git/logs/refs/heads/branchname`, and HEAD has one at `.git/logs/HEAD`. The entries expire after `gc.reflogExpire` days (default 90) or `gc.reflogExpireUnreachable` days (default 30) for entries unreachable from any ref. To permanently disable expiry (risky — grows forever): `git config gc.reflogExpire never`.',
  },
];

function GoldenRules() {
  const [open, setOpen] = useState(null);
  return (
    <div className="rules-grid">
      {RULES.map((rule, i) => (
        <div key={i} className="rule-card" style={open === i ? { border: `1px solid ${rule.color}40` } : {}}>
          <div className="rule-card-header" onClick={() => setOpen(open === i ? null : i)}>
            <div className="rule-card-num" style={{ background: `${rule.color}18`, color: rule.color }}>
              {rule.num}
            </div>
            <div style={{ flex: 1 }}>
              <div className="rule-card-title">{rule.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{rule.tldr}</div>
            </div>
            <span className={`rule-card-chevron ${open === i ? 'open' : ''}`}>▼</span>
          </div>
          {open === i && (
            <div className="rule-card-body">
              <p>{rule.body}</p>
              <div className="rule-compare">
                <div className="rule-compare-card bad">
                  <div className="rule-compare-label">{rule.bad.label}</div>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 11, lineHeight: 1.7, color: 'var(--red)' }}>{rule.bad.code}</pre>
                </div>
                <div className="rule-compare-card good">
                  <div className="rule-compare-label">{rule.good.label}</div>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 11, lineHeight: 1.7, color: 'var(--green)' }}>{rule.good.code}</pre>
                </div>
              </div>
              <DeepDive title="Why this matters at depth" badge="internals">
                <p>{rule.deepdive}</p>
              </DeepDive>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMMIT MESSAGE LINTER
// ═══════════════════════════════════════════════════════════════════════════════
const CONVENTIONAL_TYPES = ['feat', 'fix', 'chore', 'docs', 'refactor', 'test', 'style', 'perf', 'ci', 'build', 'revert'];

const LINT_RULES = [
  {
    id: 'conventional',
    name: 'Conventional Commits format',
    detail: 'Must start with type(scope): or type: e.g. feat(auth): or fix:',
    check: (msg) => {
      const match = msg.match(/^(feat|fix|chore|docs|refactor|test|style|perf|ci|build|revert)(\([^)]+\))?!?: .+/);
      return { pass: !!match, hint: match ? `type: ${msg.split(':')[0]}` : 'Use format: feat(scope): description' };
    },
  },
  {
    id: 'length',
    name: 'Subject line ≤ 72 characters',
    detail: 'Long subjects wrap in terminals and GitHub truncates them',
    check: (msg) => {
      const subject = msg.split('\n')[0];
      return { pass: subject.length <= 72, hint: `${subject.length}/72 chars` };
    },
  },
  {
    id: 'imperative',
    name: 'Imperative mood',
    detail: 'Use "add" not "added", "fix" not "fixed" — reads as "this commit will..."',
    check: (msg) => {
      const subject = msg.split('\n')[0].toLowerCase();
      const pastTense = ['added', 'fixed', 'updated', 'changed', 'removed', 'deleted', 'created', 'modified'];
      const found = pastTense.find(w => subject.includes(w));
      return { pass: !found, hint: found ? `Remove past tense: "${found}"` : 'Good imperative mood' };
    },
  },
  {
    id: 'no_period',
    name: 'No trailing period',
    detail: 'Subject lines don\'t end with punctuation — they\'re titles, not sentences',
    check: (msg) => {
      const subject = msg.split('\n')[0];
      return { pass: !subject.endsWith('.'), hint: subject.endsWith('.') ? 'Remove trailing period' : 'No trailing period ✓' };
    },
  },
  {
    id: 'no_wip',
    name: 'No WIP/temp messages',
    detail: 'Never commit "wip", "temp", "asdf", "test" or similar placeholder messages',
    check: (msg) => {
      const bad = ['wip', 'temp', 'asdf', 'test commit', 'aaa', 'fix fix', 'lol', 'stuff'];
      const low = msg.toLowerCase();
      const found = bad.find(b => low.startsWith(b) || low === b);
      return { pass: !found, hint: found ? `"${found}" is not a real commit message` : 'Looks intentional ✓' };
    },
  },
  {
    id: 'body_blank_line',
    name: 'Blank line before body (if body exists)',
    detail: 'If there\'s a body, it must be separated from subject by a blank line',
    check: (msg) => {
      const lines = msg.split('\n');
      if (lines.length <= 1) return { pass: true, hint: 'No body — OK' };
      const hasBlankLine = lines[1] === '';
      return { pass: hasBlankLine, hint: hasBlankLine ? 'Blank line present ✓' : 'Add blank line after subject' };
    },
  },
];

const LINTER_EXAMPLES = [
  'feat(auth): add JWT refresh token rotation',
  'fix(login): handle null user on session resume',
  'Added the login page and fixed bugs',
  'wip',
  'refactor(db)!: migrate connection pool to pg-pool v3\n\nBREAKING CHANGE: removes deprecated pool.query() method.\nUse pool.execute() instead.\n\nCloses #456',
  'update stuff.',
];

function CommitLinter() {
  const [msg, setMsg] = useState('feat(auth): add JWT refresh token rotation');
  const [inputClass, setInputClass] = useState('');

  const results = LINT_RULES.map(r => ({ ...r, result: r.check(msg) }));
  const passCount = results.filter(r => r.result.pass).length;
  const score = Math.round((passCount / results.length) * 100);
  const scoreColor = score === 100 ? 'var(--green)' : score >= 67 ? 'var(--yellow)' : 'var(--red)';

  const handleSet = (val) => {
    setMsg(val);
    setInputClass('');
    const r = LINT_RULES.map(r => r.check(val));
    const pass = r.every(x => x.pass);
    setTimeout(() => setInputClass(pass ? 'valid' : 'invalid'), 10);
    setTimeout(() => setInputClass(''), 600);
  };

  return (
    <div className="linter-wrap">
      <div className="linter-header">
        <div className="linter-header-title">Commit Message Linter</div>
        <div className="linter-header-sub">Type a commit message — rules evaluate in real time</div>
      </div>
      <div className="linter-body">
        <div className="linter-input-row">
          <textarea
            className={`linter-input ${inputClass}`}
            rows={msg.includes('\n') ? 4 : 1}
            value={msg}
            onChange={e => handleSet(e.target.value)}
            placeholder="feat(scope): your message here"
          />
        </div>
        <div className="linter-results">
          {results.map((r, i) => (
            <div key={i} className={`linter-rule ${r.result.pass ? 'pass' : 'fail'}`}>
              <span className="linter-rule-icon">{r.result.pass ? '✓' : '✗'}</span>
              <div className="linter-rule-content">
                <div className="linter-rule-name">{r.name}</div>
                <div className="linter-rule-detail">{r.result.hint || r.detail}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="linter-score">
          <span className="linter-score-label" style={{ color: scoreColor, fontWeight: 700 }}>{score}/100</span>
          <div className="linter-score-bar">
            <div className="linter-score-fill" style={{ width: `${score}%`, background: scoreColor }} />
          </div>
          <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
            {score === 100 ? '🎉 Perfect commit message' : score >= 67 ? 'Acceptable — fix the warnings' : 'Needs work'}
          </span>
        </div>
        <div className="linter-examples">
          <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginRight: 4 }}>Try:</span>
          {LINTER_EXAMPLES.map((ex, i) => (
            <button key={i} className="linter-example-btn" onClick={() => handleSet(ex)}>
              {ex.split('\n')[0].slice(0, 36)}{ex.length > 36 ? '…' : ''}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECRET SCANNER
// Teaches: what secrets look like, why they're dangerous, prevention
// ═══════════════════════════════════════════════════════════════════════════════
const SECRET_PATTERNS = [
  { type: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/g, severity: 'critical', advice: 'Rotate immediately in AWS IAM. This key is now compromised.' },
  { type: 'Generic API Key', regex: /(?:api[_-]?key|apikey)\s*[=:]\s*["']?([a-zA-Z0-9_\-]{20,})["']?/gi, severity: 'high', advice: 'Move to environment variables. Add to .gitignore.' },
  { type: 'Private Key Header', regex: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/g, severity: 'critical', advice: 'Generate a new key pair. This private key is exposed.' },
  { type: 'Database URL with password', regex: /(?:postgres|mysql|mongodb):\/\/[^:]+:[^@]+@/gi, severity: 'critical', advice: 'Rotate DB password immediately. Use environment variables.' },
  { type: 'GitHub Token', regex: /gh[pousr]_[A-Za-z0-9_]{36}/g, severity: 'critical', advice: 'Revoke at github.com/settings/tokens immediately.' },
  { type: 'Generic password', regex: /(?:password|passwd|pwd)\s*[=:]\s*["']?([^"'\s]{8,})["']?/gi, severity: 'high', advice: 'Never hardcode passwords. Use secrets management.' },
  { type: 'JWT Token', regex: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, severity: 'medium', advice: 'JWTs contain encoded data. Don\'t commit real tokens.' },
  { type: 'Slack Webhook', regex: /https:\/\/hooks\.slack\.com\/services\/[A-Z0-9]+\/[A-Z0-9]+\/[a-zA-Z0-9]+/g, severity: 'high', advice: 'Revoke in Slack app settings. Anyone can post to your channel.' },
];

const SECRET_DEFAULT = `# config.js — DANGEROUS EXAMPLE (never do this!)
const config = {
  db: "postgres://admin:MyS3cr3tPass@prod.db.io/myapp",
  apiKey: "sk-proj-AKIAIOSFODNN7EXAMPLE123",
  jwtSecret: "super-secret-jwt-key-do-not-share",
  slackWebhook: "https://hooks.slack.com/services/TXXXX/BXXXX/XXXX"
};

module.exports = config;`;

function SecretScanner() {
  const [code, setCode] = useState(SECRET_DEFAULT);
  const findings = [];
  SECRET_PATTERNS.forEach(p => {
    const matches = [...code.matchAll(p.regex)];
    matches.forEach(m => {
      findings.push({ type: p.type, match: m[0].slice(0, 60) + (m[0].length > 60 ? '…' : ''), advice: p.advice, severity: p.severity });
    });
  });

  const sevColor = { critical: 'var(--red)', high: 'var(--orange)', medium: 'var(--yellow)' };

  return (
    <div className="secret-wrap">
      <div className="secret-header">
        <div className="secret-header-title">🔍 Secret Scanner — paste code to scan</div>
        <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
          Simulates tools like truffleHog, git-secrets, GitHub Secret Scanning
        </div>
      </div>
      <div className="secret-body">
        <div className="secret-editor">
          <div className="secret-editor-label">Paste your file contents here</div>
          <textarea
            className="secret-textarea"
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="secret-results">
          <div className="secret-results-label">{findings.length} finding{findings.length !== 1 ? 's' : ''}</div>
          {findings.length === 0 ? (
            <div className="secret-clean">✓ No secrets detected<br /><span style={{ fontSize: 11, color: 'var(--text3)' }}>Clear the editor to test</span></div>
          ) : (
            findings.map((f, i) => (
              <div key={i} className="secret-finding" style={{ borderColor: `${sevColor[f.severity]}40`, background: `${sevColor[f.severity]}08` }}>
                <div className="secret-finding-type" style={{ color: sevColor[f.severity] }}>
                  [{f.severity.toUpperCase()}] {f.type}
                </div>
                <div className="secret-finding-match">{f.match}</div>
                <div className="secret-finding-advice">💡 {f.advice}</div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="secret-footer">
        <strong>If a secret is already in history:</strong>
        <span>1. Rotate/revoke the credential immediately</span>
        <span>·</span>
        <span>2. <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>git filter-repo --path config.js --invert-paths</code></span>
        <span>·</span>
        <span>3. Force-push all branches</span>
        <span>·</span>
        <span>4. Notify affected users</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// .GITIGNORE BUILDER
// ═══════════════════════════════════════════════════════════════════════════════
const GITIGNORE_CATEGORIES = [
  {
    title: 'Languages / Runtimes', items: [
      { id: 'node', label: 'Node.js', patterns: ['# Node.js', 'node_modules/', 'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*', '.npm', '.yarn-integrity', ''] },
      { id: 'python', label: 'Python', patterns: ['# Python', '__pycache__/', '*.py[cod]', '*$py.class', '*.so', '.Python', 'venv/', 'env/', '.env/', '*.egg-info/', 'dist/', 'build/', ''] },
      { id: 'java', label: 'Java / Maven', patterns: ['# Java', '*.class', '*.jar', '*.war', '*.ear', 'target/', '.mvn/', ''] },
      { id: 'go', label: 'Go', patterns: ['# Go', '*.exe', '*.test', '*.out', 'vendor/', ''] },
    ],
  },
  {
    title: 'Environments & Secrets', items: [
      { id: 'env', label: '.env files', patterns: ['# Environment', '.env', '.env.local', '.env.*.local', '.env.production', ''] },
      { id: 'secrets', label: 'Secrets / Keys', patterns: ['# Secrets', '*.pem', '*.key', '*.p12', '*.pfx', 'secrets.json', 'credentials.json', ''] },
    ],
  },
  {
    title: 'Editors & OS', items: [
      { id: 'vscode', label: 'VS Code', patterns: ['# VS Code', '.vscode/', '!.vscode/extensions.json', ''] },
      { id: 'jetbrains', label: 'JetBrains', patterns: ['# JetBrains', '.idea/', '*.iml', '*.iws', ''] },
      { id: 'macos', label: 'macOS', patterns: ['# macOS', '.DS_Store', '.AppleDouble', '.LSOverride', ''] },
      { id: 'windows', label: 'Windows', patterns: ['# Windows', 'Thumbs.db', 'Desktop.ini', '$RECYCLE.BIN/', ''] },
    ],
  },
  {
    title: 'Build Outputs', items: [
      { id: 'dist', label: 'dist / build', patterns: ['# Build output', 'dist/', 'build/', 'out/', '.next/', '.nuxt/', ''] },
      { id: 'coverage', label: 'Test coverage', patterns: ['# Coverage', 'coverage/', '.nyc_output/', '*.lcov', ''] },
      { id: 'logs', label: 'Log files', patterns: ['# Logs', '*.log', 'logs/', '*.log.*', 'pids/', '*.pid', ''] },
    ],
  },
];

function GitignoreBuilder() {
  const [selected, setSelected] = useState({ node: true, env: true, secrets: true, vscode: true, macos: true, dist: true });
  const [copied, setCopied] = useState(false);

  const toggle = (id) => setSelected(s => ({ ...s, [id]: !s[id] }));

  const content = GITIGNORE_CATEGORIES.flatMap(cat =>
    cat.items.filter(i => selected[i.id]).flatMap(i => i.patterns)
  );

  const copyAll = () => {
    navigator.clipboard.writeText(content.join('\n')).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="gi-wrap">
      <div className="gi-header">
        <div className="gi-header-title">.gitignore Generator</div>
        <div style={{ fontSize: 12, color: 'var(--text3)' }}>Check what applies to your project → copy the result</div>
      </div>
      <div className="gi-body">
        <div className="gi-sidebar">
          {GITIGNORE_CATEGORIES.map(cat => (
            <div key={cat.title} className="gi-category">
              <div className="gi-cat-title">{cat.title}</div>
              {cat.items.map(item => (
                <div key={item.id} className="gi-item" onClick={() => toggle(item.id)}>
                  <div className={`gi-item-check ${selected[item.id] ? 'on' : ''}`}>
                    {selected[item.id] ? '✓' : ''}
                  </div>
                  <span className="gi-item-label">{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="gi-preview">
          <div className="gi-preview-bar">
            <span>.gitignore</span>
            <button className="gi-copy-btn" onClick={copyAll}>{copied ? '✓ Copied' : 'Copy all'}</button>
          </div>
          <div className="gi-preview-content">
            {content.length === 0 ? (
              <div style={{ color: '#6e7681' }}># Select options on the left</div>
            ) : (
              content.map((line, i) => (
                line === '' ? <div key={i} className="gi-line-blank" /> :
                line.startsWith('#') ? <div key={i} className="gi-line-comment">{line}</div> :
                <div key={i} className="gi-line-pattern">{line}</div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA SIMULATOR
// Teaches: real situations where beginners get burned
// ═══════════════════════════════════════════════════════════════════════════════
const GOTCHAS = [
  {
    title: 'Committing to the wrong branch',
    label: 'Classic mistake #1',
    desc: 'You forgot to create a feature branch and made 3 commits directly to main. The team enforces branch protection but your local main is now ahead. Here\'s how to move those commits.',
    steps: [
      { text: 'Realize you\'re on main with 3 commits you meant for a feature branch', term: [{ t: 'prompt', c: '$ git log --oneline -4' }, { t: 'out', c: 'a1b2c3 feat: add dashboard widget' }, { t: 'out', c: 'f4e5d6 feat: add chart component' }, { t: 'out', c: 'c7d8e9 feat: add data fetcher' }, { t: 'out', c: '9a0b1c chore: initial setup (origin/main)' }] },
      { text: 'Create the feature branch pointing at your current HEAD', term: [{ t: 'prompt', c: '$ git branch feat/dashboard' }, { t: 'comment', c: '# Branch created at current HEAD (includes your 3 commits)' }] },
      { text: 'Move main back to where it should be (the origin)', term: [{ t: 'prompt', c: '$ git reset --hard origin/main' }, { t: 'warn', c: 'HEAD is now at 9a0b1c chore: initial setup' }, { t: 'comment', c: '# main is restored. Your commits still exist on feat/dashboard' }] },
      { text: 'Switch to your feature branch and push normally', term: [{ t: 'prompt', c: '$ git checkout feat/dashboard' }, { t: 'out', c: "Switched to branch 'feat/dashboard'" }, { t: 'prompt', c: '$ git push origin feat/dashboard' }, { t: 'out', c: 'Branch pushed. Open a PR!' }] },
    ],
    fix: 'The key insight: creating a branch does not move any commits — it just creates a new pointer. Then `git reset --hard` moves main backward without touching feat/dashboard, because they\'re independent pointers.',
  },
  {
    title: 'Accidentally committed node_modules',
    label: 'Classic mistake #2',
    desc: 'You forgot to create a .gitignore before your first commit. node_modules (150MB, 80,000 files) is now tracked. git status is useless. Here\'s the fix.',
    steps: [
      { text: 'Confirm the damage', term: [{ t: 'prompt', c: '$ git ls-files | wc -l' }, { t: 'err', c: '84203' }, { t: 'comment', c: '# 84,000 files tracked — catastrophic' }] },
      { text: 'Create .gitignore with node_modules/', term: [{ t: 'prompt', c: '$ echo "node_modules/" >> .gitignore' }, { t: 'prompt', c: '$ echo ".env" >> .gitignore' }] },
      { text: 'Remove node_modules from Git\'s index (not from disk)', term: [{ t: 'prompt', c: '$ git rm -r --cached node_modules' }, { t: 'warn', c: 'rm node_modules/... (84000 files removed from index)' }, { t: 'comment', c: '# --cached = remove from git tracking only, not disk' }] },
      { text: 'Commit the .gitignore and the removal', term: [{ t: 'prompt', c: '$ git add .gitignore' }, { t: 'prompt', c: '$ git commit -m "chore: add .gitignore, untrack node_modules"' }, { t: 'out', c: '[main a1b2c3] chore: add .gitignore, untrack node_modules' }, { t: 'out', c: '84201 files changed, 0 insertions(+)' }] },
    ],
    fix: '`git rm --cached` is the magic: it removes a file from Git\'s tracking without deleting it from your disk. The file stays, but Git stops managing it. Without `--cached`, `git rm` would delete the actual folder.',
  },
  {
    title: 'Force push overwrote a teammate\'s work',
    label: 'Classic mistake #3',
    desc: 'You rebased your branch, force-pushed, and your teammate\'s commits on the same branch are now gone from the remote. This is recoverable.',
    steps: [
      { text: 'Your teammate notices their commits disappeared', term: [{ t: 'prompt', c: "$ git log origin/feat/auth --oneline" }, { t: 'err', c: 'a1b2c3 your rebase commit' }, { t: 'err', c: '9a0b1c base commit' }, { t: 'comment', c: "# Alice's 3 commits are gone from remote!" }] },
      { text: "Find Alice's commits in HER local reflog", term: [{ t: 'prompt', c: '$ git reflog alice-machine # (on Alice\'s machine)' }, { t: 'out', c: 'f4e5d6 HEAD@{1}: commit: feat: add 2FA support' }, { t: 'out', c: 'c7d8e9 HEAD@{2}: commit: feat: add SMS verify' }, { t: 'out', c: 'd0e1f2 HEAD@{3}: commit: feat: add email verify' }] },
      { text: 'Cherry-pick or restore them to the branch', term: [{ t: 'prompt', c: '$ git cherry-pick f4e5d6 c7d8e9 d0e1f2' }, { t: 'out', c: '[feat/auth a2b3c4] feat: add 2FA support' }, { t: 'out', c: '[feat/auth b3c4d5] feat: add SMS verify' }, { t: 'out', c: '[feat/auth c4d5e6] feat: add email verify' }] },
      { text: 'Push with --force-with-lease this time', term: [{ t: 'prompt', c: '$ git push origin feat/auth --force-with-lease' }, { t: 'out', c: 'Branch updated. Communicate with your team!' }] },
    ],
    fix: 'Prevention: always use `--force-with-lease` instead of `--force`. It refuses to push if the remote has commits you don\'t have locally — the situation that causes this disaster. Recovery requires the affected developer\'s local reflog, which is why force pushes on shared branches are a team-level incident.',
  },
  {
    title: 'Merge conflict panic',
    label: 'Classic mistake #4',
    desc: 'You tried to merge main into your branch and hit conflicts. The terminal output scared you and you ran `git merge --abort`. But you should have resolved them. Here\'s the correct approach.',
    steps: [
      { text: 'Hit conflicts during merge', term: [{ t: 'prompt', c: '$ git merge main' }, { t: 'err', c: 'CONFLICT (content): Merge conflict in src/auth.js' }, { t: 'err', c: 'CONFLICT (content): Merge conflict in src/db.js' }, { t: 'warn', c: 'Automatic merge failed; fix conflicts and commit.' }] },
      { text: 'Understand the conflict markers in the file', term: [{ t: 'comment', c: '<<<<<<< HEAD (your changes)' }, { t: 'out', c: 'return jwt.verify(token, SECRET, opts);' }, { t: 'comment', c: '======= (separator)' }, { t: 'out', c: 'return jwt.verify(token, SECRET);' }, { t: 'comment', c: '>>>>>>> main (incoming changes)' }] },
      { text: 'Edit the file to keep what you want, remove markers', term: [{ t: 'comment', c: '# Edit src/auth.js — delete markers, keep correct code' }, { t: 'prompt', c: '$ git add src/auth.js src/db.js' }, { t: 'comment', c: '# git add tells Git "I resolved this file"' }] },
      { text: 'Complete the merge', term: [{ t: 'prompt', c: '$ git commit' }, { t: 'comment', c: '# Git pre-fills "Merge branch \'main\' into feat/auth"' }, { t: 'out', c: '[feat/auth a1b2c3] Merge branch \'main\' into feat/auth' }] },
    ],
    fix: 'The three sections: HEAD is YOUR version (what\'s on your branch). The text after ======= is THEIRS (what\'s coming in). You edit the file to the correct final state — you can keep yours, keep theirs, or write something new — then `git add` the resolved file.',
  },
];

function GotchaSimulator() {
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState(0);
  const gotcha = GOTCHAS[idx];
  const totalSteps = gotcha.steps.length;

  const reset = (newIdx) => {
    setIdx(newIdx);
    setStep(0);
  };

  const termLine = (line) => {
    const cls = { prompt: 'gt-prompt', out: 'gt-out', err: 'gt-err', warn: 'gt-warn', comment: 'gt-comment', cmd: 'gt-cmd' };
    if (line.t === 'prompt') {
      const parts = line.c.split(' ');
      return <div><span className="gt-prompt">$ </span><span className="gt-cmd">{line.c.slice(2)}</span></div>;
    }
    return <div className={cls[line.t] || 'gt-out'}>{line.c}</div>;
  };

  return (
    <div className="gotcha-wrap">
      <div className="gotcha-header">
        <div className="gotcha-header-title">⚡ Gotcha Simulator — walk through real disasters</div>
        <div className="gotcha-nav">
          {GOTCHAS.map((g, i) => (
            <button key={i} className={`gotcha-nav-btn ${idx === i ? 'active' : ''}`} onClick={() => reset(i)}>
              #{i + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="gotcha-body">
        <div className="gotcha-scenario">
          <div className="gotcha-scenario-label">{gotcha.label}</div>
          <div className="gotcha-scenario-title">{gotcha.title}</div>
          <div className="gotcha-scenario-desc">{gotcha.desc}</div>

          {/* Terminal showing steps up to current */}
          <div className="gotcha-terminal">
            <div className="gotcha-terminal-bar">
              <span className="gotcha-terminal-dot" style={{ background: '#ff5f57' }} />
              <span className="gotcha-terminal-dot" style={{ background: '#ffbd2e' }} />
              <span className="gotcha-terminal-dot" style={{ background: '#28c840' }} />
              <span className="gotcha-terminal-title">bash — feat/auth</span>
            </div>
            <div className="gotcha-terminal-body">
              {gotcha.steps.slice(0, step + 1).map((s, si) => (
                <div key={si} style={{ marginBottom: si < step ? 12 : 0 }}>
                  {si < step && <div className="gt-comment"># Step {si + 1}: {s.text}</div>}
                  {s.term.map((line, li) => <div key={li}>{termLine(line)}</div>)}
                </div>
              ))}
            </div>
          </div>

          {/* Step progress */}
          <div className="gotcha-steps">
            {gotcha.steps.map((s, si) => (
              <div key={si} className="gotcha-step-item">
                <div className={`gotcha-step-dot ${si < step ? 'done' : si === step ? 'current' : 'todo'}`}>
                  {si < step ? '✓' : si + 1}
                </div>
                <div className={`gotcha-step-text ${si < step ? 'done' : si === step ? 'current' : ''}`}>
                  {s.text}
                </div>
              </div>
            ))}
          </div>

          <div className="gotcha-controls">
            {step < totalSteps - 1 ? (
              <button className="gotcha-btn gotcha-btn-next" onClick={() => setStep(s => s + 1)}>
                Next step →
              </button>
            ) : (
              <button className="gotcha-btn" style={{ background: 'rgba(5,150,105,0.1)', borderColor: 'rgba(5,150,105,0.3)', color: 'var(--green)' }} disabled>
                ✓ Resolved!
              </button>
            )}
            <button className="gotcha-btn gotcha-btn-reset" onClick={() => reset(idx)}>Restart</button>
          </div>

          {step === totalSteps - 1 && (
            <div className="gotcha-fix">
              <div className="gotcha-fix-title">💡 The Key Insight</div>
              <div className="gotcha-fix-body">{gotcha.fix}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GIT HOOKS EXPLORER
// Teaches: which hooks exist, when they fire, can they abort, use cases
// ═══════════════════════════════════════════════════════════════════════════════
const HOOKS = [
  {
    name: 'pre-commit', when: 'Before commit message is entered', canAbort: true,
    useCases: ['Run linter (ESLint, Prettier)', 'Run fast unit tests', 'Check for debug statements (console.log)', 'Validate secret patterns in staged files'],
    sim: [
      { t: 'prompt', c: '$ git commit -m "feat: add login"' },
      { t: 'warn', c: 'Running pre-commit hook...' },
      { t: 'out', c: '✓ ESLint: 0 errors' },
      { t: 'err', c: '✗ Found console.log in src/auth.js:34' },
      { t: 'err', c: 'pre-commit hook failed (exit code 1)' },
      { t: 'comment', c: '# Commit aborted. Fix the issue and retry.' },
    ],
  },
  {
    name: 'commit-msg', when: 'After message entered, before commit written', canAbort: true,
    useCases: ['Enforce Conventional Commits format', 'Check minimum message length', 'Add ticket number from branch name automatically', 'Reject "wip" or "temp" messages'],
    sim: [
      { t: 'prompt', c: '$ git commit -m "wip"' },
      { t: 'warn', c: 'Running commit-msg hook...' },
      { t: 'err', c: '✗ Message "wip" does not match Conventional Commits' },
      { t: 'err', c: '  Expected: feat|fix|chore|...(scope)?: description' },
      { t: 'err', c: 'commit-msg hook failed (exit code 1)' },
      { t: 'comment', c: '# Try: git commit -m "feat: add dashboard"' },
    ],
  },
  {
    name: 'pre-push', when: 'Before git push sends data to remote', canAbort: true,
    useCases: ['Run full test suite before pushing', 'Block pushes directly to main', 'Check for sensitive file patterns', 'Validate version bumps on release branches'],
    sim: [
      { t: 'prompt', c: '$ git push origin main' },
      { t: 'warn', c: 'Running pre-push hook...' },
      { t: 'err', c: '✗ Direct push to main is not allowed.' },
      { t: 'err', c: '  Open a PR instead: git push origin HEAD:feat/your-branch' },
      { t: 'err', c: 'pre-push hook failed (exit code 1)' },
      { t: 'comment', c: '# Push blocked. Branch protection enforced locally!' },
    ],
  },
  {
    name: 'post-commit', when: 'After commit is created (cannot abort)', canAbort: false,
    useCases: ['Send Slack notification about new commit', 'Trigger local dev server reload', 'Log commit metadata to internal analytics', 'Update local documentation index'],
    sim: [
      { t: 'prompt', c: '$ git commit -m "feat: add payment flow"' },
      { t: 'out', c: '[main a1b2c3] feat: add payment flow' },
      { t: 'warn', c: 'Running post-commit hook...' },
      { t: 'out', c: '📬 Slack: New commit on feat/payments by alice' },
      { t: 'out', c: 'Hook complete (exit code ignored)' },
      { t: 'comment', c: '# Commit succeeded regardless of hook exit code' },
    ],
  },
  {
    name: 'prepare-commit-msg', when: 'Before editor opens for commit message', canAbort: false,
    useCases: ['Auto-prepend ticket number from branch name', 'Add template to commit message', 'Insert co-author lines from pairing session', 'Pre-fill message from last stash description'],
    sim: [
      { t: 'comment', c: '# Branch: feat/AUTH-234-add-login' },
      { t: 'prompt', c: '$ git commit' },
      { t: 'warn', c: 'Running prepare-commit-msg hook...' },
      { t: 'out', c: '✓ Prepended [AUTH-234] to message template' },
      { t: 'comment', c: '# Editor opens with: "[AUTH-234] " pre-filled' },
    ],
  },
];

function HooksExplorer() {
  const [selected, setSelected] = useState(0);
  const [simRunning, setSimRunning] = useState(false);
  const [simLines, setSimLines] = useState([]);
  const hook = HOOKS[selected];

  const runSim = () => {
    setSimRunning(true); setSimLines([]);
    hook.sim.forEach((line, i) => {
      setTimeout(() => {
        setSimLines(l => [...l, line]);
        if (i === hook.sim.length - 1) setSimRunning(false);
      }, i * 500);
    });
  };

  const lineColor = { prompt: '#58a6ff', out: '#7dcf85', err: '#f87171', warn: '#f2cc60', comment: '#6e7681' };

  return (
    <div className="hooks-wrap">
      <div className="hooks-header">
        <div className="hooks-header-title">Git Hooks — lifecycle event system</div>
        <div className="hooks-header-sub">Scripts in .git/hooks/ that Git runs automatically at each event</div>
      </div>
      <div className="hooks-body">
        <div className="hooks-list">
          {HOOKS.map((h, i) => (
            <div key={i} className={`hooks-hook ${selected === i ? 'active' : ''}`} onClick={() => { setSelected(i); setSimLines([]); }}>
              <div className="hooks-hook-name">{h.name}</div>
              <div className="hooks-hook-when">{h.when.slice(0, 36)}…</div>
            </div>
          ))}
        </div>
        <div className="hooks-detail">
          <div className="hooks-detail-name">.git/hooks/{hook.name}</div>
          <div className="hooks-detail-when">{hook.when}</div>
          <div className={`hooks-detail-abort ${hook.canAbort ? 'yes' : 'no'}`}>
            {hook.canAbort ? '⛔ Can abort the Git operation' : '✓ Cannot abort — informational only'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Common use cases</div>
          <div className="hooks-use-cases">
            {hook.useCases.map((u, i) => (
              <div key={i} className="hooks-use-case">
                <span style={{ color: 'var(--green)' }}>→</span> {u}
              </div>
            ))}
          </div>
          <button className="hooks-run-btn" onClick={runSim} disabled={simRunning}>
            {simRunning ? '⟳ Simulating…' : '▶ Simulate hook'}
          </button>
          {simLines.length > 0 && (
            <div className="hooks-sim">
              {simLines.map((l, i) => (
                <div key={i} style={{ color: lineColor[l.t] || '#e2e8f0' }}>
                  {l.t === 'prompt' ? <><span style={{ color: '#58a6ff' }}>$ </span>{l.c.slice(2)}</> : l.c}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function BestPractices() {
  useEffect(() => {
    const els = document.querySelectorAll('.fade-in-section');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
    }, { threshold: 0.08 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="bp-page">

        {/* ── HERO ── */}
        <div className="bp-hero">
          <div className="bp-hero-grid" />
          <div className="bp-hero-content">
            <div className="bp-badge"><span />Chapter 12</div>
            <h1 className="bp-hero-title">Git <em>Best Practices</em></h1>
            <p className="bp-hero-sub">
              The gap between knowing Git commands and using Git effectively as a professional. Five rules, a commit linter, a secret scanner, gotcha walkthroughs, and a hooks explorer.
            </p>
            <div className="bp-hero-stats">
              <div className="bp-hstat"><div className="bp-hstat-num">5</div><div className="bp-hstat-label">Golden rules</div></div>
              <div className="bp-hstat"><div className="bp-hstat-num">4</div><div className="bp-hstat-label">Gotcha scenarios</div></div>
              <div className="bp-hstat"><div className="bp-hstat-num">5</div><div className="bp-hstat-label">Git hooks</div></div>
              <div className="bp-hstat"><div className="bp-hstat-num">6</div><div className="bp-hstat-label">Interactive tools</div></div>
            </div>
          </div>
        </div>

        {/* ══ SECTION 1: GOLDEN RULES ══ */}
        <section className="bp-section fade-in-section">
          <div className="bp-label">Fundamentals</div>
          <h2 className="bp-title">The 5 golden rules</h2>
          <p className="bp-desc">
            These aren't style preferences — they're the difference between a repository that's a pleasure to work with and one that causes daily friction. Click each rule to see real before/after examples and the internals rationale.
          </p>
          <GoldenRules />
        </section>

        {/* ══ SECTION 2: COMMIT MESSAGES ══ */}
        <section className="bp-section fade-in-section">
          <div className="bp-label">Commit Quality</div>
          <h2 className="bp-title">Writing commits that communicate</h2>
          <p className="bp-desc">
            The Conventional Commits specification turns your commit history into structured, machine-readable data. Type a message below and see it evaluated against the full ruleset in real time.
          </p>
          <p className="bp-body">
            A commit message has two jobs: tell the reader <strong>what changed</strong> (the diff already does this) and tell them <strong>why it changed</strong> (only you know this). The "why" is the message body — the part almost everyone skips. Six months from now, when a bug is traced to a commit, the body is what tells the next engineer whether the change was intentional, a workaround for a third-party bug, or a performance trade-off with known implications.
          </p>
          <CommitLinter />

          <CodeBlock lang="text" title="Conventional Commits — full format">
{`<type>(<scope>)!: <subject>    ← required
                                ← blank line (required if body exists)
<body>                          ← optional: explain the WHY
                                ← blank line
<footer>                        ← optional: Closes #123, BREAKING CHANGE: ...

─── Types ────────────────────────────────────────────────────────
feat     New feature visible to users            → bumps MINOR version
fix      Bug fix visible to users                → bumps PATCH version
chore    Build/tooling/dependency changes        → no version bump
docs     Documentation only                     → no version bump
refactor Code restructure, no behavior change   → no version bump
test     Adding or fixing tests                  → no version bump
perf     Performance improvement                 → bumps PATCH version
ci       CI/CD pipeline changes                  → no version bump
!        Appended to type = BREAKING CHANGE      → bumps MAJOR version

─── Examples ─────────────────────────────────────────────────────
feat(auth): add biometric login support
fix(payments): handle EUR rounding for amounts under 1 cent
refactor(db)!: remove deprecated pool.query() API
docs(api): add rate limiting section to README
chore(deps): bump express from 4.18.0 to 4.19.1`}
          </CodeBlock>

          <DeepDive title="Automating changelogs with Conventional Commits" badge="tooling">
            <p>Tools like <code>semantic-release</code>, <code>conventional-changelog</code>, and <code>release-please</code> parse your commit history and automate: version bumping (feat → minor, fix → patch, ! → major), CHANGELOG.md generation, GitHub Release creation, and npm publish. This only works if your commits follow the spec consistently — which is why teams enforce it with commitlint as a git hook.</p>
            <p>The setup: install <code>@commitlint/cli</code> and <code>@commitlint/config-conventional</code>, create <code>commitlint.config.js</code>, then wire it to the <code>commit-msg</code> git hook via Husky. Every commit is now validated before it's written — the team can't accidentally ship unformatted messages.</p>
          </DeepDive>
        </section>

        {/* ══ SECTION 3: SECRETS ══ */}
        <section className="bp-section fade-in-section">
          <div className="bp-label">Security</div>
          <h2 className="bp-title">Never commit secrets — and what to do if you do</h2>
          <p className="bp-desc">
            A secret committed to a repository is a compromised secret — even if deleted in the next commit. Paste any code below to scan it for common secret patterns.
          </p>
          <p className="bp-body">
            GitHub's Secret Scanning feature automatically scans every push to public repos (and private repos on Enterprise) for known credential formats from 100+ providers. Within seconds of a push containing an AWS key, GitHub notifies both you and AWS, who can auto-revoke the key. Bots constantly scrape GitHub for exposed secrets — assume detection is instant.
          </p>

          <SecretScanner />

          <div className="bp-divider" />

          <h3 className="bp-sub">.gitignore — your first line of defense</h3>
          <p className="bp-body">
            A <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>.gitignore</code> file must exist before your first commit. Create it <strong>before</strong> you run <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>git init</code>, not after. Patterns added after a file is already tracked have no effect — use <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>git rm --cached</code> to untrack existing files.
          </p>

          <GitignoreBuilder />

          <Callout type="danger" title="The global .gitignore — a hidden safety net">
            Beyond repo-level .gitignore, set a global one that applies to every repo on your machine. This catches editor files and OS artifacts that shouldn't be in any project's .gitignore (that's the repo owner's problem, not yours): <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>git config --global core.excludesFile ~/.gitignore_global</code>
          </Callout>
        </section>

        {/* ══ SECTION 4: GOTCHAS ══ */}
        <section className="bp-section fade-in-section">
          <div className="bp-label">Disaster Recovery</div>
          <h2 className="bp-title">Common gotchas — and how to escape them</h2>
          <p className="bp-desc">
            Every developer hits these situations. Walk through 4 real disasters step by step — see exactly what happened in the terminal and what commands fix it.
          </p>
          <GotchaSimulator />
        </section>

        {/* ══ SECTION 5: HOOKS ══ */}
        <section className="bp-section fade-in-section">
          <div className="bp-label">Automation</div>
          <h2 className="bp-title">Git hooks — enforce quality at the source</h2>
          <p className="bp-desc">
            Git hooks are shell scripts that run automatically at lifecycle events. They let you enforce lint, tests, commit message format, and security rules locally — before code ever reaches CI.
          </p>
          <p className="bp-body">
            Hooks live in <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>.git/hooks/</code> and are <strong>not committed to the repository</strong> — they exist only on your machine. This is intentional (you don't want to force hooks on everyone), but it's also a distribution problem. Tools like <strong>Husky</strong> solve this by storing hooks in the committed <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>.husky/</code> directory and using npm's <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>prepare</code> script to install them automatically on <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>npm install</code>.
          </p>

          <HooksExplorer />

          <CodeBlock lang="bash" title="Husky setup — shareable hooks via npm">
{`# Install husky
npm install --save-dev husky

# Initialize (creates .husky/ directory)
npx husky init

# Create a pre-commit hook that runs ESLint
echo "npx eslint --fix-dry-run ." > .husky/pre-commit
chmod +x .husky/pre-commit

# Create a commit-msg hook using commitlint
npm install --save-dev @commitlint/cli @commitlint/config-conventional
echo '{ "extends": ["@commitlint/config-conventional"] }' > commitlint.config.json
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg

# Add to package.json so hooks install on npm install:
# "scripts": { "prepare": "husky" }

# lint-staged: only run lint on staged files (much faster)
npm install --save-dev lint-staged
# In package.json:
# "lint-staged": {
#   "*.{js,ts}": ["eslint --fix", "prettier --write"],
#   "*.css": ["stylelint --fix"]
# }`}
          </CodeBlock>

          <DeepDive title="Client-side vs server-side hooks — what can't be bypassed" badge="security">
            <p>Client-side hooks (pre-commit, commit-msg, pre-push) run on the developer's machine and can always be bypassed with <code>git commit --no-verify</code>. They're quality-of-life guardrails, not security controls. A developer who wants to bypass them can.</p>
            <p>Server-side hooks (pre-receive, update, post-receive) run on the Git server — on GitHub these are replaced by GitHub Actions, branch protection rules, and required status checks. These cannot be bypassed by the developer. This is why branch protection rules + required CI checks are the actual enforcement mechanism, while client-side hooks are the fast feedback loop that catches issues before they even reach CI.</p>
          </DeepDive>

          <Callout type="success" title="The complete quality gate setup for a production team">
            Local (fast feedback): pre-commit → lint-staged runs ESLint + Prettier on staged files only. commit-msg → commitlint validates message format. Remote (actual enforcement): GitHub branch protection requires 1 approval + passing CI. CI runs the full test suite, security scan, and build check. Nothing merges to main without passing all three layers.
          </Callout>
        </section>

      </div>
    </>
  );
}