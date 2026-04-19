import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: Supabase URL or Anon Key are not set. Please ensure you have VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY defined in your environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
