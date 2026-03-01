"use client";
import React from 'react';
import { ComposedChart, Area, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';

export default function GlassAreaChart({ data, dataKey, stroke, fill, height = 350, isDollar = true, labelKey = 'Market Cap' }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload;
      const val = pData[dataKey];
      const change = pData.dailyChange || 0;
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
              <span style={{ color: stroke }}>{labelKey}:</span>
              <span>{isDollar ? '$' : ''}{val?.toLocaleString(undefined, { minimumFractionDigits: isDollar ? 2 : 0, maximumFractionDigits: isDollar ? 2 : 0 }) || '0'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '13px' }}>
              <span style={{ color: change >= 0 ? '#00ff00' : '#ff0000', fontWeight: 'bold' }}>Daily Change:</span>
              <span style={{ color: change >= 0 ? '#00ff00' : '#ff0000', fontWeight: 'bold' }}>
                {change >= 0 ? '+' : ''}{isDollar ? '$' : ''}{Math.abs(change).toLocaleString(undefined, { minimumFractionDigits: isDollar ? 2 : 0, maximumFractionDigits: isDollar ? 2 : 0 })}
              </span>
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
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 30, bottom: 20 }}>
          <defs>
            <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={fill} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={fill} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="rgba(255,255,255,0.7)" 
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }} 
            tickFormatter={formatTickDate}
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            minTickGap={20}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            domain={['dataMin', 'auto']}
            stroke="rgba(255,255,255,0.7)" 
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
              if (value >= 1000000) return `${isDollar ? '$' : ''}${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${isDollar ? '$' : ''}${(value / 1000).toFixed(1)}K`;
              return `${isDollar ? '$' : ''}${value}`;
            }}
          >
            <Label 
              value="Market Cap ($)" 
              angle={90} 
              position="right" 
              offset={0}
              dx={5}
              style={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 'bold', textAnchor: 'middle' }} 
            />
          </YAxis>
          <YAxis 
            yAxisId="left"
            orientation="left"
            stroke="rgba(255,255,255,0.7)" 
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
              if (Math.abs(value) >= 1000000) return `${isDollar ? '$' : ''}${(value / 1000000).toFixed(1)}M`;
              if (Math.abs(value) >= 1000) return `${isDollar ? '$' : ''}${(value / 1000).toFixed(1)}K`;
              return `${isDollar ? '$' : ''}${value}`;
            }}
          >
            <Label 
              value="Daily Change ($)" 
              angle={-90} 
              position="left" 
              offset={0}
              dx={-5}
              style={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 'bold', textAnchor: 'middle' }} 
            />
          </YAxis>
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Bar yAxisId="left" dataKey="dailyChange" name="Daily Change">
            {data && data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={(entry.dailyChange || 0) >= 0 ? '#00ff00' : '#ff0000'} opacity={1.0} />
            ))}
          </Bar>
          <Area 
            yAxisId="right"
            type="monotone" 
            dataKey={dataKey} 
            stroke={stroke} 
            strokeWidth={2}
            fillOpacity={0} 
            animationDuration={1500}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
