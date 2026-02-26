import { NextResponse } from 'next/server';
import { DuneClient } from "@duneanalytics/client-sdk";
import dbConnect from '@/lib/mongodb';
import AssetData from '@/models/AssetData';
import VolumeData from '@/models/VolumeData';
import HolderData from '@/models/HolderData';

export async function POST(req) {
  try {
    await dbConnect();
    
    const client = new DuneClient(process.env.DUNE_API_KEY);
    
    // FETCH ASSET MARKETCAP
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

    // FETCH VOLUME DATA
    let insertedVolume = 0;
    let updatedVolume = 0;
    try {
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
    } catch (volumeError) {
      console.error("Volume Data Sync Error:", volumeError);
    }

    // FETCH HOLDERS DATA
    let insertedHolders = 0;
    let updatedHolders = 0;
    try {
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
    } catch (holdersError) {
      console.error("Holders Data Sync Error:", holdersError);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Sync complete. Assets (In: ${inserted}, Up: ${updated}). Volume (In: ${insertedVolume}, Up: ${updatedVolume}). Holders (In: ${insertedHolders}, Up: ${updatedHolders})` 
    });
    
  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
