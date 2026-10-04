import { createClient } from '@supabase/supabase-js';
import { getStoredData, STORAGE_KEYS } from './offlineStorage';

const HARDCODED_URL = 'https://lhljhwoupybvcsqgdejs.supabase.co';
const HARDCODED_KEY = 'sb_publishable_XDFEGRz8Dw-T0s2HT2knew_RdvEOdg4';

export const getSupabaseCredentials = () => {
  const savedConfig = getStoredData(STORAGE_KEYS.SUPABASE_CONFIG, null);
  const url = savedConfig?.url || import.meta.env.VITE_SUPABASE_URL || HARDCODED_URL;
  const key = savedConfig?.key || import.meta.env.VITE_SUPABASE_ANON_KEY || HARDCODED_KEY;
  return { url, key };
};

export const initSupabaseClient = () => {
  const { url, key } = getSupabaseCredentials();
  if (url && key) {
    try {
      return createClient(url, key);
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return null;
};

export const supabase = initSupabaseClient();
