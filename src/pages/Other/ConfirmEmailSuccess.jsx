import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ConfirmEmailSuccess() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    const t = setTimeout(() => {
      if (isAuthenticated) {
        // Si l'utilisateur a été connecté automatiquement par le backend, le rediriger vers la page d'accueil
        navigate("/homepage", { replace: true });
      } else {
        navigate("/login?message=success", { replace: true });
      }
    }, 8000);
    return () => clearTimeout(t);
  }, [navigate, isAuthenticated]);

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-semibold">Confirmation réussie 🎉</h1>
      <p className="mt-4">
        Votre compte a été activé. Vous allez être redirigé·e vers l'accueil.
      </p>
      <p className="mt-4 text-sm text-gray-500">
        Si la redirection ne fonctionne pas,{" "}
        <button
          className="text-blue-600 underline"
          onClick={() =>
            isAuthenticated
              ? navigate("/homepage", { replace: true })
              : navigate("/login?message=success", { replace: true })
          }
        >
          cliquez ici
        </button>
        .
      </p>
    </div>
  );
}
