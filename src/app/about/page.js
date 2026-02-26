"use client";
import React from 'react';
import { Info, Shield, Zap, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="header-row">
        <div>
          <h2>About Sunrise</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Bridging Canonical Assets to Solana</p>
        </div>
      </div>

      <div className="glass-panel" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--primary-orange)' }}>
          What is Sunrise?
        </h3>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: 'var(--text-main)', marginBottom: '16px' }}>
          Sunrise is a decentralized finance (DeFi) initiative dedicated to bringing high-quality, Canonical assets to the high-performance <strong>Solana</strong> blockchain. By facilitating this bridge, Sunrise aims to unlock deeper liquidity, faster transaction finality, and significantly lower fees for users trading and holding these premium assets.
        </p>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: 'var(--text-main)' }}>
          Currently, Sunrise tracks the growth and adoption of key bridged assets such as <strong>MON, HYPE, INX, and LIT</strong>. Our dashboard provides real-time insights into market capitalization, trading volume, and unique token holders, empowering the community with transparent, on-chain data powered by Dune Analytics.
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="col-span-4">
          <div className="glass-panel" style={{ height: '100%' }}>
            <div style={{ marginBottom: '16px' }}>
              <Zap size={32} color="var(--primary-orange)" />
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>High Performance</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
              Leveraging Solana's unmatched speed to provide lightning-fast, low-cost interactions with Canonical assets.
            </p>
          </div>
        </div>

        <div className="col-span-4">
          <div className="glass-panel" style={{ height: '100%' }}>
            <div style={{ marginBottom: '16px' }}>
              <Shield size={32} color="var(--chart-hype)" />
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Canonical Assets</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
              Focusing strictly on premium, highly sought-after assets bridging from other ecosystems.
            </p>
          </div>
        </div>

        <div className="col-span-4">
          <div className="glass-panel" style={{ height: '100%' }}>
            <div style={{ marginBottom: '16px' }}>
              <TrendingUp size={32} color="var(--chart-mon)" />
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Data Driven</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
              Open, transparent tracking of Market Cap, Net Volume, and Holder statistics so you stay informed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
