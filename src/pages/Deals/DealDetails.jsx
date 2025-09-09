// PAGE TYPE BON PLAN

import { useNavigate, useParams } from "react-router-dom";
import { useBlog } from "../../context/BlogContext";

export default function BlogDetails() {
  const { id } = useParams();
  const { blogs } = useBlog();
  const navigate = useNavigate();
  console.log(id);
  const blog = blogs.find((b) => b._id === id);

  if (!blog) {
    return <div>Article non trouvé</div>;
  }

  return (
    <div>
      <img
        src={blog.image}
        alt={blog.title}
        className="object-cover h-64 mb-4 mt-4 rounded-lg object-center block mx-auto"
      />
      <h2 className="text-2xl font-bold">{blog.title}</h2>
      <p className="mt-2">{blog.content}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
        onClick={() => navigate("/")}
      >
        Retour à la page d'accueil
      </button>
    </div>
  );
}
