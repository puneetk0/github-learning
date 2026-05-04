import React, { useState, useMemo } from 'react';
import { Folder, File, FileCode, FileText } from 'lucide-react';

export default function GitIgnoreBuilder() {
  const [rules, setRules] = useState({
    nodeModules: false,
    logs: false,
    env: false,
    build: false,
    dsStore: false
  });

  const files = [
    { path: 'package.json', type: 'file', icon: <FileCode size={16} /> },
    { path: 'src/index.js', type: 'file', icon: <FileCode size={16} /> },
    { path: 'node_modules/react/index.js', type: 'file', rule: 'nodeModules', icon: <Folder size={16} /> },
    { path: 'node_modules/lodash/lodash.js', type: 'file', rule: 'nodeModules', icon: <Folder size={16} /> },
    { path: '.env', type: 'file', rule: 'env', icon: <File size={16} /> },
    { path: '.env.local', type: 'file', rule: 'env', icon: <File size={16} /> },
    { path: 'npm-debug.log', type: 'file', rule: 'logs', icon: <FileText size={16} /> },
    { path: 'error.log', type: 'file', rule: 'logs', icon: <FileText size={16} /> },
    { path: 'dist/bundle.js', type: 'file', rule: 'build', icon: <Folder size={16} /> },
    { path: '.DS_Store', type: 'file', rule: 'dsStore', icon: <File size={16} /> }
  ];

  const toggleRule = (rule) => {
    setRules(prev => ({ ...prev, [rule]: !prev[rule] }));
  };

  const generatedConfig = useMemo(() => {
    let output = [];
    if (rules.nodeModules) output.push('node_modules/');
    if (rules.logs) output.push('*.log');
    if (rules.env) output.push('.env\n.env.*');
    if (rules.build) output.push('dist/\nbuild/');
    if (rules.dsStore) output.push('.DS_Store');
    return output.join('\n');
  }, [rules]);

  return (
    <div className="cr-container" style={{ margin: '32px 0' }}>
      <div className="cr-header">
        <div className="cr-title">Interactive .gitignore Builder</div>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '20px' }}>
        {/* Controls */}
        <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ color: 'var(--text)', fontSize: '14px', marginBottom: '8px' }}>Toggle Rules:</h4>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text2)', fontSize: '14px' }}>
            <input type="checkbox" checked={rules.nodeModules} onChange={() => toggleRule('nodeModules')} />
            <code>node_modules/</code>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text2)', fontSize: '14px' }}>
            <input type="checkbox" checked={rules.logs} onChange={() => toggleRule('logs')} />
            <code>*.log</code>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text2)', fontSize: '14px' }}>
            <input type="checkbox" checked={rules.env} onChange={() => toggleRule('env')} />
            <code>.env</code> & variants
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text2)', fontSize: '14px' }}>
            <input type="checkbox" checked={rules.build} onChange={() => toggleRule('build')} />
            <code>dist/</code>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text2)', fontSize: '14px' }}>
            <input type="checkbox" checked={rules.dsStore} onChange={() => toggleRule('dsStore')} />
            <code>.DS_Store</code>
          </label>
          
          <div style={{ marginTop: '20px', background: '#0a0a0f', padding: '12px', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '12px', whiteSpace: 'pre-wrap', color: 'var(--blue)' }}>
            <span style={{ color: 'var(--text2)', display: 'block', marginBottom: '8px' }}># .gitignore preview</span>
            {generatedConfig || <span style={{ color: 'var(--text3)' }}># Empty</span>}
          </div>
        </div>

        {/* File Tree */}
        <div style={{ flex: '1 1 300px', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)', padding: '16px' }}>
          <h4 style={{ color: 'var(--text)', fontSize: '14px', marginBottom: '16px' }}>Working Directory</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {files.map((file, i) => {
              const isIgnored = file.rule && rules[file.rule];
              return (
                <div key={i} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '6px 8px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '13px',
                  color: isIgnored ? 'var(--text3)' : 'var(--text)',
                  textDecoration: isIgnored ? 'line-through' : 'none',
                  background: isIgnored ? 'rgba(255,0,0,0.05)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}>
                  <span style={{ color: isIgnored ? 'var(--text3)' : 'var(--blue)', display: 'flex' }}>
                    {file.icon}
                  </span>
                  {file.path}
                  {isIgnored && <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--red)' }}>Ignored</span>}
                  {!isIgnored && <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--green)' }}>Tracked</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
