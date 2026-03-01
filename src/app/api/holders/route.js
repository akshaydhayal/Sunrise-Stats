import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HolderData from '@/models/HolderData';

export async function GET(req) {
  try {
    await dbConnect();

    // Group by token, sorted by date ascending
    const data = await HolderData.find({}).sort({ date: 1 }).lean();
    
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
        total_holders: item.total_holders,
        dailyChange: item.holder_growth
      });

      // 2. Organize by date for overall aggregated chart
      const dateStr = item.date.toISOString().split('T')[0];
      if (!dateMap[dateStr]) {
        dateMap[dateStr] = {
          date: dateStr,
          total_holders: 0,
          MON_holders: 0,
          HYPE_holders: 0,
          INX_holders: 0,
          LIT_holders: 0,
          dailyChange: 0
        };
      }
      
      const holders = item.total_holders || 0;
      const growth = item.holder_growth || 0;

      dateMap[dateStr].total_holders += holders;
      dateMap[dateStr].dailyChange += growth;
      dateMap[dateStr][`${item.token}_holders`] = holders;
    });

    processedData.overall = Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get latest stats
    const latestStats = {
      total_holders: 0,
      tokens: {}
    };

    if (processedData.overall.length > 0) {
      const last = processedData.overall[processedData.overall.length - 1];
      latestStats.total_holders = last.total_holders;
      latestStats.dailyChange = last.dailyChange;
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
    console.error("Holders API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
