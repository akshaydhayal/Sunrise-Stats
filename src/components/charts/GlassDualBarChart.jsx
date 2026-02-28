"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function GlassDualBarChart({ data, dexKey = "dex_volume", cexKey = "cex_volume", height = 350 }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Pull original values for tooltip to prevent '1' from showing instead of '0'
      const pData = payload[0].payload;
      const originalDex = pData[dexKey] === 1 ? 0 : (pData[dexKey] || 0);
      const originalCex = pData[cexKey] === 1 ? 0 : (pData[cexKey] || 0);

      const dexVal = originalDex;
      const cexVal = originalCex;

      // Extract cumulative data fields if present
      const cumDex = pData.cumulative_total_dex_volume || pData.cumulative_dex_volume || 0;
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
          zIndex: 1000,
          minWidth: '200px'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>{label}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <span style={{ color: 'var(--primary-orange)' }}>DEX Vol:</span>
              <span>${dexVal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <span style={{ color: '#3b82f6' }}>CEX Vol:</span>
              <span>${cexVal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontWeight: 'bold' }}>
              <span>Total Daily Vol:</span>
              <span style={{ color: '#fff' }}>
                ${(dexVal + cexVal).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>

            {(cumDex > 0 || cumCex > 0) && (
              <>
                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '4px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                  <span>Cumu. CEX Vol:</span>
                  <span>${cumCex.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                  <span>Cumu. DEX Vol:</span>
                  <span>${cumDex.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                </div>
              </>
            )}
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
        <BarChart data={safeData} margin={{ top: 20, right: 30, left: 30, bottom: 25 }}>
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
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar dataKey={dexKey} name="DEX Volume" fill="var(--primary-orange)" radius={[4, 4, 0, 0]} />
          <Bar dataKey={cexKey} name="CEX Volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
