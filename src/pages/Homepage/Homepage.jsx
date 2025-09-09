// PAGE D'ACCUEIL

// import { useState } from "react";
// import { useBlog } from "../../context/BlogContext";
// import { useAuth } from "../../context/AuthContext";
// // import AddBlogModal from "../Blog/AddBlogModal";
// // import BlogCard from "../Blog/BlogCard";

// export default function Blog() {
//   const { blogs } = useBlog();
//   const { userConnected } = useAuth();
//   const [isOpen, setIsOpen] = useState(false);

//   console.log({ blogs });

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
//         <div>
//           <h1 className="text-3xl font-extrabold text-gray-800">
//             📰 Derniers articles
//           </h1>
//         </div>

//         {userConnected ? (
//           <button
//             onClick={() => setIsOpen(true)}
//             className="px-5 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:shadow-lg hover:scale-105 transition"
//           >
//             Publier un article
//           </button>
//         ) : (
//           <span className="text-sm text-gray-600 italic">
//             Connectez-vous pour publier, noter ou commenter.
//           </span>
//         )}
//       </div>

//       {/* Liste des blogs */}
//       {blogs.length === 0 ? (
//         <div className="text-center py-16 bg-gray-50 rounded-xl shadow-inner">
//           <p className="text-lg text-gray-500">Aucun article pour le moment.</p>
//         </div>
//       ) : (
//         <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//           {blogs.map((b) => (
//             <BlogCard key={b._id} blog={b} />
//           ))}
//         </div>
//       )}

//       <AddBlogModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
//     </div>
//   );
// }

export default function Homepage() {
  return <div>Bienvenue sur Localiz !</div>;
}
