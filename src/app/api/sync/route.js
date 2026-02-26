import { NextResponse } from 'next/server';
import { DuneClient } from "@duneanalytics/client-sdk";
import dbConnect from '@/lib/mongodb';
import AssetData from '@/models/AssetData';

export async function POST(req) {
  try {
    await dbConnect();
    
    const client = new DuneClient(process.env.DUNE_API_KEY);
    
    // Fetch marketcap, price, total supply data
    const query_result = await client.getLatestResult({ queryId: 6629448 });
    
    if (!query_result || !query_result.result || !query_result.result.rows) {
      throw new Error("Invalid response from Dune API");
    }
    
    const rows = query_result.result.rows;
    let inserted = 0;
    let updated = 0;
    
    // Process and store the rows
    for (const row of rows) {
      if (!row.day || !row.token) continue;
      
      const date = new Date(row.day);
      
      const existingRecord = await AssetData.findOne({
        date: date,
        token: row.token
      });
      
      if (existingRecord) {
        // Update if exists
        existingRecord.marketcap = row.marketcap;
        existingRecord.price = row.price;
        existingRecord.total_supply = row.total_supply;
        await existingRecord.save();
        updated++;
      } else {
        // Create new
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

    return NextResponse.json({ 
      success: true, 
      message: `Sync complete. Inserted: ${inserted}, Updated: ${updated}` 
    });
    
  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
