import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SB_URL;
const supabaseAnonKey = import.meta.env.SB_ANON;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Gallery will use fallback data.');
}

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = () => !!supabase;
