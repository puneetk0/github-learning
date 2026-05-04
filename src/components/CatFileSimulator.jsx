import React, { useState, useRef, useEffect } from 'react';

export default function CatFileSimulator() {
  const [history, setHistory] = useState([
    { type: 'info', text: 'Welcome to the Git object inspector.' },
    { type: 'info', text: 'Try running: git cat-file -p HEAD' }
  ]);
  const [input, setInput] = useState('');
  
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Mock Objects Database
  const objects = {
    'HEAD': 'tree 9d8e7f6a\nparent c5d4e3f2\nauthor Alice <alice@example.com> 1710518400 +0000\ncommitter Alice <alice@example.com> 1710518400 +0000\n\nfeat: add payment processing',
    '9d8e7f6a': '100644 blob a1b2c3d    README.md\n100644 blob e4f5g6h    package.json\n040000 tree i7j8k9l    src',
    'a1b2c3d': '# My Startup API\n\nThis is the backend for our application.',
    'e4f5g6h': '{\n  "name": "startup-api",\n  "version": "1.0.0"\n}',
    'i7j8k9l': '100644 blob z1y2x3w    index.js\n100644 blob v4u5t6s    auth.js'
  };

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      if (!cmd) return;
      
      const newHistory = [...history, { type: 'cmd', text: `$ ${cmd}` }];
      
      if (cmd.startsWith('git cat-file -p')) {
        const hash = cmd.split(' ').pop();
        if (objects[hash]) {
          newHistory.push({ type: 'output', text: objects[hash] });
        } else {
          newHistory.push({ type: 'error', text: `fatal: Not a valid object name ${hash}` });
        }
      } else if (cmd.startsWith('git cat-file -t')) {
        const hash = cmd.split(' ').pop();
        if (hash === 'HEAD') {
          newHistory.push({ type: 'output', text: 'commit' });
        } else if (hash === '9d8e7f6a' || hash === 'i7j8k9l') {
          newHistory.push({ type: 'output', text: 'tree' });
        } else if (objects[hash]) {
          newHistory.push({ type: 'output', text: 'blob' });
        } else {
          newHistory.push({ type: 'error', text: `fatal: Not a valid object name ${hash}` });
        }
      } else if (cmd === 'clear') {
        setHistory([]);
        setInput('');
        return;
      } else {
        newHistory.push({ type: 'error', text: `git: '${cmd.split(' ')[1] || cmd}' is not supported in this simulator. Use 'git cat-file -p <hash>'` });
      }
      
      setHistory(newHistory);
      setInput('');
    }
  };

  return (
    <div className="cr-container" style={{ margin: '32px 0' }}>
      <div className="cr-header">
        <div className="cr-title">Terminal: git cat-file</div>
      </div>
      
      <div style={{ background: 'var(--bg2)', padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '13px', display: 'flex', flexDirection: 'column', height: '350px', color: 'var(--text)' }}>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {history.map((h, i) => (
            <div key={i} style={{ 
              color: h.type === 'cmd' ? '#fff' : 
                     h.type === 'error' ? 'var(--red)' : 
                     h.type === 'output' ? 'var(--blue)' : 'var(--text2)',
              whiteSpace: 'pre-wrap'
            }}>
              {h.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', color: '#fff', borderTop: '1px solid #333', paddingTop: '12px' }}>
          <span style={{ color: 'var(--green)', marginRight: '8px' }}>~ $</span>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', flex: 1, fontFamily: 'inherit', fontSize: 'inherit' }}
            placeholder="git cat-file -p HEAD"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
}
