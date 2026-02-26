"use client";
import React, { useEffect, useState } from 'react';
import MetricCard from '@/components/MetricCard';
import LastUpdated from '@/components/LastUpdated';
import GlassAreaChart from '@/components/charts/GlassAreaChart';
import TokenIcon from '@/components/TokenIcon';
import { Users, UserPlus, TrendingUp, Activity, Box } from 'lucide-react';

export default function HoldersDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/holders');
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
        <h2 className="text-gradient">Loading Holder Data...</h2>
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
          <h2>Token Holders</h2>
          <LastUpdated syncKey="holders_sync" />
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3>No Data Available</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Please run the sync to fetch the latest holders data from Dune.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="header-row">
        <div>
          <h2>Token Holders</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Unique holders across Canonical assets</p>
        </div>
        <LastUpdated syncKey="holders_sync" />
      </div>

      <div className="dashboard-grid">
        {/* Top KPIs - Current Holders Breakdown */}
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
            Current Holder Distribution
          </h3>
        </div>

        <div className="col-span-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
          <MetricCard 
            title="Total Holders" 
            value={latestStats.total_holders.toLocaleString()}
            icon={<Users size={16} color="var(--primary-orange)" />}
            isPositive={true}
          />
          <MetricCard 
            title="HYPE Holders" 
            value={latestStats.tokens.HYPE ? latestStats.tokens.HYPE.total_holders.toLocaleString() : '0'}
            change={latestStats.tokens.HYPE ? `${latestStats.tokens.HYPE.holder_growth >= 0 ? '+' : ''}${latestStats.tokens.HYPE.holder_growth} today` : null}
            icon={<TokenIcon symbol="HYPE" size={16} />}
            isPositive={latestStats.tokens.HYPE && latestStats.tokens.HYPE.holder_growth >= 0}
          />
          <MetricCard 
            title="MON Holders" 
            value={latestStats.tokens.MON ? latestStats.tokens.MON.total_holders.toLocaleString() : '0'}
            change={latestStats.tokens.MON ? `${latestStats.tokens.MON.holder_growth >= 0 ? '+' : ''}${latestStats.tokens.MON.holder_growth} today` : null}
            icon={<TokenIcon symbol="MON" size={16} />}
            isPositive={latestStats.tokens.MON && latestStats.tokens.MON.holder_growth >= 0}
          />
          <MetricCard 
            title="INX Holders" 
            value={latestStats.tokens.INX ? latestStats.tokens.INX.total_holders.toLocaleString() : '0'}
            change={latestStats.tokens.INX ? `${latestStats.tokens.INX.holder_growth >= 0 ? '+' : ''}${latestStats.tokens.INX.holder_growth} today` : null}
            icon={<TokenIcon symbol="INX" size={16} />}
            isPositive={latestStats.tokens.INX && latestStats.tokens.INX.holder_growth >= 0}
          />
          <MetricCard 
            title="LIT Holders" 
            value={latestStats.tokens.LIT ? latestStats.tokens.LIT.total_holders.toLocaleString() : '0'}
            change={latestStats.tokens.LIT ? `${latestStats.tokens.LIT.holder_growth >= 0 ? '+' : ''}${latestStats.tokens.LIT.holder_growth} today` : null}
            icon={<TokenIcon symbol="LIT" size={16} />}
            isPositive={latestStats.tokens.LIT && latestStats.tokens.LIT.holder_growth >= 0}
          />
        </div>

        {/* Main Chart */}
        <div className="col-span-12">
          <div className="glass-panel">
            <div className="panel-title">
              <Users size={16} />
              Aggregated Total Holders
            </div>
            <GlassAreaChart 
              data={chartData.overall} 
              dataKey="total_holders" 
              stroke="var(--primary-orange)" 
              fill="var(--primary-orange)" 
              height={350}
              isDollar={false}
              labelKey="Total Holders"
            />
          </div>
        </div>

        {/* Individual Asset Charts */}
        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <TokenIcon symbol="HYPE" size={16} />
              HYPE Holders Trend
            </div>
            <GlassAreaChart 
              data={chartData.tokens.HYPE || []} 
              dataKey="total_holders" 
              stroke="var(--chart-hype)" 
              fill="var(--chart-hype)" 
              height={250}
              isDollar={false}
              labelKey="HYPE Holders"
            />
          </div>
        </div>

        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <TokenIcon symbol="MON" size={16} />
              MON Holders Trend
            </div>
            <GlassAreaChart 
              data={chartData.tokens.MON || []} 
              dataKey="total_holders" 
              stroke="var(--chart-mon)" 
              fill="var(--chart-mon)" 
              height={250}
              isDollar={false}
              labelKey="MON Holders"
            />
          </div>
        </div>
        
        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <TokenIcon symbol="INX" size={16} />
              INX Holders Trend
            </div>
            <GlassAreaChart 
              data={chartData.tokens.INX || []} 
              dataKey="total_holders" 
              stroke="var(--chart-inx)" 
              fill="var(--chart-inx)" 
              height={250}
              isDollar={false}
              labelKey="INX Holders"
            />
          </div>
        </div>
        
        <div className="col-span-6">
          <div className="glass-panel">
            <div className="panel-title">
              <TokenIcon symbol="LIT" size={16} />
              LIT Holders Trend
            </div>
            <GlassAreaChart 
              data={chartData.tokens.LIT || []} 
              dataKey="total_holders" 
              stroke="var(--chart-lit)" 
              fill="var(--chart-lit)" 
              height={250}
              isDollar={false}
              labelKey="LIT Holders"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
