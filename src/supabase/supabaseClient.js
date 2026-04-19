import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: Supabase URL or Anon Key are not set. Please ensure you have NEXT_PUBLIC_SUPABASE_URL/ANON_KEY, REACT_APP_SUPABASE_URL/ANON_KEY, or VITE_SUPABASE_URL/ANON_KEY defined in your environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
