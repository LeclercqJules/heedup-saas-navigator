import { createClient } from "@supabase/supabase-js";
import { HEEDUP_SUPABASE_URL, HEEDUP_PUBLISHABLE_KEY } from "./heedupBackend";

export const heedupClient = createClient(HEEDUP_SUPABASE_URL, HEEDUP_PUBLISHABLE_KEY, {
  auth: {
    detectSessionInUrl: false,
    flowType: "pkce",
    persistSession: true,
    autoRefreshToken: true,
  },
});
