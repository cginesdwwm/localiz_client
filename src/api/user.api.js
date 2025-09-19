import { BASE_URL } from "../utils/url";

/**
 * Récupère les informations du profil de l'utilisateur.
 * returns {Promise<object>} : Le profil utilisateur.
 */
export async function getMyProfile() {
  const url = `${BASE_URL}/user/me`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Erreur lors de la récupération du profil."
    );
  }

  return response.json();
}

/**
 * Supprime le compte de l'utilisateur.
 * returns {Promise<object>} : Message de succès.
 */
export async function deleteMyAccount() {
  const response = await fetch(`${BASE_URL}/user/me`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Erreur lors de la suppression du compte."
    );
  }

  return response.json();
}

/**
 * Demande de suppression du compte (transmet une raison et détails).
 * Le serveur peut enregistrer la demande et déclencher la suppression
 * différée (30 jours) ou effectuer la suppression immédiate selon l'implémentation.
 */
export async function requestAccountDeletion(payload) {
  const response = await fetch(`${BASE_URL}/user/me/delete-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Erreur lors de la demande de suppression."
    );
  }

  return response.json();
}

/**
 * Change le mot de passe de l'utilisateur.
 * object passwords : Mots de passe actuel et nouveau.
 * returns {Promise<object>} : Message de succès.
 */
export async function changeMyPassword(passwords) {
  const response = await fetch(`${BASE_URL}/user/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(passwords),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Erreur lors du changement de mot de passe."
    );
  }

  return response.json();
}

/**
 * Met à jour le profil de l'utilisateur connecté.
 * payload: objet avec les champs à mettre à jour, ex: { bio: '...' }
 */
export async function updateMyProfile(payload) {
  const url = `${BASE_URL}/users/me`;
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Erreur lors de la mise à jour du profil."
    );
  }

  return response.json();
}

/**
 * Sauvegarde la préférence de thème de l'utilisateur (nécessite un cookie d'authentification)
 * { theme: 'dark' | 'light' }
 */
export async function saveMyTheme(theme) {
  const response = await fetch(`${BASE_URL}/users/me/theme`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ theme }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Erreur lors de la sauvegarde du thème."
    );
  }

  return response.json();
}

/**
 * Sauvegarde les préférences de cookies de l'utilisateur (requiert cookie d'authentification)
 * payload example: { measurement: true, personalization: false, marketing: true }
 */
export async function saveMyCookiePrefs(payload) {
  const response = await fetch(`${BASE_URL}/users/me/cookies`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        "Erreur lors de la sauvegarde des préférences de cookies."
    );
  }

  return response.json();
}
