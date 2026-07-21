// Import Supabase
import { createClient } from "@supabase/supabase-js";

// Get connection settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://example.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "demo-key";

// Connect to Supabase using fallback values so the app can render locally
export const supabase = createClient(supabaseUrl, supabaseKey);