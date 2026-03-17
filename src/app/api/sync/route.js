import { NextResponse } from 'next/server';
import { DuneClient } from "@duneanalytics/client-sdk";
import dbConnect from '@/lib/mongodb';
import AssetData from '@/models/AssetData';
import VolumeData from '@/models/VolumeData';
import HolderData from '@/models/HolderData';
import TradingVolumeData from '@/models/TradingVolumeData';
import AppMetadata from '@/models/AppMetadata';

export async function POST(req) {
  try {
    const body = await req.json();
    const syncType = body.type; // expected: 'marketcap', 'volume', or 'holders'
    
    if (!syncType) {
      return NextResponse.json({ success: false, error: 'Missing sync type' }, { status: 400 });
    }

    await dbConnect();
    const client = new DuneClient(process.env.DUNE_API_KEY);
    let message = '';

    if (syncType === 'marketcap') {
      const query_result = await client.getLatestResult({ queryId: 6629448 });
      let inserted = 0;
      let updated = 0;
    
      if (query_result && query_result.result && query_result.result.rows) {
        const rows = query_result.result.rows;
      for (const row of rows) {
        if (!row.day || !row.token) continue;
        
        const date = new Date(row.day);
        
        const existingRecord = await AssetData.findOne({
          date: date,
          token: row.token
        });
        
        if (existingRecord) {
          existingRecord.marketcap = row.marketcap;
          existingRecord.price = row.price;
          existingRecord.total_supply = row.total_supply;
          await existingRecord.save();
          updated++;
        } else {
          await AssetData.create({
            date: date,
            token: row.token,
            marketcap: row.marketcap,
            price: row.price,
            total_supply: row.total_supply
          });
          inserted++;
        }
        }
      }

      await AppMetadata.findOneAndUpdate(
        { key: 'marketcap_sync' },
        { lastSync: new Date() },
        { upsert: true }
      );
      message = `Marketcap sync complete. Models (In: ${inserted}, Up: ${updated})`;

    } else if (syncType === 'volume') {
      let insertedVolume = 0;
      let updatedVolume = 0;
      const volume_query_result = await client.getLatestResult({ queryId: 6747709 });
      if (volume_query_result && volume_query_result.result && volume_query_result.result.rows) {
        const vRows = volume_query_result.result.rows;
        for (const row of vRows) {
          if (!row.day || !row.token) continue;
          const date = new Date(row.day);
          
          const existingRecord = await VolumeData.findOne({
            date: date,
            token: row.token
          });
          
          if (existingRecord) {
            existingRecord.buy_volume_usd = row.buy_volume_usd;
            existingRecord.sell_volume_usd = row.sell_volume_usd;
            existingRecord.net_buy_volume_usd = row.net_buy_volume_usd;
            await existingRecord.save();
            updatedVolume++;
          } else {
            await VolumeData.create({
              date: date,
              token: row.token,
              buy_volume_usd: row.buy_volume_usd,
              sell_volume_usd: row.sell_volume_usd,
              net_buy_volume_usd: row.net_buy_volume_usd
            });
            insertedVolume++;
          }
        }
      }

      await AppMetadata.findOneAndUpdate(
        { key: 'volume_sync' },
        { lastSync: new Date() },
        { upsert: true }
      );
      message = `Volume sync complete. Models (In: ${insertedVolume}, Up: ${updatedVolume})`;

    } else if (syncType === 'holders') {
      let insertedHolders = 0;
      let updatedHolders = 0;
      const holders_query_result = await client.getLatestResult({ queryId: 6733727 });
      if (holders_query_result && holders_query_result.result && holders_query_result.result.rows) {
        const hRows = holders_query_result.result.rows;
        for (const row of hRows) {
          if (!row.day || !row.token) continue;
          const date = new Date(row.day);
          
          const existingRecord = await HolderData.findOne({
            date: date,
            token: row.token
          });
          
          if (existingRecord) {
            existingRecord.total_holders = row.total_holders;
            existingRecord.holder_growth = row.holder_growth;
            await existingRecord.save();
            updatedHolders++;
          } else {
            await HolderData.create({
              date: date,
              token: row.token,
              total_holders: row.total_holders,
              holder_growth: row.holder_growth
            });
            insertedHolders++;
          }
        }
      }

      await AppMetadata.findOneAndUpdate(
        { key: 'holders_sync' },
        { lastSync: new Date() },
        { upsert: true }
      );
      message = `Holders sync complete. Models (In: ${insertedHolders}, Up: ${updatedHolders})`;
    } else if (syncType === 'trading_volume') {
      let insertedTrading = 0;
      let updatedTrading = 0;
      
      const duneQueries = {
        MON: 6757505,
        HYPE: 6757494,
        LIT: 6757234,
        INX: 6757510
      };
      
      const cgEndpoints = {
        MON: 'https://api.coingecko.com/api/v3/coins/monad/market_chart?vs_currency=usd&days=180',
        HYPE: 'https://api.coingecko.com/api/v3/coins/hyperliquid/market_chart?vs_currency=usd&days=180',
        LIT: 'https://api.coingecko.com/api/v3/coins/lighter/market_chart?vs_currency=usd&days=180',
        INX: 'https://api.coingecko.com/api/v3/coins/infinex-2/market_chart?vs_currency=usd&days=180'
      };

      for (const token of ['MON', 'HYPE', 'LIT', 'INX']) {
        // 1. Fetch DEX Data
        const dexResult = await client.getLatestResult({ queryId: duneQueries[token] });
        if (!dexResult || !dexResult.result || !dexResult.result.rows) continue;
        
        const dexRows = dexResult.result.rows;
        // Process DEX rows into a map by date string (YYYY-MM-DD)
        const dexMap = {};
        for (const row of dexRows) {
          if (!row.date) continue;
          const dateObj = new Date(row.date);
          const dateStr = dateObj.toISOString().split('T')[0];
          dexMap[dateStr] = {
            date: dateObj,
            dex_volume: row.daily_volume || 0
          };
        }

        // 2. Fetch CEX Data
        const cgRes = await fetch(cgEndpoints[token]);
        if (!cgRes.ok) {
          console.error(`Failed to fetch CG data for ${token}`);
          continue;
        }
        const cgData = await cgRes.json();
        const cexVolumes = cgData.total_volumes || [];
        const cexPrices = cgData.prices || [];

        // Map CEX volumes by date string
        const cexMap = {};
        for (const item of cexVolumes) {
          const dateObj = new Date(item[0]);
          const dateStr = dateObj.toISOString().split('T')[0];
          if (!cexMap[dateStr]) {
            cexMap[dateStr] = { volume: item[1] };
          }
        }
        
        // Map CEX prices by date string
        for (const item of cexPrices) {
          const dateObj = new Date(item[0]);
          const dateStr = dateObj.toISOString().split('T')[0];
          if (cexMap[dateStr]) {
            cexMap[dateStr].price = item[1];
          }
        }

        // 3. Merge based on DEX dates (to strictly align with the first DEX date)
        for (const dateStr of Object.keys(dexMap)) {
          const dexEntry = dexMap[dateStr];
          const cexEntry = cexMap[dateStr];
          
          const cex_volume = cexEntry ? cexEntry.volume : 0;
          const cex_price = cexEntry && cexEntry.price ? cexEntry.price : null;

          const existingRecord = await TradingVolumeData.findOne({
            date: dexEntry.date,
            token: token
          });

          if (existingRecord) {
            existingRecord.dex_volume = dexEntry.dex_volume;
            existingRecord.cex_volume = cex_volume;
            existingRecord.cex_price = cex_price;
            await existingRecord.save();
            updatedTrading++;
          } else {
            await TradingVolumeData.create({
              date: dexEntry.date,
              token: token,
              dex_volume: dexEntry.dex_volume,
              cex_volume: cex_volume,
              cex_price: cex_price
            });
            insertedTrading++;
          }
        }
      }

      await AppMetadata.findOneAndUpdate(
        { key: 'trading_volume_sync' },
        { lastSync: new Date() },
        { upsert: true }
      );
      message = `Trading Volume sync complete. Models (In: ${insertedTrading}, Up: ${updatedTrading})`;
    } else {
      return NextResponse.json({ success: false, error: 'Invalid sync type' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: message 
    });
    
  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
