import React, { useState, useEffect } from 'react';
import { Copy, TerminalSquare } from 'lucide-react';
import './CommandBuilder.css';

const COMMAND_TEMPLATES = {
  push: {
    base: 'git push',
    options: [
      { id: 'remote', label: 'Remote', type: 'select', choices: ['origin', 'upstream'], default: 'origin' },
      { id: 'branch', label: 'Branch', type: 'input', placeholder: 'main', default: 'main' },
      { id: 'force', label: 'Force Push', type: 'toggle', flag: '--force-with-lease', default: false },
      { id: 'tags', label: 'Push Tags', type: 'toggle', flag: '--tags', default: false },
    ]
  },
  commit: {
    base: 'git commit',
    options: [
      { id: 'message', label: 'Message', type: 'input', placeholder: 'Fix bug...', default: '' },
      { id: 'all', label: 'Stage All (-a)', type: 'toggle', flag: '-a', default: false },
      { id: 'amend', label: 'Amend', type: 'toggle', flag: '--amend', default: false },
      { id: 'noEdit', label: 'No Edit', type: 'toggle', flag: '--no-edit', default: false, dependsOn: 'amend' }
    ]
  },
  rebase: {
    base: 'git rebase',
    options: [
      { id: 'interactive', label: 'Interactive', type: 'toggle', flag: '-i', default: false },
      { id: 'target', label: 'Target Branch', type: 'input', placeholder: 'main', default: 'main' },
      { id: 'onto', label: 'Onto (Advanced)', type: 'input', placeholder: '', default: '' }
    ]
  }
};

export default function CommandBuilder() {
  const [activeCmd, setActiveCmd] = useState('push');
  const [config, setConfig] = useState({});
  const [generatedCmd, setGeneratedCmd] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Reset config when command type changes
    const template = COMMAND_TEMPLATES[activeCmd];
    const initialConfig = {};
    template.options.forEach(opt => {
      initialConfig[opt.id] = opt.default;
    });
    setConfig(initialConfig);
  }, [activeCmd]);

  useEffect(() => {
    const template = COMMAND_TEMPLATES[activeCmd];
    let parts = [template.base];

    if (activeCmd === 'push') {
      if (config.force) parts.push('--force-with-lease');
      if (config.tags) parts.push('--tags');
      parts.push(config.remote || 'origin');
      parts.push(config.branch || 'main');
    } else if (activeCmd === 'commit') {
      if (config.all) parts.push('-a');
      if (config.amend) parts.push('--amend');
      if (config.noEdit && config.amend) parts.push('--no-edit');
      if (config.message && !config.noEdit) parts.push(`-m "${config.message}"`);
    } else if (activeCmd === 'rebase') {
      if (config.interactive) parts.push('-i');
      if (config.onto) parts.push(`--onto ${config.onto}`);
      parts.push(config.target || 'main');
    }

    setGeneratedCmd(parts.join(' '));
  }, [activeCmd, config]);

  const updateConfig = (id, value) => {
    setConfig(prev => ({ ...prev, [id]: value }));
  };

  const copyCmd = () => {
    navigator.clipboard.writeText(generatedCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cmd-builder">
      <div className="cb-sidebar">
        <div className="cb-title">I want to...</div>
        {Object.keys(COMMAND_TEMPLATES).map(cmd => (
          <button 
            key={cmd} 
            className={`cb-tab ${activeCmd === cmd ? 'active' : ''}`}
            onClick={() => setActiveCmd(cmd)}
          >
            {cmd}
          </button>
        ))}
      </div>

      <div className="cb-main">
        <div className="cb-options">
          {COMMAND_TEMPLATES[activeCmd].options.map(opt => {
            if (opt.dependsOn && !config[opt.dependsOn]) return null;
            
            return (
              <div key={opt.id} className="cb-option-group">
                <label className="cb-label">{opt.label}</label>
                
                {opt.type === 'select' && (
                  <select 
                    className="cb-input"
                    value={config[opt.id]} 
                    onChange={e => updateConfig(opt.id, e.target.value)}
                  >
                    {opt.choices.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                )}

                {opt.type === 'input' && (
                  <input 
                    className="cb-input"
                    type="text" 
                    placeholder={opt.placeholder}
                    value={config[opt.id]}
                    onChange={e => updateConfig(opt.id, e.target.value)}
                  />
                )}

                {opt.type === 'toggle' && (
                  <label className="cb-toggle">
                    <input 
                      type="checkbox" 
                      checked={config[opt.id]}
                      onChange={e => updateConfig(opt.id, e.target.checked)}
                    />
                    <span className="cb-slider"></span>
                    <span className="cb-toggle-label">{opt.flag}</span>
                  </label>
                )}
              </div>
            );
          })}
        </div>

        <div className="cb-result">
          <TerminalSquare size={16} color="var(--accent)" />
          <div className="cb-generated">{generatedCmd}</div>
          <button className={`cb-copy ${copied ? 'copied' : ''}`} onClick={copyCmd}>
            {copied ? 'Copied!' : <Copy size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
