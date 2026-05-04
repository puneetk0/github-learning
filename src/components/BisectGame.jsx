import React, { useState, useEffect } from 'react';

export default function BisectGame() {
  const [commits, setCommits] = useState([]);
  const [badIndex, setBadIndex] = useState(-1);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(15);
  const [status, setStatus] = useState('start'); // start, playing, won, lost

  const startNewGame = () => {
    const total = 16;
    // Bug must be introduced somewhere between index 1 and 15
    const bugIdx = Math.floor(Math.random() * (total - 1)) + 1;
    
    const newCommits = Array.from({ length: total }, (_, i) => ({
      id: `c${i+1}`,
      hasBug: i >= bugIdx
    }));
    
    setCommits(newCommits);
    setBadIndex(bugIdx);
    setLow(0); // 0 is known good
    setHigh(total - 1); // 15 is known bad
    
    // First bisect jump
    const mid = Math.floor((0 + (total - 1)) / 2);
    setCurrentIndex(mid);
    setStatus('playing');
  };

  const handleTest = (result) => {
    if (status !== 'playing') return;

    let newLow = low;
    let newHigh = high;

    if (result === 'bad') {
      newHigh = currentIndex;
    } else {
      newLow = currentIndex;
    }

    if (newHigh - newLow <= 1) {
      if (newHigh === badIndex) {
        setStatus('won');
        setCurrentIndex(newHigh);
      } else {
        setStatus('lost');
      }
    } else {
      setLow(newLow);
      setHigh(newHigh);
      setCurrentIndex(Math.floor((newLow + newHigh) / 2));
    }
  };

  return (
    <div className="cr-container" style={{ margin: '32px 0' }}>
      <div className="cr-header">
        <div className="cr-title">Terminal: git bisect</div>
        {status !== 'start' && <button className="btn" onClick={startNewGame}>Restart Game</button>}
      </div>
      
      <div style={{ padding: '24px', background: '#0a0a0f' }}>
        {status === 'start' ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h3 style={{ color: 'var(--text)', marginBottom: '16px' }}>Find the bug in 4 steps</h3>
            <p style={{ color: 'var(--text2)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
              There are 16 commits. The bug was introduced in one of them. 
              Git will check out a commit halfway between known good and bad. Test the code, tell Git the result, and find the culprit.
            </p>
            <button className="btn" style={{ background: 'var(--blue)', color: '#fff', border: 'none', padding: '12px 24px', fontSize: '16px' }} onClick={startNewGame}>
              Start git bisect
            </button>
          </div>
        ) : (
          <div>
            {/* Timeline */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: 'var(--border)', zIndex: 0 }}></div>
              
              {commits.map((c, i) => {
                let color = 'var(--surface)';
                let border = 'var(--border)';
                
                if (i <= low) {
                  color = 'rgba(0,255,0,0.2)';
                  border = 'var(--green)';
                } else if (i >= high) {
                  color = 'rgba(255,0,0,0.2)';
                  border = 'var(--red)';
                }
                
                if (i === currentIndex && status === 'playing') {
                  color = 'var(--blue)';
                  border = '#fff';
                }

                if (status === 'won' && i === badIndex) {
                  color = 'var(--red)';
                  border = '#fff';
                }

                return (
                  <div key={i} style={{ 
                    width: '20px', height: '20px', borderRadius: '50%', 
                    background: color, border: `2px solid ${border}`,
                    zIndex: 1, position: 'relative',
                    boxShadow: i === currentIndex ? '0 0 10px var(--blue)' : 'none'
                  }}>
                    {i === currentIndex && status === 'playing' && (
                      <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', color: 'var(--blue)', fontSize: '12px', fontWeight: 'bold' }}>HEAD</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Controls */}
            {status === 'playing' && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text)', marginBottom: '16px' }}>
                  Git checked out commit <strong>{commits[currentIndex].id}</strong>.<br/>
                  <span style={{ color: 'var(--text2)', fontSize: '14px' }}>You run the app. Is the bug present?</span>
                </p>
                
                {/* Simulated test result just for the game */}
                <div style={{ marginBottom: '24px', padding: '12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', display: 'inline-block' }}>
                  {commits[currentIndex].hasBug ? (
                    <span style={{ color: 'var(--red)' }}>❌ App crashed! Bug is present.</span>
                  ) : (
                    <span style={{ color: 'var(--green)' }}>✅ App works perfectly.</span>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                  <button className="btn" style={{ background: 'var(--green)', color: '#fff', border: 'none' }} onClick={() => handleTest('good')}>
                    git bisect good
                  </button>
                  <button className="btn" style={{ background: 'var(--red)', color: '#fff', border: 'none' }} onClick={() => handleTest('bad')}>
                    git bisect bad
                  </button>
                </div>
              </div>
            )}

            {status === 'won' && (
              <div style={{ textAlign: 'center', color: 'var(--green)' }}>
                <h3 style={{ marginBottom: '8px' }}>🎉 You found it!</h3>
                <p>Commit <strong>{commits[badIndex].id}</strong> is the first bad commit.</p>
                <code style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', marginTop: '16px', display: 'inline-block', color: 'var(--text)' }}>git bisect reset</code>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
