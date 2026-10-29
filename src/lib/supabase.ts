import { createClient, SupabaseClient } from '@supabase/supabase-js';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check localStorage for runtime configuration if .env was not populated yet
const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('graviflow_supabase_url') : null;
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('graviflow_supabase_key') : null;

export const supabaseUrl = envUrl || storedUrl || '';
export const supabaseAnonKey = envAnonKey || storedKey || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey &&
    supabaseAnonKey.length > 10
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Utility functions to save/read from Supabase with graceful fallback
export const saveUserDataToCloud = async (tableName: string, data: any) => {
  if (!supabase) return { error: 'Supabase não configurado' };
  try {
    const { data: result, error } = await supabase
      .from(tableName)
      .upsert(data, { onConflict: 'id' });
    return { data: result, error };
  } catch (err: any) {
    console.warn(`[Supabase ${tableName}]`, err);
    return { error: err.message };
  }
};

export const fetchUserDataFromCloud = async (tableName: string, userId: string) => {
  if (!supabase) return { data: null, error: 'Supabase não configurado' };
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('userId', userId);
    return { data, error };
  } catch (err: any) {
    console.warn(`[Supabase ${tableName}]`, err);
    return { data: null, error: err.message };
  }
};
