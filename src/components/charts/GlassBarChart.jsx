"use client";
import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function GlassBarChart({ data, dataKey }) {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="rgba(255,255,255,0.4)" 
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.4)" 
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              if (Math.abs(value) >= 1000000) return `${value < 0 ? '-' : ''}$${(Math.abs(value) / 1000000).toFixed(1)}M`;
              if (Math.abs(value) >= 1000) return `${value < 0 ? '-' : ''}$${(Math.abs(value) / 1000).toFixed(1)}K`;
              return `$${value}`;
            }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 12, 41, 0.8)', 
              borderColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
            }} 
            itemStyle={{ color: '#fff' }}
            formatter={(value) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Net Buy Volume']}
          />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
          <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
            {
              data && data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry[dataKey] >= 0 ? '#10b981' : '#ef4444'} />
              ))
            }
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
