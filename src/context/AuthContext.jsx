// The file exports a provider component and a helper hook (`useAuth`).
// React Fast Refresh can warn in some dev setups when non-component values
// are exported from a file; disable that single rule here with a comment.
/* eslint-disable react-refresh/only-export-components */
// Keep hooks linting active and include explicit dependencies for effects.
import { useContext, useState, useEffect } from "react";
import { createContext } from "react";
import { useLoaderData } from "react-router-dom";
import { signout, signIn, getCurrentUser } from "../api/auth.api";
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

  // central theme hook (manages root class + localStorage)
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

  // Try to refresh from API on mount if we don't have a user yet
  // Hydrate user from server if not present. We include dependencies so
  // the effect re-runs if the relevant inputs change (safe and explicit).
  useEffect(() => {
    let mounted = true;
    async function refresh() {
      // Debug logs to help diagnose reload logout issues
      console.debug("AuthContext.refresh start", {
        loaderData: loaderData ?? null,
        stored: stored ?? null,
        userConnected: userConnected ?? null,
      });

      if (!userConnected) {
        try {
          const me = await getCurrentUser();
          console.debug("AuthContext.getCurrentUser response", { me });
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
