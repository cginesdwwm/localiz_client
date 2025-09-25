import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.webp";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  useLocation();

  // La visibilité du Header est pilotée au niveau de l'application (showHeaderFor).
  // Évite de masquer/afficher par composant pour garder un comportement centralisé.

  return (
    <header className="w-full h-16 site-header">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <NavLink
          to="/homepage"
          className="inline-flex items-center"
          aria-label="Aller à l'accueil"
        >
          <img
            src={logo}
            alt="Localiz"
            className="h-20 w-auto"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://pjrrvzxomdowrraykone.supabase.co/storage/v1/object/public/public-assets/logo.webp";
            }}
          />
        </NavLink>

        {/* Navigation principale */}
        <nav
          className="flex items-center space-x-8"
          role="navigation"
          aria-label="Barre de navigation"
        >
          {isAuthenticated ? (
            <>
              <NavLink
                to="/homepage"
                className="text-[18px] font-quicksand font-bold text-white header-link"
              >
                Accueil
              </NavLink>
              {user?.role === "admin" && (
                <NavLink
                  to="/admin"
                  className="text-[18px] font-quicksand font-bold text-red-300 header-link"
                >
                  Admin
                </NavLink>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
                className="text-[18px] font-quicksand font-bold header-logout"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-[18px] font-quicksand font-bold text-white header-link"
              >
                Connexion
              </NavLink>
              <NavLink
                to="/register"
                className="text-[18px] font-quicksand font-bold text-white header-link"
              >
                Inscription
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
