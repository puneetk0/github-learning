import React, { useState } from 'react';

export default function ResetModeVisualizer() {
  const [mode, setMode] = useState('none'); // none, soft, mixed, hard
  
  // File state before reset
  // Commit A (Target): File content = "v1"
  // Commit B (Head): File content = "v2"
  
  // We are resetting from B back to A.
  // The working directory currently has "v2".
  
  const getBoxStyle = (isActive, color) => ({
    flex: 1,
    padding: '16px',
    background: isActive ? `rgba(${color}, 0.1)` : 'var(--surface)',
    border: `2px solid ${isActive ? `rgba(${color}, 1)` : 'var(--border)'}`,
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.3s ease'
  });

  const getFileStyle = (content, visible) => ({
    width: '60px',
    height: '80px',
    background: '#fff',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '18px',
    opacity: visible ? 1 : 0.2,
    transform: visible ? 'scale(1)' : 'scale(0.8)',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  });

  return (
    <div className="cr-container" style={{ margin: '32px 0' }}>
      <div className="cr-header">
        <div className="cr-title">Visualizing: git reset HEAD~1</div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', background: 'var(--bg2)' }}>
        
        {/* Buttons */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button className="btn" style={{ background: mode === 'none' ? 'var(--text)' : 'var(--surface)', color: mode === 'none' ? '#000' : 'var(--text)' }} onClick={() => setMode('none')}>Before Reset</button>
          <button className="btn" style={{ background: mode === 'soft' ? 'var(--blue)' : 'var(--surface)', color: mode === 'soft' ? '#fff' : 'var(--text)', border: mode==='soft'?'none':undefined }} onClick={() => setMode('soft')}>--soft</button>
          <button className="btn" style={{ background: mode === 'mixed' ? 'var(--yellow)' : 'var(--surface)', color: mode === 'mixed' ? '#000' : 'var(--text)', border: mode==='mixed'?'none':undefined }} onClick={() => setMode('mixed')}>--mixed</button>
          <button className="btn" style={{ background: mode === 'hard' ? 'var(--red)' : 'var(--surface)', color: mode === 'hard' ? '#fff' : 'var(--text)', border: mode==='hard'?'none':undefined }} onClick={() => setMode('hard')}>--hard</button>
        </div>

        {/* Explanation */}
        <div style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '14px', minHeight: '40px' }}>
          {mode === 'none' && "You are on Commit B. You want to undo it and go back to Commit A."}
          {mode === 'soft' && <span style={{color: 'var(--blue)'}}>Branch pointer moves back. The undone commit's changes are <strong>staged</strong>, ready to recommit.</span>}
          {mode === 'mixed' && <span style={{color: 'var(--yellow)'}}>Branch pointer moves back. Staging is cleared. Changes are <strong>unstaged</strong> in your working directory.</span>}
          {mode === 'hard' && <span style={{color: 'var(--red)'}}>Branch pointer moves back. Staging is cleared. Working directory changes are <strong>DESTROYED</strong>.</span>}
        </div>

        {/* Visualizer */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          
          <div style={getBoxStyle(true, '255, 255, 255')}>
            <h4 style={{ color: 'var(--text)' }}>Branch Pointer</h4>
            <div style={{ fontSize: '24px', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              {mode === 'none' ? 'Commit B' : 'Commit A'}
            </div>
          </div>

          <div style={getBoxStyle(mode === 'soft', '64, 169, 255')}>
            <h4 style={{ color: mode === 'soft' ? 'var(--blue)' : 'var(--text)' }}>Staging Area</h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={getFileStyle('v2', mode === 'soft')}>v2</div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text2)' }}>
              {mode === 'soft' ? 'Changes staged' : 'Empty'}
            </div>
          </div>

          <div style={getBoxStyle(mode === 'none' || mode === 'soft' || mode === 'mixed', '255, 165, 0')}>
            <h4 style={{ color: mode === 'mixed' ? 'var(--yellow)' : 'var(--text)' }}>Working Directory</h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={getFileStyle(mode === 'hard' ? 'v1' : 'v2', true)}>
                {mode === 'hard' ? 'v1' : 'v2'}
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text2)' }}>
              {mode === 'hard' ? 'Reverted to v1' : 'Contains v2 changes'}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
