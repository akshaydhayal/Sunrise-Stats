import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({ title, value, icon, change, isPositive }) {
  return (
    <div className="glass-panel">
      <div className="panel-title">
        {icon}
        {title}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
        <div className="panel-value" style={{ marginBottom: 0 }}>
          {value}
        </div>
        {change && (
          <div style={{ 
            color: isPositive ? '#00ff00' : '#ff0000', 
            fontSize: '14px', 
            fontWeight: '800', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '2px' 
          }}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {change}
          </div>
        )}
      </div>
    </div>
  );
}
