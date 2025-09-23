import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useFocusHeading from "../../hooks/useFocusHeading";

export default function ConfirmEmailError() {
  const navigate = useNavigate();
  const headingRef = useRef(null);
  useDocumentTitle("Erreur de confirmation");
  useFocusHeading(headingRef);

  const goHome = () => navigate("/");

  return (
    <main className="p-6 max-w-xl mx-auto text-center" role="main">
      <h1
        className="front-heading text-3xl mb-4 font-bold"
        style={{ fontFamily: "Fredoka" }}
        ref={headingRef}
      >
        Erreur de confirmation
      </h1>

      <p className="mt-4">
        Une erreur est survenue lors de la confirmation. Vérifiez le lien ou
        contactez le support.
      </p>

      <div className="mt-6" role="group" aria-label="Actions disponibles">
        <Button variant="cta" onClick={goHome}>
          Accueil
        </Button>
      </div>
    </main>
  );
}
