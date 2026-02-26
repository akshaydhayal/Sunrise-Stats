"use client";
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function SyncButton({ onSyncComplete, type = "marketcap", label = "Sync Data" }) {
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sync', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: type })
      });
      const data = await res.json();
      if (onSyncComplete) onSyncComplete();
      alert(data.message || 'Sync successful');
    } catch (e) {
      alert('Sync failed');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      className="btn-primary" 
      onClick={handleSync} 
      disabled={loading}
      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
    >
      <RefreshCw size={18} className={loading ? "spin" : ""} />
      {loading ? "Syncing Dune Data..." : label}
      <style jsx>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </button>
  );
}
