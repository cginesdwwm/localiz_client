// client/src/api/admin.api.js

import { BASE_URL } from "../utils/url";

export async function getUsersList(page = 1) {
  const response = await fetch(`${BASE_URL}/admin/users?page=${page}`, {
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
