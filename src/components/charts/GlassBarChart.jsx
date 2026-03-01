import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';

export default function GlassBarChart({ data, dataKey, height = 350 }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload;
      
      const buyVal = pData.buy_volume !== undefined ? pData.buy_volume : (pData.total_buy_volume || 0);
      const sellVal = pData.sell_volume !== undefined ? pData.sell_volume : (pData.total_sell_volume || 0);
      const netVal = pData.net_buy_volume !== undefined ? pData.net_buy_volume : (pData.total_net_buy_volume || 0);

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
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <span style={{ color: '#00ff00', fontWeight: 'bold' }}>Buy Vol:</span>
              <span>${buyVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <span style={{ color: '#ff0000', fontWeight: 'bold' }}>Sell Vol:</span>
              <span>${sellVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '4px 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontWeight: 'bold' }}>
              <span>Net Vol:</span>
              <span style={{ color: netVal >= 0 ? '#00ff00' : '#ff0000' }}>
                ${netVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: height, marginTop: '16px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 30, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="rgba(255,255,255,0.7)" 
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }} 
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            minTickGap={20}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.7)" 
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
              if (Math.abs(value) >= 1000000) return `${value < 0 ? '-' : ''}$${(Math.abs(value) / 1000000).toFixed(1)}M`;
              if (Math.abs(value) >= 1000) return `${value < 0 ? '-' : ''}$${(Math.abs(value) / 1000).toFixed(1)}K`;
              return `$${value}`;
            }}
          >
            <Label 
              value="Net Buy Volume ($)" 
              angle={-90} 
              position="left" 
              offset={0}
              dx={-5}
              style={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 'bold', textAnchor: 'middle' }} 
            />
          </YAxis>
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
          <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
            {
              data && data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry[dataKey] >= 0 ? '#00ff00' : '#ff0000'} opacity={1.0} />
              ))
            }
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
