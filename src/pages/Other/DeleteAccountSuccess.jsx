import BackLink from "../../components/Common/BackLink";
import Button from "../../components/Common/Button";
import { useNavigate } from "react-router-dom";

export default function DeleteAccountSuccess() {
  const navigate = useNavigate();

  return (
    <div className="p-4 text-center">
      <div className="mb-2">
        <BackLink to="/" fixed />
      </div>

      <h1
        className="heading font-quicksand font-bold text-3xl mb-4"
        style={{ color: "#F4EBD6", fontFamily: "Fredoka" }}
      >
        Compte supprimé
      </h1>
      <p className="body-text">
        Ta demande de suppression a bien été enregistrée. Pour rappel, ton
        compte est d'abord
        <b> désactivé </b> et sera supprimé définitivement dans <b>30 jours</b>.
      </p>
      <p className="body-text mt-4">
        Si tu changes d'avis, reconnecte-toi avant la fin du délai pour
        restaurer ton compte.
      </p>

      <div className="mt-6 flex gap-3 justify-center">
        <Button onClick={() => navigate("/login")}>Se connecter</Button>
        <Button onClick={() => navigate("/register")} variant="ghost">
          S'inscrire
        </Button>
      </div>
    </div>
  );
}
