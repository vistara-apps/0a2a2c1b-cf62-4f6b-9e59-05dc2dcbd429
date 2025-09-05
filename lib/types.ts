// User types
export interface User {
  user_id: string; // farcaster_fid or wallet address
  preferred_language: string;
  state_of_residence?: string;
}

// Legal Guide types
export interface LegalGuide {
  guide_id: string;
  state: string;
  title: string;
  content: string;
  language: string;
}

// Interaction Log types
export interface InteractionLog {
  log_id: string;
  user_id: string;
  timestamp: Date;
  location: string;
  recording_url?: string;
  notes: string;
}

// Alert types
export interface Alert {
  alert_id: string;
  user_id: string;
  timestamp: Date;
  location: string;
  recipient_contact_info: string;
  message_template: string;
}

// Script types
export interface Script {
  id: string;
  title: string;
  content: string;
  language: string;
  category: 'traffic_stop' | 'search' | 'arrest' | 'general';
}

// Location types
export interface Location {
  latitude: number;
  longitude: number;
  state: string;
  city?: string;
}

// Rights Card types
export interface RightsCard {
  id: string;
  state: string;
  title: string;
  content: string;
  shareable_url: string;
  created_at: Date;
}
