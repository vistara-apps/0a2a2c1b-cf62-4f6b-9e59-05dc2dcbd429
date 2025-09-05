import { NextRequest, NextResponse } from 'next/server';
import { sendEmergencyAlert } from '@/lib/services/farcaster';
import { supabaseAdmin } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { EMERGENCY_MESSAGE_TEMPLATE } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      location, 
      contacts, 
      customMessage,
      alertType = 'emergency'
    } = await request.json();

    if (!userId || !location) {
      return NextResponse.json(
        { error: 'User ID and location are required' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const locationString = typeof location === 'string' 
      ? location 
      : `${location.latitude}, ${location.longitude}`;

    // Create alert message
    const message = customMessage || EMERGENCY_MESSAGE_TEMPLATE
      .replace('{location}', locationString)
      .replace('{timestamp}', new Date().toLocaleString());

    // Save alert to database
    const alertData = {
      alert_id: uuidv4(),
      user_id: userId,
      timestamp,
      location: typeof location === 'object' ? location : { address: location },
      recipient_contact_info: contacts || [],
      message_template: message,
      status: 'pending'
    };

    const { data: savedAlert, error: dbError } = await supabaseAdmin
      .from('alerts')
      .insert(alertData)
      .select()
      .single();

    if (dbError) {
      console.error('Error saving alert:', dbError);
      return NextResponse.json(
        { error: 'Failed to save alert' },
        { status: 500 }
      );
    }

    // Send alerts via different channels
    const results = [];

    // Send via Farcaster if contacts have FIDs
    const farcasterContacts = contacts?.filter((c: any) => c.fid) || [];
    if (farcasterContacts.length > 0) {
      try {
        const farcasterResults = await sendEmergencyAlert({
          message,
          location: locationString,
          timestamp: new Date().toLocaleString(),
          recipientFids: farcasterContacts.map((c: any) => c.fid)
        });
        results.push(...farcasterResults);
      } catch (error) {
        console.error('Error sending Farcaster alerts:', error);
      }
    }

    // Send via SMS (would need Twilio or similar service)
    const smsContacts = contacts?.filter((c: any) => c.phone) || [];
    if (smsContacts.length > 0) {
      // TODO: Implement SMS sending via Twilio
      console.log('SMS alerts would be sent to:', smsContacts);
    }

    // Send via Email (would need SendGrid or similar service)
    const emailContacts = contacts?.filter((c: any) => c.email) || [];
    if (emailContacts.length > 0) {
      // TODO: Implement email sending
      console.log('Email alerts would be sent to:', emailContacts);
    }

    // Update alert status
    await supabaseAdmin
      .from('alerts')
      .update({ 
        status: results.length > 0 ? 'sent' : 'failed' 
      })
      .eq('id', savedAlert.id);

    return NextResponse.json({
      success: true,
      alert: savedAlert,
      results,
      sentCount: results.filter(r => r.success).length
    });

  } catch (error) {
    console.error('Error sending alert:', error);
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

    const { data: alerts, error } = await supabaseAdmin
      .from('alerts')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching alerts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch alerts' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      alerts
    });

  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
