import React, { useState, useEffect, useRef } from 'react';

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = `
  .gh-page { padding: 48px 0 100px; }

  /* ── Hero ── */
  .gh-hero {
    padding: 80px 10% 60px; border-bottom: 1px solid var(--border);
    text-align: center; position: relative; overflow: hidden;
  }
  .gh-hero-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 40px 40px; opacity: 0.25;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent);
    pointer-events: none;
  }
  .gh-hero-content { position: relative; z-index: 1; }
  .gh-badge {
    display: inline-flex; align-items: center; gap: 6px; padding: 4px 14px;
    background: rgba(139,92,246,0.08); border: 1px solid rgba(139,92,246,0.25);
    border-radius: 20px; font-size: 11px; font-family: var(--font-mono);
    color: var(--accent2); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 20px;
  }
  .gh-badge span { width: 6px; height: 6px; border-radius: 50%; background: var(--accent2); display: inline-block; }
  .gh-hero-title {
    font-family: var(--font-display); font-size: clamp(36px, 5vw, 60px);
    font-weight: 800; line-height: 1.05; letter-spacing: -2px; margin-bottom: 16px;
  }
  .gh-hero-title em {
    font-style: normal;
    background: linear-gradient(135deg, var(--accent2) 0%, var(--pink) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .gh-hero-sub { font-size: 16px; color: var(--text2); line-height: 1.7; max-width: 560px; margin: 0 auto 32px; }
  .gh-hero-stats { display: flex; gap: 40px; justify-content: center; flex-wrap: wrap; }
  .gh-stat { text-align: center; }
  .gh-stat-num { font-family: var(--font-display); font-size: 26px; font-weight: 800; color: var(--accent2); }
  .gh-stat-label { font-size: 11px; color: var(--text3); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.5px; }

  /* ── Section shell ── */
  .gh-section { width: 80%; margin: 0 10%; padding: 64px 0; border-bottom: 1px solid var(--border); }
  .gh-label { font-family: var(--font-mono); font-size: 11px; color: var(--accent2); text-transform: uppercase; letter-spacing: 3px; margin-bottom: 10px; }
  .gh-title { font-family: var(--font-display); font-size: clamp(28px, 3.5vw, 40px); font-weight: 800; letter-spacing: -1px; line-height: 1.1; margin-bottom: 12px; }
  .gh-desc { font-size: 15px; color: var(--text2); line-height: 1.7; margin-bottom: 32px; }
  .gh-body { font-size: 15px; color: var(--text2); line-height: 1.7; margin-bottom: 20px; }
  .gh-body strong { color: var(--text); }
  .gh-sub { font-family: var(--font-display); font-size: 22px; font-weight: 700; margin: 40px 0 12px; }
  .gh-divider { height: 1px; background: var(--border); margin: 48px 0; }

  /* ── Code block ── */
  .gh-code { background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin: 20px 0; font-family: var(--font-mono); font-size: 13px; line-height: 1.7; }
  .gh-code-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 10px 16px; display: flex; align-items: center; gap: 8px; }
  .gh-code-dot { width: 10px; height: 10px; border-radius: 50%; }
  .gh-code-lang { margin-left: auto; font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; }
  .gh-code pre { margin: 0; padding: 16px; overflow-x: auto; color: var(--text2); }

  /* ── Callout ── */
  .gh-callout { border-radius: 10px; padding: 16px 20px; margin: 20px 0; border: 1px solid; }
  .gh-callout.info { background: rgba(59,130,246,0.05); border-color: rgba(59,130,246,0.2); }
  .gh-callout.warn { background: rgba(217,119,6,0.05); border-color: rgba(217,119,6,0.2); }
  .gh-callout.danger { background: rgba(220,38,38,0.05); border-color: rgba(220,38,38,0.2); }
  .gh-callout.success { background: rgba(5,150,105,0.05); border-color: rgba(5,150,105,0.2); }
  .gh-callout-title { font-weight: 700; font-size: 13px; margin-bottom: 6px; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.5px; }
  .gh-callout.info .gh-callout-title { color: var(--accent); }
  .gh-callout.warn .gh-callout-title { color: var(--yellow); }
  .gh-callout.danger .gh-callout-title { color: var(--red); }
  .gh-callout.success .gh-callout-title { color: var(--green); }
  .gh-callout p, .gh-callout li { font-size: 14px; color: var(--text2); line-height: 1.6; }

  /* ── DeepDive ── */
  .gh-deepdive { border: 1px solid var(--border); border-radius: 10px; margin: 20px 0; overflow: hidden; }
  .gh-deepdive-header { padding: 14px 18px; background: var(--surface); display: flex; align-items: center; gap: 10px; cursor: pointer; transition: background 0.15s; user-select: none; }
  .gh-deepdive-header:hover { background: var(--bg2); }
  .gh-deepdive-title { font-size: 14px; font-weight: 600; color: var(--text); flex: 1; }
  .gh-deepdive-badge { font-family: var(--font-mono); font-size: 10px; padding: 2px 8px; background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.2); color: var(--accent2); border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  .gh-deepdive-chevron { color: var(--text3); font-size: 12px; transition: transform 0.2s; }
  .gh-deepdive-chevron.open { transform: rotate(180deg); }
  .gh-deepdive-body { padding: 20px; background: var(--bg2); border-top: 1px solid var(--border); font-size: 14px; color: var(--text2); line-height: 1.7; }
  .gh-deepdive-body p { margin-bottom: 12px; }
  .gh-deepdive-body p:last-child { margin-bottom: 0; }

  @keyframes fadeSlide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  .fade-in-section { opacity: 0; transform: translateY(20px); transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
  .fade-in-section.is-visible { opacity: 1; transform: translateY(0); }

  /* ═══════════════════════════════════════════════════
     FORK vs BRANCH diagram
  ═══════════════════════════════════════════════════ */
  .fork-wrap { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin: 24px 0; }
  .fork-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
  .fork-header-title { font-family: var(--font-mono); font-size: 13px; font-weight: 600; }
  .fork-tabs { display: flex; gap: 4px; }
  .fork-tab { padding: 5px 14px; border-radius: 6px; border: 1px solid var(--border); background: var(--surface2); font-family: var(--font-mono); font-size: 11px; cursor: pointer; color: var(--text2); transition: all 0.15s; }
  .fork-tab.active { background: rgba(139,92,246,0.1); border-color: rgba(139,92,246,0.3); color: var(--accent2); }
  .fork-body { padding: 24px; }
  .fork-diagram { display: grid; grid-template-columns: 1fr 60px 1fr; gap: 0; align-items: center; margin: 16px 0; }
  @media (max-width: 600px) { .fork-diagram { grid-template-columns: 1fr; } }
  .fork-repo {
    border: 1px solid var(--border); border-radius: 12px; padding: 16px;
    background: var(--surface);
  }
  .fork-repo.origin { border-color: rgba(139,92,246,0.3); background: rgba(139,92,246,0.04); }
  .fork-repo.fork { border-color: rgba(59,130,246,0.3); background: rgba(59,130,246,0.04); }
  .fork-repo-title { font-family: var(--font-mono); font-size: 12px; font-weight: 700; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
  .fork-repo-branches { display: flex; flex-direction: column; gap: 6px; }
  .fork-branch { padding: 6px 10px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg2); font-family: var(--font-mono); font-size: 11px; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
  .fork-branch.main { border-color: rgba(5,150,105,0.3); background: rgba(5,150,105,0.05); }
  .fork-branch.feature { border-color: rgba(59,130,246,0.3); background: rgba(59,130,246,0.05); }
  .fork-branch.pr { border-color: rgba(139,92,246,0.3); background: rgba(139,92,246,0.05); }
  .fork-branch-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .fork-arrow { text-align: center; color: var(--text3); font-size: 22px; }
  .fork-pr-arrow {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 8px 12px; border-radius: 8px;
    background: rgba(139,92,246,0.08); border: 1px solid rgba(139,92,246,0.2);
    font-family: var(--font-mono); font-size: 10px; color: var(--accent2);
    cursor: pointer; transition: all 0.2s;
  }
  .fork-pr-arrow:hover { background: rgba(139,92,246,0.15); }
  .fork-steps { margin-top: 20px; display: flex; flex-direction: column; gap: 0; }
  .fork-step { display: flex; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .fork-step:last-child { border-bottom: none; }
  .fork-step-num { width: 24px; height: 24px; border-radius: 50%; background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.3); display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--accent2); flex-shrink: 0; margin-top: 2px; }
  .fork-step-content { flex: 1; }
  .fork-step-title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
  .fork-step-desc { font-size: 13px; color: var(--text2); line-height: 1.5; }
  .fork-step-cmd { font-family: var(--font-mono); font-size: 11px; color: var(--accent); margin-top: 4px; }

  /* ═══════════════════════════════════════════════════
     PULL REQUEST SIMULATOR
  ═══════════════════════════════════════════════════ */
  .pr-wrap { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin: 24px 0; }
  /* PR Header bar */
  .pr-topbar { background: var(--surface); border-bottom: 1px solid var(--border); padding: 14px 20px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .pr-topbar-title { font-family: var(--font-mono); font-size: 13px; font-weight: 600; flex: 1; }
  .pr-status-badge { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: var(--font-mono); font-weight: 700; letter-spacing: 0.5px; }
  .pr-status-badge.open { background: rgba(5,150,105,0.1); color: var(--green); border: 1px solid rgba(5,150,105,0.3); }
  .pr-status-badge.merged { background: rgba(139,92,246,0.1); color: var(--accent2); border: 1px solid rgba(139,92,246,0.3); }
  .pr-status-badge.closed { background: rgba(220,38,38,0.1); color: var(--red); border: 1px solid rgba(220,38,38,0.3); }
  /* PR body layout */
  .pr-body { display: grid; grid-template-columns: 1fr 260px; gap: 0; }
  @media (max-width: 720px) { .pr-body { grid-template-columns: 1fr; } }
  .pr-main { border-right: 1px solid var(--border); }
  /* PR tabs */
  .pr-tabs { display: flex; border-bottom: 1px solid var(--border); background: var(--surface); }
  .pr-tab { padding: 10px 18px; font-family: var(--font-mono); font-size: 12px; cursor: pointer; color: var(--text3); border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.15s; display: flex; align-items: center; gap: 6px; }
  .pr-tab:hover { color: var(--text); }
  .pr-tab.active { color: var(--text); border-bottom-color: var(--accent2); }
  .pr-tab-count { background: var(--bg3); border-radius: 10px; padding: 1px 7px; font-size: 10px; color: var(--text3); }
  /* Conversation tab */
  .pr-conv { padding: 20px; }
  .pr-description { padding: 16px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); margin-bottom: 16px; }
  .pr-desc-author { font-family: var(--font-mono); font-size: 11px; color: var(--text3); margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
  .pr-avatar { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: white; flex-shrink: 0; }
  .pr-desc-body { font-size: 13px; color: var(--text2); line-height: 1.6; }
  .pr-desc-body ul { padding-left: 18px; margin: 8px 0; }
  .pr-desc-body li { margin-bottom: 4px; }
  /* Review comments */
  .pr-comment { border: 1px solid var(--border); border-radius: 10px; margin-bottom: 12px; overflow: hidden; }
  .pr-comment-header { padding: 10px 14px; background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text2); }
  .pr-comment.approved .pr-comment-header { background: rgba(5,150,105,0.05); border-bottom-color: rgba(5,150,105,0.2); }
  .pr-comment.changes .pr-comment-header { background: rgba(220,38,38,0.05); border-bottom-color: rgba(220,38,38,0.2); }
  .pr-comment.inline { }
  .pr-comment-body { padding: 12px 14px; font-size: 13px; color: var(--text2); line-height: 1.6; }
  .pr-comment-diff { background: #0d1117; border-radius: 6px; padding: 10px 12px; font-family: var(--font-mono); font-size: 11px; margin-bottom: 10px; }
  .pr-comment-diff .add { color: #7dcf85; }
  .pr-comment-diff .del { color: #f87171; }
  .pr-comment-diff .neu { color: #6e7681; }
  /* Reply box */
  .pr-reply-box { padding: 12px 14px; border-top: 1px solid var(--border); background: var(--bg2); }
  .pr-reply-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px; background: var(--surface); font-family: var(--font-body); font-size: 13px; color: var(--text); outline: none; resize: none; transition: border-color 0.2s; }
  .pr-reply-input:focus { border-color: var(--accent2); }
  .pr-reply-actions { display: flex; gap: 8px; margin-top: 8px; justify-content: flex-end; }
  .pr-btn { padding: 6px 14px; border-radius: 6px; border: 1px solid var(--border); font-family: var(--font-body); font-size: 12px; cursor: pointer; transition: all 0.15s; }
  .pr-btn-primary { background: var(--accent2); color: white; border-color: var(--accent2); }
  .pr-btn-primary:hover { opacity: 0.9; }
  .pr-btn-ghost { background: none; color: var(--text2); }
  .pr-btn-ghost:hover { background: var(--bg2); }
  /* Files changed tab */
  .pr-files { }
  .pr-file-header { padding: 10px 16px; background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 12px; }
  .pr-file-name { color: var(--accent); font-weight: 600; flex: 1; }
  .pr-file-stat-add { color: var(--green); }
  .pr-file-stat-del { color: var(--red); }
  .pr-diff-table { width: 100%; border-collapse: collapse; font-family: var(--font-mono); font-size: 12px; }
  .pr-diff-row { border-bottom: 1px solid rgba(0,0,0,0.04); }
  .pr-diff-row.add { background: rgba(5,150,105,0.06); }
  .pr-diff-row.del { background: rgba(220,38,38,0.06); }
  .pr-diff-row.hunk { background: rgba(59,130,246,0.05); }
  .pr-diff-lineno { padding: 4px 10px; color: var(--text3); text-align: right; width: 36px; border-right: 1px solid var(--border); user-select: none; font-size: 10px; }
  .pr-diff-sign { padding: 4px 8px; width: 20px; font-weight: 700; }
  .pr-diff-row.add .pr-diff-sign { color: var(--green); }
  .pr-diff-row.del .pr-diff-sign { color: var(--red); }
  .pr-diff-row.hunk .pr-diff-sign { color: var(--accent); }
  .pr-diff-code { padding: 4px 12px; color: var(--text2); white-space: pre; }
  .pr-diff-row.add .pr-diff-code { color: var(--green); }
  .pr-diff-row.del .pr-diff-code { color: var(--red); }
  .pr-diff-row.hunk .pr-diff-code { color: var(--accent); font-style: italic; }
  /* Sidebar */
  .pr-sidebar { padding: 16px; }
  .pr-sidebar-section { margin-bottom: 20px; }
  .pr-sidebar-label { font-family: var(--font-mono); font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid var(--border); }
  .pr-reviewer { display: flex; align-items: center; gap: 8px; padding: 4px 0; font-size: 12px; color: var(--text2); }
  .pr-reviewer-status { font-size: 14px; }
  .pr-check { display: flex; align-items: center; gap: 8px; padding: 6px 0; font-size: 12px; border-bottom: 1px solid var(--border); }
  .pr-check:last-child { border-bottom: none; }
  .pr-check-icon { font-size: 14px; }
  .pr-check-name { flex: 1; color: var(--text2); }
  .pr-check-status { font-size: 11px; font-family: var(--font-mono); }
  .pr-merge-section { padding: 16px; border-top: 1px solid var(--border); }
  .pr-merge-btn { width: 100%; padding: 10px; border-radius: 8px; border: none; font-family: var(--font-body); font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .pr-merge-btn.ready { background: var(--green); color: white; }
  .pr-merge-btn.ready:hover { opacity: 0.9; }
  .pr-merge-btn.blocked { background: var(--bg3); color: var(--text3); cursor: not-allowed; }
  .pr-merge-blocked-reason { font-size: 11px; color: var(--text3); text-align: center; margin-top: 6px; font-family: var(--font-mono); }
  /* Add comment interaction */
  .pr-inline-comment-trigger { font-size: 11px; color: var(--accent2); cursor: pointer; margin-top: 6px; font-family: var(--font-mono); display: inline-block; }
  .pr-inline-comment-trigger:hover { text-decoration: underline; }
  .pr-new-comment { border: 1px solid rgba(139,92,246,0.3); border-radius: 8px; padding: 10px; background: rgba(139,92,246,0.04); margin-top: 8px; animation: fadeSlide 0.2s ease; }
  .pr-thread-resolved { padding: 8px 14px; background: rgba(5,150,105,0.05); border-top: 1px solid var(--border); font-size: 12px; color: var(--green); font-family: var(--font-mono); cursor: pointer; }
  .pr-thread-resolved:hover { background: rgba(5,150,105,0.1); }

  /* ═══════════════════════════════════════════════════
     ACTIONS BUILDER
  ═══════════════════════════════════════════════════ */
  .actions-wrap { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin: 24px 0; }
  .actions-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  .actions-header-title { font-family: var(--font-mono); font-size: 13px; font-weight: 600; }
  .actions-body { display: grid; grid-template-columns: 280px 1fr; gap: 0; }
  @media (max-width: 680px) { .actions-body { grid-template-columns: 1fr; } }
  .actions-left { border-right: 1px solid var(--border); padding: 16px; }
  .actions-right { padding: 0; }
  .actions-section-title { font-family: var(--font-mono); font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
  /* Trigger selector */
  .actions-trigger-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .actions-trigger { padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); font-family: var(--font-mono); font-size: 12px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 8px; color: var(--text2); }
  .actions-trigger:hover { background: var(--bg2); }
  .actions-trigger.active { background: rgba(139,92,246,0.08); border-color: rgba(139,92,246,0.3); color: var(--accent2); }
  .actions-trigger-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
  /* Steps builder */
  .actions-steps { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .actions-step-item { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); font-family: var(--font-mono); font-size: 12px; cursor: grab; transition: all 0.15s; }
  .actions-step-item:hover { background: var(--bg2); }
  .actions-step-item .drag-handle { color: var(--text3); cursor: grab; }
  .actions-step-remove { margin-left: auto; color: var(--text3); cursor: pointer; font-size: 14px; line-height: 1; }
  .actions-step-remove:hover { color: var(--red); }
  .actions-add-step { width: 100%; padding: 8px; border-radius: 8px; border: 1px dashed var(--border); background: none; font-family: var(--font-mono); font-size: 12px; color: var(--text3); cursor: pointer; transition: all 0.15s; }
  .actions-add-step:hover { border-color: var(--accent2); color: var(--accent2); }
  /* YAML preview */
  .actions-yaml { background: #0d1117; height: 100%; min-height: 320px; padding: 16px; font-family: var(--font-mono); font-size: 12px; line-height: 1.8; overflow-y: auto; }
  .yaml-key { color: #79c0ff; }
  .yaml-val { color: #a5d6ff; }
  .yaml-str { color: #a8ff78; }
  .yaml-comment { color: #6e7681; font-style: italic; }
  .yaml-trigger { color: #f2cc60; }
  .yaml-step { color: #ffa657; }
  /* Run simulation */
  .actions-run-bar { padding: 12px 16px; border-top: 1px solid var(--border); background: var(--surface); display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .actions-run-btn { padding: 8px 20px; border-radius: 8px; background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.3); color: var(--accent2); font-family: var(--font-mono); font-size: 12px; cursor: pointer; transition: all 0.15s; font-weight: 600; }
  .actions-run-btn:hover { background: rgba(139,92,246,0.2); }
  .actions-run-log { flex: 1; font-family: var(--font-mono); font-size: 11px; color: var(--text3); }
  .actions-run-step { display: flex; align-items: center; gap: 8px; padding: 3px 0; }
  .actions-run-step .spin { display: inline-block; animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ═══════════════════════════════════════════════════
     BRANCH PROTECTION BUILDER
  ═══════════════════════════════════════════════════ */
  .bp-wrap { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin: 24px 0; }
  .bp-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
  .bp-header-title { font-family: var(--font-mono); font-size: 13px; font-weight: 600; }
  .bp-body { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
  @media (max-width: 640px) { .bp-body { grid-template-columns: 1fr; } }
  .bp-left { padding: 20px; border-right: 1px solid var(--border); }
  .bp-right { padding: 20px; }
  .bp-rule-group { margin-bottom: 24px; }
  .bp-rule-group-title { font-family: var(--font-mono); font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
  .bp-rule {
    display: flex; align-items: flex-start; gap: 12px; padding: 10px 0;
    border-bottom: 1px solid var(--border); cursor: pointer;
  }
  .bp-rule:last-child { border-bottom: none; }
  .bp-rule-toggle { width: 36px; height: 20px; border-radius: 10px; border: none; cursor: pointer; position: relative; flex-shrink: 0; transition: background 0.2s; margin-top: 2px; }
  .bp-rule-toggle.on { background: var(--green); }
  .bp-rule-toggle.off { background: var(--border2); }
  .bp-rule-toggle::after { content: ''; position: absolute; width: 14px; height: 14px; border-radius: 50%; background: white; top: 3px; transition: left 0.2s; }
  .bp-rule-toggle.on::after { left: 19px; }
  .bp-rule-toggle.off::after { left: 3px; }
  .bp-rule-content { flex: 1; }
  .bp-rule-name { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 2px; }
  .bp-rule-desc { font-size: 12px; color: var(--text3); line-height: 1.4; }
  /* Impact panel */
  .bp-impact { display: flex; flex-direction: column; gap: 10px; }
  .bp-impact-title { font-family: var(--font-mono); font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .bp-scenario { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
  .bp-scenario-header { padding: 10px 14px; background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--text); }
  .bp-scenario-body { padding: 12px 14px; font-size: 13px; color: var(--text2); line-height: 1.5; }
  .bp-scenario-result { margin-top: 8px; padding: 8px 10px; border-radius: 6px; font-family: var(--font-mono); font-size: 12px; }
  .bp-scenario-result.allow { background: rgba(5,150,105,0.08); color: var(--green); border: 1px solid rgba(5,150,105,0.2); }
  .bp-scenario-result.block { background: rgba(220,38,38,0.08); color: var(--red); border: 1px solid rgba(220,38,38,0.2); }
  .bp-security-score { margin-top: 16px; padding: 14px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); }
  .bp-score-label { font-family: var(--font-mono); font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
  .bp-score-bar { height: 8px; border-radius: 4px; background: var(--bg3); overflow: hidden; margin-bottom: 6px; }
  .bp-score-fill { height: 100%; border-radius: 4px; transition: width 0.5s, background 0.5s; }
  .bp-score-val { font-family: var(--font-display); font-size: 20px; font-weight: 800; }
`;

// ─── SMALL REUSABLES ─────────────────────────────────────────────────────────
function CodeBlock({ title, lang, children }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="gh-code">
      <div className="gh-code-header">
        <span className="gh-code-dot" style={{ background: '#ff5f57' }} />
        <span className="gh-code-dot" style={{ background: '#ffbd2e' }} />
        <span className="gh-code-dot" style={{ background: '#28c840' }} />
        {title && <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text3)' }}>{title}</span>}
        <span className="gh-code-lang">{lang}</span>
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
    <div className={`gh-callout ${type}`}>
      {title && <div className="gh-callout-title">{{ info: 'ⓘ', warn: '⚠', danger: '⛔', success: '✓' }[type]} {title}</div>}
      <div>{children}</div>
    </div>
  );
}

function DeepDive({ title, badge = 'internals', children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="gh-deepdive">
      <div className="gh-deepdive-header" onClick={() => setOpen(o => !o)}>
        <span style={{ fontSize: 14, color: 'var(--accent2)' }}>⬡</span>
        <span className="gh-deepdive-title">{title}</span>
        <span className="gh-deepdive-badge">{badge}</span>
        <span className={`gh-deepdive-chevron ${open ? 'open' : ''}`}>▼</span>
      </div>
      {open && <div className="gh-deepdive-body">{children}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FORK vs BRANCH VISUALIZER
// ═══════════════════════════════════════════════════════════════════════════════
const FORK_STEPS = [
  { title: 'Fork the repo', desc: 'Click "Fork" on GitHub. GitHub creates an identical copy of the repo under your account. You now have write access to your copy.', cmd: '# Done via GitHub UI — no CLI command needed' },
  { title: 'Clone your fork', desc: 'Clone YOUR fork (not the original) to your machine. Your fork is "origin"; the original is "upstream".', cmd: 'git clone git@github.com:YOUR_USER/repo.git\ngit remote add upstream git@github.com:ORG/repo.git' },
  { title: 'Create a feature branch', desc: 'Work on a branch in your fork, just like normal development. Never commit directly to main.', cmd: 'git checkout -b feat/my-contribution' },
  { title: 'Push to your fork', desc: 'Push your branch to your fork on GitHub ("origin"). The upstream repo remains untouched.', cmd: 'git push origin feat/my-contribution' },
  { title: 'Open a cross-repo PR', desc: 'On GitHub, open a PR from your fork\'s branch to the upstream repo\'s main. Maintainers review and merge without giving you write access to the original.', cmd: '# GitHub UI: "Compare & pull request"\n# base: upstream/main ← compare: yourfork/feat/my-contribution' },
  { title: 'Sync with upstream', desc: 'While waiting for review, pull in upstream changes so your branch stays current.', cmd: 'git fetch upstream\ngit rebase upstream/main' },
];

function ForkVisualizer() {
  const [mode, setMode] = useState('fork'); // 'fork' | 'branch'
  const [step, setStep] = useState(0);

  return (
    <div className="fork-wrap">
      <div className="fork-header">
        <div className="fork-header-title">Fork vs Branch — choose your scenario</div>
        <div className="fork-tabs">
          <button className={`fork-tab ${mode === 'branch' ? 'active' : ''}`} onClick={() => setMode('branch')}>Team branch</button>
          <button className={`fork-tab ${mode === 'fork' ? 'active' : ''}`} onClick={() => setMode('fork')}>OSS fork</button>
        </div>
      </div>

      <div className="fork-body">
        {mode === 'branch' ? (
          <>
            <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 16, lineHeight: 1.6 }}>
              You have <strong style={{ color: 'var(--text)' }}>write access</strong> to the company repo. You create a branch directly in it, push, and open a PR. Simpler, but everyone shares one namespace.
            </div>
            <div className="fork-diagram">
              <div className="fork-repo origin">
                <div className="fork-repo-title"><span style={{ color: 'var(--accent2)' }}>⬡</span> company/repo</div>
                <div className="fork-repo-branches">
                  <div className="fork-branch main"><span className="fork-branch-dot" style={{ background: 'var(--green)' }} />main</div>
                  <div className="fork-branch feature"><span className="fork-branch-dot" style={{ background: 'var(--accent)' }} />feat/auth-refactor</div>
                  <div className="fork-branch feature"><span className="fork-branch-dot" style={{ background: 'var(--accent)' }} />fix/login-bug</div>
                  <div className="fork-branch pr"><span className="fork-branch-dot" style={{ background: 'var(--accent2)' }} />alice/dashboard-v2</div>
                </div>
              </div>
              <div className="fork-arrow">↔</div>
              <div className="fork-repo">
                <div className="fork-repo-title">Your local clone</div>
                <div className="fork-repo-branches">
                  <div className="fork-branch main"><span className="fork-branch-dot" style={{ background: 'var(--green)' }} />main (tracks origin/main)</div>
                  <div className="fork-branch feature"><span className="fork-branch-dot" style={{ background: 'var(--accent)' }} />feat/auth-refactor</div>
                </div>
                <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
                  origin → company/repo<br />
                  (one remote only)
                </div>
              </div>
            </div>
            <Callout type="info" title="When to use branches">
              <p>Use branches when you have write access to the repo. This is the standard for team development at companies — everyone works on the same repository, visibility is shared, and you don't need to sync multiple remotes.</p>
            </Callout>
          </>
        ) : (
          <>
            <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 16, lineHeight: 1.6 }}>
              You have <strong style={{ color: 'var(--text)' }}>no write access</strong> to the OSS repo. You fork it, work in your copy, and open a PR across repositories. Maintainers control what enters their codebase.
            </div>
            <div className="fork-diagram">
              <div className="fork-repo origin">
                <div className="fork-repo-title"><span style={{ color: 'var(--accent2)' }}>⬡</span> facebook/react (upstream)</div>
                <div className="fork-repo-branches">
                  <div className="fork-branch main"><span className="fork-branch-dot" style={{ background: 'var(--green)' }} />main</div>
                  <div className="fork-branch main"><span className="fork-branch-dot" style={{ background: 'var(--yellow)' }} />0.x-dev</div>
                </div>
                <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>🔒 You cannot push here</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div className="fork-pr-arrow" title="PR goes this direction">
                  <span style={{ fontSize: 18 }}>↑</span>
                  <span>PR</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>fork ↓</div>
              </div>
              <div className="fork-repo fork">
                <div className="fork-repo-title"><span style={{ color: 'var(--accent)' }}>⬡</span> yourname/react (fork)</div>
                <div className="fork-repo-branches">
                  <div className="fork-branch main"><span className="fork-branch-dot" style={{ background: 'var(--green)' }} />main (mirrors upstream)</div>
                  <div className="fork-branch feature"><span className="fork-branch-dot" style={{ background: 'var(--accent)' }} />fix/concurrent-mode-bug</div>
                </div>
                <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>✓ You have full write access</div>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 13, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>
                Step-by-step OSS contribution workflow — click to expand each step:
              </div>
              <div className="fork-steps">
                {FORK_STEPS.map((s, i) => (
                  <div key={i} className="fork-step" onClick={() => setStep(step === i ? -1 : i)} style={{ cursor: 'pointer' }}>
                    <div className="fork-step-num">{i + 1}</div>
                    <div className="fork-step-content">
                      <div className="fork-step-title">{s.title}</div>
                      {step === i && (
                        <div style={{ animation: 'fadeSlide 0.2s ease' }}>
                          <div className="fork-step-desc">{s.desc}</div>
                          <div className="fork-step-cmd">{s.cmd.split('\n').map((l, j) => <div key={j}>{l}</div>)}</div>
                        </div>
                      )}
                    </div>
                    <div style={{ color: 'var(--text3)', fontSize: 12 }}>{step === i ? '▼' : '▶'}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PULL REQUEST SIMULATOR
// Teaches: PR anatomy, review flow, CI checks, merge conditions
// ═══════════════════════════════════════════════════════════════════════════════
const PR_DIFF = [
  { type: 'hunk', old: null, new: null, code: '@@ -12,7 +12,14 @@ function validateToken(token) {' },
  { type: 'del', old: 12, new: null, code: '  return jwt.verify(token, SECRET);' },
  { type: 'add', old: null, new: 12, code: '  try {' },
  { type: 'add', old: null, new: 13, code: '    const payload = jwt.verify(token, SECRET);' },
  { type: 'add', old: null, new: 14, code: '    if (!payload.userId) throw new Error("Missing userId");' },
  { type: 'add', old: null, new: 15, code: '    return payload;' },
  { type: 'add', old: null, new: 16, code: '  } catch (err) {' },
  { type: 'add', old: null, new: 17, code: '    logger.warn("Token validation failed", { err });' },
  { type: 'add', old: null, new: 18, code: '    throw new Error("Invalid token");' },
  { type: 'add', old: null, new: 19, code: '  }' },
  { type: '', old: 13, new: 20, code: '}' },
  { type: 'hunk', old: null, new: null, code: '@@ -28,3 +35,7 @@ module.exports = { generateToken };' },
  { type: 'add', old: null, new: 35, code: '' },
  { type: 'add', old: null, new: 36, code: 'module.exports.validateToken = validateToken;' },
];

const INITIAL_CHECKS = [
  { name: 'ci/test', status: 'running', label: 'Unit tests' },
  { name: 'ci/lint', status: 'running', label: 'ESLint' },
  { name: 'ci/build', status: 'running', label: 'Build check' },
  { name: 'security/snyk', status: 'running', label: 'Snyk scan' },
];

const INITIAL_REVIEWERS = [
  { name: 'alice', status: 'changes', avatar: '#3b82f6' },
  { name: 'carol', status: 'pending', avatar: '#8b5cf6' },
];

const INITIAL_COMMENTS = [
  {
    id: 1, type: 'inline', author: 'alice', avatar: '#3b82f6', status: 'changes',
    file: 'src/auth.js', line: 17,
    diff: [
      { t: 'neu', c: '  } catch (err) {' },
      { t: 'add', c: '+   logger.warn("Token validation failed", { err });' },
    ],
    body: 'Should we also log the token hash (not the full token!) here for traceability? Might help debugging in prod.',
    replies: [],
    resolved: false,
  },
  {
    id: 2, type: 'review', author: 'carol', avatar: '#8b5cf6', status: 'approved',
    body: 'Great catch wrapping this in try/catch. The error message is much cleaner now. Approved — just one minor question from Alice to address first.',
    replies: [],
    resolved: false,
  },
];

function PullRequestSimulator() {
  const [activeTab, setActiveTab] = useState('conversation');
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [checks, setChecks] = useState(INITIAL_CHECKS);
  const [reviewers, setReviewers] = useState(INITIAL_REVIEWERS);
  const [replyText, setReplyText] = useState({});
  const [merged, setMerged] = useState(false);
  const [prStatus, setPrStatus] = useState('open');
  const [addingComment, setAddingComment] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [mergeMethod, setMergeMethod] = useState('merge');

  // Simulate CI running
  useEffect(() => {
    const timers = [
      setTimeout(() => setChecks(c => c.map(x => x.name === 'ci/lint' ? { ...x, status: 'pass' } : x)), 1200),
      setTimeout(() => setChecks(c => c.map(x => x.name === 'ci/build' ? { ...x, status: 'pass' } : x)), 2100),
      setTimeout(() => setChecks(c => c.map(x => x.name === 'ci/test' ? { ...x, status: 'pass' } : x)), 3200),
      setTimeout(() => setChecks(c => c.map(x => x.name === 'security/snyk' ? { ...x, status: 'pass' } : x)), 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const allChecksPassed = checks.every(c => c.status === 'pass');
  const hasApproval = reviewers.some(r => r.status === 'approved');
  const hasChangesReq = reviewers.some(r => r.status === 'changes');
  const unresolvedThreads = comments.filter(c => c.type === 'inline' && !c.resolved).length;
  const canMerge = allChecksPassed && hasApproval && !hasChangesReq && unresolvedThreads === 0;

  const approve = (name) => {
    setReviewers(r => r.map(x => x.name === name ? { ...x, status: 'approved' } : x));
    setComments(c => [...c, {
      id: Date.now(), type: 'review', author: name, avatar: name === 'alice' ? '#3b82f6' : '#8b5cf6',
      status: 'approved', body: 'LGTM! Thanks for the fix.', replies: [], resolved: false,
    }]);
  };

  const addReply = (id, text) => {
    if (!text.trim()) return;
    setComments(c => c.map(x => x.id === id ? { ...x, replies: [...x.replies, { author: 'you', text, avatar: '#059669' }] } : x));
    setReplyText(t => ({ ...t, [id]: '' }));
  };

  const resolveThread = (id) => {
    setComments(c => c.map(x => x.id === id ? { ...x, resolved: true } : x));
  };

  const doMerge = () => {
    if (!canMerge) return;
    setMerged(true);
    setPrStatus('merged');
  };

  const checkIcon = (s) => ({ running: '⟳', pass: '✓', fail: '✗' }[s] || '?');
  const checkColor = (s) => ({ running: 'var(--yellow)', pass: 'var(--green)', fail: 'var(--red)' }[s]);

  return (
    <div className="pr-wrap">
      <div className="pr-topbar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div className="pr-topbar-title">feat: wrap validateToken in try/catch with proper error logging <span style={{ color: 'var(--text3)', fontWeight: 400 }}>#247</span></div>
          <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
            bob wants to merge <code style={{ color: 'var(--accent)' }}>feat/auth-error-handling</code> → <code style={{ color: 'var(--green)' }}>main</code>
          </div>
        </div>
        <span className={`pr-status-badge ${prStatus}`}>
          {{ open: '⬤ Open', merged: '⬡ Merged', closed: '✗ Closed' }[prStatus]}
        </span>
      </div>

      {merged ? (
        <div style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⬡</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--accent2)', marginBottom: 8 }}>Pull request merged!</div>
          <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 16 }}>
            feat/auth-error-handling was merged into main via <strong style={{ color: 'var(--text)' }}>{mergeMethod === 'merge' ? 'merge commit' : mergeMethod === 'squash' ? 'squash and merge' : 'rebase'}</strong>.
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Delete branch (recommended)', icon: '🗑', action: () => {} },
              { label: 'Restore branch', icon: '↩', action: () => {} },
            ].map(b => (
              <button key={b.label} className="pr-btn pr-btn-ghost" style={{ border: '1px solid var(--border)', padding: '8px 16px' }} onClick={b.action}>{b.icon} {b.label}</button>
            ))}
          </div>
          <div style={{ marginTop: 24, padding: 14, background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--border)', maxWidth: 480, margin: '24px auto 0', textAlign: 'left', fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text)' }}>What just happened:</strong> The 3 commits on feat/auth-error-handling were folded into main. The branch ref is now stale — delete it to keep the repo tidy. The commits are permanently part of main's history.
          </div>
        </div>
      ) : (
        <div className="pr-body">
          <div className="pr-main">
            <div className="pr-tabs">
              {[
                { id: 'conversation', label: 'Conversation', count: comments.length },
                { id: 'commits', label: 'Commits', count: 3 },
                { id: 'files', label: 'Files changed', count: 1 },
              ].map(t => (
                <button key={t.id} className={`pr-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                  {t.label} <span className="pr-tab-count">{t.count}</span>
                </button>
              ))}
            </div>

            {activeTab === 'conversation' && (
              <div className="pr-conv">
                {/* Description */}
                <div className="pr-description">
                  <div className="pr-desc-author">
                    <div className="pr-avatar" style={{ background: '#d97706' }}>B</div>
                    <span>bob</span>
                    <span style={{ marginLeft: 'auto' }}>2 hours ago</span>
                  </div>
                  <div className="pr-desc-body">
                    <p><strong>Why:</strong> The <code>validateToken</code> function was throwing unhandled exceptions that crashed the request middleware. This wraps it in try/catch with proper logging.</p>
                    <p><strong>What changed:</strong></p>
                    <ul>
                      <li>Wrapped jwt.verify in try/catch</li>
                      <li>Added structured error logging via logger.warn</li>
                      <li>Exported validateToken (was previously internal only)</li>
                    </ul>
                    <p><strong>Testing:</strong> Added 4 new unit tests covering token expiry, malformed tokens, and missing userId claim.</p>
                  </div>
                </div>

                {/* Comments */}
                {comments.filter(c => !c.resolved || c.type === 'review').map(comment => (
                  <div key={comment.id} className={`pr-comment ${comment.status}`}>
                    <div className="pr-comment-header">
                      <div className="pr-avatar" style={{ background: comment.avatar }}>
                        {comment.author[0].toUpperCase()}
                      </div>
                      <strong>{comment.author}</strong>
                      <span style={{ color: 'var(--text3)', fontSize: 11 }}>reviewed</span>
                      {comment.status === 'approved' && <span style={{ marginLeft: 4, color: 'var(--green)', fontSize: 12 }}>✓ Approved</span>}
                      {comment.status === 'changes' && <span style={{ marginLeft: 4, color: 'var(--red)', fontSize: 12 }}>✗ Requested changes</span>}
                      {comment.resolved && <span style={{ marginLeft: 'auto', color: 'var(--text3)', fontSize: 11 }}>resolved</span>}
                    </div>
                    <div className="pr-comment-body">
                      {comment.diff && (
                        <div className="pr-comment-diff">
                          {comment.diff.map((l, i) => (
                            <div key={i} className={l.t}>{l.c}</div>
                          ))}
                        </div>
                      )}
                      {comment.body}
                      {/* Replies */}
                      {comment.replies.map((r, i) => (
                        <div key={i} style={{ marginTop: 10, padding: '8px 10px', background: 'var(--bg2)', borderRadius: 6, borderLeft: '2px solid var(--border)', fontSize: 12 }}>
                          <span style={{ color: 'var(--green)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{r.author}</span>: {r.text}
                        </div>
                      ))}
                    </div>
                    {!comment.resolved && (
                      <div className="pr-reply-box">
                        <textarea
                          className="pr-reply-input"
                          rows={2}
                          placeholder="Reply to this review comment…"
                          value={replyText[comment.id] || ''}
                          onChange={e => setReplyText(t => ({ ...t, [comment.id]: e.target.value }))}
                        />
                        <div className="pr-reply-actions">
                          {comment.type === 'inline' && (
                            <button className="pr-btn" style={{ background: 'rgba(5,150,105,0.08)', borderColor: 'rgba(5,150,105,0.3)', color: 'var(--green)', fontSize: 12 }}
                              onClick={() => { addReply(comment.id, replyText[comment.id] || 'Done — added token hash logging.'); resolveThread(comment.id); }}>
                              Reply & Resolve
                            </button>
                          )}
                          <button className="pr-btn pr-btn-primary" onClick={() => addReply(comment.id, replyText[comment.id] || 'Thanks for the feedback!')}>
                            Reply
                          </button>
                        </div>
                      </div>
                    )}
                    {!comment.resolved && comment.type === 'inline' && (
                      <div className="pr-thread-resolved" onClick={() => resolveThread(comment.id)}>
                        ✓ Mark as resolved
                      </div>
                    )}
                  </div>
                ))}

                {/* Review prompt */}
                {!hasApproval && (
                  <div style={{ padding: 14, border: '1px dashed var(--border)', borderRadius: 10, textAlign: 'center', marginTop: 12 }}>
                    <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 10 }}>Act as a reviewer and approve this PR:</div>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                      {reviewers.filter(r => r.status === 'pending').map(r => (
                        <button key={r.name} className="pr-btn" style={{ background: 'rgba(5,150,105,0.08)', borderColor: 'rgba(5,150,105,0.3)', color: 'var(--green)' }}
                          onClick={() => approve(r.name)}>
                          ✓ Approve as {r.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'commits' && (
              <div style={{ padding: 20 }}>
                {[
                  { hash: 'a1b2c3d', msg: 'feat: wrap validateToken in try/catch', author: 'bob', date: '2h ago' },
                  { hash: 'e4f5a6b', msg: 'feat: add structured error logging', author: 'bob', date: '2h ago' },
                  { hash: 'c7d8e9f', msg: 'test: add validateToken unit tests', author: 'bob', date: '1h ago' },
                ].map(c => (
                  <div key={c.hash} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent2)', width: 60 }}>{c.hash}</div>
                    <div style={{ flex: 1, fontSize: 13, color: 'var(--text)' }}>{c.msg}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{c.author} · {c.date}</div>
                  </div>
                ))}
                <div style={{ marginTop: 16, padding: 12, background: 'var(--bg2)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--text)' }}>3 commits</strong> will be added to main's history. If you squash-merge, they become 1 commit. If you rebase-merge, each commit is individually replayed on main with a new hash.
                </div>
              </div>
            )}

            {activeTab === 'files' && (
              <div className="pr-files">
                <div className="pr-file-header">
                  <span className="pr-file-name">src/auth.js</span>
                  <span className="pr-file-stat-add">+8</span>
                  <span className="pr-file-stat-del">-1</span>
                </div>
                <table className="pr-diff-table">
                  <tbody>
                    {PR_DIFF.map((row, i) => (
                      <tr key={i} className={`pr-diff-row ${row.type}`}>
                        <td className="pr-diff-lineno">{row.old || ''}</td>
                        <td className="pr-diff-lineno">{row.new || ''}</td>
                        <td className="pr-diff-sign">
                          {row.type === 'add' ? '+' : row.type === 'del' ? '-' : row.type === 'hunk' ? '@@' : ''}
                        </td>
                        <td className="pr-diff-code">{row.code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="pr-sidebar">
              {/* Reviewers */}
              <div className="pr-sidebar-section">
                <div className="pr-sidebar-label">Reviewers</div>
                {reviewers.map(r => (
                  <div key={r.name} className="pr-reviewer">
                    <div className="pr-avatar" style={{ background: r.avatar, width: 20, height: 20, fontSize: 9 }}>{r.name[0].toUpperCase()}</div>
                    <span style={{ flex: 1 }}>{r.name}</span>
                    <span className="pr-reviewer-status">
                      {r.status === 'approved' ? '✅' : r.status === 'changes' ? '❌' : '⏳'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Labels */}
              <div className="pr-sidebar-section">
                <div className="pr-sidebar-label">Labels</div>
                {['bug fix', 'auth', 'backend'].map(l => (
                  <span key={l} style={{ display: 'inline-block', margin: '0 4px 4px 0', padding: '2px 10px', borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)', fontSize: 11, color: 'var(--text2)' }}>{l}</span>
                ))}
              </div>

              {/* CI Checks */}
              <div className="pr-sidebar-section">
                <div className="pr-sidebar-label">Checks</div>
                {checks.map(c => (
                  <div key={c.name} className="pr-check">
                    <span className="pr-check-icon" style={{ color: checkColor(c.status), display: c.status === 'running' ? 'inline-block' : 'inline', animation: c.status === 'running' ? 'spin 1.2s linear infinite' : 'none' }}>
                      {checkIcon(c.status)}
                    </span>
                    <span className="pr-check-name">{c.label}</span>
                    <span className="pr-check-status" style={{ color: checkColor(c.status) }}>{c.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Merge section */}
            <div className="pr-merge-section">
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>MERGE METHOD</div>
                {['merge', 'squash', 'rebase'].map(m => (
                  <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', cursor: 'pointer', fontSize: 12, color: mergeMethod === m ? 'var(--text)' : 'var(--text2)' }}>
                    <input type="radio" name="merge" value={m} checked={mergeMethod === m} onChange={() => setMergeMethod(m)} style={{ accentColor: 'var(--accent2)' }} />
                    {m === 'merge' ? 'Create a merge commit' : m === 'squash' ? 'Squash and merge' : 'Rebase and merge'}
                  </label>
                ))}
              </div>

              {/* Blockers */}
              <div style={{ marginBottom: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {!allChecksPassed && <div style={{ fontSize: 11, color: 'var(--yellow)', fontFamily: 'var(--font-mono)' }}>⟳ Waiting for CI checks…</div>}
                {!hasApproval && <div style={{ fontSize: 11, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>✗ Needs at least 1 approval</div>}
                {unresolvedThreads > 0 && <div style={{ fontSize: 11, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>✗ {unresolvedThreads} unresolved thread{unresolvedThreads > 1 ? 's' : ''}</div>}
                {canMerge && <div style={{ fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>✓ All checks passed</div>}
              </div>

              <button className={`pr-merge-btn ${canMerge ? 'ready' : 'blocked'}`} onClick={doMerge} disabled={!canMerge}>
                {canMerge ? `⬡ ${mergeMethod === 'merge' ? 'Merge pull request' : mergeMethod === 'squash' ? 'Squash and merge' : 'Rebase and merge'}` : 'Merge blocked'}
              </button>
              {!canMerge && (
                <div className="pr-merge-blocked-reason">Resolve all blockers above to merge</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GITHUB ACTIONS BUILDER
// Teaches: triggers, jobs, steps, YAML structure
// ═══════════════════════════════════════════════════════════════════════════════
const AVAILABLE_STEPS = [
  { id: 'checkout', icon: '📥', label: 'actions/checkout', yaml: "- uses: actions/checkout@v4" },
  { id: 'node', icon: '⬡', label: 'Setup Node.js', yaml: "- uses: actions/setup-node@v4\n  with:\n    node-version: '20'" },
  { id: 'install', icon: '📦', label: 'npm ci', yaml: "- run: npm ci" },
  { id: 'lint', icon: '🔍', label: 'ESLint', yaml: "- run: npm run lint" },
  { id: 'test', icon: '🧪', label: 'Run tests', yaml: "- run: npm test" },
  { id: 'build', icon: '🏗', label: 'npm run build', yaml: "- run: npm run build" },
  { id: 'docker', icon: '🐳', label: 'Build Docker image', yaml: "- name: Build Docker\n  run: docker build -t myapp:${{ github.sha }} ." },
  { id: 'deploy', icon: '🚀', label: 'Deploy to Vercel', yaml: "- uses: amondnet/vercel-action@v25\n  with:\n    vercel-token: ${{ secrets.VERCEL_TOKEN }}" },
  { id: 'notify', icon: '💬', label: 'Slack notify', yaml: "- uses: slackapi/slack-github-action@v1\n  with:\n    channel-id: deployments" },
];

const TRIGGERS = [
  { id: 'push_main', label: 'push → main', yaml: "push:\n  branches: [main]" },
  { id: 'pr', label: 'pull_request', yaml: "pull_request:\n  branches: [main]" },
  { id: 'manual', label: 'workflow_dispatch', yaml: "workflow_dispatch:" },
  { id: 'schedule', label: 'schedule (nightly)', yaml: "schedule:\n  - cron: '0 2 * * *'" },
  { id: 'release', label: 'on release', yaml: "release:\n  types: [published]" },
];

const RUN_SEQUENCE = ['checkout', 'node', 'install', 'lint', 'test', 'build', 'docker', 'deploy', 'notify'];

function ActionsBuilder() {
  const [trigger, setTrigger] = useState('push_main');
  const [steps, setSteps] = useState(['checkout', 'node', 'install', 'test']);
  const [running, setRunning] = useState(false);
  const [runLog, setRunLog] = useState([]);
  const [runIdx, setRunIdx] = useState(-1);

  const addStep = (id) => {
    if (!steps.includes(id)) setSteps(s => [...s, id]);
  };
  const removeStep = (id) => setSteps(s => s.filter(x => x !== id));

  const triggerObj = TRIGGERS.find(t => t.id === trigger);
  const stepObjs = RUN_SEQUENCE.filter(id => steps.includes(id)).map(id => AVAILABLE_STEPS.find(s => s.id === id)).filter(Boolean);

  const runWorkflow = () => {
    setRunning(true); setRunLog([]); setRunIdx(0);
    const orderedSteps = RUN_SEQUENCE.filter(id => steps.includes(id));
    let i = 0;
    const tick = () => {
      if (i >= orderedSteps.length) {
        setRunLog(l => [...l, { status: 'done', msg: '✓ Workflow completed successfully' }]);
        setRunning(false); setRunIdx(-1);
        return;
      }
      const s = AVAILABLE_STEPS.find(x => x.id === orderedSteps[i]);
      setRunIdx(i);
      const duration = { test: 3200, lint: 1400, build: 2200, docker: 2800, deploy: 2000 }[orderedSteps[i]] || 800;
      setRunLog(l => [...l, { status: 'running', msg: `⟳ Running: ${s.label}` }]);
      setTimeout(() => {
        setRunLog(l => [...l.slice(0, -1), { status: 'pass', msg: `✓ ${s.label} (${(duration / 1000).toFixed(1)}s)` }]);
        i++;
        setTimeout(tick, 200);
      }, duration);
    };
    setTimeout(tick, 300);
  };

  const yaml = `name: CI/CD Pipeline

on:
  ${triggerObj?.yaml.split('\n').join('\n  ')}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
${stepObjs.map(s => s.yaml.split('\n').map(l => `      ${l}`).join('\n')).join('\n')}`;

  return (
    <div className="actions-wrap">
      <div className="actions-header">
        <div className="actions-header-title">.github/workflows/ci.yml — Visual Builder</div>
        <div style={{ fontSize: 12, color: 'var(--text3)' }}>Build a workflow and see the YAML update in real time</div>
      </div>
      <div className="actions-body">
        <div className="actions-left">
          <div className="actions-section-title">1. Trigger</div>
          <div className="actions-trigger-list">
            {TRIGGERS.map(t => (
              <button key={t.id} className={`actions-trigger ${trigger === t.id ? 'active' : ''}`} onClick={() => setTrigger(t.id)}>
                <span className="actions-trigger-dot" />
                {t.label}
              </button>
            ))}
          </div>
          <div className="actions-section-title">2. Steps (click to add)</div>
          <div style={{ display: 'flex', flex: 'wrap', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
            {AVAILABLE_STEPS.filter(s => !steps.includes(s.id)).map(s => (
              <button key={s.id} className="actions-trigger" style={{ fontSize: 11 }} onClick={() => addStep(s.id)}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
          {steps.length > 0 && (
            <>
              <div className="actions-section-title">Your pipeline</div>
              <div className="actions-steps">
                {stepObjs.map((s, i) => (
                  <div key={s.id} className="actions-step-item" style={runIdx === i ? { borderColor: 'var(--yellow)', background: 'rgba(217,119,6,0.06)' } : {}}>
                    <span>{s.icon}</span>
                    <span style={{ flex: 1, fontSize: 11 }}>{s.label}</span>
                    <span className="actions-step-remove" onClick={() => removeStep(s.id)}>×</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="actions-right">
          <div className="actions-yaml">
            <div className="yaml-comment"># Auto-generated from your selections above</div>
            {yaml.split('\n').map((line, i) => {
              const trimmed = line.trim();
              const indent = line.match(/^(\s*)/)?.[1] || '';
              if (trimmed.startsWith('#')) return <div key={i} className="yaml-comment">{line}</div>;
              if (trimmed.startsWith('name:')) return <div key={i}><span className="yaml-key">name</span><span style={{ color: 'var(--text3)' }}>: </span><span className="yaml-str">{trimmed.replace('name: ', '')}</span></div>;
              if (trimmed === 'on:') return <div key={i}><span className="yaml-trigger">on</span><span style={{ color: 'var(--text3)' }}>:</span></div>;
              if (trimmed.startsWith('push:') || trimmed.startsWith('pull_request:') || trimmed.startsWith('workflow_dispatch:') || trimmed.startsWith('schedule:') || trimmed.startsWith('release:')) return <div key={i}>{indent}<span className="yaml-trigger">{trimmed.split(':')[0]}</span>{trimmed.includes(':') ? <span style={{ color: 'var(--text3)' }}>:</span> : null}</div>;
              if (trimmed.startsWith('- uses:')) return <div key={i}>{indent}<span className="yaml-step">- uses</span><span style={{ color: 'var(--text3)' }}>: </span><span className="yaml-str">{trimmed.replace('- uses: ', '')}</span></div>;
              if (trimmed.startsWith('- run:')) return <div key={i}>{indent}<span className="yaml-step">- run</span><span style={{ color: 'var(--text3)' }}>: </span><span className="yaml-str">{trimmed.replace('- run: ', '')}</span></div>;
              if (trimmed.startsWith('-')) return <div key={i}>{indent}<span className="yaml-step">{trimmed}</span></div>;
              if (trimmed.includes(':')) {
                const [k, ...v] = trimmed.split(':');
                return <div key={i}>{indent}<span className="yaml-key">{k}</span><span style={{ color: 'var(--text3)' }}>:</span>{v.join(':') ? <span className="yaml-val">{v.join(':')}</span> : null}</div>;
              }
              return <div key={i} style={{ color: 'var(--text3)' }}>{line}</div>;
            })}
          </div>
        </div>
      </div>
      <div className="actions-run-bar">
        <button className="actions-run-btn" onClick={runWorkflow} disabled={running || steps.length === 0}>
          {running ? '⟳ Running…' : '▶ Simulate run'}
        </button>
        <div className="actions-run-log">
          {runLog.map((l, i) => (
            <div key={i} style={{ color: l.status === 'pass' ? 'var(--green)' : l.status === 'running' ? 'var(--yellow)' : 'var(--green)' }}>
              {l.msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BRANCH PROTECTION BUILDER
// Teaches: which rules do what and why, impact on real scenarios
// ═══════════════════════════════════════════════════════════════════════════════
const RULES_CONFIG = [
  {
    id: 'require_pr',
    name: 'Require pull request before merging',
    desc: 'No one can push directly to this branch. All changes must come via an approved PR.',
    weight: 25,
    group: 'Code Review',
  },
  {
    id: 'require_approvals',
    name: 'Require 1+ approving reviews',
    desc: 'A PR must have at least one approval from a reviewer before it can be merged.',
    weight: 20,
    group: 'Code Review',
  },
  {
    id: 'dismiss_stale',
    name: 'Dismiss stale reviews',
    desc: 'If new commits are pushed to a PR after it was approved, the approval is revoked automatically.',
    weight: 15,
    group: 'Code Review',
  },
  {
    id: 'require_ci',
    name: 'Require status checks to pass',
    desc: 'All required CI checks (tests, lint, build) must be green before merging is allowed.',
    weight: 20,
    group: 'CI/CD',
  },
  {
    id: 'require_uptodate',
    name: 'Require branch to be up to date',
    desc: 'The PR branch must include all commits from the target branch before merging.',
    weight: 10,
    group: 'CI/CD',
  },
  {
    id: 'no_bypass',
    name: 'Do not allow bypassing',
    desc: 'Even admins must follow these rules. No one is exempt — prevents "I\'ll just force-push this once" incidents.',
    weight: 10,
    group: 'Enforcement',
  },
];

const SCENARIOS = [
  {
    id: 'force_push',
    icon: '⛔',
    title: 'Direct force push to main',
    desc: 'A dev runs `git push --force origin main` to "fix" a mistake.',
    blocks: ['require_pr'],
  },
  {
    id: 'no_review',
    icon: '👁',
    title: 'Merge PR without review',
    desc: 'A dev opens a PR and immediately merges it themselves without any approvals.',
    blocks: ['require_approvals'],
  },
  {
    id: 'broken_ci',
    icon: '🔴',
    title: 'Merge with failing tests',
    desc: 'Someone tries to merge a PR where 3 unit tests are failing.',
    blocks: ['require_ci'],
  },
  {
    id: 'stale_approval',
    icon: '🔄',
    title: 'Sneak in code after approval',
    desc: 'A PR is approved. The author pushes 5 more commits then tries to merge.',
    blocks: ['dismiss_stale'],
  },
];

function BranchProtectionBuilder() {
  const [enabled, setEnabled] = useState({ require_pr: true, require_approvals: true, require_ci: true, no_bypass: false, dismiss_stale: false, require_uptodate: false });

  const toggle = (id) => setEnabled(e => ({ ...e, [id]: !e[id] }));

  const score = Object.entries(enabled).reduce((acc, [id, on]) => {
    if (!on) return acc;
    return acc + (RULES_CONFIG.find(r => r.id === id)?.weight || 0);
  }, 0);

  const scoreColor = score >= 80 ? 'var(--green)' : score >= 50 ? 'var(--yellow)' : 'var(--red)';
  const scoreLabel = score >= 80 ? 'Production-ready' : score >= 50 ? 'Partial protection' : 'Vulnerable';

  const groups = [...new Set(RULES_CONFIG.map(r => r.group))];

  return (
    <div className="bp-wrap">
      <div className="bp-header">
        <div className="bp-header-title">Branch Protection Rules — Settings: main</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)' }}>
          Settings → Branches → Branch protection rules → Edit
        </div>
      </div>
      <div className="bp-body">
        <div className="bp-left">
          {groups.map(group => (
            <div key={group} className="bp-rule-group">
              <div className="bp-rule-group-title">{group}</div>
              {RULES_CONFIG.filter(r => r.group === group).map(rule => (
                <div key={rule.id} className="bp-rule" onClick={() => toggle(rule.id)}>
                  <button
                    className={`bp-rule-toggle ${enabled[rule.id] ? 'on' : 'off'}`}
                    onClick={e => { e.stopPropagation(); toggle(rule.id); }}
                  />
                  <div className="bp-rule-content">
                    <div className="bp-rule-name">{rule.name}</div>
                    <div className="bp-rule-desc">{rule.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="bp-right">
          <div className="bp-impact-title">Security score</div>
          <div className="bp-security-score" style={{ marginBottom: 20 }}>
            <div className="bp-score-label">Protection level</div>
            <div className="bp-score-bar">
              <div className="bp-score-fill" style={{ width: `${score}%`, background: scoreColor }} />
            </div>
            <div className="bp-score-val" style={{ color: scoreColor }}>{score}/100</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{scoreLabel}</div>
          </div>

          <div className="bp-impact-title">Scenario outcomes</div>
          <div className="bp-impact">
            {SCENARIOS.map(sc => {
              const isBlocked = sc.blocks.some(r => enabled[r]);
              return (
                <div key={sc.id} className="bp-scenario">
                  <div className="bp-scenario-header">
                    {sc.icon} {sc.title}
                  </div>
                  <div className="bp-scenario-body">
                    {sc.desc}
                    <div className={`bp-scenario-result ${isBlocked ? 'block' : 'allow'}`}>
                      {isBlocked
                        ? `✗ BLOCKED — ${RULES_CONFIG.find(r => r.id === sc.blocks.find(b => enabled[b]))?.name}`
                        : '✓ ALLOWED — no rule prevents this'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function GithubFeatures() {
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
      <div className="gh-page">

        {/* ── HERO ── */}
        <div className="gh-hero">
          <div className="gh-hero-grid" />
          <div className="gh-hero-content">
            <div className="gh-badge"><span />Chapter 10</div>
            <h1 className="gh-hero-title">GitHub <em>Features</em></h1>
            <p className="gh-hero-sub">
              Git is the engine. GitHub is the platform — pull requests, Actions pipelines, branch protection, and the fork model that powers open source collaboration.
            </p>
            <div className="gh-hero-stats">
              <div className="gh-stat"><div className="gh-stat-num">PR</div><div className="gh-stat-label">Code review flow</div></div>
              <div className="gh-stat"><div className="gh-stat-num">CI/CD</div><div className="gh-stat-label">Actions pipelines</div></div>
              <div className="gh-stat"><div className="gh-stat-num">OSS</div><div className="gh-stat-label">Fork model</div></div>
              <div className="gh-stat"><div className="gh-stat-num">4</div><div className="gh-stat-label">Interactive demos</div></div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            SECTION 1: PULL REQUESTS
        ══════════════════════════════════════════════════ */}
        <section className="gh-section fade-in-section">
          <div className="gh-label">Collaboration</div>
          <h2 className="gh-title">Pull Requests — code review, not just a merge</h2>
          <p className="gh-desc">
            A PR is not a Git concept — it's a GitHub feature. It wraps a branch in a structured conversation: diff view, inline comments, CI status checks, approvals, and a merge button that only lights up when all conditions are met.
          </p>

          <p className="gh-body">
            The PR model enforces a specific discipline: <strong>no code lands on main without review and green CI.</strong> Every PR creates a record — the description, the diff, the review comments, and the approval history are stored permanently even after the branch is deleted. When a bug ships, you can find the exact PR that introduced it and see what reviewers said.
          </p>

          <p className="gh-body">
            Good PRs are <strong>small and focused</strong>. A 50-line PR gets reviewed in 5 minutes. A 1,500-line PR gets rubber-stamped because nobody has time to really read it — which defeats the entire purpose. Senior engineers think of PR size as a professional courtesy.
          </p>

          <PullRequestSimulator />

          <div className="gh-divider" />

          <h3 className="gh-sub">The PR lifecycle — what happens under the hood</h3>
          <p className="gh-body">
            When you open a PR, GitHub stores the base SHA (current tip of main) and the head SHA (tip of your branch). The diff you see is computed between those two points. If main moves forward, GitHub can detect that your branch is out of date — which is why the "branch must be up to date" protection rule exists.
          </p>

          <CodeBlock lang="bash" title="Creating a PR from the terminal (GitHub CLI)">
{`# Install GitHub CLI: https://cli.github.com
gh pr create \
  --title "feat: wrap validateToken in try/catch" \
  --body "Fixes #234. Adds proper error handling and logging." \
  --base main \
  --head feat/auth-error-handling \
  --reviewer alice,carol \
  --label "bug fix,auth"

# List open PRs
gh pr list

# Check out a PR locally (to test it before approving)
gh pr checkout 247

# Approve and merge in one step
gh pr review 247 --approve
gh pr merge 247 --squash --delete-branch`}
          </CodeBlock>

          <DeepDive title="How GitHub stores PR data — it's a Git ref" badge="internals">
            <p>PRs are stored as special Git refs inside the repository. When you push a PR, GitHub creates a ref at <code>refs/pull/247/head</code> pointing to your branch's tip, and <code>refs/pull/247/merge</code> pointing to a tentative merge commit. This is why you can <code>git fetch origin refs/pull/247/head:pr-247</code> to check out any PR locally without using the GitHub CLI — the data is plain Git.</p>
            <p>This also means deleted branches don't lose their PR history — GitHub retains the <code>refs/pull/*</code> refs even after the source branch is gone. The commits remain accessible through those refs until GitHub's garbage collection removes unreferenced objects.</p>
          </DeepDive>

          <DeepDive title="Merge commit vs squash vs rebase — which to choose" badge="strategy">
            <p><strong>Merge commit</strong> preserves the full history of your branch as a parallel timeline that gets folded in. Good for feature branches with meaningful intermediate commits. Produces a merge commit that shows exactly when the feature landed.</p>
            <p><strong>Squash and merge</strong> collapses all PR commits into one commit on main. Great for messy WIP branches ("add thing", "fix typo", "actually fix typo", "working now"). Keeps main's history clean but loses the granular story of how the feature was built.</p>
            <p><strong>Rebase and merge</strong> replays each PR commit individually on top of main, with new hashes. Linear history, no merge commit, but each commit retains its individual message. The problem: rebasing changes commit hashes, so <code>git log --all</code> shows the branch commits as distinct from the merged commits.</p>
          </DeepDive>
        </section>

        {/* ══════════════════════════════════════════════════
            SECTION 2: FORKS vs BRANCHES
        ══════════════════════════════════════════════════ */}
        <section className="gh-section fade-in-section">
          <div className="gh-label">Open Source</div>
          <h2 className="gh-title">Forks vs Branches — the access model</h2>
          <p className="gh-desc">
            The choice between a fork and a branch comes down to one question: do you have write access to the repository? If yes, use a branch. If no, fork it.
          </p>

          <p className="gh-body">
            The fork model is what makes open source work at scale. You don't need the Linux kernel maintainers to give you push access before you can submit a patch. You fork it, fix it, and send a PR. The maintainers pull from your copy on their terms.
          </p>

          <ForkVisualizer />

          <Callout type="warn" title="Keeping your fork in sync — the most common OSS mistake">
            <p>After forking, your fork immediately starts diverging from upstream as other contributors merge PRs. Before opening a PR, always sync:</p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, marginTop: 8, lineHeight: 1.8, color: 'var(--text2)' }}>
              git fetch upstream<br />
              git rebase upstream/main<br />
              git push origin feat/my-fix --force-with-lease
            </div>
            <p style={{ marginTop: 8 }}>If you open a PR with a branch that's 200 commits behind upstream, maintainers will ask you to rebase. Do it first.</p>
          </Callout>

          <DeepDive title="Codeowners — automated review assignment" badge="github">
            <p>A <code>CODEOWNERS</code> file in the repo root (or <code>.github/</code>) maps file paths to required reviewers. When a PR touches a file, the listed owners are automatically added as required reviewers — the merge button won't activate until they approve. Example:</p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.8, background: 'var(--bg2)', padding: 12, borderRadius: 8, marginTop: 8, color: 'var(--text2)' }}>
              # .github/CODEOWNERS<br />
              src/auth/     @security-team<br />
              src/payments/ @payments-team @cto<br />
              *.yml         @devops-team<br />
              /docs/        @docs-team
            </div>
            <p style={{ marginTop: 8 }}>This prevents the scenario where a junior dev accidentally touches a security-critical module and it gets merged without a specialist's review.</p>
          </DeepDive>
        </section>

        {/* ══════════════════════════════════════════════════
            SECTION 3: GITHUB ACTIONS
        ══════════════════════════════════════════════════ */}
        <section className="gh-section fade-in-section">
          <div className="gh-label">Automation</div>
          <h2 className="gh-title">GitHub Actions — event-driven automation</h2>
          <p className="gh-desc">
            Every time something happens in your repository — a push, a PR, a new release, a comment, a schedule — GitHub Actions can run a pipeline. Build it visually below and watch the YAML generate in real time.
          </p>

          <p className="gh-body">
            Actions workflows live in <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>.github/workflows/*.yml</code> and are committed to the repository. This means your CI pipeline is version-controlled alongside your code — you can see exactly how it changed and why. Each workflow defines <strong>triggers</strong> (what events cause it to run), <strong>jobs</strong> (parallel groups of work), and <strong>steps</strong> (individual commands or pre-built actions).
          </p>

          <ActionsBuilder />

          <div className="gh-divider" />

          <h3 className="gh-sub">Secrets and environments</h3>
          <p className="gh-body">
            API keys, deploy tokens, and credentials never go in the YAML file directly. They're stored in <strong>GitHub Secrets</strong> (Settings → Secrets and variables → Actions) and referenced as <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{"${{ secrets.MY_SECRET }}"}</code> in workflows. They're encrypted at rest, masked in logs, and never exposed to pull requests from forks (a security boundary).
          </p>

          <CodeBlock lang="yaml" title="Environment gates — approval before production deploy">
{`jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging          # No approval gate
    steps:
      - run: ./deploy.sh staging

  deploy-production:
    runs-on: ubuntu-latest
    needs: deploy-staging         # Must pass staging first
    environment: production       # Requires manual approval
    steps:
      - run: ./deploy.sh production

# In Settings → Environments → production:
# ✓ Required reviewers: @cto, @lead-engineer
# ✓ Wait timer: 10 minutes
# ✓ Deployment branches: main only`}
          </CodeBlock>

          <DeepDive title="Actions runners — where your code actually runs" badge="infra">
            <p>By default, workflows run on GitHub-hosted runners: fresh Ubuntu, Windows, or macOS VMs that spin up on demand and are destroyed after each job. You get 2,000 free minutes/month on public repos. For private repos, usage is metered.</p>
            <p>For compliance (data sovereignty, custom hardware, faster builds using cached dependencies), teams run self-hosted runners — machines you control that register with GitHub and poll for jobs. Self-hosted runners persist between jobs, so build caches survive and you can use internal network resources like private registries.</p>
          </DeepDive>
        </section>

        {/* ══════════════════════════════════════════════════
            SECTION 4: BRANCH PROTECTION
        ══════════════════════════════════════════════════ */}
        <section className="gh-section fade-in-section">
          <div className="gh-label">Governance</div>
          <h2 className="gh-title">Branch protection — enforcing process at the API level</h2>
          <p className="gh-desc">
            Branch protection rules take your team's code review policy and enforce it in GitHub's API — not just a social contract. Toggle the rules below and watch the security score and scenario outcomes update in real time.
          </p>

          <p className="gh-body">
            Without branch protection, anyone with write access can <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>git push --force origin main</code> at 2am and rewrite history. Or merge their own PRs without review. Or ship broken builds. Protection rules take these decisions out of developers' hands entirely.
          </p>

          <BranchProtectionBuilder />

          <Callout type="success" title="Recommended ruleset for any production branch">
            <ul style={{ paddingLeft: 18, marginTop: 8 }}>
              <li>✓ Require a pull request before merging</li>
              <li>✓ Require at least 1 approving review</li>
              <li>✓ Dismiss stale approvals when new commits are pushed</li>
              <li>✓ Require status checks to pass (name your CI jobs explicitly)</li>
              <li>✓ Require branches to be up to date before merging</li>
              <li>✓ Do not allow bypassing — applies to admins too</li>
              <li>✓ Restrict force pushes on this branch</li>
            </ul>
          </Callout>

          <DeepDive title="Rulesets vs classic branch protection — the newer model" badge="github">
            <p>In 2023, GitHub introduced "Rulesets" as a more powerful replacement for classic branch protection. Rulesets can be applied to multiple branches at once via fnmatch patterns, have a "Evaluate" mode (log violations without blocking — useful for rollout), and support targeting by actor (exempt certain apps or teams). They also work at the organisation level so you can enforce rules across all repos.</p>
            <p>Classic branch protection still works and is more widely understood, but new repos should use Rulesets for the additional flexibility. The concepts are identical — the interface and power level differ.</p>
          </DeepDive>
        </section>

      </div>
    </>
  );
}