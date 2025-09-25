// Ce fichier exporte un composant Provider et un hook utilitaire (`useAuth`).
// React Fast Refresh peut alerter dans certains environnements quand des valeurs non-composants
// sont exportées depuis un fichier ; on désactive cette seule règle ici via un commentaire.
/* eslint-disable react-refresh/only-export-components */
// On garde l'analyse des hooks active et on inclut des dépendances explicites pour les effets.
/**
 * Fournit l'état d'authentification à l'application : utilisateur connecté, connexion/déconnexion,
 * mise à jour du profil et hydratation depuis le serveur si besoin. Persiste également l'utilisateur
 * dans localStorage et applique le thème utilisateur via le hook useTheme.
 */
import { useContext, useState, useEffect } from "react";
import { createContext } from "react";
import { useLoaderData } from "react-router-dom";
import { signout, signIn, getCurrentUser } from "../api/auth.api";
import { updateMyProfile } from "../api/user.api";
import { notify } from "../utils/notify";
import useTheme from "../hooks/useTheme";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const loaderData = useLoaderData?.() ?? null;
  const initialUser =
    loaderData && loaderData.user ? loaderData.user : loaderData;

  const stored = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.warn("Failed to read stored user", err);
      return null;
    }
  })();

  const [userConnected, setUserConnected] = useState(
    initialUser || stored || null
  );

  // Hook de thème central (gère la classe sur la racine + localStorage)
  const [, setTheme] = useTheme();

  const login = async (values) => {
    try {
      const res = await signIn(values);
      const user = res?.user ?? res;
      setUserConnected(user || null);
      try {
        localStorage.setItem("user", JSON.stringify(user || null));
      } catch (err) {
        console.warn("Failed to persist user", err);
      }
      return user;
    } catch (err) {
      // Pour les erreurs spécifiques, on préfère des messages inline dans le formulaire de connexion.
      const msg = err?.message || "Échec de la connexion";
      const authMsgs = [
        "Nom d'utilisateur ou email invalide",
        "Mot de passe incorrect",
      ];
      if (!authMsgs.includes(msg)) {
        notify.error(msg);
      }
      throw err;
    }
  };

  // Permet à un code externe (ex: OAuth) de définir directement l'utilisateur
  const setUser = (user) => {
    setUserConnected(user || null);
    try {
      localStorage.setItem("user", JSON.stringify(user || null));
    } catch (err) {
      console.warn("Failed to persist user", err);
    }
  };

  const logout = async () => {
    try {
      await signout();
    } catch {
      // ignore
    }
    setUserConnected(null);
    try {
      localStorage.removeItem("user");
    } catch (err) {
      console.warn("Failed to remove stored user", err);
    }
  };

  const updateUser = async (payload) => {
    const res = await updateMyProfile(payload);
    const updated = res?.user ?? null;
    if (updated) {
      setUserConnected(updated);
      try {
        localStorage.setItem("user", JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
    return updated;
  };

  // Essaie de rafraîchir depuis l'API au montage si aucun utilisateur n'est présent
  // Hydrate l'utilisateur depuis le serveur si absent. On inclut des dépendances pour
  // relancer l'effet si des entrées pertinentes changent (sûr et explicite).
  useEffect(() => {
    let mounted = true;
    async function refresh() {
      // Journaux de débogage pour aider à diagnostiquer des déconnexions au rechargement

      if (!userConnected) {
        try {
          const me = await getCurrentUser();
          const serverUser = me?.user ?? me ?? null;
          if (serverUser && mounted) {
            setUserConnected(serverUser);
            try {
              localStorage.setItem("user", JSON.stringify(serverUser));
            } catch (err) {
              console.warn("Failed to persist server user", err);
            }
          }
        } catch (err) {
          console.warn("Failed to refresh user", err);
        }
      }
    }
    refresh();
    return () => {
      mounted = false;
    };
  }, [userConnected, loaderData, stored]);

  // Applique la préférence de thème via le hook centralisé
  useEffect(() => {
    try {
      const theme = userConnected?.theme;
      if (theme === "light" || theme === "dark") {
        setTheme(theme);
      }
    } catch (err) {
      console.warn("Failed to apply user theme", err);
    }
  }, [userConnected, setTheme]);

  return (
    <AuthContext.Provider
      value={{
        user: userConnected,
        isAuthenticated: !!userConnected,
        login,
        setUser,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
