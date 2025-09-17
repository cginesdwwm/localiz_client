import { NavLink } from "react-router-dom";
import {
  FaHome as FaHouse,
  FaSearch as FaMagnifyingGlass,
  FaPlusCircle as FaCirclePlus,
  FaEnvelope,
  FaUser,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/100 bg-[var(--color-bg)] text-[var(--color-white)] footer-top-shadow mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex justify-between items-center text-center">
          <div className="flex-1 flex justify-center">
            <NavLink
              to="/homepage"
              className="inline-flex flex-col items-center text-white font-quicksand"
              aria-label="Accueil"
            >
              <FaHouse className="text-2xl" />
              <span className="mt-0.5">Accueil</span>
            </NavLink>
          </div>

          <div className="flex-1 flex justify-center">
            <NavLink
              to="/search"
              className="inline-flex flex-col items-center text-white font-quicksand"
              aria-label="Rechercher"
            >
              <FaMagnifyingGlass className="text-2xl" />
              <span className="mt-0.5">Rechercher</span>
            </NavLink>
          </div>

          <div className="flex-1 flex justify-center">
            <NavLink
              to="/publish"
              className="inline-flex flex-col items-center text-white font-quicksand"
              aria-label="Publier"
            >
              <FaCirclePlus className="text-2xl" />
              <span className="mt-0.5">Publier</span>
            </NavLink>
          </div>

          <div className="flex-1 flex justify-center">
            <button
              type="button"
              className="inline-flex flex-col items-center text-white font-quicksand"
              aria-label="Messages"
            >
              <FaEnvelope className="text-2xl" />
              <span className="mt-0.5">Messages</span>
            </button>
          </div>

          <div className="flex-1 flex justify-center">
            <NavLink
              to="/profile/me"
              className="inline-flex flex-col items-center text-white font-quicksand"
              aria-label="Profil"
            >
              <FaUser className="text-2xl" />
              <span className="mt-0.5">Profil</span>
            </NavLink>
          </div>
        </nav>
      </div>
    </footer>
  );
}
