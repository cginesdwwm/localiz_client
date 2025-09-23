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
    <main className="p-6 max-w-xl mx-auto text-center" role="main">
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
    </main>
  );
}
