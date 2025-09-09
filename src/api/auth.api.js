// const BASE_URL = import.meta.env.VITE_SERVER_URL;

// /**
//  * Inscription d’un nouvel utilisateur
//  */
// export async function signUp(values) {
//   try {
//     const response = await fetch(`${BASE_URL}/user/register`, {
//       method: "POST",
//       body: JSON.stringify(values),
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || "Erreur à l'inscription");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Erreur signUp:", error);
//     throw error;
//   }
// }

// /**
//  * Connexion utilisateur
//  * - Le backend renvoie un cookie HttpOnly qui contient le token
//  * - On récupère en plus les infos utilisateur (user)
//  */
// export async function login(values) {
//   try {
//     const response = await fetch(`${BASE_URL}/user/login`, {
//       method: "POST",
//       body: JSON.stringify(values),
//       headers: { "Content-Type": "application/json" },
//       credentials: "include", // 👈 indispensable pour recevoir le cookie
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || "Erreur à la connexion");
//     }

//     // ⚠️ Inutile de stocker un token → seul `user` est intéressant
//     const data = await response.json();
//     return data; // { user }
//   } catch (error) {
//     console.error("Erreur login:", error);
//     throw error;
//   }
// }

// /**
//  * Déconnexion utilisateur
//  * - Supprime le cookie côté serveur
//  */
// export async function signout() {
//   await fetch(`${BASE_URL}user/deleteToken`, {
//     method: "DELETE",
//     credentials: "include",
//   });
// }

// /**
//  * Récupération de l’utilisateur courant
//  * - Vérifie si un cookie valide est présent
//  * - Renvoie `null` si non connecté
//  */
// export async function getCurrentUser() {
//   try {
//     const response = await fetch(`${BASE_URL}/user/me`, {
//       method: "GET",
//       credentials: "include",
//     });

//     if (!response.ok) return null;

//     return await response.json(); // { user }
//   } catch (error) {
//     console.error("Erreur getCurrentUser:", error);
//     return null;
//   }
// }

/**
 * auth.api.js
 *
 * Rôle : centraliser toutes les requêtes liées à l’authentification.
 * - Inscription
 * - Connexion (login)
 * - Déconnexion (logout)
 * - Récupération de l’utilisateur connecté
 */

// import { BASE_URL } from "../utils/url";

// Handling robuste de BASE_URL : suppression du slash à la fin, retour à une URL relative en développement
const RAW_BASE = import.meta.env.VITE_SERVER_URL || "";
const BASE_URL = RAW_BASE.replace(/\/+$/, "");

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
