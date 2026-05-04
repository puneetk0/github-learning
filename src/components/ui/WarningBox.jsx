import React from 'react';
import { AlertTriangle, Info, Zap } from 'lucide-react';

export default function WarningBox({ type = 'warning', title, children }) {
  let config = {
    warning: { icon: <AlertTriangle color="var(--red)" />, bg: 'rgba(248, 113, 113, 0.1)', border: 'var(--red)', titleColor: 'var(--red)' },
    info: { icon: <Info color="var(--blue)" />, bg: 'rgba(96, 165, 250, 0.1)', border: 'var(--blue)', titleColor: 'var(--blue)' },
    tip: { icon: <Zap color="var(--yellow)" />, bg: 'rgba(251, 191, 36, 0.1)', border: 'var(--yellow)', titleColor: 'var(--yellow)' },
  };

  const style = config[type] || config.info;

  return (
    <div style={{
      background: style.bg,
      border: `1px solid ${style.border}`,
      borderRadius: '8px',
      padding: '20px',
      margin: '24px 0',
      display: 'flex',
      gap: '16px'
    }}>
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        {style.icon}
      </div>
      <div>
        {title && <h4 style={{ color: style.titleColor, margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>{title}</h4>}
        <div style={{ color: 'var(--text)', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
