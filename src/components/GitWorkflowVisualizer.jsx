import React, { useState } from 'react';
import './GitWorkflowVisualizer.css';
import { File, Check, UploadCloud, RefreshCw } from 'lucide-react';

export default function GitWorkflowVisualizer() {
  const [files, setFiles] = useState([
    { id: 1, name: 'index.html', state: 'working' },
    { id: 2, name: 'style.css', state: 'working' }
  ]);

  const moveFile = (id, newState) => {
    setFiles(files.map(f => f.id === id ? { ...f, state: newState } : f));
  };

  const getFilesByState = (state) => files.filter(f => f.state === state);

  const stageAll = () => setFiles(files.map(f => (f.state === 'working' ? { ...f, state: 'staging' } : f)));
  const commitAll = () => setFiles(files.map(f => (f.state === 'staging' ? { ...f, state: 'local' } : f)));
  const pushAll = () => setFiles(files.map(f => (f.state === 'local' ? { ...f, state: 'remote' } : f)));
  const resetAll = () => setFiles(files.map(f => ({ ...f, state: 'working' })));

  return (
    <div className="workflow-vis">
      <div className="workflow-controls">
        <button className="wf-btn" onClick={stageAll} disabled={getFilesByState('working').length === 0}>
          <File size={16} /> git add .
        </button>
        <button className="wf-btn" onClick={commitAll} disabled={getFilesByState('staging').length === 0}>
          <Check size={16} /> git commit
        </button>
        <button className="wf-btn" onClick={pushAll} disabled={getFilesByState('local').length === 0}>
          <UploadCloud size={16} /> git push
        </button>
        <button className="wf-btn reset" onClick={resetAll}>
          <RefreshCw size={16} /> Reset Demo
        </button>
      </div>

      <div className="workflow-canvas">
        <div className="wf-zone working-dir">
          <div className="zone-header">Working Directory</div>
          <div className="file-container">
            {getFilesByState('working').map(f => (
              <div key={f.id} className="file-node working" onClick={() => moveFile(f.id, 'staging')}>
                {f.name}
              </div>
            ))}
          </div>
        </div>

        <div className="wf-arrow">→</div>

        <div className="wf-zone staging-area">
          <div className="zone-header">Staging Area (Index)</div>
          <div className="file-container">
            {getFilesByState('staging').map(f => (
              <div key={f.id} className="file-node staging" onClick={() => moveFile(f.id, 'local')}>
                {f.name}
              </div>
            ))}
          </div>
        </div>

        <div className="wf-arrow">→</div>

        <div className="wf-zone local-repo">
          <div className="zone-header">Local Repo (.git)</div>
          <div className="file-container">
            {getFilesByState('local').map(f => (
              <div key={f.id} className="file-node local" onClick={() => moveFile(f.id, 'remote')}>
                {f.name}
              </div>
            ))}
          </div>
        </div>

        <div className="wf-arrow">→</div>

        <div className="wf-zone remote-repo">
          <div className="zone-header">Remote (GitHub)</div>
          <div className="file-container">
            {getFilesByState('remote').map(f => (
              <div key={f.id} className="file-node remote">
                {f.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
