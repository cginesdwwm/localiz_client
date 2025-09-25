import { BASE_URL } from "../utils/url";

// Récupère les catégories publiques utilisables côté client (sans admin)
export async function getPublicCategories() {
  const response = await fetch(`${BASE_URL}/utils/categories`, {
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Erreur lors du chargement des catégories.");
  }
  return response.json();
}
