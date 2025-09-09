import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BlogCard({ blog }) {
  const [ratings, setRatings] = useState([]);
  const navigate = useNavigate();

  const truncatedContent =
    blog.content.length > 150
      ? blog.content.substring(0, 150) + "..."
      : blog.content;

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length
      : 0;

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.04] h-full flex flex-col">
      <div className="relative overflow-hidden h-48 flex-shrink-0">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      {averageRating > 0 && (
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center gap-1">
          <span className="text-yellow-400">⭐</span>
          <span className="font-semibold">{averageRating}</span>
          <span className="text-xs opacity-80">({ratings.length})</span>
        </div>
      )}
      <div className="p-5 flex-grow flex flex-col">
        <div className="h-16 mb-2">
          <h2 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight">
            {blog.title}
          </h2>
        </div>

        <p className="text-gray-600 mb-3 leading-relaxed flex-grow">
          {truncatedContent}
        </p>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Par{" "}
              <span className="font-semibold text-gray-700">
                {blog.author.username}
              </span>
            </p>

            <button
              className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
              onClick={() => navigate(`/blog/${blog._id}`)}
            >
              Voir plus →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
