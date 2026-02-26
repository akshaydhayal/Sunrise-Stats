import { NextResponse } from 'next/server';
import { DuneClient } from "@duneanalytics/client-sdk";
import dbConnect from '@/lib/mongodb';
import AssetData from '@/models/AssetData';
import VolumeData from '@/models/VolumeData';
import HolderData from '@/models/HolderData';
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
