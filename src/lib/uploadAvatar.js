import supabase from "./supabaseClient";

// Uploader une image dans le bucket "avatars" et retourne l'URL publique
export async function uploadAvatar(file) {
  if (!file) return null;
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}_${Math.random()
    .toString(36)
    .slice(2)}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { data: _data, error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (error) {
    console.error("Supabase upload error", error);
    throw error;
  }

  const publicRes = supabase.storage.from("avatars").getPublicUrl(filePath);
  // supabase-js v2 peut renvoyer { data: { publicUrl } } tandis que d'autres versions utilisent { publicURL }
  let publicURL = null;
  try {
    if (publicRes && typeof publicRes === "object") {
      if (publicRes.publicURL) publicURL = publicRes.publicURL;
      else if (publicRes.data && publicRes.data.publicUrl)
        publicURL = publicRes.data.publicUrl;
      else if (publicRes.data && publicRes.data.publicURL)
        publicURL = publicRes.data.publicURL;
    }
  } catch (e) {
    void e;
  }

  if (!publicURL) {
    console.warn(
      "uploadAvatar: could not determine public URL from Supabase response",
      { publicRes, filePath }
    );
    // As a last resort try to construct a URL using the SUPABASE_URL and known storage path
    try {
      const projectUrl =
        supabase?.url || import.meta?.env?.VITE_SUPABASE_URL || "";
      if (projectUrl) {
        publicURL = `${projectUrl.replace(
          /\/$/,
          ""
        )}/storage/v1/object/public/${filePath}`;
      }
    } catch (e) {
      void e;
    }
  }

  return { path: filePath, publicURL: publicURL || null };
}
