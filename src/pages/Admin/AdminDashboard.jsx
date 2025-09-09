import { useEffect, useState } from "react";
import { notify } from "../../utils/notify";
import { getAdminStats } from "../../api/admin.api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const adminStats = await getAdminStats(); // Utilisation de la fonction API
        setStats(adminStats);
      } catch (error) {
        notify.error(error.message);
      }
    }
    loadStats();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Dashboard Admin</h1>
      {stats ? (
        <div>Utilisateurs inscrits : {stats.users}</div>
      ) : (
        <div>Chargement…</div>
      )}
    </div>
  );
}

// import React from 'react';

// // Ce composant représente le tableau de bord principal de l'administration.
// // Il fournit un aperçu rapide des statistiques ou des informations clés du site.
// const AdminDashboard = () => {
//   return (
//     <div>
//       <h1 className="text-4xl font-extrabold mb-6 text-gray-800 dark:text-gray-200">
//         Tableau de bord
//       </h1>
//       <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
//         Bienvenue sur le panneau d'administration. Voici un aperçu des activités récentes.
//       </p>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {/* Exemple de carte de statistiques */}
//         <div className="bg-blue-100 dark:bg-blue-900 rounded-xl shadow-md p-6">
//           <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
//             Utilisateurs inscrits
//           </h3>
//           <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">1,234</p>
//         </div>

//         {/* Exemple de carte de statistiques */}
//         <div className="bg-green-100 dark:bg-green-900 rounded-xl shadow-md p-6">
//           <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
//             Annonces publiées
//           </h3>
//           <p className="text-4xl font-bold text-green-600 dark:text-green-400">5,678</p>
//         </div>

//         {/* Exemple de carte de statistiques */}
//         <div className="bg-yellow-100 dark:bg-yellow-900 rounded-xl shadow-md p-6">
//           <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
//             Signalements en attente
//           </h3>
//           <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">42</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
