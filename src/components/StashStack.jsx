import React, { useState } from 'react';

export default function StashStack() {
  const [stash, setStash] = useState([]);
  const [workingDir, setWorkingDir] = useState('Clean');
  
  const possibleWork = [
    'WIP: login form validation',
    'WIP: Stripe payment intent integration',
    'WIP: new dashboard charts',
    'WIP: refactor auth middleware'
  ];

  const handleWork = () => {
    if (workingDir === 'Clean') {
      const randomWork = possibleWork[Math.floor(Math.random() * possibleWork.length)];
      setWorkingDir(randomWork);
    }
  };

  const handlePush = () => {
    if (workingDir !== 'Clean') {
      setStash([{ id: Date.now(), msg: workingDir }, ...stash]);
      setWorkingDir('Clean');
    }
  };

  const handlePop = () => {
    if (stash.length > 0) {
      if (workingDir !== 'Clean') {
        alert("Working directory is not clean. Commit or stash current changes first!");
        return;
      }
      const item = stash[0];
      setWorkingDir(item.msg);
      setStash(stash.slice(1));
    }
  };

  const handleDrop = () => {
    if (stash.length > 0) {
      setStash(stash.slice(1));
    }
  };

  return (
    <div className="cr-container" style={{ margin: '32px 0' }}>
      <div className="cr-header">
        <div className="cr-title">Visualizing: git stash</div>
      </div>
      
      <div style={{ display: 'flex', gap: '24px', padding: '24px', flexWrap: 'wrap' }}>
        {/* Working Directory */}
        <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ color: 'var(--text)' }}>Working Directory</h4>
          <div style={{ 
            height: '100px', 
            background: workingDir === 'Clean' ? 'rgba(0,255,0,0.05)' : 'rgba(255,165,0,0.1)', 
            border: `1px dashed ${workingDir === 'Clean' ? 'var(--green)' : 'var(--yellow)'}`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            textAlign: 'center',
            color: workingDir === 'Clean' ? 'var(--green)' : 'var(--yellow)'
          }}>
            {workingDir}
          </div>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="btn" onClick={handleWork} disabled={workingDir !== 'Clean'} style={{ flex: 1 }}>Write Code</button>
            <button className="btn" onClick={handlePush} disabled={workingDir === 'Clean'} style={{ flex: 1, background: 'var(--blue)', color: '#fff', border: 'none' }}>git stash push</button>
          </div>
        </div>

        {/* Stash Stack */}
        <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ color: 'var(--text)', display: 'flex', justifyContent: 'space-between' }}>
            Stash Stack
            <span style={{ color: 'var(--text2)', fontSize: '12px' }}>LIFO (Last In, First Out)</span>
          </h4>
          
          <div style={{ 
            flex: 1,
            minHeight: '150px',
            background: 'var(--bg2)', 
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            overflowY: 'auto'
          }}>
            {stash.length === 0 ? (
              <div style={{ color: 'var(--text3)', textAlign: 'center', marginTop: '40px' }}>No stashed entries.</div>
            ) : (
              stash.map((s, i) => (
                <div key={s.id} style={{ 
                  background: i === 0 ? 'var(--surface)' : 'rgba(255,255,255,0.02)', 
                  border: `1px solid ${i === 0 ? 'var(--blue)' : 'var(--border)'}`,
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: 'var(--text)'
                }}>
                  <div style={{ color: 'var(--blue)', marginBottom: '4px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>stash@&#123;{i}&#125;</div>
                  {s.msg}
                </div>
              ))
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="btn" onClick={handlePop} disabled={stash.length === 0} style={{ flex: 1, background: 'var(--green)', color: '#fff', border: 'none' }}>git stash pop</button>
            <button className="btn" onClick={handleDrop} disabled={stash.length === 0} style={{ flex: 1 }}>git stash drop</button>
          </div>
        </div>
      </div>
    </div>
  );
}
