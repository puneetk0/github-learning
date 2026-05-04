import React from 'react';

export default function CommandTable({ title, rows }) {
  return (
    <div style={{ margin: '32px 0' }}>
      {title && <h4 style={{ marginBottom: '16px', color: 'var(--text)' }}>{title}</h4>}
      <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px 16px', color: 'var(--text2)', fontWeight: 600, width: '30%' }}>Flag / Variant</th>
              <th style={{ padding: '12px 16px', color: 'var(--text2)', fontWeight: 600 }}>Effect</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: idx < rows.length - 1 ? '1px solid var(--border)' : 'none', background: 'var(--bg2)' }}>
                <td style={{ padding: '12px 16px', borderRight: '1px solid var(--border)' }}>
                  <code style={{ color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>{row.flag}</code>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--text)', lineHeight: 1.5 }}>
                  {row.effect}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
