// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Make sure SUPABASE_SERVICE_ROLE_KEY is the service role key
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
