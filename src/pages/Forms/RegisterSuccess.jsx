import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function RegisterSuccess() {
  const location = useLocation();
  const headingRef = useRef(null);
  // On tente d'utiliser expiresAt envoyé par le serveur (ms)
  const serverExpiresAt = location?.state?.expiresAt;
  // Si le user reload la page, lecture en fallback depuis sessionStorage
  let fallback = null;
  try {
    const raw = sessionStorage.getItem("register_expiresAt");
    if (raw) fallback = Number(raw);
  } catch {
    /* ignore */
  }

  const effectiveExpiresAt =
    serverExpiresAt || fallback || Date.now() + 3600 * 1000;
  const initial = Math.max(
    0,
    Math.floor((effectiveExpiresAt - Date.now()) / 1000)
  );
  const [remaining, setRemaining] = useState(initial);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    // Prevent direct access: require server state or session fallback
    const hasServer = !!serverExpiresAt;
    const hasSession = !!fallback;
    if (!hasServer && !hasSession) {
      navigate("/register", { replace: true });
    }
  }, [serverExpiresAt, fallback, navigate]);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  // Cleanup: si le compte à rebours atteint 0 ou si déjà expiré, on supprime le timer en session
  useEffect(() => {
    if (remaining <= 0 || effectiveExpiresAt <= Date.now()) {
      try {
        sessionStorage.removeItem("register_expiresAt");
      } catch {
        void 0;
      }
    }
  }, [remaining, effectiveExpiresAt]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}h ${m
      .toString()
      .padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
  };

  return (
    <section
      aria-labelledby="register-success-title"
      className="center-screen px-4"
    >
      <div className="w-full max-w-md px-4">
        <h1
          id="register-success-title"
          ref={headingRef}
          tabIndex={-1}
          className="front-heading text-3xl mb-3 font-bold"
          style={{ fontFamily: "Fredoka" }}
        >
          Inscription réussie !
        </h1>
        <p className="mb-3">
          Vous êtes inscrit·e. Un e-mail vous a été envoyé pour confirmer la
          création de votre compte.
        </p>
        <p className="mb-6 font-medium">
          Vous avez 1 heure pour valider votre inscription en cliquant sur le
          lien contenu dans cet e-mail. Passé ce délai, il faudra vous
          réinscrire.
        </p>

        <div className="mb-6">
          <div className="border border-white/50 p-4 rounded-2xl">
            <div className="text-sm text-muted">
              Temps restant pour confirmer
            </div>
            <div
              className="text-xl font-mono mt-1"
              role="status"
              aria-live="polite"
            >
              {formatTime(remaining)}
            </div>
            <div className="text-sm text-muted mt-2">
              Lien valable jusqu'au :{" "}
              {new Date(effectiveExpiresAt).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <NavLink to="/login" className="btn btn-cta px-4 py-2 rounded">
            Aller à la page de connexion
          </NavLink>

          <NavLink to="/homepage" className="btn btn-ghost px-4 py-2 rounded">
            Retour à l'accueil
          </NavLink>
        </div>
      </div>
    </section>
  );
}
