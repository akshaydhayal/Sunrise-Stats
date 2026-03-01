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
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
      <style>
        {`
          @keyframes pulse-glow {
            0% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.5); }
            70% { box-shadow: 0 0 0 6px rgba(0, 255, 0, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0); }
          }
          .live-badge {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: rgba(0, 255, 0, 0.05);
            border: 1px solid rgba(0, 255, 0, 0.5);
            border-radius: 20px;
            padding: 6px 14px;
            font-size: 13px;
            font-weight: 500;
            color: #e5e7eb;
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.02);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
          }
          .live-badge:hover {
            background: rgba(0, 255, 0, 0.1);
            border-color: rgba(0, 255, 0, 0.7);
          }
          .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #00ff00;
            animation: pulse-glow 2s infinite;
          }
          .sync-note {
            font-size: 12px;
            color: rgba(242, 234, 234, 0.9);
            letter-spacing: 0.02em;
          }
        `}
      </style>
      <div className="live-badge">
        <div className="status-dot"></div>
        <span>
          <span style={{ color: 'rgba(255,255,255,0.5)', marginRight: '6px' }}>Data Synced:</span>
          {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 6px' }}>•</span>
          {lastSync.toLocaleDateString()}
        </span>
      </div>
      <span className="sync-note">Data updates every 12h</span>
    </div>
  );
}
