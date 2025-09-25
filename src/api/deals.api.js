import { BASE_URL } from "../utils/url";

// Liste tous les bons plans (deals)
export async function fetchDeals() {
  const res = await fetch(`${BASE_URL}/deals`);
  if (!res.ok) throw new Error("Erreur lors de la récupération des deals");
  return res.json();
}

// Récupère un deal spécifique par son identifiant
export async function fetchDeal(id) {
  const res = await fetch(`${BASE_URL}/deals/${id}`);
  if (!res.ok) throw new Error("Deal introuvable");
  return res.json();
}

// Crée un nouveau deal
export async function createDeal(payload) {
  const res = await fetch(`${BASE_URL}/deals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    // Retourne une erreur contenant le payload afin que l'appelant inspecte les erreurs de validation
    const error = new Error(err.message || "Erreur création deal");
    error.payload = err;
    throw error;
  }

  return res.json();
}

// Met à jour un deal existant
export async function updateDeal(id, payload) {
  const res = await fetch(`${BASE_URL}/deals/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Erreur update deal");
  return res.json();
}

// Supprime un deal
export async function deleteDeal(id) {
  const res = await fetch(`${BASE_URL}/deals/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur suppression deal");
  return res.json();
}
