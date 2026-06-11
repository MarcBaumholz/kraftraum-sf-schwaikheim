import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseSettings {
  url: string;
  key: string;
}

export function createOptionalSupabaseClient(
  settings: SupabaseSettings
): SupabaseClient | null {
  if (!settings.url.trim() || !settings.key.trim()) {
    return null;
  }

  return createClient(settings.url, settings.key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false
    }
  });
}
