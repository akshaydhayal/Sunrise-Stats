import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AssetData from '@/models/AssetData';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await dbConnect();

    // Group by token, sorted by date ascending
    const data = await AssetData.find({}).sort({ date: 1 }).lean();
    
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
        date: item.date,
        marketcap: item.marketcap,
        price: item.price,
        total_supply: item.total_supply
      });

      // 2. Organize by date for overall aggregated chart
      const dateStr = item.date.toISOString().split('T')[0];
      if (!dateMap[dateStr]) {
        dateMap[dateStr] = {
          date: dateStr,
          totalMarketCap: 0,
          MON_mc: 0,
          HYPE_mc: 0,
          INX_mc: 0,
          LIT_mc: 0
        };
      }
      
      const mc = item.marketcap || 0;
      dateMap[dateStr].totalMarketCap += mc;
      dateMap[dateStr][`${item.token}_mc`] = mc;
    });

    processedData.overall = Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate daily changes for overall
    for (let i = 0; i < processedData.overall.length; i++) {
      if (i === 0) {
        processedData.overall[i].dailyChange = 0;
      } else {
        processedData.overall[i].dailyChange = processedData.overall[i].totalMarketCap - processedData.overall[i-1].totalMarketCap;
      }
    }

    // Calculate daily changes for individual tokens
    Object.keys(processedData.tokens).forEach(token => {
      processedData.tokens[token].sort((a, b) => new Date(a.date) - new Date(b.date));
      for (let i = 0; i < processedData.tokens[token].length; i++) {
        if (i === 0) {
          processedData.tokens[token][i].dailyChange = 0;
        } else {
          processedData.tokens[token][i].dailyChange = processedData.tokens[token][i].marketcap - processedData.tokens[token][i-1].marketcap;
        }
      }
    });

    // Get latest stats
    const latestStats = {
      totalMarketCap: 0,
      tokens: {}
    };

    if (processedData.overall.length > 0) {
      latestStats.totalMarketCap = processedData.overall[processedData.overall.length - 1].totalMarketCap;
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
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
