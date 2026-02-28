"use client"
import React from 'react';
import SyncButton from '@/components/SyncButton';

export default function AdminPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', paddingTop: '40px' }}>
      <h2 style={{ fontSize: '32px', marginBottom: '8px' }} className="text-gradient">Admin Settings</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Restricted area for managing data syncs. Update datasets individually.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <h3 style={{ fontSize: '20px' }}>Market Cap Data</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', flex: 1 }}>Syncs Asset supply and prices for MON, HYPE, INX, LIT.</p>
          <SyncButton type="marketcap" label="Sync Market Cap" onSyncComplete={() => { alert('Market Cap sync recorded!'); }} />
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <h3 style={{ fontSize: '20px' }}>Volume Data</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', flex: 1 }}>Syncs daily buy and sell volume across Canonical Assets.</p>
          <SyncButton type="volume" label="Sync Net Volume" onSyncComplete={() => { alert('Volume sync recorded!'); }} />
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <h3 style={{ fontSize: '20px' }}>Token Holders</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', flex: 1 }}>Syncs unique on-chain holder counts and daily growth.</p>
          <SyncButton type="holders" label="Sync Holders" onSyncComplete={() => { alert('Holders sync recorded!'); }} />
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <h3 style={{ fontSize: '20px' }}>Trading Vol (DEX vs CEX)</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', flex: 1 }}>Syncs DEX Vol from Dune and CEX Vol from CoinGecko.</p>
          <SyncButton type="trading_volume" label="Sync Trading Vol" onSyncComplete={() => { alert('Trading Vol sync recorded!'); }} />
        </div>
      </div>
    </div>
  );
}
