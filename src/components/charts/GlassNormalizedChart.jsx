"use client";
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function GlassNormalizedChart({ data, dexKey = "total_dex_volume", cexKey = "total_cex_volume", height = 350 }) {
  const normalizedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Find first non-zero starting points
    const startDex = data.find(d => d[dexKey] > 0)?.[dexKey] || 1;
    const startCex = data.find(d => d[cexKey] > 0)?.[cexKey] || 1;

    return data.map(d => {
      const dex = d[dexKey] || 0;
      const cex = d[cexKey] || 0;
      return {
        ...d,
        normDex: Number(((dex / startDex) * 100).toFixed(2)),
        normCex: Number(((cex / startCex) * 100).toFixed(2)),
        originalDex: dex,
        originalCex: cex
      };
    });
  }, [data, dexKey, cexKey]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload;
      
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
          minWidth: '220px'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>{label}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <span style={{ color: 'var(--primary-orange)' }}>DEX Growth:</span>
              <span>{pData.normDex}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <span style={{ color: '#3b82f6' }}>CEX Growth:</span>
              <span>{pData.normCex}%</span>
            </div>
            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '4px 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              <span>Daily DEX Vol:</span>
              <span>${pData.originalDex.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              <span>Daily CEX Vol:</span>
              <span>${pData.originalCex.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>

            {(cumDex > 0 || cumCex > 0) && (
              <>
                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '4px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                  <span>Cumu. DEX Vol:</span>
                  <span>${cumDex.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                  <span>Cumu. CEX Vol:</span>
                  <span>${cumCex.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: height, marginTop: '16px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={normalizedData} margin={{ top: 20, right: 30, left: 30, bottom: 25 }}>
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
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          
          <Line type="monotone" dataKey="normDex" name="DEX Relative Growth" stroke="var(--primary-orange)" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="normCex" name="CEX Relative Growth" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
