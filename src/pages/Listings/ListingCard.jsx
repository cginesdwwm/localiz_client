import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";

export default function BlogCard({ blog }) {
  const navigate = useNavigate();

  const truncatedContent =
    blog.content.length > 130
      ? blog.content.substring(0, 130) + "..."
      : blog.content;

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
      <div className="relative overflow-hidden h-48 flex-shrink-0">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover object-top transition-transform duration-300 hover-scale-105"
        />
      </div>
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

            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors p-0"
              onClick={() => navigate(`/blog/${blog._id}`)}
            >
              Voir plus →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
