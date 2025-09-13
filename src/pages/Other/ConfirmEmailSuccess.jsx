import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Common/Button";

export default function ConfirmEmailSuccess() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
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

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="front-heading mb-4">Confirmation réussie 🎉</h1>
      <p className="mt-4">
        Votre compte a été activé. Vous allez être redirigé·e vers l'accueil.
      </p>
      <p className="mt-4 text-sm text-gray-500">
        Si la redirection ne fonctionne pas,{" "}
        <Button
          variant="ghost"
          className="text-blue-600 underline p-0"
          onClick={() =>
            isAuthenticated
              ? navigate("/homepage", { replace: true })
              : navigate("/login?message=success", { replace: true })
          }
        >
          cliquez ici
        </Button>
        .
      </p>
    </div>
  );
}
