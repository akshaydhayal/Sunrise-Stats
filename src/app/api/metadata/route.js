import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AppMetadata from '@/models/AppMetadata';

export async function GET() {
  try {
    await dbConnect();
    const metadataRecords = await AppMetadata.find({}).lean();
    
    // Convert array to an object: { marketcap_sync: "2024-...", volume_sync: "2024-..." }
    const timestamps = {};
    metadataRecords.forEach(record => {
      timestamps[record.key] = record.lastSync;
    });
    
    return NextResponse.json({
      success: true,
      lastSync: timestamps
    });
  } catch (error) {
    console.error("Metadata API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
