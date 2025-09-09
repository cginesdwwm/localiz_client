import { useEffect, useState } from "react";
import { notify } from "../../utils/notify";
import {
  getAdminHealth,
  getAdminOverview,
  getAdminRecent,
} from "../../api/admin.api";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [recent, setRecent] = useState(null);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [ov, rc] = await Promise.all([
          getAdminOverview(),
          getAdminRecent(),
        ]);
        setOverview(ov);
        setRecent(rc);
        // load health too
        try {
          const h = await getAdminHealth();
          setHealth(h);
        } catch {
          // non-fatal for dashboard
          setHealth({ ok: false });
        }
      } catch (error) {
        notify.error(error.message);
      }
    }
    load();
    // auto-refresh every 30s
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  async function checkHealth() {
    try {
      const res = await getAdminHealth();
      notify.success(`API: ${res.ok ? "ok" : "unhealthy"}`);
    } catch (err) {
      notify.error(err.message || "Health check failed");
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Dashboard Admin</h1>
      <div className="flex gap-4 mb-4">
        <button
          onClick={checkHealth}
          className="px-3 py-2 rounded bg-green-500 text-white"
        >
          Vérifier API
        </button>
        <Link
          to="/admin/users"
          className="px-3 py-2 rounded bg-blue-500 text-white"
        >
          Voir utilisateurs
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow">
          Utilisateurs: {overview ? overview.users : "—"}
        </div>
        <div className="p-4 bg-white rounded shadow">
          Bons plans: {overview ? overview.deals : "—"}
        </div>
        <div className="p-4 bg-white rounded shadow">
          Annonces: {overview ? overview.listings : "—"}
        </div>
      </div>

      <div className="mb-6">
        <div
          className={`p-4 bg-white rounded shadow inline-block border-l-4 ${
            health
              ? health.ok
                ? "border-green-500"
                : "border-red-500"
              : "border-gray-300"
          }`}
        >
          <strong>API:</strong>{" "}
          <span
            className={
              health
                ? health.ok
                  ? "text-green-600"
                  : "text-red-600"
                : "text-gray-600"
            }
          >
            {health ? (health.ok ? "OK" : "Unhealthy") : "—"}
          </span>
          <div className="text-xs">DB: {health?.db || "—"}</div>
          <div className="text-xs">Version: {health?.version || "—"}</div>
          <div className="text-xs">
            Checked:{" "}
            {health?.time ? new Date(health.time).toLocaleString() : "—"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-medium mb-2">Nouveaux utilisateurs (7j)</h3>
          <div style={{ width: "100%", height: 200 }}>
            {overview ? (
              <ResponsiveContainer>
                <LineChart data={overview.usersSeries}>
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div>Chargement…</div>
            )}
          </div>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-medium mb-2">Nouvelles publications (7j)</h3>
          <div style={{ width: "100%", height: 200 }}>
            {overview ? (
              <ResponsiveContainer>
                <LineChart
                  data={overview.dealsSeries.map((d, i) => ({
                    day: d.day,
                    deals: d.count,
                    listings: overview.listingsSeries[i]?.count || 0,
                  }))}
                >
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="deals" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="listings" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div>Chargement…</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h4 className="font-semibold mb-2">Derniers utilisateurs</h4>
          {recent ? (
            <ul className="space-y-2">
              {recent.recentUsers.map((u) => (
                <li key={u._id} className="text-sm">
                  {u.email} — {new Date(u.createdAt).toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <div>Chargement…</div>
          )}
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h4 className="font-semibold mb-2">Derniers bons plans</h4>
          {recent ? (
            <ul className="space-y-2">
              {recent.recentDeals.map((d) => (
                <li key={d._id} className="text-sm">
                  {d.title} — {new Date(d.createdAt).toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <div>Chargement…</div>
          )}
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h4 className="font-semibold mb-2">Dernières annonces</h4>
          {recent ? (
            <ul className="space-y-2">
              {recent.recentListings.map((l) => (
                <li key={l._id} className="text-sm">
                  {l.title} — {new Date(l.createdAt).toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <div>Chargement…</div>
          )}
        </div>
      </div>
    </div>
  );
}
