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

        <div className="col-span-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
          <MetricCard 
            title="Total Combined Vol" 
            value={`$${((latestStats.total_dex_volume + latestStats.total_cex_volume) / 1000000).toFixed(2)}M`}
            icon={<Database size={16} color="var(--primary-orange)" />}
            isPositive={true}
          />
          <MetricCard 
            title="HYPE Trading Vol" 
            value={latestStats.tokens.HYPE ? `$${((latestStats.tokens.HYPE.dex_volume + latestStats.tokens.HYPE.cex_volume) / 1000000).toFixed(2)}M` : '$0'}
            icon={<TokenIcon symbol="HYPE" size={16} />}
            isPositive={latestStats.tokens.HYPE && latestStats.tokens.HYPE.dex_volume > 0}
          />
          <MetricCard 
            title="MON Trading Vol" 
            value={latestStats.tokens.MON ? `$${((latestStats.tokens.MON.dex_volume + latestStats.tokens.MON.cex_volume) / 1000000).toFixed(2)}M` : '$0'}
            icon={<TokenIcon symbol="MON" size={16} />}
            isPositive={latestStats.tokens.MON && latestStats.tokens.MON.dex_volume > 0}
          />
          <MetricCard 
            title="INX Trading Vol" 
            value={latestStats.tokens.INX ? `$${((latestStats.tokens.INX.dex_volume + latestStats.tokens.INX.cex_volume) / 1000000).toFixed(2)}M` : '$0'}
            icon={<TokenIcon symbol="INX" size={16} />}
            isPositive={latestStats.tokens.INX && latestStats.tokens.INX.dex_volume > 0}
          />
          <MetricCard 
            title="LIT Trading Vol" 
            value={latestStats.tokens.LIT ? `$${((latestStats.tokens.LIT.dex_volume + latestStats.tokens.LIT.cex_volume) / 1000000).toFixed(2)}M` : '$0'}
            icon={<TokenIcon symbol="LIT" size={16} />}
            isPositive={latestStats.tokens.LIT && latestStats.tokens.LIT.dex_volume > 0}
          />
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
