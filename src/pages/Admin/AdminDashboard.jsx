import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import Button from "../../components/Common/Button";
import { getAdminStats, getAdminHealth } from "../../api/admin.api";

const DEFAULT_COLORS = ["#60A5FA", "#34D399", "#FB7185", "#FBBF24", "#A78BFA"];

function readCssVar(name, fallback) {
  try {
    const val = getComputedStyle(document.documentElement).getPropertyValue(
      name
    );
    return val ? val.trim() : fallback;
  } catch {
    return fallback;
  }
}

export default function AdminDashboard() {
  const chartGridStroke = readCssVar(
    "--chart-grid-stroke",
    "rgba(255,255,255,0.07)"
  );
  const chartAxisStroke = readCssVar(
    "--chart-axis-stroke",
    "rgba(255,255,255,0.56)"
  );
  // Build palette from CSS variables (fall back to DEFAULT_COLORS)
  const COLORS = DEFAULT_COLORS.map((c, i) =>
    readCssVar(`--chart-color-${i}`, c)
  );
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [healthUpdatedAt, setHealthUpdatedAt] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingStats(true);
      setError(null);
      try {
        const s = await getAdminStats();
        if (!mounted) return;
        setStats(s);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || String(err));
      } finally {
        if (mounted) setLoadingStats(false);
      }
    })();

    (async () => {
      setLoadingHealth(true);
      try {
        const h = await getAdminHealth();
        if (!mounted) return;
        setHealth(h);
        setHealthUpdatedAt(new Date().toISOString());
      } catch (err) {
        if (!mounted) return;
        setHealth({ status: "DOWN", error: err.message || String(err) });
        setHealthUpdatedAt(new Date().toISOString());
      } finally {
        if (mounted) setLoadingHealth(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const totals = useMemo(() => {
    if (!stats) return { users: "—", deals: "—", listings: "—" };
    // support multiple possible shapes
    return {
      users:
        stats.totals?.users ??
        stats.usersCount ??
        stats.users ??
        stats.totalUsers ??
        "—",
      deals:
        stats.totals?.deals ??
        stats.dealsCount ??
        stats.deals ??
        stats.totalDeals ??
        "—",
      listings:
        stats.totals?.listings ??
        stats.listingsCount ??
        stats.listings ??
        stats.totalListings ??
        "—",
    };
  }, [stats]);

  // timeline data for line chart (users over time)
  const timeline = useMemo(() => {
    // Build a timeline that can include users, deals and listings series
    // Support shapes: stats.usersByMonth, stats.dealsByMonth, stats.listingsByMonth
    const usersArr = stats?.usersByMonth || stats?.timeline?.users || null;
    const dealsArr = stats?.dealsByMonth || stats?.timeline?.deals || null;
    const listingsArr =
      stats?.listingsByMonth || stats?.timeline?.listings || null;

    // If none, try a generic timeline array in stats.timeline (array of { month, users, deals, listings })
    if (
      !usersArr &&
      !dealsArr &&
      !listingsArr &&
      Array.isArray(stats?.timeline)
    ) {
      return stats.timeline.map((it) => ({
        name: it.month || it.label || it.name,
        users: it.users ?? it.u ?? it.count ?? 0,
        deals: it.deals ?? it.d ?? 0,
        listings: it.listings ?? it.l ?? 0,
      }));
    }

    // Merge per-month arrays by month label
    const map = new Map();
    function add(arr, keyName) {
      if (!Array.isArray(arr)) return;
      arr.forEach((it) => {
        const name = it.month || it.label || it.name;
        const entry = map.get(name) || { name };
        entry[keyName] =
          (entry[keyName] || 0) + (it.count ?? it.value ?? it[keyName] ?? 0);
        map.set(name, entry);
      });
    }
    add(usersArr, "users");
    add(dealsArr, "deals");
    add(listingsArr, "listings");

    const out = Array.from(map.values()).sort((a, b) =>
      a.name > b.name ? 1 : -1
    );
    return out.length ? out : null;
  }, [stats]);

  // breakdown: deals by category or simple totals
  const breakdown = useMemo(() => {
    const byCat = stats?.dealsByCategory || stats?.byCategory || null;
    if (Array.isArray(byCat) && byCat.length) {
      return byCat.map((it) => ({
        name: it.category || it.name,
        value: it.count ?? it.value ?? 0,
      }));
    }
    // fallback to totals
    if (stats) {
      return [
        {
          name: "Bons plans",
          value: Number(
            stats.totals?.deals ?? stats.dealsCount ?? stats.deals ?? 0
          ),
        },
        {
          name: "Annonces",
          value: Number(
            stats.totals?.listings ?? stats.listingsCount ?? stats.listings ?? 0
          ),
        },
      ];
    }
    return null;
  }, [stats]);

  const refreshHealth = async () => {
    setLoadingHealth(true);
    try {
      const h = await getAdminHealth();
      setHealth(h);
      setHealthUpdatedAt(new Date().toISOString());
    } catch (err) {
      setHealth({ status: "DOWN", error: err.message || String(err) });
      setHealthUpdatedAt(new Date().toISOString());
    } finally {
      setLoadingHealth(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-6">
        <div className="flex items-start justify-between">
          <h1 className="title text-4xl">Administration</h1>
          <div className="flex gap-2">
            <NavLink to="/">
              <Button variant="ghost">Accueil</Button>
            </NavLink>
          </div>
        </div>
      </header>

      {loadingStats ? (
        <LoadingSpinner message="Chargement des statistiques..." />
      ) : error ? (
        <div className="rounded-lg bg-white/5 p-4 text-red-400">{error}</div>
      ) : (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-sm text-white/70">Utilisateurs</p>
              <p className="text-2xl font-semibold text-white">
                {totals.users}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-sm text-white/70">Bons plans</p>
              <p className="text-2xl font-semibold text-white">
                {totals.deals}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-sm text-white/70">Annonces</p>
              <p className="text-2xl font-semibold text-white">
                {totals.listings}
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/5">
              <h3 className="heading text-lg mb-3">
                Évolution des utilisateurs
              </h3>
              {timeline && timeline.length ? (
                <div style={{ width: "100%", height: 220 }}>
                  <ResponsiveContainer>
                    <LineChart data={timeline}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={chartGridStroke}
                      />
                      <XAxis dataKey="name" stroke={chartAxisStroke} />
                      <YAxis stroke={chartAxisStroke} />
                      <Tooltip />
                      <Legend verticalAlign="top" />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke={COLORS[0]}
                        strokeWidth={2}
                        dot={false}
                      />
                      {timeline.some((d) => typeof d.deals !== "undefined") && (
                        <Line
                          type="monotone"
                          dataKey="deals"
                          stroke={COLORS[1]}
                          strokeWidth={2}
                          dot={false}
                        />
                      )}
                      {timeline.some(
                        (d) => typeof d.listings !== "undefined"
                      ) && (
                        <Line
                          type="monotone"
                          dataKey="listings"
                          stroke={COLORS[3]}
                          strokeWidth={2}
                          dot={false}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-sm text-white/70">
                  Pas de données temporelles disponibles.
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-white/5">
              <h3 className="heading text-lg mb-3">Répartition</h3>
              {breakdown && breakdown.length ? (
                <div style={{ width: "100%", height: 220 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={breakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={40}
                        outerRadius={80}
                        label
                      >
                        {breakdown.map((entry, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={COLORS[idx % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-sm text-white/70">
                  Pas de données de répartition.
                </div>
              )}
            </div>
          </section>

          <section className="p-4 rounded-xl bg-white/5 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Santé de l'API
              </h3>
              <Button
                variant="ghost"
                onClick={refreshHealth}
                disabled={loadingHealth}
              >
                Vérifier
              </Button>
            </div>
            <div className="mt-3">
              {loadingHealth ? (
                <div className="py-4">
                  <LoadingSpinner message="Vérification API..." />
                </div>
              ) : health ? (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-4 items-center">
                    <div
                      className={`px-3 py-1 rounded ${
                        health.status === "UP" ? "bg-green-600" : "bg-red-600"
                      }`}
                    >
                      {health.status}
                    </div>
                    <div className="text-sm text-white/80">
                      {health.message || health.info || health.uptime || null}
                    </div>
                    {health.error ? (
                      <div className="text-sm text-red-400">{health.error}</div>
                    ) : null}
                  </div>
                  {healthUpdatedAt && (
                    <div className="text-xs text-gray-400">
                      Mis à jour:{" "}
                      {new Intl.DateTimeFormat("fr-FR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(healthUpdatedAt))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-white/70">
                  Aucune information de santé disponible.
                </div>
              )}
            </div>
          </section>

          <nav className="flex gap-3 items-center">
            <NavLink to="/admin/users">
              <Button variant="ghost">Gérer les utilisateurs</Button>
            </NavLink>
            <NavLink to="/admin/deals">
              <Button variant="ghost">Gérer les bons plans</Button>
            </NavLink>
            <NavLink to="/admin/listings">
              <Button variant="ghost">Gérer les annonces</Button>
            </NavLink>
          </nav>
        </>
      )}
    </div>
  );
}
