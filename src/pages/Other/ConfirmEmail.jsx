/**
 * CONFIRMATION D'EMAIL
 *
 * Rôle: Récupère le token dans l’URL, appelle l’API de confirmation et
 * redirige vers la page appropriée (succès, expiré ou erreur).
 *
 * Accessibilité: Indique l’état via aria-live (polite) et aria-busy pendant
 * le chargement. Aucune structure de page (main) ici: rendu dans le main global.
 */
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/url";

const ConfirmEmail = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/confirm-email/error", { replace: true });
      return;
    }

    (async () => {
      try {
        const resp = await fetch(`${BASE_URL}/user/confirm-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ token }),
        });

        if (resp.ok) {
          try {
            sessionStorage.removeItem("register_expiresAt");
          } catch {
            // ignore
          }
          navigate("/confirm-email/success", { replace: true });
        } else if (resp.status === 410) {
          navigate("/confirm-email/expired", { replace: true });
        } else {
          navigate("/confirm-email/error", { replace: true });
        }
      } catch (err) {
        console.error(err);
        navigate("/confirm-email/error", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [location.search, navigate]);

  if (loading)
    return (
      <div className="p-6">
        <div role="status" aria-live="polite" aria-busy="true">
          Confirmation en cours…
        </div>
      </div>
    );
  return null;
};

export default ConfirmEmail;
