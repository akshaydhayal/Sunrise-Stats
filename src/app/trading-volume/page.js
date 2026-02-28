"use client";
import React, { useEffect, useState } from 'react';
import MetricCard from '@/components/MetricCard';
import LastUpdated from '@/components/LastUpdated';
import GlassRatioChart from '@/components/charts/GlassRatioChart';
import TokenIcon from '@/components/TokenIcon';
import { Database, Box, BarChart2, Activity, DollarSign } from 'lucide-react';

export default function TradingVolumeDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trading-volume');
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        setError(json.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <h2 className="text-gradient">Loading Trading Volume...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center' }}>
        <h3 style={{ color: '#ef4444' }}>Error loading data</h3>
        <p>{error}</p>
        <button className="btn-primary" onClick={fetchData} style={{ margin: '20px auto 0' }}>Retry</button>
      </div>
    );
  }

  const { data: chartData, latestStats } = data || {};
  
  if (!chartData || chartData.overall.length === 0) {
    return (
      <div>
        <div className="header-row">
          <h2>Trading Volume (DEX vs CEX)</h2>
          <LastUpdated syncKey="trading_volume_sync" />
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3>No Data Available</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Please run the sync to fetch the latest trading volume data.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="header-row">
        <div>
          <h2>Trading Volume (DEX vs CEX)</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Compare Solana DEX volume against global CEX volume</p>
        </div>
        <LastUpdated syncKey="trading_volume_sync" />
      </div>

      <div className="dashboard-grid">
        {/* Top KPIs - Current Day Total Volume */}
        <div className="col-span-12" style={{ marginBottom: '-8px' }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-muted)', 
            borderBottom: '1px solid rgba(255,255,255,0.1)', 
            paddingBottom: '12px' 
          }}>
            Latest Daily Trading Volume
          </h3>
        </div>

        <div className="col-span-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <MetricCard 
            title="Total Combined Vol" 
            value={`$${((latestStats.total_dex_volume + latestStats.total_cex_volume) / 1000000).toFixed(2)}M`}
            icon={<Database size={16} color="#fff" />}
            isPositive={true}
          />
          <MetricCard 
            title="Total CEX Vol" 
            value={`$${(latestStats.total_cex_volume / 1000000).toFixed(2)}M`}
            icon={<Database size={16} color="#3b82f6" />}
            isPositive={true}
          />
          <MetricCard 
            title="Total DEX Vol" 
            value={`$${(latestStats.total_dex_volume / 1000000).toFixed(2)}M`}
            icon={<Database size={16} color="var(--primary-orange)" />}
            isPositive={true}
          />
        </div>

        {/* Individual Asset Volumes (Compact Badges) */}
        <div className="col-span-12" style={{ marginTop: '0px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {['HYPE', 'MON', 'INX', 'LIT'].map(sym => {
              const tk = latestStats.tokens[sym] || { dex_volume: 0, cex_volume: 0 };
              
              const formatVol = (v) => {
                if (v >= 1000000) return `$${(v / 1000000).toFixed(2)}M`;
                if (v >= 1000) return `$${(v / 1000).toFixed(1)}K`;
                return `$${v}`;
              };

              return (
                <div key={sym} style={{ 
                  flex: '1 1 auto', 
                  minWidth: '220px', 
                  background: 'var(--glass-bg)', 
                  border: '1px solid var(--glass-border)', 
                  borderRadius: '16px', 
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex' }}>
                    <TokenIcon symbol={sym} size={28} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '6px', color: '#fff', letterSpacing: '0.02em' }}>{sym} Daily Volume</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', lineHeight: '1.4', fontWeight: '500' }}>
                      <span style={{ color: '#3b82f6' }}>CEX: {formatVol(tk.cex_volume)}</span>
                      <span style={{ color: 'var(--primary-orange)' }}>DEX: {formatVol(tk.dex_volume)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Chart */}
        <div className="col-span-12" style={{ marginTop: '16px' }}>
          <div className="glass-panel">
            <div className="panel-title">
              <Database size={16} />
              Aggregated CEX:DEX Volume Ratio (All Tracked Assets)
            </div>
            <GlassRatioChart 
              data={chartData.overall} 
              dexKey="total_dex_volume" 
              cexKey="total_cex_volume"
              height={400}
            />
          </div>
        </div>

        {/* Individual Asset Charts */}
        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <TokenIcon symbol="HYPE" size={16} />
              HYPE: CEX vs DEX Tracking
            </div>
            <GlassRatioChart 
              data={chartData.tokens.HYPE || []} 
              dexKey="dex_volume" 
              cexKey="cex_volume"
              height={250}
            />
          </div>
        </div>

        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <TokenIcon symbol="MON" size={16} />
              MON: CEX vs DEX Tracking
            </div>
            <GlassRatioChart 
              data={chartData.tokens.MON || []} 
              dexKey="dex_volume" 
              cexKey="cex_volume"
              height={250}
            />
          </div>
        </div>
        
        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <TokenIcon symbol="INX" size={16} />
              INX: CEX vs DEX Tracking
            </div>
            <GlassRatioChart 
              data={chartData.tokens.INX || []} 
              dexKey="dex_volume" 
              cexKey="cex_volume"
              height={250}
            />
          </div>
        </div>
        
        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <TokenIcon symbol="LIT" size={16} />
              LIT: CEX vs DEX Tracking
            </div>
            <GlassRatioChart 
              data={chartData.tokens.LIT || []} 
              dexKey="dex_volume" 
              cexKey="cex_volume"
              height={250}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
