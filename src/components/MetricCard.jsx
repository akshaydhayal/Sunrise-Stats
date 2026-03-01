import React from 'react';

export default function MetricCard({ title, value, icon, change, isPositive }) {
  return (
    <div className="glass-panel">
      <div className="panel-title">
        {icon}
        {title}
      </div>
      <div className="panel-value">
        {value}
      </div>
      {change && (
        <div style={{ color: isPositive ? '#00ff00' : '#ff0000', fontSize: '14px', fontWeight: 'bold' }}>
          {isPositive ? '+' : ''}{change}
        </div>
      )}
    </div>
  );
}
