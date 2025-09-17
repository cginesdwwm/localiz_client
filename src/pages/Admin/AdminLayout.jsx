import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      <aside className="w-64 p-6 border-r border-white/5">
        <h3 className="text-xl font-bold text-white mb-3">Admin</h3>
        <div className="flex gap-2 mb-4">
          <NavLink
            to="/admin"
            className="px-3 py-1 rounded bg-white/5 text-white text-sm"
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/"
            className="px-3 py-1 rounded bg-white/5 text-white text-sm"
          >
            Accueil
          </NavLink>
        </div>
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `p-2 rounded ${
                isActive ? "bg-white/5 text-white" : "text-white/80"
              }`
            }
          >
            Tableau de bord
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `p-2 rounded ${
                isActive ? "bg-white/5 text-white" : "text-white/80"
              }`
            }
          >
            Utilisateurs
          </NavLink>
          <NavLink
            to="/admin/deals"
            className={({ isActive }) =>
              `p-2 rounded ${
                isActive ? "bg-white/5 text-white" : "text-white/80"
              }`
            }
          >
            Bons plans
          </NavLink>
          <NavLink
            to="/admin/listings"
            className={({ isActive }) =>
              `p-2 rounded ${
                isActive ? "bg-white/5 text-white" : "text-white/80"
              }`
            }
          >
            Annonces
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 p-6">{children ?? <Outlet />}</main>
    </div>
  );
}
