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
        <div style={{ color: isPositive ? '#10b981' : '#ef4444', fontSize: '14px', fontWeight: '500' }}>
          {isPositive ? '+' : ''}{change}
        </div>
      )}
    </div>
  );
}
