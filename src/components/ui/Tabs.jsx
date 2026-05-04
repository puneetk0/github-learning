import React, { useState } from 'react';

export default function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{ margin: '32px 0', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: activeTab === idx ? 'var(--bg2)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === idx ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeTab === idx ? 'var(--accent)' : 'var(--text2)',
              fontSize: '14px',
              fontWeight: activeTab === idx ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ padding: '24px', background: 'var(--bg2)' }}>
        {tabs[activeTab].content}
      </div>
    </div>
  );
}
