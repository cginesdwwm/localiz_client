// Route protégée réservée aux administrateurs.
// - Redirige vers /login si non connecté
// - Redirige vers /homepage si connecté mais pas admin
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/homepage" replace />;
  return <Outlet />;
}
