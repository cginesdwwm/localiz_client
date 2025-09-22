import { useEffect, useMemo, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  moveCategory,
} from "../../api/admin.api";

function Section({ title, type, items, refresh }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [items]);

  async function onAdd(e) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createCategory({ type, name: name.trim(), active: true });
      setName("");
      await refresh();
    } catch (err) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  async function onRename(id, current) {
    const nv = window.prompt("Nouveau nom de catégorie", current);
    if (nv == null) return;
    if (!nv.trim()) return;
    setLoading(true);
    setError("");
    try {
      await updateCategory(id, { name: nv.trim() });
      await refresh();
    } catch (err) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  async function onToggleActive(id, active) {
    setLoading(true);
    setError("");
    try {
      await updateCategory(id, { active: !active });
      await refresh();
    } catch (err) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id) {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    setLoading(true);
    setError("");
    try {
      await deleteCategory(id);
      await refresh();
    } catch (err) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  async function onMove(id, direction) {
    setLoading(true);
    setError("");
    try {
      await moveCategory(id, direction);
      await refresh();
    } catch (err) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
      <form onSubmit={onAdd} className="flex gap-2 mb-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ajouter une catégorie"
          className="px-3 py-2 rounded bg-white/5 text-white placeholder:text-white/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-2 rounded bg-emerald-600 text-white disabled:opacity-60"
        >
          Ajouter
        </button>
      </form>
      {error ? <div className="text-red-400 text-sm mb-2">{error}</div> : null}
      <ul className="space-y-2">
        {sorted.map((cat, idx) => (
          <li
            key={cat._id}
            className="flex items-center justify-between p-2 rounded bg-white/5 text-white"
          >
            <div className="flex items-center gap-3">
              <span className="inline-block w-6 text-center text-white/70">
                {idx + 1}
              </span>
              <span className={cat.active ? "" : "line-through opacity-70"}>
                {cat.name}
              </span>
              {!cat.active && (
                <span className="text-xs px-2 py-0.5 bg-white/10 rounded">
                  inactif
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onMove(cat._id, "up")}
                className="px-2 py-1 rounded bg-white/10"
                title="Monter"
              >
                ↑
              </button>
              <button
                onClick={() => onMove(cat._id, "down")}
                className="px-2 py-1 rounded bg-white/10"
                title="Descendre"
              >
                ↓
              </button>
              <button
                onClick={() => onRename(cat._id, cat.name)}
                className="px-2 py-1 rounded bg-white/10"
              >
                Renommer
              </button>
              <button
                onClick={() => onToggleActive(cat._id, cat.active)}
                className="px-2 py-1 rounded bg-white/10"
              >
                {cat.active ? "Désactiver" : "Activer"}
              </button>
              <button
                onClick={() => onDelete(cat._id)}
                className="px-2 py-1 rounded bg-red-600/80"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function AdminCategories() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState({ listing: [], deal: [] });

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await getCategories();
      setData(res);
    } catch (e) {
      setErr(e.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">Catégories</h1>
        <button
          onClick={load}
          className="px-3 py-2 rounded bg-white/10 text-white"
          disabled={loading}
        >
          Recharger
        </button>
      </div>
      {err ? <div className="text-red-400 mb-3">{err}</div> : null}
      {loading ? (
        <div className="text-white/70">Chargement…</div>
      ) : (
        <>
          <Section
            title="Annonces (Listings)"
            type="listing"
            items={data.listing}
            refresh={load}
          />
          <Section
            title="Bons plans (Deals)"
            type="deal"
            items={data.deal}
            refresh={load}
          />
        </>
      )}
    </div>
  );
}
