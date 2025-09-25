import { BASE_URL } from "../utils/url";

// Récupère les stats (moyenne, count) pour un utilisateur
export async function fetchUserRatingStats(userId) {
  const res = await fetch(
    `${BASE_URL}/rating/user/${encodeURIComponent(userId)}/stats`
  );
  if (!res.ok) throw new Error("Erreur récupération stats de note");
  return res.json();
}

// Crée ou met à jour la note de l'utilisateur connecté pour un profil donné
export async function rateUser(userId, value) {
  const res = await fetch(
    `${BASE_URL}/rating/user/${encodeURIComponent(userId)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ value }),
    }
  );
  if (!res.ok) throw new Error("Erreur lors de la notation du profil");
  return res.json();
}

// Supprime la note laissée par l'utilisateur connecté pour un profil donné
export async function unrateUser(userId) {
  const res = await fetch(
    `${BASE_URL}/rating/user/${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Erreur suppression de la note");
  return res.json();
}
