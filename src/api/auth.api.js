/**
 * Rôle : centraliser toutes les requêtes liées à l’authentification.
 * - Inscription
 * - Connexion (login)
 * - Déconnexion (logout)
 * - Récupération de l’utilisateur connecté
 */

import { BASE_URL } from "../utils/url";

const buildUrl = (path) =>
  `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`;

export async function signUp(values) {
  try {
    // backend exposes POST /user/register
    const response = await fetch(buildUrl("/user/register"), {
      method: "POST",
      body: JSON.stringify(values),
      headers: { "Content-type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Erreur signUp");
    }
    return await response.json();
  } catch (error) {
    console.error("signUp error:", error);
    throw error;
  }
}

export async function signIn(values) {
  try {
    const response = await fetch(buildUrl("/user/login"), {
      method: "POST",
      body: JSON.stringify(values),
      headers: { "Content-type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Erreur signIn");
    }
    return await response.json();
  } catch (error) {
    console.error("signIn error:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const response = await fetch(buildUrl("/user/me"), {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}

export async function signout() {
  try {
    await fetch(buildUrl("/user/logout"), {
      method: "POST",
      credentials: "include",
    });
    try {
      sessionStorage.removeItem("register_expiresAt");
    } catch {
      void 0;
    }
  } catch (error) {
    console.error("signout error:", error);
  }
}

export async function requestPasswordReset({ email }) {
  try {
    const response = await fetch(buildUrl("/user/forgot-password"), {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-type": "application/json" },
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Erreur envoi email de réinitialisation");
    }
    return await response.json();
  } catch (error) {
    console.error("requestPasswordReset error:", error);
    throw error;
  }
}
