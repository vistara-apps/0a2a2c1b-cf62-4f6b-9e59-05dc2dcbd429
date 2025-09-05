import { NextRequest, NextResponse } from 'next/server';
import { generateLegalGuide } from '@/lib/services/openai';
import { supabaseAdmin } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { state, language = 'en', scenario = 'general' } = await request.json();

    if (!state) {
      return NextResponse.json(
        { error: 'State is required' },
        { status: 400 }
      );
    }

    // Check if guide already exists
    const { data: existingGuide } = await supabaseAdmin
      .from('legal_guides')
      .select('*')
      .eq('state', state)
      .eq('language', language)
      .single();

    if (existingGuide) {
      return NextResponse.json({
        success: true,
        guide: existingGuide
      });
    }

    // Generate new guide
    const content = await generateLegalGuide({
      state,
      language,
      scenario
    });

    // Save to database
    const guideData = {
      guide_id: uuidv4(),
      state,
      title: `${state} Rights During Police Interactions`,
      content,
      language
    };

    const { data: savedGuide, error } = await supabaseAdmin
      .from('legal_guides')
      .insert(guideData)
      .select()
      .single();

    if (error) {
      console.error('Error saving legal guide:', error);
      return NextResponse.json(
        { error: 'Failed to save legal guide' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      guide: savedGuide
    });

  } catch (error) {
    console.error('Error generating legal guide:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const language = searchParams.get('language') || 'en';

    if (!state) {
      return NextResponse.json(
        { error: 'State parameter is required' },
        { status: 400 }
      );
    }

    const { data: guide, error } = await supabaseAdmin
      .from('legal_guides')
      .select('*')
      .eq('state', state)
      .eq('language', language)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching legal guide:', error);
      return NextResponse.json(
        { error: 'Failed to fetch legal guide' },
        { status: 500 }
      );
    }

    if (!guide) {
      return NextResponse.json(
        { error: 'Guide not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      guide
    });

  } catch (error) {
    console.error('Error fetching legal guide:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
