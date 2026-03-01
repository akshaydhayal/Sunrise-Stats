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
          Sunrise is the core infrastructure for <strong>Canonical Assets</strong> on Solana. It provides a standardized framework for deploying and managing premium assets (including <strong>MON, HYPE, INX, and LIT</strong>) originally from other ecosystems, ensuring they are native, liquid, and secure within the Solana DeFi landscape.
        </p>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: 'var(--text-main)' }}>
          By establishing a single source of truth for these assets, Sunrise eliminates liquidity fragmentation and provides protocols and users with the most efficient way to interact with bridged value. Sunrise isn't just a bridge; it's the foundation for the next wave of high-performance assets on the world's most scalable blockchain.
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
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Unified Liquidity</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
              Solving bridge fragmentation by providing the definitive canonical version of top assets across Solana.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
