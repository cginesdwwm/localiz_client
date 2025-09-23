// PAGE D'ERREUR

import { useRef } from "react";
import { useRouteError, useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useFocusHeading from "../../hooks/useFocusHeading";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  const headingRef = useRef(null);

  const code = error?.status || "Erreur";
  const statusText = error?.statusText || error?.message || "";

  const codeToFrench = {
    400: "Requête invalide",
    401: "Non authentifié·e",
    403: "Accès refusé",
    404: "Page non trouvée",
    408: "Requête expirée",
    429: "Trop de requêtes",
    500: "Erreur interne du serveur",
    502: "Mauvaise passerelle",
    503: "Service indisponible",
  };

  const textMap = {
    "Not Found": "Page introuvable",
    Unauthorized: "Non authentifié·e",
    Forbidden: "Accès refusé",
    "Internal Server Error": "Erreur interne du serveur",
  };

  const message =
    (typeof code === "number" && codeToFrench[code]) ||
    (statusText && (textMap[statusText] || statusText)) ||
    "Une erreur est survenue.";
  useDocumentTitle(
    `${typeof code === "number" ? code : "Erreur"} — ${message}`,
    { suffix: " | Localiz", replace: true }
  );
  useFocusHeading(headingRef);

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6 bg-transparent"
      role="main"
    >
      <div className="w-full max-w-2xl bg-white/5 border border-gray-200 rounded-xl p-8 shadow-sm text-center">
        <p
          className="text-6xl font-extrabold text-gray-800 mb-2"
          aria-hidden="true"
        >
          {code}
        </p>
        <h1
          className="front-heading text-3xl mb-4 font-bold"
          style={{ fontFamily: "Fredoka" }}
          role="alert"
          ref={headingRef}
        >
          {message}
        </h1>
        <p className="text-gray-600 mb-6">
          Nous sommes désolés — quelque chose s'est mal passé. Vous pouvez
          retourner à l'accueil ou réessayer plus tard.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button variant="cta" onClick={() => navigate(-1)}>
            Revenir en arrière
          </Button>
          <Button variant="cta" onClick={() => navigate("/")}>
            Aller à l'accueil
          </Button>
        </div>
      </div>
    </main>
  );
}
