import React, { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import { getListingsList, deleteListing } from "../../api/admin.api";
import { notify } from "../../utils/notify";

export default function AdminListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async function load() {
      setLoading(true);
      try {
        const data = await getListingsList({ limit: 200 });
        if (!mounted) return;
        setListings(Array.isArray(data) ? data : data.items || []);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (id) => {
    const ok = await notify.confirm("Supprimer cette annonce ?");
    if (!ok) return;
    try {
      await deleteListing(id);
      setListings((s) => s.filter((l) => l._id !== id && l.id !== id));
      notify.success("Annonce supprimée");
    } catch (err) {
      notify.error(err.message || "Erreur lors de la suppression");
    }
  };

  // search & pagination
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return listings;
    return listings.filter((d) =>
      (d.title || d.titre || "").toLowerCase().includes(term)
    );
  }, [listings, q]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-6">
        <h2 className="title text-3xl">Annonces</h2>
        <p className="text-sm text-white/80 mt-1">
          Gestion des annonces (troc / dons)
        </p>
      </header>

      {loading ? (
        <LoadingSpinner message="Chargement des annonces..." />
      ) : error ? (
        <div className="rounded-lg bg-white/5 p-4 text-red-400">{error}</div>
      ) : (
        <div className="rounded-lg bg-white/5 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Input
                type="search"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="Rechercher par titre"
                className="px-3 py-2 rounded bg-white/5 text-white placeholder:text-white/60"
              />
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="px-3 py-2 rounded bg-white/5 text-white"
              >
                <option value={5}>5 / page</option>
                <option value={10}>10 / page</option>
                <option value={25}>25 / page</option>
              </select>
            </div>

            <div className="text-sm text-white/70">{total} résultats</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-sm text-white/70">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Titre</th>
                  <th className="p-2">Auteur</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((d) => (
                  <tr
                    key={d._id || d.id}
                    className="align-top border-t border-white/5"
                  >
                    <td className="p-2 text-sm text-white/60">
                      {d._id || d.id}
                    </td>
                    <td className="p-2 text-sm text-white">
                      {d.title || d.titre || "-"}
                    </td>
                    <td className="p-2 text-sm text-white">
                      {d.author || d.userEmail || "-"}
                    </td>
                    <td className="p-2 text-sm">
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(d._id || d.id)}
                      >
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-white/70">
              Page {page} / {pages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Préc
              </Button>
              <Button
                variant="ghost"
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
              >
                Suiv
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
