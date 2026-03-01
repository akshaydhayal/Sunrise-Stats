"use client";
import React, { useMemo } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';

export default function GlassRatioChart({ data, dexKey = "total_dex_volume", cexKey = "total_cex_volume", height = 350 }) {
  const ratioData = useMemo(() => {
    if (!data) return [];
    return data.map(d => {
      const dex = d[dexKey] || 0;
      const cex = d[cexKey] || 0;
      // Calculate ratio (CEX / DEX), handle divide by zero
      const ratio = dex > 0 ? cex / dex : 0;
      // Recharts log scale crashes on 0, elevate 0 to 1 for visual fallback
      const safeDex = dex > 0 ? dex : 1;
      const safeCex = cex > 0 ? cex : 1;
      const safeRatio = ratio > 0 ? ratio : 0.1;

      return {
        ...d,
        ratioValue: Number(ratio.toFixed(2)),
        safeRatioValue: Number(safeRatio.toFixed(2)),
        originalDex: dex,
        originalCex: cex,
        safeDex,
        safeCex
      };
    });
  }, [data, dexKey, cexKey]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload;
      
      const ratio = pData.ratioValue;
      const dexVal = pData.originalDex;
      const cexVal = pData.originalCex;

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
              <span style={{ color: '#e879f9', fontWeight: 'bold' }}>CEX:DEX Ratio:</span>
              <span>{ratio}x</span>
            </div>
            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '4px 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              <span>Daily CEX Vol:</span>
              <span>${cexVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              <span>Daily DEX Vol:</span>
              <span>${dexVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>

            {(cumDex > 0 || cumCex > 0) && (
              <>
                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '4px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                  <span>Cumu. CEX Vol:</span>
                  <span>${cumCex.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                  <span>Cumu. DEX Vol:</span>
                  <span>${cumDex.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
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
        <ComposedChart data={ratioData} margin={{ top: 10, right: 30, left: 30, bottom: 20 }}>
          <defs>
            <linearGradient id="barGradientDex" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--neon-orange)" stopOpacity={1}/>
              <stop offset="100%" stopColor="var(--neon-orange)" stopOpacity={0.3}/>
            </linearGradient>
            <linearGradient id="barGradientCex" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--neon-blue)" stopOpacity={1}/>
              <stop offset="100%" stopColor="var(--neon-blue)" stopOpacity={0.3}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="rgba(255,255,255,0.95)" 
            tick={{ fill: 'rgba(255,255,255,0.95)', fontSize: 10, fontWeight: '600' }} 
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            minTickGap={20}
          />
          {/* Left Y-Axis for Volume Bars (Log Scale) */}
          <YAxis 
            yAxisId="left"
            scale="log"
            domain={['auto', 'auto']}
            stroke="rgba(255,255,255,0.95)" 
            tick={{ fill: 'rgba(255,255,255,0.95)', fontSize: 10, fontWeight: '600' }}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
              if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
              return `$${value}`;
            }}
          >
            <Label 
              value="Volume ($)" 
              angle={-90} 
              position="left" 
              offset={0}
              dx={-5}
              style={{ fill: '#fff', fontSize: 10, fontWeight: '800', textAnchor: 'middle' }} 
            />
          </YAxis>
          {/* Right Y-Axis for Ratio Line */}
          <YAxis 
            yAxisId="right"
            orientation="right"
            scale="log"
            domain={['auto', 'auto']}
            stroke="rgba(232,121,249,0.8)" 
            tick={{ fill: '#e879f9', fontSize: 11, fontWeight: '800' }}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${value}x`}
          >
            <Label 
              value="Ratio (x)" 
              angle={90} 
              position="right" 
              offset={0}
              dx={5}
              style={{ fill: '#e879f9', fontSize: 10, fontWeight: '800', textAnchor: 'middle', filter: 'drop-shadow(0 0 2px rgba(232,121,249,0.4))' }} 
            />
          </YAxis>
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          
          {/* Background Volume Bars */}
          <Bar yAxisId="left" dataKey="safeDex" name="DEX Volume" fill="url(#barGradientDex)" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="left" dataKey="safeCex" name="CEX Volume" fill="url(#barGradientCex)" radius={[4, 4, 0, 0]} />
          
          {/* Foreground Ratio Line */}
          <Line yAxisId="right" type="monotone" dataKey="safeRatioValue" name="CEX:DEX Ratio" stroke="#e879f9" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: '#e879f9', stroke: '#fff', strokeWidth: 2 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
