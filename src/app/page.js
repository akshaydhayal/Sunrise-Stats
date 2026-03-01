"use client";
import React, { useEffect, useState } from 'react';
import MetricCard from '@/components/MetricCard';
import LastUpdated from '@/components/LastUpdated';
import GlassAreaChart from '@/components/charts/GlassAreaChart';
import TokenIcon from '@/components/TokenIcon';
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
        <h2 className="text-gradient">Loading MarketCap Data...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center' }}>
        <h3 style={{ color: '#ff0000', fontWeight: 'bold' }}>Error loading data</h3>
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
          <h2>Sunrise Assets Overview</h2>
          <LastUpdated />
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
          <h2>Sunrise Assets Overview</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Canonical assets bridged to Solana</p>
        </div>
        <LastUpdated />
      </div>

      <div className="dashboard-grid">
        {/* Top KPIs - Current Market Cap Breakdown */}
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
            Current Market Cap Breakdown
          </h3>
        </div>

        <div className="col-span-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px' }}>
          <MetricCard 
            title="Total Assets Cap" 
            value={`$${(latestStats.totalMarketCap / 1000000).toFixed(2)}M`}
            icon={<DollarSign size={16} color="var(--primary-orange)" />}
            isPositive={true}
          />
          <MetricCard 
            title="HYPE Market Cap" 
            value={latestStats.tokens.HYPE ? `$${(latestStats.tokens.HYPE.marketcap / 1000000).toFixed(2)}M` : '$0'}
            icon={<TokenIcon symbol="HYPE" size={16} />}
            isPositive={true}
          />
          <MetricCard 
            title="MON Market Cap" 
            value={latestStats.tokens.MON ? `$${(latestStats.tokens.MON.marketcap / 1000000).toFixed(2)}M` : '$0'}
            icon={<TokenIcon symbol="MON" size={16} />}
            isPositive={true}
          />
          <MetricCard 
            title="INX Market Cap" 
            value={latestStats.tokens.INX ? `$${(latestStats.tokens.INX.marketcap / 1000000).toFixed(2)}M` : '$0'}
            icon={<TokenIcon symbol="INX" size={16} />}
            isPositive={true}
          />
          <MetricCard 
            title="LIT Market Cap" 
            value={latestStats.tokens.LIT ? `$${(latestStats.tokens.LIT.marketcap / 1000000).toFixed(2)}M` : '$0'}
            icon={<TokenIcon symbol="LIT" size={16} />}
            isPositive={true}
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
              height={350}
            />
          </div>
        </div>

        {/* Individual Asset Charts */}
        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <TokenIcon symbol="HYPE" size={16} />
              HYPE Market Cap
            </div>
            <GlassAreaChart 
              data={chartData.tokens.HYPE || []} 
              dataKey="marketcap" 
              stroke="var(--chart-hype)" 
              fill="var(--chart-hype)" 
              height={250}
            />
          </div>
        </div>

        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <TokenIcon symbol="MON" size={16} />
              MON Market Cap
            </div>
            <GlassAreaChart 
              data={chartData.tokens.MON || []} 
              dataKey="marketcap" 
              stroke="var(--chart-mon)" 
              fill="var(--chart-mon)" 
              height={250}
            />
          </div>
        </div>
        
        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <TokenIcon symbol="INX" size={16} />
              INX Market Cap
            </div>
            <GlassAreaChart 
              data={chartData.tokens.INX || []} 
              dataKey="marketcap" 
              stroke="var(--chart-inx)" 
              fill="var(--chart-inx)" 
              height={250}
            />
          </div>
        </div>
        
        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <TokenIcon symbol="LIT" size={16} />
              LIT Market Cap
            </div>
            <GlassAreaChart 
              data={chartData.tokens.LIT || []} 
              dataKey="marketcap" 
              stroke="var(--chart-lit)" 
              fill="var(--chart-lit)" 
              height={250}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
