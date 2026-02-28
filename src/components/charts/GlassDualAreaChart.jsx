"use client";
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function GlassDualAreaChart({ data, dexKey = "cumulative_dex_volume", cexKey = "cumulative_cex_volume", height = 350 }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Pull original values for tooltip to prevent '1' from showing instead of '0'
      const pData = payload[0].payload;
      const originalDex = pData[dexKey] === 1 ? 0 : (pData[dexKey] || 0);
      const originalCex = pData[cexKey] === 1 ? 0 : (pData[cexKey] || 0);

      const dexVal = originalDex;
      const cexVal = originalCex;

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
          zIndex: 1000,
          minWidth: '220px'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>{label}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <span style={{ color: 'var(--primary-orange)' }}>Cumulative DEX:</span>
              <span>${dexVal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <span style={{ color: '#3b82f6' }}>Cumulative CEX:</span>
              <span>${cexVal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '4px 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontWeight: 'bold' }}>
              <span>Total Cumu Vol:</span>
              <span style={{ color: '#fff' }}>
                ${(dexVal + cexVal).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Recharts log scale crashes on 0 values. Shift 0 to 1 as a baseline for log scaling rendering visibility.
  const safeData = React.useMemo(() => {
    return data ? data.map(d => ({
      ...d,
      [dexKey]: d[dexKey] > 0 ? d[dexKey] : 1,
      [cexKey]: d[cexKey] > 0 ? d[cexKey] : 1,
    })) : [];
  }, [data, dexKey, cexKey]);

  return (
    <div style={{ position: 'relative', width: '100%', height: height, marginTop: '16px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={safeData} margin={{ top: 20, right: 30, left: 30, bottom: 25 }}>
          <defs>
            <linearGradient id="colorDex" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary-orange)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--primary-orange)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCex" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
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
            scale="log"
            domain={['auto', 'auto']}
            stroke="rgba(255,255,255,0.4)" 
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
              if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
              return `$${value}`;
            }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          
          <Area type="monotone" dataKey={cexKey} name="Cumulative CEX" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCex)" />
          <Area type="monotone" dataKey={dexKey} name="Cumulative DEX" stroke="var(--primary-orange)" fillOpacity={1} fill="url(#colorDex)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
