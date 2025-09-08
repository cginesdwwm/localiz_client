// import { useContext, useState } from "react";
// import { createContext } from "react";
// import { useLoaderData } from "react-router-dom";
// import { signout } from "../api/auth.api";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const initialUser = useLoaderData();
//   const [userConnected, setUserConnected] = useState(initialUser);

//   console.log(userConnected);
//   const login = async (values) => {
//     setUserConnected(values);
//   };

//   const logout = async () => {
//     await signout();
//     setUserConnected(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         userConnected,
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }

import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { login as apiLogin } from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifie l'état de l'authentification au chargement initial
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        console.error("Token invalide ou expiré:", error);
        localStorage.removeItem("token");
        toast.error("Votre session a expiré. Veuillez vous reconnecter.");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { user: userFromApi, token } = await apiLogin(credentials);

      localStorage.setItem("token", token);
      setUser(userFromApi);

      toast.success("Connexion réussie !");
      return userFromApi; // Permet de chaîner des actions après la connexion
    } catch (error) {
      toast.error(error.message);
      throw error; // Propager l'erreur pour la gestion du formulaire
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast("Déconnexion réussie.", { icon: "👋" });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider."
    );
  }
  return context;
}
