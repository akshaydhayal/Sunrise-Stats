"use client";
import React, { useEffect, useState } from 'react';
import MetricCard from '@/components/MetricCard';
import SyncButton from '@/components/SyncButton';
import GlassBarChart from '@/components/charts/GlassBarChart';
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
          <SyncButton onSyncComplete={fetchData} />
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
        <SyncButton onSyncComplete={fetchData} />
      </div>

      <div className="dashboard-grid">
        {/* Top KPIs */}
        <div className="col-span-4">
          <MetricCard 
            title="Total Net Buy Volume" 
            value={`$${(Math.abs(latestStats.total_net_buy_volume) / 1000).toFixed(2)}K`}
            icon={<BarChart2 size={16} color="var(--primary-orange)" />}
            isPositive={latestStats.total_net_buy_volume >= 0}
          />
        </div>
        <div className="col-span-4">
          <MetricCard 
            title="HYPE Net Buy Volume" 
            value={latestStats.tokens.HYPE ? `$${(Math.abs(latestStats.tokens.HYPE.net_buy_volume) / 1000).toFixed(2)}K` : '$0'}
            icon={<Activity size={16} color="var(--chart-hype)" />}
            isPositive={latestStats.tokens.HYPE && latestStats.tokens.HYPE.net_buy_volume >= 0}
          />
        </div>
        <div className="col-span-4">
          <MetricCard 
            title="MON Net Buy Volume" 
            value={latestStats.tokens.MON ? `$${(Math.abs(latestStats.tokens.MON.net_buy_volume) / 1000).toFixed(2)}K` : '$0'}
            icon={<DollarSign size={16} color="var(--chart-mon)" />}
            isPositive={latestStats.tokens.MON && latestStats.tokens.MON.net_buy_volume >= 0}
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
            />
          </div>
        </div>

        {/* Individual Asset Charts */}
        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <Box size={16} color="var(--chart-hype)" />
              HYPE Net Buy Volume
            </div>
            <div className="small-chart-container">
              <GlassBarChart 
                data={chartData.tokens.HYPE || []} 
                dataKey="net_buy_volume" 
              />
            </div>
          </div>
        </div>

        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <Box size={16} color="var(--chart-mon)" />
              MON Net Buy Volume
            </div>
            <div className="small-chart-container">
              <GlassBarChart 
                data={chartData.tokens.MON || []} 
                dataKey="net_buy_volume" 
              />
            </div>
          </div>
        </div>
        
        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <Box size={16} color="var(--chart-inx)" />
              INX Net Buy Volume
            </div>
            <div className="small-chart-container">
              <GlassBarChart 
                data={chartData.tokens.INX || []} 
                dataKey="net_buy_volume" 
              />
            </div>
          </div>
        </div>
        
        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <Box size={16} color="var(--chart-lit)" />
              LIT Net Buy Volume
            </div>
            <div className="small-chart-container">
              <GlassBarChart 
                data={chartData.tokens.LIT || []} 
                dataKey="net_buy_volume" 
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
