import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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

  // destination for the inline Link
  const destination = isAuthenticated ? "/homepage" : "/login?message=success";

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1
        className="front-heading text-3xl mb-4 font-bold"
        style={{ fontFamily: "Fredoka" }}
      >
        Confirmation réussie 🎉
      </h1>

      <p className="mt-4">
        Votre compte a été activé. Vous allez être redirigé·e vers l'accueil.
      </p>

      <p className="mt-4 text-sm text-gray-500">
        Si la redirection ne fonctionne pas,&nbsp;
        <Link to={destination} className="underline">
          cliquez ici
        </Link>
        .
      </p>
    </div>
  );
}
