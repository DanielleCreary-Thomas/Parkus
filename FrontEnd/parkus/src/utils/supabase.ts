import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';  // Fallback to an empty string or handle error
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key. Please check environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
console.log('Supabase Anon Key:', process.env.REACT_APP_SUPABASE_ANON_KEY);