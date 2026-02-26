"use client";
import React, { useEffect, useState } from 'react';
import MetricCard from '@/components/MetricCard';
import LastUpdated from '@/components/LastUpdated';
import GlassBarChart from '@/components/charts/GlassBarChart';
import TokenIcon from '@/components/TokenIcon';
import { BarChart2, Activity, DollarSign, Database, Box } from 'lucide-react';

export default function VolumeDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/volume');
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
        <h2 className="text-gradient">Loading Volume Data...</h2>
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
          <h2>Net Buy Volume</h2>
          <LastUpdated syncKey="volume_sync" />
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3>No Data Available</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Please run the sync to fetch the latest volume data from Dune.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="header-row">
        <div>
          <h2>Net Buy Volume</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Buy vs Sell Volume of Canonical Assets</p>
        </div>
        <LastUpdated syncKey="volume_sync" />
      </div>

      <div className="dashboard-grid">
        {/* Top KPIs - Current Day Net Volume */}
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
            Current Day Net Volume Breakdown
          </h3>
        </div>

        <div className="col-span-3">
          <MetricCard 
            title="HYPE Net Buy Vol" 
            value={latestStats.tokens.HYPE ? `$${(Math.abs(latestStats.tokens.HYPE.net_buy_volume) / 1000).toFixed(2)}K` : '$0'}
            icon={<TokenIcon symbol="HYPE" size={16} />}
            isPositive={latestStats.tokens.HYPE && latestStats.tokens.HYPE.net_buy_volume >= 0}
          />
        </div>
        <div className="col-span-3">
          <MetricCard 
            title="MON Net Buy Vol" 
            value={latestStats.tokens.MON ? `$${(Math.abs(latestStats.tokens.MON.net_buy_volume) / 1000).toFixed(2)}K` : '$0'}
            icon={<TokenIcon symbol="MON" size={16} />}
            isPositive={latestStats.tokens.MON && latestStats.tokens.MON.net_buy_volume >= 0}
          />
        </div>
        <div className="col-span-3">
          <MetricCard 
            title="INX Net Buy Vol" 
            value={latestStats.tokens.INX ? `$${(Math.abs(latestStats.tokens.INX.net_buy_volume) / 1000).toFixed(2)}K` : '$0'}
            icon={<TokenIcon symbol="INX" size={16} />}
            isPositive={latestStats.tokens.INX && latestStats.tokens.INX.net_buy_volume >= 0}
          />
        </div>
        <div className="col-span-3">
          <MetricCard 
            title="LIT Net Buy Vol" 
            value={latestStats.tokens.LIT ? `$${(Math.abs(latestStats.tokens.LIT.net_buy_volume) / 1000).toFixed(2)}K` : '$0'}
            icon={<TokenIcon symbol="LIT" size={16} />}
            isPositive={latestStats.tokens.LIT && latestStats.tokens.LIT.net_buy_volume >= 0}
          />
        </div>

        {/* Main Chart */}
        <div className="col-span-12">
          <div className="glass-panel">
            <div className="panel-title">
              <Database size={16} />
              Aggregated Net Buy Volume (All Assets)
            </div>
            <GlassBarChart 
              data={chartData.overall} 
              dataKey="total_net_buy_volume" 
              height={350}
            />
          </div>
        </div>

        {/* Individual Asset Charts */}
        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <TokenIcon symbol="HYPE" size={16} />
              HYPE Net Buy Volume
            </div>
            <GlassBarChart 
              data={chartData.tokens.HYPE || []} 
              dataKey="net_buy_volume" 
              height={250}
            />
          </div>
        </div>

        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <TokenIcon symbol="MON" size={16} />
              MON Net Buy Volume
            </div>
            <GlassBarChart 
              data={chartData.tokens.MON || []} 
              dataKey="net_buy_volume" 
              height={250}
            />
          </div>
        </div>
        
        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <TokenIcon symbol="INX" size={16} />
              INX Net Buy Volume
            </div>
            <GlassBarChart 
              data={chartData.tokens.INX || []} 
              dataKey="net_buy_volume" 
              height={250}
            />
          </div>
        </div>
        
        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <TokenIcon symbol="LIT" size={16} />
              LIT Net Buy Volume
            </div>
            <GlassBarChart 
              data={chartData.tokens.LIT || []} 
              dataKey="net_buy_volume" 
              height={250}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
