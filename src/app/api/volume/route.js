import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import VolumeData from '@/models/VolumeData';

export async function GET(req) {
  try {
    await dbConnect();

    // Group by token, sorted by date ascending
    const data = await VolumeData.find({}).sort({ date: 1 }).lean();
    
    // Process data to be chart-friendly
    const processedData = {
      overall: [],
      tokens: {}
    };

    const dateMap = {};

    data.forEach(item => {
      // 1. Organize by token
      if (!processedData.tokens[item.token]) {
        processedData.tokens[item.token] = [];
      }
      processedData.tokens[item.token].push({
        date: item.date.toISOString().split('T')[0],
        buy_volume: item.buy_volume_usd,
        sell_volume: item.sell_volume_usd,
        net_buy_volume: item.net_buy_volume_usd
      });

      // 2. Organize by date for overall aggregated chart
      const dateStr = item.date.toISOString().split('T')[0];
      if (!dateMap[dateStr]) {
        dateMap[dateStr] = {
          date: dateStr,
          total_buy_volume: 0,
          total_sell_volume: 0,
          total_net_buy_volume: 0,
          MON_net: 0,
          HYPE_net: 0,
          INX_net: 0,
          LIT_net: 0
        };
      }
      
      const buy = item.buy_volume_usd || 0;
      const sell = item.sell_volume_usd || 0;
      const net = item.net_buy_volume_usd || 0;

      dateMap[dateStr].total_buy_volume += buy;
      dateMap[dateStr].total_sell_volume += sell;
      dateMap[dateStr].total_net_buy_volume += net;
      dateMap[dateStr][`${item.token}_net`] = net;
    });

    processedData.overall = Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get latest stats
    const latestStats = {
      total_buy_volume: 0,
      total_sell_volume: 0,
      total_net_buy_volume: 0,
      tokens: {}
    };

    if (processedData.overall.length > 0) {
      const last = processedData.overall[processedData.overall.length - 1];
      latestStats.total_buy_volume = last.total_buy_volume;
      latestStats.total_sell_volume = last.total_sell_volume;
      latestStats.total_net_buy_volume = last.total_net_buy_volume;
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
    console.error("Volume API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
