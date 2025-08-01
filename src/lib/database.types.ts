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
      qr_codes: {
        Row: {
          id: string
          user_id: string | null
          url: string
          label: string
          qr_code_data_url: string
          contact_name: string | null
          phone_number: string | null
          qr_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          url: string
          label: string
          qr_code_data_url: string
          contact_name?: string | null
          phone_number?: string | null
          qr_type?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          url?: string
          label?: string
          qr_code_data_url?: string
          contact_name?: string | null
          phone_number?: string | null
          qr_type?: string
          created_at?: string
          updated_at?: string
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