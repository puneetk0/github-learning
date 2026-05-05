import React, { useState } from 'react';

export default function InteractivePatchStaging() {
  const [step, setStep] = useState(0);
  const [stagedChunks, setStagedChunks] = useState([]);
  const [status, setStatus] = useState('waiting'); // waiting, done
  
  const hunks = [
    {
      id: 1,
      header: '@@ -45,7 +45,7 @@ function calculateTotal(cart) {',
      oldLines: ['  let total = 0;', '  for (let item of cart) {', '-   total += item.price;', '+   total += item.price * item.quantity; // BUG FIX', '  }', '  return total;', '}'],
      desc: 'Bug fix for total calculation.'
    },
    {
      id: 2,
      header: '@@ -80,4 +80,11 @@ export const checkout = () => {',
      oldLines: ['  console.log("Checking out...");', '+', '+ export const applyDiscount = (code) => {', '+   // FEATURE: Discount codes', '+   if (code === "SAVE20") return 0.8;', '+   return 1;', '+ }', '}'],
      desc: 'New discount feature.'
    }
  ];

  const handleChoice = (choice) => {
    if (choice === 'y') {
      setStagedChunks([...stagedChunks, hunks[step].id]);
    } else if (choice === 'q') {
      setStatus('done');
      return;
    }
    
    if (step < hunks.length - 1) {
      setStep(step + 1);
    } else {
      setStatus('done');
    }
  };

  const reset = () => {
    setStep(0);
    setStagedChunks([]);
    setStatus('waiting');
  };

  const renderDiffLine = (line, idx) => {
    let color = 'var(--text)';
    let bg = 'transparent';
    if (line.startsWith('+')) {
      color = 'var(--green)';
      bg = 'rgba(0, 255, 0, 0.1)';
    } else if (line.startsWith('-')) {
      color = 'var(--red)';
      bg = 'rgba(255, 0, 0, 0.1)';
    }
    return (
      <div key={idx} style={{ color, background: bg, padding: '0 8px' }}>
        {line}
      </div>
    );
  };

  if (status === 'done') {
    return (
      <div className="cr-container" style={{ margin: '32px 0' }}>
        <div className="cr-header">
          <div className="cr-title">Terminal: git add -p</div>
          <button className="btn" onClick={reset}>Restart Simulation</button>
        </div>
        <div style={{ background: 'var(--bg2)', padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text)' }}>
          <div style={{ color: 'var(--green)', marginBottom: '16px' }}>$ git add -p</div>
          <div>Patch staging complete.</div>
          <br/>
          <div style={{ color: 'var(--blue)' }}>$ git status</div>
          <div style={{ color: 'var(--green)', marginTop: '8px' }}>Changes to be committed:</div>
          <div style={{ color: 'var(--green)', marginLeft: '16px' }}>modified:   cart.js {stagedChunks.length > 0 ? `(${stagedChunks.length} chunks staged)` : '(0 chunks staged)'}</div>
          
          {stagedChunks.length < hunks.length && (
            <>
              <div style={{ color: 'var(--red)', marginTop: '16px' }}>Changes not staged for commit:</div>
              <div style={{ color: 'var(--red)', marginLeft: '16px' }}>modified:   cart.js ({hunks.length - stagedChunks.length} chunks unstaged)</div>
            </>
          )}
          
          <div style={{ marginTop: '24px', color: 'var(--text2)', fontStyle: 'italic', fontSize: '12px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
            Insight: By selectively staging, you can create one clean commit for the bug fix, and a separate clean commit for the new feature, even though you wrote them in the same file!
          </div>
        </div>
      </div>
    );
  }

  const currentHunk = hunks[step];

  return (
    <div className="cr-container" style={{ margin: '32px 0' }}>
      <div className="cr-header">
        <div className="cr-title">Terminal: git add -p</div>
      </div>
      
      <div style={{ background: 'var(--bg2)', padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text)' }}>
        <div style={{ color: 'var(--green)', marginBottom: '16px' }}>$ git add -p cart.js</div>
        
        <div style={{ color: 'var(--text)', marginBottom: '8px' }}>diff --git a/cart.js b/cart.js</div>
        <div style={{ color: 'var(--blue)', marginBottom: '8px' }}>{currentHunk.header}</div>
        
        <div style={{ marginBottom: '16px', background: 'var(--bg2)', borderRadius: '4px', overflow: 'hidden' }}>
          {currentHunk.oldLines.map((line, idx) => renderDiffLine(line, idx))}
        </div>
        
        <div style={{ color: 'var(--blue)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          Stage this hunk [y,n,q,a,d,s,?]? 
          <button className="btn" style={{ padding: '4px 8px', minWidth: 'auto', background: 'var(--surface)' }} onClick={() => handleChoice('y')}>y (yes)</button>
          <button className="btn" style={{ padding: '4px 8px', minWidth: 'auto', background: 'var(--surface)' }} onClick={() => handleChoice('n')}>n (no)</button>
          <button className="btn" style={{ padding: '4px 8px', minWidth: 'auto', background: 'var(--surface)' }} onClick={() => handleChoice('q')}>q (quit)</button>
        </div>
        
        <div style={{ marginTop: '16px', color: 'var(--text2)', fontSize: '12px' }}>
          Hint: This chunk contains a <strong>{currentHunk.desc}</strong>. Do you want this in your <em>next</em> commit?
        </div>
      </div>
    </div>
  );
}
