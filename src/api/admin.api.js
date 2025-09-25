// API d'administration: endpoints de gestion des utilisateurs, deals, listings et catégories.

import { BASE_URL } from "../utils/url";

export async function getUsersList({
  page = 1,
  q = "",
  sort = "",
  dir = "",
  limit = 20,
} = {}) {
  // Construire les paramètres de requête pour la pagination/tri/filtre
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (q) params.set("q", q);
  if (sort) params.set("sort", sort);
  if (dir) params.set("dir", dir);

  const response = await fetch(`${BASE_URL}/admin/users?${params.toString()}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Erreur lors de la récupération des utilisateurs."
    );
  }

  return response.json();
}

export async function toggleUserRole(userId, newRole) {
  // Bascule le rôle d'un utilisateur (ex: user <-> admin)
  const response = await fetch(`${BASE_URL}/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ role: newRole }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Erreur lors de la modification du rôle."
    );
  }
}

export async function deleteUser(userId) {
  // Supprime définitivement un utilisateur
  const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Erreur lors de la suppression de l'utilisateur."
    );
  }
}

export async function getAdminStats() {
  // Récupère des statistiques d'administration (compteurs, tendances, etc.)
  const response = await fetch(`${BASE_URL}/admin/stats`, {
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err.message || "Erreur lors de la récupération des statistiques."
    );
  }
  return response.json();
}

export async function getAdminHealth() {
  const response = await fetch(`${BASE_URL}/admin/health`, {
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    // Vérification d'état de l'admin échouée
    throw new Error(
      err.message || "La vérification d'état de l'admin a échoué"
    );
  }
  return response.json();
}

export async function getAdminOverview() {
  const response = await fetch(`${BASE_URL}/admin/overview`, {
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    // Échec du chargement de la vue d'ensemble admin
    throw new Error(
      err.message || "Échec du chargement de la vue d'ensemble admin"
    );
  }
  return response.json();
}

export async function getAdminRecent() {
  const response = await fetch(`${BASE_URL}/admin/recent`, {
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    // Échec du chargement des activités récentes
    throw new Error(
      err.message || "Échec du chargement des activités récentes"
    );
  }
  return response.json();
}

export async function getDealsList({
  page = 1,
  q = "",
  sort = "",
  dir = "",
  limit = 50,
} = {}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (q) params.set("q", q);
  if (sort) params.set("sort", sort);
  if (dir) params.set("dir", dir);

  const response = await fetch(`${BASE_URL}/admin/deals?${params.toString()}`, {
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Erreur lors de la récupération des deals.");
  }
  return response.json();
}

export async function deleteDeal(dealId) {
  const response = await fetch(`${BASE_URL}/admin/deals/${dealId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Erreur lors de la suppression du deal.");
  }
}

export async function getListingsList({
  page = 1,
  q = "",
  sort = "",
  dir = "",
  limit = 50,
} = {}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (q) params.set("q", q);
  if (sort) params.set("sort", sort);
  if (dir) params.set("dir", dir);

  const response = await fetch(
    `${BASE_URL}/admin/listings?${params.toString()}`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err.message || "Erreur lors de la récupération des listings."
    );
  }
  return response.json();
}

export async function deleteListing(listingId) {
  const response = await fetch(`${BASE_URL}/admin/listings/${listingId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err.message || "Erreur lors de la suppression de l'annonce."
    );
  }
}

// --- Categories ---
export async function getCategories() {
  const response = await fetch(`${BASE_URL}/admin/categories`, {
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Erreur lors du chargement des catégories.");
  }
  return response.json();
}

export async function createCategory({ type, name, active = true }) {
  const response = await fetch(`${BASE_URL}/admin/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ type, name, active }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err.message || "Erreur lors de la création de la catégorie."
    );
  }
  return response.json();
}

export async function updateCategory(id, { name, active }) {
  const response = await fetch(`${BASE_URL}/admin/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, active }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err.message || "Erreur lors de la mise à jour de la catégorie."
    );
  }
  return response.json();
}

export async function deleteCategory(id) {
  const response = await fetch(`${BASE_URL}/admin/categories/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err.message || "Erreur lors de la suppression de la catégorie."
    );
  }
}

export async function moveCategory(id, direction) {
  const response = await fetch(`${BASE_URL}/admin/categories/${id}/move`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ direction }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Erreur lors du réordonnancement.");
  }
  return response.json();
}
