import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
        const resp = await fetch(
          `${import.meta.env.VITE_SERVER_URL.replace(
            /\/+$/,
            ""
          )}/user/confirm-email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ token }),
          }
        );

        if (resp.ok) {
          // confirmation réussie -> nettoyage du timer stocké en session et affichage succès
          try {
            sessionStorage.removeItem("register_expiresAt");
          } catch {
            void 0;
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

  // Rend un écran de chargement pendant la confirmation
  if (loading) return <div className="p-6">Confirmation en cours…</div>;
  return null;
};

export default ConfirmEmail;
