import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  useLocation();

  // Header visibility is controlled by the App-level whitelist (showHeaderFor).
  // Avoid per-component route hiding here to keep the behavior centralized.

  return (
    <header className="w-full h-16 site-header">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <NavLink to="/homepage" className="inline-flex items-center">
          <span className="title text-3xl">LOCALIZ</span>
        </NavLink>

        {/* Main navigation */}
        <nav className="flex items-center space-x-8">
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
