import { createClient, SupabaseClient } from '@supabase/supabase-js';

const meta = (import.meta as any).env || {};
const supabaseUrl: string = meta.VITE_SUPABASE_URL || '';
const supabaseAnonKey: string = meta.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.trim() !== '' && 
  supabaseAnonKey.trim() !== '' &&
  supabaseUrl.startsWith('http')
);

// Initialize Supabase Client
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? supabaseUrl.trim() : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey.trim() : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
