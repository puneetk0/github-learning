import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = `
  .adv-page { padding: 48px 0 100px; }

  /* ── Hero ── */
  .adv-hero {
    padding: 80px 10% 60px;
    border-bottom: 1px solid var(--border);
    text-align: center;
    position: relative; overflow: hidden;
  }
  .adv-hero-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 40px 40px; opacity: 0.25;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent);
    pointer-events: none;
  }
  .adv-hero-content { position: relative; z-index: 1; }
  .adv-chapter-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 14px;
    background: rgba(217,119,6,0.08); border: 1px solid rgba(217,119,6,0.25);
    border-radius: 20px; font-size: 11px; font-family: var(--font-mono);
    color: var(--yellow); letter-spacing: 1px; text-transform: uppercase;
    margin-bottom: 20px;
  }
  .adv-chapter-badge span { width: 6px; height: 6px; border-radius: 50%; background: var(--yellow); display: inline-block; }
  .adv-hero-title {
    font-family: var(--font-display);
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 800; line-height: 1.05; letter-spacing: -2px; margin-bottom: 16px;
  }
  .adv-hero-title em {
    font-style: normal;
    background: linear-gradient(135deg, var(--yellow) 0%, var(--orange) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .adv-hero-sub { font-size: 16px; color: var(--text2); line-height: 1.7; max-width: 560px; margin: 0 auto 32px; }
  .adv-hero-stats { display: flex; gap: 40px; justify-content: center; flex-wrap: wrap; }
  .adv-stat { text-align: center; }
  .adv-stat-num { font-family: var(--font-display); font-size: 26px; font-weight: 800; color: var(--yellow); }
  .adv-stat-label { font-size: 11px; color: var(--text3); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.5px; }

  /* ── Section shell ── */
  .adv-section { width: 80%; margin: 0 10%; padding: 64px 0; border-bottom: 1px solid var(--border); }
  .adv-label { font-family: var(--font-mono); font-size: 11px; color: var(--yellow); text-transform: uppercase; letter-spacing: 3px; margin-bottom: 10px; }
  .adv-title { font-family: var(--font-display); font-size: clamp(28px, 3.5vw, 40px); font-weight: 800; letter-spacing: -1px; line-height: 1.1; margin-bottom: 12px; }
  .adv-desc { font-size: 15px; color: var(--text2); line-height: 1.7; margin-bottom: 32px; }
  .adv-body { font-size: 15px; color: var(--text2); line-height: 1.7; margin-bottom: 20px; }
  .adv-body strong { color: var(--text); }
  .adv-sub { font-family: var(--font-display); font-size: 22px; font-weight: 700; margin: 40px 0 12px; }
  .adv-divider { height: 1px; background: var(--border); margin: 48px 0; }

  /* ── Code block ── */
  .adv-code { background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin: 20px 0; font-family: var(--font-mono); font-size: 13px; line-height: 1.7; }
  .adv-code-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 10px 16px; display: flex; align-items: center; gap: 8px; }
  .adv-code-dot { width: 10px; height: 10px; border-radius: 50%; }
  .adv-code-lang { margin-left: auto; font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; }
  .adv-code pre { margin: 0; padding: 16px; overflow-x: auto; color: var(--text2); }

  /* ── Callout ── */
  .adv-callout { border-radius: 10px; padding: 16px 20px; margin: 20px 0; border: 1px solid; }
  .adv-callout.info { background: rgba(59,130,246,0.05); border-color: rgba(59,130,246,0.2); }
  .adv-callout.warn { background: rgba(217,119,6,0.05); border-color: rgba(217,119,6,0.2); }
  .adv-callout.danger { background: rgba(220,38,38,0.05); border-color: rgba(220,38,38,0.2); }
  .adv-callout.success { background: rgba(5,150,105,0.05); border-color: rgba(5,150,105,0.2); }
  .adv-callout-title { font-weight: 700; font-size: 13px; margin-bottom: 6px; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.5px; }
  .adv-callout.info .adv-callout-title { color: var(--accent); }
  .adv-callout.warn .adv-callout-title { color: var(--yellow); }
  .adv-callout.danger .adv-callout-title { color: var(--red); }
  .adv-callout.success .adv-callout-title { color: var(--green); }
  .adv-callout p { font-size: 14px; color: var(--text2); line-height: 1.6; margin: 0; }

  /* ── DeepDive ── */
  .adv-deepdive { border: 1px solid var(--border); border-radius: 10px; margin: 20px 0; overflow: hidden; }
  .adv-deepdive-header { padding: 14px 18px; background: var(--surface); display: flex; align-items: center; gap: 10px; cursor: pointer; transition: background 0.15s; user-select: none; }
  .adv-deepdive-header:hover { background: var(--bg2); }
  .adv-deepdive-title { font-size: 14px; font-weight: 600; color: var(--text); flex: 1; }
  .adv-deepdive-badge { font-family: var(--font-mono); font-size: 10px; padding: 2px 8px; background: rgba(217,119,6,0.1); border: 1px solid rgba(217,119,6,0.2); color: var(--yellow); border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  .adv-deepdive-chevron { color: var(--text3); font-size: 12px; transition: transform 0.2s; }
  .adv-deepdive-chevron.open { transform: rotate(180deg); }
  .adv-deepdive-body { padding: 20px; background: var(--bg2); border-top: 1px solid var(--border); }
  .adv-deepdive-body p { font-size: 14px; color: var(--text2); line-height: 1.7; margin-bottom: 12px; }
  .adv-deepdive-body p:last-child { margin-bottom: 0; }

  /* ── Command Table ── */
  .adv-cmd-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
  .adv-cmd-table th { text-align: left; padding: 10px 14px; background: var(--surface); border-bottom: 2px solid var(--border); font-family: var(--font-mono); font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; }
  .adv-cmd-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); vertical-align: top; }
  .adv-cmd-table tr:last-child td { border-bottom: none; }
  .adv-cmd-table tr:hover td { background: var(--bg2); }
  .adv-cmd-td-flag { font-family: var(--font-mono); font-size: 12px; color: var(--accent); white-space: nowrap; }
  .adv-cmd-td-effect { color: var(--text2); line-height: 1.5; }

  /* ═══════════════════════════════════════════════════
     STASH SIMULATOR
  ═══════════════════════════════════════════════════ */
  .stash-wrap { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin: 24px 0; }
  .stash-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  .stash-header-title { font-family: var(--font-mono); font-size: 13px; font-weight: 600; }
  .stash-header-sub { font-size: 12px; color: var(--text3); }
  .stash-body { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; }
  @media (max-width: 700px) { .stash-body { grid-template-columns: 1fr; } }
  .stash-col { padding: 20px; }
  .stash-col + .stash-col { border-left: 1px solid var(--border); }
  .stash-col-title { font-family: var(--font-mono); font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
  .stash-col-title .badge { padding: 2px 8px; border-radius: 10px; font-size: 10px; background: var(--bg3); }

  /* Working directory files */
  .stash-file {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--surface); margin-bottom: 8px;
    font-family: var(--font-mono); font-size: 12px;
    transition: all 0.2s; cursor: default;
  }
  .stash-file.staged { border-color: rgba(5,150,105,0.4); background: rgba(5,150,105,0.04); }
  .stash-file.modified { border-color: rgba(217,119,6,0.4); background: rgba(217,119,6,0.04); }
  .stash-file.untracked { border-color: rgba(107,114,128,0.4); background: rgba(107,114,128,0.04); }
  .stash-file.exiting { animation: fileExit 0.4s ease forwards; }
  .stash-file.entering { animation: fileEnter 0.4s ease; }
  @keyframes fileExit { to { opacity: 0; transform: translateX(20px); } }
  @keyframes fileEnter { from { opacity: 0; transform: translateX(-20px); } }
  .stash-file-icon { font-size: 14px; }
  .stash-file-name { flex: 1; color: var(--text); }
  .stash-file-status { font-size: 10px; padding: 2px 6px; border-radius: 4px; }
  .stash-file.staged .stash-file-status { background: rgba(5,150,105,0.1); color: var(--green); }
  .stash-file.modified .stash-file-status { background: rgba(217,119,6,0.1); color: var(--yellow); }
  .stash-file.untracked .stash-file-status { background: rgba(107,114,128,0.1); color: var(--text3); }

  /* Stack entries */
  .stash-stack { display: flex; flex-direction: column; gap: 0; }
  .stash-entry {
    border: 1px solid var(--border); border-radius: 8px;
    padding: 12px 14px; background: var(--surface);
    margin-bottom: 6px; position: relative;
    transition: all 0.3s;
  }
  .stash-entry:first-child { border-color: rgba(217,119,6,0.4); background: rgba(217,119,6,0.04); }
  .stash-entry-idx { font-family: var(--font-mono); font-size: 10px; color: var(--yellow); margin-bottom: 4px; }
  .stash-entry-msg { font-size: 13px; color: var(--text); font-weight: 600; }
  .stash-entry-files { font-size: 11px; color: var(--text3); font-family: var(--font-mono); margin-top: 4px; }
  .stash-entry-tag {
    position: absolute; right: 10px; top: 10px;
    font-size: 10px; padding: 2px 6px;
    background: rgba(217,119,6,0.1); color: var(--yellow);
    border-radius: 4px; font-family: var(--font-mono);
  }
  .stash-empty { color: var(--text3); font-size: 13px; font-family: var(--font-mono); text-align: center; padding: 20px; border: 1px dashed var(--border); border-radius: 8px; }
  .stash-clean { color: var(--green); font-size: 13px; font-family: var(--font-mono); text-align: center; padding: 20px; border: 1px dashed rgba(5,150,105,0.3); border-radius: 8px; background: rgba(5,150,105,0.03); }

  /* HEAD snapshot files */
  .head-file { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 6px; background: var(--bg2); margin-bottom: 6px; font-family: var(--font-mono); font-size: 12px; color: var(--text3); border: 1px solid var(--border); }
  .head-file-icon { opacity: 0.5; }

  /* Controls */
  .stash-controls { padding: 16px 20px; background: var(--surface); border-top: 1px solid var(--border); display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
  .stash-btn {
    padding: 8px 18px; border-radius: 8px; border: 1px solid var(--border);
    font-family: var(--font-mono); font-size: 12px; cursor: pointer;
    transition: all 0.15s; font-weight: 500;
  }
  .stash-btn-push { background: rgba(217,119,6,0.08); border-color: rgba(217,119,6,0.3); color: var(--yellow); }
  .stash-btn-push:hover:not(:disabled) { background: rgba(217,119,6,0.15); }
  .stash-btn-pop { background: rgba(5,150,105,0.08); border-color: rgba(5,150,105,0.3); color: var(--green); }
  .stash-btn-pop:hover:not(:disabled) { background: rgba(5,150,105,0.15); }
  .stash-btn-apply { background: rgba(59,130,246,0.08); border-color: rgba(59,130,246,0.3); color: var(--accent); }
  .stash-btn-apply:hover:not(:disabled) { background: rgba(59,130,246,0.15); }
  .stash-btn-drop { background: rgba(220,38,38,0.08); border-color: rgba(220,38,38,0.3); color: var(--red); }
  .stash-btn-drop:hover:not(:disabled) { background: rgba(220,38,38,0.15); }
  .stash-btn-new { background: var(--bg2); border-color: var(--border); color: var(--text2); }
  .stash-btn-new:hover:not(:disabled) { background: var(--bg3); }
  .stash-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .stash-log { margin-left: auto; font-family: var(--font-mono); font-size: 11px; color: var(--text3); max-width: 200px; text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* ─── Include-untracked toggle ─── */
  .stash-option { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text2); font-family: var(--font-mono); }
  .stash-option input[type=checkbox] { accent-color: var(--yellow); width: 14px; height: 14px; cursor: pointer; }

  /* ═══════════════════════════════════════════════════
     BISECT GAME
  ═══════════════════════════════════════════════════ */
  .bisect-wrap { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin: 24px 0; }
  .bisect-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .bisect-header-title { font-family: var(--font-mono); font-size: 13px; font-weight: 600; }
  .bisect-body { padding: 24px; }

  /* Commit timeline */
  .bisect-timeline { position: relative; margin: 24px 0; }
  .bisect-commits { display: flex; gap: 4px; align-items: center; flex-wrap: wrap; }
  .bisect-commit {
    width: 36px; height: 36px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-mono); font-size: 10px; font-weight: 600;
    border: 1.5px solid var(--border); background: var(--surface);
    transition: all 0.3s; cursor: default; position: relative;
    color: var(--text3);
  }
  .bisect-commit.good { background: rgba(5,150,105,0.12); border-color: rgba(5,150,105,0.5); color: var(--green); }
  .bisect-commit.bad { background: rgba(220,38,38,0.12); border-color: rgba(220,38,38,0.5); color: var(--red); }
  .bisect-commit.unknown { background: var(--surface); border-color: var(--border); color: var(--text3); }
  .bisect-commit.current {
    background: rgba(217,119,6,0.15); border-color: var(--yellow);
    color: var(--yellow); transform: scale(1.15);
    box-shadow: 0 0 0 3px rgba(217,119,6,0.15);
  }
  .bisect-commit.culprit {
    background: rgba(220,38,38,0.2); border-color: var(--red);
    color: var(--red); animation: culpritPulse 1s ease infinite;
  }
  @keyframes culpritPulse { 0%,100%{box-shadow:0 0 0 0 rgba(220,38,38,0.4)} 50%{box-shadow:0 0 0 6px rgba(220,38,38,0)} }
  .bisect-commit-label { position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%); font-size: 9px; white-space: nowrap; color: var(--text3); }

  /* Range indicator */
  .bisect-range { margin-top: 28px; display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 12px; }
  .bisect-range-bar { flex: 1; height: 6px; border-radius: 3px; background: var(--bg3); position: relative; }
  .bisect-range-fill { position: absolute; top: 0; height: 100%; border-radius: 3px; background: var(--yellow); transition: all 0.5s; }

  /* Info panel */
  .bisect-info { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 20px 0; }
  .bisect-stat { background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; padding: 12px; text-align: center; }
  .bisect-stat-val { font-family: var(--font-display); font-size: 22px; font-weight: 800; color: var(--yellow); }
  .bisect-stat-label { font-size: 11px; color: var(--text3); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.5px; }

  /* Commit detail */
  .bisect-detail { background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 16px; margin: 16px 0; font-family: var(--font-mono); font-size: 13px; }
  .bisect-detail-header { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
  .bisect-detail-hash { color: var(--accent2); font-weight: 700; margin-bottom: 4px; }
  .bisect-detail-msg { color: var(--text); font-size: 14px; margin-bottom: 4px; }
  .bisect-detail-meta { color: var(--text3); font-size: 11px; }
  .bisect-detail-diff { margin-top: 12px; background: #0d1117; border-radius: 6px; padding: 12px; overflow-x: auto; }
  .bisect-detail-diff .add { color: #7dcf85; }
  .bisect-detail-diff .del { color: #f87171; }
  .bisect-detail-diff .neu { color: #6e7681; }

  /* Action buttons */
  .bisect-actions { display: flex; gap: 12px; margin: 16px 0; flex-wrap: wrap; }
  .bisect-action-btn {
    flex: 1; min-width: 120px; padding: 12px 24px; border-radius: 8px; border: 1px solid;
    font-family: var(--font-body); font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.15s; text-align: center;
  }
  .bisect-good { background: rgba(5,150,105,0.08); border-color: rgba(5,150,105,0.3); color: var(--green); }
  .bisect-good:hover:not(:disabled) { background: rgba(5,150,105,0.18); }
  .bisect-bad { background: rgba(220,38,38,0.08); border-color: rgba(220,38,38,0.3); color: var(--red); }
  .bisect-bad:hover:not(:disabled) { background: rgba(220,38,38,0.18); }
  .bisect-action-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .bisect-result {
    padding: 20px; border-radius: 10px;
    background: rgba(220,38,38,0.06); border: 1px solid rgba(220,38,38,0.2);
    text-align: center; animation: fadeSlide 0.4s ease;
  }
  .bisect-result-title { font-family: var(--font-display); font-size: 22px; font-weight: 800; color: var(--red); margin-bottom: 8px; }
  .bisect-result-sub { font-size: 14px; color: var(--text2); }
  .bisect-result-hash { font-family: var(--font-mono); font-size: 13px; color: var(--accent2); margin: 8px 0; }

  .bisect-size-picker { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .bisect-size-btn { padding: 6px 14px; border-radius: 6px; border: 1px solid var(--border); background: var(--surface); font-family: var(--font-mono); font-size: 12px; cursor: pointer; color: var(--text2); transition: all 0.15s; }
  .bisect-size-btn.active { background: rgba(217,119,6,0.1); border-color: rgba(217,119,6,0.4); color: var(--yellow); }
  .bisect-size-btn:hover { background: var(--bg2); }

  .bisect-auto-btn { padding: 8px 18px; border-radius: 8px; background: rgba(139,92,246,0.08); border: 1px solid rgba(139,92,246,0.3); color: var(--accent2); font-family: var(--font-mono); font-size: 12px; cursor: pointer; transition: all 0.15s; }
  .bisect-auto-btn:hover { background: rgba(139,92,246,0.15); }
  .bisect-auto-log { font-family: var(--font-mono); font-size: 12px; color: var(--text2); line-height: 1.8; background: #0d1117; border-radius: 8px; padding: 14px; margin-top: 12px; max-height: 180px; overflow-y: auto; }
  .bisect-auto-log .ok { color: #7dcf85; }
  .bisect-auto-log .fail { color: #f87171; }
  .bisect-auto-log .info { color: #79c0ff; }

  /* ═══════════════════════════════════════════════════
     BLAME EXPLORER
  ═══════════════════════════════════════════════════ */
  .blame-wrap { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin: 24px 0; }
  .blame-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  .blame-header-title { font-family: var(--font-mono); font-size: 13px; font-weight: 600; }
  .blame-options { display: flex; gap: 8px; }
  .blame-opt-btn { padding: 5px 12px; border-radius: 6px; border: 1px solid var(--border); background: var(--surface2); font-family: var(--font-mono); font-size: 11px; cursor: pointer; color: var(--text2); transition: all 0.15s; }
  .blame-opt-btn.active { background: rgba(59,130,246,0.1); border-color: rgba(59,130,246,0.3); color: var(--accent); }
  .blame-file-body { overflow-x: auto; }
  .blame-table { width: 100%; border-collapse: collapse; font-family: var(--font-mono); font-size: 12px; }
  .blame-row { border-bottom: 1px solid var(--border); transition: background 0.15s; cursor: pointer; }
  .blame-row:hover { background: var(--bg2); }
  .blame-row.selected { background: rgba(59,130,246,0.06); }
  .blame-row.highlight { background: var(--bg2); }
  .blame-td-hash { padding: 8px 12px; color: var(--accent2); white-space: nowrap; width: 70px; border-right: 1px solid var(--border); }
  .blame-td-author { padding: 8px 12px; color: var(--text3); white-space: nowrap; width: 90px; border-right: 1px solid var(--border); }
  .blame-td-date { padding: 8px 12px; color: var(--text3); white-space: nowrap; width: 90px; border-right: 1px solid var(--border); }
  .blame-td-lineno { padding: 8px 12px; color: var(--text3); text-align: right; width: 40px; border-right: 1px solid var(--border); background: var(--bg2); user-select: none; }
  .blame-td-code { padding: 8px 14px; color: var(--text2); white-space: pre; }
  .blame-age-bar { display: inline-block; width: 4px; height: 14px; border-radius: 2px; margin-right: 6px; vertical-align: middle; }
  .blame-detail { padding: 16px 20px; border-top: 1px solid var(--border); background: var(--bg2); font-size: 13px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 600px) { .blame-detail { grid-template-columns: 1fr; } }
  .blame-detail-section { }
  .blame-detail-label { font-family: var(--font-mono); font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .blame-detail-content { color: var(--text2); line-height: 1.5; }
  .blame-detail-hash { color: var(--accent2); font-family: var(--font-mono); }
  .blame-detail-msg { color: var(--text); font-weight: 600; }
  .blame-whitespace-demo { display: flex; gap: 12px; flex-wrap: wrap; margin: 16px 0; }
  .blame-ws-card { flex: 1; min-width: 200px; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
  .blame-ws-card-header { padding: 8px 12px; background: var(--surface); border-bottom: 1px solid var(--border); font-family: var(--font-mono); font-size: 11px; color: var(--text3); }
  .blame-ws-card-body { padding: 12px; font-family: var(--font-mono); font-size: 11px; line-height: 1.8; }

  @keyframes fadeSlide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
`;

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────
function CodeBlock({ title, lang, children }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="adv-code">
      <div className="adv-code-header">
        <span className="adv-code-dot" style={{ background: '#ff5f57' }} />
        <span className="adv-code-dot" style={{ background: '#ffbd2e' }} />
        <span className="adv-code-dot" style={{ background: '#28c840' }} />
        {title && <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text3)' }}>{title}</span>}
        <span className="adv-code-lang">{lang}</span>
        <button
          onClick={() => { navigator.clipboard.writeText(typeof children === 'string' ? children : '').catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
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
    <div className={`adv-callout ${type}`}>
      <div className="adv-callout-title">{{ info: 'ⓘ', warn: '⚠', danger: '⛔', success: '✓' }[type]} {title}</div>
      <p>{children}</p>
    </div>
  );
}

function DeepDive({ title, badge = 'advanced', children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="adv-deepdive">
      <div className="adv-deepdive-header" onClick={() => setOpen(o => !o)}>
        <span style={{ fontSize: 14, color: 'var(--yellow)' }}>⬡</span>
        <span className="adv-deepdive-title">{title}</span>
        <span className="adv-deepdive-badge">{badge}</span>
        <span className={`adv-deepdive-chevron ${open ? 'open' : ''}`}>▼</span>
      </div>
      {open && <div className="adv-deepdive-body">{children}</div>}
    </div>
  );
}

function CmdTable({ rows }) {
  return (
    <table className="adv-cmd-table">
      <thead>
        <tr>
          <th style={{ width: '40%' }}>Command</th>
          <th>What it does</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td className="adv-cmd-td-flag">{r.cmd}</td>
            <td className="adv-cmd-td-effect">{r.effect}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STASH SIMULATOR
// Teaches: LIFO stack, push/pop/apply/drop, staged vs untracked
// ═══════════════════════════════════════════════════════════════════════════════
const INITIAL_WD = [
  { id: 1, name: 'src/auth.js', status: 'staged', icon: '📝' },
  { id: 2, name: 'src/login.css', status: 'modified', icon: '🎨' },
  { id: 3, name: 'tests/auth.test.js', status: 'untracked', icon: '🆕' },
];
const HEAD_FILES = ['src/app.js', 'src/db.js', 'README.md'];
const WIP_NAMES = [
  'wip: refactor auth',
  'wip: dark mode',
  'wip: api integration',
  'wip: fix pagination',
];

function StashSimulator() {
  const [wd, setWd] = useState(INITIAL_WD);
  const [stack, setStack] = useState([]);
  const [includeUntracked, setIncludeUntracked] = useState(false);
  const [log, setLog] = useState('Ready');
  const [wipIdx, setWipIdx] = useState(0);

  const canPush = wd.some(f => f.status !== 'untracked' || includeUntracked);
  const canPop = stack.length > 0;

  const push = () => {
    const toPush = includeUntracked ? wd : wd.filter(f => f.status !== 'untracked');
    const left = includeUntracked ? [] : wd.filter(f => f.status === 'untracked');
    const name = WIP_NAMES[wipIdx % WIP_NAMES.length];
    const entry = {
      id: Date.now(),
      msg: name,
      files: toPush.map(f => f.name),
      includesUntracked: includeUntracked,
    };
    setStack(s => [entry, ...s]);
    setWd(left);
    setWipIdx(i => i + 1);
    setLog(`Saved to stash@{0}: "${name}"`);
  };

  const pop = () => {
    if (!stack.length) return;
    const [top, ...rest] = stack;
    const restored = top.files.map((name, i) => ({
      id: Date.now() + i,
      name,
      status: i === 0 ? 'staged' : i === top.files.length - 1 && top.includesUntracked ? 'untracked' : 'modified',
      icon: name.endsWith('.css') ? '🎨' : name.includes('test') ? '🆕' : '📝',
    }));
    setWd(prev => [...prev, ...restored]);
    setStack(rest);
    setLog(`Popped stash@{0} — changes restored`);
  };

  const apply = () => {
    if (!stack.length) return;
    const top = stack[0];
    const restored = top.files.map((name, i) => ({
      id: Date.now() + i,
      name,
      status: i === 0 ? 'staged' : 'modified',
      icon: name.endsWith('.css') ? '🎨' : '📝',
    }));
    setWd(prev => [...prev, ...restored]);
    setLog(`Applied stash@{0} — stash still in stack`);
  };

  const drop = () => {
    if (!stack.length) return;
    setStack(s => s.slice(1));
    setLog(`Dropped stash@{0}`);
  };

  const addWork = () => {
    const opts = [
      { id: Date.now(), name: 'src/dashboard.js', status: 'modified', icon: '📝' },
      { id: Date.now() + 1, name: 'src/settings.css', status: 'staged', icon: '🎨' },
      { id: Date.now() + 2, name: 'src/new-feature.js', status: 'untracked', icon: '🆕' },
    ];
    setWd(prev => [...prev, opts[prev.length % opts.length]]);
    setLog('Added new work to working directory');
  };

  const reset = () => { setWd(INITIAL_WD); setStack([]); setLog('Reset'); setWipIdx(0); };

  return (
    <div className="stash-wrap">
      <div className="stash-header">
        <div>
          <div className="stash-header-title">$ git stash — LIFO Stack Simulator</div>
          <div className="stash-header-sub">Push dirty work to the stack, pop it back when you're ready</div>
        </div>
        <button onClick={reset} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 12px', fontSize: 12, color: 'var(--text3)', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>reset</button>
      </div>
      <div className="stash-body">
        {/* Col 1: Working Directory */}
        <div className="stash-col">
          <div className="stash-col-title">
            Working directory
            <span className="badge" style={{ color: wd.length ? 'var(--yellow)' : 'var(--green)', background: wd.length ? 'rgba(217,119,6,0.08)' : 'rgba(5,150,105,0.08)' }}>
              {wd.length ? `${wd.length} dirty` : 'clean'}
            </span>
          </div>
          {wd.length === 0 ? (
            <div className="stash-clean">✓ Working tree clean</div>
          ) : (
            wd.map(f => (
              <div key={f.id} className={`stash-file ${f.status}`}>
                <span className="stash-file-icon">{f.icon}</span>
                <span className="stash-file-name">{f.name}</span>
                <span className="stash-file-status">{f.status}</span>
              </div>
            ))
          )}
        </div>
        {/* Col 2: Stash Stack */}
        <div className="stash-col">
          <div className="stash-col-title">
            Stash stack
            <span className="badge">{stack.length} entries</span>
          </div>
          {stack.length === 0 ? (
            <div className="stash-empty">No stashes yet</div>
          ) : (
            <div className="stash-stack">
              {stack.map((e, i) => (
                <div key={e.id} className="stash-entry">
                  {i === 0 && <span className="stash-entry-tag">top</span>}
                  <div className="stash-entry-idx">stash@{'{'}{ i }{'}'}</div>
                  <div className="stash-entry-msg">{e.msg}</div>
                  <div className="stash-entry-files">{e.files.length} file{e.files.length !== 1 ? 's' : ''}: {e.files.map(f => f.split('/').pop()).join(', ')}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Col 3: HEAD (clean state reference) */}
        <div className="stash-col">
          <div className="stash-col-title">HEAD snapshot</div>
          <div style={{ marginBottom: 8, fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
            Stashing reverts your WD to this state:
          </div>
          {HEAD_FILES.map(f => (
            <div key={f} className="head-file">
              <span className="head-file-icon">📄</span>
              {f}
            </div>
          ))}
          <div style={{ marginTop: 16, padding: 10, background: 'var(--bg2)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, color: 'var(--text3)', lineHeight: 1.6 }}>
            After <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>git stash push</code>, your WD matches HEAD exactly. You can safely switch branches.
          </div>
        </div>
      </div>
      <div className="stash-controls">
        <button className="stash-btn stash-btn-push" onClick={push} disabled={!canPush}>
          git stash push
        </button>
        <button className="stash-btn stash-btn-pop" onClick={pop} disabled={!canPop}>
          git stash pop
        </button>
        <button className="stash-btn stash-btn-apply" onClick={apply} disabled={!canPop}>
          git stash apply
        </button>
        <button className="stash-btn stash-btn-drop" onClick={drop} disabled={!canPop}>
          git stash drop
        </button>
        <button className="stash-btn stash-btn-new" onClick={addWork}>
          + add work
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginLeft: 4 }}>
          <label className="stash-option">
            <input type="checkbox" checked={includeUntracked} onChange={e => setIncludeUntracked(e.target.checked)} />
            <code style={{ fontSize: 11 }}>-u</code> include untracked files
          </label>
        </div>
        <span className="stash-log">{log}</span>
      </div>
      <div style={{ padding: '12px 20px', background: 'rgba(217,119,6,0.04)', borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
        💡 Try: push twice, then <strong style={{color:'var(--text)'}}>apply</strong> (stack stays) vs <strong style={{color:'var(--text)'}}>pop</strong> (stack empties). Notice untracked files ({`🆕`}) are only stashed when <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>-u</code> is checked.
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BISECT GAME
// Teaches: binary search, log2(N) steps, good/bad marking, auto-bisect
// ═══════════════════════════════════════════════════════════════════════════════
const COMMIT_MESSAGES = [
  'Initial commit', 'Add routing', 'Setup database', 'Add user model',
  'Add auth module', 'JWT implementation', 'Add refresh tokens', 'Rate limiting',
  'Add tests', 'Fix token expiry', 'Add middleware', 'Refactor auth flow',
  'Add logging', 'Performance tuning', 'Fix memory leak', 'Add cache layer',
  'Database indexing', 'Add pagination', 'Refactor queries', 'Fix N+1 queries',
  'Add search', 'Add filters', 'Add sorting', 'Add exports',
  'Add email service', 'Add templates', 'Add notifications', 'Add webhooks',
  'API versioning', 'Add docs', 'Add OpenAPI spec', 'Release v2.0',
];

const FAKE_DIFFS = [
  { file: 'src/auth.js', lines: [
    { t: 'neu', c: ' function validateToken(token) {' },
    { t: 'del', c: '-  return jwt.verify(token, SECRET);' },
    { t: 'add', c: '+  return jwt.verify(token, SECRET, { ignoreExpiration: true });' },
    { t: 'neu', c: ' }' },
  ]},
  { file: 'src/db.js', lines: [
    { t: 'neu', c: ' async function query(sql, params) {' },
    { t: 'del', c: '-  return pool.execute(sql, params);' },
    { t: 'add', c: '+  const conn = await pool.getConnection();' },
    { t: 'add', c: '+  return conn.execute(sql, params);  // MISSING conn.release()' },
    { t: 'neu', c: ' }' },
  ]},
  { file: 'src/cache.js', lines: [
    { t: 'neu', c: ' function get(key) {' },
    { t: 'add', c: '+  if (!store[key]) return null;  // was throwing' },
    { t: 'neu', c: '   return store[key];' },
    { t: 'neu', c: ' }' },
  ]},
];

function BisectGame() {
  const [totalCommits, setTotalCommits] = useState(16);
  const [started, setStarted] = useState(false);
  const [culpritIdx, setCulpritIdx] = useState(null);
  const [states, setStates] = useState([]); // 'unknown' | 'good' | 'bad'
  const [currentIdx, setCurrentIdx] = useState(null);
  const [lo, setLo] = useState(0);
  const [hi, setHi] = useState(0);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);
  const [autoLog, setAutoLog] = useState([]);
  const [autoRunning, setAutoRunning] = useState(false);

  const maxMoves = Math.ceil(Math.log2(totalCommits));

  const startGame = (size) => {
    const n = size || totalCommits;
    setTotalCommits(n);
    const culprit = Math.floor(Math.random() * (n - 4)) + 2; // not the first or last few
    setCulpritIdx(culprit);
    const st = Array(n).fill('unknown');
    st[0] = 'good';
    st[n - 1] = 'bad';
    const mid = Math.floor((0 + n - 1) / 2);
    setStates(st);
    setCurrentIdx(mid);
    setLo(0); setHi(n - 1);
    setMoves(0); setDone(false); setAutoLog([]);
    setStarted(true);
  };

  const markCurrent = (verdict) => {
    if (done || currentIdx === null) return;
    const newStates = [...states];
    newStates[currentIdx] = verdict;
    setStates(newStates);

    let newLo = lo, newHi = hi;
    if (verdict === 'good') newLo = currentIdx + 1;
    else newHi = currentIdx - 1;
    setLo(newLo); setHi(newHi);
    setMoves(m => m + 1);

    if (newLo > newHi || newLo === newHi) {
      // found
      const found = verdict === 'bad' ? currentIdx : currentIdx;
      const finalStates = [...newStates];
      finalStates[newLo > newHi ? currentIdx : newLo] = 'bad';
      setStates(finalStates);
      setCurrentIdx(newLo > newHi ? currentIdx : newLo);
      setDone(true);
      return;
    }

    const mid = Math.floor((newLo + newHi) / 2);
    setCurrentIdx(mid);
  };

  const runAuto = useCallback(() => {
    if (autoRunning) return;
    setAutoRunning(true);
    const n = totalCommits;
    const culprit = Math.floor(Math.random() * (n - 4)) + 2;
    setCulpritIdx(culprit);
    const st = Array(n).fill('unknown');
    st[0] = 'good'; st[n - 1] = 'bad';
    setStates(st); setLo(0); setHi(n - 1); setMoves(0); setDone(false); setStarted(true);
    const log = [];
    let curLo = 0, curHi = n - 1, curSt = [...st], step = 0;

    const tick = () => {
      if (curLo > curHi) {
        log.push({ t: 'info', msg: `Found: commit #${curLo + 1} is the first bad commit (${moves + step} steps)` });
        setAutoLog([...log]);
        setDone(true);
        setCurrentIdx(curLo);
        setAutoRunning(false);
        return;
      }
      const mid = Math.floor((curLo + curHi) / 2);
      const isBad = mid >= culprit;
      curSt = [...curSt];
      curSt[mid] = isBad ? 'bad' : 'good';
      setStates([...curSt]);
      setCurrentIdx(mid);
      step++;
      log.push({
        t: isBad ? 'fail' : 'ok',
        msg: `$ git bisect ${isBad ? 'bad' : 'good'}  # Testing commit #${mid + 1}: ${COMMIT_MESSAGES[mid % COMMIT_MESSAGES.length]}`,
      });
      setAutoLog([...log]);
      setMoves(step);
      if (isBad) curHi = mid - 1;
      else curLo = mid + 1;

      if (curLo > curHi || curLo === curHi) {
        curSt[curLo] = 'bad';
        setStates([...curSt]);
        setCurrentIdx(curLo);
        log.push({ t: 'info', msg: `\n✓ ${curLo + 1} is the first bad commit. Found in ${step} steps (log2(${n}) ≈ ${Math.ceil(Math.log2(n))})` });
        setAutoLog([...log]);
        setDone(true);
        setAutoRunning(false);
        return;
      }
      setTimeout(tick, 600);
    };
    setTimeout(tick, 400);
  }, [totalCommits, autoRunning]);

  const autoLogRef = useRef(null);
  useEffect(() => { if (autoLogRef.current) autoLogRef.current.scrollTop = autoLogRef.current.scrollHeight; }, [autoLog]);

  const pct = totalCommits > 0 ? ((hi - lo) / totalCommits) * 100 : 0;
  const currentCommit = currentIdx !== null ? {
    hash: `${(currentIdx * 17 + 0xabc).toString(16).padStart(7, '0')}`,
    msg: COMMIT_MESSAGES[currentIdx % COMMIT_MESSAGES.length],
    author: ['Alice', 'Bob', 'Carol', 'Dave'][currentIdx % 4],
    date: `2024-${String((currentIdx % 12) + 1).padStart(2, '0')}-${String((currentIdx % 28) + 1).padStart(2, '0')}`,
    diff: FAKE_DIFFS[currentIdx % FAKE_DIFFS.length],
  } : null;

  return (
    <div className="bisect-wrap">
      <div className="bisect-header">
        <div className="bisect-header-title">git bisect — Binary Search Bug Finder</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {!started ? (
            <>
              <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>History size:</span>
              <div className="bisect-size-picker">
                {[8, 16, 32, 64, 128].map(n => (
                  <button key={n} className={`bisect-size-btn ${totalCommits === n ? 'active' : ''}`} onClick={() => setTotalCommits(n)}>{n}</button>
                ))}
              </div>
            </>
          ) : (
            <button onClick={() => { setStarted(false); setDone(false); setAutoLog([]); setAutoRunning(false); }} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 12px', fontSize: 12, color: 'var(--text3)', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>restart</button>
          )}
        </div>
      </div>

      <div className="bisect-body">
        {!started ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: 15, color: 'var(--text2)', marginBottom: 8 }}>
              A bug was introduced somewhere in the last <strong style={{ color: 'var(--text)' }}>{totalCommits} commits</strong>.
            </div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 24 }}>
              Binary search will find it in at most <strong style={{ color: 'var(--yellow)', fontFamily: 'var(--font-mono)' }}>⌈log₂({totalCommits})⌉ = {Math.ceil(Math.log2(totalCommits))}</strong> steps.
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="bisect-action-btn bisect-bad" style={{ flex: 'none', padding: '12px 32px' }} onClick={() => startGame()}>
                Start manual bisect
              </button>
              <button className="bisect-auto-btn" style={{ padding: '12px 24px', fontSize: 14 }} onClick={runAuto}>
                Run automated bisect
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Timeline */}
            <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 10 }}>
              Commit history ({totalCommits} commits) — green = known good, red = known bad, orange = testing now
            </div>
            <div className="bisect-commits">
              {Array.from({ length: totalCommits }).map((_, i) => (
                <div
                  key={i}
                  className={`bisect-commit ${
                    done && i === currentIdx ? 'culprit' :
                    i === currentIdx && !done ? 'current' :
                    states[i]
                  }`}
                  title={`Commit #${i + 1}: ${COMMIT_MESSAGES[i % COMMIT_MESSAGES.length]}`}
                >
                  {i + 1}
                  {i === 0 && <span className="bisect-commit-label">v1.0</span>}
                  {i === totalCommits - 1 && <span className="bisect-commit-label">HEAD</span>}
                </div>
              ))}
            </div>

            {/* Remaining range */}
            <div className="bisect-range">
              <span style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>remaining range:</span>
              <div className="bisect-range-bar">
                <div className="bisect-range-fill" style={{ left: `${(lo / totalCommits) * 100}%`, width: `${((hi - lo + 1) / totalCommits) * 100}%` }} />
              </div>
              <span style={{ color: 'var(--yellow)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>#{lo + 1}–#{hi + 1} ({hi - lo + 1} left)</span>
            </div>

            {/* Stats */}
            <div className="bisect-info">
              <div className="bisect-stat">
                <div className="bisect-stat-val">{moves}</div>
                <div className="bisect-stat-label">Steps taken</div>
              </div>
              <div className="bisect-stat">
                <div className="bisect-stat-val">{maxMoves - moves < 0 ? 0 : maxMoves - moves}</div>
                <div className="bisect-stat-label">Steps remaining</div>
              </div>
              <div className="bisect-stat">
                <div className="bisect-stat-val">{hi - lo + 1}</div>
                <div className="bisect-stat-label">Commits left</div>
              </div>
            </div>

            {/* Auto log */}
            {autoLog.length > 0 && (
              <div className="bisect-auto-log" ref={autoLogRef}>
                {autoLog.map((l, i) => (
                  <div key={i} className={l.t}>{l.msg}</div>
                ))}
              </div>
            )}

            {/* Current commit */}
            {currentCommit && !done && !autoRunning && (
              <>
                <div className="bisect-detail">
                  <div className="bisect-detail-header">Testing commit #{currentIdx + 1} of {totalCommits}</div>
                  <div className="bisect-detail-hash">{currentCommit.hash}…</div>
                  <div className="bisect-detail-msg">{currentCommit.msg}</div>
                  <div className="bisect-detail-meta">
                    {currentCommit.author} · {currentCommit.date}
                  </div>
                  <div className="bisect-detail-diff" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                    <div style={{ color: '#6e7681', marginBottom: 6 }}>diff --git a/{currentCommit.diff.file}</div>
                    {currentCommit.diff.lines.map((l, i) => (
                      <div key={i} className={l.t}>{l.c}</div>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}>
                  After reviewing the diff and running your tests — does this commit have the bug?
                </div>
                <div className="bisect-actions">
                  <button className="bisect-action-btn bisect-good" onClick={() => markCurrent('good')}>
                    ✓ git bisect good — No bug here
                  </button>
                  <button className="bisect-action-btn bisect-bad" onClick={() => markCurrent('bad')}>
                    ✗ git bisect bad — Bug exists
                  </button>
                </div>
              </>
            )}

            {/* Done */}
            {done && (
              <div className="bisect-result" style={{ marginTop: 20 }}>
                <div className="bisect-result-title">Bug found!</div>
                <div className="bisect-result-hash">{currentCommit?.hash}… — {currentCommit?.msg}</div>
                <div className="bisect-result-sub">
                  Found in <strong>{moves} steps</strong> — {totalCommits} commits searched in O(log₂({totalCommits})) = ⌈{Math.ceil(Math.log2(totalCommits))}⌉ max steps.<br />
                  A manual linear search would have taken up to <strong>{totalCommits} steps</strong>.
                </div>
                <div style={{ marginTop: 16 }}>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, display: 'block', background: '#0d1117', padding: 12, borderRadius: 8, color: '#7dcf85', textAlign: 'left' }}>
                    {currentCommit?.hash}… is the first bad commit<br />
                    $ git bisect reset  # return to HEAD
                  </code>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GIT BLAME EXPLORER
// Teaches: blame output, -w flag, software archaeology
// ═══════════════════════════════════════════════════════════════════════════════
const BLAME_LINES = [
  { hash: 'a1b2c3d', author: 'Alice', date: '2024-01', msg: 'initial auth module', age: 1, code: `const express = require('express');` },
  { hash: 'a1b2c3d', author: 'Alice', date: '2024-01', msg: 'initial auth module', age: 1, code: `const jwt = require('jsonwebtoken');` },
  { hash: 'f7e8d9c', author: 'Bob', date: '2024-03', msg: 'add rate limiting', age: 3, code: `const rateLimit = require('express-rate-limit');` },
  { hash: 'a1b2c3d', author: 'Alice', date: '2024-01', msg: 'initial auth module', age: 1, code: `` },
  { hash: 'a1b2c3d', author: 'Alice', date: '2024-01', msg: 'initial auth module', age: 1, code: `const SECRET = process.env.JWT_SECRET;` },
  { hash: '2c3d4e5', author: 'Carol', date: '2024-05', msg: 'fix token expiry bug', age: 5, code: `const EXPIRY = process.env.TOKEN_EXPIRY || '15m';` },
  { hash: 'a1b2c3d', author: 'Alice', date: '2024-01', msg: 'initial auth module', age: 1, code: `` },
  { hash: '9f0a1b2', author: 'Dave', date: '2024-06', msg: 'prettier formatting', age: 6, code: `function generateToken(userId, role) {` },
  { hash: 'a1b2c3d', author: 'Alice', date: '2024-01', msg: 'initial auth module', age: 1, code: `  // TODO: add device fingerprint` },
  { hash: '2c3d4e5', author: 'Carol', date: '2024-05', msg: 'fix token expiry bug', age: 5, code: `  return jwt.sign({ userId, role }, SECRET, {` },
  { hash: '2c3d4e5', author: 'Carol', date: '2024-05', msg: 'fix token expiry bug', age: 5, code: `    expiresIn: EXPIRY,` },
  { hash: 'f7e8d9c', author: 'Bob', date: '2024-03', msg: 'add rate limiting', age: 3, code: `    issuer: 'myapp',` },
  { hash: 'a1b2c3d', author: 'Alice', date: '2024-01', msg: 'initial auth module', age: 1, code: `  });` },
  { hash: 'a1b2c3d', author: 'Alice', date: '2024-01', msg: 'initial auth module', age: 1, code: `}` },
  { hash: 'a1b2c3d', author: 'Alice', date: '2024-01', msg: 'initial auth module', age: 1, code: `` },
  { hash: 'e6d7c8b', author: 'Alice', date: '2024-08', msg: 'add refresh token support', age: 8, code: `function verifyToken(token) {` },
  { hash: 'e6d7c8b', author: 'Alice', date: '2024-08', msg: 'add refresh token support', age: 8, code: `  try {` },
  { hash: 'e6d7c8b', author: 'Alice', date: '2024-08', msg: 'add refresh token support', age: 8, code: `    return jwt.verify(token, SECRET);` },
  { hash: '9f0a1b2', author: 'Dave', date: '2024-06', msg: 'prettier formatting', age: 6, code: `  } catch (err) {` },
  { hash: 'e6d7c8b', author: 'Alice', date: '2024-08', msg: 'add refresh token support', age: 8, code: `    throw new Error('Invalid or expired token');` },
  { hash: '9f0a1b2', author: 'Dave', date: '2024-06', msg: 'prettier formatting', age: 6, code: `  }` },
  { hash: '9f0a1b2', author: 'Dave', date: '2024-06', msg: 'prettier formatting', age: 6, code: `}` },
];

// Age → color ramp: old = muted blue, new = vivid orange
const AGE_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d97706', '#ea580c', '#dc2626', '#b91c1c', '#991b1b'];

function BlameExplorer() {
  const [selected, setSelected] = useState(null);
  const [showDates, setShowDates] = useState(true);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);

  // With -w, Dave's "prettier formatting" lines get re-attributed to their original authors
  const effectiveLines = BLAME_LINES.map(l => {
    if (ignoreWhitespace && l.author === 'Dave' && l.msg === 'prettier formatting') {
      // Re-attribute to likely original author
      return { ...l, author: 'Alice', hash: 'a1b2c3d', date: '2024-01', msg: 'initial auth module (original logic)' };
    }
    return l;
  });

  const authorColors = { Alice: '#3b82f6', Bob: '#059669', Carol: '#8b5cf6', Dave: '#d97706' };

  return (
    <div className="blame-wrap">
      <div className="blame-header">
        <div className="blame-title">git blame src/auth.js</div>
        <div className="blame-options">
          <button className={`blame-opt-btn ${showDates ? 'active' : ''}`} onClick={() => setShowDates(d => !d)}>dates</button>
          <button
            className={`blame-opt-btn ${ignoreWhitespace ? 'active' : ''}`}
            onClick={() => { setIgnoreWhitespace(w => !w); setSelected(null); }}
            title="git blame -w — ignore whitespace-only changes"
          >
            -w (ignore whitespace)
          </button>
        </div>
      </div>

      {ignoreWhitespace && (
        <div style={{ padding: '10px 16px', background: 'rgba(217,119,6,0.06)', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}>
          ⚠ <strong style={{ color: 'var(--yellow)' }}>-w flag active:</strong> Dave's "prettier formatting" commit is ignored — lines re-attributed to original authors who wrote the logic.
        </div>
      )}

      <div className="blame-file-body">
        <table className="blame-table">
          <tbody>
            {effectiveLines.map((line, i) => (
              <tr
                key={i}
                className={`blame-row ${selected === i ? 'selected' : ''}`}
                onClick={() => setSelected(selected === i ? null : i)}
              >
                <td className="blame-td-hash">
                  <span className="blame-age-bar" style={{ background: AGE_COLORS[Math.min(line.age - 1, AGE_COLORS.length - 1)] }} />
                  <span style={{ color: authorColors[line.author] || 'var(--accent2)' }}>{line.hash}</span>
                </td>
                <td className="blame-td-author" style={{ color: authorColors[line.author] || 'var(--text3)' }}>{line.author}</td>
                {showDates && <td className="blame-td-date">{line.date}</td>}
                <td className="blame-td-lineno">{i + 1}</td>
                <td className="blame-td-code">{line.code || ' '}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected !== null && (
        <div className="blame-detail">
          <div className="blame-detail-section">
            <div className="blame-detail-label">Commit</div>
            <div className="blame-detail-content">
              <div className="blame-detail-hash">{effectiveLines[selected].hash}…</div>
              <div className="blame-detail-msg">{effectiveLines[selected].msg}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>
                {effectiveLines[selected].author} · {effectiveLines[selected].date}
              </div>
            </div>
          </div>
          <div className="blame-detail-section">
            <div className="blame-detail-label">What to do next</div>
            <div className="blame-detail-content" style={{ fontSize: 13 }}>
              Run <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)' }}>git show {effectiveLines[selected].hash}</code> to see the full diff of this commit and understand <em>why</em> this line was written this way before changing it.
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '12px 20px', background: 'rgba(59,130,246,0.04)', borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
        💡 Click any line to see its commit. Toggle <strong style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>-w</strong> to see how Dave's purely cosmetic "prettier formatting" commit falsely claims authorship of entire functions — and how <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>git blame -w</code> recovers the true authors.
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function Advanced() {
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
      <div className="adv-page">

        {/* ── HERO ── */}
        <div className="adv-hero">
          <div className="adv-hero-grid" />
          <div className="adv-hero-content">
            <div className="adv-chapter-badge"><span />Chapter 08</div>
            <h1 className="adv-hero-title">Advanced Git <em>Tools</em></h1>
            <p className="adv-hero-sub">
              Three powerful utilities that senior engineers reach for when things get complicated: the stash stack, binary search through history, and surgical blame annotation.
            </p>
            <div className="adv-hero-stats">
              <div className="adv-stat"><div className="adv-stat-num">LIFO</div><div className="adv-stat-label">Stash structure</div></div>
              <div className="adv-stat"><div className="adv-stat-num">log₂N</div><div className="adv-stat-label">Bisect steps</div></div>
              <div className="adv-stat"><div className="adv-stat-num">-w</div><div className="adv-stat-label">Blame flag to know</div></div>
              <div className="adv-stat"><div className="adv-stat-num">3</div><div className="adv-stat-label">Interactive demos</div></div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            SECTION 1: GIT STASH
        ══════════════════════════════════════════════════ */}
        <section className="adv-section fade-in-section">
          <div className="adv-label">State Management</div>
          <h2 className="adv-title">git stash — The LIFO work stack</h2>
          <p className="adv-desc">
            You're halfway through a feature when an urgent bug report arrives. You can't commit half-finished code. The stash is Git's designated place for incomplete work — a stack you push onto and pop from.
          </p>

          <p className="adv-body">
            The stash is not a branch. It's not a commit. It's a special stack structure inside <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>.git/refs/stash</code> backed by actual commit objects. Each stash entry is stored as a commit with two parents: one for the index state and one for the working directory state. This is why stashes survive branch switches and even repository clones (if you push the stash ref).
          </p>

          <CmdTable rows={[
            { cmd: 'git stash push -m "wip: login"', effect: 'Saves staged and unstaged changes to the top of the stack. Returns working directory to match HEAD exactly. The -m flag sets a descriptive message — always use it.' },
            { cmd: 'git stash push -u -m "msg"', effect: 'Also stashes untracked files (newly created files not yet `git add`ed). Without -u, those files stay in the working directory.' },
            { cmd: 'git stash list', effect: 'Shows all stash entries: stash@{0} is always the most recent. stash@{1} is below it. Numbers shift down when you pop the top.' },
            { cmd: 'git stash pop', effect: 'Applies stash@{0} to the working directory AND removes it from the stack. Fails if there are conflicts — resolve them then run `git stash drop` manually.' },
            { cmd: 'git stash apply stash@{2}', effect: 'Applies a specific stash entry but keeps it in the stack. Useful when you want to apply the same changes to multiple branches.' },
            { cmd: 'git stash drop stash@{0}', effect: 'Permanently deletes a stash entry. No recovery unless it\'s in the reflog.' },
            { cmd: 'git stash branch feature/wip', effect: 'Creates a new branch from the commit where you stashed, applies the stash, then drops it. Cleanest way to turn a stash into real work.' },
          ]} />

          <StashSimulator />

          <DeepDive title="What's actually inside a stash entry — it's a commit graph" badge="internals">
            <p>Run <code>git log --graph stash@{'{0}'}</code> and you'll see something surprising: each stash entry is actually two commit objects merged together. The first parent is the commit you were on when you stashed (HEAD). The second parent is a separate commit containing the state of your index at the time of stashing. The stash commit itself contains the working directory state.</p>
            <p>This three-node structure lets <code>git stash pop</code> restore both your staged and unstaged changes separately, preserving the distinction between "things I'd already added" and "things I hadn't staged yet." You can inspect the raw stash object with <code>git cat-file -p stash@{'{0}'}</code>.</p>
          </DeepDive>

          <DeepDive title="The stash anti-pattern — when NOT to use it" badge="best practice">
            <p>Engineers who stash frequently and accumulate stash@{'{'}5{'}'}, stash@{'{'}6{'}'}, stash@{'{'}7{'}'} have a workflow problem. Long-lived stashes become forgotten work. After a few days you won't remember what's in stash@{'{'}3{'}'}.</p>
            <p>A better pattern for context-switching: commit your WIP as a real commit (<code>git commit -m "wip: incomplete, do not merge"</code>), switch branches, do your work, then come back and use <code>git commit --amend</code> or <code>git reset HEAD~1</code> to un-commit the WIP when you're ready to continue. The reflog protects you, the work is named, and nothing is lost.</p>
          </DeepDive>

          <Callout type="warn" title="Stash pop conflicts are non-obvious">
            If your stash conflicts with changes on the current branch, <code>git stash pop</code> leaves the stash entry in the stack AND leaves your working directory in a conflicted state. You must resolve the conflicts manually, then run <code>git stash drop stash@{'{0}'}</code> yourself. The entry doesn't auto-delete on conflict — by design, to prevent data loss.
          </Callout>
        </section>

        {/* ══════════════════════════════════════════════════
            SECTION 2: GIT BISECT
        ══════════════════════════════════════════════════ */}
        <section className="adv-section fade-in-section">
          <div className="adv-label">Debugging</div>
          <h2 className="adv-title">git bisect — O(log N) bug hunting</h2>
          <p className="adv-desc">
            A bug exists in the current build but not in a release from 3 months ago. That's potentially 500 commits to search. Linear inspection would take days. Binary search finds the culprit in ⌈log₂(500)⌉ = 9 steps.
          </p>

          <p className="adv-body">
            Bisect implements a classic binary search through your commit history. You mark a "bad" commit (where the bug exists) and a "good" commit (where it didn't). Git checks out the exact midpoint. You test it. You mark it good or bad. Git cuts the remaining range in half and checks out the new midpoint. Repeat until the culprit commit is isolated.
          </p>

          <CodeBlock lang="bash" title="Manual bisect workflow">
{`git bisect start
git bisect bad HEAD              # Current state has the bug
git bisect good v2.3.0           # This release was known-good

# Git checks out the midpoint commit automatically
# You test your app, run tests, reproduce the bug...

git bisect good                  # or: git bisect bad
# Git moves to the next midpoint. Repeat until:

# a1b2c3d4 is the first bad commit
# commit a1b2c3d4...
#   Author: Bob <bob@example.com>
#   Date:   Mon Jan 15 14:23:01 2024
#   feat: add rate limiting middleware
#
# git bisect reset                # Return to HEAD when done`}
          </CodeBlock>

          <BisectGame />

          <div className="adv-divider" />

          <h3 className="adv-sub">Automated bisect — the real power</h3>
          <p className="adv-body">
            If you can express "is this commit bad?" as a script that exits 0 (success/good) or non-zero (failure/bad), Git can run the entire bisect loop automatically while you do something else. This is where bisect transforms from useful to extraordinary.
          </p>

          <CodeBlock lang="bash" title="git bisect run — fully automated">
{`git bisect start
git bisect bad HEAD
git bisect good v2.3.0

# Git runs this command at each midpoint:
git bisect run npm run test:auth
# Exit 0 → good commit. Exit 1 → bad commit.
# Git iterates the entire binary search unattended.

# Special exit codes:
# Exit 125 → "skip" this commit (e.g., doesn't compile)
# Exit 128+ → abort the entire bisect session

# Works with any test runner, compile step, or health check:
git bisect run bash -c "make && ./run-test.sh"
git bisect run python test_regression.py
git bisect run curl -sf http://localhost:3000/health`}
          </CodeBlock>

          <DeepDive title="Skipping commits — when a midpoint doesn't compile" badge="practical">
            <p>Sometimes the midpoint commit is in a broken-but-different-way state — it doesn't compile, or it's missing a dependency that was added later. You can skip it with <code>git bisect skip</code>. Git will pick another commit nearby instead. You can also specify a range to skip: <code>git bisect skip v2.4..v2.5</code>.</p>
            <p>In automated mode, exit with code 125 to signal a skip. Git is tolerant of sparse skips but if you skip too many commits in the search range, it can't isolate the culprit and will give you a range instead of a single commit.</p>
          </DeepDive>

          <Callout type="success" title="The real-world impact of log₂(N)">
            A monorepo with 100,000 commits (not unusual for a 10-year-old codebase) requires at most ⌈log₂(100,000)⌉ = 17 automated test runs to isolate any bug to a single commit. If each test run takes 2 minutes, you find the culprit in 34 minutes — unattended.
          </Callout>
        </section>

        {/* ══════════════════════════════════════════════════
            SECTION 3: GIT BLAME
        ══════════════════════════════════════════════════ */}
        <section className="adv-section fade-in-section">
          <div className="adv-label">Code Archaeology</div>
          <h2 className="adv-title">git blame — Who wrote this and why</h2>
          <p className="adv-desc">
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>git blame</code> annotates every line of a file with the commit hash, author, and date of the last change. The real skill is knowing how to use it — and when the output lies.
          </p>

          <p className="adv-body">
            The word "blame" is a misnomer — experienced engineers use it not to assign fault but to understand context. When you find a piece of code that looks wrong or bizarre, <em>don't delete it immediately.</em> Instead: blame the file, find the commit, read the full commit message with <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>git show {'<hash>'}</code>. The code might be a deliberate workaround for a browser bug, a legal compliance requirement, or a performance optimization that looks wrong but isn't.
          </p>

          <CmdTable rows={[
            { cmd: 'git blame src/auth.js', effect: 'Annotates every line with the commit hash (abbreviated), author name, timestamp, and original line number.' },
            { cmd: 'git blame -w src/auth.js', effect: 'Ignores whitespace-only changes. Critical: without -w, a developer who ran Prettier on a file appears to have "written" every line in it.' },
            { cmd: 'git blame -L 15,30 src/auth.js', effect: 'Restricts output to lines 15 through 30. Accepts function names: -L :validateToken,+20 (from the function definition, 20 lines).' },
            { cmd: 'git blame --since=6.months src/auth.js', effect: 'Only shows authorship for changes made in the last 6 months. Older lines are shown as "not yet modified."' },
            { cmd: 'git blame -M src/auth.js', effect: 'Detects lines moved or copied from other files in the same commit. Without -M, moved lines look newly written by whoever moved them.' },
            { cmd: 'git blame -C -C src/auth.js', effect: 'Tracks lines copied from other files across commits. -C once checks the same commit; -C -C checks parent commits too.' },
          ]} />

          <BlameExplorer />

          <div className="adv-divider" />

          <h3 className="adv-sub">The whitespace lie — why -w matters every time</h3>
          <p className="adv-body">
            The most common blame mistake: a developer runs a code formatter (Prettier, Black, gofmt) across a large file. Every line changes — the indentation, trailing spaces, quote style. Without <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>git blame -w</code>, this person now appears to be the author of the entire file. The real authorship history is buried. Toggle the <strong>-w flag</strong> in the explorer above to see this in action with Dave's "prettier formatting" commit.
          </p>

          <div className="blame-whitespace-demo">
            <div className="blame-ws-card">
              <div className="blame-ws-card-header" style={{ color: 'var(--red)' }}>git blame (no -w) — misleading</div>
              <div className="blame-ws-card-body">
                <div><span style={{ color: 'var(--yellow)' }}>9f0a1b2</span> Dave  2024-06  <span style={{ color: 'var(--text2)' }}>function generateToken(userId) {'{'}</span></div>
                <div><span style={{ color: 'var(--yellow)' }}>9f0a1b2</span> Dave  2024-06  <span style={{ color: 'var(--text2)' }}>  return jwt.sign({'{'} userId {'}'}, SECRET);</span></div>
                <div><span style={{ color: 'var(--yellow)' }}>9f0a1b2</span> Dave  2024-06  <span style={{ color: 'var(--text2)' }}>{'}'}</span></div>
                <div style={{ marginTop: 8, fontSize: 10, color: 'var(--red)' }}>Dave appears to have written this function. He didn't — he just reformatted it.</div>
              </div>
            </div>
            <div className="blame-ws-card">
              <div className="blame-ws-card-header" style={{ color: 'var(--green)' }}>git blame -w — accurate</div>
              <div className="blame-ws-card-body">
                <div><span style={{ color: '#3b82f6' }}>a1b2c3d</span> Alice 2024-01  <span style={{ color: 'var(--text2)' }}>function generateToken(userId) {'{'}</span></div>
                <div><span style={{ color: '#3b82f6' }}>a1b2c3d</span> Alice 2024-01  <span style={{ color: 'var(--text2)' }}>  return jwt.sign({'{'} userId {'}'}, SECRET);</span></div>
                <div><span style={{ color: '#3b82f6' }}>a1b2c3d</span> Alice 2024-01  <span style={{ color: 'var(--text2)' }}>{'}'}</span></div>
                <div style={{ marginTop: 8, fontSize: 10, color: 'var(--green)' }}>Alice is correctly shown as the author. Whitespace changes ignored.</div>
              </div>
            </div>
          </div>

          <DeepDive title="Going further back — blaming across file renames and splits" badge="advanced">
            <p>By default, <code>git blame</code> stops at the file's creation. But what if <code>auth.js</code> was split off from a larger <code>utils.js</code> file two years ago? The early history appears lost. Use <code>git log --follow src/auth.js</code> to find the rename/split commit, then run blame from that point backwards on the old filename.</p>
            <p>For cross-file copy tracking, use <code>git blame -C -C -C</code> (three -C flags) which searches all commits across the entire repository for lines that were copied in. This is expensive but surfaces the true origin of any line in the codebase.</p>
          </DeepDive>

          <Callout type="info" title="git log -S — the pickaxe, blame's more powerful sibling">
            When you need to find which commit added or removed a specific string (not just what the current author of a line is), use the pickaxe: <code>git log -S "validateToken" --source --all</code>. This searches the entire history for commits that changed the count of occurrences of that string. It's how you answer "when did this function first appear?" or "who deleted the call to this method?"
          </Callout>
        </section>

        {/* ══════════════════════════════════════════════════
            SECTION 4: REFERENCE
        ══════════════════════════════════════════════════ */}
        <section className="adv-section fade-in-section">
          <div className="adv-label">Quick Reference</div>
          <h2 className="adv-title">Advanced tools cheatsheet</h2>

          <CodeBlock lang="bash" title="git stash">
{`# Push / save
git stash                        # Quick stash (no message — avoid in practice)
git stash push -m "wip: login"  # Always name your stashes
git stash push -u -m "msg"      # Include untracked files
git stash push -p -m "partial"  # Interactively choose which chunks to stash

# Inspect
git stash list                   # Show all stash entries
git stash show stash@{1}         # Show stat diff for a specific entry
git stash show -p stash@{1}      # Show full patch diff

# Apply / restore
git stash pop                    # Apply top + remove from stack
git stash apply stash@{2}        # Apply specific entry, keep in stack
git stash branch feature/wip     # New branch from stash point + apply

# Cleanup
git stash drop stash@{0}         # Delete one entry
git stash clear                  # Delete ALL stashes — irreversible`}
          </CodeBlock>

          <CodeBlock lang="bash" title="git bisect">
{`# Core workflow
git bisect start
git bisect bad [commit]          # Default: HEAD
git bisect good [commit]         # A known-good tag or hash
git bisect good / git bisect bad # After testing each midpoint
git bisect skip                  # Commit doesn't compile or is unrelated
git bisect reset                 # Exit bisect, return to original HEAD

# Automated
git bisect run <script>          # Exit 0=good, 1-127=bad, 125=skip
git bisect run npm test
git bisect run python test.py -- --only auth

# Inspection
git bisect log                   # Show your good/bad decisions so far
git bisect log > bisect.log      # Save session to replay later
git bisect replay bisect.log     # Replay a saved session`}
          </CodeBlock>

          <CodeBlock lang="bash" title="git blame">
{`# Core
git blame src/auth.js            # Annotate all lines
git blame -w src/auth.js         # Ignore whitespace changes (always use this)
git blame -L 10,30 src/auth.js   # Lines 10-30 only
git blame -L :functionName src/auth.js  # From function definition

# Copy detection
git blame -M src/auth.js         # Detect moved lines within commit
git blame -C src/auth.js         # Detect lines copied from other files
git blame -C -C -C src/auth.js   # Detect copies across all commits (slow)

# Filtering
git blame --since=3.months src/auth.js
git blame v2.0..HEAD src/auth.js # Only show changes since v2.0

# Related commands
git log -S "search string"       # Find commit that added/removed string (pickaxe)
git log -G "regex pattern"       # Find commit where diff matches regex
git show <hash>                  # Full diff of the commit blame points to`}
          </CodeBlock>
        </section>

      </div>
    </>
  );
}