/**
 * Carte d’aperçu d’une annonce (ListingCard)
 *
 * Props:
 * - listing: { _id, title, description, images: string[], owner: { username } }
 *
 * Rôle: Résume une annonce avec image de couverture, titre, extrait et auteur,
 * et permet d’accéder aux détails de l’annonce.
 */
import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";

// Card d'aperçu pour une annonce (listing)
// Props attendues: { listing: { _id, title, description, images: string[], owner: { username } } }
export default function ListingCard({ listing }) {
  const navigate = useNavigate();

  const desc = listing?.description || "";
  const truncated = desc.length > 130 ? desc.slice(0, 130) + "..." : desc;
  const cover =
    Array.isArray(listing?.images) && listing.images[0]
      ? listing.images[0]
      : undefined;

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
      <div className="relative overflow-hidden h-48 flex-shrink-0">
        <img
          src={cover}
          alt={listing?.title}
          className="w-full h-full object-cover object-top transition-transform duration-300 hover-scale-105"
        />
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <div className="h-16 mb-2">
          <h2 className="text-2xl font-semibold text-gray-900 line-clamp-2 leading-tight">
            {listing?.title}
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
                {listing?.owner?.username}
              </span>
            </p>

            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors p-0"
              onClick={() => navigate(`/listings/${listing?._id}`)}
            >
              Voir plus →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
