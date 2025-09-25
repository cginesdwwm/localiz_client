/**
 * Détails d’une annonce (ListingDetails)
 *
 * Rôle: Récupère et affiche le détail d’une annonce (don/troc) via l’id d’URL.
 * Inclut BackLink, image principale, galerie, métadonnées (catégorie, lieu,
 * type, état) et description.
 *
 * Accessibilité: Rendu dans le <main id="main-content"> global. Les images
 * utilisent des alt descriptifs. Le lien de retour facilite la navigation.
 */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchListing } from "../../api/listings.api";
import BackLink from "../../components/Common/BackLink";

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchListing(id);
        if (!cancelled) setListing(data);
      } catch (e) {
        if (!cancelled) setError("Annonce introuvable");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <div className="p-4">Chargement…</div>;
  if (error)
    return (
      <div className="p-4">
        <p className="text-red-600">{error}</p>
        <button className="underline" onClick={() => navigate("/listings")}>
          Retour aux annonces
        </button>
      </div>
    );
  if (!listing) return null;

  return (
    <div className="px-4 py-6">
      <BackLink to="/listings" fixed />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
        {Array.isArray(listing.images) && listing.images[0] ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full max-h-[420px] object-cover rounded-xl mb-4"
          />
        ) : null}
        {Array.isArray(listing.images) && listing.images.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto mb-4">
            {listing.images.slice(1).map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Image ${i + 2}`}
                className="h-24 w-24 object-cover rounded-lg"
              />
            ))}
          </div>
        ) : null}
        <div className="space-y-2 text-sm text-gray-700">
          {Array.isArray(listing.tags) && listing.tags.length ? (
            <p>
              <span className="font-semibold">Catégorie: </span>
              {listing.tags[0]}
            </p>
          ) : null}
          {listing.location?.postalCode || listing.location?.city ? (
            <p>
              <span className="font-semibold">Localisation: </span>
              {[listing.location?.postalCode, listing.location?.city]
                .filter(Boolean)
                .join(" ")}
            </p>
          ) : null}
          {listing.type ? (
            <p>
              <span className="font-semibold">Type: </span>
              {listing.type === "swap" ? "Troc" : "Don"}
            </p>
          ) : null}
          {listing.condition ? (
            <p>
              <span className="font-semibold">État: </span>
              {listing.condition}
            </p>
          ) : null}
        </div>
        <div className="mt-6 whitespace-pre-wrap leading-relaxed">
          {listing.description}
        </div>
      </div>
    </div>
  );
}
