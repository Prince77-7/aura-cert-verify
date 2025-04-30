// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Read the environment variables using Vite's import.meta.env
// Variables must be prefixed with VITE_ in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the variables were loaded correctly
if (!supabaseUrl) {
  console.error("CRITICAL ERROR: VITE_SUPABASE_URL is not defined. Check your .env.local file (ensure prefix is VITE_) and restart the dev server.");
  throw new Error("Missing Supabase URL configuration.");
}

if (!supabaseAnonKey) {
  console.error("CRITICAL ERROR: VITE_SUPABASE_ANON_KEY is not defined. Check your .env.local file (ensure prefix is VITE_) and restart the dev server.");
  throw new Error("Missing Supabase Anon Key configuration.");
}

// Create and export the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional: Log success on initialization (client-side)
if (import.meta.env.MODE === 'development') { // Log only in development
    console.log('Supabase client initialized successfully in development mode.');
}
