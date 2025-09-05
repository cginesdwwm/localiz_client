/**
 * Enregistre le token JWT et l'utilisateur dans le stockage local.
 */
export const setAuthToken = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

/**
 * Récupère le token JWT depuis le stockage local.
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Récupère les informations de l'utilisateur depuis le stockage local.
 */
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

/**
 * Supprime le token et les informations de l'utilisateur du stockage local.
 */
export const clearAuthToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
