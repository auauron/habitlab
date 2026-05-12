import { createClient } from '@supabase/supabase-js'

export type HabitLabDatabase = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          display_name?: string | null
          updated_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          name: string
          cadence: 'daily' | 'weekdays' | 'weekly'
          icon: string
          color: string
          created_at: string
          archived_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          cadence: 'daily' | 'weekdays' | 'weekly'
          icon?: string
          color?: string
          created_at?: string
          archived_at?: string | null
        }
        Update: {
          name?: string
          cadence?: 'daily' | 'weekdays' | 'weekly'
          icon?: string
          color?: string
          archived_at?: string | null
        }
      }
      habit_logs: {
        Row: {
          id: string
          user_id: string
          habit_id: string
          date: string
          status: 'complete' | 'skip' | 'pending'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          habit_id: string
          date: string
          status: 'complete' | 'skip' | 'pending'
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: 'complete' | 'skip' | 'pending'
          updated_at?: string
        }
      }
      daily_checkins: {
        Row: {
          id: string
          user_id: string
          date: string
          mood: 'clear' | 'tired' | 'bright' | 'heavy' | 'steady'
          energy: number
          reflection: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          mood: 'clear' | 'tired' | 'bright' | 'heavy' | 'steady'
          energy: number
          reflection?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          mood?: 'clear' | 'tired' | 'bright' | 'heavy' | 'steady'
          energy?: number
          reflection?: string
          updated_at?: string
        }
      }
    }
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
)

export const supabase = isSupabaseConfigured
  ? createClient<HabitLabDatabase>(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null
