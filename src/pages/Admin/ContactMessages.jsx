import { useEffect, useState } from "react";
import Button from "../../components/Common/Button";

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("active"); // active | archived | all
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  const load = async (
    selectedTab = tab,
    pageParam = page,
    limitParam = limit
  ) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(pageParam),
        limit: String(limitParam),
      });
      if (selectedTab === "active") params.set("archived", "false");
      if (selectedTab === "archived") params.set("archived", "true");
      const res = await fetch(`/api/contact?${params.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error((await res.json()).message || "Erreur");
      const data = await res.json();
      setMessages(data.items || []);
      setTotal(data.total || 0);
      setPage(data.page || pageParam);
      setLimit(data.limit || limitParam);
      return data;
    } catch (err) {
      setError(err.message || "Impossible de charger");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // reset to first page when tab changes
    setPage(1);
    load(tab, 1, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const archiveMessage = async (id) => {
    const ok = window.confirm("Archiver ce message ?");
    if (!ok) return;
    // optimistic UI
    const prev = messages;
    setMessages((s) => s.filter((m) => m._id !== id));
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.message || "Erreur lors de l'archivage");
      }
      // refresh list for current page
      const data = await load(tab, page, limit);
      // if the current page is empty after archiving and not the first page, go back one
      if (data && data.items && data.items.length === 0 && page > 1) {
        await load(tab, page - 1, limit);
      }
    } catch (err) {
      setError(err.message || "Impossible d'archiver");
      setMessages(prev);
    }
  };

  const unarchiveMessage = async (id) => {
    const ok = window.confirm("Restaurer ce message ?");
    if (!ok) return;
    const prev = messages;
    setMessages((s) => s.filter((m) => m._id !== id));
    try {
      const res = await fetch(`/api/contact/unarchive/${id}`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.message || "Erreur lors de la restauration");
      }
      const data = await load(tab, page, limit);
      if (data && data.items && data.items.length === 0 && page > 1) {
        await load(tab, page - 1, limit);
      }
    } catch (err) {
      setError(err.message || "Impossible de restaurer");
      setMessages(prev);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Messages de contact</h2>
      {loading && <p>Chargement…</p>}
      {error && <p className="text-red-400">{error}</p>}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded ${
            tab === "active" ? "bg-white/5 text-white" : "text-white/80"
          }`}
          onClick={() => setTab("active")}
        >
          Actifs
        </button>
        <button
          className={`px-3 py-1 rounded ${
            tab === "archived" ? "bg-white/5 text-white" : "text-white/80"
          }`}
          onClick={() => setTab("archived")}
        >
          Archivés
        </button>
        <button
          className={`px-3 py-1 rounded ${
            tab === "all" ? "bg-white/5 text-white" : "text-white/80"
          }`}
          onClick={() => setTab("all")}
        >
          Tous
        </button>
      </div>

      {!loading && !error && (
        <div className="space-y-4">
          {messages.length === 0 && <p>Aucun message trouvé.</p>}
          {messages.map((m) => (
            <div key={m._id} className="p-4 rounded border bg-white/5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{m.subject}</div>
                  <div className="text-sm text-[var(--muted)]">
                    {m.name} • {m.email}
                  </div>
                </div>
                <div className="text-xs text-[var(--muted)]">
                  {new Date(m.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="mt-2 text-sm whitespace-pre-wrap">
                {m.message}
              </div>
              <div className="mt-3 flex justify-end gap-2">
                {tab !== "archived" && (
                  <Button
                    variant="danger"
                    onClick={() => archiveMessage(m._id)}
                  >
                    Archiver
                  </Button>
                )}
                {tab === "archived" && (
                  <Button
                    variant="primary"
                    onClick={() => unarchiveMessage(m._id)}
                  >
                    Restaurer
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-[var(--muted)]">
          Affichage: {Math.min((page - 1) * limit + 1, total || 0)} -{" "}
          {Math.min(page * limit, total || 0)} sur {total}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={limit}
            onChange={(e) => {
              const newLimit = parseInt(e.target.value, 10);
              setLimit(newLimit);
              setPage(1);
              load(tab, 1, newLimit);
            }}
            className="rounded px-2 py-1 bg-[var(--surface)]"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>

          <button
            onClick={async () => {
              if (page <= 1) return;
              const newPage = page - 1;
              setPage(newPage);
              await load(tab, newPage, limit);
            }}
            disabled={page <= 1}
            className="px-3 py-1 rounded bg-white/5"
          >
            Préc
          </button>
          <div className="px-2">{page}</div>
          <button
            onClick={async () => {
              const maxPage = Math.max(1, Math.ceil((total || 0) / limit));
              if (page >= maxPage) return;
              const newPage = page + 1;
              setPage(newPage);
              await load(tab, newPage, limit);
            }}
            disabled={page >= Math.max(1, Math.ceil((total || 0) / limit))}
            className="px-3 py-1 rounded bg-white/5"
          >
            Suiv
          </button>
        </div>
      </div>
    </div>
  );
}
