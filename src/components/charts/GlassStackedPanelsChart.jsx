"use client";
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GlassStackedPanelsChart({ data, dexKey = "total_dex_volume", cexKey = "total_cex_volume", height = 350 }) {
  const panelHeight = height / 2;

  const CustomTooltipCex = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload;
      const cumCex = pData.cumulative_total_cex_volume || pData.cumulative_cex_volume || 0;

      return (
        <div style={{
          backgroundColor: 'rgba(10, 8, 22, 0.95)', 
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          padding: '12px',
          color: '#fff',
          zIndex: 1000
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          <div style={{ marginTop: '8px', color: '#3b82f6' }}>
            <span>Daily CEX Vol: </span>
            <span>${(payload[0].value || 0).toLocaleString()}</span>
          </div>
          {cumCex > 0 && (
            <div style={{ marginTop: '4px', color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
              <span>Cumu. CEX Vol: </span>
              <span>${cumCex.toLocaleString()}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomTooltipDex = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload;
      const cumDex = pData.cumulative_total_dex_volume || pData.cumulative_dex_volume || 0;

      return (
        <div style={{
          backgroundColor: 'rgba(10, 8, 22, 0.95)', 
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          padding: '12px',
          color: '#fff',
          zIndex: 1000
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          <div style={{ marginTop: '8px', color: 'var(--primary-orange)' }}>
            <span>Daily DEX Vol: </span>
            <span>${(payload[0].value || 0).toLocaleString()}</span>
          </div>
          {cumDex > 0 && (
            <div style={{ marginTop: '4px', color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
              <span>Cumu. DEX Vol: </span>
              <span>${cumDex.toLocaleString()}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value}`;
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: height, marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      
      {/* Top Panel - CEX */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <div style={{ position: 'absolute', top: 0, left: '60px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>CEX Volume Scale</div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="date" tick={false} axisLine={false} tickLine={false} />
            <YAxis 
              stroke="rgba(255,255,255,0.4)" 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatYAxis}
            />
            <Tooltip content={<CustomTooltipCex />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey={cexKey} fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Panel - DEX */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <div style={{ position: 'absolute', top: panelHeight + 8, left: '60px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>DEX Volume Scale</div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.4)" 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} 
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              minTickGap={20}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.4)" 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatYAxis}
            />
            <Tooltip content={<CustomTooltipDex />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey={dexKey} fill="var(--primary-orange)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
