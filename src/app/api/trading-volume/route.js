import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TradingVolumeData from '@/models/TradingVolumeData';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await dbConnect();

    // Group by token, sorted by date ascending
    const data = await TradingVolumeData.find({}).sort({ date: 1 }).lean();
    
    // Process data to be chart-friendly
    const processedData = {
      overall: [],
      tokens: {}
    };

    const dateMap = {};

    const cumulativeTokens = { MON: { dex: 0, cex: 0 }, HYPE: { dex: 0, cex: 0 }, INX: { dex: 0, cex: 0 }, LIT: { dex: 0, cex: 0 } };

    data.forEach(item => {
      const dex = item.dex_volume || 0;
      const cex = item.cex_volume || 0;

      // 1. Organize by token
      if (!processedData.tokens[item.token]) {
        processedData.tokens[item.token] = [];
      }
      
      cumulativeTokens[item.token].dex += dex;
      cumulativeTokens[item.token].cex += cex;

      processedData.tokens[item.token].push({
        date: item.date.toISOString().split('T')[0],
        dex_volume: dex,
        cex_volume: cex,
        cumulative_dex_volume: cumulativeTokens[item.token].dex,
        cumulative_cex_volume: cumulativeTokens[item.token].cex,
        cex_price: item.cex_price || 0
      });

      // 2. Organize by date for overall aggregated chart
      const dateStr = item.date.toISOString().split('T')[0];
      if (!dateMap[dateStr]) {
        dateMap[dateStr] = {
          date: dateStr,
          total_dex_volume: 0,
          total_cex_volume: 0,
          MON_dex: 0,
          MON_cex: 0,
          HYPE_dex: 0,
          HYPE_cex: 0,
          INX_dex: 0,
          INX_cex: 0,
          LIT_dex: 0,
          LIT_cex: 0
        };
      }
      
      dateMap[dateStr].total_dex_volume += dex;
      dateMap[dateStr].total_cex_volume += cex;
      dateMap[dateStr][`${item.token}_dex`] = dex;
      dateMap[dateStr][`${item.token}_cex`] = cex;
    });

    // Calculate aggregated cumulative totals
    let runningOverallDex = 0;
    let runningOverallCex = 0;
    
    processedData.overall = Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date)).map(day => {
      runningOverallDex += day.total_dex_volume;
      runningOverallCex += day.total_cex_volume;
      return {
        ...day,
        cumulative_total_dex_volume: runningOverallDex,
        cumulative_total_cex_volume: runningOverallCex
      };
    });

    // Get latest stats
    const latestStats = {
      total_dex_volume: 0,
      total_cex_volume: 0,
      tokens: {}
    };

    if (processedData.overall.length > 0) {
      const last = processedData.overall[processedData.overall.length - 1];
      latestStats.total_dex_volume = last.total_dex_volume;
      latestStats.total_cex_volume = last.total_cex_volume;
      
      const prev = processedData.overall.length > 1 ? processedData.overall[processedData.overall.length - 2] : last;
      const lastTotal = last.total_dex_volume + last.total_cex_volume;
      const prevTotal = prev.total_dex_volume + prev.total_cex_volume;
      
      latestStats.total_change = lastTotal - prevTotal;
      latestStats.total_change_percent = prevTotal > 0 ? (latestStats.total_change / prevTotal) * 100 : 0;
      
      latestStats.cex_change = last.total_cex_volume - prev.total_cex_volume;
      latestStats.cex_change_percent = prev.total_cex_volume > 0 ? (latestStats.cex_change / prev.total_cex_volume) * 100 : 0;
      
      latestStats.dex_change = last.total_dex_volume - prev.total_dex_volume;
      latestStats.dex_change_percent = prev.total_dex_volume > 0 ? (latestStats.dex_change / prev.total_dex_volume) * 100 : 0;
    }

    Object.keys(processedData.tokens).forEach(token => {
      const arr = processedData.tokens[token];
      if (arr.length > 0) {
        latestStats.tokens[token] = arr[arr.length - 1];
      }
    });

    return NextResponse.json({
      success: true,
      data: processedData,
      latestStats
    });

  } catch (error) {
    console.error("Trading Volume API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
