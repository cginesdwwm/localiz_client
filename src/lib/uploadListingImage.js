import supabase from "./supabaseClient";

// Uploader une image dans le bucket "listings" et retourne l'URL publique
export async function uploadListingImage(file) {
  if (!file) return null;
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}_${Math.random()
    .toString(36)
    .slice(2)}.${fileExt}`;
  const filePath = `listings/${fileName}`;

  const { data: _data, error } = await supabase.storage
    .from("listings")
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (error) {
    console.error("Supabase upload error", error);
    throw error;
  }

  const { publicURL, error: urlError } = supabase.storage
    .from("listings")
    .getPublicUrl(filePath);
  if (urlError) {
    console.error("Supabase getPublicUrl error", urlError);
    throw urlError;
  }

  return publicURL;
}
