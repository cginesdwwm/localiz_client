/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState, useEffect } from "react";
import { createContext } from "react";
import { useLoaderData } from "react-router-dom";
import { signout, signIn, getCurrentUser } from "../api/auth.api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // useLoaderData retourne potentiellement { user } ou l'utilisateur lui-même
  const loaderData = useLoaderData?.() ?? null;
  const initialUser =
    loaderData && loaderData.user ? loaderData.user : loaderData;

  // hydrate from loader, fallback to localStorage snapshot to avoid flicker on reload
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

  const login = async (values) => {
    const res = await signIn(values);
    const user = res?.user ?? res;
    setUserConnected(user || null);
    try {
      localStorage.setItem("user", JSON.stringify(user || null));
    } catch (err) {
      console.warn("Failed to persist user", err);
    }
    return user;
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
  }, []);

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

// import { createContext, useContext, useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import jwtDecode from "jwt-decode";
// import { login as apiLogin, getCurrentUser } from "../api/auth.api";
// import UserConnected from "../components/ProtectedRoutes/UserConnected";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Vérifie l'état de l'authentification au chargement initial
//   useEffect(() => {
//     let mounted = true;

//     async function initAuth() {
//       const token = localStorage.getItem("token");

//       // Si un token JWT est présent et a la forme attendue, on le décode
//       if (token && typeof token === "string" && token.split(".").length === 3) {
//         try {
//           const decodedUser = jwtDecode(token);
//           if (mounted) setUser(decodedUser);
//         } catch (error) {
//           console.error("Token invalide ou expiré:", error);
//           localStorage.removeItem("token");
//           toast.error("Votre session a expiré. Veuillez vous reconnecter.");
//         }
//       } else {
//         // Pas de token JWT valide : essayer de récupérer l'utilisateur via cookie (API)
//         try {
//           const me = await getCurrentUser();
//           // getCurrentUser retourne { user } ou null
//           const currentUser = me && me.user ? me.user : me;
//           if (currentUser && mounted) setUser(currentUser);
//         } catch (err) {
//           console.error(
//             "Erreur lors de la récupération de l'utilisateur via cookie:",
//             err
//           );
//         }
//       }

//       if (mounted) setLoading(false);
//     }

//     initAuth();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   const login = async (credentials) => {
//     setLoading(true);
//     try {
//       const response = await apiLogin(credentials);

//       const userFromApi = response?.user ?? response;
//       const token = response?.token;

//       // Si l'API renvoie un token JWT valide, on le stocke; sinon on le supprime
//       if (token && typeof token === "string" && token.split(".").length === 3) {
//         localStorage.setItem("token", token);
//       } else {
//         localStorage.removeItem("token");
//       }

//       setUser(userFromApi);

//       toast.success("Connexion réussie !");
//       return userFromApi; // Permet de chaîner des actions après la connexion
//     } catch (error) {
//       toast.error(error.message);
//       throw error; // Propager l'erreur pour la gestion du formulaire
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     toast("Déconnexion réussie.", { icon: "👋" });
//   };

//   const value = {
//     user,
//     UserConnected: !!user,
//     loading,
//     login,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error(
//       "useAuth doit être utilisé à l'intérieur d'un AuthProvider."
//     );
//   }
//   return context;
// }
