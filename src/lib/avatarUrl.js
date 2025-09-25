// Construit une URL publique pour un objet du stockage Supabase.
// Préfère la variable d'environnement Vite si définie, sinon se replie
// sur l'URL connue par le client Supabase (utile si la variable n'est pas présente).
import supabase from "./supabaseClient";

// Convertit un chemin stocké (ex: 'avatars/xxx.jpg') ou une URL complète en URL publique exploitable.
// Ordre de préférence :
// 1. Si la valeur est déjà une URL complète ou une data URI -> renvoyer tel quel.
// 2. Demander au client Supabase `getPublicUrl` (fonctionne même sans VITE_SUPABASE_URL).
// 3. Repli sur VITE_SUPABASE_URL si configuré.
export function avatarUrl(value) {
  if (!value) return "";
  if (/^(https?:|data:)/i.test(value)) return value;

  const path = value.replace(/^\//, "");

  // Essayer d'abord getPublicUrl du client Supabase (helper synchrone)
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

  // Repli : construire depuis la variable d'env Vite
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
