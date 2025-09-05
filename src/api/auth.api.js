// gérer tout ce qui est authentification mais que pour les requêtes http

import { BASE_URL } from "../utils/url";
import { setAuthToken } from "../utils/auth";

// Inscription
export async function signUp(values) {
  try {
    const response = await fetch(`${BASE_URL}/user/register`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Si le backend renvoie une erreur (ex: 400, 500), on lève une exception
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur à l'inscription");
    }

    const newUserMessage = await response.json();
    return newUserMessage; // Renvoie le message de succès du backend
  } catch (error) {
    console.error("Erreur signUp:", error);
    throw error; // Propage l'erreur pour que le composant puisse la gérer
  }
}

// Connexion
export async function login(values) {
  try {
    const response = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur à la connexion");
    }

    const data = await response.json();

    // Après une connexion réussie, on stocke le token et l'utilisateur
    if (data.token && data.user) {
      setAuthToken(data.token, data.user);
    }

    return data;
  } catch (error) {
    console.error("Erreur login:", error);
    throw error;
  }
}
