import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import { getUsersList, deleteUser, toggleUserRole } from "../../api/admin.api";
import { notify } from "../../utils/notify";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsersList({ limit: 100 });
      // API may return { items, total } or an array — normalize
      setUsers(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    const ok = await notify.confirm("Supprimer cet utilisateur ?");
    if (!ok) return;
    try {
      await deleteUser(id);
      setUsers((s) => s.filter((u) => u._id !== id && u.id !== id));
      notify.success("Utilisateur supprimé");
    } catch (err) {
      notify.error(err.message || "Erreur lors de la suppression");
    }
  };

  const handleToggleRole = async (u) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    const ok = await notify.confirm(
      `Changer le rôle de ${u.email} en ${newRole} ?`
    );
    if (!ok) return;
    try {
      await toggleUserRole(u._id || u.id, newRole);
      setUsers((s) =>
        s.map((x) =>
          x._id === u._id || x.id === u.id ? { ...x, role: newRole } : x
        )
      );
      notify.success("Rôle modifié");
    } catch (err) {
      notify.error(err.message || "Erreur lors du changement de rôle");
    }
  };

  // Recherche + pagination
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (u) =>
        (u.email || "").toLowerCase().includes(term) ||
        (u.username || "").toLowerCase().includes(term)
    );
  }, [users, q]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-6">
        <h2 className="title text-3xl">Utilisateurs</h2>
        <p className="text-sm text-white/80 mt-1">
          Liste et actions sur les comptes
        </p>
      </header>

      {loading ? (
        <LoadingSpinner message="Chargement des utilisateurs..." />
      ) : error ? (
        <div className="rounded-lg bg-white/5 p-4 text-red-400">{error}</div>
      ) : (
        <div className="rounded-lg bg-white/5 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Input
                type="search"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="Rechercher par email ou pseudo"
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
                  <th className="p-2">Email</th>
                  <th className="p-2">Pseudo</th>
                  <th className="p-2">Rôle</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((u) => (
                  <tr
                    key={u._id || u.id}
                    className="align-top border-t border-white/5"
                  >
                    <td className="p-2 text-sm text-white/60">
                      {u._id || u.id}
                    </td>
                    <td className="p-2 text-sm text-white">{u.email}</td>
                    <td className="p-2 text-sm text-white">{u.username}</td>
                    <td className="p-2 text-sm text-white/80">
                      {u.role || "user"}
                    </td>
                    <td className="p-2 text-sm">
                      <Button
                        variant="ghost"
                        className="mr-2"
                        onClick={() => handleToggleRole(u)}
                      >
                        {u.role === "admin" ? "Retirer admin" : "Promouvoir"}
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(u._id || u.id)}
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
