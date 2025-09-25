/**
 * CONFIRMATION EMAIL - LIEN EXPIRÉ
 *
 * Rôle: Indique que le lien de confirmation est expiré et oriente vers une
 * nouvelle tentative d’inscription.
 *
 * Accessibilité: Focus sur le H1; actions groupées et étiquetées; titre de
 * page mis à jour.
 */
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useFocusHeading from "../../hooks/useFocusHeading";

export default function ConfirmEmailExpired() {
  const navigate = useNavigate();
  const headingRef = useRef(null);
  useDocumentTitle("Lien expiré");
  useFocusHeading(headingRef);

  const handleRetry = () => navigate("/register");

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1
        className="front-heading text-3xl mb-4 font-bold"
        style={{ fontFamily: "Fredoka" }}
        ref={headingRef}
      >
        Lien expiré
      </h1>

      <p className="mt-4">
        Le lien de confirmation a expiré. Vous pouvez renvoyer un email de
        confirmation depuis la page d'inscription.
      </p>

      <div className="mt-6" role="group" aria-label="Actions disponibles">
        <Button variant="cta" onClick={handleRetry}>
          Réessayer
        </Button>
      </div>
    </div>
  );
}
