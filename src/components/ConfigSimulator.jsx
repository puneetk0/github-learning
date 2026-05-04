import React, { useState, useRef, useEffect } from 'react';

export default function ConfigSimulator() {
  const [history, setHistory] = useState([
    { type: 'info', text: 'Welcome to Git Setup. Let\'s configure your identity.' },
    { type: 'info', text: 'Try running: git config --global user.name "Your Name"' }
  ]);
  const [input, setInput] = useState('');
  const [config, setConfig] = useState({
    name: '',
    email: '',
    editor: '',
    branch: '',
    color: ''
  });
  
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      if (!cmd) return;
      
      const newHistory = [...history, { type: 'cmd', text: `$ ${cmd}` }];
      
      // Parse command
      if (cmd.startsWith('git config --global user.name')) {
        const match = cmd.match(/user\.name\s+["']?([^"']+)["']?/);
        if (match && match[1]) {
          setConfig({ ...config, name: match[1] });
          newHistory.push({ type: 'success', text: 'Global user.name updated.' });
        } else {
          newHistory.push({ type: 'error', text: 'usage: git config --global user.name "Your Name"' });
        }
      } else if (cmd.startsWith('git config --global user.email')) {
        const match = cmd.match(/user\.email\s+["']?([^"']+)["']?/);
        if (match && match[1]) {
          setConfig({ ...config, email: match[1] });
          newHistory.push({ type: 'success', text: 'Global user.email updated.' });
        } else {
          newHistory.push({ type: 'error', text: 'usage: git config --global user.email "you@example.com"' });
        }
      } else if (cmd.startsWith('git config --global core.editor')) {
        const match = cmd.match(/core\.editor\s+["']?([^"']+)["']?/);
        if (match && match[1]) {
          setConfig({ ...config, editor: match[1] });
          newHistory.push({ type: 'success', text: 'Global core.editor updated.' });
        }
      } else if (cmd.startsWith('git config --global init.defaultBranch')) {
        const match = cmd.match(/init\.defaultBranch\s+["']?([^"']+)["']?/);
        if (match && match[1]) {
          setConfig({ ...config, branch: match[1] });
          newHistory.push({ type: 'success', text: 'Global init.defaultBranch updated.' });
        }
      } else if (cmd.startsWith('git config --list')) {
        let output = [];
        if (config.name) output.push(`user.name=${config.name}`);
        if (config.email) output.push(`user.email=${config.email}`);
        if (config.editor) output.push(`core.editor=${config.editor}`);
        if (config.branch) output.push(`init.defaultbranch=${config.branch}`);
        if (output.length === 0) output.push('No configurations set.');
        newHistory.push({ type: 'output', text: output.join('\n') });
      } else {
        newHistory.push({ type: 'error', text: `git: '${cmd.split(' ')[1] || cmd}' is not a git command or not supported in this simulator.` });
      }
      
      setHistory(newHistory);
      setInput('');
    }
  };

  return (
    <div className="cr-container" style={{ margin: '32px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="cr-header">
        <div className="cr-title">Interactive Setup: git config</div>
      </div>
      
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {/* Terminal Side */}
        <div style={{ flex: '1 1 300px', background: 'var(--bg2)', borderRadius: '8px', padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '13px', display: 'flex', flexDirection: 'column', height: '300px', color: 'var(--text)' }}>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {history.map((h, i) => (
              <div key={i} style={{ 
                color: h.type === 'cmd' ? '#fff' : 
                       h.type === 'error' ? 'var(--red)' : 
                       h.type === 'success' ? 'var(--green)' : 
                       h.type === 'output' ? 'var(--blue)' : 'var(--text2)',
                whiteSpace: 'pre-wrap'
              }}>
                {h.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
            <span style={{ color: 'var(--green)', marginRight: '8px' }}>~ $</span>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', flex: 1, fontFamily: 'inherit', fontSize: 'inherit' }}
              placeholder="git config --global user.name ..."
              spellCheck="false"
            />
          </div>
        </div>
        
        {/* Visual ~/.gitconfig file */}
        <div style={{ flex: '1 1 300px', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}>
            ~/.gitconfig
          </div>
          <div style={{ padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text)', whiteSpace: 'pre-wrap', flex: 1 }}>
            {config.name || config.email ? (
              <div style={{ color: 'var(--blue)' }}>
                [user]
                {config.name && <div style={{ color: 'var(--text)', paddingLeft: '16px' }}>name = {config.name}</div>}
                {config.email && <div style={{ color: 'var(--text)', paddingLeft: '16px' }}>email = {config.email}</div>}
              </div>
            ) : null}
            
            {config.editor ? (
              <div style={{ color: 'var(--blue)', marginTop: '8px' }}>
                [core]
                <div style={{ color: 'var(--text)', paddingLeft: '16px' }}>editor = {config.editor}</div>
              </div>
            ) : null}
            
            {config.branch ? (
              <div style={{ color: 'var(--blue)', marginTop: '8px' }}>
                [init]
                <div style={{ color: 'var(--text)', paddingLeft: '16px' }}>defaultBranch = {config.branch}</div>
              </div>
            ) : null}
            
            {!config.name && !config.email && !config.editor && !config.branch && (
              <div style={{ color: 'var(--text2)', fontStyle: 'italic' }}>
                # File is empty. Run commands to see it update.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
