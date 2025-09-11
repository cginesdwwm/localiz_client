// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { useBlog } from "../../context/BlogContext";
// import StarRating from "../../utils/StarRating";
// import { deleteRateBlog, rateBlog } from "../../api/blog.api";

// export default function BlogDetails() {
//   // récupération de l'id du blog en détail dans l'URL
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // récupération de l'utilisateur connecté et des blogs
//   const { userConnected } = useAuth();
//   const { blogs } = useBlog();

//   console.log(blogs);

//   // variables pour ensuite gérer la note et les commentaires
//   const [ratings, setRatings] = useState([]);
//   const [hasWatched, setHasWatched] = useState(false);
//   const [userRating, setUserRating] = useState(0);
//   const [comments, setComments] = useState([]);
//   const [commentText, setCommentText] = useState("");

//   // Trouver le blog détaillé parmi tous les blog grace à l'ID
//   const blog = blogs.find((b) => b._id === id);

//   // si le blog n'existe pas (mauvais ID) redirection vers la page d'accueil
//   useEffect(() => {
//     if (!blog) {
//       navigate("/");
//     }
//   }, [blog, navigate]);

//   // évite la page d'erreur si pas de blog en attendant la redirection du useEffect
//   if (!blog) return <div>Blog introuvable...</div>;

//   // Calcul de la moyenne des notes
//   const averageRating =
//     ratings.length > 0
//       ? (
//           ratings.reduce((sum, rating) => sum + rating.value, 0) /
//           ratings.length
//         ).toFixed(1)
//       : 0;

//   const canInteract = userConnected && userConnected._id !== blog.author?._id;

//   const handleWatchedClick = async () => {
//     const newValue = !hasWatched;
//     setHasWatched(newValue);
//     if (!newValue) {
//       setUserRating(0);
//       await deleteRateBlog(blog._id);
//     }
//   };

//   const handleRating = async (rating) => {
//     await rateBlog(blog._id, rating);
//     setUserRating(rating);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-white shadow-sm border-b">
//         <div className="container mx-auto px-6 py-4">
//           {/* Example using shared Button component:
//           <Button variant="ghost" className="flex items-center gap-2 p-0" onClick={() => navigate("/")}>← Retour aux articles</Button> */}
//         </div>
//       </div>

//       <div className="container mx-auto px-6 py-8">
//         <div className="grid lg:grid-cols-5 gap-8">
//           <div className="lg:col-span-2">
//             {blog.image && (
//               <div className="sticky top-8">
//                 <img
//                   src={blog.image}
//                   alt={blog.title}
//                   className="w-full rounded-2xl shadow-xl object-cover"
//                   style={{ aspectRatio: "3/4", maxHeight: "600px" }}
//                 />
//               </div>
//             )}
//           </div>

//           <div className="lg:col-span-3 space-y-8">
//             <div className="bg-white rounded-2xl p-8 shadow-lg">
//               <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
//                 {blog.title}
//               </h1>

//               <div className="flex items-center justify-between mb-6">
//                 <p className="text-gray-600">
//                   Par{" "}
//                   <span className="font-semibold text-gray-800">
//                     {blog.author?.username}
//                   </span>
//                 </p>

//                 {averageRating > 0 && (
//                   <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full">
//                     <span className="text-yellow-500 text-lg">⭐</span>
//                     <span className="font-bold text-gray-900">
//                       {averageRating}/5
//                     </span>
//                     <span className="text-sm text-gray-600">
//                       ({ratings.length} avis)
//                     </span>
//                   </div>
//                 )}
//               </div>
//               <div className="prose prose-lg max-w-none">
//                 <div className="bg-gray-50 rounded-xl p-6 max-h-96 overflow-y-auto">
//                   <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
//                     {blog.content}
//                   </p>
//                 </div>
//               </div>
//             </div>
//             {userConnected ? (
//               canInteract ? (
//                 <div className="bg-white rounded-2xl p-8 shadow-lg">
//                   <h3 className="text-2xl font-bold text-gray-900 mb-6">
//                     Votre avis
//                   </h3>
//                   {/* <div className="mb-8">
//                     <Button
//                       className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all text-lg ${
//                         !hasWatched ? "bg-gray-100" : "bg-green-400"
//                       }  text-gray-700 border-2 border-gray-300 hover:bg-gray-200`}
//                       onClick={handleWatchedClick}
//                     >
//                       {hasWatched ? "Série vue" : "Marquer comme vue"}
//                     </Button>
//                   </div> */}

//                   {hasWatched && (
//                     <div className="border-t pt-6">
//                       <h4 className="text-lg font-semibold text-gray-800 mb-4">
//                         Notez cette série :
//                       </h4>
//                       <div className="flex items-center gap-2 mb-4">
//                         <StarRating
//                           maxStars={5}
//                           rating={userRating}
//                           onRatingChange={handleRating}
//                         />
//                       </div>
//                       {userRating ? (
//                         <p className="text-sm text-green-600 font-medium">
//                           ✓ Vous avez noté {userRating} /5
//                         </p>
//                       ) : null}
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="border-t pt-6">
//                   <p className="text-blue-600 italic text-center">
//                     Vous êtes l'auteur de cet article
//                   </p>
//                 </div>
//               )
//             ) : null}

//             <div className="bg-white rounded-2xl p-8 shadow-lg">
//               <h3 className="text-2xl font-bold text-gray-900 mb-6">
//                 Commentaires ({comments.length})
//               </h3>
//               {userConnected ? (
//                 // <div className="mb-8">
//                 //   <textarea
//                 //     value={commentText}
//                 //     onChange={(e) => setCommentText(e.target.value)}
//                 //     placeholder="Partagez votre opinion sur cette série..."
//                 //     className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
//                 //     rows="4"
//                 //   />
//                 //   <Button className="mt-3">Publier le commentaire</Button>
//                 // </div>
//               ) : (
//                 <p className="text-center text-gray-500 italic mb-8 p-6 bg-gray-50 rounded-xl">
//                   Connectez-vous pour laisser un commentaire
//                 </p>
//               )}

//               <div className="space-y-4">
//                 {comments.length === 0 ? (
//                   <p className="text-center text-gray-500 py-8">
//                     Aucun commentaire pour le moment. Soyez le premier à donner
//                     votre avis !
//                   </p>
//                 ) : (
//                   comments.map((comment) => (
//                     <div className="bg-gray-50 rounded-xl p-6">
//                       <div className="flex items-start justify-between mb-3">
//                         <div className="flex items-center gap-3">
//                           <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold"></div>
//                           <span className="font-semibold text-gray-900"></span>
//                         </div>
//                         <span className="text-sm text-gray-500"></span>
//                       </div>
//                       <p className="text-gray-700 leading-relaxed"></p>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
