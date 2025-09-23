import { BASE_URL } from "../utils/url";

export async function fetchListings() {
  const res = await fetch(`${BASE_URL}/listings`);
  if (!res.ok) throw new Error("Erreur lors de la récupération des listings");
  return res.json();
}

export async function fetchListing(id) {
  const res = await fetch(`${BASE_URL}/listings/${id}`);
  if (!res.ok) throw new Error("Annonce introuvable");
  return res.json();
}

export async function createListing(payload) {
  const res = await fetch(`${BASE_URL}/listings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const error = new Error(err.message || "Erreur création listing");
    error.payload = err;
    throw error;
  }
  return res.json();
}

export async function deleteListing(id) {
  const res = await fetch(`${BASE_URL}/listings/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur suppression listing");
  return res.json();
}
