"use client";
import React, { useEffect, useState } from 'react';
import MetricCard from '@/components/MetricCard';
import SyncButton from '@/components/SyncButton';
import GlassAreaChart from '@/components/charts/GlassAreaChart';
import { TrendingUp, Activity, DollarSign, Database, Box } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard');
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
        <h2 className="text-gradient">Loading Sunrise...</h2>
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
          <h2>Sunrise Overview</h2>
          <SyncButton onSyncComplete={fetchData} />
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3>No Data Available</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Please run the sync to fetch the latest data from Dune.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="header-row">
        <div>
          <h2>Sunrise Overview</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Canonical assets bridged to Solana</p>
        </div>
        <SyncButton onSyncComplete={fetchData} />
      </div>

      <div className="dashboard-grid">
        {/* Top KPIs */}
        <div className="col-span-4">
          <MetricCard 
            title="Total Market Cap" 
            value={`$${(latestStats.totalMarketCap / 1000000).toFixed(2)}M`}
            icon={<DollarSign size={16} color="var(--primary-orange)" />}
          />
        </div>
        <div className="col-span-4">
          <MetricCard 
            title="HYPE Market Cap" 
            value={latestStats.tokens.HYPE ? `$${(latestStats.tokens.HYPE.marketcap / 1000000).toFixed(2)}M` : '$0'}
            icon={<TrendingUp size={16} color="var(--chart-hype)" />}
          />
        </div>
        <div className="col-span-4">
          <MetricCard 
            title="MON Market Cap" 
            value={latestStats.tokens.MON ? `$${(latestStats.tokens.MON.marketcap / 1000000).toFixed(2)}M` : '$0'}
            icon={<Activity size={16} color="var(--chart-mon)" />}
          />
        </div>

        {/* Main Chart */}
        <div className="col-span-12">
          <div className="glass-panel">
            <div className="panel-title">
              <Database size={16} />
              Aggregated Market Cap (All Assets)
            </div>
            <GlassAreaChart 
              data={chartData.overall} 
              dataKey="totalMarketCap" 
              stroke="var(--primary-orange)" 
              fill="var(--primary-orange)" 
            />
          </div>
        </div>

        {/* Individual Asset Charts */}
        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <Box size={16} color="var(--chart-hype)" />
              HYPE Market Cap
            </div>
            <div className="small-chart-container">
              <GlassAreaChart 
                data={chartData.tokens.HYPE || []} 
                dataKey="marketcap" 
                stroke="var(--chart-hype)" 
                fill="var(--chart-hype)" 
              />
            </div>
          </div>
        </div>

        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <Box size={16} color="var(--chart-mon)" />
              MON Market Cap
            </div>
            <div className="small-chart-container">
              <GlassAreaChart 
                data={chartData.tokens.MON || []} 
                dataKey="marketcap" 
                stroke="var(--chart-mon)" 
                fill="var(--chart-mon)" 
              />
            </div>
          </div>
        </div>
        
        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <Box size={16} color="var(--chart-inx)" />
              INX Market Cap
            </div>
            <div className="small-chart-container">
              <GlassAreaChart 
                data={chartData.tokens.INX || []} 
                dataKey="marketcap" 
                stroke="var(--chart-inx)" 
                fill="var(--chart-inx)" 
              />
            </div>
          </div>
        </div>
        
        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <Box size={16} color="var(--chart-lit)" />
              LIT Market Cap
            </div>
            <div className="small-chart-container">
              <GlassAreaChart 
                data={chartData.tokens.LIT || []} 
                dataKey="marketcap" 
                stroke="var(--chart-lit)" 
                fill="var(--chart-lit)" 
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
