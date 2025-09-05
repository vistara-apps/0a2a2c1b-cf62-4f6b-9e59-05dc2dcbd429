import axios from 'axios';

const NEYNAR_API_URL = 'https://api.neynar.com/v2';

interface NeynarConfig {
  apiKey: string;
  signerUuid: string;
}

const config: NeynarConfig = {
  apiKey: process.env.NEYNAR_API_KEY!,
  signerUuid: process.env.NEXT_PUBLIC_FARCASTER_SIGNER_UUID!
};

export interface CastRequest {
  text: string;
  embeds?: Array<{
    url?: string;
    cast_id?: {
      fid: number;
      hash: string;
    };
  }>;
  parent?: {
    fid: number;
    hash: string;
  };
  channel_id?: string;
}

export interface CastResponse {
  success: boolean;
  cast?: {
    hash: string;
    thread_hash: string;
    parent_hash?: string;
    parent_url?: string;
    root_parent_url?: string;
    parent_author?: {
      fid: number;
    };
    author: {
      fid: number;
      username: string;
      display_name: string;
      pfp_url: string;
    };
    text: string;
    timestamp: string;
    embeds: Array<{
      url?: string;
      metadata?: any;
    }>;
    reactions: {
      likes_count: number;
      recasts_count: number;
      likes: Array<{
        fid: number;
        fname: string;
      }>;
      recasts: Array<{
        fid: number;
        fname: string;
      }>;
    };
    replies: {
      count: number;
    };
  };
  message?: string;
}

/**
 * Post a cast to Farcaster
 */
export async function publishCast(castData: CastRequest): Promise<CastResponse> {
  try {
    const response = await axios.post(
      `${NEYNAR_API_URL}/farcaster/cast`,
      {
        signer_uuid: config.signerUuid,
        ...castData
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      cast: response.data.cast
    };
  } catch (error: any) {
    console.error('Error publishing cast:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to publish cast'
    };
  }
}

/**
 * Share a rights card on Farcaster
 */
export async function shareRightsCard({
  title,
  content,
  state,
  ipfsUrl,
  appUrl
}: {
  title: string;
  content: string;
  state: string;
  ipfsUrl?: string;
  appUrl: string;
}): Promise<CastResponse> {
  const castText = `🛡️ ${title}

${content.substring(0, 200)}${content.length > 200 ? '...' : ''}

Know your rights during police interactions in ${state}! 

#KnowYourRights #${state}Rights #RightsSphere #LegalRights #PoliceInteraction`;

  const embeds = [];
  
  // Add IPFS link if available
  if (ipfsUrl) {
    embeds.push({ url: ipfsUrl });
  }
  
  // Add app link
  embeds.push({ url: appUrl });

  return publishCast({
    text: castText,
    embeds: embeds.length > 0 ? embeds : undefined
  });
}

/**
 * Send an emergency alert via Farcaster
 */
export async function sendEmergencyAlert({
  message,
  location,
  timestamp,
  recipientFids
}: {
  message: string;
  location: string;
  timestamp: string;
  recipientFids?: number[];
}): Promise<CastResponse[]> {
  const alertText = `🚨 EMERGENCY ALERT 🚨

${message}

📍 Location: ${location}
⏰ Time: ${timestamp}

Please monitor this situation.

#EmergencyAlert #RightsSphere #SafetyFirst`;

  // For now, post as public cast
  // In a full implementation, you'd send direct messages to specific FIDs
  const results = await Promise.all([
    publishCast({
      text: alertText
    })
  ]);

  return results;
}

/**
 * Get user profile by FID
 */
export async function getUserProfile(fid: number): Promise<any> {
  try {
    const response = await axios.get(
      `${NEYNAR_API_URL}/farcaster/user/bulk?fids=${fid}`,
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`
        }
      }
    );

    return response.data.users[0];
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Search for users by username
 */
export async function searchUsers(query: string): Promise<any[]> {
  try {
    const response = await axios.get(
      `${NEYNAR_API_URL}/farcaster/user/search?q=${encodeURIComponent(query)}`,
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`
        }
      }
    );

    return response.data.result.users || [];
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}

/**
 * Get cast by hash
 */
export async function getCast(hash: string): Promise<any> {
  try {
    const response = await axios.get(
      `${NEYNAR_API_URL}/farcaster/cast?identifier=${hash}&type=hash`,
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`
        }
      }
    );

    return response.data.cast;
  } catch (error) {
    console.error('Error fetching cast:', error);
    return null;
  }
}

/**
 * Test Neynar connection
 */
export async function testNeynarConnection(): Promise<boolean> {
  try {
    const response = await axios.get(
      `${NEYNAR_API_URL}/farcaster/user/bulk?fids=1`,
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`
        }
      }
    );
    
    return response.status === 200;
  } catch (error) {
    console.error('Neynar connection test failed:', error);
    return false;
  }
}
