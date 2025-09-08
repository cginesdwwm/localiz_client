/*
  Header.jsx
  - Composant d'en-tête (navigation) affiché sur toutes les pages.
  - NavLink (react-router) est utilisé pour créer des liens qui savent
    si la route est active (utile pour styliser la route courante).
*/

import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Header() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="bg-white shadow-md p-4 flex flex-row justify-between items-center">
      {/* Logo / titre cliquable qui renvoie à la page d'accueil */}
      <NavLink to="/homepage">
        <span className="text-xl font-bold text-blue-500">LOCALIZ</span>
      </NavLink>

      {/* Message centré */}
      {isAuthenticated && user?.firstName ? (
        <div className="flex-1 text-center text-gray-700 font-medium">
          Bonjour, {user.firstName}
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* Navigation principale */}
      <nav className="flex space-x-6">
        {isAuthenticated ? (
          <>
            <NavLink
              to="/homepage"
              className="text-gray-600 hover:text-black font-semibold"
            >
              Accueil
            </NavLink>
            <NavLink
              to="/"
              className="text-gray-600 hover:text-red-700 font-semibold"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              Déconnexion
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className="text-gray-600 hover:text-black font-semibold"
            >
              Connexion
            </NavLink>
            <NavLink
              to="/register"
              className="text-gray-600 hover:text-black font-semibold"
            >
              Inscription
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
