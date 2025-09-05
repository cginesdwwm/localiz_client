import { BASE_URL } from "../utils/url";

/**
 * Récupère les informations du profil de l'utilisateur.
 * returns {Promise<object>} : Le profil utilisateur.
 */
export async function getMyProfile() {
  const response = await fetch(`${BASE_URL}/user/me`);

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
