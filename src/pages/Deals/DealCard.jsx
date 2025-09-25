/**
 * Carte d’aperçu d’un bon plan (DealCard)
 *
 * Props:
 * - deal: { _id, title, description, image, author: { username } }
 *
 * Rôle: Présente un extrait (image, titre, début de description, auteur) et
 * un bouton pour naviguer vers la page détaillée du bon plan.
 */
import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";

// Card d'aperçu pour un bon plan (deal)
// Props attendues: { deal: { _id, title, description, image, author: { username } } }
export default function DealCard({ deal }) {
  const navigate = useNavigate();

  const description = deal?.description || "";
  const truncated =
    description.length > 130 ? description.slice(0, 130) + "..." : description;

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
      <div className="relative overflow-hidden h-48 flex-shrink-0">
        <img
          src={deal?.image}
          alt={deal?.title}
          className="w-full h-full object-cover object-top transition-transform duration-300 hover-scale-105"
        />
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <div className="h-16 mb-2">
          <h2 className="text-2xl font-semibold text-gray-900 line-clamp-2 leading-tight">
            {deal?.title}
          </h2>
        </div>

        <p className="text-gray-600 mb-3 leading-relaxed flex-grow">
          {truncated}
        </p>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Par{" "}
              <span className="font-semibold text-gray-700">
                {deal?.author?.username}
              </span>
            </p>

            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors p-0"
              onClick={() => navigate(`/deals/${deal?._id}`)}
            >
              Voir plus →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
