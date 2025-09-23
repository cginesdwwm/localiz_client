import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDeal } from "../../api/deals.api";
import BackLink from "../../components/Common/BackLink";

export default function DealDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchDeal(id);
        if (!cancelled) setDeal(data);
      } catch (e) {
        if (!cancelled) setError("Bon plan introuvable");
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
        <button className="underline" onClick={() => navigate("/deals")}>
          Retour aux bons plans
        </button>
      </div>
    );
  if (!deal) return null;

  return (
    <div className="px-4 py-6">
      <BackLink to="/deals" fixed />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{deal.title}</h1>
        {deal.image ? (
          <img
            src={deal.image}
            alt={deal.title}
            className="w-full max-h-[420px] object-cover rounded-xl mb-4"
          />
        ) : null}
        {Array.isArray(deal.images) && deal.images.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto mb-4">
            {deal.images.slice(1).map((url, i) => (
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
          {deal.tag ? (
            <p>
              <span className="font-semibold">Catégorie: </span>
              {deal.tag}
            </p>
          ) : null}
          {deal.location?.name || deal.location?.address ? (
            <p>
              <span className="font-semibold">Lieu: </span>
              {[deal.location?.name, deal.location?.address]
                .filter(Boolean)
                .join(" — ")}
            </p>
          ) : null}
          {deal.startDate ? (
            <p>
              <span className="font-semibold">Début: </span>
              {new Date(deal.startDate).toLocaleDateString()}
            </p>
          ) : null}
          {deal.endDate ? (
            <p>
              <span className="font-semibold">Fin: </span>
              {new Date(deal.endDate).toLocaleDateString()}
            </p>
          ) : null}
          {deal.accessConditions?.type ? (
            <p>
              <span className="font-semibold">Accès: </span>
              {deal.accessConditions.type}
              {deal.accessConditions.type === "paid" &&
              deal.accessConditions.price
                ? ` — ${deal.accessConditions.price}€`
                : ""}
            </p>
          ) : null}
          {deal.website ? (
            <p>
              <a
                className="text-blue-600 underline"
                href={deal.website}
                target="_blank"
                rel="noreferrer"
              >
                Site web
              </a>
            </p>
          ) : null}
        </div>
        <div className="mt-6 whitespace-pre-wrap leading-relaxed">
          {deal.description}
        </div>
      </div>
    </div>
  );
}
