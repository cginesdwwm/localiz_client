// Protège une route pour les utilisateurs non connectés.
// - Si non authentifié => affiche les enfants (accès autorisé)
// - Si admin => redirection vers /admin
// - Sinon (utilisateur connecté standard) => redirection vers /homepage
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UserNotConnected({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return children;

  // Si l'utilisateur authentifié est un admin => redirige vers le tableau de bord admin.
  if (user && user.role === "admin") return <Navigate to="/admin" replace />;

  // Sinon => envoi des utilisateurs authentifiés réguliers vers la page d'accueil.
  return <Navigate to="/homepage" replace />;
}
