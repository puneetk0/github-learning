import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Home() {
  return (
    <section className="hero" id="top">
      <div className="hero-grid"></div>
      <div className="hero-glow"></div>
      <div className="hero-content">
        <div className="hero-badge">
          <span className="pulse-dot"></span>
          INTERACTIVE EDITION 2.0
        </div>
        <h1 className="hero-title">
          Stop memorizing.<br />
          <span>Understand Git.</span>
        </h1>
        <p className="hero-sub">
          A visual, interactive guide to how Git actually works under the hood. 
          Play with branches, resolve conflicts, and build a mental model that lasts.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num">6</div>
            <div className="hero-stat-label">Core Chapters</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">14</div>
            <div className="hero-stat-label">Visual Demos</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">40+</div>
            <div className="hero-stat-label">Commands</div>
          </div>
        </div>
        <NavLink to="/foundations" className="hero-btn">
          Start Learning
        </NavLink>
      </div>
    </section>
  );
}
