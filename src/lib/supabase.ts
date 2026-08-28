import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://yxcujbyopxoddqbysspp.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_AZtik9SXS-SnsKFUVqHEJQ__iTI3QID';

const meta = (import.meta as any).env || {};
const supabaseUrl: string = (meta.VITE_SUPABASE_URL && meta.VITE_SUPABASE_URL.trim() !== '') 
  ? meta.VITE_SUPABASE_URL.trim() 
  : DEFAULT_SUPABASE_URL;

const supabaseAnonKey: string = (meta.VITE_SUPABASE_ANON_KEY && meta.VITE_SUPABASE_ANON_KEY.trim() !== '') 
  ? meta.VITE_SUPABASE_ANON_KEY.trim() 
  : DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.trim() !== '' && 
  supabaseAnonKey.trim() !== '' &&
  supabaseUrl.startsWith('http')
);

// Initialize Supabase Client with persistent fail-safe credentials
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
