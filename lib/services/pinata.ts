import axios from 'axios';

const PINATA_API_URL = 'https://api.pinata.cloud';

interface PinataConfig {
  apiKey: string;
  secretApiKey: string;
  jwt: string;
}

const config: PinataConfig = {
  apiKey: process.env.PINATA_API_KEY!,
  secretApiKey: process.env.PINATA_SECRET_API_KEY!,
  jwt: process.env.PINATA_JWT!
};

export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export interface RightsCardMetadata {
  title: string;
  content: string;
  state: string;
  scenario: string;
  language: string;
  timestamp: string;
  version: string;
}

/**
 * Upload a file to IPFS via Pinata
 */
export async function uploadFileToIPFS(
  file: File | Blob,
  filename: string,
  metadata?: Record<string, any>
): Promise<PinataResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file, filename);
    
    if (metadata) {
      formData.append('pinataMetadata', JSON.stringify({
        name: filename,
        keyvalues: metadata
      }));
    }

    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinFileToIPFS`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${config.jwt}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
}

/**
 * Upload JSON data to IPFS via Pinata
 */
export async function uploadJSONToIPFS(
  data: any,
  filename: string,
  metadata?: Record<string, any>
): Promise<PinataResponse> {
  try {
    const body = {
      pinataContent: data,
      pinataMetadata: {
        name: filename,
        keyvalues: metadata || {}
      }
    };

    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinJSONToIPFS`,
      body,
      {
        headers: {
          'Authorization': `Bearer ${config.jwt}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading JSON to IPFS:', error);
    throw new Error('Failed to upload JSON to IPFS');
  }
}

/**
 * Upload recording to IPFS with metadata
 */
export async function uploadRecording(
  recordingBlob: Blob,
  metadata: {
    userId: string;
    timestamp: string;
    location?: any;
    duration?: number;
  }
): Promise<{
  ipfsHash: string;
  ipfsUrl: string;
}> {
  const filename = `recording_${metadata.userId}_${Date.now()}.webm`;
  
  const pinataMetadata = {
    user_id: metadata.userId,
    timestamp: metadata.timestamp,
    location: JSON.stringify(metadata.location || {}),
    duration: metadata.duration?.toString() || '0',
    type: 'police_interaction_recording'
  };

  const result = await uploadFileToIPFS(recordingBlob, filename, pinataMetadata);
  
  return {
    ipfsHash: result.IpfsHash,
    ipfsUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
  };
}

/**
 * Upload rights card to IPFS
 */
export async function uploadRightsCard(
  cardData: RightsCardMetadata
): Promise<{
  ipfsHash: string;
  ipfsUrl: string;
}> {
  const filename = `rights_card_${cardData.state}_${Date.now()}.json`;
  
  const pinataMetadata = {
    state: cardData.state,
    scenario: cardData.scenario,
    language: cardData.language,
    version: cardData.version,
    type: 'rights_card'
  };

  const result = await uploadJSONToIPFS(cardData, filename, pinataMetadata);
  
  return {
    ipfsHash: result.IpfsHash,
    ipfsUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
  };
}

/**
 * Get file from IPFS
 */
export function getIPFSUrl(hash: string): string {
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
}

/**
 * Test Pinata connection
 */
export async function testPinataConnection(): Promise<boolean> {
  try {
    const response = await axios.get(
      `${PINATA_API_URL}/data/testAuthentication`,
      {
        headers: {
          'Authorization': `Bearer ${config.jwt}`
        }
      }
    );
    
    return response.data.message === 'Congratulations! You are communicating with the Pinata API!';
  } catch (error) {
    console.error('Pinata connection test failed:', error);
    return false;
  }
}
