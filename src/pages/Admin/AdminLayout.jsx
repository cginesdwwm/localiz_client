import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen md:flex">
      <aside className="p-4 border-b md:border-r">
        <nav className="flex gap-4 md:flex-col">
          <NavLink to="/admin">Dashboard</NavLink>
          <NavLink to="/admin/users">Utilisateurs</NavLink>
        </nav>
      </aside>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}

// import { Outlet, NavLink } from "react-router-dom";

// // Ce composant sert de mise en page (layout) pour toutes les routes d'administration.
// // Il inclut une barre de navigation latérale et un espace pour le contenu de la route enfant.
// const AdminLayout = () => {
//   return (
//     <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
//       {/* Sidebar pour la navigation administrative */}
//       <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg p-6">
//         <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
//           Panneau d'administration
//         </h2>
//         <nav>
//           <ul className="space-y-4">
//             <li>
//               <NavLink
//                 to="/admin"
//                 end // S'assure que la classe est active uniquement sur la route exacte
//                 className={({ isActive }) =>
//                   `block px-4 py-2 rounded-lg transition-colors duration-200 ${
//                     isActive
//                       ? "bg-blue-600 text-white shadow-md"
//                       : "hover:bg-gray-200 dark:hover:bg-gray-700"
//                   }`
//                 }
//               >
//                 Tableau de bord
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="users"
//                 className={({ isActive }) =>
//                   `block px-4 py-2 rounded-lg transition-colors duration-200 ${
//                     isActive
//                       ? "bg-blue-600 text-white shadow-md"
//                       : "hover:bg-gray-200 dark:hover:bg-gray-700"
//                   }`
//                 }
//               >
//                 Gestion des utilisateurs
//               </NavLink>
//             </li>
//           </ul>
//         </nav>
//       </aside>

//       {/* Contenu principal de l'administration */}
//       <main className="flex-1 p-8 overflow-auto">
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 h-full">
//           <Outlet /> {/* Affiche le composant de la route enfant (Dashboard ou Users) */}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminLayout;
