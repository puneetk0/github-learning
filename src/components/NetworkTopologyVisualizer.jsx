import React, { useState } from 'react';

export default function NetworkTopologyVisualizer() {
  const [serverOnline, setServerOnline] = useState(true);

  // SVG dimensions
  const width = 600;
  const height = 300;
  
  // Center server
  const serverX = width / 2;
  const serverY = 60;
  
  // Clients
  const clients = [
    { id: 1, label: 'Dev A', x: 100, y: 220 },
    { id: 2, label: 'Dev B', x: width / 2, y: 220 },
    { id: 3, label: 'Dev C', x: 500, y: 220 },
  ];

  return (
    <div className="cr-container" style={{ margin: '32px 0' }}>
      <div className="cr-header">
        <div className="cr-title">Network Topology: SVN vs Git</div>
        <div className="cr-controls">
          <button 
            className="btn" 
            style={{ 
              background: serverOnline ? 'var(--red)' : 'var(--green)',
              color: '#fff',
              border: 'none'
            }}
            onClick={() => setServerOnline(!serverOnline)}
          >
            {serverOnline ? 'Simulate Server Outage' : 'Restore Server'}
          </button>
        </div>
      </div>
      
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        <div style={{ flex: 1, padding: '16px', borderRight: '1px solid var(--border)' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '16px', color: 'var(--red)' }}>Centralized (SVN / CVS)</h4>
          <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
            {/* Connections */}
            {clients.map(c => (
              <line 
                key={`line-svn-${c.id}`} 
                x1={c.x} y1={c.y} x2={serverX} y2={serverY} 
                stroke={serverOnline ? 'var(--border)' : '#331111'} 
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            ))}
            
            {/* Server */}
            <circle cx={serverX} cy={serverY} r="30" fill={serverOnline ? 'var(--surface)' : '#331111'} stroke={serverOnline ? 'var(--red)' : '#551111'} strokeWidth="2" />
            <text x={serverX} y={serverY + 5} textAnchor="middle" fill={serverOnline ? 'var(--text)' : '#ff5555'} fontSize="12" fontWeight="bold">SERVER</text>
            {!serverOnline && <text x={serverX} y={serverY + 45} textAnchor="middle" fill="#ff5555" fontSize="12" fontWeight="bold">OFFLINE</text>}

            {/* Clients */}
            {clients.map(c => (
              <g key={`client-svn-${c.id}`}>
                <circle cx={c.x} cy={c.y} r="20" fill="var(--surface)" stroke="var(--border)" strokeWidth="2" />
                <text x={c.x} y={c.y + 40} textAnchor="middle" fill="var(--text2)" fontSize="12">{c.label}</text>
                <text x={c.x} y={c.y + 55} textAnchor="middle" fill={serverOnline ? 'var(--text2)' : '#ff5555'} fontSize="10">
                  {serverOnline ? 'Can commit' : 'BLOCKED'}
                </text>
              </g>
            ))}
          </svg>
        </div>
        
        <div style={{ flex: 1, padding: '16px' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '16px', color: 'var(--green)' }}>Distributed (Git)</h4>
          <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
            {/* Connections */}
            {clients.map(c => (
              <line 
                key={`line-git-${c.id}`} 
                x1={c.x} y1={c.y} x2={serverX} y2={serverY} 
                stroke={serverOnline ? 'var(--border)' : '#331111'} 
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            ))}
            
            {/* Server */}
            <circle cx={serverX} cy={serverY} r="30" fill={serverOnline ? 'var(--surface)' : '#331111'} stroke={serverOnline ? 'var(--green)' : '#551111'} strokeWidth="2" />
            <text x={serverX} y={serverY + 5} textAnchor="middle" fill={serverOnline ? 'var(--text)' : '#ff5555'} fontSize="12" fontWeight="bold">GITHUB</text>

            {/* Clients */}
            {clients.map(c => (
              <g key={`client-git-${c.id}`}>
                <circle cx={c.x} cy={c.y} r="25" fill="var(--surface)" stroke="var(--green)" strokeWidth="2" />
                <circle cx={c.x} cy={c.y} r="15" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="2 2" />
                <text x={c.x} y={c.y + 45} textAnchor="middle" fill="var(--text2)" fontSize="12">{c.label}</text>
                <text x={c.x} y={c.y + 60} textAnchor="middle" fill="var(--green)" fontSize="10">Can commit (Local Repo)</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
      
      <div style={{ padding: '16px', fontSize: '14px', color: 'var(--text2)' }}>
        <p><strong>Insight:</strong> In SVN, if the central server goes down, developers cannot commit code, branch, or view history. In Git, every developer has a full, independent local repository inside their <code>.git</code> folder. You only need the server (GitHub) to share code with others, not to record history.</p>
      </div>
    </div>
  );
}
