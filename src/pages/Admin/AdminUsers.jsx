import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getUsersList, toggleUserRole, deleteUser } from "../../api/admin.api";

export default function AdminUsers() {
  const [data, setData] = useState({ items: [], page: 1, total: 0 });
  const [loading, setLoading] = useState(false);

  // Fonction pour charger la liste des utilisateurs
  const loadUsers = async (page = 1) => {
    setLoading(true);
    try {
      const usersData = await getUsersList(page); // Utilisation de la fonction API
      setData(usersData);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleRole = async (id, currentRole) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin";
      await toggleUserRole(id, newRole); // Utilisation de la fonction API
      toast.success(`Rôle de l'utilisateur ${id} mis à jour.`);
      loadUsers(data.page); // Recharge la liste après la modification
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id); // Utilisation de la fonction API
      toast.success(`Utilisateur ${id} supprimé.`);
      loadUsers(data.page); // Recharge la liste
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestion des utilisateurs</h1>
      {data.items.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.items.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">{user._id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleRole(user._id, user.role)}
                    className="mr-2 text-blue-600 hover:text-blue-900"
                  >
                    {user.role === "admin" ? "Rétrograder" : "Promouvoir"}
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>Aucun utilisateur trouvé.</div>
      )}
    </div>
  );
}

// import React from 'react';

// // Ce composant est responsable de l'affichage et de la gestion des utilisateurs.
// // Il pourrait inclure des fonctionnalités comme la recherche, le bannissement, ou la modification des rôles.
// const AdminUsers = () => {
//   const users = [
//     { id: 1, name: "Alice Dupont", email: "alice@example.com", role: "user" },
//     { id: 2, name: "Bob Martin", email: "bob@example.com", role: "user" },
//     { id: 3, name: "Charlie Leblanc", email: "charlie@example.com", role: "admin" },
//   ];

//   return (
//     <div>
//       <h1 className="text-4xl font-extrabold mb-6 text-gray-800 dark:text-gray-200">
//         Gestion des utilisateurs
//       </h1>
//       <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
//         Liste des utilisateurs enregistrés et leurs informations.
//       </p>

//       <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
//         <table className="min-w-full text-left text-sm whitespace-nowrap">
//           <thead className="uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
//             <tr>
//               <th scope="col" className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">ID</th>
//               <th scope="col" className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Nom</th>
//               <th scope="col" className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Email</th>
//               <th scope="col" className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Rôle</th>
//               <th scope="col" className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//             {users.map((user) => (
//               <tr key={user.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
//                 <td className="px-6 py-4">{user.id}</td>
//                 <td className="px-6 py-4">{user.name}</td>
//                 <td className="px-6 py-4">{user.email}</td>
//                 <td className="px-6 py-4">
//                   <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
//                     user.role === 'admin' ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
//                   }`}>
//                     {user.role}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 space-x-2">
//                   <button className="text-blue-600 dark:text-blue-400 hover:underline">
//                     Modifier
//                   </button>
//                   <button className="text-red-600 dark:text-red-400 hover:underline">
//                     Bannir
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminUsers;
