// Protège une route pour les utilisateurs connectés uniquement.
// Si non authentifié, redirige vers /login.
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UserConnected({ children }) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/login" />;
}
