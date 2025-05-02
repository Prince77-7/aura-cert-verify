
// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Read the environment variables or use the hardcoded values from integrations/supabase/client.ts
// This ensures we have a fallback if environment variables aren't available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://bubetfgnlzedywxlkoec.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1YmV0ZmdubHplZHl3eGxrb2VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMzAxNDMsImV4cCI6MjA2MTYwNjE0M30.BNqcEX_vNx6jz61JlB-aPaZ_THN5IgIdnFX4qHJFQ1A";

// Check if we have at least the URL (we added fallbacks, so this should always pass now)
if (!supabaseUrl) {
  console.error("CRITICAL ERROR: Supabase URL is not defined. Using fallback values.");
}

// Create and export the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional: Log success on initialization (client-side)
if (import.meta.env.MODE === 'development') { // Log only in development
    console.log('Supabase client initialized successfully in development mode.');
}
