"use client";
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GlassAreaChart({ data, dataKey, stroke, fill, height = 350 }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload;
      const val = pData[dataKey];
      const dateLabel = new Date(label).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
      });

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
          <p style={{ margin: 0, fontWeight: 'bold' }}>{dateLabel}</p>
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontWeight: 'bold' }}>
              <span style={{ color: stroke }}>Market Cap:</span>
              <span>${val?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const formatTickDate = (tickItem) => {
    const d = new Date(tickItem);
    if (isNaN(d.getTime())) return tickItem;
    return d.toISOString().split('T')[0];
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: height, marginTop: '16px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 25 }}>
          <defs>
            <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={fill} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={fill} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="rgba(255,255,255,0.4)" 
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} 
            tickFormatter={formatTickDate}
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
            tickFormatter={(value) => {
              if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
              return `$${value}`;
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={stroke} 
            strokeWidth={3}
            fillOpacity={1} 
            fill={`url(#color${dataKey})`} 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
