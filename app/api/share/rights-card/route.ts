import { NextRequest, NextResponse } from 'next/server';
import { generateRightsCard } from '@/lib/services/openai';
import { uploadRightsCard } from '@/lib/services/pinata';
import { shareRightsCard } from '@/lib/services/farcaster';

export async function POST(request: NextRequest) {
  try {
    const { 
      state, 
      scenario = 'general', 
      language = 'en',
      shareOnFarcaster = false
    } = await request.json();

    if (!state) {
      return NextResponse.json(
        { error: 'State is required' },
        { status: 400 }
      );
    }

    // Generate rights card content
    const rightsCard = await generateRightsCard({
      state,
      scenario,
      language
    });

    // Create metadata for IPFS storage
    const cardMetadata = {
      ...rightsCard,
      state,
      scenario,
      language,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };

    // Upload to IPFS
    const { ipfsHash, ipfsUrl } = await uploadRightsCard(cardMetadata);

    // Share on Farcaster if requested
    let farcasterResult = null;
    if (shareOnFarcaster) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rightssphere.app';
      farcasterResult = await shareRightsCard({
        title: rightsCard.title,
        content: rightsCard.summary,
        state,
        ipfsUrl,
        appUrl
      });
    }

    return NextResponse.json({
      success: true,
      rightsCard: cardMetadata,
      ipfsHash,
      ipfsUrl,
      shareableUrl: `${process.env.NEXT_PUBLIC_APP_URL}/share/${ipfsHash}`,
      farcasterResult
    });

  } catch (error) {
    console.error('Error creating/sharing rights card:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ipfsHash = searchParams.get('hash');

    if (!ipfsHash) {
      return NextResponse.json(
        { error: 'IPFS hash is required' },
        { status: 400 }
      );
    }

    // In a real implementation, you'd fetch from IPFS
    // For now, return a placeholder response
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    return NextResponse.json({
      success: true,
      ipfsUrl,
      message: 'Fetch the rights card content from the IPFS URL'
    });

  } catch (error) {
    console.error('Error fetching rights card:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
