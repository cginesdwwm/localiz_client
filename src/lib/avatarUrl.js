// Build public URL for a Supabase storage object.
// Prefer the configured Vite env var, but fall back to the Supabase client
// URL (so the helper works whether env var is present or not).
import supabase from "./supabaseClient";

// Convert a stored path (e.g. 'avatars/xxx.jpg') or full URL into a usable public URL.
// Preference order:
// 1. If value is already a full URL or data URI -> return as-is.
// 2. Ask the Supabase client for `getPublicUrl` (works even when VITE_SUPABASE_URL isn't set).
// 3. Fallback to VITE_SUPABASE_URL if configured.
export function avatarUrl(value) {
  if (!value) return "";
  if (/^(https?:|data:)/i.test(value)) return value;

  const path = value.replace(/^\//, "");

  // Try Supabase client's getPublicUrl first (synchronous helper)
  try {
    const publicRes = supabase.storage.from("avatars").getPublicUrl(path);
    if (publicRes && typeof publicRes === "object") {
      if (publicRes.publicURL) return publicRes.publicURL;
      if (publicRes.data && publicRes.data.publicUrl)
        return publicRes.data.publicUrl;
      if (publicRes.data && publicRes.data.publicURL)
        return publicRes.data.publicURL;
    }
  } catch (e) {
    void e;
  }

  // Fallback: construct from Vite env var
  try {
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
    if (SUPABASE_URL) {
      return `${SUPABASE_URL.replace(
        /\/$/,
        ""
      )}/storage/v1/object/public/${path}`;
    }
  } catch (e) {
    void e;
  }

  return "";
}
