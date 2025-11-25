// Supabase Database Types
// Generated from your database schema

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
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone_number: string | null
          domain_context: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone_number?: string | null
          domain_context?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone_number?: string | null
          domain_context?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_path: string
          extracted_text: string | null
          parsed_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_path: string
          extracted_text?: string | null
          parsed_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          file_path?: string
          extracted_text?: string | null
          parsed_data?: Json | null
          created_at?: string
        }
      }
      context_profiles: {
        Row: {
          id: string
          user_id: string
          target_roles: string[] | null
          preferred_industries: string[] | null
          pitch_tone: string
          keywords: string[] | null
          custom_message: string | null
          geography: string[] | null
          context_json: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          target_roles?: string[] | null
          preferred_industries?: string[] | null
          pitch_tone?: string
          keywords?: string[] | null
          custom_message?: string | null
          geography?: string[] | null
          context_json?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          target_roles?: string[] | null
          preferred_industries?: string[] | null
          pitch_tone?: string
          keywords?: string[] | null
          custom_message?: string | null
          geography?: string[] | null
          context_json?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      smtp_credentials: {
        Row: {
          id: string
          user_id: string
          smtp_host: string
          smtp_port: number
          smtp_user: string
          smtp_password_encrypted: string
          use_tls: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          smtp_host: string
          smtp_port: number
          smtp_user: string
          smtp_password_encrypted: string
          use_tls?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          smtp_host?: string
          smtp_port?: number
          smtp_user?: string
          smtp_password_encrypted?: string
          use_tls?: boolean
          is_active?: boolean
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
  }
}
