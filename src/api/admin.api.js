// client/src/api/admin.api.js

import { BASE_URL } from "../utils/url";
import { getToken } from "../utils/auth";

/**
 * Récupère la liste paginée des utilisateurs.
 * {number} page - Le numéro de la page à récupérer.
 * {Promise<object>} La liste des utilisateurs et les métadonnées de pagination.
 */
export async function getUsersList(page = 1) {
  const token = getToken(); // Récupération du token
  if (!token) {
    throw new Error("Authentification requise.");
  }

  const response = await fetch(`${BASE_URL}/admin/users?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Erreur lors de la récupération des utilisateurs."
    );
  }

  return response.json();
}

/**
 * Change le rôle d'un utilisateur (admin/user).
 * {string} userId - L'ID de l'utilisateur à modifier.
 * {string} newRole - Le nouveau rôle ('admin' ou 'user').
 */
export async function toggleUserRole(userId, newRole) {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role: newRole }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Erreur lors de la modification du rôle."
    );
  }
}

/**
 * Supprime un utilisateur.
 * {string} userId - L'ID de l'utilisateur à supprimer.
 */
export async function deleteUser(userId) {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Erreur lors de la suppression de l'utilisateur."
    );
  }
}

/**
 * Récupère les statistiques du tableau de bord.
 * {Promise<object>} Les statistiques de l'API.
 */
export async function getAdminStats() {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Erreur lors de la récupération des statistiques."
    );
  }

  return response.json();
}
