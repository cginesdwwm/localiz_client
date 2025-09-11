import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";

export default function ConfirmEmailError() {
  const navigate = useNavigate();
  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="front-heading mb-4">Erreur de confirmation</h1>
      <p className="mt-4">
        Une erreur est survenue lors de la confirmation. Vérifiez le lien ou
        contactez le support.
      </p>
      <div className="mt-6">
        <Button variant="cta" onClick={() => navigate("/")}>
          Accueil
        </Button>
      </div>
    </div>
  );
}
