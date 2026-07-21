// Import Supabase
import { createClient } from "@supabase/supabase-js";

// Get connection settings
const configuredSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const normalizedSupabaseUrl = configuredSupabaseUrl?.replace(
  /^(?:https?:)+\/\//,
  "https://",
);
const supabaseUrl = normalizedSupabaseUrl?.match(/^https?:\/\//)
  ? normalizedSupabaseUrl
  : `https://${normalizedSupabaseUrl ?? ""}`;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Check settings
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables.");
}

// Connect to Supabase
export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
