import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";

export default function ConfirmEmailExpired() {
  const navigate = useNavigate();

  const handleRetry = () => navigate("/register");

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1
        className="front-heading text-3xl mb-4 font-bold"
        style={{ fontFamily: "Fredoka" }}
      >
        Lien expiré
      </h1>

      <p className="mt-4">
        Le lien de confirmation a expiré. Vous pouvez renvoyer un email de
        confirmation depuis la page d'inscription.
      </p>

      <div className="mt-6">
        <Button variant="cta" onClick={handleRetry}>
          Réessayer
        </Button>
      </div>
    </div>
  );
}
