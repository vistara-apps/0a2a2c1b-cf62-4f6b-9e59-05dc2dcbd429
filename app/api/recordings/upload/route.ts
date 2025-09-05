import { NextRequest, NextResponse } from 'next/server';
import { uploadRecording } from '@/lib/services/pinata';
import { supabaseAdmin } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('recording') as File;
    const userId = formData.get('userId') as string;
    const location = formData.get('location') as string;
    const notes = formData.get('notes') as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'Recording file and user ID are required' },
        { status: 400 }
      );
    }

    // Convert file to blob
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

    // Upload to IPFS
    const timestamp = new Date().toISOString();
    const { ipfsHash, ipfsUrl } = await uploadRecording(blob, {
      userId,
      timestamp,
      location: location ? JSON.parse(location) : null,
      duration: 0 // Could be calculated from the audio file
    });

    // Save interaction log to database
    const logData = {
      log_id: uuidv4(),
      user_id: userId,
      timestamp,
      location: location ? JSON.parse(location) : {},
      recording_url: ipfsUrl,
      notes: notes || null
    };

    const { data: savedLog, error } = await supabaseAdmin
      .from('interaction_logs')
      .insert(logData)
      .select()
      .single();

    if (error) {
      console.error('Error saving interaction log:', error);
      return NextResponse.json(
        { error: 'Failed to save interaction log' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      log: savedLog,
      ipfsHash,
      ipfsUrl
    });

  } catch (error) {
    console.error('Error uploading recording:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data: logs, error } = await supabaseAdmin
      .from('interaction_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching interaction logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch interaction logs' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      logs
    });

  } catch (error) {
    console.error('Error fetching interaction logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
