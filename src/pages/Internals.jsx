import React, { useState, useEffect, useRef } from 'react';

// ─── DESIGN TOKENS (inline so component is self-contained) ───────────────────
const styles = `
  .int-page { padding: 48px 0 100px; }

  /* ── Hero ── */
  .int-hero {
    padding: 80px 10% 60px;
    border-bottom: 1px solid var(--border);
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .int-hero-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: 0.25;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent);
    pointer-events: none;
  }
  .int-hero-content { position: relative; z-index: 1; }
  .int-chapter-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 14px;
    background: rgba(59,130,246,0.08);
    border: 1px solid rgba(59,130,246,0.25);
    border-radius: 20px;
    font-size: 11px; font-family: var(--font-mono); color: var(--accent);
    letter-spacing: 1px; text-transform: uppercase;
    margin-bottom: 20px;
  }
  .int-chapter-badge span {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--accent); display: inline-block;
  }
  .int-hero-title {
    font-family: var(--font-display);
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 800; line-height: 1.05; letter-spacing: -2px;
    margin-bottom: 16px;
  }
  .int-hero-title em {
    font-style: normal;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .int-hero-sub {
    font-size: 16px; color: var(--text2); line-height: 1.7;
    max-width: 560px; margin: 0 auto 32px;
  }
  .int-hero-stats {
    display: flex; gap: 40px; justify-content: center; flex-wrap: wrap;
  }
  .int-stat { text-align: center; }
  .int-stat-num {
    font-family: var(--font-display); font-size: 26px; font-weight: 800;
    color: var(--accent);
  }
  .int-stat-label {
    font-size: 11px; color: var(--text3);
    font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.5px;
  }

  /* ── Section shell ── */
  .int-section {
    width: 80%; margin: 0 10%;
    padding: 64px 0;
    border-bottom: 1px solid var(--border);
  }
  .int-label {
    font-family: var(--font-mono); font-size: 11px; color: var(--accent);
    text-transform: uppercase; letter-spacing: 3px; margin-bottom: 10px;
  }
  .int-title {
    font-family: var(--font-display);
    font-size: clamp(28px, 3.5vw, 40px);
    font-weight: 800; letter-spacing: -1px; line-height: 1.1;
    margin-bottom: 12px;
  }
  .int-desc { font-size: 15px; color: var(--text2); line-height: 1.7; margin-bottom: 32px; }
  .int-body { font-size: 15px; color: var(--text2); line-height: 1.7; margin-bottom: 20px; }
  .int-body strong { color: var(--text); }
  .int-sub { font-family: var(--font-display); font-size: 22px; font-weight: 700; margin: 40px 0 12px; }
  .int-divider { height: 1px; background: var(--border); margin: 48px 0; }

  /* ── Code block ── */
  .int-code {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 10px; overflow: hidden; margin: 20px 0;
    font-family: var(--font-mono); font-size: 13px; line-height: 1.7;
  }
  .int-code-header {
    background: var(--surface); border-bottom: 1px solid var(--border);
    padding: 10px 16px; display: flex; align-items: center; gap: 8px;
  }
  .int-code-dot { width: 10px; height: 10px; border-radius: 50%; }
  .int-code-lang {
    margin-left: auto; font-size: 11px; color: var(--text3);
    text-transform: uppercase; letter-spacing: 1px;
  }
  .int-code pre { margin: 0; padding: 16px; overflow-x: auto; color: var(--text2); }
  .int-code .kw { color: var(--accent2); }
  .int-code .str { color: var(--green); }
  .int-code .cm { color: var(--text3); font-style: italic; }
  .int-code .hl { background: rgba(59,130,246,0.08); display: block; margin: 0 -16px; padding: 0 16px; }

  /* ── Warning / Callout ── */
  .int-callout {
    border-radius: 10px; padding: 16px 20px; margin: 20px 0;
    border: 1px solid;
  }
  .int-callout.info { background: rgba(59,130,246,0.05); border-color: rgba(59,130,246,0.2); }
  .int-callout.warn { background: rgba(217,119,6,0.05); border-color: rgba(217,119,6,0.2); }
  .int-callout.danger { background: rgba(220,38,38,0.05); border-color: rgba(220,38,38,0.2); }
  .int-callout.success { background: rgba(5,150,105,0.05); border-color: rgba(5,150,105,0.2); }
  .int-callout-title {
    font-weight: 700; font-size: 13px; margin-bottom: 6px;
    font-family: var(--font-mono);
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .int-callout.info .int-callout-title { color: var(--accent); }
  .int-callout.warn .int-callout-title { color: var(--yellow); }
  .int-callout.danger .int-callout-title { color: var(--red); }
  .int-callout.success .int-callout-title { color: var(--green); }
  .int-callout p { font-size: 14px; color: var(--text2); line-height: 1.6; margin: 0; }

  /* ── Tabs ── */
  .int-tabs { margin: 24px 0; }
  .int-tab-list { display: flex; gap: 4px; border-bottom: 1px solid var(--border); margin-bottom: 24px; flex-wrap: wrap; }
  .int-tab-btn {
    padding: 8px 18px; background: none; border: none; cursor: pointer;
    font-family: var(--font-body); font-size: 14px; font-weight: 500;
    color: var(--text3); border-bottom: 2px solid transparent;
    margin-bottom: -1px; transition: all 0.18s;
  }
  .int-tab-btn:hover { color: var(--text); }
  .int-tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }

  /* ── Object Type cards ── */
  .obj-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 24px 0; }
  .obj-card {
    border: 1px solid var(--border); border-radius: 12px;
    padding: 20px; cursor: pointer; transition: all 0.2s;
    background: var(--surface);
    position: relative; overflow: hidden;
  }
  .obj-card::before {
    content: ''; position: absolute; inset: 0;
    opacity: 0; transition: opacity 0.2s;
  }
  .obj-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.07); }
  .obj-card.active { border-color: var(--accent); }
  .obj-card.active::before { opacity: 1; }
  .obj-icon {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; margin-bottom: 12px;
  }
  .obj-card-name { font-weight: 700; font-size: 15px; margin-bottom: 4px; color: var(--text); }
  .obj-card-sub { font-size: 12px; color: var(--text3); font-family: var(--font-mono); }
  .obj-detail {
    border: 1px solid var(--border); border-radius: 12px;
    background: var(--bg2); padding: 24px; margin: 16px 0;
    animation: fadeSlide 0.25s ease;
  }
  @keyframes fadeSlide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .obj-detail-title { font-family: var(--font-mono); font-size: 12px; color: var(--accent); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
  .obj-detail-content { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  @media (max-width: 640px) { .obj-detail-content { grid-template-columns: 1fr; } }
  .obj-struct { font-family: var(--font-mono); font-size: 12px; line-height: 1.8; color: var(--text2); }
  .obj-struct .field { color: var(--accent); }
  .obj-struct .type { color: var(--accent2); }
  .obj-struct .val { color: var(--green); }
  .obj-chain { display: flex; flex-direction: column; gap: 8px; }
  .obj-chain-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--surface);
    font-family: var(--font-mono); font-size: 12px;
  }
  .obj-chain-hash { color: var(--accent); font-weight: 600; }
  .obj-chain-arrow { color: var(--text3); font-size: 10px; }
  .obj-fact { padding: 12px; background: var(--surface); border-radius: 8px; border: 1px solid var(--border); }
  .obj-fact-label { font-size: 11px; color: var(--text3); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .obj-fact-value { font-size: 14px; color: var(--text); font-weight: 600; }
  .obj-facts { display: flex; flex-direction: column; gap: 10px; }

  /* ── SHA-1 Hasher ── */
  .hasher-wrap { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin: 24px 0; }
  .hasher-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 14px 20px; }
  .hasher-header-title { font-family: var(--font-mono); font-size: 13px; font-weight: 600; color: var(--text); }
  .hasher-header-sub { font-size: 12px; color: var(--text3); margin-top: 2px; }
  .hasher-body { padding: 20px; }
  .hasher-input {
    width: 100%; padding: 12px 14px;
    background: var(--bg2); border: 1px solid var(--border); border-radius: 8px;
    font-family: var(--font-mono); font-size: 13px; color: var(--text);
    resize: vertical; min-height: 80px; outline: none;
    transition: border-color 0.2s;
  }
  .hasher-input:focus { border-color: var(--accent); }
  .hasher-arrow { text-align: center; padding: 12px 0; color: var(--text3); font-size: 20px; }
  .hasher-hash {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 8px;
    padding: 12px 14px; font-family: var(--font-mono); font-size: 13px;
    word-break: break-all; line-height: 1.6;
  }
  .hasher-hash .dir { color: var(--accent); font-weight: 700; }
  .hasher-hash .file { color: var(--accent2); }
  .hasher-insight {
    margin-top: 16px; padding: 12px; background: rgba(59,130,246,0.05);
    border-radius: 8px; border: 1px solid rgba(59,130,246,0.15);
    font-size: 13px; color: var(--text2); line-height: 1.6;
  }
  .hasher-change-btn {
    margin-top: 10px; padding: 8px 16px;
    background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2);
    border-radius: 6px; font-family: var(--font-mono); font-size: 12px;
    color: var(--accent); cursor: pointer; transition: all 0.2s;
  }
  .hasher-change-btn:hover { background: rgba(59,130,246,0.15); }

  /* ── .git Folder Explorer ── */
  .folder-wrap { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin: 24px 0; display: grid; grid-template-columns: 260px 1fr; }
  @media (max-width: 700px) { .folder-wrap { grid-template-columns: 1fr; } }
  .folder-tree { border-right: 1px solid var(--border); background: var(--bg2); }
  .folder-tree-header { padding: 12px 16px; border-bottom: 1px solid var(--border); background: var(--surface); font-family: var(--font-mono); font-size: 12px; color: var(--text3); display: flex; align-items: center; gap: 8px; }
  .folder-tree-header span { width: 8px; height: 8px; border-radius: 50%; }
  .folder-tree-list { padding: 8px 0; }
  .folder-node {
    padding: 6px 12px 6px calc(var(--depth) * 16px + 12px);
    font-family: var(--font-mono); font-size: 12px; color: var(--text2);
    cursor: pointer; display: flex; align-items: center; gap: 6px;
    transition: background 0.15s; user-select: none;
  }
  .folder-node:hover { background: var(--surface); }
  .folder-node.active { background: rgba(59,130,246,0.08); color: var(--accent); }
  .folder-node .icon { font-size: 14px; flex-shrink: 0; }
  .folder-node .toggle { width: 12px; flex-shrink: 0; color: var(--text3); font-size: 10px; }
  .folder-content { padding: 24px; }
  .folder-content-empty { color: var(--text3); font-size: 13px; font-family: var(--font-mono); }
  .folder-content-title { font-family: var(--font-mono); font-size: 11px; color: var(--accent); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
  .folder-content-body { font-family: var(--font-mono); font-size: 13px; color: var(--text2); line-height: 1.8; word-break: break-all; }
  .folder-content-body .hash { color: var(--accent2); }
  .folder-content-body .key { color: var(--accent); }
  .folder-content-body .val { color: var(--green); }
  .folder-content-body .comment { color: var(--text3); font-size: 11px; }
  .folder-explanation { margin-top: 16px; padding: 12px; background: var(--bg2); border-radius: 8px; border: 1px solid var(--border); font-size: 13px; color: var(--text2); line-height: 1.6; }
  .folder-explanation strong { color: var(--text); }

  /* ── Object Graph Visualizer ── */
  .graph-wrap { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin: 24px 0; }
  .graph-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .graph-title { font-family: var(--font-mono); font-size: 13px; font-weight: 600; }
  .graph-controls { display: flex; gap: 8px; }
  .graph-ctrl-btn {
    padding: 6px 14px; border-radius: 6px; border: 1px solid var(--border);
    background: var(--surface2); font-family: var(--font-body); font-size: 12px;
    color: var(--text2); cursor: pointer; transition: all 0.15s;
  }
  .graph-ctrl-btn:hover { background: var(--bg3); color: var(--text); }
  .graph-ctrl-btn.active { background: rgba(59,130,246,0.1); border-color: rgba(59,130,246,0.3); color: var(--accent); }
  .graph-canvas { padding: 24px; overflow-x: auto; }
  .graph-svg-wrap { min-width: 600px; }
  .graph-legend { display: flex; gap: 16px; flex-wrap: wrap; padding: 12px 20px; border-top: 1px solid var(--border); background: var(--bg2); }
  .graph-legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text3); font-family: var(--font-mono); }
  .graph-legend-dot { width: 10px; height: 10px; border-radius: 2px; }

  /* ── Packfile viz ── */
  .pack-wrap { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin: 24px 0; }
  .pack-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 14px 20px; }
  .pack-title { font-family: var(--font-mono); font-size: 13px; font-weight: 600; }
  .pack-body { padding: 24px; }
  .pack-slider-row { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  .pack-slider-label { font-size: 13px; color: var(--text2); white-space: nowrap; }
  .pack-slider { flex: 1; }
  .pack-slider-val { font-family: var(--font-mono); font-size: 13px; color: var(--accent); min-width: 36px; text-align: right; }
  .pack-file-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 8px; margin: 16px 0; }
  .pack-file {
    border: 1px solid var(--border); border-radius: 8px; padding: 8px;
    font-family: var(--font-mono); font-size: 10px; color: var(--text3);
    background: var(--bg2); text-align: center; transition: all 0.3s;
  }
  .pack-file.packed { background: rgba(59,130,246,0.06); border-color: rgba(59,130,246,0.2); color: var(--accent); }
  .pack-file-name { font-weight: 600; margin-bottom: 2px; font-size: 11px; }
  .pack-file-hash { font-size: 9px; opacity: 0.7; }
  .pack-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 20px 0; }
  .pack-stat { background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; padding: 12px; text-align: center; }
  .pack-stat-val { font-family: var(--font-display); font-size: 20px; font-weight: 800; color: var(--accent); }
  .pack-stat-label { font-size: 11px; color: var(--text3); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.5px; }
  .pack-gc-btn {
    padding: 10px 24px; background: var(--accent); color: white; border: none;
    border-radius: 8px; font-family: var(--font-body); font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
  }
  .pack-gc-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(59,130,246,0.3); }
  .pack-gc-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

  /* ── Immutability demo ── */
  .immut-wrap { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin: 24px 0; }
  .immut-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 14px 20px; font-family: var(--font-mono); font-size: 13px; font-weight: 600; }
  .immut-body { padding: 24px; }
  .immut-chain { display: flex; flex-direction: column; gap: 0; }
  .immut-commit {
    border: 1px solid var(--border); border-radius: 10px; padding: 16px;
    background: var(--surface); transition: all 0.3s; cursor: default;
  }
  .immut-commit.tampered { border-color: var(--red); background: rgba(220,38,38,0.04); }
  .immut-commit.invalid { border-color: rgba(220,38,38,0.3); opacity: 0.7; }
  .immut-commit.valid-chain { border-color: var(--green); background: rgba(5,150,105,0.04); }
  .immut-connector {
    width: 2px; height: 24px; background: var(--border);
    margin: 0 0 0 24px; transition: background 0.3s;
  }
  .immut-connector.broken { background: var(--red); }
  .immut-commit-hash { font-family: var(--font-mono); font-size: 12px; color: var(--accent2); margin-bottom: 6px; font-weight: 600; }
  .immut-commit-msg { font-size: 14px; color: var(--text); font-weight: 600; margin-bottom: 4px; }
  .immut-commit-meta { font-size: 12px; color: var(--text3); font-family: var(--font-mono); }
  .immut-commit-meta span { color: var(--text2); }
  .immut-edit-field {
    margin-top: 10px; display: flex; gap: 8px; align-items: center;
  }
  .immut-edit-input {
    flex: 1; padding: 6px 10px;
    background: var(--bg2); border: 1px solid var(--border); border-radius: 6px;
    font-family: var(--font-mono); font-size: 12px; color: var(--text);
    outline: none; transition: border-color 0.2s;
  }
  .immut-edit-input:focus { border-color: var(--red); }
  .immut-alert {
    margin-top: 16px; padding: 14px; border-radius: 8px;
    background: rgba(220,38,38,0.06); border: 1px solid rgba(220,38,38,0.2);
    font-size: 13px; color: var(--red); line-height: 1.6;
    animation: fadeSlide 0.3s ease;
  }
  .immut-success {
    margin-top: 16px; padding: 14px; border-radius: 8px;
    background: rgba(5,150,105,0.06); border: 1px solid rgba(5,150,105,0.2);
    font-size: 13px; color: var(--green); line-height: 1.6;
  }

  /* ── Plumbing terminal ── */
  .plumb-wrap { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin: 24px 0; }
  .plumb-header { background: #1a1a2e; padding: 12px 16px; display: flex; align-items: center; gap: 8px; }
  .plumb-dot { width: 12px; height: 12px; border-radius: 50%; }
  .plumb-header-title { margin-left: auto; font-family: var(--font-mono); font-size: 12px; color: #4a5568; }
  .plumb-body { background: var(--bg2); padding: 20px; font-family: var(--font-mono); font-size: 13px; line-height: 1.8; min-height: 220px; max-height: 400px; overflow-y: auto; }
  .plumb-line-prompt { color: #58a6ff; }
  .plumb-line-cmd { color: #e2e8f0; }
  .plumb-line-out { color: #7dcf85; }
  .plumb-line-key { color: #79c0ff; }
  .plumb-line-hash { color: #d2a8ff; }
  .plumb-line-comment { color: #6e7681; font-style: italic; }
  .plumb-controls { padding: 16px; background: var(--surface); border-top: 1px solid var(--border); display: flex; gap: 10px; flex-wrap: wrap; }
  .plumb-cmd-btn {
    padding: 8px 16px; border-radius: 6px;
    background: var(--bg2); border: 1px solid #30363d;
    font-family: var(--font-mono); font-size: 12px; color: #58a6ff;
    cursor: pointer; transition: all 0.15s;
  }
  .plumb-cmd-btn:hover { background: #161b22; border-color: #58a6ff; }
  .plumb-cmd-btn.active { background: rgba(88,166,255,0.1); border-color: #58a6ff; }

  /* ── Deep Dive accordion ── */
  .deepdive { border: 1px solid var(--border); border-radius: 10px; margin: 20px 0; overflow: hidden; }
  .deepdive-header {
    padding: 14px 18px; background: var(--surface); display: flex;
    align-items: center; gap: 10px; cursor: pointer;
    transition: background 0.15s; user-select: none;
  }
  .deepdive-header:hover { background: var(--bg2); }
  .deepdive-icon { font-size: 14px; color: var(--accent2); }
  .deepdive-title { font-size: 14px; font-weight: 600; color: var(--text); flex: 1; }
  .deepdive-badge {
    font-family: var(--font-mono); font-size: 10px; padding: 2px 8px;
    background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.2);
    color: var(--accent2); border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .deepdive-chevron { color: var(--text3); font-size: 12px; transition: transform 0.2s; }
  .deepdive-chevron.open { transform: rotate(180deg); }
  .deepdive-body { padding: 20px; background: var(--bg2); border-top: 1px solid var(--border); }
  .deepdive-body p { font-size: 14px; color: var(--text2); line-height: 1.7; margin-bottom: 12px; }
  .deepdive-body p:last-child { margin-bottom: 0; }
`;

// ─── SMALL REUSABLE BITS ─────────────────────────────────────────────────────
function CodeBlock({ title, lang, children }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const text = typeof children === 'string' ? children : children.props?.children || '';
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="int-code">
      <div className="int-code-header">
        <span className="int-code-dot" style={{ background: '#ff5f57' }} />
        <span className="int-code-dot" style={{ background: '#ffbd2e' }} />
        <span className="int-code-dot" style={{ background: '#28c840' }} />
        {title && <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text3)' }}>{title}</span>}
        <span className="int-code-lang">{lang}</span>
        <button onClick={copy} style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: copied ? 'var(--green)' : 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>
      <pre>{children}</pre>
    </div>
  );
}

function Callout({ type = 'info', title, children }) {
  const icons = { info: 'ⓘ', warn: '⚠', danger: '⛔', success: '✓' };
  return (
    <div className={`int-callout ${type}`}>
      <div className="int-callout-title">{icons[type]} {title}</div>
      <p>{children}</p>
    </div>
  );
}

function DeepDive({ title, badge = 'internals', children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="deepdive">
      <div className="deepdive-header" onClick={() => setOpen(o => !o)}>
        <span className="deepdive-icon">⬡</span>
        <span className="deepdive-title">{title}</span>
        <span className="deepdive-badge">{badge}</span>
        <span className={`deepdive-chevron ${open ? 'open' : ''}`}>▼</span>
      </div>
      {open && <div className="deepdive-body">{children}</div>}
    </div>
  );
}

// ─── SECTION 1: THE SHA-1 CONTENT HASHER ────────────────────────────────────
// Teaches: content-addressability. Change one char → completely different hash.
function SHA1Hasher() {
  const [input, setInput] = useState('Hello, Git!');
  const [hash, setHash] = useState('');
  const [prevHash, setPrevHash] = useState('');

  // Simulated (not real SHA1 — we generate a deterministic fake for demo purposes)
  const simHash = (str) => {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    // Stretch to 40 chars using 5 rounds
    let result = '';
    let seed = h;
    for (let r = 0; r < 5; r++) {
      seed = (Math.imul(seed, 0x5851f42d) + 0x14057b7e) >>> 0;
      result += seed.toString(16).padStart(8, '0');
    }
    return result;
  };

  useEffect(() => {
    const h = simHash(input);
    setPrevHash(hash);
    setHash(h);
  }, [input]);

  // Diff: how many chars changed between prevHash and hash
  const diffCount = prevHash ? [...hash].filter((c, i) => c !== prevHash[i]).length : 40;

  return (
    <div className="hasher-wrap">
      <div className="hasher-header">
        <div className="hasher-header-title">Content-Addressable Storage Demo</div>
        <div className="hasher-header-sub">Type anything below — watch the hash transform completely</div>
      </div>
      <div className="hasher-body">
        <textarea
          className="hasher-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type file contents here…"
        />
        <div className="hasher-arrow">↓ SHA-1</div>
        <div className="hasher-hash">
          <span className="dir">{hash.slice(0, 2)}</span>
          <span style={{ color: 'var(--text3)' }}>/</span>
          <span className="file">{hash.slice(2)}</span>
        </div>
        <div className="hasher-insight">
          {prevHash && diffCount > 0 ? (
            <>
              <strong style={{ color: 'var(--text)' }}>{diffCount}/40 characters</strong> changed in the hash.
              Even a single character change cascades across the entire 40-char output.
              This is the <strong style={{ color: 'var(--text)' }}>avalanche effect</strong> of SHA-1 —
              making it impossible to predict the hash without running the algorithm.
            </>
          ) : (
            <>
              The first 2 hex characters (<strong style={{ color: 'var(--accent)' }}>{hash.slice(0, 2)}</strong>) 
              become the <strong style={{ color: 'var(--text)' }}>directory name</strong> inside{' '}
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent2)' }}>.git/objects/</code>.
              The remaining 38 characters become the <strong style={{ color: 'var(--text)' }}>filename</strong>.
            </>
          )}
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            'Hello, Git!',
            'Hello, Git.',  // one char change
            'blob 11\0Hello, Git!', // real blob format
            'print("hello world")',
          ].map(s => (
            <button key={s} className="hasher-change-btn" onClick={() => setInput(s)}>
              {s.length > 24 ? s.slice(0, 22) + '…' : s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SECTION 2: OBJECT TYPE EXPLORER ────────────────────────────────────────
const OBJECT_TYPES = [
  {
    id: 'blob',
    icon: '📄',
    name: 'Blob',
    sub: 'Binary Large Object',
    color: '#3b82f6',
    facts: [
      { label: 'Stores', value: 'Raw file bytes only' },
      { label: 'Knows filename?', value: 'No — never' },
      { label: 'Knows path?', value: 'No — never' },
      { label: 'Knows permissions?', value: 'No — stored in Tree' },
    ],
    struct: [
      { field: 'header', type: 'string', val: '"blob 1234\\0"' },
      { field: 'content', type: 'bytes', val: '<raw file bytes>' },
    ],
    chain: [
      { hash: 'e69de2…', label: 'blob (empty file)', note: '100% deduplication: all empty files share this exact hash' },
      { hash: 'a3b4c5…', label: 'blob "console.log(…"', note: 'The same file content = identical hash across all repos' },
    ],
    insight: "A blob is Git's most primitive object. It stores exactly the bytes of one file version — nothing more. If you rename a file, Git doesn't create a new blob. If 100 repos have the same file, they share one blob. This is how Git achieves storage deduplication.",
  },
  {
    id: 'tree',
    icon: '📁',
    name: 'Tree',
    sub: 'Directory Snapshot',
    color: '#059669',
    facts: [
      { label: 'Stores', value: 'Filenames + permissions + pointers' },
      { label: 'Points to', value: 'Blobs (files) and other Trees (dirs)' },
      { label: 'Recursive?', value: 'Yes — trees point to trees' },
      { label: 'Root tree', value: 'Represents your entire project root' },
    ],
    struct: [
      { field: 'mode', type: 'octal', val: '100644' },
      { field: 'type', type: 'string', val: '"blob"' },
      { field: 'sha1', type: 'hash', val: 'a3b4c5…' },
      { field: 'name', type: 'string', val: '"README.md"' },
    ],
    chain: [
      { hash: '4b825d…', label: 'tree (empty repo root)', note: 'The SHA-1 of an empty tree is constant across all Git repos' },
      { hash: '81c4e7…', label: 'tree /src/', note: 'Points to blobs for each file in the /src/ directory' },
    ],
    insight: "Trees are Git's directories. They list entries: each entry has a mode (permissions), type (blob or tree), hash pointer, and filename. A tree pointing to another tree creates a directory hierarchy. The root commit's tree pointer IS your project snapshot.",
  },
  {
    id: 'commit',
    icon: '🔖',
    name: 'Commit',
    sub: 'History Entry',
    color: '#8b5cf6',
    facts: [
      { label: 'Points to', value: 'Exactly one root Tree' },
      { label: 'Parent(s)', value: '0 (initial), 1 (normal), 2+ (merge)' },
      { label: 'Immutable?', value: 'Yes — hash proves content' },
      { label: 'Stores', value: 'Author, timestamp, message, tree hash' },
    ],
    struct: [
      { field: 'tree', type: 'hash', val: '4b825d…' },
      { field: 'parent', type: 'hash', val: 'a1b2c3…' },
      { field: 'author', type: 'string', val: 'Dev <d@x.io> 1693000000 +0000' },
      { field: 'committer', type: 'string', val: 'Dev <d@x.io> 1693000000 +0000' },
      { field: 'message', type: 'string', val: 'feat: add login page' },
    ],
    chain: [
      { hash: 'c1d2e3…', label: 'commit "initial commit"', note: 'No parent — this is the root of the history graph' },
      { hash: 'f4a5b6…', label: 'commit "add login"', note: 'parent = c1d2e3… — forms a linked list backwards through time' },
    ],
    insight: "A commit is a snapshot in time. It points to a tree (your whole project at that moment) and zero or more parent commits. The commit hash is derived from ALL of this content — meaning any change to any ancestor commit changes every descendant's hash. This is how Git guarantees tamper-proof history.",
  },
  {
    id: 'tag',
    icon: '🏷️',
    name: 'Annotated Tag',
    sub: 'Signed Pointer',
    color: '#d97706',
    facts: [
      { label: 'Points to', value: 'A commit (usually)' },
      { label: 'Has own hash?', value: 'Yes — it\'s a Git object itself' },
      { label: 'Difference from lightweight tag', value: 'Lightweight tags are just refs, not objects' },
      { label: 'Can be GPG-signed?', value: 'Yes — this is the primary use case' },
    ],
    struct: [
      { field: 'object', type: 'hash', val: 'f4a5b6… (commit)' },
      { field: 'type', type: 'string', val: '"commit"' },
      { field: 'tag', type: 'string', val: '"v2.0.0"' },
      { field: 'tagger', type: 'string', val: 'Dev <d@x.io> 1693000000 +0000' },
      { field: 'message', type: 'string', val: 'Release v2.0.0' },
      { field: 'signature', type: 'bytes', val: '-----BEGIN PGP…' },
    ],
    chain: [
      { hash: 'e7f8a9…', label: 'tag object "v2.0.0"', note: 'Annotated tags have their own hash, unlike lightweight tags' },
      { hash: 'f4a5b6…', label: 'commit it points to', note: 'The tag\'s object field references this commit\'s hash' },
    ],
    insight: "Annotated tags are Git objects — they have their own SHA-1 hash, tagger identity, date, and message. Unlike a lightweight tag (just a file in refs/tags containing a commit hash), an annotated tag can be GPG-signed to cryptographically prove the release was created by a trusted party.",
  },
];

function ObjectTypeExplorer() {
  const [selected, setSelected] = useState('blob');
  const obj = OBJECT_TYPES.find(o => o.id === selected);

  return (
    <div>
      <div className="obj-grid">
        {OBJECT_TYPES.map(o => (
          <div
            key={o.id}
            className={`obj-card ${selected === o.id ? 'active' : ''}`}
            onClick={() => setSelected(o.id)}
            style={selected === o.id ? { borderColor: o.color } : {}}
          >
            <div className="obj-icon" style={{ background: `${o.color}18` }}>{o.icon}</div>
            <div className="obj-card-name">{o.name}</div>
            <div className="obj-card-sub">{o.sub}</div>
          </div>
        ))}
      </div>

      {obj && (
        <div className="obj-detail" style={{ borderColor: `${obj.color}40` }}>
          <div className="obj-detail-title" style={{ color: obj.color }}>
            {obj.icon} {obj.name} Object — Internal Structure
          </div>
          <div className="obj-detail-content">
            <div>
              <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>C-struct fields</div>
              <div className="obj-struct">
                {'{'}
                {obj.struct.map((f, i) => (
                  <div key={i} style={{ marginLeft: 16 }}>
                    <span className="field">{f.field}</span>: <span className="type">{f.type}</span> = <span className="val">{f.val}</span>,
                  </div>
                ))}
                {'}'}
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Key facts</div>
                <div className="obj-facts">
                  {obj.facts.map((f, i) => (
                    <div key={i} className="obj-fact">
                      <div className="obj-fact-label">{f.label}</div>
                      <div className="obj-fact-value">{f.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Example objects</div>
              <div className="obj-chain">
                {obj.chain.map((c, i) => (
                  <div key={i}>
                    <div className="obj-chain-item" style={{ borderColor: `${obj.color}40` }}>
                      <div>
                        <div className="obj-chain-hash">{c.hash}</div>
                        <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{c.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{c.note}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: 14, background: `${obj.color}0a`, borderRadius: 8, border: `1px solid ${obj.color}25`, fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
                💡 {obj.insight}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SECTION 3: .git FOLDER EXPLORER ────────────────────────────────────────
const GIT_TREE = [
  {
    name: '.git/', icon: '📁', depth: 0, id: 'root',
    content: null,
    explanation: 'The entire Git database lives inside this one hidden directory. Delete it, and your project becomes an ordinary folder with no history.',
    children: [
      {
        name: 'HEAD', icon: '📄', depth: 1, id: 'HEAD',
        content: 'ref: refs/heads/main',
        explanation: 'HEAD is a symbolic reference — a pointer to a pointer. It tells Git which branch you\'re currently on. When you make a commit, Git moves the branch HEAD points to forward.',
      },
      {
        name: 'config', icon: '📄', depth: 1, id: 'config',
        content: '[core]\n\trepositoryformatversion = 0\n\tfilemode = true\n\tbare = false\n\tlogallrefupdates = true\n[remote "origin"]\n\turl = git@github.com:user/repo.git\n\tfetch = +refs/heads/*:refs/remotes/origin/*\n[branch "main"]\n\tremote = origin\n\tmerge = refs/heads/main',
        explanation: 'The repository-level config file. Settings here override global (~/.gitconfig) and system (/etc/gitconfig) settings. This is where remote URLs, branch tracking, and repo-level aliases live.',
      },
      {
        name: 'COMMIT_EDITMSG', icon: '📄', depth: 1, id: 'COMMIT_EDITMSG',
        content: 'feat: add user authentication\n\nImplemented JWT-based auth with refresh tokens.\nCloses #42',
        explanation: 'Stores the most recent commit message. Git opens your editor with this file\'s content pre-filled when you run `git commit --amend`. It\'s also where the COMMIT_EDITMSG hook operates.',
      },
      {
        name: 'index', icon: '⚙️', depth: 1, id: 'index',
        content: '[Binary file — the staging area]\n\nCannot be directly cat\'d. Use:\n  git ls-files --stage\n\n100644 a3b4c5d6... 0\tREADME.md\n100644 e7f8a9b0... 0\tsrc/index.js\n100644 c1d2e3f4... 0\tsrc/auth.js',
        explanation: 'This binary file IS the staging area (the "index"). Every time you run `git add`, Git writes a new version of this file that maps filenames to blob hashes. When you commit, Git reads this file to know what goes into the new tree.',
      },
      {
        name: 'objects/', icon: '📁', depth: 1, id: 'objects',
        content: null,
        explanation: 'The object database — the heart of Git. Every blob, tree, commit, and tag ever created in this repository lives here as a compressed, SHA-1-named file.',
        children: [
          {
            name: 'a3/', icon: '📁', depth: 2, id: 'a3dir',
            content: null,
            explanation: 'Objects whose SHA-1 hash starts with "a3". This sharding prevents any single directory from containing millions of files (bad for filesystems).',
            children: [
              {
                name: 'b4c5d6e7f8…', icon: '🔒', depth: 3, id: 'blob1',
                content: '[zlib compressed blob]\n\nRaw binary — cannot be read directly.\nUse: git cat-file -p a3b4c5d6\n\nDecompressed content:\n  blob 1234\\0\n  # README\n  Welcome to our project.\n  ...',
                explanation: 'A blob object. The filename IS the last 38 chars of the SHA-1 hash. The file is zlib-compressed. Its content starts with "blob <size>\\0" followed by the raw file bytes.',
              },
            ],
          },
          {
            name: 'info/', icon: '📁', depth: 2, id: 'objinfo',
            content: '[Usually empty for small repos]',
            explanation: 'Metadata about the object store. For repositories served over dumb HTTP, this directory helps clients discover what objects exist.',
          },
          {
            name: 'pack/', icon: '📁', depth: 2, id: 'pack',
            content: 'pack-a1b2c3d4...idx\npack-a1b2c3d4...pack\n\n.idx = index for fast lookups\n.pack = all objects, delta-compressed\n\nRun "git gc" to generate packfiles\nfrom loose objects.',
            explanation: 'After `git gc` or a fetch from a server, loose objects are packed into .pack files. Delta compression between similar blobs can reduce size by 90%+. The .idx file provides fast O(log n) lookup without scanning the entire .pack.',
          },
        ],
      },
      {
        name: 'refs/', icon: '📁', depth: 1, id: 'refs',
        content: null,
        explanation: 'Human-readable names (branches, tags, remotes) that point to commit hashes. A branch is literally just a file containing a 40-character SHA-1 string.',
        children: [
          {
            name: 'heads/', icon: '📁', depth: 2, id: 'heads',
            content: null,
            explanation: 'Local branches. Each file\'s name is the branch name; its content is the commit hash the branch currently points to.',
            children: [
              {
                name: 'main', icon: '📄', depth: 3, id: 'main',
                content: 'f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3',
                explanation: 'This IS the "main" branch. Just a text file with a commit hash. When you make a new commit on main, Git overwrites this file with the new hash. That\'s it. That\'s a branch.',
              },
              {
                name: 'feature/auth', icon: '📄', depth: 3, id: 'feature',
                content: 'c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
                explanation: 'Another branch, stored as another file. Branches are cheap because they\'re just 41 bytes (40-char hash + newline). Creating a branch is just writing a new file.',
              },
            ],
          },
          {
            name: 'remotes/', icon: '📁', depth: 2, id: 'remotes',
            content: null,
            explanation: 'Remote tracking references. These are local copies of what the remote\'s branches looked like after your last `git fetch`.',
            children: [
              {
                name: 'origin/', icon: '📁', depth: 3, id: 'origin',
                content: null,
                explanation: 'The "origin" remote. Subdirectories match the remote\'s branch names.',
                children: [
                  {
                    name: 'main', icon: '📄', depth: 4, id: 'origin-main',
                    content: 'a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
                    explanation: 'origin/main — what the remote\'s main branch was pointing to after your last `git fetch`. This is why `git status` can tell you "Your branch is 2 commits ahead of origin/main" — it compares this hash to refs/heads/main.',
                  },
                ],
              },
            ],
          },
          {
            name: 'tags/', icon: '📁', depth: 2, id: 'tags',
            content: null,
            explanation: 'Tag references. Lightweight tags are just commit hashes stored here. Annotated tags store the hash of a tag object, not a commit directly.',
            children: [
              {
                name: 'v2.0.0', icon: '📄', depth: 3, id: 'tag-v200',
                content: 'e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
                explanation: 'This points to a tag object (not a commit directly), because it\'s an annotated tag. Run `git cat-file -t e7f8a9` and you\'ll see "tag". Run `git cat-file -p e7f8a9` to see the full tag object.',
              },
            ],
          },
        ],
      },
      {
        name: 'logs/', icon: '📁', depth: 1, id: 'logs',
        content: null,
        explanation: 'The reflog database. Every time a ref (branch, HEAD) changes, Git appends a line here recording the old hash, new hash, and why it changed. This is your safety net for recovering "lost" commits.',
        children: [
          {
            name: 'HEAD', icon: '📄', depth: 2, id: 'log-head',
            content: '0000000 c1d2e3f Dev <d@x.io> 1693000000 +0000\tcheckout: moving to main\nc1d2e3f f4a5b6c Dev <d@x.io> 1693003600 +0000\tcommit: feat: add login\nf4a5b6c a9b0c1d Dev <d@x.io> 1693007200 +0000\tcommit: fix: auth bug',
            explanation: 'The HEAD reflog. Every line is: <old-sha> <new-sha> <identity> <timestamp> <action>. This lets `git reflog` reconstruct your complete activity, even for "deleted" commits. Reflog entries expire after 90 days by default.',
          },
        ],
      },
      {
        name: 'hooks/', icon: '📁', depth: 1, id: 'hooks',
        content: null,
        explanation: 'Shell scripts that Git runs automatically at lifecycle events. Files must be executable. They\'re not committed to the repo by default — tools like Husky manage this.',
        children: [
          {
            name: 'pre-commit.sample', icon: '📄', depth: 2, id: 'hook-precommit',
            content: '#!/bin/sh\n# Called before "git commit"\n# Non-zero exit aborts the commit\n\nnpm run lint || exit 1\nnpm test || exit 1',
            explanation: 'Rename to "pre-commit" (remove .sample) and make executable (chmod +x) to activate. Exit with non-zero to abort the commit. Husky automates this setup for teams.',
          },
        ],
      },
    ],
  },
];

function FolderNode({ node, selectedId, onSelect, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded || node.depth < 2);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <>
      <div
        className={`folder-node ${selectedId === node.id ? 'active' : ''}`}
        style={{ '--depth': node.depth }}
        onClick={() => {
          if (hasChildren) setExpanded(e => !e);
          onSelect(node);
        }}
      >
        <span className="toggle">
          {hasChildren ? (expanded ? '▼' : '▶') : ' '}
        </span>
        <span className="icon">{node.icon}</span>
        {node.name}
      </div>
      {hasChildren && expanded && node.children.map(child => (
        <FolderNode key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} />
      ))}
    </>
  );
}

function GitFolderExplorer() {
  const [selected, setSelected] = useState(GIT_TREE[0].children[0]); // HEAD by default

  return (
    <div className="folder-wrap">
      <div className="folder-tree">
        <div className="folder-tree-header">
          <span style={{ background: '#ff5f57' }} />
          <span style={{ background: '#ffbd2e' }} />
          <span style={{ background: '#28c840' }} />
          <span style={{ marginLeft: 8 }}>/ .git</span>
        </div>
        <div className="folder-tree-list">
          {GIT_TREE.map(node => (
            <FolderNode key={node.id} node={node} selectedId={selected?.id} onSelect={n => { if (n.content !== null || !n.children) setSelected(n); }} />
          ))}
        </div>
      </div>
      <div className="folder-content">
        {selected ? (
          <>
            <div className="folder-content-title">{selected.icon} {selected.name}</div>
            {selected.content ? (
              <div className="folder-content-body">
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {selected.content.split('\n').map((line, i) => {
                    // Colorize
                    if (/^[0-9a-f]{40}$/.test(line.trim())) {
                      return <div key={i}><span className="hash">{line}</span></div>;
                    }
                    if (line.startsWith('[') && line.endsWith(']')) {
                      return <div key={i}><span className="key">{line}</span></div>;
                    }
                    if (line.startsWith('\t') || line.startsWith('    ')) {
                      const [k, ...v] = line.split(' = ');
                      return <div key={i}><span style={{ color: 'var(--text3)' }}>&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="key">{k.trim()}</span>{v.length ? <><span style={{ color: 'var(--text3)' }}> = </span><span className="val">{v.join(' = ')}</span></> : null}</div>;
                    }
                    if (line.startsWith('#')) {
                      return <div key={i}><span className="comment">{line}</span></div>;
                    }
                    return <div key={i}>{line}</div>;
                  })}
                </pre>
              </div>
            ) : (
              <div className="folder-content-empty">[directory — click a child file to inspect]</div>
            )}
            {selected.explanation && (
              <div className="folder-explanation">
                <strong>What this is: </strong>{selected.explanation}
              </div>
            )}
          </>
        ) : (
          <div className="folder-content-empty">Select a file in the tree →</div>
        )}
      </div>
    </div>
  );
}

// ─── SECTION 4: OBJECT GRAPH VISUALIZER (SVG) ───────────────────────────────
function ObjectGraph() {
  const [view, setView] = useState('full'); // 'full' | 'blob' | 'tree' | 'commit'
  const [hoveredId, setHoveredId] = useState(null);

  const nodes = {
    full: [
      // Commits
      { id: 'c1', x: 300, y: 30, type: 'commit', label: 'Commit', sub: 'a1b2c3…', w: 130, h: 48 },
      { id: 'c2', x: 300, y: 130, type: 'commit', label: 'Commit', sub: 'f4a5b6…', w: 130, h: 48 },
      // Trees
      { id: 't1', x: 80, y: 30, type: 'tree', label: 'Tree', sub: '4b825d…', w: 110, h: 48 },
      { id: 't2', x: 80, y: 130, type: 'tree', label: 'Tree', sub: '81c4e7…', w: 110, h: 48 },
      { id: 't3', x: 80, y: 230, type: 'tree', label: 'Tree /src', sub: 'c7d8e9…', w: 110, h: 48 },
      // Blobs
      { id: 'b1', x: 470, y: 30, type: 'blob', label: 'Blob', sub: 'README.md', w: 120, h: 48 },
      { id: 'b2', x: 470, y: 130, type: 'blob', label: 'Blob', sub: 'index.js', w: 120, h: 48 },
      { id: 'b3', x: 470, y: 230, type: 'blob', label: 'Blob', sub: 'auth.js', w: 120, h: 48 },
      // Tag
      { id: 'tag1', x: 300, y: 230, type: 'tag', label: 'Tag v1.0', sub: 'e7f8a9…', w: 130, h: 48 },
      // Branch ref
      { id: 'ref1', x: 470, y: 300, type: 'ref', label: 'refs/heads/main', sub: '→ f4a5b6', w: 150, h: 40 },
      { id: 'head', x: 300, y: 310, type: 'head', label: 'HEAD', sub: '→ main', w: 90, h: 40 },
    ],
  };

  const edges = {
    full: [
      { from: 'c1', to: 'c2', label: 'parent' },
      { from: 'c1', to: 't1', label: 'tree' },
      { from: 'c2', to: 't2', label: 'tree' },
      { from: 't1', to: 'b1', label: '' },
      { from: 't2', to: 'b1', label: '' }, // shared blob!
      { from: 't2', to: 'b2', label: '' },
      { from: 't2', to: 't3', label: '' },
      { from: 't3', to: 'b2', label: '' },
      { from: 't3', to: 'b3', label: '' },
      { from: 'tag1', to: 'c1', label: 'points to' },
      { from: 'ref1', to: 'c2', label: '' },
      { from: 'head', to: 'ref1', label: '' },
    ],
  };

  const TYPE_COLORS = {
    commit: { fill: 'rgba(139,92,246,0.12)', stroke: 'rgba(139,92,246,0.5)', text: '#6d28d9' },
    tree: { fill: 'rgba(5,150,105,0.12)', stroke: 'rgba(5,150,105,0.5)', text: '#047857' },
    blob: { fill: 'rgba(59,130,246,0.12)', stroke: 'rgba(59,130,246,0.5)', text: '#1d4ed8' },
    tag: { fill: 'rgba(217,119,6,0.12)', stroke: 'rgba(217,119,6,0.5)', text: '#b45309' },
    ref: { fill: 'rgba(220,38,38,0.08)', stroke: 'rgba(220,38,38,0.4)', text: '#dc2626' },
    head: { fill: 'rgba(220,38,38,0.15)', stroke: 'rgba(220,38,38,0.6)', text: '#dc2626' },
  };

  const allNodes = nodes.full;
  const allEdges = edges.full;

  // Helper: find node center
  const center = (id) => {
    const n = allNodes.find(n => n.id === id);
    if (!n) return { x: 0, y: 0 };
    return { x: n.x + n.w / 2, y: n.y + n.h / 2 };
  };

  return (
    <div className="graph-wrap">
      <div className="graph-header">
        <span className="graph-title">Git Object Graph — How commits, trees, and blobs connect</span>
      </div>
      <div className="graph-canvas">
        <div className="graph-svg-wrap">
          <svg width="100%" viewBox="0 0 650 370" style={{ fontFamily: 'var(--font-mono)' }}>
            <defs>
              <marker id="graph-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke="var(--text3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
              <marker id="graph-arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke="rgba(220,38,38,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
            </defs>

            {/* Draw edges */}
            {allEdges.map((e, i) => {
              const f = center(e.from);
              const t = center(e.to);
              const isRef = e.from === 'head' || e.from === 'ref1';
              return (
                <g key={i}>
                  <line
                    x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                    stroke={isRef ? 'rgba(220,38,38,0.4)' : 'var(--border2)'}
                    strokeWidth={1}
                    strokeDasharray={isRef ? '4 3' : 'none'}
                    markerEnd={isRef ? 'url(#graph-arrow-red)' : 'url(#graph-arrow)'}
                  />
                  {e.label && (
                    <text
                      x={(f.x + t.x) / 2 + 4}
                      y={(f.y + t.y) / 2 - 4}
                      fontSize={9} fill="var(--text3)" textAnchor="middle"
                    >{e.label}</text>
                  )}
                </g>
              );
            })}

            {/* Shared blob annotation */}
            <text x={530} y={80} fontSize={9} fill="var(--green)" textAnchor="middle">shared!</text>
            <text x={530} y={91} fontSize={9} fill="var(--green)" textAnchor="middle">deduped</text>

            {/* Draw nodes */}
            {allNodes.map(n => {
              const c = TYPE_COLORS[n.type] || TYPE_COLORS.commit;
              const isHov = hoveredId === n.id;
              return (
                <g
                  key={n.id}
                  onMouseEnter={() => setHoveredId(n.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ cursor: 'default' }}
                >
                  <rect
                    x={n.x} y={n.y} width={n.w} height={n.h} rx={8}
                    fill={c.fill}
                    stroke={isHov ? c.text : c.stroke}
                    strokeWidth={isHov ? 1.5 : 1}
                  />
                  <text
                    x={n.x + n.w / 2} y={n.y + n.h * 0.38}
                    fontSize={12} fontWeight="600"
                    fill={c.text} textAnchor="middle" dominantBaseline="central"
                  >{n.label}</text>
                  <text
                    x={n.x + n.w / 2} y={n.y + n.h * 0.72}
                    fontSize={9} fill="var(--text3)" textAnchor="middle" dominantBaseline="central"
                  >{n.sub}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      <div className="graph-legend">
        {Object.entries(TYPE_COLORS).map(([type, c]) => (
          <div key={type} className="graph-legend-item">
            <div className="graph-legend-dot" style={{ background: c.fill, border: `1px solid ${c.stroke}` }} />
            {type}
          </div>
        ))}
        <div className="graph-legend-item">
          <div style={{ width: 24, height: 1, borderTop: '1px dashed rgba(220,38,38,0.5)' }} />
          ref pointer
        </div>
        <div className="graph-legend-item">
          <div style={{ width: 24, height: 1, borderTop: '1px solid var(--border2)' }} />
          object pointer
        </div>
      </div>
      <div style={{ padding: '12px 20px', background: 'rgba(5,150,105,0.05)', borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
        💡 Notice: <strong style={{ color: 'var(--text)' }}>Both commits share the same README.md blob.</strong> If a file doesn't change between commits, Git stores zero extra bytes. This is storage deduplication in action.
      </div>
    </div>
  );
}

// ─── SECTION 5: PACKFILE SIZE VISUALIZER ────────────────────────────────────
function PackfileVisualizer() {
  const [versions, setVersions] = useState(1);
  const [packed, setPacked] = useState(false);
  const [animating, setAnimating] = useState(false);

  const files = ['app.js', 'auth.js', 'db.js', 'utils.js', 'index.js'];
  const FILE_KB = 120; // Each "file" is ~120KB
  const DELTA_KB = 8;  // Delta between versions is ~8KB

  const looseCount = versions * files.length;
  const looseSize = looseCount * FILE_KB;
  const packSize = files.length * FILE_KB + (versions - 1) * files.length * DELTA_KB;
  const savings = Math.round((1 - packSize / looseSize) * 100);

  const runGC = () => {
    setAnimating(true);
    setTimeout(() => { setPacked(true); setAnimating(false); }, 1200);
  };
  const reset = () => { setPacked(false); setVersions(1); };

  return (
    <div className="pack-wrap">
      <div className="pack-header">
        <div className="pack-title">Packfile & Delta Compression Simulator</div>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>
          Adjust commits made, then run <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>git gc</code> to see compression
        </div>
      </div>
      <div className="pack-body">
        <div className="pack-slider-row">
          <span className="pack-slider-label">Commits (versions of each file):</span>
          <input
            type="range" min={1} max={20} value={versions}
            className="pack-slider"
            onChange={e => { setVersions(Number(e.target.value)); setPacked(false); }}
          />
          <span className="pack-slider-val">{versions}</span>
        </div>

        <div className="pack-stats">
          <div className="pack-stat">
            <div className="pack-stat-val">{looseCount}</div>
            <div className="pack-stat-label">Loose objects</div>
          </div>
          <div className="pack-stat">
            <div className="pack-stat-val">{(looseSize / 1024).toFixed(1)} MB</div>
            <div className="pack-stat-label">Loose size</div>
          </div>
          <div className="pack-stat" style={packed ? { background: 'rgba(5,150,105,0.08)', borderColor: 'rgba(5,150,105,0.2)' } : {}}>
            <div className="pack-stat-val" style={packed ? { color: 'var(--green)' } : {}}>
              {packed ? `${(packSize / 1024).toFixed(1)} MB` : '—'}
            </div>
            <div className="pack-stat-label">After git gc</div>
          </div>
        </div>

        {/* File grid */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
            {packed ? '1 packfile (delta-compressed):' : `${looseCount} loose objects in .git/objects/:`}
          </div>
          <div className="pack-file-grid">
            {packed ? (
              <div className="pack-file packed" style={{ gridColumn: '1 / -1', textAlign: 'left', padding: '12px 16px' }}>
                <div className="pack-file-name" style={{ fontSize: 13, marginBottom: 6 }}>📦 pack-a1b2c3.pack</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                  {files.length} full objects + {(versions - 1) * files.length} deltas
                  &nbsp;·&nbsp; {savings}% smaller than loose
                </div>
                <div className="pack-file-hash">Accompanied by pack-a1b2c3.idx (fast lookup index)</div>
              </div>
            ) : (
              Array.from({ length: Math.min(looseCount, 30) }).map((_, i) => {
                const file = files[i % files.length];
                const ver = Math.floor(i / files.length) + 1;
                return (
                  <div key={i} className="pack-file">
                    <div className="pack-file-name">{file}</div>
                    <div style={{ fontSize: 10, color: 'var(--text3)' }}>v{ver}</div>
                    <div className="pack-file-hash">{(FILE_KB)} KB</div>
                  </div>
                );
              })
            )}
            {!packed && looseCount > 30 && (
              <div className="pack-file" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                +{looseCount - 30} more
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="pack-gc-btn" onClick={runGC} disabled={packed || animating}>
            {animating ? '⚙ Running gc…' : '$ git gc'}
          </button>
          {packed && (
            <button className="pack-gc-btn" onClick={reset} style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)' }}>
              Reset
            </button>
          )}
          {packed && versions > 1 && (
            <span style={{ fontSize: 13, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>
              ✓ Saved {savings}% ({((looseSize - packSize) / 1024).toFixed(1)} MB)
            </span>
          )}
        </div>

        {versions >= 10 && (
          <div className="int-callout info" style={{ marginTop: 16 }}>
            <div className="int-callout-title">ⓘ How delta compression works at {versions} commits</div>
            <p>Git stores <strong>{files.length} full copies</strong> of your files (the most recent versions), then stores the <strong>reverse deltas</strong> back in time — just the byte differences between versions. At {versions} commits, this is ~{DELTA_KB * (versions - 1)} KB of deltas per file instead of {FILE_KB * (versions - 1)} KB of full copies.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SECTION 6: COMMIT IMMUTABILITY DEMO ────────────────────────────────────
// Shows cascade: change one commit's message → all descendants get new hashes
function ImmutabilityDemo() {
  const [msg, setMsg] = useState('Initial commit');
  const [tampered, setTampered] = useState(false);

  // Simulated hashes derived from content
  const simHash = (str) => {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    let r = ''; let s = h;
    for (let i = 0; i < 3; i++) { s = (Math.imul(s, 0x5851f42d) + 0x14057b7e) >>> 0; r += s.toString(16).padStart(8, '0'); }
    return r.slice(0, 7);
  };

  const originalMsg = 'Initial commit';
  const TREE_HASH = '4b825d';
  const AUTHOR = 'Alice <alice@example.com>';

  const hash1 = simHash(`tree:${TREE_HASH}author:${AUTHOR}msg:${msg}`);
  const hash2 = simHash(`tree:7c1a3bparent:${hash1}author:${AUTHOR}msg:Add user auth`);
  const hash3 = simHash(`tree:9d2e4cparent:${hash2}author:${AUTHOR}msg:Fix login bug`);

  const origHash1 = simHash(`tree:${TREE_HASH}author:${AUTHOR}msg:${originalMsg}`);
  const isTampered = msg !== originalMsg;

  return (
    <div className="immut-wrap">
      <div className="immut-header">⛓ Commit Immutability — Edit a commit to see the cascade effect</div>
      <div className="immut-body">
        <div className="immut-chain">
          {/* Commit 3 (top = newest) */}
          <div className={`immut-commit ${isTampered ? 'invalid' : 'valid-chain'}`}>
            <div className="immut-commit-hash" style={{ color: isTampered ? 'var(--red)' : 'var(--accent2)' }}>
              {hash3}… {isTampered && '← INVALIDATED'}
            </div>
            <div className="immut-commit-msg">Fix login bug</div>
            <div className="immut-commit-meta">
              parent: <span>{hash2}…</span> · author: <span>Alice</span>
            </div>
          </div>
          <div className={`immut-connector ${isTampered ? 'broken' : ''}`} />

          {/* Commit 2 */}
          <div className={`immut-commit ${isTampered ? 'invalid' : 'valid-chain'}`}>
            <div className="immut-commit-hash" style={{ color: isTampered ? 'var(--red)' : 'var(--accent2)' }}>
              {hash2}… {isTampered && '← INVALIDATED'}
            </div>
            <div className="immut-commit-msg">Add user auth</div>
            <div className="immut-commit-meta">
              parent: <span>{hash1}…</span> · author: <span>Alice</span>
            </div>
          </div>
          <div className={`immut-connector ${isTampered ? 'broken' : ''}`} />

          {/* Commit 1 (editable) */}
          <div className={`immut-commit ${isTampered ? 'tampered' : 'valid-chain'}`}>
            <div className="immut-commit-hash" style={{ color: isTampered ? 'var(--red)' : 'var(--accent2)' }}>
              {hash1}… {isTampered && `(was: ${origHash1}…)`}
            </div>
            <div className="immut-commit-msg">
              {isTampered ? '✏ TAMPERED:' : '📝 Edit this commit message:'}
            </div>
            <div className="immut-edit-field">
              <input
                className="immut-edit-input"
                value={msg}
                onChange={e => setMsg(e.target.value)}
              />
            </div>
            <div className="immut-commit-meta">
              tree: <span>{TREE_HASH}…</span> · no parent (root commit)
            </div>
          </div>
        </div>

        {isTampered ? (
          <div className="immut-alert">
            <strong>🔴 Chain broken!</strong> Changing the message of commit <code>{origHash1}…</code> produced a new hash <code>{hash1}…</code>. Because commit 2 stores the old hash <code>{origHash1}…</code> as its parent, commit 2's hash also changed. And commit 3's hash also changed. <strong>Every descendant is now a different commit with a different hash.</strong>
            <br /><br />
            This is why <code>git rebase</code>, <code>git commit --amend</code>, and <code>git reset</code> all "rewrite history" — they create brand-new commits with new hashes, even if the content is identical.
          </div>
        ) : (
          <div className="immut-success">
            ✓ Chain intact. All three commits are cryptographically valid. Try editing the message above.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SECTION 7: PLUMBING COMMAND SIMULATOR ──────────────────────────────────
const COMMANDS = [
  {
    cmd: 'git cat-file -t HEAD',
    label: 'Inspect type of HEAD',
    output: [
      { type: 'out', text: 'commit' },
    ],
  },
  {
    cmd: 'git cat-file -p HEAD',
    label: 'Pretty-print HEAD commit',
    output: [
      { type: 'key', text: 'tree ', rest: '4b825dc642cb6eb9a060e54bf8d69288fbee4904' },
      { type: 'key', text: 'parent ', rest: 'a3f2c91d4e8b7f1c2d3e4f5a6b7c8d9e0f1a2b3c' },
      { type: 'key', text: 'author ', rest: 'Alice <alice@example.com> 1693000000 +0000' },
      { type: 'key', text: 'committer ', rest: 'Alice <alice@example.com> 1693000000 +0000' },
      { type: 'out', text: '' },
      { type: 'out', text: 'feat: add user authentication' },
    ],
  },
  {
    cmd: 'git cat-file -p 4b825d',
    label: 'Inspect root tree object',
    output: [
      { type: 'hash', text: '100644 blob ', hash: 'a3b4c5d6…', rest: '    README.md' },
      { type: 'hash', text: '100644 blob ', hash: 'e7f8a9b0…', rest: '    package.json' },
      { type: 'hash', text: '040000 tree ', hash: '81c4e782…', rest: '    src' },
    ],
  },
  {
    cmd: 'git cat-file -p 81c4e7',
    label: 'Inspect /src tree',
    output: [
      { type: 'hash', text: '100644 blob ', hash: 'c1d2e3f4…', rest: '    index.js' },
      { type: 'hash', text: '100644 blob ', hash: 'd4e5f6a7…', rest: '    auth.js' },
      { type: 'hash', text: '100644 blob ', hash: 'b8c9d0e1…', rest: '    db.js' },
    ],
  },
  {
    cmd: 'git ls-files --stage',
    label: 'Inspect the index (staging area)',
    output: [
      { type: 'hash', text: '100644 ', hash: 'a3b4c5d6…', rest: ' 0\tREADME.md' },
      { type: 'hash', text: '100644 ', hash: 'e7f8a9b0…', rest: ' 0\tpackage.json' },
      { type: 'hash', text: '100644 ', hash: 'c1d2e3f4…', rest: ' 0\tsrc/index.js' },
    ],
  },
  {
    cmd: 'git count-objects -vH',
    label: 'Count loose objects + size',
    output: [
      { type: 'key', text: 'count: ', rest: '47' },
      { type: 'key', text: 'size: ', rest: '188.00 KiB' },
      { type: 'key', text: 'in-pack: ', rest: '0' },
      { type: 'key', text: 'packs: ', rest: '0' },
      { type: 'key', text: 'size-pack: ', rest: '0' },
      { type: 'key', text: 'garbage: ', rest: '0' },
    ],
  },
];

function PlumbingSimulator() {
  const [history, setHistory] = useState([]);
  const [active, setActive] = useState(null);
  const bodyRef = useRef(null);

  const run = (cmd) => {
    setActive(cmd.cmd);
    setHistory(h => [...h, { cmd, ts: Date.now() }]);
    setTimeout(() => {
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }, 50);
  };

  const clear = () => { setHistory([]); setActive(null); };

  return (
    <div className="plumb-wrap">
      <div className="plumb-header">
        <span className="plumb-dot" style={{ background: '#ff5f57' }} />
        <span className="plumb-dot" style={{ background: '#ffbd2e' }} />
        <span className="plumb-dot" style={{ background: '#28c840' }} />
        <span className="plumb-header-title">git plumbing commands</span>
      </div>
      <div className="plumb-body" ref={bodyRef}>
        {history.length === 0 && (
          <div className="plumb-line-comment"># Click a command below to run it ↓</div>
        )}
        {history.map((h, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div>
              <span className="plumb-line-prompt">$ </span>
              <span className="plumb-line-cmd">{h.cmd.cmd}</span>
            </div>
            {h.cmd.output.map((line, j) => (
              <div key={j}>
                {line.type === 'out' && <span className="plumb-line-out">{line.text}</span>}
                {line.type === 'key' && <span><span className="plumb-line-key">{line.text}</span><span className="plumb-line-out">{line.rest}</span></span>}
                {line.type === 'hash' && <span><span className="plumb-line-out">{line.text}</span><span className="plumb-line-hash">{line.hash}</span><span className="plumb-line-out">{line.rest}</span></span>}
                {line.type === 'comment' && <span className="plumb-line-comment">{line.text}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="plumb-controls">
        {COMMANDS.map(cmd => (
          <button
            key={cmd.cmd}
            className={`plumb-cmd-btn ${active === cmd.cmd ? 'active' : ''}`}
            onClick={() => run(cmd)}
            title={cmd.label}
          >
            {cmd.cmd}
          </button>
        ))}
        <button className="plumb-cmd-btn" onClick={clear} style={{ marginLeft: 'auto', color: 'var(--text3)' }}>
          clear
        </button>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function Internals() {
  // Scroll animation
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
      <div className="int-page">

        {/* ── HERO ── */}
        <div className="int-hero">
          <div className="int-hero-grid" />
          <div className="int-hero-content">
            <div className="int-chapter-badge"><span />Chapter 04</div>
            <h1 className="int-hero-title">
              Git <em>Internals</em>
            </h1>
            <p className="int-hero-sub">
              Open the <code style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>.git</code> folder and read the raw C-structs, hexadecimal hashes, and compressed blobs that power everything you've ever done with Git.
            </p>
            <div className="int-hero-stats">
              <div className="int-stat"><div className="int-stat-num">4</div><div className="int-stat-label">Object types</div></div>
              <div className="int-stat"><div className="int-stat-num">40</div><div className="int-stat-label">SHA-1 hex chars</div></div>
              <div className="int-stat"><div className="int-stat-num">90%+</div><div className="int-stat-label">Packfile compression</div></div>
              <div className="int-stat"><div className="int-stat-num">7</div><div className="int-stat-label">Interactive demos</div></div>
            </div>
          </div>
        </div>

        {/* ── SECTION 1: CONTENT-ADDRESSABLE STORAGE ── */}
        <section className="int-section fade-in-section">
          <div className="int-label">Foundation</div>
          <h2 className="int-title">Git is a content-addressable filesystem</h2>
          <p className="int-desc">
            You don't retrieve files by name or path — you retrieve them by a cryptographic hash of their contents. This one idea explains almost everything unusual about how Git works.
          </p>

          <p className="int-body">
            Every piece of data Git stores — every file version, every directory listing, every commit — is hashed using <strong>SHA-1</strong> to produce a 40-character hexadecimal identifier. That hash IS the address. Two files with identical content will produce the identical hash and will be stored exactly once. This is automatic, global deduplication.
          </p>

          <p className="int-body">
            The hash is computed from the <strong>full content</strong> of the object, including a header. For a file containing "Hello, Git!", the exact bytes fed to SHA-1 are:
          </p>

          <CodeBlock lang="raw" title="Blob object format fed to SHA-1">
{`blob 11\0Hello, Git!
└──┬──┘└┬┘└────┬──────┘
   │    │      └── file contents
   │    └── null byte separator
   └── object type + space + byte count`}
          </CodeBlock>

          <p className="int-body">
            The resulting hash is then split: the first 2 characters become a directory name inside <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>.git/objects/</code>, and the remaining 38 become the filename. This sharding prevents any directory from growing to millions of files — a filesystem performance concern.
          </p>

          <SHA1Hasher />

          <Callout type="info" title="Why SHA-1 and not SHA-256?">
            Git was designed in 2005 when SHA-1 was standard. SHA-1 is now considered broken for cryptographic security but Git uses it for integrity, not authentication. The Git project has been migrating to SHA-256 (available via `--object-format=sha256` since Git 2.29). GitHub supports both.
          </Callout>

          <DeepDive title="The collision attack concern" badge="security">
            <p>In 2017, Google demonstrated the "SHAttered" attack — producing two different PDF files with the same SHA-1 hash. In theory, a malicious commit object could share a hash with a legitimate one. In practice, Git has mitigated this with collision detection since 2.13 — it checks if a new object would collide with an existing one before writing. If you need cryptographic guarantees, use SHA-256 repositories.</p>
            <p>For most development workflows, SHA-1 collisions are a non-concern. You'd need to spend ~$110,000 in compute on a GPU cluster to forge a single collision. The integrity guarantees SHA-1 provides against accidental corruption and casual tampering remain solid.</p>
          </DeepDive>
        </section>

        {/* ── SECTION 2: THE FOUR OBJECT TYPES ── */}
        <section className="int-section fade-in-section">
          <div className="int-label">Object Database</div>
          <h2 className="int-title">The four object types</h2>
          <p className="int-desc">
            Every single thing Git stores is one of four types. Everything. Understand these four objects and you understand 90% of Git's architecture. Click each to inspect its internal C structure.
          </p>

          <ObjectTypeExplorer />

          <div className="int-divider" />

          <h3 className="int-sub">How they connect — the object graph</h3>
          <p className="int-body">
            Objects point to each other by hash. A commit points to a tree. That tree points to blobs (files) and other trees (subdirectories). This forms a <strong>Directed Acyclic Graph (DAG)</strong> — no cycles, no loops, just a web of content-addressed pointers extending back to the beginning of the repository's history.
          </p>

          <ObjectGraph />

          <DeepDive title="Why the empty tree hash is constant across all repos" badge="trivia">
            <p>The hash of an empty tree (<code>4b825dc642cb6eb9a060e54bf8d69288fbee4904</code>) is the same in every Git repository on Earth. It's calculated from the bytes <code>tree 0\0</code> — the tree header with zero entries. Because SHA-1 is deterministic, same input → same output, always.</p>
            <p>This is why <code>git diff 4b825dc HEAD</code> shows every file in your repo — you're diffing "the empty state" against your current commit. Senior engineers use this to generate a full patch of an entire repo.</p>
          </DeepDive>
        </section>

        {/* ── SECTION 3: THE .git FOLDER ── */}
        <section className="int-section fade-in-section">
          <div className="int-label">Filesystem</div>
          <h2 className="int-title">Inside the .git directory</h2>
          <p className="int-desc">
            Every repository has one hidden directory that contains the entire Git database. Navigate the explorer below — each file has a real explanation of exactly what it stores and why it exists.
          </p>

          <p className="int-body">
            A key insight that surprises many developers: <strong>branches are just text files.</strong> The file <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>refs/heads/main</code> contains exactly one thing — a 40-character SHA-1 hash. When you commit, Git writes a new hash to that file. That's the entire implementation of a branch.
          </p>

          <GitFolderExplorer />

          <Callout type="warn" title="Never manually edit files inside .git">
            While it's educational to read these files, manually editing them (outside of recovery situations) will corrupt your repository. Use Git's plumbing commands instead — they validate inputs and maintain consistency across multiple files.
          </Callout>

          <DeepDive title="The packed-refs optimization" badge="performance">
            <p>Repositories with thousands of branches and tags would create thousands of small files under <code>refs/</code>, which is slow on some filesystems. Git solves this with <code>.git/packed-refs</code> — a single file listing all refs and their hashes. After a <code>git gc</code>, most refs end up here. Git checks <code>packed-refs</code> when it can't find a ref as a loose file.</p>
          </DeepDive>
        </section>

        {/* ── SECTION 4: PLUMBING COMMANDS ── */}
        <section className="int-section fade-in-section">
          <div className="int-label">Plumbing vs Porcelain</div>
          <h2 className="int-title">Reading objects directly</h2>
          <p className="int-desc">
            Commands like <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>git status</code> and <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>git commit</code> are "porcelain" — polished, human-friendly interfaces. Under the hood they call "plumbing" — low-level commands that directly read and write objects. Run them yourself below.
          </p>

          <p className="int-body">
            The single most useful plumbing command is <strong><code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>git cat-file</code></strong>. It takes an object hash and dumps its content. This is how you can read exactly what Git is storing — no abstraction, no formatting. The <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>-t</code> flag prints the type; <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>-p</code> pretty-prints the content.
          </p>

          <PlumbingSimulator />

          <div className="int-divider" />

          <h3 className="int-sub">Full porcelain → plumbing breakdown</h3>
          <p className="int-body">
            When you run <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>git commit -m "message"</code>, here's what actually executes internally:
          </p>

          <CodeBlock lang="bash" title="What git commit actually does under the hood">
{`# Step 1: Write each staged file as a blob
$ git hash-object -w src/auth.js     # → c1d2e3…
$ git hash-object -w src/index.js    # → d4e5f6…

# Step 2: Build tree objects from the index
$ git write-tree                     # → 4b825d…

# Step 3: Create the commit object
$ git commit-tree 4b825d \
    -p HEAD \
    -m "feat: add auth"              # → f7a8b9…

# Step 4: Move the branch pointer forward
$ git update-ref refs/heads/main f7a8b9…`}
          </CodeBlock>

          <Callout type="success" title="Why plumbing knowledge matters">
            Understanding plumbing commands is the difference between blindly following StackOverflow answers and actually knowing what you're doing. When you need to surgically repair a corrupt repository, extract a single blob from a bare clone, or script complex Git operations, these are your tools.
          </Callout>
        </section>

        {/* ── SECTION 5: COMPRESSION & PACKFILES ── */}
        <section className="int-section fade-in-section">
          <div className="int-label">Storage Optimization</div>
          <h2 className="int-title">zlib compression & packfiles</h2>
          <p className="int-desc">
            Git would be unusable if it stored a full copy of every file for every commit. It doesn't — thanks to zlib compression and delta-compressed packfiles. Drag the slider to simulate what happens to your object store over time.
          </p>

          <p className="int-body">
            Every "loose" object written to <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>.git/objects/</code> is individually compressed with <strong>zlib</strong>. A text file often compresses to 30-40% of its original size. This is why you cannot just <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>cat</code> an object file — it's binary garbage until you decompress it with <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>git cat-file</code>.
          </p>

          <p className="int-body">
            Loose objects are fine for a while, but a repository with 10,000 commits has tens of thousands of object files. <strong>Garbage collection</strong> (<code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>git gc</code>) solves this by packing all loose objects into a single binary <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>.pack</code> file using delta compression — storing only the differences between similar files.
          </p>

          <PackfileVisualizer />

          <DeepDive title="Delta compression internals — how Git finds similar objects" badge="deep">
            <p>When building a packfile, Git doesn't just diff adjacent versions of the same file — it finds similar objects across your entire repository using a heuristic based on filename similarity and size proximity. It can delta-compress a file against any similar object, not just its previous version.</p>
            <p>The resulting packfile stores objects in two forms: a "base" object (stored in full) and "delta" objects (stored as a set of copy/insert instructions relative to a base). To reconstruct a historical version, Git reads the delta chain backwards. A long delta chain hurts checkout performance, so Git limits chain depth and occasionally "re-deltas" during repacking.</p>
            <p>Git pushes and pulls transfer packfiles over the network. This is why cloning a large repo over a fast connection is so efficient — you download one compressed binary blob instead of thousands of individual objects.</p>
          </DeepDive>
        </section>

        {/* ── SECTION 6: IMMUTABILITY & TAMPER-PROOF HISTORY ── */}
        <section className="int-section fade-in-section">
          <div className="int-label">Cryptographic Integrity</div>
          <h2 className="int-title">Why commits cannot be silently altered</h2>
          <p className="int-desc">
            A Git commit's hash is derived from its <em>entire content</em> — including the parent commit's hash. Changing any commit in history changes its hash, which invalidates every descendant. Try it below.
          </p>

          <p className="int-body">
            The data fed to SHA-1 when creating a commit object includes: the root tree hash, all parent commit hashes, the author identity and timestamp, the committer identity and timestamp, and the commit message. Every field is part of the hash input. This means:
          </p>

          <ul className="int-body" style={{ paddingLeft: 24 }}>
            <li>Change the message → new hash → all children have a different parent hash → all children are new commits</li>
            <li>Change the author → same cascade</li>
            <li>Change a file → tree hash changes → commit hash changes → all descendants are new commits</li>
            <li>Change the timestamp by 1 second → new hash for that commit and every descendant</li>
          </ul>

          <ImmutabilityDemo />

          <Callout type="danger" title="This is what 'rewriting history' actually means">
            Commands like `git rebase`, `git commit --amend`, and `git reset --hard` don't modify existing commits — they create new ones with new hashes. The old commits still exist (in the reflog!) until garbage collection removes them. When you force-push rewritten history, you're replacing commits on the remote — anyone who based work on the old commits will have merge conflicts.
          </Callout>

          <DeepDive title="The cryptographic chain makes Git suitable as an audit log" badge="security">
            <p>Because each commit commits to its entire ancestry (its hash includes the parent hash, which includes the grandparent hash, and so on), a Git repository's commit graph can be used as a tamper-evident log. If you know the hash of the HEAD commit and can verify it against a trusted source, you can prove the complete history has not been altered.</p>
            <p>This is why some compliance frameworks accept a Git repository as an audit trail. The hash of a signed tag (plus its GPG signature) proves the state of the entire history at that point in time. Tools like <code>git log --show-signature</code> and <code>git verify-tag</code> expose this verification chain.</p>
          </DeepDive>
        </section>

        {/* ── FINAL SECTION: QUICK REFERENCE ── */}
        <section className="int-section fade-in-section">
          <div className="int-label">Quick Reference</div>
          <h2 className="int-title">Essential plumbing commands</h2>
          <p className="int-desc">
            These are the low-level commands you'll reach for when debugging, scripting, or recovering from disasters.
          </p>

          <CodeBlock lang="bash" title="git internals cheatsheet">
{`# ── READING OBJECTS ──────────────────────────────────
git cat-file -t <hash>        # Print object type (blob/tree/commit/tag)
git cat-file -p <hash>        # Pretty-print object content
git cat-file -s <hash>        # Print object size in bytes
git cat-file --batch          # Read multiple objects from stdin

# ── WRITING OBJECTS ──────────────────────────────────
git hash-object <file>        # Compute hash without writing
git hash-object -w <file>     # Compute hash AND write to .git/objects

# ── TREES & STAGING ──────────────────────────────────
git write-tree                # Write index to a tree object → hash
git ls-files --stage          # Show index contents (staged files)
git read-tree <tree-hash>     # Load a tree into the index

# ── REFS & BRANCHES ──────────────────────────────────
git rev-parse HEAD            # Resolve any ref to a commit hash
git update-ref <ref> <hash>   # Move a ref to a new hash (= move a branch)
git symbolic-ref HEAD         # Show what HEAD points to
git for-each-ref              # List all refs with their hashes

# ── PACKING & GC ─────────────────────────────────────
git count-objects -vH         # Count loose objects + sizes
git gc                        # Pack loose objects, prune old reflog entries
git repack -a -d -f           # Aggressive repack (one big packfile)
git verify-pack -v pack.idx   # Inspect packfile contents

# ── GRAPH TRAVERSAL ──────────────────────────────────
git rev-list HEAD             # List all commit hashes from HEAD to root
git rev-list --count HEAD     # Count total commits
git log --graph --format='%H' # Visualize the DAG`}
          </CodeBlock>

          <Callout type="info" title="You've now seen the full stack">
            From bytes on disk → zlib compressed blobs → SHA-1 named files in .git/objects → tree objects linking filenames to blobs → commit objects linking to trees and parent commits → ref files pointing to commit hashes → HEAD pointing to a ref. That's the entire Git object model. Every porcelain command you use every day is just a convenient wrapper around these primitives.
          </Callout>
        </section>

      </div>
    </>
  );
}