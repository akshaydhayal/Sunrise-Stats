"use client";
import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export default function LastUpdated({ syncKey = "marketcap_sync" }) {
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    fetch('/api/metadata')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.lastSync && data.lastSync[syncKey]) {
          setLastSync(new Date(data.lastSync[syncKey]));
        }
      })
      .catch(err => console.error("Error fetching metadata:", err));
  }, []);

  if (!lastSync) return null;

  return (
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '6px', 
      fontSize: '12px', 
      color: 'var(--text-muted)',
      background: 'var(--glass-bg)',
      padding: '4px 12px',
      borderRadius: '20px',
      border: '1px solid var(--glass-border)',
      marginTop: '8px'
    }}>
      <Clock size={12} />
      <span>Last updated: {lastSync.toLocaleString()}</span>
      <span style={{ opacity: 0.5, margin: '0 4px' }}>|</span>
      <span>Data is updated every 24 hours</span>
    </div>
  );
}
