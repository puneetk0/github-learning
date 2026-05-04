import React, { useState } from 'react';
import { Folder, FolderOpen, FileText, Hash } from 'lucide-react';

export default function GitFolderExplorer() {
  const [openFolders, setOpenFolders] = useState({
    root: true,
    objects: false,
    refs: true,
    heads: true,
    remotes: false
  });
  
  const [selectedFile, setSelectedFile] = useState('HEAD');

  const fileContents = {
    'HEAD': 'ref: refs/heads/main',
    'config': '[core]\n\trepositoryformatversion = 0\n\tfilemode = true\n\tbare = false\n[remote "origin"]\n\turl = git@github.com:user/repo.git\n\tfetch = +refs/heads/*:refs/remotes/origin/*',
    'refs/heads/main': 'a3f2c91d4e8b7f1c2d3e4f5a6b7c8d9e0f1a2b3c\n',
    'refs/heads/feature': 'e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3\n',
    'index': 'DIRC... (binary staging area data)',
    'objects/a3/f2c91d': '(compressed binary commit object)'
  };

  const toggleFolder = (folder) => {
    setOpenFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  const TreeItem = ({ name, type, id, children, fileKey, depth = 0 }) => {
    const isFolder = type === 'folder';
    const isOpen = openFolders[id];
    const isSelected = selectedFile === fileKey;

    return (
      <div>
        <div 
          onClick={() => isFolder ? toggleFolder(id) : setSelectedFile(fileKey)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: `6px 8px 6px ${depth * 16 + 8}px`,
            cursor: 'pointer',
            background: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            color: isSelected ? '#fff' : 'var(--text2)',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            userSelect: 'none'
          }}
          onMouseEnter={e => !isSelected && (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
          onMouseLeave={e => !isSelected && (e.currentTarget.style.background = 'transparent')}
        >
          <span style={{ marginRight: '8px', display: 'flex', color: isFolder ? 'var(--blue)' : 'var(--text3)' }}>
            {isFolder ? (isOpen ? <FolderOpen size={14} /> : <Folder size={14} />) : <FileText size={14} />}
          </span>
          {name}
        </div>
        {isFolder && isOpen && <div>{children}</div>}
      </div>
    );
  };

  return (
    <div className="cr-container" style={{ margin: '32px 0' }}>
      <div className="cr-header">
        <div className="cr-title">Interactive .git/ Folder Explorer</div>
      </div>
      
      <div style={{ display: 'flex', height: '350px' }}>
        {/* File Tree */}
        <div style={{ width: '250px', background: 'var(--bg2)', borderRight: '1px solid var(--border)', overflowY: 'auto', padding: '8px 0' }}>
          <TreeItem name=".git" type="folder" id="root" depth={0}>
            <TreeItem name="HEAD" type="file" fileKey="HEAD" depth={1} />
            <TreeItem name="config" type="file" fileKey="config" depth={1} />
            <TreeItem name="index" type="file" fileKey="index" depth={1} />
            
            <TreeItem name="objects" type="folder" id="objects" depth={1}>
              <TreeItem name="a3" type="folder" id="a3" depth={2}>
                <TreeItem name="f2c91d..." type="file" fileKey="objects/a3/f2c91d" depth={3} />
              </TreeItem>
              <TreeItem name="info" type="folder" id="info" depth={2} />
              <TreeItem name="pack" type="folder" id="pack" depth={2} />
            </TreeItem>

            <TreeItem name="refs" type="folder" id="refs" depth={1}>
              <TreeItem name="heads" type="folder" id="heads" depth={2}>
                <TreeItem name="main" type="file" fileKey="refs/heads/main" depth={3} />
                <TreeItem name="feature" type="file" fileKey="refs/heads/feature" depth={3} />
              </TreeItem>
              <TreeItem name="tags" type="folder" id="tags" depth={2} />
              <TreeItem name="remotes" type="folder" id="remotes" depth={2} />
            </TreeItem>
          </TreeItem>
        </div>

        {/* File Viewer */}
        <div style={{ flex: 1, background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border)', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text2)', display: 'flex', alignItems: 'center' }}>
            <Hash size={12} style={{ marginRight: '6px' }} />
            .git/{selectedFile}
          </div>
          <div style={{ padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text)', whiteSpace: 'pre-wrap', flex: 1, overflowY: 'auto' }}>
            {fileContents[selectedFile] || 'File is empty or binary.'}
          </div>
          
          {selectedFile === 'HEAD' && (
            <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--border)', fontSize: '13px', color: 'var(--text2)' }}>
              <strong>Insight:</strong> The HEAD file simply contains text pointing to another file (a branch). Click on <code>refs/heads/main</code> to see what it points to.
            </div>
          )}
          {selectedFile.startsWith('refs/heads') && (
            <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--border)', fontSize: '13px', color: 'var(--text2)' }}>
              <strong>Insight:</strong> A branch is literally just a text file containing the 40-character SHA hash of the commit it points to. Branching is instantaneous because Git just creates this tiny file.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
