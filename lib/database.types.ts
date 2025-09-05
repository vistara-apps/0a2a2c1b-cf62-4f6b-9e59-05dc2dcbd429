export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          user_id: string // farcaster_fid or wallet address
          preferred_language: string
          state_of_residence: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          preferred_language?: string
          state_of_residence?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          preferred_language?: string
          state_of_residence?: string | null
          updated_at?: string
        }
      }
      legal_guides: {
        Row: {
          id: string
          guide_id: string
          state: string
          title: string
          content: string
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          guide_id: string
          state: string
          title: string
          content: string
          language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          guide_id?: string
          state?: string
          title?: string
          content?: string
          language?: string
          updated_at?: string
        }
      }
      interaction_logs: {
        Row: {
          id: string
          log_id: string
          user_id: string
          timestamp: string
          location: Json
          recording_url: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          log_id: string
          user_id: string
          timestamp: string
          location: Json
          recording_url?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          log_id?: string
          user_id?: string
          timestamp?: string
          location?: Json
          recording_url?: string | null
          notes?: string | null
        }
      }
      alerts: {
        Row: {
          id: string
          alert_id: string
          user_id: string
          timestamp: string
          location: Json
          recipient_contact_info: Json
          message_template: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          alert_id: string
          user_id: string
          timestamp: string
          location: Json
          recipient_contact_info: Json
          message_template: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          alert_id?: string
          user_id?: string
          timestamp?: string
          location?: Json
          recipient_contact_info?: Json
          message_template?: string
          status?: string
        }
      }
      scripts: {
        Row: {
          id: string
          script_id: string
          scenario: string
          title: string
          content: string
          language: string
          is_premium: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          script_id: string
          scenario: string
          title: string
          content: string
          language?: string
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          script_id?: string
          scenario?: string
          title?: string
          content?: string
          language?: string
          is_premium?: boolean
          updated_at?: string
        }
      }
      user_purchases: {
        Row: {
          id: string
          user_id: string
          item_type: string
          item_id: string
          price: number
          currency: string
          transaction_hash: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          item_type: string
          item_id: string
          price: number
          currency: string
          transaction_hash?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          item_type?: string
          item_id?: string
          price?: number
          currency?: string
          transaction_hash?: string | null
          status?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
