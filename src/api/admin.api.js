// client/src/api/admin.api.js

import { BASE_URL } from "../utils/url";

export async function getUsersList({
  page = 1,
  q = "",
  sort = "",
  dir = "",
  limit = 20,
} = {}) {
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
    throw new Error(err.message || "Admin health check failed");
  }
  return response.json();
}

export async function getAdminOverview() {
  const response = await fetch(`${BASE_URL}/admin/overview`, {
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to load admin overview");
  }
  return response.json();
}

export async function getAdminRecent() {
  const response = await fetch(`${BASE_URL}/admin/recent`, {
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to load recent activity");
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
