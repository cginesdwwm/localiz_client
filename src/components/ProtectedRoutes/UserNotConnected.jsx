import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UserNotConnected({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return children;

  // Si l'utilisateur authentifié est un admin => redirigé vers le tableau de bord admin.
  if (user && user.role === "admin") return <Navigate to="/admin" replace />;

  // Sinon => envoi des utilisateurs authentifiés réguliers vers la page d'accueil.
  return <Navigate to="/homepage" replace />;
}
