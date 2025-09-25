/**
 * CONFIRMATION EMAIL - SUCCÈS
 *
 * Rôle: Informe l’utilisateur que la confirmation a réussi et redirige
 * automatiquement (accueil si connecté, login sinon) avec lien de secours.
 *
 * Accessibilité: Focus sur le H1, libellé du lien contextualisé, message
 * d’état en aria-live.
 */
import { useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Common/Button";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useFocusHeading from "../../hooks/useFocusHeading";

export default function ConfirmEmailSuccess() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const headingRef = useRef(null);
  useDocumentTitle("Confirmation réussie");
  useFocusHeading(headingRef);

  useEffect(() => {
    const t = setTimeout(() => {
      if (isAuthenticated) {
        navigate("/homepage", { replace: true });
      } else {
        navigate("/login?message=success", { replace: true });
      }
    }, 6000);

    return () => clearTimeout(t);
  }, [navigate, isAuthenticated]);

  // destination for the inline Link
  const destination = isAuthenticated ? "/homepage" : "/login?message=success";

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1
        className="front-heading text-3xl mb-4 font-bold"
        style={{ fontFamily: "Fredoka" }}
        ref={headingRef}
      >
        Confirmation réussie 🎉
      </h1>

      <p className="mt-4" role="status" aria-live="polite">
        Votre compte a été activé. Vous allez être redirigé·e vers l'accueil.
      </p>

      <p className="mt-4 text-sm text-gray-500">
        Si la redirection ne fonctionne pas,&nbsp;
        <Link
          to={destination}
          className="underline"
          aria-label={`Aller vers ${
            isAuthenticated ? "l'accueil" : "la page de connexion"
          }`}
        >
          cliquez ici
        </Link>
        .
      </p>
    </div>
  );
}
